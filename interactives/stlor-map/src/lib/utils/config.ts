import type { SourceSpecification, AddLayerObject } from 'maplibre-gl';

import {
	ENTITY_COLORS,
	LAND_USE_TO_COLORS,
	RIGHTS_TYPE_TO_COLORS,
	DO_SPACES_URL
} from '$lib/utils/constants';

// The mapping of source IDs to their configurations.
export const SOURCE_CONFIG: Record<string, { id: string; config: SourceSpecification }> = {
	stlors: {
		id: 'stlors',
		config: {
			type: 'vector',
			url: `pmtiles://${DO_SPACES_URL}/data/pmtiles/stlors.pmtiles`
		}
	},
	reservations: {
		id: 'reservations',
		config: {
			type: 'vector',
			url: `pmtiles://${DO_SPACES_URL}/data/pmtiles/reservations.pmtiles`
		}
	},
	surface: {
		id: 'surface',
		config: {
			type: 'vector',
			url: `pmtiles://${DO_SPACES_URL}/data/pmtiles/surface.pmtiles`
		}
	},
	subsurface: {
		id: 'subsurface',
		config: {
			type: 'vector',
			url: `pmtiles://${DO_SPACES_URL}/data/pmtiles/subsurface.pmtiles`
		}
	},
	surfaceSubsurface: {
		id: 'surface-subsurface',
		config: {
			type: 'vector',
			url: `pmtiles://${DO_SPACES_URL}/data/pmtiles/surface-subsurface.pmtiles`
		}
	}
};

// The mapping of always-on layers to their configurations.
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
			'fill-color': ENTITY_COLORS.reservations,
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
			'line-color': ENTITY_COLORS.reservations,
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
			'line-color': ENTITY_COLORS.reservations,
			'line-width': 0.5,
			'line-offset': 5,
			'line-opacity': ['step', ['zoom'], 0, 7, 1]
		}
	}
};

// The mapping of layers in the 'Acreage' view to their configurations.
export const ACREAGE_LAYER_CONFIG: Record<string, AddLayerObject> = {
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
			'fill-opacity': 0.75
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
			'line-color': '#ec6c37'
		}
	}
};

