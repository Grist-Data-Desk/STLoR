import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as url from "node:url";

import { bbox } from "@turf/bbox";
import round from "lodash.round";

import type { Feature, FeatureCollection, Polygon } from "geojson";
import type {
  ProcessedParcelProperties,
  LandUse,
  ReservationProperties,
  ReservationAggProperties,
  ReservationStats,
} from "./types";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

/**
 * Compute the acreage for each land use on a reservation.
 *
 * @param {Feature<Polygon, ProcessedParcelProperties>[]} parcels – The parcels
 * on the reservation.
 * @returns {ReservationStats["land_uses"]} — The acreages of the top five land
 * uses on the reservation, in addition to the total 'Uncategorized' acreage.
 */
function computeLandUseAcreageForReservation(
  parcels: Feature<Polygon, ProcessedParcelProperties>[]
): ReservationStats["land_uses"] {
  const landUseToAcreage = parcels.reduce<Record<LandUse, number>>(
    (acc, parcel) => {
      const landUses = parcel.properties.land_use;

      for (const landUse of landUses) {
        acc[landUse] += parcel.properties.clipped_acres;
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

async function main() {
  const reservations = JSON.parse(
    await fs.readFile(
      path.resolve(__dirname, "../data/raw/reservations.geojson"),
      "utf-8"
    )
  ) as FeatureCollection<Polygon, ReservationProperties>;
  const reservationAgg = JSON.parse(
    await fs.readFile(
      path.resolve(
        __dirname,
        "../../../public_data/05_Final-Dataset/01_STLs-on-Reservations-by-Reservation.geojson"
      ),
      "utf-8"
    )
  ) as FeatureCollection<Polygon, ReservationAggProperties>;
  const stlors = JSON.parse(
    await fs.readFile(
      path.resolve(__dirname, "../data/processed/stlors.geojson"),
      "utf-8"
    )
  ) as FeatureCollection<Polygon, ProcessedParcelProperties>;

  // Filter reservations to only include those with STLoRs.
  reservations.features = reservations.features.filter((reservation) =>
    reservationAgg.features.find(
      (agg) =>
        agg.properties.reservation_name ===
        reservation.properties.reservation_name
    )
  );
  console.log(reservations.features.length);

  const reservationsWithStatistics = reservations.features.reduce<
    Record<string, ReservationStats>
  >((acc, reservation) => {
    const parcels = stlors.features.filter(
      (stlor) =>
        stlor.properties.reservation_name ===
        reservation.properties.reservation_name
    );
    const reservationAggStats = reservationAgg.features.find(
      (feature) =>
        feature.properties.reservation_name ===
        reservation.properties.reservation_name
    )!.properties;

    const landUses = computeLandUseAcreageForReservation(parcels);

    acc[reservation.properties.reservation_name] = {
      reservation_name: reservation.properties.reservation_name,
      acres: reservation.properties.acres,
      land_uses: landUses,
      bounds: bbox(reservation),
      stl_total_acres: reservationAggStats.clipped_acres,
      stl_subsurface_acres: reservationAggStats.subsurface_clipped_acres,
      stl_surface_acres: reservationAggStats.surface_clipped_acres,
    };

    return acc;
  }, {});

  await fs.writeFile(
    path.resolve(__dirname, "../data/processed/reservation-stats.json"),
    JSON.stringify(reservationsWithStatistics, null, 2)
  );

  await fs.writeFile(
    path.resolve(__dirname, "../data/processed/reservations.geojson"),
    JSON.stringify(reservations, null, 2)
  );
}

main();
