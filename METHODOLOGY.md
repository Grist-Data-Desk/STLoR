How we investigated state trust lands on reservations
=====================================================

![](https://grist.org/wp-content/uploads/2024/02/LGU-module2.jpg?quality=75&strip=all)

[Maria Parazo Rose](https://grist.org/author/maria-parazo-rose/), [Clayton Aldern](https://grist.org/author/clayton-aldern/), & [Parker Ziegler](https://parkerziegler.com/)

Sept 12, 2024

Over the course of reporting our [investigation](https://grist.org/land-grant-universities-stolen-indigenous-land/) into state trust lands benefiting land-grant universities, we observed thousands of acres of trust lands within tribal reservation boundaries. This repository represents the methods underlying our subsequent follow-up reporting. In it, we have sought to construct a dataset of all state trust lands, irrespective of beneficiary, that fall within reservation borders. The resulting dataset consists of approximately 2 million acres of state trust lands, spread across 15 states, within 79 tribal reservation boundaries.

To identify the types of activities that take place on state trust land parcels, we collected and compared state datasets describing land use. Activities in such data layers include, but are not limited to: active and inactive leases for coal, oil and gas, minerals, agriculture, grazing, commercial use, real estate, water, renewable energies, and easements. We calculated spatial joins between these layers in order to assign land uses to trust-land parcels on reservations. 

The database administrator can be contacted at <landgrabu@grist.org>. 

If you republish this data or draw on it as a source for publication, cite as: *Parazo Rose, Maria, et al. "State Trust Lands on Reservations Database," Grist.org, September 2024.*

If you leverage this data for [your own reporting](https://grist.org/indigenous/how-to-conduct-your-own-reporting-research-state-trust-lands), please be sure to credit Grist in the story and [please send us](mailto:landgrabu@grist.org) a link.

Terminology
-----------

**STL Parcels:** State trust land parcels, or land granted to states through enabling acts. The word "parcel" refers to well-defined pieces of land that can range in size and are considered distinct units of property.

**PLSS Number:** The surveying method developed and used in the United States to plat, or divide, real property for sale and settling.

**CRS System**: A reference system defining how a map projection in a GIS program relates to and represents real places on Earth. Deciding what CRS to use depends on the regional area of analysis.

**Dataframe**: A "two-dimensional" manner of storing and manipulating tabular data, similar to a table with columns and rows.

**REST API**: Application programming interface, a type of software interface that allows users to communicate with a computer or system to retrieve information or perform a function. Systems with REST APIs, in particular, optimize client-server interactions and can be scaled up efficiently. 

# State Trust Lands on Reservations Methodology

## Steps

1. Acquire data
2. Extract parcels of interest
3. Clean and merge data
4. Acquire updated state activity layers
5. Join in state activity layers to assign land use
6. Clip trust land parcels to exact boundaries of reservations
7. Cull additional parcels with acreage threshold
8. Compute summary statistics by reservation

### Step 1: Acquire data

The initial step involved acquiring comprehensive raw data on all state trust lands to identify parcels overlapping with Indian reservations and Tribal Statistical Areas. This process began with a thorough review of state data and consultation with state agencies to confirm the current status of state trust lands across 30 states.

For states of interest, we examined state databases, primarily associated with departments of natural resources or equivalent agencies, to locate relevant data sources and maps. While most target states maintain online spatial data on land use and ownership, accessibility varied. In several instances, we utilized web scraping techniques to access REST servers and query data through REST APIs. For states where data was not readily available online, we directly contacted land management offices to obtain the most current information on state trust land parcels.

A significant portion of this data had been previously collected for our [Misplaced Trust project](https://grist.org/land-grant-universities-stolen-indigenous-land/), published in February 2024. The current analysis expanded to include California, Nebraska, and Oregon, as well as South Dakota and Oklahoma, which were not featured in our initial reporting on state trust lands on reservations. This expansion allowed for a comprehensive analysis of state trust land parcels across all beneficiaries, rather than solely those benefiting land grant universities.

It is noteworthy that complete information for all surface and subsurface state trust lands in Oklahoma and subsurface state trust lands in South Dakota was not obtainable due to data management practices in these states. Some parcels lack digital mapping, and in certain cases, spatial descriptions did not align with the state Public Land Survey System (PLSS), resulting in no returned parcels.

_(Please see_ [_Appendix A_](https://github.com/Grist-Data-Desk/land-grab-2/blob/main/APPENDIX-A.md) _for specific notes on the data processing for OK and SD.)_

### Step 2: Extract parcels of interest

After acquiring the raw state data, we identified parcels overlapping with tribal reservation areas. The raw state data can be found in the [`01\States Raw Data`](https://github.com/Grist-Data-Desk/STLoR/tree/main/public_data/01_States%20Raw%20Data) folder.

We utilized spatial data from the Bureau of Indian Affairs, specifically their [American Indian and Alaska Native Land Area Representation (AIAN-LAR)](https://biamaps.geoplatform.gov/server/rest/services/DivLTR/BIA_AIAN_National_LAR/MapServer) and [Tribal Statistical Areas (TSA)](https://biamaps.geoplatform.gov/server/rest/services/DivLTR/BIA_AIAN_Tribal_Statistical_Areas/MapServer) data layers. The TSA layer was particularly crucial for identifying Indigenous land in Oklahoma. These spatial files can be found in the [`00\Reservation Layer`](https://github.com/Grist-Data-Desk/STLoR/tree/main/public_data/00_Reservation%20Layer) folder.

The analysis was conducted in QGIS on a state-by-state basis using the *Extract by location* tool. We selected geometric predicates where parcels from the state trust land layers intersect, overlap, or are within the polygons representing tribal land from the BIA layers. This process also captured information from the BIA layers to indicate which reservation each parcel overlapped.

Following identification and filtration, we reviewed the raw data to identify additional fields relevant to our schema. We included these fields in the data extracted from state servers or spatial files, along with the geometric data locating and mapping the parcels. Typically, we retained geographic data such as Public Land Survey System (PLSS) ID numbers, as well as activity or lease information where available.

For data cleaning purposes, overlapping surface and subsurface acres were saved as separate files. The processing for this step can be found in the [`02\States Overlapping Reservations Data`](https://github.com/Grist-Data-Desk/STLoR/tree/main/public_data/02_States%20Overlapping%20Reservations%20Data) folder, which shows, by state, the overlapping surface and subsurface parcel files.

### Step 3: Clean and merge data

A primary challenge in data cleaning was the diversity of formats across data sources. Key issues included:

- Varying coordinate reference systems (CRS) requiring reprojection
- Inconsistent trust name references
- Disparate field contents, with some sources providing detailed information (e.g., location-specific identifiers, land use activity) while others lacked entire categories

Oklahoma and South Dakota presented particular challenges, necessitating custom processing due to their unique data formats and quality.

*(For detailed information on Oklahoma and South Dakota data processing, please refer to [Appendix A](https://github.com/Grist-Data-Desk/land-grab-2/blob/main/APPENDIX-A.md).)*

After data selection, we undertook a standardization process:

1. Cleaning and normalizing the data
2. Establishing a common set of column names
3. Saving overlapping subsurface and surface data for each state as both GeoJSON and CSV files, facilitating table data manipulation and subsequent spatial data rejoining

We standardized the information for each state in two primary ways:

1. Adding contextual information (e.g., state enabling act, managing agency)
2. Preserving meaningful raw data, including:
   - Associated trust name (or assigned revenue beneficiary)
   - Rights type (surface or subsurface acreage)
   - Locational information

The standardized data can be found in the [`03\States Merged Layers`](https://github.com/Grist-Data-Desk/STLoR/tree/main/public_data/03_States%20Merged%20Layers) folder, which contains merged data for each state.

To ensure consistency, we recalculated GIS acreage, addressing cases where states did not provide reported acreage and establishing a standardized reporting method.

### Step 4: Acquire updated state activity layers

To identify current land use activities on the identified parcels, we collected diverse datasets from states, including:

- Active and inactive leases for:
  - Coal
  - Oil and gas
  - Minerals
  - Agriculture
  - Grazing
  - Commercial use
  - Real estate
  - Water
  - Renewable energies
  - Easements

Data collection methods included:
1. Searching state databases
2. Contacting land use offices directly
3. Querying data through REST APIs

The land use activity information is current as of Spring 2024, with datasets collected through April and May of the same year.

For processing efficiency, we converted the majority of datasets to shapefiles, reducing the need for repeated server queries during activity match operations.

*(For a comprehensive list of data sources and state-specific querying details, please refer to [Table 1](https://docs.google.com/spreadsheets/d/1s80JRwNA9j463TcezXK7S14h4mt4L2ltARcyKkUSJuc/edit?usp=sharing).)*

### Step 5: Join in state activity layers to assign land use

We processed land use activity for state trust land parcels using a codebase structure designed for the Misplaced Trust dataset. This section summarizes the process and highlights important updates to the program functions that enhanced nuance and clarity in the final dataset.

#### Methodology Overview

States manage and track land use activity data in diverse ways:
- Some use separate datasets for each activity type, while others combine all activities into a single file
- Activity status reporting varies (active, inactive, specific status like prospecting or drilling)
- Classification methods differ (broad categories vs. specific descriptions)
- Some states use numerical codes requiring interpretation keys

To accommodate these variations, we selected activity descriptions that balanced detail and clarity, either using specific column values or general data layer titles. For more information, refer to the [`activity.py`](https://github.com/Grist-Data-Desk/STLoR/blob/main/stlor/activity.py) and [`config.py`](https://github.com/Grist-Data-Desk/STLoR/blob/main/stlor/config.py) files.

#### Data Processing

1. Gathered state datasets with spatial information on land use activities (points or polygons)
2. Organized activity datasets into [R-trees](https://ia600900.us.archive.org/27/items/nasa_techdoc_19970016975/19970016975.pdf) for efficient processing
3. Established bounding "envelopes" around point data to create minimal appropriate polygons
4. Compared activity R-trees to our trust land dataset

This approach allowed for faster comparisons by examining larger areas before narrowing down to specific parcels.

#### Function Updates

To enhance accuracy and clarity, we implemented several updates:

1. Added an *activity_info* field showing lease status and lessee information for each activity overlap instance. For example, a parcel in New Mexico with multiple Right of Way lease overlaps:

| activity                              | activity_info                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Commercial lease, Rights of way lease | _layer_index: NM-Commercial lease activity: Commercial lease lease_status: ACTIVE lessee: ENERGY MINERALS & NATURAL RES DEPT_<br>_layer_index: NM-Rights of way lease activity: Rights of way lease lease_status: ACTIVE lessee: SOCORRO ELECTRIC COOP INC_<br>_layer_index: NM-Rights of way lease activity: Rights of way lease lease_status: ACTIVE lessee: WESTERN NM TELEPHONE CO INC_ |

2. Introduced a *rights_type_info* field to reflect mineral rights associated with subsurface parcels
3. Included information on inactive leases due to their implications for tribal land use management
4. Adjusted overlap assessment methodology using GeoPandas to improve accuracy
5. Established a clearer method for assigning rights types to state activity layers:
   - Surface
   - Subsurface
   - Universal
   - Needs Lookup

#### Data Output

The resulting data can be found in the [`04_All States`](https://github.com/Grist-Data-Desk/STLoR/tree/main/public_data/04_All%20States) folder, with files named to reflect processing steps:

1. `01_Initial-Merge`: Merged 15 state data layers in EPSG:5070
2. `02_SendtoActivityMatch`: Updated object ID field and cleaned columns
3. `03_ActivityMatch`: Final output of the activity match process

For detailed information on data sources and state-specific querying details, please refer to [Table 1](https://docs.google.com/spreadsheets/d/1s80JRwNA9j463TcezXK7S14h4mt4L2ltARcyKkUSJuc/edit?usp=sharing).

### Step 6: Clip trust land parcels to exact boundaries of reservations

Our initial spatial analysis to identify state trust land parcels overlapping with reservation land included parcels that may only partially overlap or exist on reservation edges. This extensive approach provided important context for understanding the issue's landscape, both literally and figuratively, ensuring a comprehensive dataset capturing all areas of overlap.

However, our story's ultimate focus was on how state trust lands interfere with tribal jurisdiction. Therefore, we decided to concentrate on state trust lands explicitly overlapping with reservation land.

#### Methodology

To achieve this focused dataset, we employed the following process:

1. **Clipping**: We used QGIS's geoprocessing function to clip the state trust lands layer to the exact outlines of the borders in the Bureau of Indian Affairs (BIA) reservations and tribal statistical area layers.

2. **Projection**: For accuracy, we conducted this analysis in the Conus Albers projection (EPSG: 5070). Both the state trust lands layer and the BIA layers were projected into this coordinate system.

#### Data Output

The resulting data from this process can be found in the [`04_All States`](https://github.com/Grist-Data-Desk/STLoR/tree/main/public_data/04_All%20States) folder. The file name reflects the data processing step:

- `04_Clipped`: This dataset has been clipped to the BIA layers and includes a new GIS-calculated column reflecting the updated acreage.

This refined dataset provides a more precise representation of state trust lands directly impacting tribal jurisdictions, aligning with our story's focus while maintaining the broader context established in earlier analysis stages.

### Step 7: Cull additional parcels with acreage threshold

After clipping the state trust land parcels to tribal lands, we recalculated the GIS acreage to determine the new area of each parcel (referred to as "clipped acreage"). This process revealed some parcels with very small or zero areas, often representing slivers or lines of overlap at reservation borders.

To align with our focus on tribal jurisdiction issues, we refined the dataset to exclude instances of minimal overlap:

1. Removed parcels with zero clipped acreage
2. Eliminated instances of improper overlap (e.g., Wyoming parcels overlapping with the Crow reservation in Montana)
3. Conducted a sensitivity analysis on states with high frequencies of checkered state trust land acreage near reservations (Arizona, New Mexico, Minnesota, and Montana)

The sensitivity analysis aimed to identify an appropriate threshold for excluding small parcels while retaining meaningful data. We examined parcels along reservation borders to assess average sizes of clipped parcel slivers, noting instances of small parcels fully within reservation borders. The analysis considered thresholds between 5-15 acres.

Results of the sensitivity analysis for selected states:

| State      | Original                                            | Acreage change                    | Acreage > 5                                                                                                          | Acreage change                  | Acreage > 7                                                                                                                | Acreage change                  | Acreage > 10                                         | Acreage change                  | Acreage > 13                                                                                                                        | Acreage change                  | Acreage > 15                                         |
| ---------- | --------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------- |
| Arizona    | # of parcels: 1160<br>Acreage: 41,858.38<br>Notes:  | _Parcel: -1015<br>Acres: -522.81_ | # of parcels: 145<br>Acreage: 41,335.57<br>Notes:                                                                    | _Parcel: -14<br>Acres: 83.56_   | # of parcels: 131<br>Acreage: 41,252.01<br>Notes:                                                                          | _Parcel: -7<br>Acres: 57.28_    | # of parcels: 124<br>Acreage: 41,194.73<br>Notes:    | _Parcel: -0<br>Acres: -0_       | # of parcels: 124<br>Acreage: 41,194.73<br>Notes: Two parcels that are \~15 acres are well within the borders, not just on the edge | _Parcel: -2<br>Acres: -29.02_   | # of parcels: 122<br>Acreage: 41,165.71<br>Notes:    |
| New Mexico | # of parcels: 7421<br>Acreage: 130,088.54<br>Notes: | _Parcel: -4100<br>Acres: -456.28_ | # of parcels: 3321<br>Acreage: 129,632.26<br>Notes: Some parcels under 5 acres were fully within reservation borders | _Parcel: -18<br>Acres: -114.52_ | # of parcels: 3303<br>Acreage: 129,517.7<br>4Notes: A group of parcels around 6 acres was fully within reservation borders | _Parcel: -4<br>Acres: -34.56_   | # of parcels: 3299<br>Acreage: 129,483.18<br>Notes:  | _Parcel: -23<br>Acres: -270.63_ | # of parcels: 3276<br>Acreage: 129,212.55<br>Notes:                                                                                 | _Parcel: -10<br>Acres: -146.01_ | # of parcels: 3266<br>Acreage: 129,066.54<br>Notes:  |
| Minnesota  | # of parcels: 9627<br>Acreage: 344,891.40<br>Notes: | _Parcel: -719<br>Acres: -352.06_  | # of parcels: 8908<br>Acreage: 344,539.34<br>Notes:                                                                  | _Parcel: -41<br>Acres: -251.33_ | # of parcels: 8867<br>Acreage: 344,288.01<br>Notes: There are some small parcels fully within reservation borders          | _Parcel: -40<br>Acres: -346.97_ | # of parcels: 8827<br>Acreage: 343,941.04<br>Notes:  | _Parcel: -62<br>Acres: -727.19_ | # of parcels: 8765<br>Acreage: 343,213.85<br>Notes:                                                                                 | _Parcel: -41<br>Acres: -567.57_ | # of parcels: 8724<br>Acreage: 342,646.28<br>Notes:  |
| Montana    | # of parcels: 701<br>Acreage:162,369.62<br>Notes:   | _Parcel: -192<br>Acres: -95.33_   | # of parcels: 509<br>Acreage: 162,274.29<br>Notes:                                                                   | _Parcel: -7<br>Acres: -41.22_   | # of parcels: 502<br>Acreage: 162,233.07<br>Notes:                                                                         | _Parcel: -8<br>Acres: -70.94_   | # of parcels: 494<br>Acreage: 162,162.13<br>Notes:   | _Parcel: -5<br>Acres: -55.05_   | # of parcels: 489<br>Acreage: 162,107.08<br>Notes:                                                                                  | _Parcel: -3<br>Acres: -42.71_   | # of parcels: 486<br>Acreage: 162,064.37<br>Notes:   |

Based on these results, we recommend retaining parcels with acreage greater than 10 in the final dataset.

Summary of dataset versions:

| Dataset version description                                                     | # of Parcels | Total Acreage | # of Reservations |
| ------------------------------------------------------------------------------- | ------------ | ------------- | ----------------- |
| All STL parcels that intersect, overlap, or are within Indian reservation areas | 34765        | 3,067,445.17  | 125               |
| All STL parcels, clipped to Indian reservation areas                            | 34762        | 2,076,008.19  | 125               |
| Clipped STL parcels; parcels with acreage < 0 culled                            | 32646        | 2,076,008.19  | 118               |
| Clipped STL parcels; parcels with acreage < 5 culled                            | 27653        | 2,073,800.99  | 82                |
| Clipped STL parcels; parcels with acreage < 7 culled                            | 27508        | 2,072,920.86  | 81                |
| Clipped STL parcels; parcels with acreage < 10 culled                           | 27364        | 2,071,705.50  | 80                |
| Clipped STL parcels; parcels with acreage < 13 culled                           | 27210        | 2,069,926.07  | 79                |
| Clipped STL parcels; parcels with acreage < 15 culled                           | 27119        | 2,068,648.65  | 79                |

Given the nature of navigable rivers and streambed trusts (and the shifting geological/hydrological nature of borders delineated by rivers), we also decided to remove state trust lands at river bottoms that fall along reservation boundaries and are redistributing the data accordingly. The affected reservations include the Blackfeet, Fort Peck, Fort Yuma (Quechan), and Spokane Reservations. In all but the latter case, the reservations in question remain in the dataset. Spokane has been removed, since the only parcel on Spokane we identified fell in this category. All told, we have removed 689.59 subsurface and 812.38 surface acres across our 2.1M-acre dataset (i.e. we retained 99.93% of the originally distributed acreage).

#### Data Output

The resulting data from this process can be found in the [`04_All States`](https://github.com/Grist-Data-Desk/STLoR/tree/main/public_data/04_All%20States) folder:

- `05_AcreageGreaterThan10`: This data layer contains only parcels larger than 10 acres.

- `06_All-STLs-on-Reservations-Final`: This is the final data layer with all table information checked and cleaned.

### Step 8: Compute summary statistics by reservation

To present the data in a format that allows readers to comprehend the information on a reservation-by-reservation basis, we aggregated the data using the following methodology:

#### Aggregation Process

1. Utilized the **Aggregate** tool in QGIS to combine parcels by reservation.
2. Delineated total surface and subsurface acreage, in addition to the total acreage and parcel count.
3. Split the file by rights-type to obtain these totals.
4. Captured each unique instance of trust names associated with each reservation.
5. Added the total acreage of each reservation to the spreadsheet.

This process allows for a comprehensive view of state trust lands within each reservation, including:
- Total acreage (surface and subsurface)
- Number of parcels
- Associated trusts
- Proportion of reservation land affected

#### Data Output

The resulting data from this process can be found in the [`05_Final-Dataset`](https://github.com/Grist-Data-Desk/STLoR/tree/main/public_data/05_Final-Dataset) folder:

1. `01_STLs-on-Reservations-by-Reservation`[`.csv`, `.xlsx`, `.geojson`]: This data layer contains all the focus parcels, aggregated by reservation.

2. `02_All-STLs-on-Reservations`[`.csv`, `.xlsx`, `.geojson`]: This is the final data layer containing all individual parcels.

These final datasets provide a comprehensive and accessible overview of state trust lands on reservations, facilitating analysis and understanding of the impact on tribal jurisdictions.

## Automation

Following the original QGIS analysis, we have developed Python scripts to automate a portion of the analysis. This automation aims to assist journalists, developers, and analysts in reproducing our work or modifying the analysis to explore new directions.

### Differences from the QGIS Analysis

Our Python scripts are designed to faithfully replicate the original QGIS analysis step-by-step. However, we implemented one significant change in Step 8, which computes the aggregated total, surface, and subsurface acres by reservation.

#### Key Change in Aggregation Method

In the original QGIS analysis:
- We used the **Aggregate** tool to compute values by reservation.
- The `sum` function was applied to the `clipped_acres` column.

Issue identified:
- Certain subsurface trust land parcels in some states partially overlap.
- A straight `sum` aggregation of the `clipped_acres` column effectively double-counts the area of overlap.

Solution implemented in Python (`aggregate.py`):
1. For each reservation, we union all surface and subsurface trust lands into two separate `MultiPolygons`:
   - One for surface acres
   - One for subsurface acres
2. The total state trust land acreage on a reservation is computed by summing these two values.

#### Impact of the Change

The reported aggregates for each reservation now capture the total **non-overlapping** trust lands acreage. Consequently, these values may be smaller than those obtained by directly summing the `clipped_acres` column.

This methodological adjustment enhances the accuracy of our acreage calculations, particularly in cases where subsurface parcels overlap.

The Python scripts and associated documentation can be found in the [project repository](https://github.com/Grist-Data-Desk/STLoR). We encourage users to review the code and documentation for a detailed understanding of the automated analysis process.
