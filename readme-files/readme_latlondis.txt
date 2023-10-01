latlondis setup as a new component

Takes the latitude, longitude and distance from the frontend
and sends it to the backend.

In the backend changes made in users are:
1. new model created in models
2. new serializer class made for route
3. new views function created (user_route)
4. new path added to views in urls
5. New tables created in PostgreSQL (users_userroute)

In the route.py file
6. add in some script that connects and takes data from the database 
and provides distance, latitude and longitude information for the algorithm  
