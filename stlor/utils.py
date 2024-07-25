import dask.bag
from tqdm.dask import TqdmCallback


def batch_iterable(work_items, batch_size, generator=False):
    return (
        [work_items[i : i + batch_size] for i in range(0, len(work_items), batch_size)]
        if not generator
        else (
            work_items[i : i + batch_size]
            for i in range(0, len(work_items), batch_size)
        )
    )


def in_parallel(work_items, a_callable, scheduler="processes", desc="compute"):
    all_results = []
    with dask.config.set(scheduler=scheduler):
        with TqdmCallback(desc=desc):
            all_results = dask.bag.from_sequence(work_items).map(a_callable).compute()
            return all_results


def combine_delim_list(old_val, update_val, sep="+", do_sort=True):
    old_val = str(old_val)
    if old_val == "nan":
        old_val = ""

    update_val = str(update_val)
    if update_val == "nan":
        update_val = ""

    update_vals = [v.strip() for v in update_val.split(sep) if v.strip()]
    old_vals = [v.strip() for v in old_val.split(sep) if v.strip()]

    new_val = (
        sep.join(sorted(list(set(update_vals + old_vals))))
        if do_sort
        else sep.join(list(set(update_vals + old_vals)))
    )

    return new_val
