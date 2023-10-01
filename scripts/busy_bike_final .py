import pickle
import json
import os
import datetime
import numpy as np
import pandas as pd
import requests
import xgboost as xgb

from dotenv import load_dotenv #To allow secret key for Weather API
import time # To measue run time
from pandas.tseries.holiday import USFederalHolidayCalendar

import warnings # Stops warning from appearing
warnings.filterwarnings('ignore')

#Start run time for getting busyness scores
start_time = time.time()

#Create File Path
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent

file_path_pickle = BASE_DIR /'src'/'pickle_files'/'citibike.pkl'
file_path_taxi = BASE_DIR /'src'/'json-files'/'taxizones.json'
file_path_busy_input_csv = BASE_DIR /'src'/'json-files'/'busy_bike_input.csv'
file_path_busy_input_json = BASE_DIR /'src'/'json-files'/'busy_bike_input.json'
file_path_busy_json = BASE_DIR /'src'/'json-files'/'busy_bike_final.json'
file_path_busy_csv = BASE_DIR /'src'/'json-files'/'busy_bike_final.csv'
file_path_weather = BASE_DIR /'src'/'json-files'/'weather.json'

#Open the taxi zone data file 
with (open(file_path_taxi , "rb")) as f:
    taxi_data = json.load(f)
#Get rid of unwanted taxi zones
del taxi_data["103"]
del taxi_data["153"]
del taxi_data["194"]

#Create column heading for dataframe
columns_names = ['Hour', 'start_timestamp', 'Temperature', 'Precipitation', 'Humidity',
       'Day_Friday', 'Day_Monday', 'Day_Saturday', 'Day_Sunday',
       'Day_Thursday', 'Day_Tuesday', 'Day_Wednesday', 'Zone_100', 'Zone_107',
       'Zone_113', 'Zone_114', 'Zone_116', 'Zone_12', 'Zone_120', 'Zone_125',
       'Zone_127', 'Zone_13', 'Zone_137', 'Zone_140', 'Zone_141', 'Zone_142',
       'Zone_143', 'Zone_144', 'Zone_148', 'Zone_151', 'Zone_152', 'Zone_158',
       'Zone_161', 'Zone_162', 'Zone_163', 'Zone_164', 'Zone_166', 'Zone_170',
       'Zone_186', 'Zone_209', 'Zone_211', 'Zone_224', 'Zone_229', 'Zone_230',
       'Zone_231', 'Zone_232', 'Zone_233', 'Zone_234', 'Zone_236', 'Zone_237',
       'Zone_238', 'Zone_239', 'Zone_24', 'Zone_243', 'Zone_244', 'Zone_246',
       'Zone_249', 'Zone_261', 'Zone_262', 'Zone_263', 'Zone_4', 'Zone_41',
       'Zone_42', 'Zone_43', 'Zone_45', 'Zone_48', 'Zone_50', 'Zone_68',
       'Zone_74', 'Zone_75', 'Zone_79', 'Zone_87', 'Zone_88', 'Zone_90',
       'Holiday_False', 'Holiday_True', 'Month_1', 'Month_2', 'Month_3',
       'Month_4', 'Month_5', 'Month_6', 'Month_7', 'Month_8', 'Month_9',
       'Month_10', 'Month_11', 'Month_12', 'Snow_False', 'Snow_True']

#Create an empty dataframe and assign types to the columns
df = pd.DataFrame(columns=columns_names)
non_boolean_columns = []
for column in df.columns:
    try:
        df[column] = df[column].astype(bool)
    except ValueError:
        non_boolean_columns.append(column)

df['start_timestamp'] = df['start_timestamp'].astype(float)
df['Temperature'] = df['Temperature'].astype(float)
df['Precipitation'] = df['Precipitation'].astype(float)
df['Humidity'] = df['Humidity'].astype(float)

        # df[column] = df[column].astype(float)
#Function to calculate timestamp and day of the week and if a US Holiday from inputs - set to todays date in NYC
def create_ts(hour,list_hols): 
    import pytz #Allows you to get time in different time
    nyc_zone = pytz.timezone("America/New_York") 
    nyc_time = datetime.datetime.now(nyc_zone)
    year = nyc_time.year
    month = nyc_time.month
    day = nyc_time.day

    #Create Date and Time variables for use in the Pickle File
    xdate = datetime.datetime(year, month, day, hour) #Produces datetime object
    dow = xdate.weekday() #Produces Day of the Week
    timestamp = datetime.datetime.timestamp(xdate) #Produces Timestamp Object.

    #See is date matches a holiday in the USA
    is_holiday = False
    for hol in list_hols:
        if day == hol[0] and month == hol[1]:
            is_holiday = True

    return(month,timestamp,dow,is_holiday)

