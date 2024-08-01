import pandas as pd
from typing import Optional, TypedDict

from stlor.config import (
    STATE_ACTIVITY_CODES,
    ACTIVITY_REWRITE_RULES,
    ACTIVITY_RIGHTS_TYPE,
)
from stlor.constants import STATE, RIGHTS_TYPE, ACTIVITY, ACTIVITY_INFO, ACTIVITY_INFO_2
from stlor.entities import StateActivityDataSource, RightsType


def translate_state_activity_code(state: str, activity_code: float | int | str) -> str:
    """Translate a state's activity code to a human-readable activity name.

    Arguments:
    state -- the activity's associated state abbreviation
    activity_code -- the activity code to translate, represented as a float,
    int, or str

    Returns:
    str -- the human-readable activity string
    """
    if isinstance(activity_code, float):
        activity_code = int(activity_code)
    if isinstance(activity_code, int):
        activity_code = str(activity_code)

    if state in STATE_ACTIVITY_CODES and activity_code in STATE_ACTIVITY_CODES[state]:
        return STATE_ACTIVITY_CODES[state][activity_code]

    return activity_code


def get_activity_column(
    state: str, activity: StateActivityDataSource
) -> Optional[list[str]]:
    """Determine which column in a given state dataset contains activity information.

    Arguments:
    state -- the activity's associated state abbreviation
    activity -- the activity data source

    Returns:
    Optional[list[str]] -- the column name(s) containing activity information, or None
    """
    activity_rewrite_rules = ACTIVITY_REWRITE_RULES.get(state).get(
        activity.name.lower()
    )
    if not activity_rewrite_rules:
        activity_rewrite_rules = ACTIVITY_REWRITE_RULES.get(state).get(activity.name)
        if not activity_rewrite_rules:
            return

    return [
        original_col
        for original_col, output_column, in activity_rewrite_rules.items()
        if output_column.lower() == ACTIVITY
    ]


def get_activity_name(
    state: str, activity: StateActivityDataSource, activity_row: pd.DataFrame
) -> str:
    """Parse the activity name from the activity row, and if applicable, append
    the value from the specified activity_name_appendage_col.

    Arugments:
    state -- the activity's associated state abbreviation
    activity -- the activity data source
    activity_row -- a single activity record, represented as a pandas DataFrame

    Returns:
    str -- the human-readable activity name string
    """
    activity_name = None
    appendage_col_value = None

    if activity.use_name_as_activity and activity.activity_name_appendage_col:
        col_val = activity_row[activity.activity_name_appendage_col]
        if col_val.values[0]:
            activity_name = activity.name
            appendage_col_value = col_val.values[0]

    if activity_name is None:
        possible_activity_cols = get_activity_column(state, activity)
        if possible_activity_cols is not None:
            for activity_col in possible_activity_cols:
                if activity_col and activity_col in activity_row.keys():
                    activity_name_row = activity_row[activity_col].tolist()
                    if len(activity_name_row) > 0:
                        activity_name = str(activity_name_row[0])
                        if "None" in activity_name:
                            activity_name = None
                            continue
                        break

    if pd.notna(activity_name):
        if state == "WI":
            appendage_col_value = translate_state_activity_code(
                state, appendage_col_value
            )
        else:
            activity_name = translate_state_activity_code(state, activity_name)

    activity_name = (
        f"{activity_name} - {appendage_col_value}"
        if appendage_col_value is not None
        else activity_name
    )

    return activity_name if activity_name else activity.name


