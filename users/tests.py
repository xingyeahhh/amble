from django.test import TestCase

# Create your tests here.
import unittest
from unittest import mock
from unittest.mock import MagicMock
import algorithm
import chatbox as cb
import openai
from datetime import datetime
from rest_framework.exceptions import ValidationError
from .models import User, UserPref, UserRoute
from .serializers import UserSerializer, UserPreferencesSerializer, UserRouteSerializer
import json
from django.test import RequestFactory
from django.core.serializers.json import DjangoJSONEncoder
from rest_framework.test import force_authenticate
from .views import registration, handle_routeinpput_data, preferences, logincheck, chatbox_options, getquote, chatgpt, ratingsUpdate

# TestCases for algorithm.py


class TestAlgorithm(unittest.TestCase):

    @mock.patch('algorithm.distance_calc', return_value=0.8)
    def test_get_closest_waypoint(self, mock_distance_calc):
        origin = (0, 0)
        waypoint_list = [(1, 1), (2, 2), (3, 3)]
        closest = algorithm.get_closest_waypoint(origin, waypoint_list)
        self.assertEqual(closest, (1, 1))

    @mock.patch('algorithm.distance_calc', return_value=0.8)
    def test_sort_waypoints(self, mock_distance_calc):
        origin = (0, 0)
        waypoint_list = [(3, 3), (1, 1), (2, 2)]
        sorted_waypoints = algorithm.sort_waypoints(origin, waypoint_list)
        self.assertEqual(sorted_waypoints, [(1, 1), (2, 2), (3, 3)])


# TestCases for chatbox.py
class TestChatBot(unittest.TestCase):

    def setUp(self):
        self.sample_place = {
            'name': 'Test Cafe',
            'address': '123 Test St',
            'populartimes': [
                {'name': 'Monday', 'data': [0]*24},
            ]
        }

        self.sample_response = mock.MagicMock()
        self.sample_response.choices[0].text.strip.return_value = "Sample response text"

        self.sample_suggestion = [
            [self.sample_place, '123 Test St', self.sample_place],
            None,
            None
        ]

        openai.Completion.create = mock.MagicMock(
            return_value=self.sample_response)

    def test_get_quiet_indicator(self):
        result = cb.get_quiet_indicator(self.sample_place, ['Monday', 9])
        self.assertEqual(result, ['very quiet', 0, None])

    def test_populate_busy_message(self):
        result, status, valid_options = cb.populate_busy_message(
            self.sample_suggestion, "cafe", ['Monday', 9])
        self.assertTrue(status)
        self.assertEqual(len(valid_options), 1)

    def test_get_location_info(self):
        result = cb.get_location_info("Test Location", "123 Test St")
        self.assertEqual(result, "\n Sample response text")

# TestCases for serializers.py


class TestSerializers(unittest.TestCase):

    def setUp(self):
        self.user_attrs = {
            'first_name': 'John',
            'last_name': 'Doe',
            'username': 'johndoe',
            'address': '123 Test St',
            'password': 'testpassword',
            'registrationDate': datetime.now()
        }

        self.user_pref_attrs = {
            'library': True,
            'worship': False,
            'community': True,
            'museum': False,
            'walking_node': 10,
            'park_node': 5
        }

        self.user_route_attrs = {
            'id': 1,
            'latitude': 123.45,
            'longitude': 67.89,
            'distance': 0.5,
            'hour': 10
        }

    def test_user_serializer(self):
        user = User(**self.user_attrs)
        serializer = UserSerializer(user)
        expected_data = self.user_attrs.copy()
        # Password will be hashed, not the plain text
        expected_data['password'] = user.password
        expected_data['registrationDate'] = user.registrationDate.isoformat()
        self.assertDictEqual(serializer.data, expected_data)

    def test_user_preferences_serializer(self):
        user_pref = UserPref(**self.user_pref_attrs)
        serializer = UserPreferencesSerializer(user_pref)
        self.assertDictEqual(serializer.data, self.user_pref_attrs)

    def test_user_route_serializer(self):
        user_route = UserRoute(**self.user_route_attrs)
        serializer = UserRouteSerializer(user_route)
        self.assertDictEqual(serializer.data, self.user_route_attrs)

# TestCases for views.py


class TestViews(unittest.TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @mock.patch('your_app_name.views.User.objects')
    def test_registration_view(self, mock_objects):
        user = User(username='Test User', password='password123')
        user_data = UserSerializer(user).data
        request = self.factory.post(
            '/users/registration', user_data, content_type='application/json')
        response = registration(request)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data, user_data)

    # Add more methods here for other views, similar to the method above

    def test_handle_routeinpput_data_view(self):
        request = self.factory.post('/users/handle_routeinpput_data', data=json.dumps({
            "latitude": 10.00,
            "longitude": 20.00,
            "hour": "10:00",
            "distance": 5.00,
            "endLatitude": 30.00,
            "endLongitude": 40.00
        }, cls=DjangoJSONEncoder), content_type='application/json')
        response = handle_routeinpput_data(request)
        self.assertIsNotNone(response.content)

    def test_preferences_view(self):
        request = self.factory.post('/users/preferences', data=json.dumps({
            "library": True,
            "worship": False,
            "community": True,
            "museum": False,
            "walking_node": True,
            "park_node": False
        }, cls=DjangoJSONEncoder), content_type='application/json')
        response = preferences(request)
        self.assertIsNotNone(response.content)

# TestCases for views.py


class TestViews(unittest.TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @mock.patch('your_app_name.views.User.objects')
    def test_registration_view(self, mock_objects):
        user = User(username='Test User', password='password123')
        user_data = UserSerializer(user).data
        request = self.factory.post(
            '/users/registration', user_data, content_type='application/json')
        response = registration(request)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data, user_data)

    # Add more methods here for other views, similar to the method above

    def test_handle_routeinpput_data_view(self):
        request = self.factory.post('/users/handle_routeinpput_data', data=json.dumps({
            "latitude": 10.00,
            "longitude": 20.00,
            "hour": "10:00",
            "distance": 5.00,
            "endLatitude": 30.00,
            "endLongitude": 40.00
        }, cls=DjangoJSONEncoder), content_type='application/json')
        response = handle_routeinpput_data(request)
        self.assertIsNotNone(response.content)

    def test_preferences_view(self):
        request = self.factory.post('/users/preferences', data=json.dumps({
            "library": True,
            "worship": False,
            "community": True,
            "museum": False,
            "walking_node": True,
            "park_node": False
        }, cls=DjangoJSONEncoder), content_type='application/json')
        response = preferences(request)
        self.assertIsNotNone(response.content)


if __name__ == "__main__":
    unittest.main()
