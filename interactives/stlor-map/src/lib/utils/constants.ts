import { schemePaired } from 'd3-scale-chromatic';
import maplibregl from 'maplibre-gl';

import type { LandUse } from '$lib/types';

// Grist brand colors.
export const COLORS = {
	EARTH: '#3c3830',
	ORANGE: '#ec6c37',
	GOLD: '#d9ac4a',
	GRAY: '#9ca3af',
	GREEN: '#476039',
	PALE_GREEN: '#9ca18c'
};

// The mapping of core map entities to colors.
export const ENTITY_COLORS = {
	parcels: COLORS.ORANGE,
	reservations: COLORS.GREEN
};

// The mapping of land uses to colors.
export const LAND_USE_TO_COLORS: Record<LandUse, string> = {
	Grazing: COLORS.PALE_GREEN,
	Agriculture: schemePaired[3],
	Infrastructure: '#64748b',
	Renewables: COLORS.ORANGE,
	Conservation: schemePaired[2],
	'Fossil Fuels': COLORS.EARTH,
	Mining: COLORS.GOLD,
	Timber: COLORS.GREEN,
	Commercial: schemePaired[9],
	Uncategorized: COLORS.GRAY,
	Recreation: schemePaired[4],
	Water: schemePaired[0]
};

// The mapping of rights type to colors.
export const RIGHTS_TYPE_TO_COLORS = {
	surface: '#D8A772',
	subsurface: '#40798A'
};

// Initial viewport bounds for the map on mobile and desktop.
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

// The CDN API endpoint for static assets in Grist's DigitalOcean Spaces bucket.
export const DO_SPACES_URL = 'https://grist.nyc3.cdn.digitaloceanspaces.com/stlor';

// The breakpoint for switching between mobile and desktop views.
export const TABLET_BREAKPOINT = 640;
