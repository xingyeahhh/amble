from django.db import models
from django.contrib.postgres.fields import JSONField

class User(models.Model):
    first_name = models.CharField("First Name", max_length=30)
    last_name = models.CharField("Last Name", max_length=30)
    username = models.EmailField("Username", max_length=50,primary_key=True) #Called username rather than email
    address = models.CharField("Address", max_length=100)
    password = models.CharField("Password",default="missing",max_length=30)
    registrationDate = models.DateField("Registration Date", auto_now_add=True)

class UserPref(models.Model):
    park = models.CharField("Parks", max_length=300, null=True)
    library = models.CharField("Libraries", max_length=300, null=True)
    worship = models.CharField("Places of Worship", max_length=300, null=True)
    community = models.CharField("Community Centres", max_length=300, null=True)
    museum = models.CharField("Museums & Art Galleries", max_length=300, null=True)
    walking_node = models.CharField("Other Walking Nodes", max_length=300, null=True)
    park_node = models.CharField("Other Park Nodes", max_length=300, null=True)
    
class UserRoute(models.Model):
    # email  =  models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    latitude = models.CharField("Latitude", max_length=30)
    longitude = models.CharField("Longitude", max_length=30)
    distance = models.CharField("Distance",max_length=30)
    hour = models.IntegerField("Hour")
    
class Nodes(models.Model):
    id_str = models.CharField(max_length=50)
    name = models.CharField(max_length=255, null=True)
    type = models.CharField(max_length=100)
    address = models.CharField(max_length=255, null=True)
    internet_access = models.CharField(max_length=100, null=True)
    wheelchair_accessible = models.CharField(max_length=100, null=True)
    opening_hours = models.CharField(max_length=100, null=True)
    grid_id = models.IntegerField()
    taxi_zone = models.IntegerField()
    precinct = models.IntegerField()
    b_score = models.JSONField()
    c_score = models.JSONField(null=True)
    rating = models.FloatField()
    latitude = models.FloatField()
    longitude = models.FloatField()