// The mapping of layers in the 'Land Use' view to their configurations.
export const LAND_USE_LAYER_CONFIG: Record<string, AddLayerObject> = {
	uncategorized: {
		id: 'uncategorized',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Uncategorized"]'],
		paint: {
			'fill-color': LAND_USE_TO_COLORS['Uncategorized'],
			'fill-opacity': 0.75
		}
	},
	uncategorizedOutlines: {
		id: 'uncategorized-outlines',
		source: 'stlors',
		type: 'line',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Uncategorized"]'],
		paint: {
			'line-color': LAND_USE_TO_COLORS['Uncategorized'],
			'line-width': 1
		}
	},
	grazing: {
		id: 'grazing',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Grazing"]'],
		paint: {
			'fill-color': LAND_USE_TO_COLORS['Grazing'],
			'fill-opacity': 0.75
		}
	},
	grazingOutlines: {
		id: 'grazing-outlines',
		source: 'stlors',
		type: 'line',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Grazing"]'],
		paint: {
			'line-color': LAND_USE_TO_COLORS['Grazing'],
			'line-width': 1
		}
	},
	fossilFuels: {
		id: 'fossil-fuels',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Fossil Fuels"]'],
		paint: {
			'fill-color': LAND_USE_TO_COLORS['Fossil Fuels'],
			'fill-opacity': 0.75
		}
	},
	fossilFuelsOutlines: {
		id: 'fossil-fuels-outlines',
		source: 'stlors',
		type: 'line',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Fossil Fuels"]'],
		paint: {
			'line-color': LAND_USE_TO_COLORS['Fossil Fuels'],
			'line-width': 1
		}
	},
	mining: {
		id: 'mining',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Mining"]'],
		paint: {
			'fill-color': LAND_USE_TO_COLORS['Mining'],
			'fill-opacity': 0.75
		}
	},
	miningOutlines: {
		id: 'mining-outlines',
		source: 'stlors',
		type: 'line',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Mining"]'],
		paint: {
			'line-color': LAND_USE_TO_COLORS['Mining'],
			'line-width': 1
		}
	},
	timber: {
		id: 'timber',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Timber"]'],
		paint: {
			'fill-color': LAND_USE_TO_COLORS['Timber'],
			'fill-opacity': 0.75
		}
	},
	timberOutlines: {
		id: 'timber-outlines',
		source: 'stlors',
		type: 'line',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Timber"]'],
		paint: {
			'line-color': LAND_USE_TO_COLORS['Timber'],
			'line-width': 1
		}
	},
	recreation: {
		id: 'recreation',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Recreation"]'],
		paint: {
			'fill-color': LAND_USE_TO_COLORS['Recreation'],
			'fill-opacity': 0.75
		}
	},
	recreationOutlines: {
		id: 'recreation-outlines',
		source: 'stlors',
		type: 'line',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Recreation"]'],
		paint: {
			'line-color': LAND_USE_TO_COLORS['Recreation'],
			'line-width': 1
		}
	},
	conservation: {
		id: 'conservation',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Conservation"]'],
		paint: {
			'fill-color': LAND_USE_TO_COLORS['Conservation'],
			'fill-opacity': 0.75
		}
	},
	conservationOutlines: {
		id: 'conservation-outlines',
		source: 'stlors',
		type: 'line',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Conservation"]'],
		paint: {
			'line-color': LAND_USE_TO_COLORS['Conservation'],
			'line-width': 1
		}
	},
	commercial: {
		id: 'commercial',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Commercial"]'],
		paint: {
			'fill-color': LAND_USE_TO_COLORS['Commercial'],
			'fill-opacity': 0.75
		}
	},
	commercialOutlines: {
		id: 'commercial-outlines',
		source: 'stlors',
		type: 'line',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Commercial"]'],
		paint: {
			'line-color': LAND_USE_TO_COLORS['Commercial'],
			'line-width': 1
		}
	},
	agriculture: {
		id: 'agriculture',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Agriculture"]'],
		paint: {
			'fill-color': LAND_USE_TO_COLORS['Agriculture'],
			'fill-opacity': 0.75
		}
	},
	agricultureOutlines: {
		id: 'agriculture-outlines',
		source: 'stlors',
		type: 'line',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Agriculture"]'],
		paint: {
			'line-color': LAND_USE_TO_COLORS['Agriculture'],
			'line-width': 1
		}
	},
	infrastructure: {
		id: 'infrastructure',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Infrastructure"]'],
		paint: {
			'fill-color': LAND_USE_TO_COLORS['Infrastructure'],
			'fill-opacity': 0.75
		}
	},
	infrastructureOutlines: {
		id: 'infrastructure-outlines',
		source: 'stlors',
		type: 'line',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Infrastructure"]'],
		paint: {
			'line-color': LAND_USE_TO_COLORS['Infrastructure'],
			'line-width': 1
		}
	},
	water: {
		// Note: This is a special case where the basemap style already has a layer
		// with id "water". Thus, we give it the id "water-land-use" to avoid conflicts.
		id: 'water-land-use',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Water"]'],
		paint: {
			'fill-color': LAND_USE_TO_COLORS['Water'],
			'fill-opacity': 0.75
		}
	},
	waterOutlines: {
		id: 'water-outlines',
		source: 'stlors',
		type: 'line',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Water"]'],
		paint: {
			'line-color': LAND_USE_TO_COLORS['Water'],
			'line-width': 1
		}
	},
	agricultureInfrastructure: {
		id: 'agriculture-infrastructure',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Agriculture","Infrastructure"]'],
		paint: {
			'fill-pattern': 'Agriculture, Infrastructure',
			'fill-opacity': 0.75
		}
	},
	commercialInfrastructure: {
		id: 'commercial-infrastructure',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Commercial","Infrastructure"]'],
		paint: {
			'fill-pattern': 'Commercial, Infrastructure',
			'fill-opacity': 0.75
		}
	},
	infrastructureMining: {
		id: 'infrastructure-mining',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Infrastructure","Mining"]'],
		paint: {
			'fill-pattern': 'Infrastructure, Mining',
			'fill-opacity': 0.75
		}
	},
	fossilFuelsInfrastructure: {
		id: 'fossil-fuels-infrastructure',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Fossil Fuels","Infrastructure"]'],
		paint: {
			'fill-pattern': 'Fossil Fuels, Infrastructure',
			'fill-opacity': 0.75
		}
	},
	conservationTimber: {
		id: 'conservation-timber',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Conservation","Timber"]'],
		paint: {
			'fill-pattern': 'Conservation, Timber',
			'fill-opacity': 0.75
		}
	},
	agricultureCommercial: {
		id: 'agriculture-commercial',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Agriculture","Commercial"]'],
		paint: {
			'fill-pattern': 'Agriculture, Commercial',
			'fill-opacity': 0.75
		}
	},
	conservationGrazing: {
		id: 'conservation-grazing',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Conservation","Grazing"]'],
		paint: {
			'fill-pattern': 'Conservation, Grazing',
			'fill-opacity': 0.75
		}
	},
	agricultureGrazing: {
		id: 'agriculture-grazing',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Agriculture","Grazing"]'],
		paint: {
			'fill-pattern': 'Agriculture, Grazing',
			'fill-opacity': 0.75
		}
	},
	grazingInfrastructure: {
		id: 'grazing-infrastructure',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Grazing","Infrastructure"]'],
		paint: {
			'fill-pattern': 'Grazing, Infrastructure',
			'fill-opacity': 0.75
		}
	},
	conservationInfrastructure: {
		id: 'conservation-infrastructure',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Conservation","Infrastructure"]'],
		paint: {
			'fill-pattern': 'Conservation, Infrastructure',
			'fill-opacity': 0.75
		}
	},
	fossilFuelsMining: {
		id: 'fossil-fuels-mining',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Fossil Fuels","Mining"]'],
		paint: {
			'fill-pattern': 'Fossil Fuels, Mining',
			'fill-opacity': 0.75
		}
	},
	infrastructureRenewables: {
		id: 'infrastructure-renewables',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Infrastructure","Renewables"]'],
		paint: {
			'fill-pattern': 'Infrastructure, Renewables',
			'fill-opacity': 0.75
		}
	},
	conservationRenewables: {
		id: 'conservation-renewables',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Conservation","Renewables"]'],
		paint: {
			'fill-pattern': 'Conservation, Renewables',
			'fill-opacity': 0.75
		}
	},
	recreationTimber: {
		id: 'recreation-timber',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Recreation","Timber"]'],
		paint: {
			'fill-pattern': 'Recreation, Timber',
			'fill-opacity': 0.75
		}
	},
	infrastructureTimber: {
		id: 'infrastructure-timber',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Infrastructure","Timber"]'],
		paint: {
			'fill-pattern': 'Infrastructure, Timber',
			'fill-opacity': 0.75
		}
	},
	grazingTimber: {
		id: 'grazing-timber',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Grazing","Timber"]'],
		paint: {
			'fill-pattern': 'Grazing, Timber',
			'fill-opacity': 0.75
		}
	},
	commercialGrazing: {
		id: 'commercial-grazing',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Commercial","Grazing"]'],
		paint: {
			'fill-pattern': 'Commercial, Grazing',
			'fill-opacity': 0.75
		}
	},
	grazingRecreation: {
		id: 'grazing-recreation',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Grazing","Recreation"]'],
		paint: {
			'fill-pattern': 'Grazing, Recreation',
			'fill-opacity': 0.75
		}
	},
	agricultureCommercialInfrastructure: {
		id: 'agriculture-commercial-infrastructure',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Agriculture","Commercial","Infrastructure"]'],
		paint: {
			'fill-pattern': 'Agriculture, Commercial, Infrastructure',
			'fill-opacity': 0.75
		}
	},
	commercialFossilFuelsInfrastructure: {
		id: 'commercial-fossil-fuels-infrastructure',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Commercial","Fossil Fuels","Infrastructure"]'],
		paint: {
			'fill-pattern': 'Commercial, Fossil Fuels, Infrastructure',
			'fill-opacity': 0.75
		}
	},
	infrastructureMiningWater: {
		id: 'infrastructure-mining-water',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Infrastructure","Mining","Water"]'],
		paint: {
			'fill-pattern': 'Infrastructure, Mining, Water',
			'fill-opacity': 0.75
		}
	},
	conservationGrazingInfrastructure: {
		id: 'conservation-grazing-infrastructure',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Conservation","Grazing","Infrastructure"]'],
		paint: {
			'fill-pattern': 'Conservation, Grazing, Infrastructure',
			'fill-opacity': 0.75
		}
	},
	agricultureConservationGrazing: {
		id: 'agriculture-conservation-grazing',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Agriculture","Conservation","Grazing"]'],
		paint: {
			'fill-pattern': 'Agriculture, Conservation, Grazing',
			'fill-opacity': 0.75
		}
	},
	conservationGrazingRenewables: {
		id: 'conservation-grazing-renewables',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Conservation","Grazing","Renewables"]'],
		paint: {
			'fill-pattern': 'Conservation, Grazing, Renewables',
			'fill-opacity': 0.75
		}
	},
	conservationGrazingWater: {
		id: 'conservation-grazing-water',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Conservation","Grazing","Water"]'],
		paint: {
			'fill-pattern': 'Conservation, Grazing, Water',
			'fill-opacity': 0.75
		}
	},
	conservationInfrastructureRenewables: {
		id: 'conservation-infrastructure-renewables',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Conservation","Infrastructure","Renewables"]'],
		paint: {
			'fill-pattern': 'Conservation, Infrastructure, Renewables',
			'fill-opacity': 0.75
		}
	},
	grazingInfrastructureTimber: {
		id: 'grazing-infrastructure-timber',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Grazing","Infrastructure","Timber"]'],
		paint: {
			'fill-pattern': 'Grazing, Infrastructure, Timber',
			'fill-opacity': 0.75
		}
	},
	grazingRecreationTimber: {
		id: 'grazing-recreation-timber',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Grazing","Recreation","Timber"]'],
		paint: {
			'fill-pattern': 'Grazing, Recreation, Timber',
			'fill-opacity': 0.75
		}
	},
	agricultureGrazingInfrastructure: {
		id: 'agriculture-grazing-infrastructure',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Agriculture","Grazing","Infrastructure"]'],
		paint: {
			'fill-pattern': 'Agriculture, Grazing, Infrastructure',
			'fill-opacity': 0.75
		}
	},
	commercialInfrastructureMiningWater: {
		id: 'commercial-infrastructure-mining-water',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Commercial","Infrastructure","Mining","Water"]'],
		paint: {
			'fill-pattern': 'Commercial, Infrastructure, Mining, Water',
			'fill-opacity': 0.75
		}
	},
	conservationGrazingInfrastructureRenewables: {
		id: 'conservation-grazing-infrastructure-renewables',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Conservation","Grazing","Infrastructure","Renewables"]'],
		paint: {
			'fill-pattern': 'Conservation, Grazing, Infrastructure, Renewables',
			'fill-opacity': 0.75
		}
	},
	conservationGrazingInfrastructureWater: {
		id: 'conservation-grazing-infrastructure-water',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Conservation","Grazing","Infrastructure","Water"]'],
		paint: {
			'fill-pattern': 'Conservation, Grazing, Infrastructure, Water',
			'fill-opacity': 0.75
		}
	},
	fossilFuelsGrazingInfrastructureMining: {
		id: 'fossil-fuels-grazing-infrastructure-mining',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Fossil Fuels","Grazing","Infrastructure","Mining"]'],
		paint: {
			'fill-pattern': 'Fossil Fuels, Grazing, Infrastructure, Mining',
			'fill-opacity': 0.75
		}
	},
	commercialGrazingInfrastructureRecreation: {
		id: 'commercial-grazing-infrastructure-recreation',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Commercial","Grazing","Infrastructure","Recreation"]'],
		paint: {
			'fill-pattern': 'Commercial, Grazing, Infrastructure, Recreation',
			'fill-opacity': 0.75
		}
	},
	grazingInfrastructureRecreationTimber: {
		id: 'grazing-infrastructure-recreation-timber',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Grazing","Infrastructure","Recreation","Timber"]'],
		paint: {
			'fill-pattern': 'Grazing, Infrastructure, Recreation, Timber',
			'fill-opacity': 0.75
		}
	}
};

