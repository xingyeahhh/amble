import datetime
import pytz

nyc_zone = pytz.timezone("America/New_York") 
nyc_time = datetime.datetime.now(nyc_zone)

year = nyc_time.year
month = nyc_time.month
day = nyc_time.day
print(year, month, day)