import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as url from "node:url";

import { featureCollection } from "@turf/helpers";
import type { FeatureCollection, Feature, Polygon } from "geojson";

import type {
  LandUse,
  ParcelProperties,
  LandUseMapping,
  RightsTypeInfoMapping,
} from "./types";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

/**
 * Normalize the casing of the rights_type field for parcels.
 *
 * @param parcels – STLoR parcels.
 * @returns STLoR parcels with the rights_type field lowercased.
 */
function normalizeParcelRightsType(
  parcels: Feature<Polygon, ParcelProperties>[]
) {
  return parcels.map((parcel) => {
    return {
      ...parcel,
      properties: {
        ...parcel.properties,
        rights_type: parcel.properties.rights_type.toLowerCase() as
          | "surface"
          | "subsurface",
      },
    };
  });
}

/**
 * Enrich a parcel with information on its activities' land uses.
 *
 * @param parcel – STLoR parcels.
 * @param landUseMappings – The list of mappings from raw activity strings to
 * land uses.
 * @param rightsTypeInfoMappings – The list of mappings from raw rights_type_info
 * strings to land uses.
 * @returns – STLoR parcels with land use information added.
 */
function enrichParcelsWithLandUse(
  parcels: Feature<Polygon, ParcelProperties>[],
  landUseMappings: LandUseMapping[],
  rightsTypeInfoMappings: RightsTypeInfoMapping[]
): Feature<Polygon, ParcelProperties & { land_use: LandUse[] }>[] {
  return parcels.map((parcel) => {
    const activity = parcel.properties.activity;
    const rightsTypeInfo = parcel.properties.rights_type_info;

    if (!activity && !rightsTypeInfo) {
      return {
        ...parcel,
        properties: {
          ...parcel.properties,
          land_use: ["Uncategorized"],
        },
      };
    }

    const activityMatch = landUseMappings.find(
      (entry) => entry.activity === activity
    );
    const rightsTypeInfoMatch = rightsTypeInfoMappings.find(
      (entry) => entry.rights_type_info === rightsTypeInfo
    );

    if (!activityMatch && !rightsTypeInfoMatch) {
      console.warn(
        `No land use found for activity: ${activity} and rights_type_info: ${rightsTypeInfo}`
      );

      return {
        ...parcel,
        properties: {
          ...parcel.properties,
          land_use: ["Uncategorized"],
        },
      };
    }

    const landUses = new Set<LandUse>();

    if (activityMatch) {
      activityMatch.land_use.forEach((landUse) => landUses.add(landUse));
    }

    if (rightsTypeInfoMatch) {
      rightsTypeInfoMatch.land_use.forEach((landUse) => landUses.add(landUse));
    }

    return {
      ...parcel,
      properties: {
        ...parcel.properties,
        land_use:
          landUses.size > 1 && landUses.has("Uncategorized")
            ? Array.from(landUses)
                .filter((landUse) => landUse !== "Uncategorized")
                .sort()
            : Array.from(landUses).sort(),
      },
    };
  });
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

  const rightsTypeInfoMappings = JSON.parse(
    await fs.readFile(
      path.resolve(__dirname, "../data/raw/rights-type-info-mapping.json"),
      "utf-8"
    )
  ) as RightsTypeInfoMapping[];

  const parcelsWithNormalizedRightsType = normalizeParcelRightsType(
    parcels.features
  );

  const parcelsWithLandUse = enrichParcelsWithLandUse(
    parcelsWithNormalizedRightsType,
    landUseMappings,
    rightsTypeInfoMappings
  );

  await fs.writeFile(
    path.resolve(__dirname, "../data/processed/stlors.geojson"),
    JSON.stringify(featureCollection(parcelsWithLandUse), null, 2)
  );
};

main();
