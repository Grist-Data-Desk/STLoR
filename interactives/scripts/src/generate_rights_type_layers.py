from pathlib import Path

import geopandas as gpd


def main():
    gdf = gpd.read_file(Path("data/processed/stlors.geojson").resolve())

    # Split the GeoDataFrame by rights type.
    surface_gdf = gdf[gdf["rights_type"] == "surface"]
    subsurface_gdf = gdf[gdf["rights_type"] == "subsurface"]

    # Find the intersection of the two GeoDataFrames.
    surface_subsurface_gdf = surface_gdf.overlay(subsurface_gdf, how="intersection")

    # Find the difference of the two GeoDataFrames.
    surface_only_gdf = surface_gdf.overlay(subsurface_gdf, how="difference")
    subsurface_only_gdf = subsurface_gdf.overlay(surface_gdf, how="difference")

    # Save the GeoDataFrames to GeoJSON files.
    surface_subsurface_gdf.to_file(
        "data/processed/surface-subsurface.geojson", driver="GeoJSON"
    )
    surface_only_gdf.to_file("data/processed/surface.geojson", driver="GeoJSON")
    subsurface_only_gdf.to_file("data/processed/subsurface.geojson", driver="GeoJSON")


if __name__ == "__main__":
    main()
