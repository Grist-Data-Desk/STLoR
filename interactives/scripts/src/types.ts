import type { BBox } from "geojson";

/**
 * Represents the higher-level land use categorizations for activities permitted
 * on parcels.
 */
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
  | "Water";

/**
 * Represents the GeoJSON Feature properties associated with a parcel.
 */
export interface ParcelProperties {
  object_id: number;
  state: string;
  managing_agency: string;
  state_enabling_act: string;
  trust_name: string;
  reservation_name: string;
  rights_type: "surface" | "subsurface";
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

/**
 * Represents the GeoJSON Feature properties associated with a parcel after
 * processing.
 */
export interface ProcessedParcelProperties extends ParcelProperties {
  land_use: LandUse[];
  has_rights_type_dual: boolean;
}

/**
 * Represents a mapping from a parcel's specific activity string to an array
 * of land uses.
 */
export interface LandUseMapping {
  activity: string;
  land_use: LandUse[];
}

/**
 * Represents the GeoJSON feature properties associated with a reservation.
 */
export interface ReservationProperties {
  reservation_name: string;
  acres: number;
}

/**
 * Represents the GeoJSON feature properties associated with records from the
 * reservation aggregation in public_data/05_Final-Dataset/01_STLs-on-Reservations-by-Reservation.geojson.
 */
export interface ReservationAggProperties {
  reservation_name: string;
  total_acres: number;
  surface_acres: number;
  subsurface_acres: number;
}

/**
 * Represents the aggregated acreage, land use, and rights type properties
 * associated with a reservation.
 */
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
