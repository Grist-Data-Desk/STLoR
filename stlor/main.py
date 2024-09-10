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
    concatenate_activity_info,
)
from stlor.clip import clip_to_reservation_boundaries, filter_parcels_by_acreage
from stlor.config import STATE_ACTIVITIES
from stlor.constants import (
    ACTIVITY_INFO,
    ACTIVITY_INFO_2,
    ACTIVITY,
    FINAL_DATASET_COLUMNS,
    OBJECT_ID,
    RIGHTS_TYPE,
    LESSEE,
    WGS_84,
)
from stlor.entities import StateActivityDataSource
from stlor.lessee import parse_lessee
from stlor.overlap import tree_based_proximity
from stlor.utils import in_parallel, combine_delim_list

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def concatenate_main_and_supplemental_stls(
    stl_gdf: gpd.GeoDataFrame,
) -> gpd.GeoDataFrame:
    """Concatenate the main and supplemental state trust lands datasets.

    Arguments:
    stl_gdf -- the state trust lands GeoDataFrame

    Returns:
    gpd.GeoDataFrame -- the concatenation of the state trust lands GeoDataFrame
    with state trust lands identified from the BIA-AIAN supplemental dataset and
    Nebraska subsurface data
    """
    supplemental_stl_gdf = gpd.read_file(
        Path("public_data/04_All States/01d_Supplemental.geojson").resolve()
    )
    ne_subsurface_gdf = gpd.read_file(
        Path("public_data/04_All States/01e_Nebraska_Subsurface.geojson").resolve()
    )

    return gpd.GeoDataFrame(
        pd.concat([stl_gdf, supplemental_stl_gdf, ne_subsurface_gdf], ignore_index=True)
    )


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
    stl_gdf -- the state trust lands GeoDataFrame
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
    stl_gdf -- the state trust lands GeoDataFrame

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


