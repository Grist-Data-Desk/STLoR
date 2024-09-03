import type { SourceSpecification, AddLayerObject } from 'maplibre-gl';

import {
	ENTITY_COLORS,
	LAND_USE_TO_COLORS,
	RIGHTS_TYPE_TO_COLORS,
	DO_SPACES_URL
} from '$lib/utils/constants';

export const SOURCE_CONFIG: Record<string, { id: string; config: SourceSpecification }> = {
	stlors: {
		id: 'stlors',
		config: {
			type: 'vector',
			url: `pmtiles://${DO_SPACES_URL}/pmtiles/stlors.pmtiles`
		}
	},
	reservations: {
		id: 'reservations',
		config: {
			type: 'vector',
			url: `pmtiles://${DO_SPACES_URL}/pmtiles/reservations.pmtiles`
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
		id: 'water',
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
	agricultureWater: {
		id: 'agriculture-water',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Agriculture","Water"]'],
		paint: {
			'fill-pattern': 'Agriculture, Water',
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
	agricultureInfrastructureRenewables: {
		id: 'agriculture-infrastructure-renewables',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Agriculture","Infrastructure","Renewables"]'],
		paint: {
			'fill-pattern': 'Agriculture, Infrastructure, Renewables',
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
	infrastructureMiningRenewables: {
		id: 'infrastructure-mining-renewables',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Infrastructure","Mining","Renewables"]'],
		paint: {
			'fill-pattern': 'Infrastructure, Mining, Renewables',
			'fill-opacity': 0.75
		}
	},
	fossilFuelsInfrastructureMining: {
		id: 'fossil-fuels-infrastructure-mining',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Fossil Fuels","Infrastructure","Mining"]'],
		paint: {
			'fill-pattern': 'Fossil Fuels, Infrastructure, Mining',
			'fill-opacity': 0.75
		}
	},
	conservationTimberWater: {
		id: 'conservation-timber-water',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Conservation","Timber","Water"]'],
		paint: {
			'fill-pattern': 'Conservation, Timber, Water',
			'fill-opacity': 0.75
		}
	},
	agricultureGrazingWater: {
		id: 'agriculture-grazing-water',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Agriculture","Grazing","Water"]'],
		paint: {
			'fill-pattern': 'Agriculture, Grazing, Water',
			'fill-opacity': 0.75
		}
	},
	grazingInfrastructureRenewables: {
		id: 'grazing-infrastructure-renewables',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Grazing","Infrastructure","Renewables"]'],
		paint: {
			'fill-pattern': 'Grazing, Infrastructure, Renewables',
			'fill-opacity': 0.75
		}
	},
	agricultureGrazingRenewables: {
		id: 'agriculture-grazing-renewables',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Agriculture","Grazing","Renewables"]'],
		paint: {
			'fill-pattern': 'Agriculture, Grazing, Renewables',
			'fill-opacity': 0.75
		}
	},
	agricultureRenewablesWater: {
		id: 'agriculture-renewables-water',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Agriculture","Renewables","Water"]'],
		paint: {
			'fill-pattern': 'Agriculture, Renewables, Water',
			'fill-opacity': 0.75
		}
	},
	agricultureInfrastructureWater: {
		id: 'agriculture-infrastructure-water',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Agriculture","Infrastructure","Water"]'],
		paint: {
			'fill-pattern': 'Agriculture, Infrastructure, Water',
			'fill-opacity': 0.75
		}
	},
	infrastructureRecreationTimber: {
		id: 'infrastructure-recreation-timber',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Infrastructure","Recreation","Timber"]'],
		paint: {
			'fill-pattern': 'Infrastructure, Recreation, Timber',
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
	commercialInfrastructureTimber: {
		id: 'commercial-infrastructure-timber',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'land_use'], '["Commercial","Infrastructure","Timber"]'],
		paint: {
			'fill-pattern': 'Commercial, Infrastructure, Timber',
			'fill-opacity': 0.75
		}
	}
};

export const RIGHTS_TYPE_LAYER_CONFIG: Record<string, AddLayerObject> = {
	surface: {
		id: 'surface',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'rights_type'], 'surface'],
		paint: {
			'fill-color': RIGHTS_TYPE_TO_COLORS['surface'],
			'fill-opacity': 0.75
		}
	},
	surfaceOutlines: {
		id: 'surface-outlines',
		source: 'stlors',
		type: 'line',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'rights_type'], 'surface'],
		paint: {
			'line-color': RIGHTS_TYPE_TO_COLORS['surface'],
			'line-width': 1
		}
	},
	subsurface: {
		id: 'subsurface',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: [
			'all',
			['==', ['get', 'has_rights_type_dual'], false],
			['==', ['get', 'rights_type'], 'subsurface']
		],
		paint: {
			'fill-color': RIGHTS_TYPE_TO_COLORS['subsurface'],
			'fill-opacity': 0.75
		}
	},
	subsurfaceOutlines: {
		id: 'subsurface-outlines',
		source: 'stlors',
		type: 'line',
		'source-layer': 'stlors',
		filter: [
			'all',
			['==', ['get', 'has_rights_type_dual'], false],
			['==', ['get', 'rights_type'], 'subsurface']
		],
		paint: {
			'line-color': RIGHTS_TYPE_TO_COLORS['subsurface'],
			'line-width': 1
		}
	},
	surfaceSubsurface: {
		id: 'surface-subsurface',
		source: 'stlors',
		type: 'fill',
		'source-layer': 'stlors',
		filter: ['==', ['get', 'has_rights_type_dual'], true],
		paint: {
			'fill-pattern': 'rights-type',
			'fill-opacity': 1
		}
	}
};
