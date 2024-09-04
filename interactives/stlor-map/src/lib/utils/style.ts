import type { StyleSpecification } from 'maplibre-gl';

export const BASEMAP_STYLE: StyleSpecification = {
	version: 8,
	name: 'Terrain (vector on Stadia)',
	metadata: { 'maputnik:renderer': 'mlgljs' },
	center: [-89.35835562648674, 43.21634985542326],
	zoom: 13.348999,
	sources: {
		global_landcover_v1: {
			type: 'vector',
			maxzoom: 6,
			scheme: 'xyz',
			url: 'https://tiles.stadiamaps.com/data/global_landcover_v1.json'
		},
		stamen_null: {
			type: 'vector',
			scheme: 'xyz',
			url: 'https://tiles.stadiamaps.com/data/stamen_null.json'
		},
		terrarium: {
			type: 'raster-dem',
			encoding: 'terrarium',
			maxzoom: 12,
			tileSize: 256,
			url: 'https://tiles.stadiamaps.com/data/terrarium.json'
		},
		'stamen-omt': {
			type: 'vector',
			scheme: 'xyz',
			url: 'https://tiles.stadiamaps.com/data/stamen-omt.json'
		}
	},
	sprite: 'https://tiles.stadiamaps.com/styles/stamen-terrain/sprite',
	glyphs: 'https://tiles.stadiamaps.com/fonts/{fontstack}/{range}.pbf',
	layers: [
		{
			id: 'hillshade',
			type: 'hillshade',
			source: 'terrarium',
			layout: { visibility: 'visible' },
			paint: {
				'hillshade-accent-color': 'hsla(0, 0%, 0%, 0)',
				'hillshade-exaggeration': 0.6,
				'hillshade-highlight-color': 'hsla(0, 0%, 0%, 0)',
				'hillshade-illumination-direction': 300,
				'hillshade-shadow-color': 'hsl(115, 0%, 75%)'
			}
		},
		{
			id: 'waterway-shadow',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'waterway',
			minzoom: 6,
			layout: {
				'line-cap': ['step', ['zoom'], 'butt', 11, 'round'],
				'line-join': ['step', ['zoom'], 'miter', 11, 'round']
			},
			paint: {
				'line-color': 'hsl(229, 37%, 69%)',
				'line-opacity': ['interpolate', ['linear'], ['zoom'], 6, 0.6, 9, 1],
				'line-translate': [
					'interpolate',
					['exponential', 1.2],
					['zoom'],
					7,
					['literal', [0, 0]],
					16,
					['literal', [-1, -1]]
				],
				'line-translate-anchor': 'viewport',
				'line-width': ['interpolate', ['exponential', 1.3], ['zoom'], 8, 0.5, 9, 1, 20, 3]
			}
		},
		{
			id: 'water-shadow',
			type: 'fill',
			source: 'stamen-omt',
			'source-layer': 'water',
			minzoom: 10,
			layout: {},
			paint: {
				'fill-color': 'hsl(229, 37%, 69%)',
				'fill-translate': [
					'interpolate',
					['exponential', 1.2],
					['zoom'],
					7,
					['literal', [0, 0]],
					16,
					['literal', [-1, -1]]
				],
				'fill-translate-anchor': 'viewport'
			}
		},
		{
			id: 'waterway',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'waterway',
			minzoom: 3,
			layout: {
				'line-cap': ['step', ['zoom'], 'butt', 11, 'round'],
				'line-join': ['step', ['zoom'], 'miter', 11, 'round']
			},
			paint: {
				'line-color': 'hsl(209, 33%, 70%)',
				'line-width': ['interpolate', ['exponential', 1.3], ['zoom'], 8, 0.5, 9, 1, 20, 3]
			}
		},
		{
			id: 'waterway_outer_glow',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'waterway',
			minzoom: 4,
			layout: {
				'line-cap': ['step', ['zoom'], 'butt', 11, 'round'],
				'line-join': ['step', ['zoom'], 'miter', 11, 'round']
			},
			paint: {
				'line-blur': ['interpolate', ['linear'], ['zoom'], 6, 5, 12, 10],
				'line-color': 'hsl(209, 33%, 70%)',
				'line-opacity': ['interpolate', ['linear'], ['zoom'], 6, 0.2, 7, 0.4],
				'line-width': ['interpolate', ['linear'], ['zoom'], 6, 5, 12, 10]
			}
		},
		{
			id: 'water',
			type: 'fill',
			source: 'stamen-omt',
			'source-layer': 'water',
			layout: {},
			paint: { 'fill-color': 'hsl(209, 33%, 70%)' }
		},
		{
			id: 'wetland',
			type: 'fill',
			source: 'stamen-omt',
			'source-layer': 'landuse_overlay',
			minzoom: 5,
			filter: ['match', ['get', 'class'], ['wetland', 'wetland_noveg'], true, false],
			paint: {
				'fill-color': 'hsl(151, 32%, 76%)',
				'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.6, 10.5, 0.75]
			}
		},
		{
			id: 'wetland_outer_glow',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'landuse_overlay',
			maxzoom: 12,
			filter: ['match', ['get', 'class'], ['wetland', 'wetland_noveg'], true, false],
			layout: { 'line-join': 'round' },
			paint: {
				'line-blur': ['interpolate', ['linear'], ['zoom'], 2, 7, 22, 6],
				'line-color': 'hsl(151, 32%, 76%)',
				'line-opacity': ['interpolate', ['exponential', 1.5], ['zoom'], 8, 0.8, 12, 0],
				'line-width': 6
			}
		},
		{
			id: 'road-pedestrian-polygon-fill',
			type: 'fill',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 14,
			filter: [
				'all',
				['match', ['get', 'class'], ['path', 'pedestrian'], true, false],
				true,
				['case', ['has', 'layer'], ['>=', ['get', 'layer'], 0], true],
				['==', ['geometry-type'], 'Polygon']
			],
			paint: { 'fill-color': 'hsl(60, 2%, 88%)' }
		},
		{
			id: 'road-pedestrian-polygon-pattern',
			type: 'fill',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 16,
			filter: [
				'all',
				['match', ['get', 'class'], ['path', 'pedestrian'], true, false],
				true,
				['case', ['has', 'layer'], ['>=', ['get', 'layer'], 0], true],
				['==', ['geometry-type'], 'Polygon']
			],
			paint: {
				'fill-opacity': ['interpolate', ['linear'], ['zoom'], 16, 0, 17, 1],
				'fill-pattern': 'pedestrian-polygon'
			}
		},
		{
			id: 'road-path',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 12,
			filter: [
				'all',
				['==', ['get', 'class'], 'path'],
				[
					'step',
					['zoom'],
					['!', ['match', ['get', 'subclass'], ['steps', 'sidewalk', 'crossing'], true, false]],
					16,
					['!=', ['get', 'subclass'], 'steps']
				],
				['!=', ['get', 'subclass'], 'pedestrian'],
				true,
				['!=', ['get', 'brunnel'], 'bridge'],
				['!=', ['get', 'brunnel'], 'tunnel'],
				['==', ['geometry-type'], 'LineString']
			],
			layout: { 'line-join': ['step', ['zoom'], 'miter', 14, 'round'] },
			paint: {
				'line-color': 'hsl(0, 0%, 50%)',
				'line-dasharray': ['step', ['zoom'], ['literal', [3, 4]], 17, ['literal', [2, 3]]],
				'line-width': [
					'interpolate',
					['exponential', 1.5],
					['zoom'],
					13,
					0.5,
					14,
					0.75,
					15,
					0.75,
					18,
					3
				]
			}
		},
		{
			id: 'road-steps',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 14,
			filter: [
				'all',
				['==', ['get', 'subclass'], 'steps'],
				true,
				['!=', ['get', 'brunnel'], 'bridge'],
				['!=', ['get', 'brunnel'], 'tunnel'],
				['==', ['geometry-type'], 'LineString']
			],
			layout: { 'line-join': 'round' },
			paint: {
				'line-color': 'hsl(60, 3%, 94%)',
				'line-dasharray': [
					'step',
					['zoom'],
					['literal', [1, 0]],
					15,
					['literal', [1.75, 1]],
					16,
					['literal', [1, 0.75]],
					17,
					['literal', [0.3, 0.3]]
				],
				'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 15, 1, 16, 1.6, 18, 6]
			}
		},
		{
			id: 'road-pedestrian',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 12,
			filter: [
				'all',
				['==', ['get', 'subclass'], 'pedestrian'],
				true,
				['case', ['has', 'layer'], ['>=', ['get', 'layer'], 0], true],
				['==', ['geometry-type'], 'LineString']
			],
			layout: { 'line-join': ['step', ['zoom'], 'miter', 14, 'round'] },
			paint: {
				'line-color': 'hsl(60, 3%, 59%)',
				'line-width': [
					'interpolate',
					['exponential', 1.5],
					['zoom'],
					13,
					0.5,
					14,
					0.75,
					15,
					1.2,
					18,
					4.5
				]
			}
		},
		{
			id: 'road-case-simple-ramp',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 6,
			filter: [
				'all',
				[
					'step',
					['zoom'],
					['match', ['get', 'class'], ['motorway', 'trunk'], true, false],
					7,
					['match', ['get', 'class'], ['motorway', 'trunk'], true, false],
					10,
					['match', ['get', 'class'], ['motorway', 'trunk'], true, false],
					11,
					['match', ['get', 'class'], ['motorway', 'trunk'], true, false]
				],
				true,
				['!=', ['get', 'brunnel'], 'bridge'],
				['!=', ['get', 'brunnel'], 'tunnel'],
				['==', ['get', 'ramp'], 1],
				['==', ['geometry-type'], 'LineString']
			],
			layout: {},
			paint: {
				'line-color': 'hsl(0, 0%, 100%)',
				'line-gap-width': [
					'interpolate',
					['exponential', 1.5],
					['zoom'],
					12,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 1, 0.5],
					13,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 1.5, 0.5],
					15,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 2, 1],
					18,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 18, 10],
					22,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 180, 100]
				],
				'line-opacity': ['interpolate', ['exponential', 1.5], ['zoom'], 6, 0, 7, 1],
				'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, 0.6, 8, 0.7, 12, 2]
			}
		},
		{
			id: 'road-case-simple',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 6,
			filter: [
				'all',
				[
					'step',
					['zoom'],
					['match', ['get', 'class'], ['motorway', 'trunk'], true, false],
					12,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary', 'secondary', 'tertiary'],
						true,
						false
					],
					15,
					['match', ['get', 'class'], ['motorway', 'trunk'], true, false]
				],
				true,
				['!=', ['get', 'brunnel'], 'bridge'],
				['!=', ['get', 'brunnel'], 'tunnel'],
				['!=', ['get', 'ramp'], 1],
				['==', ['geometry-type'], 'LineString']
			],
			layout: {},
			paint: {
				'line-color': 'hsl(0, 0%, 100%)',
				'line-gap-width': [
					'interpolate',
					['exponential', 1.5],
					['zoom'],
					6,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						0.6,
						['primary', 'secondary', 'tertiary'],
						0.1,
						0
					],
					7,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						1,
						['primary', 'secondary', 'tertiary'],
						0.4,
						0
					],
					8,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						1.5,
						['primary', 'secondary', 'tertiary'],
						0.4,
						0
					],
					12,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						4,
						['primary', 'secondary', 'tertiary'],
						2.2,
						['minor', 'street_limited'],
						1,
						0.5
					],
					13,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						4,
						['primary', 'secondary', 'tertiary'],
						3.5,
						['motorway_link', 'trunk_link', 'primary_link', 'minor', 'street_limited'],
						1.5,
						0.5
					],
					15,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						6,
						['primary', 'secondary', 'tertiary'],
						5,
						['motorway_link', 'trunk_link', 'primary_link', 'minor', 'street_limited'],
						3,
						1.5
					],
					18,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary'],
						32,
						['secondary', 'tertiary'],
						26,
						['minor', 'street_limited'],
						18,
						10
					],
					22,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary'],
						320,
						['secondary', 'tertiary'],
						260,
						['minor', 'street_limited'],
						180,
						100
					]
				],
				'line-opacity': ['interpolate', ['exponential', 1.5], ['zoom'], 6, 0, 7, 1],
				'line-width': [
					'interpolate',
					['exponential', 1.5],
					['zoom'],
					5,
					0.6,
					8,
					0.7,
					12,
					['match', ['get', 'class'], ['motorway', 'trunk'], 2, 1.2]
				]
			}
		},
		{
			id: 'road-simple-ramp',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 10,
			filter: [
				'all',
				[
					'step',
					['zoom'],
					['match', ['get', 'class'], ['motorway'], true, false],
					10,
					['match', ['get', 'class'], ['motorway', 'trunk'], true, false],
					13,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], true, false],
					14,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary', 'secondary', 'tertiary'],
						true,
						false
					]
				],
				['==', ['get', 'ramp'], 1],
				true,
				['==', ['geometry-type'], 'LineString']
			],
			layout: {
				'line-cap': ['step', ['zoom'], 'butt', 14, 'round'],
				'line-join': ['step', ['zoom'], 'miter', 14, 'round']
			},
			paint: {
				'line-color': [
					'interpolate',
					['linear'],
					['zoom'],
					5.9,
					[
						'match',
						['get', 'class'],
						['primary', 'secondary', 'tertiary'],
						'hsl(0, 0%, 100%)',
						'hsl(0, 1%, 100%)'
					],
					6,
					['match', ['get', 'class'], ['motorway'], 'hsl(0, 0%, 46%)', 'hsl(0, 0%, 100%)'],
					9,
					['match', ['get', 'class'], ['motorway'], 'hsl(0, 0%, 46%)', 'hsl(0, 0%, 100%)'],
					22,
					[
						'match',
						['get', 'class'],
						['primary', 'secondary', 'tertiary'],
						'hsl(0, 0%, 59%)',
						'hsl(0, 0%, 62%)'
					]
				],
				'line-width': [
					'interpolate',
					['exponential', 1.5],
					['zoom'],
					12,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 1, 0.5],
					13,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 1.5, 0.5],
					15,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 2, 1],
					18,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 18, 10],
					22,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 180, 100]
				]
			}
		},
		{
			id: 'road-simple',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 6,
			filter: [
				'all',
				[
					'step',
					['zoom'],
					['match', ['get', 'class'], ['motorway', 'trunk'], true, false],
					7,
					[
						'match',
						['get', 'class'],
						['motorway', 'motorway_link', 'trunk', 'primary'],
						true,
						false
					],
					8,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary', 'secondary'], true, false],
					10,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary', 'secondary', 'tertiary'],
						true,
						false
					],
					11,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'minor'],
						true,
						false
					],
					12,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'minor', 'street_limited'],
						true,
						false
					],
					13,
					[
						'match',
						['get', 'class'],
						[
							'motorway',
							'trunk',
							'primary',
							'secondary',
							'tertiary',
							'minor',
							'street_limited',
							'track'
						],
						true,
						false
					],
					14,
					[
						'match',
						['get', 'class'],
						[
							'motorway',
							'trunk',
							'primary',
							'secondary',
							'tertiary',
							'minor',
							'street_limited',
							'service',
							'track'
						],
						true,
						false
					]
				],
				['!=', ['get', 'ramp'], 1],
				true,
				['!=', ['get', 'brunnel'], 'bridge'],
				['!=', ['get', 'brunnel'], 'tunnel'],
				['==', ['geometry-type'], 'LineString']
			],
			layout: {
				'line-cap': ['step', ['zoom'], 'butt', 14, 'round'],
				'line-join': ['step', ['zoom'], 'miter', 14, 'round']
			},
			paint: {
				'line-color': [
					'interpolate',
					['linear'],
					['zoom'],
					6.9,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary'],
						'hsl(0, 0%, 100%)',
						'hsl(0, 1%, 100%)'
					],
					7,
					['match', ['get', 'class'], ['motorway', 'trunk'], 'hsl(0, 0%, 59%)', 'hsl(0, 0%, 100%)'],
					9,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'motorway_link', 'primary', 'secondary'],
						'hsl(0, 0%, 59%)',
						'hsl(0, 0%, 100%)'
					],
					10,
					[
						'match',
						['get', 'class'],
						['motorway', 'motorway_link', 'trunk', 'trunk_link'],
						'hsl(0, 0%, 46%)',
						'hsl(0, 0%, 59%)'
					],
					22,
					[
						'match',
						['get', 'class'],
						['minor', 'street_limited', 'service', 'track'],
						'hsl(0, 0%, 59%)',
						'hsl(0, 0%, 62%)'
					]
				],
				'line-width': [
					'interpolate',
					['exponential', 1.5],
					['zoom'],
					6,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						0.6,
						['primary', 'secondary', 'tertiary'],
						0.1,
						0
					],
					7,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						1,
						['primary', 'secondary', 'tertiary'],
						0.4,
						0
					],
					8,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						1.5,
						['primary', 'secondary', 'tertiary'],
						0.4,
						0
					],
					12,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						4,
						['primary', 'secondary', 'tertiary'],
						2.2,
						['minor', 'street_limited'],
						1,
						0.5
					],
					13,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						4,
						['primary', 'secondary', 'tertiary'],
						3.5,
						['motorway_link', 'trunk_link', 'primary_link', 'minor', 'street_limited'],
						2,
						1
					],
					15,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						6,
						['primary', 'secondary', 'tertiary'],
						5,
						['motorway_link', 'trunk_link', 'primary_link', 'minor', 'street_limited'],
						4,
						2
					],
					18,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary'],
						32,
						['secondary', 'tertiary'],
						26,
						['minor', 'street_limited'],
						18,
						10
					],
					22,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary'],
						320,
						['secondary', 'tertiary'],
						260,
						['minor', 'street_limited'],
						180,
						100
					]
				]
			}
		},
		{
			id: 'road-rail',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 13,
			filter: [
				'all',
				['match', ['get', 'class'], ['rail'], true, false],
				true,
				['!=', ['get', 'brunnel'], 'bridge'],
				['!=', ['get', 'brunnel'], 'tunnel']
			],
			paint: {
				'line-color': [
					'interpolate',
					['linear'],
					['zoom'],
					13,
					'hsl(0, 0%, 60%)',
					16,
					'hsl(0, 0%, 64%)'
				],
				'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 14, 0.5, 20, 1]
			}
		},
		{
			id: 'road-rail-tracks',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 13,
			filter: [
				'all',
				['match', ['get', 'class'], ['rail'], true, false],
				true,
				['!=', ['get', 'brunnel'], 'bridge'],
				['!=', ['get', 'brunnel'], 'tunnel']
			],
			paint: {
				'line-color': [
					'interpolate',
					['linear'],
					['zoom'],
					13,
					'hsl(0, 0%, 60%)',
					16,
					'hsl(0, 0%, 64%)'
				],
				'line-dasharray': [0.2, 1],
				'line-opacity': ['interpolate', ['linear'], ['zoom'], 13.75, 0, 14, 1],
				'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 14, 4, 20, 8]
			}
		},
		{
			id: 'bridge-path',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 14,
			filter: [
				'all',
				['==', ['get', 'class'], 'path'],
				['!=', ['get', 'subclass'], 'steps'],
				['!=', ['get', 'subclass'], 'pedestrian'],
				['==', ['get', 'brunnel'], 'bridge'],
				['==', ['geometry-type'], 'LineString']
			],
			layout: {},
			paint: {
				'line-color': 'hsl(0, 0%, 50%)',
				'line-dasharray': ['step', ['zoom'], ['literal', [3, 4]], 17, ['literal', [2, 3]]],
				'line-width': [
					'interpolate',
					['exponential', 1.5],
					['zoom'],
					13,
					0.5,
					14,
					0.75,
					15,
					0.75,
					18,
					3
				]
			}
		},
		{
			id: 'bridge-steps',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 14,
			filter: [
				'all',
				['==', ['get', 'subclass'], 'steps'],
				['==', ['get', 'brunnel'], 'bridge'],
				['==', ['geometry-type'], 'LineString']
			],
			paint: {
				'line-color': 'hsl(60, 3%, 94%)',
				'line-dasharray': [
					'step',
					['zoom'],
					['literal', [1, 0]],
					15,
					['literal', [1.75, 1]],
					16,
					['literal', [1, 0.75]],
					17,
					['literal', [0.3, 0.3]]
				],
				'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 15, 1, 16, 1.6, 18, 6]
			}
		},
		{
			id: 'bridge-pedestrian',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 13,
			filter: [
				'all',
				['==', ['get', 'subclass'], 'pedestrian'],
				['==', ['get', 'brunnel'], 'bridge'],
				['==', ['geometry-type'], 'LineString']
			],
			paint: {
				'line-color': 'hsl(60, 3%, 94%)',
				'line-dasharray': [
					'step',
					['zoom'],
					['literal', [1, 0]],
					15,
					['literal', [1.5, 0.4]],
					16,
					['literal', [1, 0.2]]
				],
				'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 14, 0.5, 18, 12]
			}
		},
		{
			id: 'bridge-case-simple-ramp',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 13,
			filter: [
				'all',
				['==', ['get', 'brunnel'], 'bridge'],
				[
					'step',
					['zoom'],
					[
						'match',
						['get', 'class'],
						[
							'motorway',
							'trunk',
							'primary',
							'secondary',
							'tertiary',
							'minor',
							'street_limited',
							'track'
						],
						true,
						false
					],
					14,
					[
						'match',
						['get', 'class'],
						[
							'motorway',
							'trunk',
							'primary',
							'secondary',
							'tertiary',
							'minor',
							'street_limited',
							'service',
							'track'
						],
						true,
						false
					]
				],
				['==', ['get', 'ramp'], 1],
				['==', ['geometry-type'], 'LineString']
			],
			paint: {
				'line-color': 'hsl(0, 0%, 100%)',
				'line-gap-width': [
					'interpolate',
					['exponential', 1.5],
					['zoom'],
					12,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 1, 0.5],
					13,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 1.5, 0.5],
					15,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 2, 1],
					18,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 18, 10],
					22,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 180, 100]
				],
				'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, 0.6, 8, 0.7, 14, 2]
			}
		},
		{
			id: 'bridge-case-simple',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 12,
			filter: [
				'all',
				['==', ['get', 'brunnel'], 'bridge'],
				[
					'step',
					['zoom'],
					['match', ['get', 'class'], ['motorway', 'trunk'], true, false],
					11,
					[
						'match',
						['get', 'class'],
						[
							'motorway',
							'motorway_link',
							'trunk',
							'trunk_link',
							'primary',
							'secondary',
							'tertiary',
							'minor',
							'street_limited',
							'primary_link'
						],
						true,
						false
					],
					13,
					[
						'match',
						['get', 'class'],
						[
							'motorway',
							'trunk',
							'primary',
							'secondary',
							'tertiary',
							'minor',
							'street_limited',
							'track'
						],
						true,
						false
					],
					14,
					[
						'match',
						['get', 'class'],
						[
							'motorway',
							'trunk',
							'primary',
							'secondary',
							'tertiary',
							'minor',
							'street_limited',
							'service',
							'track'
						],
						true,
						false
					]
				],
				['!=', ['get', 'ramp'], 1],
				['==', ['geometry-type'], 'LineString']
			],
			layout: {},
			paint: {
				'line-color': 'hsl(0, 0%, 100%)',
				'line-gap-width': [
					'interpolate',
					['exponential', 1.5],
					['zoom'],
					6,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						0.6,
						['primary', 'secondary', 'tertiary'],
						0.1,
						0
					],
					7,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						1,
						['primary', 'secondary', 'tertiary'],
						0.4,
						0
					],
					8,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						1.5,
						['primary', 'secondary', 'tertiary'],
						0.4,
						0
					],
					12,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						4,
						['primary', 'secondary', 'tertiary'],
						2.2,
						['minor', 'street_limited'],
						1,
						0.5
					],
					13,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						4,
						['primary', 'secondary', 'tertiary'],
						3.5,
						['motorway_link', 'trunk_link', 'primary_link', 'minor', 'street_limited'],
						1.5,
						0.5
					],
					15,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						6,
						['primary', 'secondary', 'tertiary'],
						5,
						['motorway_link', 'trunk_link', 'primary_link', 'minor', 'street_limited'],
						3,
						1.5
					],
					18,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary'],
						32,
						['secondary', 'tertiary'],
						26,
						['minor', 'street_limited'],
						18,
						10
					],
					22,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary'],
						320,
						['secondary', 'tertiary'],
						260,
						['minor', 'street_limited'],
						180,
						100
					]
				],
				'line-width': 2
			}
		},
		{
			id: 'bridge-simple-ramp',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 13,
			filter: [
				'all',
				['==', ['get', 'brunnel'], 'bridge'],
				[
					'step',
					['zoom'],
					['match', ['get', 'class'], ['motorway', 'trunk'], true, false],
					13,
					[
						'match',
						['get', 'class'],
						[
							'motorway',
							'trunk',
							'primary',
							'secondary',
							'tertiary',
							'minor',
							'street_limited',
							'track'
						],
						true,
						false
					],
					14,
					[
						'match',
						['get', 'class'],
						[
							'motorway',
							'trunk',
							'primary',
							'secondary',
							'tertiary',
							'minor',
							'street_limited',
							'service',
							'track'
						],
						true,
						false
					]
				],
				['==', ['get', 'ramp'], 1],
				['==', ['geometry-type'], 'LineString']
			],
			layout: { 'line-cap': ['step', ['zoom'], 'butt', 14, 'round'] },
			paint: {
				'line-color': [
					'interpolate',
					['linear'],
					['zoom'],
					10,
					[
						'match',
						['get', 'class'],
						['motorway', 'motorway_link', 'trunk', 'trunk_link'],
						'hsl(0, 0%, 46%)',
						'hsl(0, 0%, 59%)'
					],
					22,
					[
						'match',
						['get', 'class'],
						['minor', 'street_limited', 'service', 'track'],
						'hsl(0, 0%, 59%)',
						'hsl(0, 0%, 62%)'
					]
				],
				'line-width': [
					'interpolate',
					['exponential', 1.5],
					['zoom'],
					12,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 1, 0.5],
					13,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 1.5, 0.5],
					15,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 2, 1],
					18,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 18, 10],
					22,
					['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], 180, 100]
				]
			}
		},
		{
			id: 'bridge-simple',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 12,
			filter: [
				'all',
				['==', ['get', 'brunnel'], 'bridge'],
				[
					'step',
					['zoom'],
					['match', ['get', 'class'], ['motorway', 'trunk'], true, false],
					12,
					[
						'match',
						['get', 'class'],
						[
							'motorway',
							'trunk',
							'primary',
							'secondary',
							'tertiary',
							'minor',
							'street_limited',
							'track'
						],
						true,
						false
					],
					14,
					[
						'match',
						['get', 'class'],
						[
							'motorway',
							'trunk',
							'primary',
							'secondary',
							'tertiary',
							'minor',
							'street_limited',
							'service',
							'track'
						],
						true,
						false
					]
				],
				['!=', ['get', 'ramp'], 1],
				['==', ['geometry-type'], 'LineString']
			],
			layout: { 'line-cap': ['step', ['zoom'], 'butt', 14, 'round'] },
			paint: {
				'line-color': [
					'interpolate',
					['linear'],
					['zoom'],
					6.9,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary'],
						'hsl(0, 0%, 100%)',
						'hsl(0, 1%, 100%)'
					],
					7,
					['match', ['get', 'class'], ['motorway', 'trunk'], 'hsl(0, 0%, 46%)', 'hsl(0, 0%, 100%)'],
					9,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'motorway_link', 'primary', 'secondary'],
						'hsl(0, 0%, 59%)',
						'hsl(0, 0%, 100%)'
					],
					10,
					[
						'match',
						['get', 'class'],
						['motorway', 'motorway_link', 'trunk', 'trunk_link'],
						'hsl(0, 0%, 46%)',
						'hsl(0, 0%, 59%)'
					],
					22,
					[
						'match',
						['get', 'class'],
						['minor', 'street_limited', 'service', 'track'],
						'hsl(0, 0%, 59%)',
						'hsl(0, 0%, 62%)'
					]
				],
				'line-width': [
					'interpolate',
					['exponential', 1.5],
					['zoom'],
					12,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						4,
						['primary', 'secondary', 'tertiary'],
						2.2,
						['minor', 'street_limited'],
						1,
						0.5
					],
					13,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						4,
						['primary', 'secondary', 'tertiary'],
						3.5,
						['motorway_link', 'trunk_link', 'primary_link', 'minor', 'street_limited'],
						2,
						1
					],
					15,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk'],
						6,
						['primary', 'secondary', 'tertiary'],
						5,
						['motorway_link', 'trunk_link', 'primary_link', 'minor', 'street_limited'],
						4,
						2
					],
					18,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary'],
						32,
						['secondary', 'tertiary'],
						26,
						['minor', 'street_limited'],
						18,
						10
					],
					22,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary'],
						320,
						['secondary', 'tertiary'],
						260,
						['minor', 'street_limited'],
						180,
						100
					]
				]
			}
		},
		{
			id: 'bridge-rail',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 13,
			filter: [
				'all',
				['==', ['get', 'brunnel'], 'bridge'],
				['match', ['get', 'class'], ['rail'], true, false]
			],
			paint: {
				'line-color': [
					'interpolate',
					['linear'],
					['zoom'],
					13,
					'hsl(0, 0%, 60%)',
					16,
					'hsl(0, 0%, 64%)'
				],
				'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 14, 0.5, 20, 1]
			}
		},
		{
			id: 'bridge-rail-tracks',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 13,
			filter: [
				'all',
				['==', ['get', 'brunnel'], 'bridge'],
				['match', ['get', 'class'], ['rail'], true, false]
			],
			paint: {
				'line-color': [
					'interpolate',
					['linear'],
					['zoom'],
					13,
					'hsl(0, 0%, 60%)',
					16,
					'hsl(0, 0%, 64%)'
				],
				'line-dasharray': [0.2, 1],
				'line-opacity': ['interpolate', ['linear'], ['zoom'], 13.75, 0, 14, 1],
				'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 14, 4, 20, 8]
			}
		},
		{
			id: 'aerialway',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 12,
			filter: ['==', ['get', 'class'], 'aerialway'],
			paint: {
				'line-color': 'hsl(60, 2%, 40%)',
				'line-dasharray': [4, 1],
				'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 14, 1, 20, 2]
			}
		},
		{
			id: 'subnational-boundary-bg',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'boundary',
			minzoom: 2.5,
			filter: [
				'all',
				['match', ['get', 'admin_level'], [3, 4], true, false],
				['==', ['get', 'maritime'], 0]
			],
			layout: { 'line-cap': 'round', 'line-join': 'round' },
			paint: { 'line-color': 'hsla(0, 1%, 85%, 0.2)', 'line-width': 3.5 }
		},
		{
			id: 'subnational-boundary',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'boundary',
			minzoom: 2.5,
			filter: [
				'all',
				['match', ['get', 'admin_level'], [3, 4], true, false],
				['==', ['get', 'maritime'], 0]
			],
			layout: { 'line-cap': 'round', 'line-join': 'round' },
			paint: {
				'line-color': 'hsl(0, 1%, 47%)',
				'line-dasharray': ['step', ['zoom'], ['literal', [1, 2.5]], 6, ['literal', [0.5, 2.5]]],
				'line-width': 1.5
			}
		},
		{
			id: 'national-boundary-bg',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'boundary',
			minzoom: 2.5,
			filter: ['all', ['==', ['get', 'admin_level'], 2], ['==', ['get', 'maritime'], 0]],
			layout: { 'line-cap': 'round', 'line-join': 'round' },
			paint: { 'line-color': 'hsla(0, 1%, 85%, 0.2)', 'line-width': 4 }
		},
		{
			id: 'national-boundary',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'boundary',
			minzoom: 1.5,
			filter: [
				'all',
				['==', ['get', 'admin_level'], 2],
				['==', ['get', 'disputed'], 0],
				['==', ['get', 'maritime'], 0]
			],
			layout: { 'line-cap': 'round', 'line-join': 'round' },
			paint: {
				'line-color': 'hsl(0, 1%, 40%)',
				'line-dasharray': ['step', ['zoom'], ['literal', [1.25, 2.5]], 8, ['literal', [0.75, 3]]],
				'line-width': 2
			}
		},
		{
			id: 'national-boundary-disputed',
			type: 'line',
			source: 'stamen-omt',
			'source-layer': 'boundary',
			minzoom: 2,
			filter: [
				'all',
				['==', ['get', 'admin_level'], 2],
				[
					'any',
					['all', ['==', ['get', 'disputed'], 1], ['==', ['get', 'maritime'], 0]],
					[
						'match',
						['id'],
						[
							238797482, 330695990, 330696000, 330696028, 330696042, 731895849, 731896898,
							130207714, 919865757, 130072456, 130207737, 722542321, 722542322, 910464113, 216249910
						],
						true,
						false
					]
				]
			],
			layout: { 'line-cap': 'round', 'line-join': 'round' },
			paint: {
				'line-color': 'hsla(0, 1%, 40%, 0.8)',
				'line-dasharray': [
					'step',
					['zoom'],
					['literal', [0.001, 1.5]],
					4,
					['literal', [0.001, 2.5]],
					7,
					['literal', [0.001, 3]]
				],
				'line-width': 3
			}
		},
		{
			id: 'road-label-simple',
			type: 'symbol',
			source: 'stamen-omt',
			'source-layer': 'transportation_name',
			minzoom: 12,
			filter: [
				'all',
				true,
				['!=', ['get', 'brunnel'], 'bridge'],
				['!=', ['get', 'brunnel'], 'tunnel'],
				['has', 'name'],
				[
					'match',
					['get', 'class'],
					['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'minor', 'street_limited'],
					true,
					false
				]
			],
			layout: {
				'symbol-placement': 'line',
				'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']],
				'text-font': ['PT Sans Narrow Regular,Inter Regular'],
				'text-letter-spacing': 0.05,
				'text-max-angle': 30,
				'text-padding': 10,
				'text-pitch-alignment': 'viewport',
				'text-size': [
					'interpolate',
					['linear'],
					['zoom'],
					10,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary', 'secondary', 'tertiary'],
						13,
						11
					],
					18,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary', 'secondary', 'tertiary'],
						20,
						18
					]
				]
			},
			paint: {
				'text-color': 'hsl(0,0%, 0%)',
				'text-halo-color': 'hsl(0, 0%, 100%)',
				'text-halo-width': 1.5
			}
		},
		{
			id: 'road-number-shield',
			type: 'symbol',
			source: 'stamen-omt',
			'source-layer': 'transportation_name',
			minzoom: 9.5,
			filter: [
				'all',
				['<=', ['get', 'ref_length'], 6],
				['match', ['get', 'class'], ['pedestrian', 'service', 'motorway_link'], false, true]
			],
			layout: {
				'icon-image': [
					'match',
					['get', 'network'],
					['us-interstate', 'us-highway'],
					['concat', 'shield-', ['get', 'network'], '-', ['to-string', ['get', 'ref_length']]],
					['concat', 'shield-rectangle-white', '-', ['to-string', ['get', 'ref_length']]]
				],
				'icon-rotation-alignment': 'viewport',
				'symbol-placement': 'line',
				'symbol-spacing': ['interpolate', ['linear'], ['zoom'], 11, 400, 14, 600],
				'text-field': ['get', 'ref'],
				'text-font': ['PT Sans Bold,Inter Bold'],
				'text-letter-spacing': 0.05,
				'text-max-angle': 38,
				'text-rotation-alignment': 'viewport',
				'text-size': 9
			},
			paint: {
				'text-color': [
					'case',
					['match', ['get', 'network'], ['us-interstate'], true, false],
					'hsl(0, 0%, 100%)',
					'hsl(230, 11%, 13%)'
				]
			}
		},
		{
			id: 'ferry-aerialway-label',
			type: 'symbol',
			source: 'stamen-omt',
			'source-layer': 'transportation',
			minzoom: 15,
			filter: ['match', ['get', 'class'], 'aerialway', true, false],
			layout: {
				'symbol-placement': 'line',
				'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']],
				'text-font': ['PT Sans Narrow Regular,Inter Regular'],
				'text-letter-spacing': 0.01,
				'text-max-angle': 30,
				'text-padding': 1,
				'text-pitch-alignment': 'viewport',
				'text-size': ['interpolate', ['linear'], ['zoom'], 10, 7.15, 18, 14.3]
			},
			paint: {
				'text-color': ['match', ['get', 'class'], 'ferry', 'hsl(0, 0%, 100%)', 'hsl(60, 2%, 40%)'],
				'text-halo-blur': 1,
				'text-halo-color': [
					'match',
					['get', 'class'],
					'ferry',
					'hsl(209, 33%, 70%)',
					'hsl(0, 0%, 94%)'
				],
				'text-halo-width': 1
			}
		},
		{
			id: 'natural-line-label',
			type: 'symbol',
			source: 'stamen-omt',
			'source-layer': 'natural_label',
			minzoom: 4,
			filter: [
				'all',
				[
					'match',
					['get', 'class'],
					['glacier', 'landform', 'disputed_glacier', 'disputed_landform'],
					true,
					false
				],
				['<=', ['get', 'rank'], 4],
				['==', ['geometry-type'], 'LineString']
			],
			layout: {
				'symbol-placement': 'line-center',
				'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']],
				'text-font': ['PT Sans Narrow Regular,Inter Regular'],
				'text-max-angle': 30,
				'text-pitch-alignment': 'viewport',
				'text-size': [
					'step',
					['zoom'],
					['step', ['get', 'sizerank'], 18, 5, 12],
					17,
					['step', ['get', 'sizerank'], 18, 13, 12]
				]
			},
			paint: {
				'text-color': 'hsl(340, 10%, 38%)',
				'text-halo-blur': 0.5,
				'text-halo-color': 'hsl(0, 0%, 94%)',
				'text-halo-width': 0.5
			}
		},
		{
			id: 'natural-point-label',
			type: 'symbol',
			source: 'stamen-omt',
			'source-layer': 'mountain_peak',
			filter: [
				'all',
				['!=', ['get', 'class'], 'cliff'],
				['has', 'ele'],
				[
					'step',
					['zoom'],
					['>', ['get', 'ele'], 4000],
					11,
					['>', ['get', 'ele'], 3000],
					12,
					['>', ['get', 'ele'], 2000],
					14,
					true
				]
			],
			layout: {
				'icon-image': 'mountain',
				'text-field': ['concat', ['get', 'name'], '\n', ['get', 'ele'], ' m'],
				'text-font': ['PT Sans Italic,Inter Italic'],
				'text-justify': 'right',
				'text-offset': [0, 0.4],
				'text-size': 14,
				'text-variable-anchor': ['bottom-right']
			},
			paint: {
				'text-color': 'hsl(340, 10%, 15%)',
				'text-halo-color': 'hsla(0, 0%, 100%, .6)',
				'text-halo-width': 2
			}
		},
		{
			id: 'water-line-label',
			type: 'symbol',
			source: 'stamen-omt',
			'source-layer': 'water_name',
			minzoom: 1,
			filter: [
				'all',
				['match', ['get', 'class'], ['lake', 'sea', 'ocean'], true, false],
				['==', ['geometry-type'], 'LineString']
			],
			layout: {
				'symbol-placement': 'line-center',
				'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']],
				'text-font': ['PT Sans Italic,Inter Italic'],
				'text-letter-spacing': [
					'match',
					['get', 'class'],
					'ocean',
					0.25,
					['sea', 'bay'],
					0.15,
					0.1
				],
				'text-max-angle': 30,
				'text-pitch-alignment': 'viewport',
				'text-size': [
					'interpolate',
					['linear'],
					['zoom'],
					1,
					13,
					2,
					['match', ['get', 'class'], ['ocean'], 15, 12],
					9,
					['match', ['get', 'class'], ['ocean', 'sea'], 25, 12],
					22,
					14
				]
			},
			paint: {
				'text-color': 'hsl(209, 33%, 45%)',
				'text-halo-color': 'hsl(209, 33%, 70%)'
			}
		},
		{
			id: 'waterway-label',
			type: 'symbol',
			source: 'stamen-omt',
			'source-layer': 'waterway',
			minzoom: 13,
			filter: [
				'all',
				['match', ['get', 'class'], ['river', 'stream'], true, false],
				['==', ['geometry-type'], 'LineString']
			],
			layout: {
				'symbol-placement': 'line',
				'symbol-spacing': ['interpolate', ['linear'], ['zoom'], 13, 400, 18, 600],
				'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']],
				'text-font': ['PT Sans Italic,Inter Italic'],
				'text-max-angle': 30,
				'text-offset': [0, -0.5],
				'text-pitch-alignment': 'viewport',
				'text-size': ['interpolate', ['linear'], ['zoom'], 13, 15, 18, 17]
			},
			paint: {
				'text-color': 'hsl(209, 33%, 45%)',
				'text-halo-color': 'hsl(209, 33%, 70%)',
				'text-halo-width': 1.5
			}
		},
		{
			id: 'water-point-label',
			type: 'symbol',
			source: 'stamen-omt',
			'source-layer': 'water_name',
			minzoom: 1,
			filter: [
				'all',
				[
					'step',
					['zoom'],
					['==', ['get', 'class'], 'ocean'],
					3,
					['match', ['get', 'class'], ['ocean', 'sea'], true, false],
					7,
					['match', ['get', 'class'], ['lake', 'sea', 'ocean'], true, false]
				],
				['==', ['geometry-type'], 'Point']
			],
			layout: {
				'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']],
				'text-font': ['PT Sans Italic,Inter Italic'],
				'text-letter-spacing': [
					'match',
					['get', 'class'],
					'ocean',
					0.25,
					['bay', 'sea'],
					0.15,
					0.1
				],
				'text-line-height': 1.1,
				'text-max-width': ['match', ['get', 'class'], 'ocean', 8, ['sea', 'bay', 'lake'], 7, 10],
				'text-size': [
					'interpolate',
					['linear'],
					['zoom'],
					1,
					13,
					2,
					['match', ['get', 'class'], ['ocean'], 15, 12],
					9,
					['match', ['get', 'class'], ['ocean', 'sea'], 25, 12],
					22,
					14
				]
			},
			paint: {
				'text-color': 'hsl(209, 33%, 45%)',
				'text-halo-color': 'hsl(209, 33%, 70%)',
				'text-halo-width': 1.5
			}
		},
		{
			id: 'park-label',
			type: 'symbol',
			source: 'stamen-omt',
			'source-layer': 'poi',
			minzoom: 12.5,
			filter: [
				'all',
				['==', ['get', 'subclass'], 'park'],
				[
					'step',
					['zoom'],
					['any', ['has', 'name:ru'], ['has', 'name:zh'], ['has', 'name:kn']],
					16,
					true
				]
			],
			layout: {
				'text-field': ['get', 'name'],
				'text-font': ['PT Sans Narrow Regular,Inter Regular'],
				'text-max-width': 6,
				'text-size': [
					'case',
					['any', ['has', 'name:ru'], ['has', 'name:zh'], ['has', 'name:kn']],
					20,
					17
				]
			},
			paint: {
				'text-color': 'hsl(90, 13%, 40%)',
				'text-halo-color': 'hsl(64, 32%, 79%)',
				'text-halo-width': 2
			}
		},
		{
			id: 'airport-label',
			type: 'symbol',
			source: 'stamen-omt',
			'source-layer': 'aerodrome_label',
			minzoom: 10.5,
			filter: [
				'all',
				[
					'match',
					['get', 'class'],
					['military', 'international', 'other', 'regional', 'public'],
					true,
					false
				],
				[
					'step',
					['zoom'],
					[
						'all',
						['has', 'icao'],
						['match', ['get', 'class'], ['international', 'military'], true, false]
					],
					12,
					[
						'all',
						['has', 'icao'],
						[
							'match',
							['get', 'class'],
							['international', 'military', 'other', 'regional'],
							true,
							false
						]
					],
					14,
					true
				]
			],
			layout: {
				'icon-image': [
					'case',
					['match', ['get', 'icao'], ['KXMR', 'KMHV'], true, false],
					'terrain-airport-intergalactic',
					'terrain-airport'
				],
				'text-anchor': 'top',
				'text-field': [
					'step',
					['zoom'],
					['get', 'iata'],
					12,
					['coalesce', ['get', 'name_en'], ['get', 'name']]
				],
				'text-font': ['PT Sans Narrow Regular,Inter Regular'],
				'text-letter-spacing': 0.01,
				'text-line-height': 1.1,
				'text-max-width': 9,
				'text-offset': [0, 0.8],
				'text-size': ['interpolate', ['linear'], ['zoom'], 13, 15, 18, 17]
			},
			paint: {
				'text-color': 'hsl(60, 2%, 40%)',
				'text-halo-color': 'hsl(0, 0%, 94%)',
				'text-halo-width': 1
			}
		},
		{
			id: 'neighborhood-label',
			type: 'symbol',
			source: 'stamen-omt',
			'source-layer': 'place',
			minzoom: 10,
			maxzoom: 14,
			filter: [
				'all',
				['match', ['get', 'class'], ['suburb', 'quarter', 'neighbourhood'], true, false],
				['<=', ['get', 'rank'], 24]
			],
			layout: {
				'symbol-sort-key': ['get', 'rank'],
				'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']],
				'text-font': ['PT Sans Narrow Regular,Inter Regular'],
				'text-justify': 'auto',
				'text-line-height': 1.1,
				'text-max-width': 7,
				'text-padding': 5,
				'text-size': [
					'interpolate',
					['cubic-bezier', 0.2, 0, 0.9, 1],
					['zoom'],
					10,
					['match', ['get', 'class'], ['suburb'], 12, 10],
					11,
					['match', ['get', 'class'], ['suburb'], 16, 14],
					14,
					['match', ['get', 'class'], ['suburb'], 18, 14]
				]
			},
			paint: {
				'text-color': 'hsl(0, 2%, 16%)',
				'text-halo-blur': 1,
				'text-halo-color': [
					'interpolate',
					['linear'],
					['zoom'],
					3,
					'hsla(0, 0%, 100%, 0.85)',
					5,
					'hsla(0, 0%, 100%, 1.0)'
				],
				'text-halo-width': 1.5
			}
		},
		{
			id: 'null-island-label',
			type: 'symbol',
			source: 'stamen_null',
			'source-layer': 'null-island-label',
			minzoom: 17,
			layout: {
				'text-field': ['get', 'name'],
				'text-font': ['PT Sans Narrow Regular,Inter Regular'],
				'text-max-width': 6,
				'text-size': [
					'case',
					['any', ['has', 'name:ru'], ['has', 'name:zh'], ['has', 'name:kn']],
					20,
					17
				]
			},
			paint: {
				'text-color': 'hsl(0, 2%, 16%)',
				'text-halo-blur': 1,
				'text-halo-color': [
					'interpolate',
					['linear'],
					['zoom'],
					3,
					'hsla(0, 0%, 100%, 0.85)',
					5,
					'hsla(0, 0%, 100%, 1.0)'
				],
				'text-halo-width': 1.5
			}
		},
		{
			id: 'settlement-minor-label',
			type: 'symbol',
			source: 'stamen-omt',
			'source-layer': 'place',
			minzoom: 3,
			maxzoom: 13,
			filter: [
				'all',
				['match', ['get', 'class'], 'town', true, false],
				[
					'step',
					['zoom'],
					['<=', ['get', 'rank'], 6],
					7,
					['<=', ['get', 'rank'], 7],
					8,
					['<=', ['get', 'rank'], 11],
					9,
					['<=', ['get', 'rank'], 12],
					10,
					true
				]
			],
			layout: {
				'icon-image': [
					'step',
					['zoom'],
					['step', ['get', 'rank'], 'dot-11', 9, 'dot-10', 11, 'dot-9'],
					8,
					''
				],
				'symbol-sort-key': ['get', 'rank'],
				'text-anchor': ['step', ['zoom'], 'top-left', 8, 'center'],
				'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']],
				'text-font': ['PT Sans Narrow Regular,Inter Regular'],
				'text-justify': 'auto',
				'text-line-height': 1.1,
				'text-max-width': 4,
				'text-radial-offset': ['step', ['zoom'], 0.4, 8, 0],
				'text-size': [
					'interpolate',
					['cubic-bezier', 0.2, 0, 0.9, 1],
					['zoom'],
					6,
					['step', ['get', 'rank'], 14, 7, 12],
					8,
					['step', ['get', 'rank'], 16, 12, 14],
					13,
					['step', ['get', 'rank'], 18, 12, 16, 15, 14]
				]
			},
			paint: {
				'text-color': 'hsl(0, 2%, 16%)',
				'text-halo-blur': 1,
				'text-halo-color': [
					'interpolate',
					['linear'],
					['zoom'],
					3,
					'hsla(0, 0%, 100%, 0.85)',
					5,
					'hsla(0, 0%, 100%, 1.0)'
				],
				'text-halo-width': 1.5
			}
		},
		{
			id: 'settlement-major-label',
			type: 'symbol',
			source: 'stamen-omt',
			'source-layer': 'place',
			minzoom: 3,
			maxzoom: 12,
			filter: [
				'all',
				['match', ['get', 'class'], 'city', true, false],
				[
					'step',
					['zoom'],
					false,
					2,
					['<=', ['get', 'rank'], 3],
					4,
					['<=', ['get', 'rank'], 4],
					5,
					['<=', ['get', 'rank'], 5],
					6,
					['<=', ['get', 'rank'], 7],
					7,
					['<=', ['get', 'rank'], 8],
					8,
					['<=', ['get', 'rank'], 11],
					9,
					true
				]
			],
			layout: {
				'icon-image': [
					'step',
					['zoom'],
					['step', ['get', 'rank'], 'dot-11', 9, 'dot-10', 11, 'dot-9'],
					8,
					''
				],
				'symbol-sort-key': ['get', 'rank'],
				'text-anchor': ['step', ['zoom'], 'top-left', 8, 'center'],
				'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']],
				'text-font': ['PT Sans Narrow Regular,Inter Regular'],
				'text-justify': 'auto',
				'text-line-height': 1.1,
				'text-max-width': 3,
				'text-radial-offset': ['step', ['zoom'], 0.4, 8, 0],
				'text-size': [
					'interpolate',
					['cubic-bezier', 0.2, 0, 0.9, 1],
					['zoom'],
					3,
					['step', ['get', 'rank'], 16, 2, 14],
					6,
					['step', ['get', 'rank'], 20, 2, 18, 3, 16, 4, 14],
					8,
					['step', ['get', 'rank'], 22, 4, 20, 6, 18],
					12,
					['step', ['get', 'rank'], 24, 4, 22, 6, 20]
				]
			},
			paint: {
				'text-color': 'hsl(0, 2%, 16%)',
				'text-halo-blur': 1,
				'text-halo-color': [
					'interpolate',
					['linear'],
					['zoom'],
					3,
					'hsla(0, 0%, 100%, 0.85)',
					5,
					'hsla(0, 0%, 100%, 1.0)'
				],
				'text-halo-width': 1.5
			}
		},
		{
			id: 'continent-label',
			type: 'symbol',
			source: 'stamen-omt',
			'source-layer': 'place',
			minzoom: 0,
			maxzoom: 1.5,
			filter: ['match', ['get', 'class'], ['continent'], true, false],
			layout: {
				'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']],
				'text-font': ['PT Sans Bold,Inter Bold'],
				'text-letter-spacing': 0.2,
				'text-line-height': 1,
				'text-max-width': 6,
				'text-radial-offset': ['step', ['zoom'], 0.6, 8, 0],
				'text-size': 20,
				'text-transform': 'uppercase'
			},
			paint: {
				'text-color': 'hsl(0, 0%, 15%)',
				'text-halo-color': 'hsla(0, 0%, 100%, 0.5)',
				'text-halo-width': 1.5
			}
		},
		{
			id: 'country-label',
			type: 'symbol',
			source: 'stamen-omt',
			'source-layer': 'place',
			minzoom: 1.5,
			maxzoom: 5.5,
			filter: ['match', ['get', 'class'], ['country', 'disputed_country'], true, false],
			layout: {
				'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']],
				'text-font': ['PT Sans Bold,Inter Bold'],
				'text-letter-spacing': 0.2,
				'text-line-height': 1,
				'text-max-width': 6,
				'text-radial-offset': ['step', ['zoom'], 0.6, 8, 0],
				'text-size': ['interpolate', ['linear'], ['zoom'], 1.5, 14, 5.5, 28],
				'text-transform': 'uppercase'
			},
			paint: {
				'text-color': 'hsl(0, 0%, 15%)',
				'text-halo-color': 'hsla(0, 0%, 100%, 0.5)',
				'text-halo-width': 1.5
			}
		},
		{
			id: 'subnational-label',
			type: 'symbol',
			source: 'stamen-omt',
			'source-layer': 'place',
			minzoom: 3,
			maxzoom: 7,
			filter: ['match', ['get', 'class'], ['state', 'disputed_state'], true, false],
			layout: {
				'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']],
				'text-font': ['PT Sans Bold,Inter Bold'],
				'text-letter-spacing': 0.15,
				'text-max-width': 6,
				'text-size': [
					'interpolate',
					['cubic-bezier', 0.85, 0.7, 0.65, 1],
					['zoom'],
					4,
					['step', ['get', 'rank'], 9, 6, 8, 7, 7],
					7,
					['step', ['get', 'rank'], 21, 6, 16, 7, 14]
				],
				'text-transform': 'uppercase'
			},
			paint: {
				'text-color': [
					'interpolate',
					['linear'],
					['zoom'],
					3,
					'hsl(0, 2%, 0%)',
					5,
					'hsl(0, 2%, 25%)'
				],
				'text-halo-color': 'hsla(0, 0%, 100%, 0.85)',
				'text-halo-width': ['interpolate', ['linear'], ['zoom'], 4, 0.75, 5, 1.75]
			}
		}
	]
};