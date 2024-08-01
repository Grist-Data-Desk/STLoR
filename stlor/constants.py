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

# Projections
NAD_83_CONUS_ALBERS = "EPSG:5070"

# Units
SQUARE_METERS_PER_ACRE = 4046.8564224

# Output columns
FINAL_DATASET_COLUMNS = [
    OBJECT_ID,
    STATE,
    "managing_agency",
    "state_enabling_act",
    "trust_name",
    RESERVATION_NAME,
    RIGHTS_TYPE,
    "rights_type_info",
    "acres",
    "gis_acres",
    "net_acres",
    CLIPPED_ACRES,
    ACTIVITY,
    ACTIVITY_INFO,
    "county",
    "meridian",
    "township",
    "range",
    "section",
    "aliquot",
    GEOMETRY,
]
