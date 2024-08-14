import type { FeatureCollection, Polygon } from 'geojson';

import type { ReservationStats, ParcelProperties } from '$lib/types/index.js';

export async function load({ fetch }) {
	const stlors = await fetch('/stlors.geojson').then(
		(r) => r.json() as Promise<FeatureCollection<Polygon, ParcelProperties>>
	);
	const reservationStats = await fetch('/reservation-stats.json').then(
		(r) => r.json() as Promise<Record<string, ReservationStats>>
	);

	return {
		stlors,
		reservationStats
	};
}
