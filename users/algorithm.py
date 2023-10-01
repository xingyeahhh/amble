import json
import random
from math import radians, sin, cos, sqrt, atan2
import time

#Create File Path
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent

#Set up the base nodes (from Park Locations)
file_path_par = BASE_DIR /'src'/'json-files'/'park_locations.json'
with open(file_path_par) as json_file:
    basedata = json.load(json_file)

#Create a new dictionary and add the base nodes to it
data = {}
data.update(basedata)

#Add other park nodes
file_path_oth_park = BASE_DIR /'src'/'json-files'/'park_node_locations.json'
with open(file_path_oth_park) as file:
    other_park = json.load(file)
data ={'data':data['data'] + other_park['data']}

#Check what other nodes have been selected in preferences
other_nodes_dict = {}
file_path_pre = BASE_DIR /'src'/'json-files'/'preferences.json'
with open(file_path_pre) as json_file:
    prefdata = json.load(json_file)
t = True
for x in prefdata["data_from_frontend"]["selectedOptions"]:
    other_nodes_dict.update({x:t})

#Add the nodes from preferences
for k,v in other_nodes_dict.items():
    if v == True:
        f = k+'.json'
        file_path_oth = BASE_DIR /'src'/'json-files'/f
        with open(file_path_oth) as file:
            nodes = json.load(file)
        data ={'data':data['data'] + nodes['data']}
        
#Create a json object and Write to a json file
# merged_json = json.dumps(data, indent=4) 
# file_path_mer = BASE_DIR /'src'/'json-files'/'all_nodes_with_crime_in_bscore.json'
# with open(file_path_mer, 'w') as merged_file: 
#     merged_file.write(merged_json)

# Extract latitude and longitude values
latitudes = []
longitudes = []

for park_data in data["data"]:
    latitudes.append(park_data["location"]["latitude"])
    longitudes.append(park_data["location"]["longitude"])

# Function to calculate the distance between two coordinates using the haversine formula
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of the Earth in kilometers

    lat1_rad = radians(lat1)
    lon1_rad = radians(lon1)
    lat2_rad = radians(lat2)
    lon2_rad = radians(lon2)

    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad

    a = sin(dlat / 2) ** 2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c
    return distance

#Function to calculate angle between two coordinates
def calculate_angle(lat1, lon1, lat2, lon2):
    lat1_rad = radians(lat1)
    lon1_rad = radians(lon1)
    lat2_rad = radians(lat2)
    lon2_rad = radians(lon2)

    dlon = lon2_rad - lon1_rad

    x = cos(lat1_rad) * sin(lat2_rad) - sin(lat1_rad) * cos(lat2_rad) * cos(dlon)
    y = sin(dlon) * cos(lat2_rad)

    angle_rad = atan2(y, x)
    angle_deg = (angle_rad * 180 / 3.141592653589793 + 360) % 360

    return angle_deg
    