def remove_timber_rows(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Remove STLs with timber rights from the dataset.

    Arguments:
    gdf -- the state trust lands GeoDataFrame

    Returns:
    gpd.GeoDataFrame -- the state trust lands GeoDataFrame with timber parcels
    removed"""
    return gdf[gdf[RIGHTS_TYPE].str.lower() != "timber"]


def remove_river_slivers(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Remove STLs with navigable river and streambed trust beneficiaries on
    borders.

    Arguments:
    gdf -- the state trust lands GeoDataFrame

    Returns:
    gpd.GeoDataFrame -- the state trust lands GeoDataFrame with border river
    parcels removed"""

    border_rivers = [
        # Blackfeet
        12031,
        # Fort Peck
        11931,
        11799,
        12096,
        12099,
        11937,
        11824,
        12098,
        11930,
        11934,
        11936,
        12097,
        11933,
        11932,
        11926,
        11927,
        11836,
        12084,
        11830,
        11829,
        11834,
        11833,
        11832,
        # Fort Yuma (Quechan)
        589,
        588,
        594,
        # Spokane
        33924,
    ]

    return gdf[~gdf["object_id_LAST"].isin(border_rivers)]


def join_activity_info(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Join the activity_info and activity_info_2 columns into a single column.

    Arguments:
    gdf -- the state trust lands GeoDataFrame

    Returns:
    gpd.GeoDataFrame -- the state trust lands GeoDataFrame with a cleaned
    activity_info column
    """
    gdf[ACTIVITY_INFO] = gdf.apply(concatenate_activity_info, axis=1)
    gdf = gdf.drop(ACTIVITY_INFO_2, axis=1)

    return gdf


def write_gdf_to_disk(gdf: gpd.GeoDataFrame, output_dir: Path, filename: str):
    """Write a GeoDataFrame to disk on GeoJSON (EPSG:5070), GeoJSON (EPSG:4326),
    CSV, and XLSX formats.

    Arguments:
    gdf -- the GeoDataFrame to write to disk
    output_dir -- the directory for the output files
    filename -- the name of the output file

    Returns:
    None

    Side effects:
    Writes the GeoDataFrame to disk
    """
    gdf.to_file(output_dir / f"{filename}.geojson", driver="GeoJSON")
    gdf.to_crs(WGS_84).to_file(
        output_dir / f"{filename}_WGS84.geojson", driver="GeoJSON"
    )
    gdf.to_csv(output_dir / f"{filename}.csv", index=False)
    gdf.to_excel(output_dir / f"{filename}.xlsx", index=False)


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
    logger.info(f"Reading STLoR data from: {stl_path}")
    stl_gdf = gpd.read_file(stl_path)

    # Concatenate this dataframe with the supplemental STLs derived from
    # supplemental.py and the Nebraska subsurface parcels in 01e_Nebraska_Subsurface.
    logger.info("Concatenating main and supplemental state trust lands datasets.")
    stl_gdf = concatenate_main_and_supplemental_stls(stl_gdf)

    logger.info(f"Initial STLoR row count: {stl_gdf.shape[0]}")

    # Obtain the initial columns from the STL GeoDataFrame.
    cols = stl_gdf.columns.tolist()

    # Add the activity info column to the list of STL GeoDataFrame columns.
    rights_type_idx = cols.index(RIGHTS_TYPE)
    cols.insert(rights_type_idx + 2, ACTIVITY_INFO)

    # Run the primary matching process.
    stl_data_update, activity_info_update = match_activities(activities_dir, stl_gdf)

    # Push updates from the matching process to the STL GeoDataFrame.
    for row_idx, activity_list in stl_data_update.items():
        if not activity_list:
            continue
        new_activity = ",".join([x for x in activity_list if x is not None])
        existing_activity = stl_gdf.loc[row_idx, ACTIVITY] or ""
        stl_gdf.loc[row_idx, ACTIVITY] = combine_delim_list(
            existing_activity,
            new_activity,
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

    # Reorder and select columns from the original STL GeoDataFrame.
    stl_gdf = stl_gdf[cols]

    # Remove timber parcels from the dataset.
    stl_gdf = remove_timber_rows(stl_gdf)
    logger.info(f"STLoR row count after removing timber parcels: {stl_gdf.shape[0]}")

    # Remove borderline river parcels from the dataset.
    stl_gdf = remove_river_slivers(stl_gdf)
    logger.info(
        f"STLoR row count after removing river sliver polygons: {stl_gdf.shape[0]}"
    )

    # Write the output of the activity match process to disk.
    logger.info("Writing activity match output to 03_ActivityMatch.{csv,xlsx,geojson}")
    write_gdf_to_disk(stl_gdf, output_dir, filename="03_ActivityMatch")

    # Clip the state trust lands to reservation boundaries.
    logger.info("Clipping state trust lands to reservation boundaries.")
    start_time = datetime.now()
    stl_gdf = clip_to_reservation_boundaries(stl_gdf)
    logger.info(
        f"Clipping state trust lands to reservation boundaries took {datetime.now() - start_time}"
    )

    # Write the clipped state trust lands to disk.
    logger.info("Writing clipped state trust lands to 04_Clipped.{csv,xlsx,geojson}")
    write_gdf_to_disk(stl_gdf, output_dir, filename="04_Clipped")

    # Filter parcels by acreage.
    logger.info("Filtering parcels to those with acreage greater than 10.")
    stl_gdf = filter_parcels_by_acreage(stl_gdf)

    # Write the filtered state trust lands to disk.
    logger.info(
        "Writing filtered state trust lands to 05_AcreageGreaterThan10.{csv,xlsx,geojson}"
    )
    write_gdf_to_disk(stl_gdf, output_dir, filename="05_AcreageGreaterThan10")

    # Clean up the activity_info and object_id columns and select a subset of
    # columns for the final dataset.
    logger.info("Cleaning up activity_info and object_id columns.")
    stl_gdf = join_activity_info(stl_gdf)
    stl_gdf[LESSEE] = stl_gdf[ACTIVITY_INFO].apply(parse_lessee)
    stl_gdf[OBJECT_ID] = stl_gdf["object_id_LAST"]
    stl_gdf = stl_gdf[FINAL_DATASET_COLUMNS]

    # Write the final dataset to disk.
    logger.info(
        "Writing final dataset to 06_All-STLs-on-Reservations-Final.{csv,xlsx,geojson}"
    )
    write_gdf_to_disk(stl_gdf, output_dir, filename="06_All-STLs-on-Reservations-Final")

    # Copy the final dataset to 05_Final-Dataset.
    logger.info(
        "Copying final dataset to public_data/05_Final-Dataset/02_All-STLs-on-Reservations.{csv,xlsx,geojson}"
    )
    write_gdf_to_disk(
        stl_gdf,
        Path("public_data/05_Final-Dataset").resolve(),
        filename="02_All-STLs-on-Reservations",
    )

    logger.info(f"Final STLoR row count: {stl_gdf.shape[0]}")


def run():
    """Run the activity match, parcel clipping, and parcel filtering processes."""
    logger.info(
        "Running activity match, parcel clipping, and parcel filtering processes."
    )

    activities_dir = Path("data/stl_activity_layers").resolve()
    stl_path = Path(
        "public_data/04_All States/02_SendtoActivityMatch.geojson"
    ).resolve()
    output_dir = Path("public_data/04_All States").resolve()

    main(activities_dir, stl_path, output_dir)

    logger.info("All processes complete.")


if __name__ == "__main__":
    run()
