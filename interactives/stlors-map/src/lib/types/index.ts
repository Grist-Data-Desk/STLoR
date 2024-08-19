import type { BBox } from 'geojson';

export interface Data {
	reservationStats: Record<string, ReservationStats>;
}

export type LandUse =
	| 'Grazing'
	| 'Agriculture'
	| 'Infrastructure'
	| 'Renewables'
	| 'Conservation'
	| 'Fossil Fuels'
	| 'Mining'
	| 'Timber'
	| 'Commercial'
	| 'Uncategorized'
	| 'Recreation'
	| 'Federal Government'
	| 'Water';

export interface ReservationStats {
	reservation_name: string;
	acres: number;
	land_uses: {
		top_land_uses: { land_use: LandUse; acreage: number }[];
		uncategorized_acreage: number;
	};
	bounds: BBox;
	stl_total_acres: number;
	stl_subsurface_acres: number;
	stl_surface_acres: number;
}
