import { schemePaired } from 'd3-scale-chromatic';

import type { LandUse } from '$lib/types';

export const COLORS = {
	EARTH: '#3c3830',
	SMOG: '#f0f0f0',
	ORANGE: '#ec6c37',
	GOLD: '#d9ac4a',
	GRAY: '#9ca3af',
	GREEN: '#476039',
	PALE_GREEN: '#9ca18c'
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
