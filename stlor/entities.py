from dataclasses import dataclass, field
import enum
from pathlib import Path
from typing import List, Optional

import geopandas as gpd


class RightsType(enum.Enum):
    SURFACE = "surface"
    SUBSURFACE = "subsurface"
    NEEDS_LOOKUP = "needs_lookup"
    UNIVERSAL = "universal"
    DEBUG = "debug"


@dataclass
class StateActivityDataSource:
    name: str
    location: str
    rights_type: RightsType
    use_name_as_activity: bool = False
    keep_cols: List[str] = field(default_factory=list)
    activity_name_appendage_col: Optional[str] = None

    def query_data(self, activity_dir: Path) -> gpd.GeoDataFrame:
        loc_path = activity_dir / self.location

        return gpd.read_file(loc_path)


@dataclass
class StateForActivity:
    name: str
    activities: List[StateActivityDataSource]
