import pandas as pd
import re


def parse_lessee(activity_info: str) -> str:
    """
    Parses the lessee information from the activity_info column.

    Arguments:
    activity_info -- The activity_info column value.

    Returns:
    A string containing the lessee information.
    """
    if pd.isna(activity_info):
        return ""

    activity_info = str(activity_info)
    entries = re.split(r"\n(?=layer_index:)", activity_info.strip())
    active_lessees = []
    active_statuses = {
        "active",
        "y",
        "20 years term",
        "20 + 20 term",
        "a",
        "ab",
        "ac",
        "apd",
        "c",
        "continuous",
        "drl",
        "issued",
        "la",
        "new",
        "p",
        "producing",
        "pr",
        "identified gravel pit",
        "moderate potential for sand and gravel resources",
    }

    for entry in entries:
        lease_status_match = re.search(
            r"lease_status:\s*(.+?)(?=\s+lessee:|$)", entry, re.IGNORECASE
        )
        lessee_match = re.search(r"lessee:\s*(.+?)(?=\n|$)", entry, re.IGNORECASE)

        if lease_status_match and lessee_match:
            lease_status = lease_status_match.group(1).strip().lower()
            lessee = lessee_match.group(1).strip()

            if lease_status in active_statuses:
                lessees = [
                    l.strip()
                    for l in lessee.split(";")
                    if l.strip().lower() not in ["none", ""]
                ]
                active_lessees.extend([l.upper() for l in lessees])

    return "; ".join(active_lessees) if active_lessees else ""
