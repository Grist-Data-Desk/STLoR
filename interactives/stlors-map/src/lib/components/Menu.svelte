<script lang="ts">
	import round from 'lodash.round';
	import { getContext } from 'svelte';

	import { reservation } from '$lib/stores/reservation';
	import type { Data } from '$lib/types';
	import LandUseBarChart from '$lib/components/LandUseBarChart.svelte';
	import ReservationSelect from './ReservationSelect.svelte';
	import RightsTypeBar from './RightsTypeBar.svelte';

	const data = getContext<Data>('data');

	$: features = data.stlors.features.filter(
		(feature) => feature.properties?.reservation_name === $reservation
	);
	$: acres = round(
		features.reduce((acc, feature) => acc + feature.properties?.gis_acres, 0),
		2
	);
</script>

<div
	class="stack stack-sm absolute top-8 left-8 rounded shadow-lg max-w-sm p-6 bg-gray-100/75 border border-earth text-earth backdrop-blur"
>
	<h1 class="text-4xl font-serif flex flex-col font-semibold items-center">
		State trust lands<span class="text-3xl font-normal">on reservations</span>
	</h1>
	<hr class="border-earth border-dotted" />
	<div class="stack stack-xs">
		<h2 class="text-xl font-semibold text-teal font-sans">
			{$reservation} Reservation, {features[0].properties.state}
		</h2>
		<p class="font-sans-alt">
			{#if acres > 0}
				The {$reservation} reservation contains
				<span class="text-orange font-semibold">{acres.toLocaleString()} acres</span>
				of state trust lands.
			{:else}
				The {$reservation} reservation contains no state trust lands.
			{/if}
		</p>
	</div>
	{#if acres > 0}
		<div class="stack stack-xs">
			<h2 class="text-lg">Rights type</h2>
			<RightsTypeBar />
		</div>
		<div class="stack stack-xs">
			<h2 class="text-lg">Land use</h2>
			<LandUseBarChart reservationStats={data.reservationStats} />
		</div>
	{/if}
	<hr class="border-earth border-dotted" />
	<div class="stack stack-xs">
		<h2 class="text-xl font-semibold">Explore other reservations</h2>
		<ReservationSelect />
	</div>
</div>
