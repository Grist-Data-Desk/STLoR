<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import { getContext } from 'svelte';

	import Description from '$lib/components/shared/Description.svelte';
	import { reservation } from '$lib/stores/reservation';
	import type { Data } from '$lib/types';
	import { RIGHTS_TYPE_TO_COLORS } from '$lib/utils/constants';

	const data = getContext<Data>('data');

	$: stats = data.reservationStats[$reservation];
	$: xScale = scaleLinear()
		.domain([0, stats.stl_subsurface_acres + stats.stl_surface_acres])
		.range([0, 450]);
	$: pctSubsurface =
		(stats.stl_subsurface_acres / (stats.stl_subsurface_acres + stats.stl_surface_acres)) * 100;
	$: pctSurface = 100 - pctSubsurface;
	$: majority =
		pctSubsurface > pctSurface
			? { rights_type: 'subsurface' as const, pct: pctSubsurface }
			: { rights_type: 'surface' as const, pct: pctSurface };
</script>

{#if stats.stl_total_acres > 0}
	<Description>
		{#if majority.pct === 100}
			All state trust lands on the {$reservation} reservation are
			<span class="font-semibold">{majority.rights_type}</span> acres.
		{:else if majority.pct === 50}
			State trust lands on the {$reservation} reservation are
			<span class="font-semibold">evenly split</span> between
			<span class="font-semibold">surface</span>
			and
			<span class="font-semibold">subsurface</span> acres.
		{:else}
			The majority <span class="font-semibold">({majority.pct.toFixed(2)}%)</span> of state trust
			lands on the {$reservation} reservation are
			<span class="font-semibold">{majority.rights_type}</span> acres.
		{/if}
	</Description>
	<svg
		viewBox="0 0 450 40"
		width="450"
		height="40"
		style="max-width: 100%; height: auto; height: intrinsic;"
	>
		<rect
			x="0"
			y="0"
			height="40"
			width={xScale(stats.stl_subsurface_acres)}
			fill={RIGHTS_TYPE_TO_COLORS.subsurface}
		/>
		<g>
			<text
				x="10"
				y="0"
				dy="1.5em"
				font-size="12"
				font-family="Basis Grotesque"
				font-weight="bold"
				fill="#ffffff"
			>
				Subsurface
			</text>
			<text
				x="10"
				y="0"
				dy="3em"
				font-size="10"
				font-family="Basis Grotesque"
				fill="#ffffff"
				class="transition-all duration-300"
			>
				{stats.stl_subsurface_acres.toLocaleString()} Acres
			</text>
		</g>
		<rect
			x={xScale(stats.stl_subsurface_acres)}
			y="0"
			height="40"
			width={xScale(stats.stl_surface_acres)}
			fill={RIGHTS_TYPE_TO_COLORS.surface}
			class="transition-all duration-300"
		/>
		<g>
			<text
				x="440"
				y="0"
				dy="1.5em"
				font-size="12"
				font-family="Basis Grotesque"
				font-weight="bold"
				fill="white"
				text-anchor="end"
			>
				Surface
			</text>
			<text
				x="440"
				y="0"
				dy="3em"
				font-size="10"
				font-family="Basis Grotesque"
				fill="white"
				text-anchor="end"
			>
				{stats.stl_surface_acres.toLocaleString()} Acres
			</text>
		</g>
	</svg>
{:else}
	<p class="font-sans-alt">
		The {$reservation} reservation contains no state trust lands.
	</p>
{/if}
