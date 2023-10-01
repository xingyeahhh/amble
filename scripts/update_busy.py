import json
from os import path
import os
import time
import datetime
import statistics

####### Start time - to get run time #########
# start_time = time.time()

#Function to open Json file
def openJson(dir,file):
    if path.isfile(os.path.join(dir, file)) is False:
        raise Exception(f"{file} File not found")
    with open(os.path.join(dir, file)) as f:
        return(json.load(f))

#Function to create some time elements
def create_ts(): 
    import pytz #Allows you to get time in different time
    nyc_zone = pytz.timezone("America/New_York") 
    nyc_time = datetime.datetime.now(nyc_zone)
    year = nyc_time.year
    month = nyc_time.month
    day = nyc_time.day
    hour= nyc_time.hour
    xdate = datetime.datetime(year, month, day, hour) #Produces datetime object
    dow = xdate.weekday() #Produces Day of the Week
    timestamp = datetime.datetime.timestamp(xdate) #Produces Timestamp Object.
    return(timestamp)

#Function to Update Nodes Busyness Scores
def update_nodes(nodes,new_busyObj,include_crime):
   
    #Function for get b-scores
    def getBusy(taxizone,new_busyObj):
        all_hours = {}
        for d in new_busyObj:
            if d["Taxi Zone ID"] == taxizone:
                all_hours[d["Hour"]] = round(d["Busyness Predicted"],4)
        return(all_hours)
    
     #Function to get b-scores including c-scores
    def getBusyCrime(taxizone,new_busyObj,crimescore):
        crime_weight = 0.20 #% of busyness score based on crime levels
        all_hours = {}
        for d in new_busyObj:
            if d["Taxi Zone ID"] == taxizone:
                all_hours[d["Hour"]] = round(d["Busyness Predicted"],4)*(1-crime_weight) + round(crimescore,4)*crime_weight
        return(all_hours)

    #Get the node file
    if path.isfile(os.path.join(json_dir, nodes)) is False:
        raise Exception(f"{nodes} File not found")
    with open(os.path.join(json_dir, nodes)) as f:
        Obj = json.load(f)

    #Update the b-score and timestamp
    for n in Obj["data"]:
        taxizone = str(n["taxi-zone"])
        crimescore = n["c-score"]   #Get Crime Score 
        n["last_updated"] = create_ts()

        if n['name'] == "Li\u00c3\u00a8ge Park" or n['name'] == 'LiÃ¨ge Park':
            n['name'] = "Liege Park"

        if include_crime == False:
            n["b-score"] = (getBusy(taxizone,new_busyObj))
        else:
            n["b-score"] = (getBusyCrime(taxizone,new_busyObj,crimescore))

    #Write the updated json file with new busyness scores
    with open(os.path.join(json_dir, nodes), 'w') as f:
        json.dump(Obj, f, indent =4)

######################### Main Script  ###############################################
#Get path to json directory
json_dir = r"src\json-files" 

#json busyness files
busy_taxi = 'busy_taxi_final.json'
busy_bike = 'busy_bike_final.json'

#Names for json location files
park = 'park_locations.json'
library = 'library_locations.json'
parknode = 'park_node_locations.json'
community = 'community_locations.json'
museum = 'museum_art_locations.json'
worship = 'worship_locations.json'
walking_node = 'walking_node_locations.json'
all_nodes = 'all_nodes.json'
all_nodes_no_crime_in_bscore = 'all_nodes_no_crime_in_bscore.json'
all_nodes_with_crime_in_bscore = 'all_nodes_with_crime_in_bscore.json'

# with open(os.path.join(json_dir, all_nodes_no_crime_in_bscore)) as f:
#     full_nodes_no_crime = json.load(f)

# with open(os.path.join(json_dir, all_nodes_with_crime_in_bscore), 'w') as f:
#     json.dump(full_nodes_no_crime,f, indent =4)


########### For checking - Get specific Values ############################################
zone = 4
time = '0'
print(f'\nFor Zone {zone} at time {time}\n-----------------------')

