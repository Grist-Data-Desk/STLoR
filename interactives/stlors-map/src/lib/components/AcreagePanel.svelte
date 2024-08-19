<script lang="ts">
	import { getContext } from 'svelte';

	import ReservationHeader from '$lib/components/ReservationHeader.svelte';
	import { reservation } from '$lib/stores/reservation';
	import type { Data } from '$lib/types';

	const data = getContext<Data>('data');

	$: stats = data.reservationStats[$reservation];
	$: pctCoverage = (stats.stl_total_acres / stats.acres) * 2 * 100;
</script>

<ReservationHeader />
<p class="font-sans-alt text-sm">
	{#if stats.stl_total_acres > 0}
		State trust lands cover <span class="text-orange font-semibold"
			>{stats.stl_total_acres.toLocaleString()} acres</span
		>
		of the {$reservation} reservation. That amounts to
		<span class="font-semibold">{pctCoverage.toFixed(2)}%</span> of the reservation's total surface and
		subsurface acreage.
	{:else}
		The {$reservation} reservation contains no state trust lands.
	{/if}
</p>
