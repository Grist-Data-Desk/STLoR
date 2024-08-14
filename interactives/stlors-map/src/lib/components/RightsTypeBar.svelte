<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import round from 'lodash.round';
	import { getContext } from 'svelte';

	import { reservation } from '$lib/stores/reservation';
	import type { Data } from '$lib/types';

	const data = getContext<Data>('data');

	$: features = data.stlors.features.filter(
		(feature) => feature.properties?.reservation_name === $reservation
	);

	$: subsurfaceAcres = round(
		features.reduce((acc, feature) => {
			if (feature.properties?.rights_type.toLowerCase() === 'subsurface') {
				return acc + feature.properties?.gis_acres;
			}

			return acc;
		}, 0),
		2
	);
	$: surfaceAcres = round(
		features.reduce((acc, feature) => {
			if (feature.properties?.rights_type.toLowerCase() === 'surface') {
				return acc + feature.properties?.gis_acres;
			}

			return acc;
		}, 0),
		2
	);

	$: xScale = scaleLinear()
		.domain([0, subsurfaceAcres + surfaceAcres])
		.range([0, 450]);
</script>

<svg
	viewBox="0 0 450 35"
	width="450"
	height="35"
	style="max-width: 100%; height: auto; height: intrinsic;"
>
	<rect x="0" y="0" height="35" width={xScale(subsurfaceAcres)} fill="#3c3830" />
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
			{subsurfaceAcres.toLocaleString()} Acres
		</text>
	</g>
	<rect
		x={xScale(subsurfaceAcres)}
		y="0"
		height="35"
		width={xScale(subsurfaceAcres)}
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
			{surfaceAcres.toLocaleString()} Acres
		</text>
	</g>
</svg>
