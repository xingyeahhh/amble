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

file_path_pickle = BASE_DIR /'src'/'pickle_files'/'XGB_Taxi.pkl'
file_path_taxi = BASE_DIR /'src'/'json-files'/'taxizones.json'
file_path_busy_json = BASE_DIR /'src'/'json-files'/'busy_taxi_final.json'
file_path_busy_csv = BASE_DIR /'src'/'json-files'/'busy_taxi_final.csv'
file_path_weather = BASE_DIR /'src'/'json-files'/'weather.json'

# #Create File Paths
# pickle_dir = r"src\pickle_files" # pickle files directory
# taxipath = r"src\json-files" #taxi zone data (name and number)
# busyscore = r"src\json-files" #Busyness Score data
# weatherdata = r"src\json-files" #Weather data

#Open the taxi zone data file 
with (open(file_path_taxi , "rb")) as f:
    taxi_data = json.load(f)
#Get rid of unwanted taxi zones
del taxi_data["103"]
del taxi_data["153"]
del taxi_data["194"]

#Create column heading for dataframe
columns_names = ['Hour', 'Timestamp', 'Humidity', 'Temperature', 'Precipitation',
       'Day_Weekday', 'Day_Weekend', 'PULocationID_4', 'PULocationID_12',
       'PULocationID_13', 'PULocationID_24', 'PULocationID_41',
       'PULocationID_42', 'PULocationID_43', 'PULocationID_45',
       'PULocationID_48', 'PULocationID_50', 'PULocationID_68',
       'PULocationID_74', 'PULocationID_75', 'PULocationID_79',
       'PULocationID_87', 'PULocationID_88', 'PULocationID_90',
       'PULocationID_100', 'PULocationID_107', 'PULocationID_113',
       'PULocationID_114', 'PULocationID_116', 'PULocationID_120',
       'PULocationID_125', 'PULocationID_127', 'PULocationID_128',
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
       'PULocationID_239', 'PULocationID_243', 'PULocationID_244',
       'PULocationID_246', 'PULocationID_249', 'PULocationID_261',
       'PULocationID_262', 'PULocationID_263', 'Holiday_False', 'Holiday_True',
       'Month_1', 'Month_2', 'Month_3', 'Month_4', 'Month_5', 'Month_6',
       'Month_7', 'Month_8', 'Month_9', 'Month_10', 'Month_11', 'Month_12', 'Snow_False', 'Snow_True']

#Create an empty dataframe
df = pd.DataFrame(columns=columns_names)

non_boolean_columns = []
for column in df.columns:
    try:
        df[column] = df[column].astype(bool)
    except ValueError:
        non_boolean_columns.append(column)


df['Hour'] = df['Hour'].astype(int)
df['Timestamp'] = df['Timestamp'].astype(float)
df['Temperature'] = df['Temperature'].astype(float)
df['Precipitation'] = df['Precipitation'].astype(float)
df['Humidity'] = df['Humidity'].astype(float)

#Function to calculate timestamp and day of the week and if a US Holiday from inputs - set to todays date in NYC
def create_ts(hour,list_hols): 
    import pytz #Allows you to get time in different time
    nyc_zone = pytz.timezone("America/New_York") 
    nyc_time = datetime.datetime.now(nyc_zone)
    year = nyc_time.year
    month = nyc_time.month
    # print(f'month = {month}')
    day = nyc_time.day

    #Create Date and Time variables for use in the Pickle File
    xdate = datetime.datetime(year, month, day, hour) #Produces datetime object
    dow = xdate.weekday() #Produces Day of the Week
    # print(f'Day of the week = {dow}')
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

#Get weather data
load_dotenv()
api_key = os.environ.get("WEATHER_API_KEY") #Key for Weather API
url = f'http://api.weatherapi.com/v1/forecast.json?key={api_key}&q=New York City&days=1&aqi=no&alerts=no'
response = requests.get(url)
weather_data = response.json()
json_data = json.dumps(weather_data, indent=4) 

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
        if column[:13] == 'PULocationID_': # If column is a taxi zone column
            if column[13:] == k: #If column ending matches the taxi zone number
                new_row1.update({column:True}) #Make that entry True
            else:
                new_row1.update({column:False}) #Else make that entry False
    
    #For each hour (in a 24 hour period) add values to a new row
    for i in range(24): 
        new_row.update({'Hour':i})

        #Create values for weather variables 
        new_row.update({'Temperature':temp[i]})
        new_row.update({'Humidity':hum[i]})
        new_row.update({'Snow_True':snow_true[i]})
        new_row.update({'Snow_False':snow_false[i]})
        new_row.update({'Precipitation':percip[i]})

        #create timestamp and other time-related data based on the hour value (i) and list of holidays
        timestamp = create_ts(i,list_hols) 
        new_row.update({'Timestamp':timestamp[1]})  

        #Update Day_weekday and Day_weekend.
        day_week = timestamp[2]
        # print(f'DAY WEEK = {day_week}')
        if day_week == 5 or day_week == 6:
            new_row.update({'Day_Weekday':False})
            new_row.update({'Day_Weekend':True})
        else:
            new_row.update({'Day_Weekday':True})
            new_row.update({'Day_Weekend':False})

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

#Open the Pickle File
busy_model = pickle.load(open(file_path_pickle, 'rb'))

#Make the predictions
busyness_predictions = busy_model.predict(df)

#Add predictions column to df
df['Busyness Predicted'] = busyness_predictions

selected_columns = ['Hour', 'Timestamp','Busyness Predicted','Holiday_False', 'Holiday_True','Month_7', 'Month_8', 'Day_Weekday', 'Day_Weekend']
# print(df[selected_columns].head(30))
# print(df[selected_columns].tail(30))

#Drop Certain Columns
df.drop(['Temperature', 'Humidity','Snow_True', 'Snow_False', 'Precipitation',
        'Holiday_False', 'Holiday_True', 'Day_Weekday', 'Day_Weekend',
       'Month_1', 'Month_2', 'Month_3', 'Month_4', 'Month_5', 'Month_6',
       'Month_7', 'Month_8', 'Month_9', 'Month_10', 'Month_11', 'Month_12',
       ], axis=1, inplace = True)

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

#Get rid of unwanted taxi zone dummy variable columns
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

# Should be left with column for hour, busyness score, timestamp and taxi zone id

#Send dataframe as a json file
df.reset_index(drop=True, inplace=True) #This excludes the index
df.to_json(file_path_busy_json, orient='records')
df.to_csv(file_path_busy_csv, index=False)

####### End time - to get run time #########
end_time = time.time()
run_time = round((end_time - start_time),1)
print(f'\nRun time to produce busyness scores for 1 day for Taxis = {run_time} seconds')

# Calculate Summary Parameters
mean_value = df['Busyness Predicted'].mean()
median_value = df['Busyness Predicted'].median()
range_value = df['Busyness Predicted'].max() - df['Busyness Predicted'].min()
std_value = df['Busyness Predicted'].std()

# Print the results
print("\nMean of Predicted Busyness - Taxi: ", mean_value)
print("Median of Predicted Busyness - Taxi: ", median_value)
print("Range of Predicted Busyness - Taxi: ", range_value)
print("Standard Deviation of Predicted Busyness - Taxi: ", std_value)