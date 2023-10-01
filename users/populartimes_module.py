from dotenv import load_dotenv
import os

load_dotenv()

MAPS_APIKEY = os.environ.get('MAPS_APIKEY')

import populartimes

def define_search_area(waypoint, radius=100):
    """ 
    Defines the bounding box for the search area with bound_lower and bound_upper.
    Returns both variables in that order.
    """
    m_in_degrees = 0.000898  # approximately 100 meters in degrees
    lat = waypoint["location"]["latitude"]
    lng = waypoint["location"]["longitude"]
    
    # Calculate bounding box coordinates of 200x200m box
    bound_lower = (lat - (m_in_degrees * 1), lng - (m_in_degrees * 1))
    bound_upper = (lat + (m_in_degrees * 1), lng + (m_in_degrees * 1))

    return bound_lower, bound_upper

def get_least_busy_locations(api_key, waypoints, place_type, search_time):
    """ 
    Supply with these values: MAPS_APIKEY, waypoints list [{"name": "", "latitude": 40, "longitude": -73}, ...],
    place_type as "cafe" or "restaurant", search_time as list of "weekday", hour ["Monday", 15].

    Returns a list containing up to three suggested locations based on the lowest popularity (quietest).
    """
    
    radius = 20  # in meters
    suggestions = []
    found_count = 0

    for waypoint in waypoints:
        # define the bounding box for the search area (you need to write this function)
        bound_lower, bound_upper = define_search_area(waypoint, radius)

        # retrieve place data
        # places = populartimes.get(api_key, [place_type], bound_lower, bound_upper, radius=radius)
        places = None
        # filter for least busy times and add to suggestions
        if places != None:
            for place in places:
                # get the day of the week and hour for the search time from frontend input
                # day_of_week, hour = get_day_and_hour(search_time)
                if found_count >= 3:
                    break

                # check if populartimes data is available for the place
                if "populartimes" in place and place["populartimes"] is not None:
                    # get the popular times data for the day of the week

                    day_data = next((item for item in place["populartimes"] if item["name"] == search_time[0]), None)

                    if day_data is not None:
                        # get the popular times data for the hour
                        hour_popularity = day_data["data"][search_time[1]]

                        # add the place and its popularity to the suggestions
                        suggestions.append((place, hour_popularity, waypoint))
                        found_count += 1

    # sort the suggestions by popularity (ascending) and take the top 3
    suggestions = sorted(suggestions, key=lambda x: x[1])[:3]

    # if fewer than 3 suggestions, add None for the remaining ones
    while len(suggestions) < 3:
        suggestions.append(None)

    print("suggestions:", suggestions)
    return suggestions