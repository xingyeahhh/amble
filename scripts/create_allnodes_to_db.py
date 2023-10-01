import json

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
file_path_pre = BASE_DIR /'src'/'json-files'/'allnodes_preferences.json'
with open(file_path_pre) as json_file:
    prefdata = json.load(json_file)
t = True
for x in prefdata["data_from_frontend"]["selectedOptions"]:
    other_nodes_dict.update({x:t})
    # print(other_nodes_dict)

#Add the nodes
for k,v in other_nodes_dict.items():
    if v == True:
        f = k+'.json'
        file_path_oth = BASE_DIR /'src'/'json-files'/f
        with open(file_path_oth) as file:
            nodes = json.load(file)
        # print(nodes)
        # print(type(nodes))
        data ={'data':data['data'] + nodes['data']}
        
# #Create a json object and Write to a json file
merged_json = json.dumps(data, indent=4) 
file_path_mer = BASE_DIR /'src'/'json-files'/'all_nodes.json'
with open(file_path_mer, 'w') as merged_file: 
    merged_file.write(merged_json)

