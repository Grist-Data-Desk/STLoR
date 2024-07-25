import itertools
from functools import partial

import geopandas
import numpy as np
from shapely import STRtree

from stlor.constants import GEOMETRY
from stlor.utils import batch_iterable, in_parallel


def check_spatial_predicates(geometry_1, geometry_2) -> bool:
    """Check for contains, overlaps, within, and covers spatial predicates be-
    tween two feature geometries, their envelopes, and their boundaries.

    Arguments:
    geometry_1 -- the first feature geometry
    geometry_2 -- the second feature geometry

    Returns:
    bool -- True if any spatial predicate is satisfied, False otherwise
    """
    return (
        geometry_1.contains(geometry_2)
        or geometry_2.contains(geometry_1)
        or geometry_1.overlaps(geometry_2)
        or geometry_2.overlaps(geometry_1)
        or geometry_1.within(geometry_2)
        or geometry_2.within(geometry_1)
        or geometry_1.covers(geometry_2)
        or geometry_2.covers(geometry_1)
        or geometry_1.boundary.contains(geometry_2.envelope)
        or geometry_2.envelope.contains(geometry_1.boundary)
        or geometry_1.boundary.overlaps(geometry_2.envelope)
        or geometry_2.envelope.overlaps(geometry_1.boundary)
        or geometry_1.boundary.within(geometry_2.envelope)
        or geometry_2.envelope.within(geometry_1.boundary)
        or geometry_1.boundary.covers(geometry_2.envelope)
        or geometry_2.envelope.covers(geometry_1.boundary)
        or False
    )


def smart_distance(g, batch, i) -> float:
    """Calculate the minimum distance between two geometries.

    Arguments:
    g -- a GeoDataFrame record
    batch -- a batch of GeoDataFrame records
    i -- the index of the record in the batch

    Returns:
    float -- the minimum distance between the geometries
    """
    dists = []
    try:
        d = g[GEOMETRY].envelope.distance(batch[i][GEOMETRY].envelope)
        dists.append(d)
    except Exception:
        pass

    try:
        d = g[GEOMETRY].boundary.distance(batch[i][GEOMETRY].boundary)
        dists.append(d)
    except Exception:
        pass

    try:
        d = g[GEOMETRY].boundary.distance(batch[i][GEOMETRY].envelope)
        dists.append(d)
    except Exception:
        pass

    try:
        dists = [d for d in dists if not np.isnan(d)]
    except Exception:
        pass

    return min(dists)


def _tree_based_proximity_batch(bounds, records, match_dist_threshold, batch):
    """Build an R-tree spatial index on a batch of geographic features and probe
    for matches with a list of geometry boundaries.

    Arguments:
    bounds -- a list of geometry boundaries to probe the R-tree index
    records -- a dictionary of GeoDataFrame records
    match_dist_threshold -- the maximum distance threshold for a match
    batch -- a list of features to build the R-tree index"""
    envelopes = [None if g[GEOMETRY] is None else g[GEOMETRY].envelope for g in batch]
    indices = STRtree(envelopes).nearest(bounds)

    pairs = sorted(
        [
            (
                g[GEOMETRY].boundary.distance(batch[i][GEOMETRY].envelope),
                idx,
                g,
                batch[i],
                check_spatial_predicates(g[GEOMETRY], batch[i][GEOMETRY]),
                i,
            )
            for idx, (g, i) in enumerate(zip(records, indices))
            if smart_distance(g, batch, i) <= match_dist_threshold
        ],
        key=lambda p: p[0],
    )

    return pairs


def tree_based_proximity(
    build_gdf: geopandas.GeoDataFrame, probe_gdf: geopandas.GeoDataFrame, crs: str
) -> itertools.chain:
    """Find matches between two GeoDataFrames using an R-tree spatial index.

    Arguments:
    build_gdf -- the GeoDataFrame from which to build the R-tree index
    probe_gdf -- the GeoDataFrame to probe for matches
    crs -- the coordinate reference system for the GeoDataFrames

    Returns:
    itertools.chain -- an iterator over the matched pairs
    """
    match_dist_threshold = 2.0
    max_records_in_batch = 10_000

    build_gdf_dict = build_gdf.to_dict(orient="records")
    bounds = [g[GEOMETRY].boundary for g in build_gdf_dict if g[GEOMETRY] is not None]

    probe_gdf = (
        probe_gdf.set_crs(crs, allow_override=True).to_crs(crs)
        if not probe_gdf.crs
        else probe_gdf.to_crs(crs)
    )
    probe_gdf_dicts = probe_gdf.to_dict(orient="records")

    batches = [probe_gdf_dicts]
    if len(probe_gdf_dicts) > max_records_in_batch:
        batches = batch_iterable(probe_gdf_dicts, max_records_in_batch)

    matches = in_parallel(
        batches,
        partial(
            _tree_based_proximity_batch,
            bounds,
            build_gdf_dict,
            match_dist_threshold,
        ),
        scheduler="threads",
        desc="tree_based_proximity",
    )

    return itertools.chain.from_iterable(matches)
