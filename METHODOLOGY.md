# State Trust Lands on Reservations Methodology
## Steps: 
1. Data acquisition: locate the state trust land parcels for all states 
2. Extract the parcels of interest – aka, the ones that overlap with Indian reservations and Tribal Statistical Areas
3. Clean and merge the data
4. Acquire updated state activity data
5. Conduct a spatial analysis to get information on land use activity
6. Clip the trust land acreage to the exact boundaries of reservations
7. Cull the parcels that show no overlap
8. Create a summary statistics spreadsheet, to show all information by reservation
### Data acquisition
For this story, the first step was to acquire the raw data of _all_ state trust lands within that state so we could then filter for the parcels that overlapped with Indian reservations and Tribal Statistical Areas. We started by confirming which states still had state trust lands. This required reviewing the state data or contacting state agencies about state trust land history for 30 different states. 

Once we determined which states were states of interest, we started by searching state databases, typically associated with their departments of natural resources, or the equivalent, to find data sources or maps. While most of the target states maintain online spatial data on land use and ownership, not all of that data is immediately available to download or access. For several states, we were able to scrape their online mapping platforms to access their REST servers and then query data through a REST API. For other states, we directly contacted their land management offices to get the most up-to-date information on STL parcels. 

Much of this data had been previously collected for our project, Misplaced Trust, which was published in February 2024. However, we added three new states to our analysis: California, Nebraska, and Oregon. We also included analysis for South Dakota and Oklahoma, which were not included in the initial piece about state trust lands on reservations. This was because, for Misplaced Trust, we only collected spatial data for the trust lands that sent revenue to the land grant universities we were interested in, and didn’t yet have the state trust land parcels for _all_ beneficiaries. 

It's important to note that we could not find information for all of the surface and subsurface state trust lands in Oklahoma and the subsurface state trust lands in South Dakota because of how their data is kept. In both states, not all of their surface or subsurface trust land parcels are digitally mapped. Additionally, the spatial description of some parcels did not match to spatial descriptions in the state PLSS system, which meant no parcels were returned. The difference in how we collected the trust land data between this project and the Misplaced Trust project was that we did not only look at parcels that benefitted land grant universities – we collected all of them. 

