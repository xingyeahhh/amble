from dotenv import load_dotenv
import os

load_dotenv()

MAPS_APIKEY = os.environ.get('MAPS_APIKEY')
OPENAI_APIKEY = os.environ.get('OPENAI_APIKEY')

import populartimes
import openai
import random
import textwrap
from users.populartimes_module import get_least_busy_locations

openai.api_key = OPENAI_APIKEY

### Option 1 & 2: Cafe Scenario, Restaurant Scenario
def get_quiet_indicator(place, time):
    try:
        weekday = time[0]
        hour = time[1]
        for pop_time in place['populartimes']:
            if pop_time['name'] == weekday:
                usual_populartimes = pop_time['data'][hour]
                break
        try:
            current_populartimes = place['current_popularity']
        except KeyError:
            current_populartimes = None
        if usual_populartimes <= 10:
            return ['very quiet', usual_populartimes, current_populartimes]
        elif 10 < usual_populartimes <= 30:
            return ['quiet', usual_populartimes, current_populartimes]
        elif 30 < usual_populartimes <= 60:
            return ['moderate', usual_populartimes, current_populartimes]
        else:
            return ['busy', usual_populartimes, current_populartimes]
    except (KeyError, IndexError) as e:
        print("error:", e)
        return ['unknown', None, None]
    
def populate_busy_message(suggestion, place_type, time):
    messages = []
    valid_options = []
    print("suggestion:", suggestion)
    for i in range(len(suggestion)):
        if suggestion[i] is not None:
            print("suggestion[i]:", suggestion[i] )
            valid_options.append(str(i+1))  # record valid option
            print("place_info:", suggestion[i][0])
            place_info = suggestion[i][0]
            print("ref_point_info:", suggestion[i][2])
            ref_point_info = suggestion[i][2]
            quietness = get_quiet_indicator(place_info, time)
            print("quietness:", quietness)
            if quietness[2] != None: 
                message = f"\n\t{place_type.capitalize()} {i+1}: {place_info['name']} is close to {ref_point_info['name']}, located at {place_info['address']}. At this time, it's usually {quietness[0]} (with a quietness rating of {quietness[1]}/100), and currently it's {quietness[2]}/100."
            else:
                message = f"\n\t{place_type.capitalize()} {i+1}: {place_info['name']} is close to {ref_point_info['name']}, located at {place_info['address']}. At this time, it's usually {quietness[0]} (with a quietness rating of {quietness[1]}/100)."
            messages.append(message)
        else:
            messages.append(f"\n\t{place_type.capitalize()} {i+1}: No more suggestions available.")
    if not valid_options:
        return f"\nNo {place_type} suggestions available at this time.", False, []
    print("messages:", messages)
    return "\n".join(messages), True, valid_options

### Option 3&4&5: Stop Information, POI Information, Mental Health Advice
def get_location_info(location_name, location_address):
    openai.api_key = OPENAI_APIKEY
    prompt = f"Generate a detailed description about {location_name},{location_address} Manhattan, focusing on its relation to mental health and self-improvement without restating its location."
    try:
        response = openai.Completion.create(
            engine="text-davinci-001",
            prompt=prompt,
            max_tokens=100
        )
        return f"\n {response.choices[0].text.strip()}"
    except Exception as e:
        #print(f"Error: {e}")
        return "\n I'm sorry, I couldn't find any extra information at this time. Try again later."
    
def get_poi_info(waypoints):
    openai.api_key = OPENAI_APIKEY
    descriptions = []
    max_descriptions = 1
    # Randomly sample up to max_descriptions waypoints
    waypoints_sample = random.sample(waypoints, min(max_descriptions, len(waypoints)))
    for waypoint in waypoints_sample:
        location_name = waypoint.get('name')
        location_address = waypoint.get('location')
        if not location_name and not location_address:
            continue  # Skip if both are missing
        # Define prompt with name and location, or just location if name is missing
        if location_name:
            prompt = f"Provide a brief, single sentence description (up to 100 characters including spaces) of a notable Point of Interest near {location_name}, Manhattan. This description should state its name and highlight the POI's relevance to mental health and self-improvement." # Do not restate the location's address.
        else:
            prompt = f"Provide a brief, single sentence description (up to 100 characters including spaces) of a notable Point of Interest near {location_address}, Manhattan. This description should state its name and highlight the POI's relevance to mental health and self-improvement."
        try:
            response = openai.Completion.create(
                engine="text-davinci-001",
                prompt=prompt,
                max_tokens=300 
            )
            description = f"{response.choices[0].text.strip()}"
            descriptions.append(textwrap.shorten(description, width=600, placeholder="..."))
        except Exception as e:
            #print(f"Error: {e}")
            descriptions.append(" \n I'm sorry, I couldn't find any points of interest along your way. Try again later.")
    # Join descriptions into a single message, ensuring it does not exceed 300 characters
    message = '\n '.join(descriptions)
    return message, waypoints_sample

def get_walking_advice():
    openai.api_key = OPENAI_APIKEY
    prompt = "Provide some advice on walking for mental health and self-improvement."
    try:
        response = openai.Completion.create(
            engine="text-davinci-001",
            prompt=prompt,
            max_tokens=300
        )
        return f"\n {response.choices[0].text.strip()}"
    except Exception as e:
        #print(f"Error: {e}")
        return "\n I'm sorry, I couldn't provide any advice at this time. Try again later."


#################################################################
def option_handler(user_choice, waypoints, time, ai_call=False, location_choice=None):
    if user_choice == "1":
        # Add a quiet cafe to the route
        print("option 1 time:", time)
        suggestion = get_least_busy_locations(MAPS_APIKEY, waypoints, 'cafe', time)
        message = " \n Great choice! Which cafe would you like to add to your route?"
        populated_message, location_found, available_choices = populate_busy_message(suggestion, "cafe", time)
        if location_found:
            message += populated_message
            print("message:", message)
            print("location_found:", location_found)
            print("available_choices:", available_choices)
            print("suggestion:", suggestion)
            return message, location_found, available_choices, suggestion
        else:
            sorry_message = " \n I'm sorry, I couldn't find any suitable locations at this time."
            message += sorry_message
            return message
        
    if user_choice == "2": 
        # Add a quiet restaurant to the route
        suggestion = get_least_busy_locations(MAPS_APIKEY, waypoints, 'restaurant', time)
        message = "\n Great choice! Which restaurant would you like to add to your route?"
        populated_message, location_found, available_choices = populate_busy_message(suggestion, "restaurant", time)
        if location_found:
            message += populated_message
            return message, location_found, available_choices, suggestion
        else:
            sorry_message = "\n I'm sorry, I couldn't find any suitable locations at this time."
            message += sorry_message
            return message

    if user_choice == "3":
        location = location_choice
        location_name = location["name"]
        location_address = location["address"]
        message = get_location_info(location_name, location_address)
        message += "\n I hope you enjoyed this piece of information! \n Enjoy your walk!"
        return message
        
    if user_choice == "4":
        # Get information about points of interest along the way
        message, waypoints_sample = get_poi_info(waypoints)
        if "\n I'm sorry, I couldn't find any points of interest along your way. Try again later." in message:
            # Error handling: no POIs found
            return message, False, []
        else:
            # Success: return message and waypoint
            return message, True, [waypoints_sample]
        
    if user_choice == "5":
        message = get_walking_advice()
        return message