def is_compatible_activity(
    parcel, activity: StateActivityDataSource, activity_name: str, state: str
) -> bool:
    """Determine if an activity is compatible.

    - If the parcel has "rights_type": "surface", ensure the activity is a
      "surface" activity.
    - If the parcel has "rights_type": "subsurface", ensure the activity is a
      "subsurface" activity.
    - If the parcel has "rights_type": "surface" and activity.NEEDS_LOOKUP refer
      to ACTIVITY_RIGHTS_TYPE_LOOKUP_TABLE to determine the activity rights type
      and subsequently check compatibility.
    - If the parcel has "rights_type": "subsurface" and activity.NEEDS_LOOKUP refer
      to ACTIVITY_RIGHTS_TYPE_LOOKUP_TABLE to determine the activity rights type
      and subsequently check compatibility.

    Arguments:
    parcel -- a given STL parcel, represented as a row of a GeoDataFrame
    activity -- the activity data source
    activity_name -- the human-readable activity name
    state -- the activity's associated state abbreviation
    """
    IS_COMPATIBLE = True
    NOT_COMPATIBLE = False

    if parcel[STATE].lower() != state.lower():
        return NOT_COMPATIBLE

    if parcel[STATE] == "WA" and parcel[RIGHTS_TYPE].lower() == "timber":
        return NOT_COMPATIBLE

    activity_rights_type = (
        activity.rights_type
        if activity.rights_type != RightsType.NEEDS_LOOKUP
        else RightsType(ACTIVITY_RIGHTS_TYPE.get(activity_name, RightsType.UNIVERSAL))
    )

    if activity_rights_type == RightsType.UNIVERSAL:
        return IS_COMPATIBLE

    if RightsType(parcel[RIGHTS_TYPE].lower()) != activity_rights_type:
        return NOT_COMPATIBLE

    return IS_COMPATIBLE


def exclude_inactive(state: str, activity_row: dict) -> bool:
    """Exclude parcels with inactive activity statuses in MT and ID.

    Arguments:
    state -- the activity's associated state abbreviation
    activity_row -- a single activity record, represented as a dictionary
    """
    if "MT" in state or "ID" in state:
        status_col = next((c for c in activity_row.keys() if "stat" in c), None)
        if status_col and activity_row[status_col] != "Active":
            return True

    return False


class ActivityInfo(TypedDict):
    layer_index: str
    activity: str
    lease_status: str
    lessee: str


def fmt_single_activity_info(activity_info: ActivityInfo) -> str:
    """Format an activity's information for display.

    Arguments:
    activity_info -- a dictionary containing the activity's information.

    Returns:
    str -- the formatted activity information string
    """
    info_key_seq = ["layer_index", "activity", "lease_status", "lessee"]
    info = " ".join([f"{k}: {activity_info[k]}" for k in info_key_seq])

    return info


def capture_lessee_and_lease_type(
    activity_row: dict,
    activity: StateActivityDataSource,
    activity_name: str,
    state: str,
) -> str:
    """Capture the lessee and lease type information for an activity.

    Arguments:
    activity_row -- a single activity record, represented as a dictionary
    activity -- the activity data source
    activity_name -- the human-readable activity name
    state -- the activity's associated state abbreviation

    Returns:
    str -- the formatted activity information string
    """
    if activity.name not in ACTIVITY_REWRITE_RULES.get(state):
        return

    activity_info = {
        "layer_index": f"{state}-{activity.name}",
        "activity": activity_name,
        "lease_status": "",
        "lessee": "",
    }

    for key, val in ACTIVITY_REWRITE_RULES.get(state).get(activity.name).items():
        if val == "lessee":
            activity_info["lessee"] = activity_row[key]
        if val == "lease_status":
            activity_info["lease_status"] = activity_row[key]

    return fmt_single_activity_info(activity_info)


def concatenate_activity_info(row: dict) -> str:
    """Concatenate the activity_info and activity_info_2 columns, using \n to
    join the two strings.

    Arguments:
    row -- a single activity record, represented as a dictionary

    Returns:
    str -- the concatenated activity information string
    """
    activity_info = row[ACTIVITY_INFO].strip()
    activity_info_2 = row[ACTIVITY_INFO_2].strip()

    if activity_info and activity_info_2:
        return f"{activity_info}\n{activity_info_2}"
    elif activity_info:
        return activity_info
    elif activity_info_2:
        return activity_info_2
    else:
        return ""
