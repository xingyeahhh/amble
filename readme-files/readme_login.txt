Changes to the Backend.

1. In settings.py 
a) add to Installed Apps
'rest_framework',
'corsheaders',  [Cross-Origin Resource Sharing (CORS) headers to responses. 
This allows in-browser requests to your Django application from other origins.]
'users', [where models, serialzers, urls, views files are stored]
b) add 'corsheaders.middleware.CorsMiddleware', to middleware
c) create database details (name etc)
2. In project urls add path to app urls
3. In models create database table inputs.
4. In equalizers create equalizer class for database [allow conversion of complex datatypes 
to python type objects]
5. In views create HTTP Responses

Changes to the frontend
1. Create Login component (login.jsx) - connection established using axios so pip install axios
2. Swap Login component for Map in App.jsx
3. Add some css to app.css