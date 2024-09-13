import geopandas as gpd
from typing import Dict, Literal

from stlor.activity import concatenate_activity_info
from stlor.constants import RIGHTS_TYPE, ACTIVITY_INFO, ACTIVITY_INFO_2


def remove_river_slivers(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Remove STLs with navigable river and streambed trust beneficiaries on
    borders.

    Arguments:
    gdf -- the state trust lands GeoDataFrame

    Returns:
    gpd.GeoDataFrame -- the state trust lands GeoDataFrame with border river
    parcels removed"""

    border_rivers = [
        # Blackfeet
        12031,
        # Fort Peck
        11931,
        11799,
        12096,
        12099,
        11937,
        11824,
        12098,
        11930,
        11934,
        11936,
        12097,
        11933,
        11932,
        11926,
        11927,
        11836,
        12084,
        11830,
        11829,
        11834,
        11833,
        11832,
        # Fort Yuma (Quechan)
        589,
        588,
        594,
        # Spokane
        33924,
        # Chehalis
        34346,
        34350,
        34355,
        34352,
        34348,
        34117,
        34345,
        34121,
    ]

    return gdf[~gdf["object_id_LAST"].isin(border_rivers)]


def remove_timber_rows(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Remove STLs with timber rights from the dataset.

    Arguments:
    gdf -- the state trust lands GeoDataFrame

    Returns:
    gpd.GeoDataFrame -- the state trust lands GeoDataFrame with timber parcels
    removed"""
    return gdf[gdf[RIGHTS_TYPE].str.lower() != "timber"]


def join_activity_info(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Join the activity_info and activity_info_2 columns into a single column.

    Arguments:
    gdf -- the state trust lands GeoDataFrame

    Returns:
    gpd.GeoDataFrame -- the state trust lands GeoDataFrame with a cleaned
    activity_info column
    """
    gdf[ACTIVITY_INFO] = gdf.apply(concatenate_activity_info, axis=1)
    gdf = gdf.drop(ACTIVITY_INFO_2, axis=1)

    return gdf


def pascal_case(
    s: str, keywords: Dict[str, Literal["upper"] | Literal["lower"]] = None
) -> str:
    """
    Convert a string to PascalCase, save for certain keywords. For keywords,
    look up the keyword in the dictionary and use the corresponding string
    transformation function. If the keyword is not found, capitalize the word.

    Additionally, special cases are handled:
    1. Words that start with a parenthesis are capitalized (e.g., "(INDMTY SELEC)"
    -> "(Indmty Selec)").
    2. Hyphenated words are capitalized (e.g., "HSPTL-DISABLED" -> "Hsptl-Disabled").
    3. Slash-separated words are capitalized (e.g., "VALLEY/MAYVILLE" -> "Valley/Mayville").

    Arguments:
    s -- the string to convert
    keywords -- a dictionary of keywords and their corresponding string functions

    Returns:
    str -- the string converted to PascalCase
    """
    if keywords is None:
        keywords = {}

    words = s.split(" ")
    pascal_words = []

    for word in words:
        lower_word = word.lower()
        if lower_word in keywords:
            if keywords[lower_word] == "lower":
                pascal_words.append(word.lower())
            elif keywords[lower_word] == "upper":
                pascal_words.append(word.upper())
        elif word.startswith("("):
            pascal_words.append(word[0] + word[1:].capitalize())
        elif "-" in word:
            # Capitalize each part of hyphenated words
            hyphenated_parts = word.split("-")
            capitalized_parts = [part.capitalize() for part in hyphenated_parts]
            pascal_words.append("-".join(capitalized_parts))
        elif "/" in word:
            # Capitalize each part of slash-separated words
            slash_parts = word.split("/")
            capitalized_parts = [part.capitalize() for part in slash_parts]
            pascal_words.append("/".join(capitalized_parts))
        else:
            pascal_words.append(word.capitalize())

    return " ".join(pascal_words)


def fix_nd_trust_names(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Fix up trust names for parcels in North Dakota.

    The function performs the following transformations:
    1. Replaces all instances of "ÔøΩ" with an empty string in the 'trust_name'
       column.
    2. If the resulting string is "Bank of North Dakota", change the value to
       "Strategic Investment and Improvement Fund".

    Arguments:
    stl_gdf -- the state trust lands GeoDataFrame

    Returns:
    gpd.GeoDataFrame -- the state trust lands GeoDataFrame with corrected trust
    names for parcels in North Dakota
    """
    mask = gdf["state"] == "ND"

    # Replace "ÔøΩ" with an empty string in the 'trust_name' column.
    gdf.loc[mask, "trust_name"] = gdf.loc[mask, "trust_name"].str.replace("ÔøΩ", " ")

    # Pascal case the trust names.
    gdf.loc[mask, "trust_name"] = gdf.loc[mask, "trust_name"].apply(
        lambda x: pascal_case(
            x, {"of": "lower", "the": "lower", "for": "lower", "nd": "upper"}
        )
    )

    # Change "Bank of North Dakota" to "Strategic Investment and Improvement Fund".
    gdf.loc[mask & (gdf["trust_name"] == "Bank of North Dakota"), "trust_name"] = (
        "Strategic Investment and Improvement Fund"
    )

    return gdf


def fix_mn_trust_names(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Fix up trust names for parcels in Minnesota.

    Arguments:
    stl_gdf -- the state trust lands GeoDataFrame

    Returns:
    gpd.GeoDataFrame -- the state trust lands GeoDataFrame with corrected trust
    names for parcels in Minnesota
    """
    mask = gdf["state"] == "MN"

    # Pascal case the trust names.
    gdf.loc[mask, "trust_name"] = gdf.loc[mask, "trust_name"].apply(
        lambda x: pascal_case(x)
    )

    return gdf


def fix_az_trust_names(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Fix up trust names for parcels in Arizona.

    Arguments:
    stl_gdf -- the state trust lands GeoDataFrame

    Returns:
    gpd.GeoDataFrame -- the state trust lands GeoDataFrame with corrected trust
    names for parcels in North Dakota
    """
    mask = gdf["state"] == "AZ"

    # Pascal case the trust names.
    gdf.loc[mask, "trust_name"] = gdf.loc[mask, "trust_name"].apply(
        lambda x: pascal_case(x, {"of": "lower"})
    )

    return gdf


def filter_id_trust_names(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Filter trust lands for Idaho, keeping only specific trusts.

    The function performs the following operations:
    1. Creates a mask for rows where the 'state' is 'ID'.
    2. Creates a list of allowed trust names for Idaho.
    3. Removes rows where the state is 'ID' and the trust name is not in the allowed list.

    Arguments:
    gdf -- the state trust lands GeoDataFrame

    Returns:
    gpd.GeoDataFrame -- the state trust lands GeoDataFrame with only the specified
    Idaho trusts and all other states' data intact
    """
    # List of allowed trust names for Idaho
    id_allowed_trusts = [
        "100.00% Agricultural College",
        "100.00% Charitable Institute",
        "100.00% Normal School",
        "100.00% Public School (Indemnity, Schools, Common Schools)",
        "100.00% State Hospital South (Insane Asylum)",
        "100.00% University of Idaho",
        "Agricultural College",
        "Normal School",
        "Public School (Indemnity, Schools, Common Schools)",
        "State Hospital South (Insane Asylum)"
    ]

    # Create a mask for Idaho rows
    id_mask = gdf["state"] == "ID"

    # Create a mask for Idaho rows with allowed trust names
    keep_mask = id_mask & gdf["trust_name"].isin(id_allowed_trusts)

    # Keep rows that are either not in Idaho or are in Idaho with allowed trust names
    gdf = gdf[~id_mask | keep_mask]

    return gdf


def fix_trust_names(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Fix up trust names for parcels in all states.

    Arguments:
    stl_gdf -- the state trust lands GeoDataFrame

    Returns:
    gpd.GeoDataFrame -- the state trust lands GeoDataFrame with corrected trust
    names for parcels in all states
    """
    gdf = fix_nd_trust_names(gdf)
    gdf = fix_mn_trust_names(gdf)
    gdf = fix_az_trust_names(gdf)

    return gdf