#Open taxi busyness json file and get initial value
busyObj_taxi = openJson(json_dir,busy_taxi)
for Obj in busyObj_taxi:
    if Obj['Taxi Zone ID'] == str(zone) and  Obj['Hour'] == int(time):
        taxibusy = Obj['Busyness Predicted']
        print(f'Taxi Busyness before weighting and copy = {zone} {time} {taxibusy}')

#Open bike busyness json file and get initial value
busyObj_bike = openJson(json_dir,busy_bike)
for Obj in busyObj_bike:
    if Obj['Taxi Zone ID'] == str(zone) and  Obj['Hour'] == int(time):
        bikebusy = Obj['Busyness Predicted']
        print(f'Bike Busyness before weighting = {zone} {time} {bikebusy}')

#Weightings for Busyness
taxi_weight = 0.64 #Based on MAE
bike_weight = 0.36 #Based on MAE

#Change bike timestamp heading to taxi timestamp heading
for Obj in busyObj_bike:
    if 'start_timestamp' in Obj:
        Obj['Timestamp'] = Obj.pop('start_timestamp')

#Create dummy rows for missing bike data
for i in range(24):
    bike_202 = {'Timestamp':create_ts(),'Busyness Predicted': -0.2, 'Taxi Zone ID': '202','Hour':i}
    bike_128 = {'Timestamp':create_ts(),'Busyness Predicted': -0.2, 'Taxi Zone ID': '128','Hour':i}
    busyObj_bike.append(bike_202)
    busyObj_bike.append(bike_128)

#Build inputs for new combined bike and taxi data
new_busyObj = busyObj_taxi.copy()

for i in range(len(new_busyObj)):
    taxiID = new_busyObj[i]['Taxi Zone ID']
    hour = new_busyObj[i]['Hour']
    taxibusyness = round(busyObj_taxi[i]['Busyness Predicted'],5)

    for j in range(len(busyObj_bike)):
        if taxiID == busyObj_bike[j]['Taxi Zone ID'] and hour == busyObj_bike[j]['Hour']:
            bikebusyness = round(busyObj_bike[j]['Busyness Predicted'],5)

    new_busyObj[i]['Busyness Predicted'] = round((taxibusyness * taxi_weight) + (bikebusyness * bike_weight),3)

########## Decide if to include Crime ############################
include_crime = False 

# Update the Nodes with combined scores
update_nodes(park,new_busyObj,include_crime)
update_nodes(library,new_busyObj,include_crime)
update_nodes(parknode,new_busyObj,include_crime)
update_nodes(community,new_busyObj,include_crime)
update_nodes(museum,new_busyObj,include_crime)
update_nodes(worship,new_busyObj,include_crime)
update_nodes(walking_node,new_busyObj,include_crime)
update_nodes(all_nodes_with_crime_in_bscore,new_busyObj,include_crime)
update_nodes(all_nodes_no_crime_in_bscore,new_busyObj,False)

# ####### End time - to get run time #########
# end_time = time.time()
# run_time = round((end_time - start_time),1)
# print(f'Run time to populate busyness scores for all 24 hours = {run_time} seconds')

# ################## Crime Check ########################################
# busyObj_nocrime = openJson(json_dir,all_nodes_no_crime_in_bscore)
# list_nocrime = busyObj_nocrime['data']

# for Obj in list_nocrime:
#     for i in Obj['b-score']:
#         # print(Obj['taxi-zone'],i )
#         if Obj['taxi-zone'] == zone and i == time:
#             busynocrime = Obj['b-score'][i]
# print(f'Busyness NO crime = {busynocrime}')

# busyObj_withcrime = openJson(json_dir,all_nodes_with_crime_in_bscore)
# list_withcrime = busyObj_withcrime['data']

# for Obj in list_withcrime:
#     for i in Obj['b-score']:
#         # print(Obj['taxi-zone'],i )
#         if Obj['taxi-zone'] == zone and i == time:
#             busy = Obj['b-score'][i]
#             check_crime_score = Obj['c-score']

# print(f'Busyness WITH crime = {busy}, for c-score = {check_crime_score}')

