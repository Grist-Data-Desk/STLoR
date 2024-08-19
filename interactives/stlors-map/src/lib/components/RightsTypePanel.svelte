<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import { getContext } from 'svelte';

	import ReservationHeader from '$lib/components/ReservationHeader.svelte';
	import { reservation } from '$lib/stores/reservation';
	import type { Data } from '$lib/types';

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
			? { rights_type: 'subsurface', pct: pctSubsurface }
			: { rights_type: 'surface', pct: pctSurface };
</script>

<ReservationHeader />
{#if stats.stl_total_acres > 0}
	<p class="font-sans-alt text-sm">
		The majority <span class="font-semibold">({majority.pct.toFixed(2)}%)</span> of state trust
		lands on the {$reservation} reservation are
		{majority.rights_type} acres.
	</p>
	<svg
		viewBox="0 0 450 35"
		width="450"
		height="35"
		style="max-width: 100%; height: auto; height: intrinsic;"
	>
		<rect x="0" y="0" height="35" width={xScale(stats.stl_subsurface_acres)} fill="#3c3830" />
		<g>
			<text
				x="10"
				y="0"
				dy="1.2em"
				font-size="12"
				font-family="Basis Grotesque Pro"
				font-weight="bold"
				fill="white"
			>
				Subsurface
			</text>
			<text
				x="10"
				y="0"
				dy="2.75em"
				font-size="10"
				font-family="Basis Grotesque Pro"
				font-style="italic"
				fill="white"
				class="transition-all duration-300"
			>
				{stats.stl_subsurface_acres.toLocaleString()} Acres
			</text>
		</g>
		<rect
			x={xScale(stats.stl_subsurface_acres)}
			y="0"
			height="35"
			width={xScale(stats.stl_surface_acres)}
			fill="#3877f3"
			class="transition-all duration-300"
		/>
		<g>
			<text
				x="440"
				y="0"
				dy="1.2em"
				font-size="12"
				font-family="Basis Grotesque Pro"
				font-weight="bold"
				fill="white"
				text-anchor="end"
			>
				Surface
			</text>
			<text
				x="440"
				y="0"
				dy="2.75em"
				font-size="10"
				font-family="Basis Grotesque Pro"
				font-style="italic"
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
