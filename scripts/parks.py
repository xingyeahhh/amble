import requests
import random
import json
import datetime
import time

################# Getting Taxi Zone Location ##########################
from shapely.geometry import Point, Polygon

# Load taxi zone data from JSON file
with open("src/components/location.json") as json_file:
    alldata = json.load(json_file)

#Extract the Manhattan zones
taxi_zone_name = []
taxi_zone_number = []
taxi_zone_multipolygon = []

for zone in alldata["data"]:
    if zone[-1] == 'Manhattan':
        taxi_zone_name.append(zone[-3])
        taxi_zone_number.append(zone[-2])
        taxi_zone_multipolygon.append(zone[-5])

#Combine taxi zone name and number into a dictionary and write to a file
taxi_data = dict(zip(taxi_zone_number,taxi_zone_name))
with open('src/components/taxizones.json', 'w') as f:
    f.write(json.dumps(taxi_data))

# #Check Number of Taxi Zones
count = 0        
for i in range(len(taxi_zone_number)):     
    count += 1   
    f'Total Number of Taxi Zones = {count} \n'

#Function to clean polygon data and output Polygon object
def get_zone_poly(num):
    #Tidy up coordinates of Zone
    taxi_zone_multipolygon[num] = taxi_zone_multipolygon[num].strip('MULTIPOLYGON (((') #clean up first entry
    zone = taxi_zone_multipolygon[num].split(',')
    for i in range(len(zone)): # clean up other bits found
        zone[i] = zone[i].lstrip()
        zone[i] = zone[i].lstrip('((')
        zone[i] = zone[i].rstrip(')))')

    #Calculate the lat and long of different points in the Zone
    coord = []

    for d in range(0,len(zone)):
        pt = zone[d].split(' ')
        pt_lat = float(pt[0])
        pt_lon = float(pt[1])
        lat_lon = (pt_lat,pt_lon)
        coord.append(lat_lon)

    #Create Polygon object
    zone_poly = Polygon(coord)
    zone_details = [taxi_zone_number[num],taxi_zone_name[num],zone_poly]
    return(zone_details)

#Get all the Taxi Zone data - number, name, polygon - for all zones
all_zones = []
for i in range(count):
    all_zones.append(get_zone_poly(i))


# ####### Start time - to get run time #########
# start_time = time.time()

#################### Get Busyness Scores ##################################
# Load busyness data from JSON file
with open("src/components/busyness.json") as json_file:
    busy_data = json.load(json_file)

time_input = datetime.datetime.now()
hour = time_input.hour

#Function to get Busyness scores from json file
def getBusy(taxizone):
    all_hours = {}
    for d in busy_data:
        if d["Taxi Zone ID"] == taxizone:
            all_hours[d["Hour"]] = round(d["Busyness Predicted"],0)
    return(all_hours)

#################### Build Parks JSON File ###############################
# Define the Overpass API query
overpass_query = """
[out:json];
area[name="Manhattan"]->.searchArea;
(
way(area.searchArea)["leisure"="park"];
relation(area.searchArea)["leisure"="park"];
);
out center;
"""

# Send the HTTP GET request to the Overpass API
response = requests.get(
    "https://overpass-api.de/api/interpreter", params={"data": overpass_query}
)

# Check if the request was successful (HTTP status code 200)
if response.status_code == 200:
    # Parse the JSON response
    data = response.json()

    # Create a dictionary to hold the park data
    park_data = []

    # Extract park information from the response
    parks = data.get("elements", [])

    # Process the park data
    for park in parks:
        park_id = park["id"]
        park_name = park.get("tags", {}).get("name", "Unknown Park")
        latitude = park.get("center", {}).get("lat")
        longitude = park.get("center", {}).get("lon")

    # Get what Taxi Zone the Park is in
        point = Point(longitude, latitude)
        for i in range(count): 
            if(point.within(all_zones[i][-1])):
                taxizone = all_zones[i][0]

        # Add park data to the dictionary
        park_data.append({
            "id": park_id,
            "name": park_name,
            "location": {"latitude": latitude, "longitude": longitude},
            "taxizone": taxizone,
            "busi":   getBusy(taxizone),
        })

    min_lat = 40.6
    max_lat = 40.9
    min_lon = -74.1
    max_lon = -73.9
    parks_to_remove = [95163097, 
                    468946468, 
                    48686595, 
                    33819583, 
                    129002500, 
                    608663280, 
                    39015952, 
                    367859701, 
                    25428484, 
                    222233979, 
                    367660740,
                    56469108,
                    2389631,
                    9791559]

    filtered_data = []
    
    for park in park_data:
            id = park["id"]
            latitude = park["location"]["latitude"]
            longitude = park["location"]["longitude"]

            if (min_lat <= latitude <= max_lat) and (min_lon <= longitude <= max_lon) and (id not in parks_to_remove):
                filtered_data.append(park)
    
    # Convert the dictionary to a JSON object
    json_data = {"data": filtered_data}

    # Export the dictionary as a JSON file
    with open("src/components/parks.json", "w") as outfile:
        json.dump(json_data , outfile, indent=4)
        print("Exported park data to parks.json")

else:
    print("Error: Failed to fetch park data.")

# ####### End time - to get run time #########
# end_time = time.time()
# run_time = round((end_time - start_time),1)
# print(f'Run time to populate busyness scores for all 24 hours = {run_time} seconds')