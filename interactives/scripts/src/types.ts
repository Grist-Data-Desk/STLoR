import type { BBox } from "geojson";

export type LandUse =
  | "Grazing"
  | "Agriculture"
  | "Infrastructure"
  | "Renewables"
  | "Conservation"
  | "Fossil Fuels"
  | "Mining"
  | "Timber"
  | "Commercial"
  | "Uncategorized"
  | "Recreation"
  | "Federal Government"
  | "Water";

export interface ParcelProperties {
  object_id: number;
  state: string;
  managing_agency: string;
  state_enabling_act: string;
  trust_name: string;
  reservation_name: string;
  rights_type: "surface" | "subsurface" | "Surface" | "Subsurface";
  rights_type_info: string;
  acres: string;
  gis_acres: number;
  net_acres: string;
  clipped_acres: number;
  activity: string;
  activity_info: string;
  county: string;
  meridian: string;
  township: string;
  range: string;
  section: string;
  aliquot: string;
}

export interface LandUseMapping {
  activity: string;
  land_use: LandUse[];
}

export interface ParcelWithLandUseProperties extends ParcelProperties {
  land_use: LandUse[];
}

export interface ReservationProperties {
  reservation_name: string;
  acres: number;
}

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
