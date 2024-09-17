<script lang="ts">
	import { getContext } from 'svelte';

	import Description from '$lib/components/shared/Description.svelte';
	import { reservation } from '$lib/stores/reservation';
	import type { Data } from '$lib/types';

	const data = getContext<Data>('data');

	$: stats = data.reservationStats[$reservation];
	$: pctCoverage = (stats.stl_total_acres / (stats.acres * 2)) * 100;
</script>

<Description>
	{#if stats.stl_total_acres > 0}
		State trust lands cover <span class="text-primary font-semibold"
			>{stats.stl_total_acres.toLocaleString()} acres</span
		>
		of the {$reservation} reservation. That amounts to
		<span class="font-semibold">{pctCoverage >= 0.01 ? pctCoverage.toFixed(2) : '<0.01'}%</span> of the
		reservation's total surface and subsurface acreage.
	{:else}
		The {$reservation} reservation contains no state trust lands.
	{/if}
</Description>