_(Please see_ [_Appendix A_](https://github.com/Grist-Data-Desk/land-grab-2/blob/main/APPENDIX-A.md) _for specific notes on the data processing for OK and SD.)_

### Extract the STL overlap with reservation areas

Once we had the raw state data in hand, we selected the parcels that overlapped with tribal reservation areas. _The raw state data can be found in the `01\_States Raw Data` folder._

We used spatial data from the Bureau of Indian Affairs, referencing their data layer on [American Indian and Alaska Native Land Area Representation (AIAN-LAR)](https://biamaps.geoplatform.gov/server/rest/services/DivLTR/BIA_AIAN_National_LAR/MapServer), as well as their [Tribal Statistical Areas (TSA)](https://biamaps.geoplatform.gov/server/rest/services/DivLTR/BIA_AIAN_Tribal_Statistical_Areas/MapServer) data layer. The Tribal Statistical Areas layer was used to identify Indigenous land in Oklahoma specifically. _These spatial files can be found in the `00\_Reservation Layer` folder._

We conducted this analysis in QGIS, on a state-by-state basis, using the _Extract by location_ tool. The geometric predicates we selected were where parcels from the state trust land layers **_intersect, overlap,_** or **_are within_** the polygons representing tribal land from the BIA layers. In this process, we also captured the information from the BIA layers to indicate which reservation the parcel overlapped with. 

Once identified and filtered, we reviewed the raw data to identify whether there were any additional fields that would be helpful to our schema and included those fields as part of the data we extracted from state servers or the spatial files we were given, in addition to the geometric data that located and mapped the parcels themselves. The information we kept was typically geographic data of some kind, like PLSS ID numbers, though some states provided activity or lease information, which we also kept. 

We saved the overlapping surface and subsurface acres as separate files, for data cleaning purposes, which will be explained in the next step. _The processing for this step can be found in the `02\_States Overlapping Reservations Data` folder, which shows, by state, the overlapping surface and subsurface parcel files._

### Data cleaning and merge

When cleaning this data, one of the main considerations was that nearly all the data sources came in different and incompatible formats: The coordinate reference systems, or CRS, varied and had to be reprojected, the references to the trust names were inconsistent, and some files contained helpful fields, like location-specific identifiers or land use activity, while others were missing entire categories of information. 

This was particularly difficult for two states, Oklahoma and South Dakota, which required custom processing based on the format and quality of the initial data provided. 

_(Please see_ [_Appendix A_](https://github.com/Grist-Data-Desk/land-grab-2/blob/main/APPENDIX-A.md) _for specific descriptions of the data processing for OK and SD.)_ 

Once we narrowed down the data we wanted, we cleaned and standardized the data, and sorted it into a common set of column names. We saved the overlapping subsurface and surface data for each state as both a GeoJSON file and as a CSV. This allowed us to add and manipulate the table data and then rejoin the information to the spatial data. 

We standardized the information for each state in **two** ways. First, we added contextual information like the state enabling act and state managing agency. Second, we ensured that meaningful information from the raw data was kept clearly in the dataset, including the associated trust name (or assigned beneficiary of the revenue from that parcel), the rights type (surface or subsurface acreage), and the locational information. _The data for this step can be found in the `03\_States Merged Layers` folder, which shows the merged data for each state._

We also reran the GIS calculated acreage, since not all states provided the reported acreage and so that we would have a standardized way of reporting it. 

### State activity dataset collection

To identify what types of activity currently takes place on these parcels, we collected datasets on different kinds of land use from states, including, but not limited to, active and inactive leases for coal, oil and gas, minerals, agriculture, grazing, commercial use, real estate, water, renewable energies, and easements. We searched state databases or contacted land use offices to acquire spatial data, and we queried data through REST APIs. The information for state land use activity is dated to Spring 2024, with activity datasets collected through April and May of this year. 

For efficiency’s sake, we converted the majority of the datasets to shapefiles for faster processing rather than call state servers each time we ran our activity match operations.

_(Please see_ [_Table 1_](https://docs.google.com/spreadsheets/d/1s80JRwNA9j463TcezXK7S14h4mt4L2ltARcyKkUSJuc/edit?usp=sharing) _for a list of the data sources referenced for each state, as well as all state-specific querying details.)_

### Land use activity match

We processed the land use activity for all of these state trust land parcels via the same codebase structure that was designed and used for the Misplaced Trust dataset. We offer here a short summary of the process, as well as several important updates that we made to the program functions that added nuance and clarity in the final dataset.

### Overall summary:

It is important to note that states manage and track land use activity data in a variety of ways. Some states have different datasets for each type of activity, while some combine all land use activity into a single file. Some states indicate whether a certain lease or activity is presently active or not, some specify its precise status (prospecting, drilling, etc.), and some don't include that information at all. Activities might be broadly classified as easement, agriculture, oil and gas, or coal, but some states might include a more specific description about its nature such as "Natural Gas Storage Operations," "Access Road," or "Offset Gas Well Pad." Some states use numbers that require a key to interpret the activity. To accommodate these variations, we used the activity description that struck the best balance between being detailed and being clear, which either meant calling on the value of a specific column or titling the data layer as something general ("Oil and Gas") and using that as the activity name. Users can look at the `activity_match.py` and `state_data_sources.py` files for further detail. 

To identify how state trust land parcels are used, we gathered state datasets with spatial information on where land use activities take place. The data came as either points or polygons. 

Because there were so many data points in the information coming from states that were being matched against each row in the Grist dataset, we needed to find a way to expedite the process. Ultimately, we organized the activity datasets from each state into their own [R-trees](https://ia600900.us.archive.org/27/items/nasa_techdoc_19970016975/19970016975.pdf), tree data structures that are used to index multidimensional information, which allowed us to group together nearby parcels (which we will use from here on to mean polygons or points). For point data, we established bounding "envelopes" around each point to create the smallest appropriate polygon. In the diagram below, you can see an example of how nearby parcels are grouped together.

This data structure works by collecting nearby objects and organizing them with their minimum bounding rectangle. Then, one activity-set-turned-R-tree was compared to our trust land dataset at a time. In that process, a comparison looked at one Grist parcel through an activity's R-tree, which is like a cascading way of identifying what parcels are close together. Whenever a query is conducted to compare another dataset against information in this R-tree, if a parcel does not intersect a given bounding rectangle, then it also cannot intersect any of the contained objects. 

In other words, instead of comparing every parcel in our trust land dataset to every single other activity parcel in all of the state datasets, we are able to do much faster comparisons by looking at bigger areas and then narrowing down to more specific parcels when it's relevant. 

### Function updates summary:

To conduct this activity match with as much accuracy and clarity as possible, we made several updates: 

- First, we added a field called _activity\_info,_ which shows the lease status and the lessee information. Each instance of activity overlap has its own line of corresponding information in the _activity\_info_ field, and shows the name of the state activity layer and the activity that matched. This is important to note because the _activity_ column reports what kinds of activities overlap with that parcel, but it tracks each unique instance of an activity. For example, a state trust land parcel in New Mexico might have multiple instances of a Right of Way activity. In the activity column, “Right of way lease” will show up once, but the _activity\_info_ column will contain information for each instance of overlap. 

In this example, this parcel in New Mexico has two instances of a Right of way lease overlap. 

| activity                              | activity\_info                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Commercial lease, Rights of way lease | _layer\_index: NM-Commercial lease activity: Commercial lease lease\_status: ACTIVE lessee: ENERGY MINERALS & NATURAL RES DEPT_<br>_layer\_index: NM-Rights of way lease activity: Rights of way lease lease\_status: ACTIVE lessee: SOCORRO ELECTRIC COOP INC_<br>_layer\_index: NM-Rights of way lease activity: Rights of way lease lease\_status: ACTIVE lessee: WESTERN NM TELEPHONE CO INC_ |

Just as a note, some states included information about lease activity in their state trust land layers, like Arizona and New Mexico. We collected that information in the initial state data processing step. Similarly, Oregon, Nebraska, and Oklahoma had associated land use information with their parcels, but did not include lessee information.

- Second, we added a field called _rights\_type\_info_, to reflect the kind of mineral rights associated with a subsurface parcel without conflating that information as active land use. We did this because several states, Colorado, Utah, and Montana, sent their subsurface data as three separate files to indicate the kind of mineral rights associated: a combination of coal, oil and gas, and other mineral rights. Because this indicates how that land may be used, we did not want to lose that information.

* Third, we included information on inactive leases. This is because we looked at state trust lands on reservations, or state owned land on the reservation, and ownership of that land still has implications for tribal land use management, which is the focus of our story. 

- Fourth, we adjusted the way we assess instances of overlap. This was because we noticed, when reviewing the data in QGIS, that one particular state activity layer with point data that we could see clearly overlapped our state trust land parcels was not being captured when we ran the analysis. We used GeoPandas to work with the geoprocessing in Python, and so expanded how we measured overlap from just looking at the [boundary](https://geopandas.org/en/stable/docs/reference/api/geopandas.GeoSeries.boundary.html) of a geometry to also looking at the [envelope](https://geopandas.org/en/stable/docs/reference/api/geopandas.GeoSeries.envelope.html) of a geometry. Ultimately, this change means that the program is better at registering when there is overlap. After making this change, we also tested to see if it changed how much overlap we saw in other states – there was minimal to no change. Users interested in the data can look in the `overlap.py` file, line 310 to see the exact language.

* Lastly, we established a clearer method for indicating the rights-type that any given state activity layer should be associated with. A state activity layer is now assigned a rights type of Surface, Subsurface, Universal, or Needs Lookup. Surface and Subsurface rights type assigned to an activity layer means that activity will only match to a state trust land parcel that has that respective rights type. So, agricultural activity layers will only match to surface rights parcels and oil and gas will only match to subsurface rights parcels. Universal rights type means that that activity layer will match to both surface and subsurface parcels, which is relevant for activity layers like Arizona’s Commercial lease layer, which has activities pertinent to both rights types. Needs Lookup activity layers are structured to look at the value of the matching activity and then see what the corresponding rights type should be, as defined in a table. This is relevant in layers where a single activity layer contains a combination of activities that should only correspond to certain rights-types. For example, the Current Leases layer in Washington has information on Grazing Leases, Agricultural Leases, and Mineral Permits – and we want to capture those activities, but only on the appropriate state trust land parcels. The Needs Lookup rights type allows us to identify whether it is a compatible activity with more nuance. 

### Data:

The resulting data from this process can be seen in the `_04\_All States_` folder. Each file is named in such a way that it reflects how the data changed in that step. 

- `01\_Initial-Merge`: Each of the 15 state data layers is merged into one, in `EPSG:5070`. 

- `02\_SendtoActivityMatch`: This data has an updated object ID field and the various columns are cleaned to match (for example, the way the Wyoming layer was saved as a .shp file instead of a GeoJSON, to preserve the projection, cutoff the column names). This layer is renamed as ‘all-states.geojson’ and used in the activity match processing. 

- `03\_ActivityMatch`: This data is the result of the activity match process. 


### Clip our dataset to the exact boundaries of the reservations

Because of how we conducted our spatial analysis to identify the state trust land parcels that overlapped reservation land, we had an additional step to find the exact amount of overlap. In our initial parcel selection process, we included parcels that may only partially overlap with reservation land or may exist on the edges of reservations. We felt that this extensive context is important for understanding the landscape of this issue, literally and figuratively, and ensured that we would end up with a dataset that captured all areas of overlap. However, our ultimate focus for the story was on how the presence of state trust lands interfered with tribal jurisdiction, and we decided to just look at the state trust lands that explicitly overlapped with reservation land. 

To do this, we **clipped** the state trust lands layer to follow the exact outlines of the borders in the BIA reservations and tribal statistical area layers mentioned earlier. This is a geoprocessing function in QGIS. For accuracy, we ran this analysis in the Conus Albers projection (EPSG: 5070), meaning both the state trust lands layer and the BIA layers were in that projection.

 Data:

The resulting data from this process can be seen in the `_04\_All States_` folder. Each file is named in such a way that it reflects how the data changed in that step. 

- `04\_Clipped`: This data has been clipped to the BIA layers and has a new GIS calculated column that reflects the new acreage. 

### Cull unnecessary parcels

After we did the **clip** of the state trust land parcels to the tribal lands, we reran the GIS-calculated acreage to determine the new area of each parcel, hereafter referred to as the “clipped acreage”. In the clipping process, some parcels were reduced to a very small area or, in some cases, no area at all. These were instances where the overlap that the clipping function caught were of parcels that may have just been on the border of a reservation, and the resulting clipped acreage reflected a small sliver or line of overlap. 

Again, our story focus was on the issue of tribal jurisdiction, so we wanted to be sure that our dataset did not conflate an instance of zero or very little overlap, with an instance of large overlap. To cull these parcels, we followed a few steps: 

- First, we took out any parcels where the new clipped acreage was zero. 

- Second, we took out any instances of improper overlap. For example, several parcels in Wyoming overlapped with the Crow reservation in Montana, which aligns right up against the border of Wyoming. We took these parcels out, since the Crow reservation is located solely within Montana.

- Third, we looked closely at states that had a high frequency of checkered state trust land acreage close to reservation lands, like in Arizona, New Mexico, Minnesota, and Montana. We conducted a sensitivity analysis to see how the total acreage of state trust lands on reservations within these states would change based on how we adjusted the threshold for the size of a parcel to exclude. This threshold was focused on parcel slivers at the edges of reservation boundaries. The goal here was to identify a threshold that would work to get rid of those smaller parcels leftover from the clip analysis, so we could get as accurate a number as possible to show how many acres of state trust lands truly and meaningfully existed on reservation lands. 

As part of this process, we looked closely at the parcels along the borders of these states to assess what the average size of a clipped parcel sliver was. This also allowed us to note when some smaller parcels were fully within the borders of a reservation, which meant it was a parcel we wanted to keep, since it was not just a small reflection of overlap but rather, a small state trust land parcel fully on the reservation. For this reason, we kept the range of minimum thresholds here to be 5-15 acres – in these states, acreage higher than 15 was typically within reservation borders. 

| State      | Original                                    | Acreage change                 | Acreage > 5                                                                                                  | Acreage change               | Acreage > 7                                                                                                        | Acreage change               | Acreage > 10                                 | Acreage change                             | Acreage > 13                                                                                                                | Acreage change                             | Acreage > 15                                 |
| ---------- | ------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------- | -------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------------------- |
| Arizona    | # of parcels: 1160<br>Acreage: 41,858.38<br>Notes:  | _Parcel: -1015<br>Acres: -522.81_ | # of parcels: 145<br>Acreage: 41,335.57<br>Notes:                                                                    | _Parcel: -14<br>Acres: 83.56_   | # of parcels: 131<br>Acreage: 41,252.01<br>Notes:                                                                          | _Parcel: -7<br>Acres: 57.28_    | # of parcels: 124<br>Acreage: 41,194.73<br>Notes:    | _Parcel: -0<br>Acres: -0_       | # of parcels: 124<br>Acreage: 41,194.73<br>Notes: Two parcels that are \~15 acres are well within the borders, not just on the edge | _Parcel: -2<br>Acres: -29.02_   | # of parcels: 122<br>Acreage: 41,165.71<br>Notes:    |
| New Mexico | # of parcels: 7421<br>Acreage: 130,088.54<br>Notes: | _Parcel: -4100<br>Acres: -456.28_ | # of parcels: 3321<br>Acreage: 129,632.26<br>Notes: Some parcels under 5 acres were fully within reservation borders | _Parcel: -18<br>Acres: -114.52_ | # of parcels: 3303<br>Acreage: 129,517.7<br>4Notes: A group of parcels around 6 acres was fully within reservation borders | _Parcel: -4<br>Acres: -34.56_   | # of parcels: 3299<br>Acreage: 129,483.18<br>Notes:  | _Parcel: -23<br>Acres: -270.63_ | # of parcels: 3276<br>Acreage: 129,212.55<br>Notes:                                                                                 | _Parcel: -10<br>Acres: -146.01_ | # of parcels: 3266<br>Acreage: 129,066.54<br>Notes:  |
| Minnesota  | # of parcels: 9627<br>Acreage: 344,891.40<br>Notes: | _Parcel: -719<br>Acres: -352.06_  | # of parcels: 8908<br>Acreage: 344,539.34<br>Notes:                                                                  | _Parcel: -41<br>Acres: -251.33_ | # of parcels: 8867<br>Acreage: 344,288.01<br>Notes: There are some small parcels fully within reservation borders          | _Parcel: -40<br>Acres: -346.97_ | # of parcels: 8827<br>Acreage: 343,941.04<br>Notes:  | _Parcel: -62<br>Acres: -727.19_ | # of parcels: 8765<br>Acreage: 343,213.85<br>Notes:                                                                                 | _Parcel: -41<br>Acres: -567.57_ | # of parcels: 8724<br>Acreage: 342,646.28<br>Notes:  |
| Montana    | # of parcels: 701<br>Acreage:162,369.62<br>Notes:   | _Parcel: -192<br>Acres: -95.33_   | # of parcels: 509<br>Acreage: 162,274.29<br>Notes:                                                                   | _Parcel: -7<br>Acres: -41.22_   | # of parcels: 502<br>Acreage: 162,233.07<br>Notes:                                                                         | _Parcel: -8<br>Acres: -70.94_   | # of parcels: 494<br>Acreage: 162,162.13<br>Notes:   | _Parcel: -5<br>Acres: -55.05_   | # of parcels: 489<br>Acreage: 162,107.08<br>Notes:                                                                                  | _Parcel: -3<br>Acres: -42.71_   | # of parcels: 486<br>Acreage: 162,064.37<br>Notes:   |

**Based on the results from these tests, we recommended that parcels with acreage greater than 10 are what should be kept in the dataset.** 


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

 Data:

The resulting data from this process can be seen in the `04\_All States` folder. Each file is named in such a way that it reflects how the data changed in that step. 

- `05\_AcreageGreaterThan10`: This data layer only contains parcels that are larger than 10 acres.

- `06\_All-STLs-on-Reservations-Final`: This is the final data layer with all the table information checked and cleaned. 

**Create summary spreadsheets**

Finally, to present this data in a way that allows readers to make sense of the information on a reservation-by-reservation basis, we aggregated the information by reservation. To do this, we used the **aggregate** tool in QGIS, which allows us to combine the parcels by reservation. For this, we also wanted to delineate the total surface and subsurface acreage (in addition to the total acreage) and parcel count, so we split the file by rights-type to get those totals. We also wanted to capture information on the various trusts associated with each reservation, and so captured each unique instance of that trust name. Lastly, we added the total acreage of the reservation to the spreadsheet. 

 Data:

The resulting data from this process can be seen in the `05\_Final-Dataset` folder. 

- `01\_STLs-on-Reservations-by-Reservation`: This data layer contains all the parcels we are focused on, aggregated by reservation. 

- `02\_All-STLs-on-Reservations`: This is the final data layer with all the parcels. 
