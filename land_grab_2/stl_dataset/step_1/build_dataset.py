from datetime import datetime

import typer

from land_grab_2.stl_dataset.step_1.dataset_summary_stats import calculate_summary_statistics_helper
from land_grab_2.stl_dataset.step_1.dataset_merge import merge_single_state_helper, merge_all_states_helper, \
    merge_cessions_data_helper
from land_grab_2.stl_dataset.step_1.dataset_extraction import extract_and_clean_single_source_helper

from land_grab_2.stl_dataset.step_1.constants import (STATE)

from land_grab_2.stl_dataset.step_1.state_trust_config import STATE_TRUST_CONFIGS
from land_grab_2.utils import in_parallel, delete_files_and_subdirectories_in_directory, _queried_data_directory, \
    _cleaned_data_directory, _merged_data_directory, _cessions_data_directory, \
    _summary_statistics_data_directory

app = typer.Typer()


@app.command()
def extract_and_clean_single_source(source: str):
    '''
    Extract and clean data from a single data parcel_ID_lists
    '''
    # get state and correct config
    config = STATE_TRUST_CONFIGS[source]
    state = config[STATE]
    queried_data_directory = _queried_data_directory(state)
    cleaned_data_directory = _cleaned_data_directory(state)
    extract_and_clean_single_source_helper(source, config, queried_data_directory,
                                           cleaned_data_directory)


@app.command()
def extract_and_clean_all():
    '''
    Extract and clean data for the entire dataset
    '''
    st = datetime.now()
    in_parallel(STATE_TRUST_CONFIGS.keys(), extract_and_clean_single_source, batched=False)
    print(f'extract_and_clean_all took: {datetime.now() - st}')


@app.command()
def merge_single_state(state: str):
    '''
    Merge all data for a single state
    '''
    cleaned_data_directory = _cleaned_data_directory(state)
    merged_data_directory = _merged_data_directory(state)
    merge_single_state_helper(state, cleaned_data_directory,
                              merged_data_directory)


@app.command()
def merge_all_states():
    '''
    Merge all data for the entire dataset
    '''
    # first, find all states for which we have cleaned data
    cleaned_data_directory = _cleaned_data_directory()
    merged_data_directory = _merged_data_directory()
    merge_all_states_helper(cleaned_data_directory, merged_data_directory)


@app.command()
def merge_cessions_data():
    merge_cessions_data_helper(_cessions_data_directory())


@app.command()
def calculate_summary_statistics():
    '''
    Calculate summary statistics based on the full dataset. Create two csvs. In the first,
    for each university calculate total acreage of land held in trust, all present day tribes
    and tribes listed in treaties associated with the university land, and which cessions
    (represented by Royce IDs) overlap with land held in trust. In the second, for each present
    day tribe, get total acreage of state land trust parcels, all associated cessions, and all
    states and universities that have land taken from this tribe held in trust
    '''
    calculate_summary_statistics_helper(_summary_statistics_data_directory(), _merged_data_directory())


@app.command()
def build_full_dataset():
    '''
    Delete all old data files and build the entire dataset from scratch
    '''
    # first delete all previous data
    delete_files_and_subdirectories_in_directory(_queried_data_directory())
    delete_files_and_subdirectories_in_directory(_cleaned_data_directory())
    delete_files_and_subdirectories_in_directory(_merged_data_directory())

    # extract, clean, and merge all data
    extract_and_clean_all()
    merge_all_states()

    # merge with usfs cessions data and calculate_summary_statistics
    # TODO: uncomment once this is finished
    # merge_cessions_data()
    calculate_summary_statistics()


def run():
    build_full_dataset()


if __name__ == "__main__":
    # app()

    # delete_files_and_subdirectories_in_directory(_queried_data_directory())
    # delete_files_and_subdirectories_in_directory(_cleaned_data_directory())
    # delete_files_and_subdirectories_in_directory(_merged_data_directory())

    # states = ['AZ', 'MT', 'OR', 'UT', 'OK', 'NM']
    # states = ['UT']
    # keys = [k for k in STATE_TRUST_CONFIGS.keys() if
    #         any(k.startswith(prefix) for prefix in states)]

    keys = STATE_TRUST_CONFIGS.keys()

    st = datetime.now()
    # in_parallel(keys, extract_and_clean_single_source, batched=False, scheduler='synchronous')
    in_parallel(keys, extract_and_clean_single_source, batched=False)
    print(f'extract_and_clean_all took: {datetime.now() - st}')

    # extract_and_clean_all()
    merge_all_states()
