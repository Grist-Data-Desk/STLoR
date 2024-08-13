from datetime import datetime
import logging
from pathlib import Path
from typing import Literal

import geopandas as gpd
import pandas as pd

from stlor.config import SUPPLEMENTAL_STATE_TRUST_CONFIG
from stlor.constants import (
    OBJECT_ID,
    STATE,
    MANAGING_AGENCY,
    STATE_ENABLING_ACT,
    TRUST_NAME,
    RESERVATION_NAME,
    RIGHTS_TYPE,
    RIGHTS_TYPE_INFO,
    ACRES,
    GIS_ACRES,
    NET_ACRES,
    ACTIVITY,
    COUNTY,
    MERIDIAN,
    TOWNSHIP,
    RANGE,
    SECTION,
    ALIQUOT,
    LAYER,
    ACTIVITY_INFO_2,
    LEASE_STATUS,
    LESSEE,
    DATA_SOURCE,
    NAD_83_CONUS_ALBERS,
    GEOMETRY,
    SURFACE_RIGHTS_TYPE,
    SUBSURFACE_RIGHTS_TYPE,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

COLUMNS = [
    "object_id_LAST",
    OBJECT_ID,
    "OBJECTID",
    STATE,
    MANAGING_AGENCY,
    STATE_ENABLING_ACT,
    TRUST_NAME,
    RESERVATION_NAME,
    RIGHTS_TYPE,
    RIGHTS_TYPE_INFO,
    ACRES,
    GIS_ACRES,
    NET_ACRES,
    ACTIVITY,
    COUNTY,
    MERIDIAN,
    TOWNSHIP,
    RANGE,
    SECTION,
    ALIQUOT,
    LAYER,
    ACTIVITY_INFO_2,
    LEASE_STATUS,
    LESSEE,
    DATA_SOURCE,
    GEOMETRY,
]


def filter_by_intersection(stl_gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Obtain the subset of STLs that intersect with the BIA-AIAN supplemetal
    layer.

    Arguments:
    stl_gdf - the GeoDataFrame containing trust lands for a given state

    Returns:
    gpd.GeoDataFrame - the subset of a state's trust lands that intersect with
    the BIA-AIAN supplemental layer, with attached information on the intersect-
    ed reservation
    """
    # Reproject both GeoDataFrames to NAD83 Conus Albers.
    stl_gdf = stl_gdf.to_crs(NAD_83_CONUS_ALBERS)

    # Load the BIA-AIAN supplemental layer.
    bia_path = Path(
        "public_data/00_Reservation Layer/BIA_Supplemental.geojson"
    ).resolve()
    bia_gdf = gpd.read_file(bia_path).to_crs(NAD_83_CONUS_ALBERS)

    # Perform the spatial join, which by default is an inner join using an
    # "intersects" predicate. Intersection implies overlap and containment, so
    # we only need to check for this spatial relationship.
    stl_gdf = stl_gdf.sjoin(bia_gdf).reset_index(drop=True)

    return stl_gdf


def locate_supplemental_stls(
    state: Literal["CO"] | Literal["NM"],
    rights_type: Literal["surface"] | Literal["subsurface"],
) -> gpd.GeoDataFrame:
    """Locate STLs that intersect with the BIA-AIAN supplemental layer.

    Arguments:
    state - the state to locate trust lands for
    rights_type - the rights_type of trust lands to locate
    """
    path = SUPPLEMENTAL_STATE_TRUST_CONFIG[state][rights_type]["path"]

    stl_path = Path(path).resolve()
    stl_gdf = gpd.read_file(stl_path)

    return filter_by_intersection(stl_gdf)


def clean_supplemental_stls(
    stl_gdf: gpd.GeoDataFrame,
    state: Literal["CO"] | Literal["NM"],
    rights_type: Literal["surface"] | Literal["subsurface"],
) -> gpd.GeoDataFrame:
    # Apply all column-level transformations.
    transforms = SUPPLEMENTAL_STATE_TRUST_CONFIG[state][rights_type][
        "columns_transforms"
    ]
    for col, transform in transforms.items():
        stl_gdf[col] = transform(stl_gdf)

    # Rename specific columns.
    columns_mapper = SUPPLEMENTAL_STATE_TRUST_CONFIG[state][rights_type][
        "columns_mapper"
    ]
    stl_gdf = stl_gdf.rename(columns=columns_mapper)

    # Add additional columns.
    for col, val in SUPPLEMENTAL_STATE_TRUST_CONFIG[state][rights_type][
        "columns_additions"
    ].items():
        stl_gdf[col] = val

    return stl_gdf


CO_OBJECTID_COUNTER = 18


def dissolve_co_supplemental_stls(co_gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Clean the Colorado STLs that intersect with the BIA-AIAN supplemental
    layer.

    Arguments:
    co_gdf - the GeoDataFrame containing trust lands for Colorado
    rights_type - the rights_type of trust lands to clean (either "surface" or
    "subsurface")

    Returns:
    gpd.GeoDataFrame - the cleaned subset of Colorado's trust lands that inter-
    sect with the BIA-AIAN supplemental layer for the given rights_type
    """
    # Dissolve the GeoDataFrame by Township, Range, and Section to remove any
    # duplicate geometries. For CO, ther are four parcels with identical geom-
    # etries that can be dissolved into a single surface and subsurface parcel.
    global CO_OBJECTID_COUNTER

    aggfuncs = {
        "Asset_Laye": lambda x: ",".join(x.unique()),
    }
    for col in co_gdf.columns:
        if col not in aggfuncs and col != GEOMETRY:
            aggfuncs[col] = "first"
    co_gdf = co_gdf.dissolve(
        by=["Township", "Range", "Section"], aggfunc=aggfuncs
    ).reset_index(drop=True)
    co_gdf["OBJECTID"] = [
        str(i) for i in range(CO_OBJECTID_COUNTER, CO_OBJECTID_COUNTER + len(co_gdf))
    ]
    CO_OBJECTID_COUNTER += len(co_gdf)

    return co_gdf


def process_supplemental_stls(
    state: Literal["CO"] | Literal["NM"] | Literal["ND"],
    rights_type: Literal["surface"] | Literal["subsurface"],
) -> gpd.GeoDataFrame:
    """Process the supplemental STLs for a given state and rights_type.

    Arguments:
    state - the state to process supplemental STLs for
    rights_type - the rights_type of STLs to process

    Returns:
    gpd.GeoDataFrame - the processed supplemental STLs for the given state and
    rights_type
    """
    logger.info(
        f"Processing {rights_type} STLs in {state} intersecting BIA-AIAN supplemental layer."
    )
    start_time = datetime.now()

    gdf = locate_supplemental_stls(state=state, rights_type=rights_type)

    if state == "CO":
        gdf = dissolve_co_supplemental_stls(gdf)
    gdf = clean_supplemental_stls(gdf, state=state, rights_type=rights_type)

    logger.info(
        f"{state} {rights_type} STL processing completed in {datetime.now() - start_time}."
    )
    logger.info(f"{state} {rights_type} STLs row count: {len(gdf)}")

    return gdf


def concatenate_supplemental_stls(
    gdfs: list[gpd.GeoDataFrame],
) -> gpd.GeoDataFrame:
    """Concatenate the processed supplemental STLs for all states and rights_types.

    Arguments:
    gdfs - the list of processed supplemental STLs for all states and rights_types

    Returns:
    gpd.GeoDataFrame - the concatenated GeoDataFrame containing all processed
    supplemental STLs
    """
    gdf = gpd.GeoDataFrame(pd.concat(gdfs, ignore_index=True))

    stl_gdf = gpd.read_file(
        Path("public_data/04_All States/02_SendtoActivityMatch.geojson").resolve()
    )
    highest_objectid = stl_gdf["object_id_LAST"].max()
    gdf["object_id_LAST"] = [
        i for i in range(highest_objectid + 1, highest_objectid + 1 + len(gdf))
    ]

    # Subset to the final columns.
    gdf = gdf[COLUMNS]

    return gdf


def main():
    logger.info("Beginning supplemental STL processing.")

    states = SUPPLEMENTAL_STATE_TRUST_CONFIG.keys()
    rights_types = [SURFACE_RIGHTS_TYPE, SUBSURFACE_RIGHTS_TYPE]

    combinations = [
        (state, rights_type) for state in states for rights_type in rights_types
    ]
    gdfs = [
        process_supplemental_stls(state, rights_type)
        for state, rights_type in combinations
    ]

    gdf = concatenate_supplemental_stls(gdfs)

    logger.info(
        "Writing supplemental layer processing output to 01d_Supplemental.geojson."
    )
    gdf.to_file("public_data/04_All States/01d_Supplemental.geojson", driver="GeoJSON")

    logger.info("Supplemental STL processing completed.")


if __name__ == "__main__":
    main()
