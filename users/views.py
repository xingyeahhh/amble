from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import User, UserPref, UserRoute
from .serializers import UserSerializer, UserPreferencesSerializer, UserRouteSerializer
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from .algorithm import *
from .access_db import *
from .chatbox import *
import json
import requests
import openai

# Set up environmental variables
from dotenv import load_dotenv
import os
load_dotenv()


#Create File Path
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent

#Function to view user registration data
@api_view(['GET', 'POST'])
def registration(request):
    if request.method == 'GET':
        user = User.objects.all()
        serializer = UserSerializer(user, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = User.objects.all()
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    return HttpResponseBadRequest('Unsupported request method.')

#Function to view user route data
def handle_routeinpput_data(request):
    if request.method == 'POST':
        latitude = request.POST.get("latitude")
        longitude = request.POST.get("longitude")
        hour = request.POST.get("hour")
        dist = request.POST.get("distance")
        endLatitude = request.POST.get("endLatitude")
        endLongitude = request.POST.get("endLongitude")
        #response_data = {"waypoints": magic(float(latitude), float(longitude), str(hour))}
        response_data = {"waypoints": magic(float(latitude), float(longitude), str(hour), float(dist), float(endLatitude), float(endLongitude))}
        return JsonResponse(response_data)

#Function to view user preferences data
@api_view(['GET', 'POST'])
def preferences(request):
    if request.method == 'POST':
        prefdata = json.loads(request.body)
        # print(f'Data from the frontend = {prefdata} and its type = {type(prefdata)}')
        response_data = {'data_from_frontend': prefdata}
        file_path_pre = BASE_DIR /'src'/'json-files'/'preferences.json'
        with open(file_path_pre, "w") as outfile:
            json.dump(response_data , outfile, indent=4)
        return JsonResponse(response_data)
    else:
        return JsonResponse({'Error': 'Invalid Request'})

#Function to check user login data versus what is stored in database    
def logincheck(request):
    if request.method == 'POST':
        checkdata = json.loads(request.body)
        username = checkdata['username']
        # print(f'This is the checkdata {checkdata}')
        password = checkdata['password']
        response_data = {"checks": checklogin(username,password)}
        # print(f'In views.logincheck the data is username = {username} and password = {password}')
        return JsonResponse(response_data)

#Function for chatbox functionalities
@api_view(['GET', 'POST'])
def chatbox_options(request):
    if request.method == 'POST':
        request_data = json.loads(request.body)
        waypoints = request_data.get('waypoints')
        user_choice = request_data.get('user_choice')
        trip_time = request_data.get('trip_time')
        ai_call = request_data.get('ai_call')
        location_choice = request_data.get('location_choice')

        data = option_handler(user_choice, waypoints, trip_time, ai_call, location_choice)

        return JsonResponse({'data': data})
    elif request.method == 'GET':
        return Response({"message": "GET request received."}, status=200)
    
#Function to get quotation data to the front end
def getquote(request):
    file_path_quote = BASE_DIR /'src'/'json-files'/'quotations.json'
    with open(file_path_quote, "r") as file:
        response_data = json.load(file)
    return JsonResponse(response_data)

#Function to get ChatGPT response
def chatgpt(request):
    openai.api_key = os.environ.get("CHAT_GPT_API_KEY") # Set up environmental variable
    if request.method == 'POST':
        data = json.loads(request.body)
        user_input = data.get('input','')
 # Send the user input to the ChatGPT API
        system_message = "You are an assistant that knows a lot about various topics. Please provide a detailed answer to the following question."
        try:
            response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_input}
        ],
        temperature=1,
        max_tokens=150
        )
        # Extract the response text from the API response
            api_response = response['choices'][0]['message']['content']
        except Exception as e:
            # Handle exceptions, log the error, or provide a default response if an error occurs
            api_response = "Sorry, there was an error processing your request."

        response_data = {
            'message': api_response
        }
        return JsonResponse(response_data)
    return JsonResponse({'error': 'Invalid request method'})

# Function that handles the update of rating values
@api_view(['POST'])
def ratingsUpdate(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'})
    try:
        ratingsData = json.loads(request.body)
        # Load all_nodes.json
        file_path = BASE_DIR / 'src' / 'json-files' / 'all_nodes.json'
        with open(file_path, 'r') as file:
            all_nodes = json.load(file)
        # Update the ratings in all_nodes
        for updated_node in ratingsData:
            node = next((n for n in all_nodes['data'] if n['id'] == updated_node['id']), None)
            if node:
                node['rating'] = updated_node['rating']
        # Write the updated all_nodes.json back to the file
        with open(file_path, 'w') as file:
            json.dump(all_nodes, file, indent=2)
        return JsonResponse({'status': 'success'})
    except Exception as e:
        # Handle exceptions and return an error response
        return JsonResponse({'error': str(e)})