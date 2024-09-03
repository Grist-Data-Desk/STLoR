<script lang="ts">
	import maplibregl, { type Map } from 'maplibre-gl';
	import { onDestroy, onMount, getContext } from 'svelte';
	import * as pmtiles from 'pmtiles';

	import Menu from '$lib/components/menu/Menu.svelte';
	import { SOURCE_CONFIG, LAYER_CONFIG, ACREAGE_LAYER_CONFIG } from '$lib/utils/config';
	import { BASEMAP_STYLE } from '$lib/utils/style';
	import { reservation } from '$lib/stores/reservation';
	import type { Data } from '$lib/types';
	import { INITIAL_BOUNDS } from '$lib/utils/constants';
	import Legend from '$lib/components/legend/Legend.svelte';
	import Search from '$lib/components/search/Search.svelte';
	import { convertDataURLToImageData } from '$lib/utils/pattern';

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
			style: BASEMAP_STYLE,
			center: [-105.93, 40.36],
			zoom: tabletOrAbove ? 8.5 : 7.6,
			minZoom: 2
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

			const uncategorizedImageData = await convertDataURLToImageData(data.uncategorizedPattern);
			map.addImage('uncategorized', uncategorizedImageData, { pixelRatio: devicePixelRatio });

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

		map.on('click', ACREAGE_LAYER_CONFIG.stlors.id, (e) => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: ['stlors']
			});

			if (features.length > 0) {
				for (const feature of features) {
					console.log(
						feature.properties.clipped_acres,
						feature.properties.land_use,
						feature.properties.rights_type
					);
				}
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
<div class="h-screen w-screen font-sans">
	<div id="stlor-map" class="h-full w-full grow" />
	{#if map}
		<!-- {#if innerWidth <= 640}
			<h1
				class="border-earth absolute left-[3%] top-0 w-[94%] rounded-b border-x border-b bg-gray-100/75 px-4 py-2 font-serif shadow-xl backdrop-blur"
			>
				State trust lands on reservations
			</h1>
		{/if} -->
		<Menu {map} />
		<Legend />
		<Search {map} />
	{/if}
</div>
