<script lang="ts">
	import type { Map } from 'maplibre-gl';

	import AcreagePanel from '$lib/components/menu/AcreagePanel.svelte';
	import LandUsePanel from '$lib/components/menu/LandUsePanel.svelte';
	import ReservationSelect from '$lib/components/menu/ReservationSelect.svelte';
	import RightsTypePanel from '$lib/components/menu/RightsTypePanel.svelte';
	import Tabs from '$lib/components/shared/Tabs.svelte';
	import { view } from '$lib/stores/view';
	import {
		ACREAGE_LAYER_CONFIG,
		LAND_USE_LAYER_CONFIG,
		RIGHTS_TYPE_LAYER_CONFIG
	} from '$lib/utils/config';
	import { TABLET_BREAKPOINT } from '$lib/utils/constants';

	export let map: Map;
	let innerWidth: number;
	let collapsed: boolean;

	const tabs = [
		{
			name: 'Acreage',
			content: AcreagePanel
		},
		{
			name: 'Land use',
			content: LandUsePanel
		},
		{
			name: 'Rights type',
			content: RightsTypePanel
		}
	];

	function onChange(event: CustomEvent<{ index: number }>): void {
		view.set(tabs[event.detail.index].name as 'Acreage' | 'Land use' | 'Rights type');

		switch (tabs[event.detail.index].name) {
			case 'Acreage':
				// Remove land use layers, if visible.
				Object.values(LAND_USE_LAYER_CONFIG).forEach((config) => {
					if (map.getLayer(config.id)) {
						map.removeLayer(config.id);
					}
				});

				// Remove rights type layers, if visible.
				Object.values(RIGHTS_TYPE_LAYER_CONFIG).forEach((config) => {
					if (map.getLayer(config.id)) {
						map.removeLayer(config.id);
					}
				});

				// Add acreage layers.
				Object.values(ACREAGE_LAYER_CONFIG).forEach((config) => {
					map.addLayer(config);
				});
				break;
			case 'Land use':
				// Remove acreage layers, if visible.
				Object.values(ACREAGE_LAYER_CONFIG).forEach((config) => {
					if (map.getLayer(config.id)) {
						map.removeLayer(config.id);
					}
				});

				// Remove rights type layers, if visible.
				Object.values(RIGHTS_TYPE_LAYER_CONFIG).forEach((config) => {
					if (map.getLayer(config.id)) {
						map.removeLayer(config.id);
					}
				});

				// Add land use layers.
				Object.values(LAND_USE_LAYER_CONFIG).forEach((config) => {
					map.addLayer(config);
				});
				break;
			case 'Rights type':
				// Remove acreage layers, if visible.
				Object.values(ACREAGE_LAYER_CONFIG).forEach((config) => {
					if (map.getLayer(config.id)) {
						map.removeLayer(config.id);
					}
				});

				// Remove land use layers, if visible.
				Object.values(LAND_USE_LAYER_CONFIG).forEach((config) => {
					if (map.getLayer(config.id)) {
						map.removeLayer(config.id);
					}
				});

				Object.values(RIGHTS_TYPE_LAYER_CONFIG).forEach((config) => {
					map.addLayer(config);
				});
				break;
		}
	}

	$: isTabletOrAbove = innerWidth > TABLET_BREAKPOINT;
</script>

<svelte:window bind:innerWidth />
<div
	class="stack stack-sm border-earth text-earth bg-smog/75 absolute bottom-0 left-[3%] z-10 max-h-full w-[94%] rounded-t border-x border-t p-4 shadow-xl backdrop-blur transition-transform duration-300 sm:bottom-auto sm:left-8 sm:top-8 sm:max-w-sm sm:rounded sm:border sm:p-6 sm:transition-none"
	class:translate-y-[calc(100%-6.5rem)]={collapsed}
>
	{#if isTabletOrAbove}
		<h1
			class="sm:visible sm:flex sm:flex-col sm:items-center sm:text-center sm:font-sans sm:text-4xl sm:font-semibold"
		>
			State trust lands on reservations
		</h1>
	{/if}
	<div class="stack stack-xs">
		<Tabs {tabs} on:change={onChange} bind:collapsed />
	</div>
	<div class="stack stack-xs">
		<h2 class="text-base font-semibold sm:text-lg">Explore other reservations</h2>
		<ReservationSelect />
	</div>
	<div class="border-earth font-sans-alt text-3xs border-t border-opacity-25 pt-2">
		<p>
			<strong>Sources</strong> &nbsp;Grist & High Country News analysis / Bureau of Indian Affairs
		</p>
		<p><strong>Graphic</strong> &nbsp;Parker Ziegler / Grist</p>
	</div>
</div>
