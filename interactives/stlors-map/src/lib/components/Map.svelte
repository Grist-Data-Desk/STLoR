<script lang="ts">
	import maplibregl, { type Map } from 'maplibre-gl';
	import { onDestroy, onMount, getContext } from 'svelte';
	import * as pmtiles from 'pmtiles';

	import Menu from '$lib/components/Menu.svelte';
	import { SOURCE_CONFIG, LAYER_CONFIG } from '$lib/utils/config';
	import { BASEMAP_STYLE } from '$lib/utils/style';
	import { reservation } from '$lib/stores/reservation';
	import type { Data } from '$lib/types';

	const data = getContext<Data>('data');

	let map: Map;

	onMount(() => {
		const protocol = new pmtiles.Protocol();
		maplibregl.addProtocol('pmtiles', protocol.tile);

		map = new maplibregl.Map({
			container: 'stlor-map',
			style: BASEMAP_STYLE,
			center: [-105.93, 40.36],
			zoom: 4.5,
			minZoom: 3.5
		});

		// map.scrollZoom.disable();
		// map.addControl(new maplibregl.NavigationControl());
		// map.addControl(
		// 	new maplibregl.GeolocateControl({
		// 		positionOptions: {
		// 			enableHighAccuracy: true
		// 		},
		// 		trackUserLocation: true
		// 	})
		// );

		map.on('load', () => {
			map.fitBounds(data.reservationStats[$reservation].bounds, {
				padding: { top: 50, bottom: 50, left: 350, right: 0 }
			});

			Object.values(SOURCE_CONFIG).forEach(({ id, config }) => {
				map.addSource(id, config);
			});

			Object.values(LAYER_CONFIG).forEach((config) => {
				map.addLayer(config);
			});
		});

		map.on('click', LAYER_CONFIG.reservations.id, (e) => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: ['reservations']
			});

			if (features.length > 0) {
				const clickedRez = features[0].properties.reservation_name;

				reservation.set(clickedRez);
			}
		});

		map.on('click', LAYER_CONFIG.stlors.id, (e) => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: ['stlors']
			});

			if (features.length > 0) {
				for (const feature of features) {
					console.log(feature.properties);
				}
			}
		});
	});

	$: if (map) {
		const bounds = data.reservationStats[$reservation].bounds;
		map.fitBounds(bounds, { padding: { top: 50, bottom: 50, left: 350, right: 0 } });
	}

	onDestroy(() => {
		map?.remove();
	});
</script>

<div class="h-screen w-screen flex-col font-sans">
	<div id="stlor-map" class="w-full grow md:h-full" />
	{#if map}
		<Menu {map} />
	{/if}
</div>
