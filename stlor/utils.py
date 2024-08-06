from typing import Any, Iterator

import dask.bag as db
from dask.diagnostics import ProgressBar


def batch_iterable(
    items: list[Any], batch_size: int, generator=False
) -> list[list[Any]] | Iterator[list[Any]]:
    """Create batches of batch_size from an iterable.

    Arguments:
    items {iterable} -- the iterable to batch
    batch_size {int} -- the size of each batch
    generator {bool} -- whether to use a generator as the iterator, in lieu of a
    list comprehension

    Returns:
    list[list[Any]] | Iterator[list[Any]] -- the batches of items either as a
    list or an iterator
    """
    return (
        [items[i : i + batch_size] for i in range(0, len(items), batch_size)]
        if not generator
        else (items[i : i + batch_size] for i in range(0, len(items), batch_size))
    )


def in_parallel(items: list[Any], fn) -> list[Any]:
    """Execute a function on a list of items in parallel using dask.

    Arguments:
    items {list[Any]} -- a list of items to process
    fn {Any} -- a function to apply over each item
    """
    with ProgressBar():
        return db.from_sequence(items).map(fn).compute(scheduler="processes")


def _clean_and_split(s: str, sep: str) -> list[str]:
    """Remove NaN values, trim whitespace, and split a string on a delimiter.

    Arguments:
    s {str} -- the string to clean and split
    sep {str} -- the delimiter to split on

    Returns:
    list[str] -- the cleaned and split list of strings
    """
    if s == "nan":
        return []
    return [v.strip() for v in s.split(sep) if v.strip()]


def combine_delim_list(existing: str, update: str, sep=",") -> str:
    """Combine two delimited lists of strings, removing duplicates and sorting.

    Arguments:
    existing {str} -- the existing list of strings
    update {str} -- the new list of strings

    Returns:
    str -- The combined list of strings
    """
    existing_vals = _clean_and_split(existing, sep)
    update_vals = _clean_and_split(update, sep)

    combined = set(existing_vals + update_vals)
    return sep.join(sorted(combined))
