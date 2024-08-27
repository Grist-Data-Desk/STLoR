import { schemePaired } from 'd3-scale-chromatic';
import maplibregl from 'maplibre-gl';

import type { LandUse } from '$lib/types';

export const COLORS = {
	EARTH: '#3c3830',
	SMOG: '#f0f0f0',
	ORANGE: '#ec6c37',
	GOLD: '#d9ac4a',
	GRAY: '#9ca3af',
	GREEN: '#476039',
	PALE_GREEN: '#9ca18c',
	BLUE: '#3877f3'
};

export const LAND_USE_TO_COLORS: Record<LandUse, string> = {
	Grazing: COLORS.PALE_GREEN,
	Agriculture: schemePaired[3],
	Infrastructure: COLORS.GRAY,
	Renewables: COLORS.ORANGE,
	Conservation: schemePaired[2],
	'Fossil Fuels': COLORS.EARTH,
	Mining: COLORS.GOLD,
	Timber: COLORS.GREEN,
	Commercial: schemePaired[9],
	Uncategorized: 'gray',
	Recreation: schemePaired[4],
	'Federal Government': schemePaired[5],
	Water: schemePaired[0]
};

export const RIGHTS_TYPE_TO_COLORS = {
	surface: COLORS.BLUE,
	subsurface: COLORS.EARTH
};

export const INITIAL_BOUNDS = {
	mobile: new maplibregl.LngLatBounds(
		new maplibregl.LngLat(-114.96386766075805, 46.334723352416034),
		new maplibregl.LngLat(-113.58509482116912, 48.00177103564428)
	),
	desktop: new maplibregl.LngLatBounds(
		new maplibregl.LngLat(-115.92088740560425, 46.9482176374018),
		new maplibregl.LngLat(-113.43039937148656, 47.96212201020842)
	)
};
