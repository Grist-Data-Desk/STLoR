import logging
from pathlib import Path
from typing import Literal

import geopandas as gpd
import numpy as np
import pandas as pd

from stlor.constants import NAD_83_CONUS_ALBERS, SQUARE_METERS_PER_ACRE, WGS_84

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def dissolve_by_reservation_name(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Dissolve STLs by reservation name and compute aggregates on trust_name,
    rights_type, gis_acres, and clipped_acres.

    Arguments:
    stl_gdf {gpd.GeoDataFrame} -- the state trust land GeoDataFrame

    Returns:
    gpd.GeoDataFrame -- the state trust land GeoDataFrame dissolved by
    reservation_name
    """
    agg_funcs = {
        "reservation_name": "first",
        "state": "first",
        "trust_name": lambda trust: trust.unique(),
        "rights_type": lambda rights: rights.unique(),
        "gis_acres": "sum",
        "clipped_acres": "sum",
        "object_id": "count",  # Use object_id as a unique field to count parcels.
    }

    return gdf.dissolve(by="reservation_name", aggfunc=agg_funcs).reset_index(drop=True)


def filter_by_rights_type(
    stl_gdf: gpd.GeoDataFrame,
    rights_type: Literal[
        "surface",
        "subsurface",
    ],
) -> gpd.GeoDataFrame:
    """Filter the state trust land GeoDataFrame by rights_type.

    Arguments:
    stl_gdf {gpd.GeoDataFrame} -- the state trust land GeoDataFrame
    rights_type {Literal["surface", "subsurface"]} --
    the rights_type of parcels to filter by

    Returns:
    gpd.GeoDataFrame -- the state trust land GeoDataFrame filtered by
    rights_type
    """
    return stl_gdf[stl_gdf["rights_type"].str.lower() == rights_type]


def rename_columns_by_rights_type(
    gdf: gpd.GeoDataFrame,
    rights_type: Literal[
        "surface",
        "subsurface",
    ],
) -> gpd.GeoDataFrame:
    """Rename gis_acres and clipped_acres columns in a GeoDataFrame to their
    rights_type-specific equivalents.

    Arguments:
    gdf {gpd.GeoDataFrame} -- the GeoDataFrame
    rights_type {Literal["surface", "subsurface"]} --
    the rights_type to use for column renaming

    Returns:
    gpd.GeoDataFrame -- the GeoDataFrame with columns renamed to rights_type-
    specific equivalents
    """
    gdf = gdf.rename(
        columns={
            "gis_acres": f"{rights_type}_gis_acres",
            "clipped_acres": f"{rights_type}_clipped_acres",
        }
    )

    return gdf


def subset_columns_by_rights_type(
    gdf: gpd.GeoDataFrame,
    rights_type: Literal["surface", "subsurface"],
) -> gpd.GeoDataFrame:
    """Subset a GeoDataFrame by rights_type-specific columns.

    Arguments:
    gdf {gpd.GeoDataFrame} -- the GeoDataFrame
    rights_type {Literal["surface", "subsurface"]} --
    the rights_type to use for column subsetting

    Returns:
    gpd.GeoDataFrame -- the GeoDataFrame subsetted by rights_type-specific equi-
    valents
    """
    return gdf[
        [
            "reservation_name",
            f"{rights_type}_gis_acres",
            f"{rights_type}_clipped_acres",
            "object_id",
            "geometry",
        ]
    ]


def add_parcel_count(gdf: gpd.GeoDataFrame, rights_type=None) -> gpd.GeoDataFrame:
    """Add a count column to a GeoDataFrame, using a rights_type-specific prefix
    if provided.

    Arguments:
    gdf {gpd.GeoDataFrame} -- the GeoDataFrame
    rights_type {str} -- the rights_type to use for column prefix naming

    Returns:
    gpd.GeoDataFrame -- the GeoDataFrame with a count column added
    """
    prefix = f"{rights_type}_" if rights_type else ""
    gdf[f"{prefix}parcel_count"] = gdf["object_id"]
    gdf = gdf.drop(columns="object_id")

    return gdf


def compute_rights_type_aggregate_gdf(
    stl_gdf: gpd.GeoDataFrame, rights_type: Literal["surface", "subsurface"]
) -> gpd.GeoDataFrame:
    """Compute aggregate statistics for the state trust lands GeoDataFrame based
    on rights_type.

    Arguments:
    gdf {gpd.GeoDataFrame} -- the state trust lands GeoDataFrame
    rights_type {Literal["surface", "subsurface"]} -- the rights_type to use for
    column naming

    Returns:
    gpd.GeoDataFrame -- the GeoDataFrame with aggregates computed on gis_acres
    and clipped_acres
    """
    gdf = filter_by_rights_type(stl_gdf, rights_type)
    gdf = dissolve_by_reservation_name(gdf)
    gdf = rename_columns_by_rights_type(gdf, rights_type)
    gdf = subset_columns_by_rights_type(gdf, rights_type)
    gdf = add_parcel_count(gdf, rights_type)

    return gdf


def compute_reservation_area() -> pd.DataFrame:
    """Compute the area of each reservation in acres.

    Returns:
    pd.DataFrame -- a DataFrame containing reservation names and areas, in acres
    """
    bia_aian_gdf = gpd.read_file(
        Path("public_data/00_Reservation Layer/BIA_AIAN+OK_Fixed.geojson").resolve()
    ).to_crs(NAD_83_CONUS_ALBERS)
    bia_aian_supplemental_gdf = gpd.read_file(
        Path("public_data/00_Reservation Layer/BIA_Supplemental.geojson").resolve()
    ).to_crs(NAD_83_CONUS_ALBERS)

    # Union the two GeoDataFrames, pulling the reservation_name from LARNAME for
    # the primary layer and LANDAREA for the supplemental layer.
    reservations_gdf = bia_aian_gdf.overlay(bia_aian_supplemental_gdf, how="union")
    reservations_gdf["reservation_name"] = np.where(
        reservations_gdf["LARNAME"].notnull(),
        reservations_gdf["LARNAME"],
        reservations_gdf["LANDAREA"],
    )

    # Dissolve by reservation_name. Some reservations have multiple associated
    # polygons–from the primary layer and the Tribal Statistical Areas layer,
    # respectively—so dissolve ensures we return a single record per tribe.
    reservations_gdf = reservations_gdf.dissolve(
        by="reservation_name", aggfunc={"reservation_name": "first"}
    ).reset_index(drop=True)
    reservations_gdf["reservation_acres"] = (
        reservations_gdf.area / SQUARE_METERS_PER_ACRE
    ).round(2)
    reservations_df = pd.DataFrame(
        reservations_gdf[["reservation_name", "reservation_acres"]]
    )

    return reservations_df


def main():
    logger.info("Aggregating STLs by reservation.")
    stl_gdf = gpd.read_file(
        Path(
            "public_data/04_All States/06_All-STLs-on-Reservations-Final.geojson"
        ).resolve()
    )

    reservations_agg_gdf = dissolve_by_reservation_name(stl_gdf)
    logger.info(f"Reservations with STLs count: {len(reservations_agg_gdf)}")

    reservations_agg_gdf = add_parcel_count(reservations_agg_gdf)

    # Compute aggregates for surface and subsurface rights.
    logger.info(
        "Computing aggregates for surface and subsurface parcels by reservation."
    )
    surface_reservations_agg_gdf = compute_rights_type_aggregate_gdf(stl_gdf, "surface")
    subsurface_reservations_agg_gdf = compute_rights_type_aggregate_gdf(
        stl_gdf, "subsurface"
    )

    # Join all aggregates.
    logger.info("Joining aggregates by reservation.")
    reservations_agg_gdf = reservations_agg_gdf.merge(
        pd.DataFrame(surface_reservations_agg_gdf.drop(columns="geometry")),
        on="reservation_name",
        how="left",
    )
    reservations_agg_gdf = reservations_agg_gdf.fillna(
        value={
            "surface_gis_acres": 0,
            "surface_clipped_acres": 0,
            "surface_parcel_count": 0,
        }
    ).astype({"surface_parcel_count": int})
    reservations_agg_gdf = reservations_agg_gdf.merge(
        pd.DataFrame(subsurface_reservations_agg_gdf.drop(columns="geometry")),
        on="reservation_name",
        how="left",
    )
    reservations_agg_gdf = reservations_agg_gdf.fillna(
        value={
            "subsurface_gis_acres": 0,
            "subsurface_clipped_acres": 0,
            "subsurface_parcel_count": 0,
        }
    ).astype({"subsurface_parcel_count": int})

    # Join data on reservation area.
    reservations_agg_gdf = reservations_agg_gdf.merge(
        compute_reservation_area(), on="reservation_name", how="left"
    )

    # Save to file.
    logger.info(
        "Writing aggregations to 05_Final-Dataset/01_STLs-on-Reservations-by-Reservation.{geojson,csv,xlsx}"
    )
    output_dir = Path("public_data/05_Final-Dataset/").resolve()
    filename = "01_STLs-on-Reservations-by-Reservation"
    reservations_agg_gdf.to_file(output_dir / f"{filename}.geojson", driver="GeoJSON")
    reservations_agg_gdf.to_crs(WGS_84).to_file(
        output_dir / f"{filename}_WGS84.geojson", driver="GeoJSON"
    )
    reservations_agg_gdf.to_csv(output_dir / f"{filename}.csv", index=False)
    reservations_agg_gdf.to_excel(output_dir / f"{filename}.xlsx", index=False)

    logger.info("Completed aggregation of STLs by reservation.")


if __name__ == "__main__":
    main()
