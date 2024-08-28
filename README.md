# State Trust Lands on Reservations

This repository accompanies an upcoming investigation by Grist and High Country News exploring state trust lands on tribal nations' reservations. It allows users to build and modify the dataset underlying the project. For more details on our methodology, please view [`METHODOLOGY.md`](https://github.com/Grist-Data-Desk/STLoR/blob/main/METHODOLOGY.md). Final built datasets are available in the `public_data` folder.

The investigation was written and reported by [Maria Parazo Rose](https://grist.org/author/maria-parazo-rose/) and [Anna V. Smith](https://www.hcn.org/author/anna-v-smith/), with editing by [Tristan Ahtone](https://grist.org/author/tristan-ahtone/) and [Kate Schimel](https://www.hcn.org/author/kate-schimel/). This repository was authored by [Maria Parazo Rose](https://github.com/mariaparazorose), [Clayton Aldern](https://github.com/clayton-aldern), and [Parker Ziegler](https://github.com/parkerziegler).

## Prerequisites

### Git LFS

This project uses [Git LFS](https://git-lfs.com/) to store `.dbf` and `.shp` files remotely on GitHub rather than directly in the repository source. In order to access these files and build the datasets locally, you'll need to do the following:

1. **Install Git LFS.** Follow [the installation instructions](https://github.com/git-lfs/git-lfs#installing) for your operating system.
2. At the terminal, run the following two commands:

```sh
$ git lfs install
$ git lfs pull
```

Together, these commands will install the Git LFS configuration, fetch LFS changes from the remote, and replace pointer files locally with the actual data.

### Virtual Environments

While not strictly necessary, we recommend creating a [Python virtual environment](https://docs.python.org/3/library/venv.html) to isolate this project's dependencies from other Python projects on your machine. The following commands will create a virtual environment and active it in your shell:

```sh
$ python -m venv .venv
$ source .venv/bin/activate
```

Note that you're welcome to name your virtual environment something other than `.venv`.

## Installation

After completing the above, install Python dependencies with the following command:

```sh
$ pip install .
```

If you'd like to edit the source code in the course of your work, make sure to pass the `-e` or `--editable` flag to install the `stlor` package in editable mode.

```sh
$ pip install -e .
```

## Building the datasets

Originally, the datasets in this repository were produced through a manual process using QGIS, documented in [METHODOLOGY.md](https://github.com/Grist-Data-Desk/STLoR/blob/main/METHODOLOGY.md). The scripts in this repository transfer a subset of these steps to an automated process using Python.

### Activity Matching, Parcel Clipping, and Parcel Filtering

The primary automation in this repository involves enriching state trust land parcels with information on their designated land use activities, clipping parcels to reservation boundaries, and filtering parcels to those 10 acres and greater. Collectively, these actions correspond to steps 5-7 in [METHODOLOGY.md](https://github.com/Grist-Data-Desk/STLoR/blob/main/METHODOLOGY.md).

To run these steps locally, execute the following command from the root directory:

```sh
python stlor/main.py
```

The outputs of this process are written to `03_ActivityMatch.{geojson,csv,xlsx}`, `04_Clipped.{geojson,csv,xlsx}`, `05_AcreageGreaterThan10.{geojson,csv,xlsx}`, and `06_All-STLs-on-Reservations-Final.{geojson,csv,xlsx}` in the `public_data/04_All States` folder. All outputs are in the NAD83 Conus Albers (EPSG:5070) coordinate reference system. In addition, versions of each dataset in the WGS84 (EPSG:4326) coordinate reference system are generated with the `_WGS84` suffix. Web mapping libraries such as [Leaflet](https://leafletjs.com/), [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/), and [D3](https://d3js.org/) can currently only work with geospatial data in WGS84, so please use this version of each dataset when integrating with your favorite web mapping tool.

The `02_All-STLs-on-Reservations{_WGS84}.{geojson,csv,xlsx}` files in the `public_data/05_Final-Dataset` folder are just re-exports of the `06_All-STLs-on-Reservations-Final{_WGS84}.{geojson,csv,xlsx}` files.

### Summary Statistics by Reservation

The secondary automation in this repository involves computing aggregate statistics of state trust land acreage by reservation. This step corresponds to step 8 in [METHODOLOGY.md](https://github.com/Grist-Data-Desk/STLoR/blob/main/METHODOLOGY.md).

To compute the aggregations locally, execute the following command from the root directory:

```sh
$ python stlor/aggregate.py
```

This script computes summary statistics on state trust land total acreage, surface acreage, subsurface acreage, parcel count, surface parcel count, and subsurface parcel count for each reservation, in addition to measuring the total reservation area. All area computations are performed in the NAD83 Conus Albers (EPSG:5070) coordinate reference system. The output of this step is written to `public_data/05_Final-Dataset/01_STLs-on-Reservations-by-Reservation{_WGS84}.{geojson,csv,xlsx}`.
