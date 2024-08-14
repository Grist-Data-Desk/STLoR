import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as url from "node:url";

import type { FeatureCollection, Feature, Polygon } from "geojson";
import { featureCollection } from "@turf/helpers";

import type { LandUse, ParcelProperties, LandUseMapping } from "./types";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

/**
 * Enrich a parcel with information on the activity's land use category.
 *
 * @param {Feature<Polygon, ParcelProperties>} parcel – The parcel to add land
 * use category information to.
 * @param {LandUseMapping[]} landUseMappings – The list of mappings from raw activity strings to their
 * land use categories.
 * @returns – The parcel with land use category information added.
 */
function enrichParcelWithLandUse(
  parcel: Feature<Polygon, ParcelProperties>,
  landUseMappings: LandUseMapping[]
): Feature<Polygon, ParcelProperties & { land_use: LandUse[] }> {
  const activity = parcel.properties.activity;

  if (!activity) {
    return {
      ...parcel,
      properties: {
        ...parcel.properties,
        land_use: ["Uncategorized"],
      },
    };
  }

  const match = landUseMappings.find((entry) => entry.activity === activity);

  if (!match) {
    console.warn(`No land use found for activity: ${activity}`);

    return {
      ...parcel,
      properties: {
        ...parcel.properties,
        land_use: ["Uncategorized"],
      },
    };
  }

  return {
    ...parcel,
    properties: {
      ...parcel.properties,
      land_use: match.land_use,
    },
  };
}

const main = async (): Promise<void> => {
  const parcels = JSON.parse(
    await fs.readFile(
      path.resolve(
        __dirname,
        "../../../public_data/05_Final-Dataset/02_All-STLs-on-Reservations_WGS84.geojson"
      ),
      "utf-8"
    )
  ) as FeatureCollection<Polygon, ParcelProperties>;

  const landUseMappings = JSON.parse(
    await fs.readFile(
      path.resolve(__dirname, "../data/raw/land-use-mapping.json"),
      "utf-8"
    )
  ) as LandUseMapping[];

  const parcelsWithCategory = parcels.features.map((parcel) =>
    enrichParcelWithLandUse(parcel, landUseMappings)
  );

  await fs.writeFile(
    path.resolve(__dirname, "../data/processed/stlors.geojson"),
    JSON.stringify(featureCollection(parcelsWithCategory))
  );
};

main();
