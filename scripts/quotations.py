import requests
import json

# Set up environmental variables
from dotenv import load_dotenv
import os
load_dotenv()

# Create File Path
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent

API_KEY = os.environ.get("THEY_SAID_SO_API")

quotedata = {}
for i in range(250): 
    url = f"http://quotes.rest/quote/random.json?api_key={API_KEY}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        quote = data['contents']['quotes'][0]['quote']
        author = data['contents']['quotes'][0]['author']
        x = {author:quote}
        quotedata.update(x)

# print(quotedata)
json_object = json.dumps(quotedata, indent=4)
file_path = BASE_DIR /'src'/'json-files'/'quotations.json'
with open(file_path, 'w') as file: 
    file.write(json_object)
