import argparse
import logging
from pathlib import Path
from typing import Tuple

import pandas as pd

from stlor.config import ACTIVITY, ACTIVITY_INFO

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(levelname)s - %(message)s")


def normalize_activity(df1: pd.DataFrame, df2: pd.DataFrame) -> Tuple[pd.DataFrame]:
    """Normalize the activity column in source and generated dataframes to
    account for differently-ordered activity strings.

    For example, the value 'Mineral Lease,Timber Sale' should be equivalent to
    'Timber Sale,Mineral Lease' even though the two strings aren't identical.

    Arguments:
    df1 {pd.DataFrame} -- The source DataFrame.
    df2 {pd.DataFrame} -- The generated DataFrame.

    Returns:
    Tuple[pd.DataFrame] -- The normalized DataFrames.
    """
    # Replace NaN with the empty string.
    df1[ACTIVITY] = df1[ACTIVITY].fillna("")
    df2[ACTIVITY] = df2[ACTIVITY].fillna("")

    # Split the activity column into a list of activities and sort.
    df1[ACTIVITY] = df1[ACTIVITY].str.split(",").apply(sorted)
    df2[ACTIVITY] = df2[ACTIVITY].str.split(",").apply(sorted)

    # Re-join the activity column.
    df1[ACTIVITY] = df1[ACTIVITY].apply(lambda x: ",".join(x))
    df2[ACTIVITY] = df2[ACTIVITY].apply(lambda x: ",".join(x))

    return df1, df2


def normalize_activity_info(
    df1: pd.DataFrame, df2: pd.DataFrame
) -> Tuple[pd.DataFrame]:
    """Normalize the activity_info column in source and generated dataframes to
    account for differently-formatted activity_info strings.

    Arguments:
    df1 {pd.DataFrame} -- The source DataFrame.
    df2 {pd.DataFrame} -- The generated DataFrame.

    Returns:
    Tuple[pd.DataFrame] -- The normalized DataFrames.
    """
    # Replace \n with space.
    df1[ACTIVITY_INFO] = df1[ACTIVITY_INFO].str.replace("\n", " ")
    df2[ACTIVITY_INFO] = df2[ACTIVITY_INFO].str.replace("\n", " ")

    return df1, df2


def semantic_compare(src_df_path: str, gen_df_path: str) -> bool:
    """Determine whether two DataFrames are semantically equivalent, accounting
    for differences in row and column order, as well as differences in the for-
    matting and ordering of strings in the activity and activity_info columns.

    Arguments:
    src_df_path {str} -- The path to the source DataFrame.
    gen_df_path {str} -- The path to the most recently generated DataFrame, to
    be compared against the source DataFrame.

    Returns:
    bool -- True if the DataFrames are semantically equivalent, False otherwise.
    """
    df_original = pd.read_csv(Path(src_df_path).resolve())
    df_new = pd.read_csv(Path(gen_df_path).resolve())

    # Normalize the activity and activity_info columns.
    df_original, df_new = normalize_activity(df_original, df_new)
    df_original, df_new = normalize_activity_info(df_original, df_new)

    # Check if the two DataFrames share the same columns.
    if set(df_original.columns) != set(df_new.columns):
        logger.error("DataFrame columns do not match.")
        return False

    # Sort the two DataFrames to ensure a stable row order.
    df_original_sorted = df_original.sort_values(list(df_original.columns)).reset_index(
        drop=True
    )
    df_new_sorted = df_new.sort_values(list(df_new.columns)).reset_index(drop=True)

    # Reorder the columns to ensure a stable column order.
    columns = sorted(df_original.columns)
    df_original_sorted = df_original_sorted[columns]
    df_new_sorted = df_new_sorted[columns]

    # Compare the two DataFrames to generate a diff.
    diff = df_original_sorted.compare(df_new_sorted)

    if not diff.empty:
        print(diff)

    return diff.empty


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Compare two STLoR DataFrames for semantic equivalence."
    )
    parser.add_argument(
        "src_df_path",
        type=str,
        help="The path to the source DataFrame.",
    )
    parser.add_argument(
        "gen_df_path",
        type=str,
        help="The path to the most recently generated DataFrame.",
    )
    args = parser.parse_args()
    print(
        f"Are dataframes equal: {semantic_compare(args.src_df_path, args.gen_df_path)}"
    )
