from collections import defaultdict
from datetime import datetime
from functools import partial
import logging
from pathlib import Path
import sys

import geopandas as gpd
import pandas as pd

from stlor.activity import (
    get_activity_name,
    is_compatible_activity,
    exclude_inactive,
    capture_lessee_and_lease_type,
)
from stlor.config import STATE_ACTIVITIES
from stlor.constants import ACTIVITY_INFO, WGS_84, RIGHTS_TYPE, ACTIVITY
from stlor.entities import StateActivityDataSource
from stlor.overlap import tree_based_proximity
from stlor.utils import in_parallel, combine_delim_list

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def process_state_activity(
    activities_dir: Path,
    stl_gdf: gpd.GeoDataFrame,
    state: str,
    activity: StateActivityDataSource,
) -> dict:
    """Locate matches between state trust lands and a specific land use activity.

    This function makes use of our tree_based_proximity function, which uses
    R-tree spatial indexes to efficiently identify matches bewteen parcels and
    a given land use activity.

    Arguments:
    activities_dir -- the directory containing state activity layers
    stl_gdf -- the state trust lands dataset
    state -- the activity's associated state abbreviation
    activity -- the activity data source

    Returns:
    dict -- a dictionary of STL parcel row indices mapped to tuples containing
    the matched activity name and activity information
    """
    # Load the activity data for the given StateActivityDataSource.
    activity_gdf = activity.query_data(activities_dir)

    if activity_gdf is None or len(activity_gdf) == 0:
        logger.error(
            f"No activity data found for state: {state} and activity: {activity.name}"
        )

    # Use our R-tree spatial index to find matches between STL parcels and the
    # given StateActivityDataSource.
    matches = tree_based_proximity(stl_gdf, activity_gdf, stl_gdf.crs)

    rewrite_list = {
        "OtherMin": "Other Minerals",
        "OilGas": "Oil & Gas",
        "OilAndGas": "Oil & Gas",
    }
    update = defaultdict(set)

    # Iterate over the matches and capture the activity name and information.
    # Filter out incompatible activities, as well as select parcels with certain
    # activity statuses.
    for _, parcel_index, parcel, activity_row, contains, _ in matches:
        activity_name = get_activity_name(state, activity, pd.DataFrame([activity_row]))

        if activity_name in rewrite_list:
            activity_name = rewrite_list[activity_name]

        if contains and is_compatible_activity(parcel, activity, activity_name, state):
            if exclude_inactive(state, activity_row):
                continue

            activity_info = capture_lessee_and_lease_type(
                activity_row, activity, activity_name, state
            )

            update[parcel_index].add((activity_name, activity_info))

    return update


def match_activities(
    activities_dir: Path, stl_gdf: gpd.GeoDataFrame
) -> tuple[dict, dict]:
    """Accumulate matches between state trust lands and land use activities.

    Arguments:
    activities_dir -- the directory containing state activity layers
    stl_gdf -- the state trust lands dataset

    Returns:
    tuple[dict, dict] -- a tuple containing (1) a dictionary of STL parcel row
    indices mapped to matching activity information and (2) a dictionary of STL
    parcel row indices mapped to matching activity information strings
    """
    stl_data_update = defaultdict(set)
    activity_info_update = defaultdict(set)

    logger.info(
        f"Running activity match for states: {','.join(STATE_ACTIVITIES.keys())}"
    )

    for state, state_activities in STATE_ACTIVITIES.items():
        logger.info(f"Running activity match for {state}")

        start_time = datetime.now()
        results = in_parallel(
            state_activities.activities,
            partial(process_state_activity, activities_dir, stl_gdf, state),
        )
        logger.info(f"Activity match for {state} took {datetime.now() - start_time}")

        for result in results:
            if result is not None and len(result) > 0:
                for row_idx, activity_bundle in result.items():
                    for activity_name, activity_info in activity_bundle:
                        if any(i is None for i in activity_name):
                            logger.error(f"Activity is None for {state}")
                            sys.exit(1)

                        stl_data_update[row_idx].add(activity_name)
                        activity_info_update[row_idx].add(activity_info)

    return stl_data_update, activity_info_update


def main(activities_dir: Path, stl_path: Path, output_dir: Path):
    """Match state trust lands parcels to land use activities.

    Arguments:
    activities_dir -- the directory containing state activity layers
    stl_path -- the path to the state trust lands dataset
    output_dir -- the directory to write the output files

    Returns:
    None

    Side effects:
    Writes the output of the activity match process to output_dir
    """
    logger.info(f"Reading STLOR data from: {stl_path}")
    stl_gdf = gpd.read_file(stl_path)

    # Obtain the initial columns from the STL dataset.
    cols = stl_gdf.columns.tolist()

    # Add the activity info column to the list of STL dataset columns.
    rights_type_idx = cols.index(RIGHTS_TYPE)
    cols.insert(rights_type_idx + 2, ACTIVITY_INFO)

    # Run the primary matching process.
    stl_data_update, activity_info_update = match_activities(activities_dir, stl_gdf)

    # Push updates from the matching process to the STL dataset.
    for row_idx, activity_list in stl_data_update.items():
        if not activity_list:
            continue
        new_activity = ",".join([x for x in activity_list if x is not None])
        existing_activity = stl_gdf.loc[row_idx, ACTIVITY] or ""
        stl_gdf.loc[row_idx, ACTIVITY] = combine_delim_list(
            existing_activity, new_activity, sep=","
        )

    stl_gdf[ACTIVITY_INFO] = ""
    for row_idx, activity_info in activity_info_update.items():
        if not activity_info:
            continue
        new_activity_info = "\n".join([x for x in activity_info if x is not None])
        existing_activity_info = stl_gdf.loc[row_idx, ACTIVITY_INFO] or ""
        stl_gdf.loc[row_idx, ACTIVITY_INFO] = combine_delim_list(
            existing_activity_info, new_activity_info, sep="\n"
        )

    # Reorder and select columns from the original STL dataset.
    stl_gdf = stl_gdf[cols]

    logger.info(f"Final STLOR row count: {stl_gdf.shape[0]}")
    stl_gdf.to_csv(output_dir / "03_ActivityMatch_test.csv", index=False)
    stl_gdf.to_excel(output_dir / "03_ActivityMatch_test.xlsx", index=False)
    stl_gdf.to_file(output_dir / "03_ActivityMatch_test.geojson", driver="GeoJSON")

    # Additionally, create a version of the dataset in WGS84 for visualization.
    stl_gdf_wgs84 = stl_gdf.to_crs(WGS_84)
    stl_gdf_wgs84.to_file(
        output_dir / "03_ActivityMatch_WGS84_test.geojson",
        driver="GeoJSON",
    )


def run():
    """Run the activity match process."""
    logger.info("Running activity match.")

    activities_dir = Path("data/stl_dataset").resolve()
    stl_path = Path(
        "public_data/04_All States/02_SendtoActivityMatch.geojson"
    ).resolve()
    output_dir = Path("public_data/04_All States").resolve()

    main(activities_dir, stl_path, output_dir)

    logger.info("Activity match complete.")


if __name__ == "__main__":
    run()
