import pickle
import json
import os
import datetime
import numpy as np
import pandas as pd
import requests
from dotenv import load_dotenv #To allow secret key for Weather API
import os
import time # To measue run time

import warnings # Stops warning from appearing
warnings.filterwarnings('ignore')

#Start run time for getting busyness scores
start_time = time.time()

#Create File Paths
pickle_dir = r"src\pickle_files" # pickle files directory
taxipath = r"src\json-files" #taxi zone data (name and number)
busyscore = r"src\json-files" #Busyness Score data

#Open the taxi zone data file 
with (open(os.path.join(taxipath, 'taxizones.json'), "rb")) as f:
    taxi_data = json.load(f)
#Get rid of unwanted taxi zones
del taxi_data["103"]
del taxi_data["153"]
del taxi_data["194"]

#Create column heading for dataframe
columns_names = ['Hour', 'Temperature', 'Humidity', 'Wind Speed', 'Precipitation',
    'TImestamp', 'PULocationID_100', 'PULocationID_107', 'PULocationID_113',
    'PULocationID_114', 'PULocationID_116', 'PULocationID_12',
    'PULocationID_120', 'PULocationID_125', 'PULocationID_127',
    'PULocationID_128', 'PULocationID_13', 'PULocationID_137',
    'PULocationID_140', 'PULocationID_141', 'PULocationID_142',
    'PULocationID_143', 'PULocationID_144', 'PULocationID_148',
    'PULocationID_151', 'PULocationID_152', 'PULocationID_158',
    'PULocationID_161', 'PULocationID_162', 'PULocationID_163',
    'PULocationID_164', 'PULocationID_166', 'PULocationID_170',
    'PULocationID_186', 'PULocationID_202', 'PULocationID_209',
    'PULocationID_211', 'PULocationID_224', 'PULocationID_229',
    'PULocationID_230', 'PULocationID_231', 'PULocationID_232',
    'PULocationID_233', 'PULocationID_234', 'PULocationID_236',
    'PULocationID_237', 'PULocationID_238', 'PULocationID_239',
    'PULocationID_24', 'PULocationID_243', 'PULocationID_244',
    'PULocationID_246', 'PULocationID_249', 'PULocationID_261',
    'PULocationID_262', 'PULocationID_263', 'PULocationID_4',
    'PULocationID_41', 'PULocationID_42', 'PULocationID_43',
    'PULocationID_45', 'PULocationID_48', 'PULocationID_50',
    'PULocationID_68', 'PULocationID_74', 'PULocationID_75',
    'PULocationID_79', 'PULocationID_87', 'PULocationID_88',
    'PULocationID_90', 'Day_Friday', 'Day_Monday', 'Day_Saturday',
    'Day_Sunday', 'Day_Thursday', 'Day_Tuesday', 'Day_Wednesday']

#Create an empty dataframe
df = pd.DataFrame(columns=columns_names)

#Function to calculate timestamp and day of the week from inputs - set to todays date in NYC
def create_ts(hour): 
    import pytz #Allows you to get time in different time
    nyc_zone = pytz.timezone("America/New_York") 
    nyc_time = datetime.datetime.now(nyc_zone)
    year = nyc_time.year
    month = nyc_time.month
    day = nyc_time.day

    #Create Date and Time variables for use in the Pickle File
    xdate = datetime.datetime(year, month, day, hour) #Produces datetime object
    dow = xdate.weekday() #Produces Day of the Week
    timestamp = datetime.datetime.timestamp(xdate) #Produces Timestamp Object.  Will be updated with hour data later
    return(dow,timestamp)

#Function to Update the day variables that comes from User Input
def getDay(x,dow): # In this case, day of the week (dow) = 4 (Friday)
    if x == dow:
        return True
    else:
        return False

#Get weather data
load_dotenv()

api_key = os.environ.get("WEATHER_API_KEY") #Key for Weather API
url = f'http://api.weatherapi.com/v1/forecast.json?key={api_key}&q=New York City&days=1&aqi=no&alerts=no'
response = requests.get(url)
weather_data = response.json()

#Create Weather Variables
temp = []
hum = []
wind = []
percip = []

#Weather variables from Weather API
for i in range(24):
    temp.append(float(weather_data['forecast']['forecastday'][0]['hour'][i]['temp_f']))
    hum.append(float(weather_data['forecast']['forecastday'][0]['hour'][i]["humidity"]))
    wind.append(float(weather_data['forecast']['forecastday'][0]['hour'][i]['wind_mph']))
    percip.append(float(weather_data['forecast']['forecastday'][0]['hour'][i]["precip_in"]))

