import logging
from pathlib import Path

import geopandas as gpd

from stlor.constants import (
    NAD_83_CONUS_ALBERS,
    SQUARE_METERS_PER_ACRE,
    CLIPPED_ACRES,
    STATE,
    RESERVATION_NAME,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def clip_to_reservation_boundaries(stl_gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Clip state trust lands to reservation boundaries.

    Arguments:
    stl_gdf -- the state trust lands GeoDataFrame

    Returns:
    gpd.GeoDataFrame -- the clipped state trust lands GeoDataFrame
    """
    reservations_gdf = gpd.read_file(
        Path("public_data/00_Reservation Layer/BIA_AIAN+OK_Fixed.geojson").resolve()
    )
    supp_reservations_gdf = gpd.read_file(
        Path("public_data/00_Reservation Layer/BIA-supp.geojson").resolve()
    )

    # Reproject all GeoDataFrames to NAD83 Conus Albers.
    logger.info("Reprojecting STL and BIA_AIAN GeoDataFrames to NAD83 Conus Albers.")
    stl_gdf = stl_gdf.to_crs(NAD_83_CONUS_ALBERS)
    reservations_gdf = reservations_gdf.to_crs(NAD_83_CONUS_ALBERS)
    supp_reservations_gdf = supp_reservations_gdf.to_crs(NAD_83_CONUS_ALBERS)

    # Union the reservations_gdf and supp_reservations_gdf to a single layer in
    # prepartion for the clipping operation.
    logger.info("Unioning the BIA_AIAN primary and supplemental GeoDataFrames.")
    reservations_gdf = reservations_gdf.overlay(supp_reservations_gdf, how="union")

    logger.info("Clipping the STL GeoDataFrame to reservation boundaries.")
    stl_gdf = stl_gdf.clip(reservations_gdf)

    logger.info("Calculating the area of the clipped state trust lands.")
    stl_gdf[CLIPPED_ACRES] = (stl_gdf.area / SQUARE_METERS_PER_ACRE).round(2)

    return stl_gdf


def filter_parcels_by_acreage(stl_gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Filter parcels with either of the following characteristics:

        1. "clipped_acres" < 10.0
            - Note that this includes parcels with "clipped_acres" equal to 0.0.
        2. WY parcels with "reservation_name" == "Crow"

    Arguments:
    stl_gdf -- the state trust lands GeoDataFrame

    Returns:
    gpd.GeoDataFrame -- the filtered state trust lands GeoDataFrame
    """
    stl_gdf = stl_gdf[
        (stl_gdf[CLIPPED_ACRES] >= 10.0)
        & ~((stl_gdf[STATE] == "WY") & (stl_gdf[RESERVATION_NAME] == "Crow"))
    ]

    return stl_gdf
