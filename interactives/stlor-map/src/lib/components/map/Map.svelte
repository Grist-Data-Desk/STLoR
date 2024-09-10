<script lang="ts">
	import maplibregl, { type Map } from 'maplibre-gl';
	import { onDestroy, onMount, getContext } from 'svelte';
	import * as pmtiles from 'pmtiles';

	import ExpandLegend from '$lib/components/legend/ExpandLegend.svelte';
	import Legend from '$lib/components/legend/Legend.svelte';
	import Menu from '$lib/components/menu/Menu.svelte';
	import Search from '$lib/components/search/Search.svelte';
	import { reservation } from '$lib/stores/reservation';
	import { view } from '$lib/stores/view';
	import type { Data } from '$lib/types';
	import {
		SOURCE_CONFIG,
		LAYER_CONFIG,
		ACREAGE_LAYER_CONFIG,
		LAND_USE_LAYER_CONFIG,
		RIGHTS_TYPE_LAYER_CONFIG
	} from '$lib/utils/config';
	import { DO_SPACES_URL, INITIAL_BOUNDS } from '$lib/utils/constants';
	import { convertDataURLToImageData } from '$lib/utils/pattern';
	import { setParcelPopupHTML } from '$lib/utils/popup';

	const data = getContext<Data>('data');

	let map: Map;
	let innerWidth: number;
	let innerHeight: number;

	onMount(() => {
		const protocol = new pmtiles.Protocol();
		maplibregl.addProtocol('pmtiles', protocol.tile);

		const tabletOrAbove = innerWidth > 640;

		map = new maplibregl.Map({
			container: 'stlor-map',
			style: `${DO_SPACES_URL}/styles/style.json`,
			center: [-105.93, 40.36],
			zoom: tabletOrAbove ? 8.5 : 7.6,
			minZoom: 2
		});

		map.scrollZoom.disable();
		map.addControl(new maplibregl.NavigationControl(), 'top-right');
		map.addControl(
			new maplibregl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true
				},
				trackUserLocation: true
			}),
			'top-left'
		);

		const popup = new maplibregl.Popup({
			closeButton: true,
			closeOnClick: true
		});

		map.on('load', async () => {
			map.fitBounds(tabletOrAbove ? INITIAL_BOUNDS.desktop : INITIAL_BOUNDS.mobile);

			Object.values(SOURCE_CONFIG).forEach(({ id, config }) => {
				map.addSource(id, config);
			});

			Object.values(LAYER_CONFIG).forEach((config) => {
				map.addLayer(config);
			});

			Object.values(ACREAGE_LAYER_CONFIG).forEach((config) => {
				map.addLayer(config);
			});

			data.landUsePatterns.forEach(async (pattern) => {
				const imageData = await convertDataURLToImageData(pattern.pattern);
				map.addImage(pattern.combo, imageData, { pixelRatio: devicePixelRatio });
			});

			const rightsTypeImageData = await convertDataURLToImageData(data.rightsTypePattern);
			map.addImage('rights-type', rightsTypeImageData, { pixelRatio: devicePixelRatio });
		});

		map.on('click', LAYER_CONFIG.reservations.id, (e) => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: ['reservations']
			});

			if (features.length > 0) {
				const clickedReservation = features[0].properties.reservation_name;

				reservation.set(clickedReservation);
			}
		});

		map.on('click', (event) => {
			let renderedLayers: string[] = [];

			switch ($view) {
				case 'Acreage':
					renderedLayers = Object.values(ACREAGE_LAYER_CONFIG)
						.filter((layerConfig) => layerConfig.type === 'fill')
						.map((config) => config.id);
					break;
				case 'Land use':
					renderedLayers = Object.values(LAND_USE_LAYER_CONFIG)
						.filter((layerConfig) => layerConfig.type === 'fill')
						.map((config) => config.id);
					break;
				case 'Rights type':
					renderedLayers = Object.values(RIGHTS_TYPE_LAYER_CONFIG)
						.filter((layerConfig) => layerConfig.type === 'fill')
						.map((config) => config.id);
					break;
			}

			const features = map.queryRenderedFeatures(event.point, { layers: renderedLayers });

			if (features.length > 0) {
				const parcelPopup = new maplibregl.Popup({
					closeButton: false,
					closeOnClick: true
				});

				const coordinates = event.lngLat;
				let index = 0;

				// Pagination functions.
				function next() {
					index++;
					if (index >= features.length) {
						index = 0;
					}

					parcelPopup.setHTML(setParcelPopupHTML(features, index));

					document
						.getElementById(`popup-pagination-previous-${features[index].properties.object_id}`)
						?.addEventListener('click', previous);
					document
						.getElementById(`popup-pagination-next-${features[index].properties.object_id}`)
						?.addEventListener('click', next);
				}

				function previous() {
					index--;
					if (index < 0) {
						index = features.length - 1;
					}

					parcelPopup.setHTML(setParcelPopupHTML(features, index));

					document
						.getElementById(`popup-pagination-previous-${features[index].properties.object_id}`)
						?.addEventListener('click', previous);
					document
						.getElementById(`popup-pagination-next-${features[index].properties.object_id}`)
						?.addEventListener('click', next);
				}

				// Set the popup.
				parcelPopup.setLngLat(coordinates);
				parcelPopup.setHTML(setParcelPopupHTML(features, index)).addTo(map);
				map.flyTo({ center: coordinates });

				// Add event listeners.
				document
					.getElementById(`popup-pagination-previous-${features[index].properties.object_id}`)
					?.addEventListener('click', previous);
				document
					.getElementById(`popup-pagination-next-${features[index].properties.object_id}`)
					?.addEventListener('click', next);
			}
		});
	});

	$: if (map) {
		const bounds = data.reservationStats[$reservation].bounds;
		map.fitBounds(bounds, {
			padding:
				innerWidth > 640
					? { top: 50, bottom: 50, left: 350, right: 0 }
					: { top: 20, left: 20, right: 20, bottom: innerHeight / 3 }
		});
	}

	onDestroy(() => {
		map?.remove();
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="absolute inset-0 overflow-hidden font-sans">
	<div id="stlor-map" class="h-full w-full" />
	{#if map}
		<Menu {map} />
		<Legend />
		<ExpandLegend />
		<Search {map} />
	{/if}
</div>
