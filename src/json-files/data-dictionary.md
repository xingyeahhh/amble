# Data Dictionary

This is the data dictionary for the master-locations.json (now also available as separate files), the polygon files, and the citibike-stations for any further references.

## Master Locations

The master-locations.json file consists of the following location types:
| Locations     | No. | Description                                      |
|---------------|-----|--------------------------------------------------|
| 'community'   | 42  | community centres and similar social locations   |
| 'library'     | 29  | indoor libraries and some free bookshelf stops   |
| 'museum_art'  | 395 | museums, art galleries, and public artpieces     |
| 'park'        | 384 | central park coordinates, highest priority       |
| 'walking_node'| 1244| walking nodes for routing, lowest priority       |
| 'park_node'   | 319 | walking nodes but inside parks, lower than parks |
| 'worship'     | 122 | places of worship of any religious affiliation   |

ID prefixes = {
    'community': 'C', 
    'library': 'L', 
    'museum_art': 'MA', 
    'park': 'P', 
    'walking_node': 'WN', 
    'park_node': 'PN', 
    'worship': 'W'
}

For the next feature (cafe/restaurant with Google Popular Times), not included in current (15/07) master-locations:
| Locations     | No. | Description                                      |
|---------------|-----|--------------------------------------------------|
| 'cafe'        | 641 | cafe locations serving coffee                    |
| 'restaurant'  | 2685| restaurant locations with food                   |

### Data Structure

| Column Name           | Data Type  | Description                                                                            |
|-----------------------|------------|----------------------------------------------------------------------------------------|
| prefix + id           | integer    | Unique identifier for each location                                                    |
| name                  | string     | Name of the location                                                                   |
| type                  | string     | Category of the location (see above)                                                   |
| address               | string     | Physical address of the location; might be None None, None Manhattan if not available  |
| internet_access       | boolean    | Indicates whether the location has internet access, null if info not available         |
| wheelchair_accessible | boolean    | Indicates whether the location is wheelchair accessible, null if info not available    |
| opening_hours         | string     | Opening hours of the location (does not have uniform structure!)                       |
| grid-id               | integer    | Grid ID associated with the location                                                   |
| taxi-zone             | integer    | Taxi zone ID associated with the location                                              |
| precinct              | integer    | Police precinct ID associated with the location                                        |
| b-score               | float      | Busyness-Score of the location (calculated from grid's b-score and taxi-zone's b-score)|
| c-score               | float      | Crime-Score of the location (calculated from grid's c-score and precinct's c-score )   |
| coordinates           | float list | Geographic coordinates (longitude, latitude) of the location                           |
| rating                | float      | Rating influenced by users to influence routing & location suggestions, default: 1.5   |



## Polygon Files

The polygon files contain the polygons for the grid system, the precincts, and the taxi-zones in Manhattan. They do not perfectly cover the entirety of Manhattan, so the master_location.json file had to be made with some computation here and there.

| Polygon Type  | No. | Description                                                                                       |
|---------------|-----|---------------------------------------------------------------------------------------------------|
|  grid         | 1541| 200x200m grids dividing Manhattan into grid zones containing citibike stations and crime scores   |
|  precinct     | 36  | precincts in Manhattan                                                                            |
|  taxi-zone    | 63  | taxi zones in Manhattan                                                                           |

### grid_polygons.json

| Column Name       | Data Type             | Description                                                                         |
|-------------------|-----------------------|-------------------------------------------------------------------------------------|
| id                | integer               | Unique identifier for each grid zone                                                |
| type              | string                | Type/category of the entity (should always be "grid-zone")                          |
| citibike-stations | list                  | List of citibike stations in the grid zone, empty list if none                      |
| b-score           | float                 | B-Score of the grid zone (calculated from the citibike count and station b-scores)  |
| c-score           | float                 | C-Score of the grid zone (calculated from the latlng crime occurences, null if none)|
| coordinates       | list of list of float | Geographic coordinates (longitude, latitude) defining the polygon of the grid zone  |

### precincts_polygons.json

| Column Name | Data Type             | Description                                                                            |
|-------------|-----------------------|----------------------------------------------------------------------------------------|
| id          | integer               | Unique identifier for each precinct zone                                               |
| type        | string                | Type/category of the entity (should always be "precinct-zone")                         |
| c-score     | float                 | C-Score of the precinct zone (calculated from precinct crime count, is crime baseline) |
| coordinates | list of list of float | Geographic coordinates (longitude, latitude) defining the polygon of the precinct zone |

### taxi_polygons.json

| Column Name | Data Type             | Description                                                                        |
|-------------|-----------------------|------------------------------------------------------------------------------------|
| id          | integer               | Unique identifier for each taxi zone                                               |
| type        | string                | Type/category of the entity (should always be "taxi-zone")                         |
| name        | string                | Name of the taxi zone                                                              |
| b-score     | float                 | B-Score of the taxi zone (calculated from taxi dataset)                            |
| coordinates | list of list of float | Geographic coordinates (longitude, latitude) defining the polygon of the taxi zone |



## Citibike Stations

There are 646 citibike stations in Manhattan.

### citibike-stations.json

| Column Name | Data Type     | Description                                                               |
|-------------|---------------|---------------------------------------------------------------------------|
| id          | integer       | Unique identifier for each bike station                                   |
| name        | string        | Name of the bike station                                                  |
| address     | string        | Address of the bike station                                               |
| type        | string        | Type/category of the entity (should always be "bike-station")             |
| grid-id     | integer       | Identifier for the grid zone in which the bike station is located         |
| b-score     | float         | B-Score of the bike station (calculated with the citibike datasets)       |
| coordinates | list of float | Geographic coordinates (longitude, latitude) of the bike station          |