#Function to Update the month variables that comes from User Input
def getMonth(x,month): # Month_4 = 4 (April)
    if x == month:
        return True
    else:
        return False
    
#Function to Update the day variables that comes from User Input
def getDay(x,dow): # Day_Monday = 0 
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
json_data = json.dumps(weather_data, indent=4)
# print(json_data)

with open(file_path_weather, "w") as outfile:
    outfile.write(json_data)

#Create Weather Variables
temp = []
hum = []
percip = []

#Create values for snow.  Same value for each hour as Weather API only produces a daily item for snow
snow_true = False
snow_false = False

snow_predict = float(weather_data['forecast']['forecastday'][0]['day']['totalsnow_cm'])
if snow_predict != 0:
    snow_true = [True] * 24
    snow_false = [True] * 24
else:
    snow_true = [False] * 24
    snow_false = [False] * 24

#Create other Weather variables from Weather API
for i in range(24):
    temp.append(float(weather_data['forecast']['forecastday'][0]['hour'][i]['temp_f']))
    hum.append(float(weather_data['forecast']['forecastday'][0]['hour'][i]["humidity"]))
    percip.append(float(weather_data['forecast']['forecastday'][0]['hour'][i]["precip_in"]))

#Determine dates of US Holidays
cal = USFederalHolidayCalendar()
holidays = cal.holidays(start='2022-12-31', end='2023-12-31').to_pydatetime()

#Add the day and month of that holiday to a list
list_hols = []
for i in holidays:
    hol = (i.day,i.month)
    list_hols.append(hol)
# print(list_hols)

#Create dataframe for every taxi Zone and for every hour
for k,v in taxi_data.items(): #k is number of the taxi zone and v is the taxi zone name
    #Create Dictionaries to capture the data for different columns
    new_row1 = {} #Taxi zone data - whether the input is True or False
    new_row = {}  # All other data

    #Create values for the taxi zone columns (64 of them)
    for column in df.columns[1:]:
        if column[:5] == 'Zone_': # If column is a taxi zone column
            if column[5:] == k: #If column ending matches the taxi zone number
                new_row1.update({column:True}) #Make that entry True
            else:
                new_row1.update({column:False}) #Else make that entry False
    
    #For each hour (in a 24 hour period) add values to a new row
    for i in range(24): 
        new_row.update({'Hour':int(i)})

        #Create values for weather variables 
        new_row.update({'Temperature':temp[i]})
        new_row.update({'Humidity':hum[i]})
        new_row.update({'Snow_True':snow_true[i]})
        new_row.update({'Snow_False':snow_false[i]})
        new_row.update({'Precipitation':percip[i]})

        #create timestamp and other time-related data based on the hour value (i) and list of holidays
        timestamp = create_ts(i,list_hols) 
        new_row.update({'start_timestamp':timestamp[1]})  

        #Update Day_ of the Week.
        dow = timestamp[2]
        # print(f'DAY WEEK = {day_week}')
        new_row.update({'Day_Monday':getDay(0,dow)})
        new_row.update({'Day_Tuesday':getDay(1,dow)})
        new_row.update({'Day_Wednesday':getDay(2,dow)})
        new_row.update({'Day_Thursday':getDay(3,dow)})
        new_row.update({'Day_Friday':getDay(4,dow)})
        new_row.update({'Day_Saturday':getDay(5,dow)})
        new_row.update({'Day_Sunday':getDay(6,dow)})

        #Update dummy values for each month based on timestamp. 
        mon = timestamp[0]  
        for i in range(1,13):
            new_row.update({'Month_'+str(i):getMonth(i,mon)})

        #Add Update variables for Holiday_False and Holiday_True:
        holi = timestamp[3]
        if holi == False:
            new_row.update({'Holiday_False':True})
            new_row.update({'Holiday_True':False})
        else:
            new_row.update({'Holiday_False':False})
            new_row.update({'Holiday_True':True})

        #Merge the two dictionaries      
        new_dict = {**new_row, **new_row1} 
        df = pd.concat([df, pd.DataFrame([new_dict])], ignore_index=True) #Add the merged row to dataframe
    
        #Reset for the next hour
        new_row = {} 