#def magic(user_latitude, user_longitude, hour):
def magic(user_latitude, user_longitude, hour, dist, endLatitude, endLongitude):
    print(f"Starting location: ({user_latitude}, {user_longitude})")
    print(f"End location: ({endLatitude}, {endLongitude})")
    print("-----------------------------------------")

    direction_bias = True

    startLatitude = user_latitude
    startLongitude = user_longitude
    
    dist_check = calculate_distance(startLatitude,startLongitude,endLatitude,endLongitude) < 1.5*dist

    predefined_distance = dist  # Adjust this value as needed
    visited_parks = []  # List to store visited parks
    print('`1.5 dist:',1.5*dist)
    print('Start-End distance:',calculate_distance(startLatitude,startLongitude,endLatitude,endLongitude))
    print('dist_check: ',dist_check)


    if calculate_distance(startLatitude,startLongitude,endLatitude,endLongitude) < 0.001:
        # if dist_check:
            while predefined_distance > dist/2 and len(visited_parks) < 23:
                print('predefined distance: ',predefined_distance)
                closest_parks = []  # List to store closest parks
                closest_distances = []  # List to store distances to closest parks

                # Calculate distances to all parks from the current location
                for park_data in data["data"]:
                    if park_data not in visited_parks:
                        park_latitude = park_data["location"]["latitude"]
                        park_longitude = park_data["location"]["longitude"]
                        distance = calculate_distance(
                            user_latitude, user_longitude, park_latitude, park_longitude
                        )
                        closest_distances.append(distance)
                        closest_parks.append(park_data)

                # Sort the parks based on distance and select the 7 closest parks
                sorted_indices = sorted(range(len(closest_distances)), key=lambda k: closest_distances[k])
                closest_parks = [closest_parks[i] for i in sorted_indices[:3]] 
                print('len closest parks: ',len(closest_parks))

                # Select the park with the lowest combination of "busi" values
                selected_park = min(closest_parks, key=lambda park: park["b-score"][hour])

                # Calculate distance to the selected park
                park_latitude = selected_park["location"]["latitude"]
                park_longitude = selected_park["location"]["longitude"]
                distance_to_park = calculate_distance(
                    user_latitude, user_longitude, park_latitude, park_longitude
                )

                # Reduce the predefined distance by the distance to the selected park
                predefined_distance -= distance_to_park

                # Add the selected park to the visited parks list
                visited_parks.append(selected_park)

                # Print information about the current journey
                park_name = selected_park["name"]
                park_busi = selected_park["b-score"][hour]

                # Update the user's location for the next iteration
                user_latitude = park_latitude
                user_longitude = park_longitude
                print('predefined distance: ',predefined_distance)

            angle = calculate_angle(user_latitude, user_longitude, endLatitude, endLongitude)
            print('angle: ',angle)
            closest_parks = []  # List to store closest parks
            closest_distances = []  # List to store distances to closest parks

                # Calculate distances to all parks from the current location
            for park_data in data["data"]:
                if park_data not in visited_parks:
                    park_latitude = park_data["location"]["latitude"]
                    park_longitude = park_data["location"]["longitude"]
                    distance = calculate_distance(
                        user_latitude, user_longitude, park_latitude, park_longitude
                    )
                    closest_distances.append(distance)
                    closest_parks.append(park_data)

                # Sort the parks based on distance and select the 7 closest parks
            sorted_indices = sorted(range(len(closest_distances)), key=lambda k: closest_distances[k])
            closest_parks = [closest_parks[i] for i in sorted_indices[:10]]# if len(closest_parks) >= 7 else closest_parks


            filtered_parks = []
            for park_data in closest_parks:
                park_latitude = park_data["location"]["latitude"]
                park_longitude = park_data["location"]["longitude"]

                 # Calculate the angle between the park and user coordinates
                park_angle = calculate_angle(user_latitude, user_longitude, park_latitude, park_longitude)

                # Check if the park's angle is either 30 degrees greater or 30 degrees less than the 'angle' variable
                if abs(park_angle - angle) >= 30:
                    filtered_parks.append(park_data)
                

            # Replace 'closest_parks' with the filtered parks
            closest_parks = filtered_parks
            print('len closest parks:',len(closest_parks))
            selected_park = min(closest_parks, key=lambda park: park["b-score"][hour])

            # Calculate distance to the selected park
            park_latitude = selected_park["location"]["latitude"]
            park_longitude = selected_park["location"]["longitude"]
            distance_to_park = calculate_distance(
                user_latitude, user_longitude, park_latitude, park_longitude
            )
            # Reduce the predefined distance by the distance to the selected park
            predefined_distance -= distance_to_park
            # Add the selected park to the visited parks list
            visited_parks.append(selected_park)

            # Bias direction for returning home
            if calculate_angle(user_latitude, user_longitude, park_latitude,park_longitude) > angle:
                direction_bias = True
            else:
                direction_bias = False

            # Print information about the current journey
            park_name = selected_park["name"]
            park_busi = selected_park["b-score"][hour]

            # Update the user's location for the next iteration
            user_latitude = park_latitude
            user_longitude = park_longitude


            while predefined_distance > dist/4 and len(visited_parks) < 23:
                closest_parks = []  # List to store closest parks
                closest_distances = []  # List to store distances to closest parks

                # Calculate distances to all parks from the current location
                for park_data in data["data"]:
                    if park_data not in visited_parks:
                        park_latitude = park_data["location"]["latitude"]
                        park_longitude = park_data["location"]["longitude"]
                        distance = calculate_distance(
                            user_latitude, user_longitude, park_latitude, park_longitude
                        )
                        closest_distances.append(distance)
                        closest_parks.append(park_data)

                # Sort the parks based on distance and select the 7 closest parks
                sorted_indices = sorted(range(len(closest_distances)), key=lambda k: closest_distances[k])
                closest_parks = [closest_parks[i] for i in sorted_indices[:10]]

                filtered_parks = []
                for park_data in closest_parks:
                    park_latitude = park_data["location"]["latitude"]
                    park_longitude = park_data["location"]["longitude"]

                    # Calculate the angle between the park and user coordinates
                    park_angle = calculate_angle(user_latitude, user_longitude, park_latitude, park_longitude)

                    # Check if the park's angle is either 30 degrees greater or 30 degrees less than the 'angle' variable
                    if direction_bias == True:
                        if park_angle - angle < 50:
                            filtered_parks.append(park_data)
                    elif direction_bias == False:
                        if park_angle - angle > 50:
                            filtered_parks.append(park_data)

                # Replace 'closest_parks' with the filtered parks
                closest_parks = filtered_parks
                selected_park = min(closest_parks, key=lambda park: park["b-score"][hour])
    
                # Calculate distance to the selected park
                park_latitude = selected_park["location"]["latitude"]
                park_longitude = selected_park["location"]["longitude"]
                distance_to_park = calculate_distance(
                 user_latitude, user_longitude, park_latitude, park_longitude
                )
                # Reduce the predefined distance by the distance to the selected park
                predefined_distance -= distance_to_park
                # Add the selected park to the visited parks list
                visited_parks.append(selected_park)

                # Add the selected park to the visited parks list
                visited_parks.append(selected_park)

                # Print information about the current journey
                park_name = selected_park["name"]
                park_busi = selected_park["b-score"][hour]

                # Update the user's location for the next iteration
                user_latitude = park_latitude
                user_longitude = park_longitude

            
            while predefined_distance > 0 and len(visited_parks) < 23:
                closest_parks = []  # List to store closest parks
                closest_distances = []  # List to store distances to closest parks

                # Calculate distances to all parks from the current location
                for park_data in data["data"]:
                    if park_data not in visited_parks:
                        park_latitude = park_data["location"]["latitude"]
                        park_longitude = park_data["location"]["longitude"]
                        distance = calculate_distance(
                            user_latitude, user_longitude, park_latitude, park_longitude
                        )
                        closest_distances.append(distance)
                        closest_parks.append(park_data)

                # Sort the parks based on distance and select the 7 closest parks
                sorted_indices = sorted(range(len(closest_distances)), key=lambda k: closest_distances[k])
                closest_parks = [closest_parks[i] for i in sorted_indices[:3]]

                # Select the park with the lowest combination of "busi" values
                selected_park = min(closest_parks, key=lambda park: park["b-score"][hour])
                # print(selected_park["busi"][hour])

                # Calculate distance to the selected park
                park_latitude = selected_park["location"]["latitude"]
                park_longitude = selected_park["location"]["longitude"]
                distance_to_park = calculate_distance(
                    user_latitude, user_longitude, park_latitude, park_longitude
                )

                # Reduce the predefined distance by the distance to the selected park
                predefined_distance -= distance_to_park

                # Add the selected park to the visited parks list
                visited_parks.append(selected_park)

                # Print information about the current journey
                park_name = selected_park["name"]
                park_busi = selected_park["b-score"][hour]
                # Update the user's location for the next iteration
                user_latitude = park_latitude
                user_longitude = park_longitude

            visited_locations = [(park['location']['latitude'], park['location']['longitude']) for park in visited_parks]
            return visited_locations

    else:
        # if dist_check:
            while predefined_distance > 0 and len(visited_parks) < 23:
                closest_parks = []  # List to store closest parks
                closest_distances = []  # List to store distances to closest parks

                # Calculate the angle between the current location and the endpoint
                angle_to_endpoint = calculate_angle(user_latitude, user_longitude, endLatitude, endLongitude)

                # Calculate distances to all parks from the current location
                for park_data in data["data"]:
                    if park_data not in visited_parks:
                        park_latitude = park_data["location"]["latitude"]
                        park_longitude = park_data["location"]["longitude"]
                        distance = calculate_distance(user_latitude, user_longitude, park_latitude, park_longitude)
                        
                        # Calculate the angle between the current location and the park's location
                        angle_to_park = calculate_angle(user_latitude, user_longitude, park_latitude, park_longitude)

                        # Check if the park's angle is within the allowed range (e.g., 90 degrees)
                        if abs(angle_to_park - angle_to_endpoint) <= 90 and predefined_distance > dist/30:
                            closest_distances.append(distance)
                            closest_parks.append(park_data)
                
                if len(closest_parks) == 0:
                    for park_data in data["data"]:
                        if park_data not in visited_parks:
                            park_latitude = park_data["location"]["latitude"]
                            park_longitude = park_data["location"]["longitude"]
                            distance = calculate_distance(user_latitude, user_longitude, park_latitude, park_longitude)
                            closest_distances.append(distance)
                            closest_parks.append(park_data)

                # Sort the parks based on distance and select the 7 closest parks
                sorted_indices = sorted(range(len(closest_distances)), key=lambda k: closest_distances[k])
                closest_parks = [closest_parks[i] for i in sorted_indices[:7]]

                # Select the park with the lowest combination of "busi" values
                selected_park = min(closest_parks, key=lambda park: park["b-score"][hour])

                # Calculate distance to the selected park
                park_latitude = selected_park["location"]["latitude"]
                park_longitude = selected_park["location"]["longitude"]
                distance_to_park = calculate_distance(user_latitude, user_longitude, park_latitude, park_longitude)

                # Reduce the predefined distance by the distance to the selected park
                predefined_distance -= distance_to_park

                # Add the selected park to the visited parks list
                visited_parks.append(selected_park)

                # Print information about the current journey
                park_name = selected_park["name"]
                park_busi = selected_park["b-score"][hour]
                # Update the user's location for the next iteration
                user_latitude = park_latitude
                user_longitude = park_longitude

            visited_locations = [(park['location']['latitude'], park['location']['longitude']) for park in visited_parks]
            return visited_locations