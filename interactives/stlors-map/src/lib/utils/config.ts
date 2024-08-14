import type { SourceSpecification, AddLayerObject } from 'maplibre-gl';

export const SOURCE_CONFIG: Record<string, { id: string; config: SourceSpecification }> = {
	stlors: {
		id: 'stlors',
		config: {
			type: 'vector',
			url: `pmtiles://http://localhost:5173/stlors.pmtiles`
		}
	},
	reservations: {
		id: 'reservations',
		config: {
			type: 'vector',
			url: `pmtiles://http://localhost:5173/reservations.pmtiles`
		}
	}
};

export const LAYER_CONFIG: Record<string, AddLayerObject> = {
	reservations: {
		id: 'reservations',
		source: 'reservations',
		type: 'fill',
		'source-layer': 'reservations',
		layout: {
			visibility: 'visible'
		},
		paint: {
			'fill-color': '#476039', // '#3B8659',
			'fill-opacity': 0.1
		}
	},
	reservationOutlines: {
		id: 'reservation-outlines',
		source: 'reservations',
		type: 'line',
		'source-layer': 'reservations',
		layout: {
			visibility: 'visible'
		},
		paint: {
			'line-color': '#476039', // '#3B8659',
			'line-width': ['interpolate', ['linear'], ['zoom'], 0, 0.5, 6, 0.5, 8, 4, 16, 8]
		}
	},
	reservationOffsetOutlines: {
		id: 'reservation-offset-outlines',
		source: 'reservations',
		type: 'line',
		'source-layer': 'reservations',
		layout: {
			visibility: 'visible'
		},
		paint: {
			'line-color': '#476039', // '#3B8659',
			'line-width': 0.5,
			'line-offset': 5,
			'line-opacity': ['step', ['zoom'], 0, 7, 1]
		}
	},
	stlors: {
		id: 'stlors',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		layout: {
			visibility: 'visible'
		},
		paint: {
			'fill-color': '#ec6c37',
			'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.75, 0.5]
		}
	},
	stlorOutlines: {
		id: 'stlor-outlines',
		source: 'stlors',
		type: 'line',
		'source-layer': 'stlors',
		layout: {
			visibility: 'visible'
		},
		paint: {
			'line-color': '#ec6c37',
			'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 0.75, 0.5]
		}
	}
};
