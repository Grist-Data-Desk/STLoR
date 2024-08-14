<script lang="ts">
	import { scaleBand, scaleLinear } from 'd3-scale';
	import { schemePaired } from 'd3-scale-chromatic';

	import type { LandUse, ReservationStats } from '$lib/types';
	import { COLORS } from '$lib/utils/constants';
	import { reservation } from '$lib/stores/reservation';

	export let reservationStats: Record<string, ReservationStats>;

	const colors: Record<LandUse, string> = {
		Grazing: COLORS.PALE_GREEN,
		Agriculture: schemePaired[3],
		Infrastructure: COLORS.GRAY,
		Renewables: COLORS.ORANGE,
		Conservation: schemePaired[2],
		'Fossil Fuels': COLORS.EARTH,
		Mining: COLORS.GOLD,
		Timber: COLORS.GREEN,
		Commercial: schemePaired[9],
		Uncategorized: 'gray',
		Recreation: schemePaired[4],
		'Federal Government': schemePaired[5],
		Water: schemePaired[0]
	};

	$: landUses = reservationStats[$reservation].land_uses;

	$: xScale = scaleLinear().domain([0, landUses[0].acreage]).range([0, 450]);
	$: yScale = scaleBand()
		.domain(landUses.map((d) => d.land_use))
		.range([0, 200])
		.padding(0.1);
</script>

<svg
	viewBox="0 0 450 200"
	width="450"
	height="200"
	style="max-width: 100%; height: auto; height: intrinsic;"
>
	<g>
		{#each landUses as { land_use, acreage }, i}
			<rect
				x="0"
				y={yScale(land_use)}
				width={xScale(acreage)}
				height={yScale.bandwidth()}
				fill={colors[land_use]}
				class="transition-all duration-300"
			/>
			<g>
				<text
					x={xScale(acreage) > 350 ? xScale(acreage) - 10 : xScale(acreage) + 10}
					y={yScale(land_use) ?? 0 + yScale.bandwidth() / 2}
					dy="1.2em"
					font-size="12"
					font-family="Basis Grotesque Pro"
					font-weight="bold"
					fill={xScale(acreage) > 350 ? 'white' : 'black'}
					text-anchor={xScale(acreage) > 350 ? 'end' : 'start'}
				>
					{land_use}
				</text>
				<text
					x={xScale(acreage) > 350 ? xScale(acreage) - 10 : xScale(acreage) + 10}
					y={yScale(land_use) ?? 0 + yScale.bandwidth() / 2}
					dy="2.75em"
					font-size="10"
					font-family="Basis Grotesque Pro"
					font-style="italic"
					fill={xScale(acreage) > 350 ? 'white' : 'black'}
					text-anchor={xScale(acreage) > 350 ? 'end' : 'start'}
				>
					{acreage.toLocaleString()} Acres
				</text>
			</g>
		{/each}
	</g>
</svg>
