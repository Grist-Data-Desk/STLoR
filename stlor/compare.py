from pathlib import Path

import pandas as pd


def normalize_activity(df1, df2):
    # Replace NaN with the empty string.
    df1["activity"] = df1["activity"].fillna("")
    df2["activity"] = df2["activity"].fillna("")

    # Split the activity column into a list of activities and sort.
    df1["activity"] = df1["activity"].str.split(",").apply(sorted)
    df2["activity"] = df2["activity"].str.split(",").apply(sorted)

    # Re-join the activity column.
    df1["activity"] = df1["activity"].apply(lambda x: ",".join(x))
    df2["activity"] = df2["activity"].apply(lambda x: ",".join(x))

    return df1, df2


def normalize_activity_info(df1, df2):
    # Replace \n with space.
    df1["activity_info"] = df1["activity_info"].str.replace("\n", " ")
    df2["activity_info"] = df2["activity_info"].str.replace("\n", " ")

    return df1, df2


def semantic_compare():
    df_original = pd.read_csv(Path("public_data/04_All States/3ebf200d.csv").resolve())
    df_new = pd.read_csv(
        Path("public_data/04_All States/stl_dataset_extra_activities.csv").resolve()
    )

    # Filter rows to those with state == 'WA'.
    df_original = df_original[df_original["state"] == "WA"]
    df_new = df_new[df_new["state"] == "WA"]

    df_3 = df_new[(df_new["state"] == "WA") & (df_new["rights_type"] == "timber")]
    print(df_3)

    # Normalize the activity and activity_info columns.
    df_original, df_new = normalize_activity(df_original, df_new)
    df_original, df_new = normalize_activity_info(df_original, df_new)

    if set(df_original.columns) != set(df_new.columns):
        return False

    # Sort and reset index
    df_original_sorted = df_original.sort_values(list(df_original.columns)).reset_index(
        drop=True
    )
    df_new_sorted = df_new.sort_values(list(df_new.columns)).reset_index(drop=True)

    # Reorder columns
    columns = sorted(df_original.columns)
    df_original_sorted = df_original_sorted[columns]
    df_new_sorted = df_new_sorted[columns]

    # Use compare
    diff = df_original_sorted.compare(df_new_sorted, keep_equal=True)

    if not diff.empty:
        print(diff)
        diff.to_csv("diff.csv", index=False)

    return diff.empty


if __name__ == "__main__":
    print("Are dataframes equal: ", semantic_compare())
