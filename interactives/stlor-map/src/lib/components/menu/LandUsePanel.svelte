<script lang="ts">
	import { getContext } from 'svelte';
	import { scaleBand, scaleLinear } from 'd3-scale';

	import Description from '$lib/components/shared/Description.svelte';
	import { reservation } from '$lib/stores/reservation';
	import type { Data } from '$lib/types';
	import { LAND_USE_TO_COLORS } from '$lib/utils/constants';

	const data = getContext<Data>('data');

	$: stats = data.reservationStats[$reservation];
	$: landUses = stats.land_uses.top_land_uses.filter((landUse) => landUse.acreage > 0);
	$: displayedLandUses = landUses.length > 2 ? landUses.slice(0, 3) : landUses;
	$: xScale = scaleLinear()
		.domain([0, landUses[0]?.acreage ?? 0])
		.range([0, 450]);
	$: yScale = scaleBand()
		.domain(landUses.map((d) => d.land_use))
		.range([0, landUses.length * 45])
		.padding(0.1);
</script>

<Description>
	{#if landUses.length === 0}
		No land use information is available for state trust lands on the {$reservation} reservation.
	{:else if landUses.length === 1}
		State trust lands on the {$reservation} reservation are primarily designated for
		<span class="font-semibold" style="color: {LAND_USE_TO_COLORS[landUses[0].land_use]};"
			>{landUses[0].land_use}</span
		>.
	{:else}
		State trust lands on the {$reservation} reservation are primarily designated for
		{#each displayedLandUses as { land_use }, i}
			<span class="font-semibold" style="color: {LAND_USE_TO_COLORS[land_use]};"
				>{land_use}<span class="text-earth font-normal">
					{i === displayedLandUses.length - 2
						? ' and '
						: i === displayedLandUses.length - 1
							? ''
							: ', '}</span
				></span
			>
		{/each}
		uses.
	{/if}
	{#if stats.land_uses.uncategorized_acreage > 0}
		<p class="text-2xs mt-2 sm:text-xs">
			<span class="font-semibold">{stats.land_uses.uncategorized_acreage.toLocaleString()}</span> acres
			of state trust lands contained no land use information.
		</p>
	{/if}
</Description>
<svg
	viewBox="0 0 450 {displayedLandUses.length * 45}"
	width="450"
	height={displayedLandUses.length * 45}
	style="max-width: 100%; height: auto; height: intrinsic;"
>
	<g>
		{#each displayedLandUses as { land_use, acreage }, i}
			<rect
				x="0"
				y={yScale(land_use)}
				width={xScale(acreage)}
				height={yScale.bandwidth()}
				fill={LAND_USE_TO_COLORS[land_use]}
				class="transition-all duration-300"
			/>
			<g>
				<text
					x={xScale(acreage) > 350 ? xScale(acreage) - 10 : xScale(acreage) + 10}
					y={yScale(land_use) ?? 0 + yScale.bandwidth() / 2}
					dy="1.5em"
					font-size="12"
					font-family="Basis Grotesque"
					font-weight="bold"
					fill={xScale(acreage) > 350 ? 'white' : 'black'}
					text-anchor={xScale(acreage) > 350 ? 'end' : 'start'}
				>
					{land_use}
				</text>
				<text
					x={xScale(acreage) > 350 ? xScale(acreage) - 10 : xScale(acreage) + 10}
					y={yScale(land_use) ?? 0 + yScale.bandwidth() / 2}
					dy="3em"
					font-size="10"
					font-family="Basis Grotesque"
					fill={xScale(acreage) > 350 ? 'white' : 'black'}
					text-anchor={xScale(acreage) > 350 ? 'end' : 'start'}
				>
					{acreage.toLocaleString()} Acres
				</text>
			</g>
		{/each}
	</g>
</svg>
