Set Up Security Environment in Django

For Python Files
1. move the .env file into root folder

2. add .env to gitignore (check if it needs the full path)

3. install python-dotenv and import to setting.py.  

4. Then initialise environ
from dotenv import load_dotenv
import os
load_dotenv()

5. Add the keys/sensitive data into .env file (with quotes)

6. Everytime you want to use that data call it by:
os.environ.get("WHATEVER_YOU_CALLED_THE_NAME_OF_THE_KEY")

For JSX Files (that use Vite)
1. Install dotenv
npm i dotenv

2. Create a variable in the .env file  "VITE_MAPBOX_API_KEY"

3. Create a constant in the jsx file
const apiKey = import.meta.env.VITE_MAPBOX_API_KEY
mapboxgl.accessToken = apiKey;
