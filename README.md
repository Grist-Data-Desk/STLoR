# Misplaced Trust

This repository accompanies Grist's [Misplaced Trust investigation](https://grist.org/project/equity/land-grant-universities-indigenous-lands-fossil-fuels/). It allows users to build and modify the dataset underlying the project. For more details on our methodology, please view [`METHODOLOGY.md`](https://github.com/Grist-Data-Desk/land-grab-2/blob/main/METHODOLOGY.md). A user guide is available at [`USER-GUIDE.md`](https://github.com/Grist-Data-Desk/land-grab-2/blob/main/USER-GUIDE.md). Final built datasets are available in the `public_data` folder.

The investigation was written and reported by [Tristan Ahtone](https://grist.org/author/tahtone/), [Robert Lee](https://grist.org/author/robert-lee/), [Amanda Tachine](https://grist.org/author/amanda-tachine/), [An Garagiola](https://grist.org/author/an-garagiola/), [Audrianna Goodwin](https://grist.org/author/audrianna-goodwin/), [Maria Parazo Rose](https://grist.org/author/maria-parazo-rose/), and [Clayton Aldern](https://grist.org/author/clayton-aldern/). This repository was authored by [Maria Parazo Rose](https://github.com/mariaparazorose), [Clayton Aldern](https://github.com/clayton-aldern), [Marcelle Bonterre](https://github.com/laanak08), and [Parker Ziegler](https://github.com/parkerziegler).

Looking for the code behind the interactives in the project? That repo is [here](https://github.com/Grist-Data-Desk/land-grab-2-interactives/).

`public_data` also includes one additional `xlsx` file related to the Misplaced Trust investigation but underlying a [separate piece](https://grist.org/indigenous/tribal-reservation-state-land-trust-profit/) published by Grist and High Country News. `Grist_STLs-Clipped-to-Reservations.xlsx` effectively subsets the main dataset to include only trust lands present within Federal Indian reservation boundaries.

## Installation

### Python Version Requirement

This project currently requires using Python <= 3.10.4. To set the appropriate Python version locally, consider using a Python version manager like [`pyenv`](https://github.com/pyenv/pyenv).

### Prerequisities

This project uses [Git LFS](https://git-lfs.com/) to store `.zip`, `.dbf`, `.shp`, and `.geojson` files remotely on GitHub rather than directly in the repository source. In order to access these files and build the datasets locally, you'll need to do the following:

1. **Install Git LFS.** Follow [the installation instructions](https://github.com/git-lfs/git-lfs#installing) for your operating system.
2. At the terminal, run the following two commands (without typing the dollar sign):

```sh
$ git lfs install
$ git lfs pull
```

Together, these commands will install the Git LFS configuration, fetch LFS changes from the remote, and replace pointer files locally with the actual data.

### Dependencies

After completing the above, install Python dependencies. At the terminal, run the following command (again, omit the dollar sign):

```sh
$ pip install -e .
```

This only needs to be done the first time you run the script.

## Building the datasets

All functionality is orchestrated by a single top-level command `run.py`. To see a listing of all available command options, run the following command:

```
$ DATA=data python run.py --help
```

`run.py` expects a particular directory structure for the datasets, which is already enforced by this repository's directory structure. As such, you should not move any files from their current locations.

### State Trust Lands (STL) Dataset

The STL dataset is built in stages, with the output of each stage becoming the input of the next stage.
The following assumes your data directory is itself called `data` and all paths will refer to it as such.

#### Stage 1

To execute Stage 1, run the following command at the terminal:

```sh
$ DATA=data python run.py stl-stage-1
```

This command:

- Gathers the raw data from both remote state-run servers and the input data directory.
- Collects all fields-of-interest from the raw data and normalizes the naming across datasets.
- Unifies all individual states' data into one large dataset.

Individual state datasets are written to `data/stl_dataset/step_1/output/merged/<state-abbreviation>.[csv,geojson]`. The unified dataset is written to `data/stl_dataset/step_1/output/merged/all-states.[csv,geojson]`.

#### Stage 2

To execute Stage 2, run the following command at the terminal:

```sh
$ DATA=data PYTHONHASHSEED=42 python run.py stl-stage-2
```

This command matches activity information to the parcels from the unified multi-state dataset output in Stage 1 (`data/stl_dataset/step_1/output/merged/all-states.[csv,geojson]`). The `data` directory for Stage 2 already includes state-specific information about the activities occuring on all parcels.

The output of this stage is written to `data/stl_dataset/step_2/output/stl_dataset_extra_activities.[csv, geojson]`