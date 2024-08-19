<script lang="ts">
	import type { Map } from 'maplibre-gl';

	import ReservationSelect from '$lib/components/ReservationSelect.svelte';
	import RightsTypePanel from '$lib/components/RightsTypePanel.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import AcreagePanel from '$lib/components/AcreagePanel.svelte';
	import LandUsePanel from '$lib/components/LandUsePanel.svelte';
	import { LAYER_CONFIG } from '$lib/utils/config';
	import { createHatchPattern } from '$lib/utils/pattern';

	export let map: Map;

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
		switch (tabs[event.detail.index].name) {
			case 'Acreage':
				if (!map.getLayer('stlors')) {
					map.addLayer(LAYER_CONFIG.stlors);
				}

				if (!map.getLayer('stlor-outlines')) {
					map.addLayer(LAYER_CONFIG.stlorOutlines);
				}

				map.removeLayer('stlor-rights-hatch');
				map.removeLayer('stlor-rights-fill');
			case 'Land use':
				break;
			case 'Rights type':
				if (!map.getImage('hatch')) {
					map.addImage('hatch', createHatchPattern('#3877F3', '#3c3830'), {
						pixelRatio: devicePixelRatio
					});
				}

				map.removeLayer('stlors');
				map.removeLayer('stlor-outlines');

				map.addLayer({
					id: 'stlor-rights-hatch',
					type: 'fill',
					source: 'stlors',
					'source-layer': 'stlors',
					filter: ['>', ['length', ['get', 'rights_type']], 14],
					paint: {
						'fill-pattern': 'hatch',
						'fill-opacity': 1
					}
				});

				map.addLayer({
					id: 'stlor-rights-fill',
					type: 'fill',
					source: 'stlors',
					'source-layer': 'stlors',
					filter: ['<=', ['length', ['get', 'rights_type']], 14],
					paint: {
						'fill-color': [
							'case',
							['in', ['literal', 'subsurface'], ['get', 'rights_type']],
							'#3c3830',
							['in', ['literal', 'surface'], ['get', 'rights_type']],
							'#3877F3',
							'#ffffff'
						],
						'fill-opacity': 1
					}
				});
				break;
		}
	}
</script>

<div
	class="stack stack-sm absolute top-8 left-8 rounded shadow-lg max-w-sm p-6 bg-gray-100/75 border border-earth text-earth backdrop-blur"
>
	<h1 class="text-4xl font-serif flex flex-col font-semibold items-center">
		State trust lands<span class="text-3xl font-normal">on reservations</span>
	</h1>
	<div class="stack stack-xs">
		<Tabs {tabs} on:change={onChange} />
	</div>
	<hr class="border-earth" />
	<div class="stack stack-xs">
		<h2 class="text-xl font-semibold">Explore other reservations</h2>
		<ReservationSelect />
	</div>
</div>
