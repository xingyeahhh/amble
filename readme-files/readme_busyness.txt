'Busyness' Readme File

Only creates busyness scores for 1 day (24 hours)

There are 77 inputs:
64 for each taxi zone (these were set as dummy variables in df)
7 for each day of the week (these were set as dummy variables in df)
4 weather (temp, wind, humidity, precipitation)
2 time (hour, time stamp)

Inputs (in this order) are:columns_names = ['Hour', 'Temperature', 'Humidity', 'Wind Speed', 'Precipitation',
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

Some time data has been input: 
datetime.now for NYC, for which Year, Month and Day have been extracted

Weather Data has been scrapped from Weather API (for 1 day)

A dataframe with all these inputs has been created that match the columns used to create the model

This dataframe is used to create busyness predictions for 24 hours for each taxi zone ( 1536 values)

Dataframe is tidied up again so the only columns left are hour, timestamp taxi zone ID and busyness score.

this dataframe is then sent as a json file to components directory (busyness.json)