# ################# Zone Check ###########################
# museum_zone = 162
# check_museum = openJson(json_dir,all_nodes_with_crime_in_bscore)
# # check_museum = openJson(json_dir,museum)
# list_museum = check_museum['data']
# for Obj in list_museum:
#     if Obj['taxi-zone'] == museum_zone:
#         print(Obj['taxi-zone'],Obj['type'],Obj['name']  )
#     # print(Obj['type'])
#     # if Obj['type'] == 'worship':
#     if Obj['taxi-zone'] == museum_zone and Obj['type'] == 'museum_art':
#         print(Obj)





# #After combining Checks
# print(f'\nFor Zone {zone} at time {time}\n-----------------------')
# for Obj in new_busyObj:
#     if Obj['Taxi Zone ID'] == zone and  Obj['Hour'] == time:
#         busy = Obj['Busyness Predicted']
#         # print(f'Combined Busyness after weighting = {busy}')
#         if include_crime == True:
#             print(f'Including Crime in Busyness = {busy}')
#         else:
#             print(f'Only Taxi/Bike Busyness = {busy}')

# for Obj in new_busyObj:
#     if Obj['Taxi Zone ID'] == zone and  Obj['Hour'] == time:
#         busy = Obj['Busyness Predicted']

# if include_crime == True:
#     for i in range(len(new_busyObj)):
#         taxiID = int(new_busyObj[i]['Taxi Zone ID'])
#         hour = str(new_busyObj[i]['Hour'])
#         # print(type(taxiID),type(hour))
#         # print(taxiID,hour)
#         for j in range(len(busyObj_crime['data'])):
#             x = busyObj_crime['data'][j]['taxi-zone']
#             print(x)
#             print(type(x))
        #     for k in range(24):
        #         kstr = str(k)
        #         y = busyObj_crime['data'][j]['b-score'][kstr]
        #         print(x,taxiID)
        #         print(y,hour)
        #         if x  ==  taxiID and y == hour:
        #             print('Hurray')
        #             new_busyObj[i]['Busyness Predicted'] = ((new_busyObj[i]['Busyness Predicted'] * (1-crime_weight)) + (busyObj_crime['data'][j]['Busyness Predicted'] * crime_weight))
   
    # for Obj in new_busyObj:
    #     id = int(Obj['Taxi Zone ID'])
    #     for k,v in crime_score.items():
    #         if id == k:
                # Obj['Busyness Predicted'] = Obj['Busyness Predicted'] * (1-crime_weight) + v * crime_weight

# #Open all nodes json file to get crime score
# no_crime = 'all_nodes_no_crime_in_bscore.json'
# busyObj_crime = openJson(json_dir,no_crime)

# if include_crime == True:
#     for i in range(len(busyObj_crime['data'])):
#          for j in range(24):
#             strj = str(j)
#             x = busyObj_crime['data'][i]['b-score'][strj]
#             y = busyObj_crime['data'][i]['c-score']
#             busyObj_crime['data'][i]['b-score'][strj] = (x * (1-crime_weight)) + (y * crime_weight)

# #Write the updated json file with new busyness scores
# with_crime = 'all_nodes_with_crime_in_bscore.json'
# with open(os.path.join(json_dir, with_crime), 'w') as f:
#     json.dump(busyObj_crime, f, indent =4)
#     # print(busyObj_crime['data'][i])

# print(busyObj_crime['data'][0]['b-score'][str('0')])
# print(len(busyObj_crime))
# print(len(busyObj_crime['data']))

# for Obj in busyObj_bike:
#     if Obj['Taxi Zone ID'] == zone and  Obj['Hour'] == time:
#         busy = Obj['Busyness Predicted']
#         print(f'Bike Busyness before weighting = {busy}')

#Function to get c-scores
# def getCrime(busyObj_crime):
#     crime_score = {}
#     crime_score[202] = 0.5 # Create dummy value (based on median value) for this missing zone
#     for d in busyObj_crime['data']:
#         crime_score[d["taxi-zone"]] = round(d["c-score"],4)
#     sorted_crime = dict(sorted(crime_score.items()))
#     print(sorted_crime)
    
#     # mean_crime = statistics.mean(list_crime_scores)
#     # median_crime = statistics.median(list_crime_scores)
#     # range_crime = max(list_crime_scores)-min(list_crime_scores)
#     # std_crime = statistics.stdev(list_crime_scores)
#     return(crime_score)   