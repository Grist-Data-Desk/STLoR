<script lang="ts">
	import type { Map } from 'maplibre-gl';

	import AcreagePanel from '$lib/components/menu/AcreagePanel.svelte';
	import LandUsePanel from '$lib/components/menu/LandUsePanel.svelte';
	import ReservationSelect from '$lib/components/menu/ReservationSelect.svelte';
	import RightsTypePanel from '$lib/components/menu/RightsTypePanel.svelte';
	import Tabs from '$lib/components/shared/Tabs.svelte';
	import {
		ACREAGE_LAYER_CONFIG,
		LAND_USE_LAYER_CONFIG,
		RIGHTS_TYPE_LAYER_CONFIG
	} from '$lib/utils/config';
	import { view } from '$lib/stores/view';
	import { slide } from 'svelte/transition';

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
		}
	}
</script>

<svelte:window bind:innerWidth />
<div
	class="stack stack-sm border-earth text-earth bg-smog/75 absolute bottom-0 left-[3%] z-10 w-[94%] max-w-sm rounded-t border-x border-t p-4 shadow-xl backdrop-blur transition-all duration-300 sm:bottom-auto sm:left-8 sm:top-8 sm:p-6 md:rounded md:border"
	class:collapsed={collapsed && innerWidth <= 640}
	class:expanded={!collapsed || innerWidth > 640}
	transition:slide
>
	{#if innerWidth > 640}
		<h1
			class="sm:visible sm:flex sm:flex-col sm:items-center sm:font-serif sm:text-4xl sm:font-semibold"
		>
			State trust lands<span class="sm:text-3xl sm:font-normal">on reservations</span>
		</h1>
	{/if}
	<div class="stack stack-xs">
		<Tabs {tabs} on:change={onChange} bind:collapsed />
	</div>
	<div class="stack stack-xs">
		<h2 class="text-base font-semibold sm:text-lg">Explore other reservations</h2>
		<ReservationSelect />
	</div>
</div>

<style lang="postcss">
	.collapsed {
		max-height: 6.375rem;
	}

	.expanded {
		max-height: 100%;
	}
</style>