#Create dataframe for every taxi Zone and for every hour
for k,v in taxi_data.items(): #k is number of the taxi zone and v is the taxi zone name
    #Create Dictionaries to capture the data for different columns
    new_row1 = {} #Taxi zone data - whether the input is True or False
    new_row = {}  # All other data

    #Create values for the taxi zone columns (64 of them)
    for column in df.columns[1:]:
        if column[:13] == 'PULocationID_': # If column is a taxi zone column
            if column[13:] == k: #If column ending matches the taxi zone number
                new_row1.update({column:True}) #Make that entry True
            else:
                new_row1.update({column:False}) #Else make that entry False
    
    #Create values for all other variables 
    for i in range(24): #For each hour (in a 24 hour period) add values to a new row
        new_row.update({'Hour':i})
        new_row.update({'Temperature':temp[i]})
        new_row.update({'Humidity':hum[i]})
        new_row.update({'Wind Speed':wind[i]})
        new_row.update({'Precipitation':percip[i]})

        result = create_ts(i) #create timestamp based on the hour value (i)
        new_row.update({'TImestamp':result[1]})

        dow = result[0] #update day of week based on timestamp.  Then update values in day columns
        new_row.update({'Day_Monday':getDay(0,dow)})
        new_row.update({'Day_Tuesday':getDay(1,dow)})
        new_row.update({'Day_Wednesday':getDay(2,dow)})
        new_row.update({'Day_Thursday':getDay(3,dow)})
        new_row.update({'Day_Friday':getDay(4,dow)})
        new_row.update({'Day_Saturday':getDay(5,dow)})
        new_row.update({'Day_Sunday':getDay(6,dow)})

        new_dict = {**new_row, **new_row1} #Merge the two dictionaries
        df = pd.concat([df, pd.DataFrame([new_dict])], ignore_index=True) #Add the merged row to dataframe
        new_row = {} #Reset for the next hour

#Open the Pickle File
pickle_file = "2017_model.pkl"
busy_model = pickle.load(open(os.path.join(pickle_dir, pickle_file), 'rb'))

#Make the predictions
busyness_predictions = busy_model.predict(df) # Make the predictions

#Add predictions column to df
df['Busyness Predicted'] = busyness_predictions

#Drop Certain Columns
df.drop(['Temperature', 'Humidity', 'Wind Speed', 'Precipitation',
        'Day_Friday', 'Day_Monday', 'Day_Saturday',
    'Day_Sunday', 'Day_Thursday', 'Day_Tuesday', 'Day_Wednesday'], axis=1, inplace = True)

#Create a list of all the taxi zones (in order)
names = []
for column in df.columns[1:]:
    if column[:13] == 'PULocationID_': # If column is a taxi zone column
        name = column[13:] #Name is Taxi Zone ID
        names.append(name)

#Create a list with 24 values for each taxi zone id (1 for each hour)
tzones = []
for name in names:
    for i in range(24):
        tzones.append(name)

#Create a new dataframe with this list of taxi ids for every hour
df_taxi = pd.DataFrame(tzones,columns=["Taxi Zone ID"])

#Merge taxi id's with rest of dataframe
df = pd.concat([df, df_taxi], axis=1, join='inner')

#Get rid of unwanted columns - essentially taxi zone dummy variable columns
df.drop(['PULocationID_100', 'PULocationID_107',
    'PULocationID_113', 'PULocationID_114', 'PULocationID_116',
    'PULocationID_12', 'PULocationID_120', 'PULocationID_125',
    'PULocationID_127', 'PULocationID_128', 'PULocationID_13',
    'PULocationID_137', 'PULocationID_140', 'PULocationID_141',
    'PULocationID_142', 'PULocationID_143', 'PULocationID_144',
    'PULocationID_148', 'PULocationID_151', 'PULocationID_152',
    'PULocationID_158', 'PULocationID_161', 'PULocationID_162',
    'PULocationID_163', 'PULocationID_164', 'PULocationID_166',
    'PULocationID_170', 'PULocationID_186', 'PULocationID_202',
    'PULocationID_209', 'PULocationID_211', 'PULocationID_224',
    'PULocationID_229', 'PULocationID_230', 'PULocationID_231',
    'PULocationID_232', 'PULocationID_233', 'PULocationID_234',
    'PULocationID_236', 'PULocationID_237', 'PULocationID_238',
    'PULocationID_239', 'PULocationID_24', 'PULocationID_243',
    'PULocationID_244', 'PULocationID_246', 'PULocationID_249',
    'PULocationID_261', 'PULocationID_262', 'PULocationID_263',
    'PULocationID_4', 'PULocationID_41', 'PULocationID_42',
    'PULocationID_43', 'PULocationID_45', 'PULocationID_48',
    'PULocationID_50', 'PULocationID_68', 'PULocationID_74',
    'PULocationID_75', 'PULocationID_79', 'PULocationID_87',
    'PULocationID_88', 'PULocationID_90'] ,axis=1, inplace = True)

#Should be left with column for hour, busyness score, timestamp and taxi zone id
# print(df.head(30))
# print(f'Day of the Week and Timestamp = {create_ts(0)}')

#Send dataframe as a json file
df.reset_index(drop=True, inplace=True) #This excludes the index
df.to_json(r"src\json-files\busyness.json", orient='records')

with open("src/components/weather.json", "w") as outfile:
        json.dump(weather_data , outfile, indent=4)
        print("Exported weather data to weather.json")
####### End time - to get run time #########
end_time = time.time()
run_time = round((end_time - start_time),1)
print(f'Run time to produce busyness scores for 1 day = {run_time} seconds')

# Print some output
# print(df.head(30))
# print(f'Day of the Week and Timestamp = {create_ts(0)}')