// The mapping of layers in the 'Rights Type' view to their configurations.
export const RIGHTS_TYPE_LAYER_CONFIG: Record<string, AddLayerObject> = {
	subsurface: {
		id: 'subsurface',
		source: 'subsurface',
		type: 'fill',
		'source-layer': 'subsurface',
		paint: {
			'fill-color': RIGHTS_TYPE_TO_COLORS['subsurface'],
			'fill-opacity': 0.75
		}
	},
	subsurfaceOutlines: {
		id: 'subsurface-outlines',
		source: 'subsurface',
		type: 'line',
		'source-layer': 'subsurface',
		paint: {
			'line-color': RIGHTS_TYPE_TO_COLORS['subsurface'],
			'line-width': 1
		}
	},
	surface: {
		id: 'surface',
		source: 'surface',
		type: 'fill',
		'source-layer': 'surface',
		paint: {
			'fill-color': RIGHTS_TYPE_TO_COLORS['surface'],
			'fill-opacity': 0.75
		}
	},
	surfaceOutlines: {
		id: 'surface-outlines',
		source: 'surface',
		type: 'line',
		'source-layer': 'surface',
		paint: {
			'line-color': RIGHTS_TYPE_TO_COLORS['surface'],
			'line-width': 1
		}
	},
	surfaceSubsurface: {
		id: 'surface-subsurface',
		source: 'surface-subsurface',
		type: 'fill',
		'source-layer': 'surface-subsurface',
		paint: {
			'fill-pattern': 'rights-type',
			'fill-opacity': 0.75
		}
	},
	stlors: {
		id: 'stlors',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		paint: {
			'fill-color': '#ffffff',
			'fill-opacity': 0
		}
	}
};

// The set of layers to generate popups for.
export const POPUP_LAYER_IDS = Object.values({
	...ACREAGE_LAYER_CONFIG,
	...LAND_USE_LAYER_CONFIG
})
	.filter((layer) => layer.type === 'fill')
	.map((layer) => layer.id);
