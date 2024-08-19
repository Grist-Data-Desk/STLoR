import type { ReservationStats } from '$lib/types/index.js';

export async function load({ fetch }) {
	const reservationStats = await fetch('/reservation-stats.json').then(
		(r) => r.json() as Promise<Record<string, ReservationStats>>
	);

	return {
		reservationStats
	};
}
