# Column names
OBJECT_ID = "object_id"
STATE = "state"
RIGHTS_TYPE = "rights_type"
ACTIVITY = "activity"
ACTIVITY_INFO = "activity_info"
ACTIVITY_INFO_2 = "activity_info_2"
GEOMETRY = "geometry"
CLIPPED_ACRES = "clipped_acres"
RESERVATION_NAME = "reservation_name"
ACRES = "acres"
COUNTY = "county"
MERIDIAN = "meridian"
TOWNSHIP = "township"
RANGE = "range"
SECTION = "section"
ALIQUOT = "aliquot"
MANAGING_AGENCY = "managing_agency"
STATE_ENABLING_ACT = "state_enabling_act"
TRUST_NAME = "trust_name"
RIGHTS_TYPE_INFO = "rights_type_info"
NET_ACRES = "net_acres"
GIS_ACRES = "gis_acres"
LAYER = "layer"
LEASE_STATUS = "lease_status"
LESSEE = "LESSEE"
DATA_SOURCE = "data_source"

# Column values
SUBSURFACE_RIGHTS_TYPE = "subsurface"
SURFACE_RIGHTS_TYPE = "surface"

# Projections
NAD_83_CONUS_ALBERS = "EPSG:5070"
WGS_84 = "EPSG:4326"

# Units
SQUARE_METERS_PER_ACRE = 4046.8564224

# Output columns
FINAL_DATASET_COLUMNS = [
    OBJECT_ID,
    STATE,
    MANAGING_AGENCY,
    STATE_ENABLING_ACT,
    TRUST_NAME,
    RESERVATION_NAME,
    RIGHTS_TYPE,
    RIGHTS_TYPE_INFO,
    ACRES,
    GIS_ACRES,
    NET_ACRES,
    CLIPPED_ACRES,
    ACTIVITY,
    ACTIVITY_INFO,
    COUNTY,
    MERIDIAN,
    TOWNSHIP,
    RANGE,
    SECTION,
    ALIQUOT,
    GEOMETRY,
]
