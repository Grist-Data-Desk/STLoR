import type { ReservationStats } from '$lib/types/index.js';

export async function load({ fetch }) {
	const reservationStats = await fetch('/reservation-stats.json').then(
		(r) => r.json() as Promise<Record<string, ReservationStats>>
	);
	const landUsePatterns = await fetch('/land-use-patterns.json').then(
		(r) => r.json() as Promise<{ combo: string; pattern: string }[]>
	);
	const rightsTypePattern = await fetch('/rights-type-pattern.json').then(
		(r) => r.json() as Promise<string>
	);

	return {
		reservationStats,
		landUsePatterns,
		rightsTypePattern
	};
}
