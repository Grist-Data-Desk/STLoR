import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as url from "node:url";

import { bbox } from "@turf/bbox";
import groupBy from "lodash.groupby";
import round from "lodash.round";

import type { BBox, Feature, FeatureCollection, Polygon } from "geojson";
import type {
  ParcelWithLandUseProperties,
  LandUse,
  ReservationProperties,
  ReservationStats,
} from "./types";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

function computeLandUseAcreageForReservation(
  reservation: string,
  stlors: FeatureCollection<Polygon, ParcelWithLandUseProperties>
): ReservationStats["land_uses"] {
  const features = stlors.features.filter(
    (feature) => feature.properties.reservation_name === reservation
  );

  const landUseToAcreage = features.reduce<Record<LandUse, number>>(
    (acc, feature) => {
      const landUses = feature.properties.land_use;

      for (const landUse of landUses) {
        acc[landUse] += feature.properties.gis_acres;
      }

      return acc;
    },
    {
      Grazing: 0,
      Agriculture: 0,
      Infrastructure: 0,
      Renewables: 0,
      Conservation: 0,
      "Fossil Fuels": 0,
      Mining: 0,
      Timber: 0,
      Commercial: 0,
      Uncategorized: 0,
      Recreation: 0,
      "Federal Government": 0,
      Water: 0,
    }
  );

  const topLandUses = Object.entries(landUseToAcreage)
    .filter(([landUse]) => landUse !== "Uncategorized")
    .map(([landUse, acreage]) => ({
      land_use: landUse,
      acreage: round(acreage, 2),
    }))
    .sort((a, b) => b.acreage - a.acreage)
    .slice(0, 5) as { land_use: LandUse; acreage: number }[];

  return {
    top_land_uses: topLandUses,
    uncategorized_acreage: round(landUseToAcreage.Uncategorized, 2),
  };
}

function computeBoundsForReservation(
  feature: Feature<Polygon, ReservationProperties>
): BBox {
  return bbox(feature);
}

function computeSTLAcreageForReservation(
  reservation: string,
  stlors: FeatureCollection<Polygon, ParcelWithLandUseProperties>
): {
  stl_total_acres: number;
  stl_surface_acres: number;
  stl_subsurface_acres: number;
} {
  const features = stlors.features.filter(
    (feature) => feature.properties.reservation_name === reservation
  );

  const totalAcres = features.reduce(
    (acc, feature) => acc + feature.properties.clipped_acres,
    0
  );

  const featuresByRightsType = groupBy(features, (feature) =>
    feature.properties.rights_type.toLowerCase()
  );

  return {
    stl_total_acres: round(totalAcres, 2),
    stl_surface_acres: round(
      featuresByRightsType.surface?.reduce(
        (acc, feature) => acc + feature.properties.clipped_acres,
        0
      ) ?? 0,
      2
    ),
    stl_subsurface_acres: round(
      featuresByRightsType.subsurface?.reduce(
        (acc, feature) => acc + feature.properties.clipped_acres,
        0
      ) ?? 0,
      2
    ),
  };
}

async function main() {
  const reservations = JSON.parse(
    await fs.readFile(
      path.resolve(__dirname, "../data/processed/reservations.geojson"),
      "utf-8"
    )
  ) as FeatureCollection<Polygon, ReservationProperties>;

  const stlors = JSON.parse(
    await fs.readFile(
      path.resolve(__dirname, "../data/processed/stlors.geojson"),
      "utf-8"
    )
  ) as FeatureCollection<Polygon, ParcelWithLandUseProperties>;

  const reservationsWithStatistics = reservations.features.reduce<
    Record<string, ReservationStats>
  >((acc, reservation) => {
    const landUses = computeLandUseAcreageForReservation(
      reservation.properties.reservation_name,
      stlors
    );
    const bounds = computeBoundsForReservation(reservation);
    const stlAcreage = computeSTLAcreageForReservation(
      reservation.properties.reservation_name,
      stlors
    );

    acc[reservation.properties.reservation_name] = {
      reservation_name: reservation.properties.reservation_name,
      acres: reservation.properties.acres,
      land_uses: landUses,
      bounds,
      ...stlAcreage,
    };

    return acc;
  }, {});

  await fs.writeFile(
    path.resolve(__dirname, "../data/processed/reservation-stats.json"),
    JSON.stringify(reservationsWithStatistics, null, 2)
  );
}

main();