#Send df of inputs to a csv file
df.to_csv(file_path_busy_input_csv, index=False)
df.to_json(file_path_busy_input_json, orient='records')
# print(df.dtypes)

#Open the Pickle File
pickle_file = "citibike1.pkl"
busy_model = pickle.load(open(file_path_pickle, 'rb'))

# Make the predictions
# busyness_predictions = busy_model.predict(xgb.DMatrix(df))
busyness_predictions = busy_model.predict(df) # Make the predictions

#Add predictions column to df
df['Busyness Predicted'] = busyness_predictions

# selected_columns = ['Hour', 'start_timestamp','Busyness Predicted','Holiday_False', 'Holiday_True','Month_7', 'Month_8', 'Day_Weekday', 'Day_Weekend''Day_Thursday', 'Day_Tuesday']
# print(df[selected_columns].tail(30))

#Drop Certain Columns
df.drop(['Temperature', 'Humidity', 'Snow_True', 'Snow_False','Precipitation',
        'Holiday_False', 'Holiday_True',
       'Month_1', 'Month_2', 'Month_3', 'Month_4', 'Month_5', 'Month_6',
       'Month_7', 'Month_8', 'Month_9', 'Month_10', 'Month_11', 'Month_12','Day_Friday', 
       'Day_Monday', 'Day_Saturday', 'Day_Sunday','Day_Thursday', 'Day_Tuesday', 'Day_Wednesday'
       ], axis=1, inplace = True)

#Create a list of all the taxi zones (in order)
names = []
for column in df.columns[1:]:
    if column[:5] == 'Zone_': # If column is a taxi zone column
        name = column[5:] #Name is Taxi Zone ID
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

#Get rid of unwanted taxi zone dummy variable columns
df.drop(['Zone_100', 'Zone_107',
       'Zone_113', 'Zone_114', 'Zone_116', 'Zone_12', 'Zone_120', 'Zone_125',
       'Zone_127', 'Zone_13', 'Zone_137', 'Zone_140', 'Zone_141', 'Zone_142',
       'Zone_143', 'Zone_144', 'Zone_148', 'Zone_151', 'Zone_152', 'Zone_158',
       'Zone_161', 'Zone_162', 'Zone_163', 'Zone_164', 'Zone_166', 'Zone_170',
       'Zone_186', 'Zone_209', 'Zone_211', 'Zone_224', 'Zone_229', 'Zone_230',
       'Zone_231', 'Zone_232', 'Zone_233', 'Zone_234', 'Zone_236', 'Zone_237',
       'Zone_238', 'Zone_239', 'Zone_24', 'Zone_87', 'Zone_88', 'Zone_90', 'Zone_243', 'Zone_244', 'Zone_246',
       'Zone_249', 'Zone_261', 'Zone_262', 'Zone_263', 'Zone_4', 'Zone_41',
       'Zone_42', 'Zone_43', 'Zone_45', 'Zone_48', 'Zone_50', 'Zone_68',
       'Zone_74', 'Zone_75', 'Zone_79'] ,axis=1, inplace = True)

# Should be left with column for hour, busyness score, timestamp and taxi zone id

#Send dataframe as a json and csv file
df.reset_index(drop=True, inplace=True) #This excludes the index
df.to_json(file_path_busy_json, orient='records')
df.to_csv(file_path_busy_csv, index=False)

####### End time - to get run time #########
end_time = time.time()
run_time = round((end_time - start_time),1)
print(f'\nRun time to produce busyness scores for 1 day for Bikes  = {run_time} seconds')

# Calculate Summary Parameters
mean_value = df['Busyness Predicted'].mean()
median_value = df['Busyness Predicted'].median()
range_value = df['Busyness Predicted'].max() - df['Busyness Predicted'].min()
std_value = df['Busyness Predicted'].std()

# Print the results
print("\nMean of Predicted Busyness - Bikes: ", mean_value)
print("Median of Predicted Busyness - Bikes: ", median_value)
print("Range of Predicted Busyness - Bikes: ", range_value)
print("Standard Deviation of Predicted Busyness - Bikes: ", std_value)
