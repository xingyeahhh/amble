from django.contrib import admin
from django.urls import path, re_path, include
from . import views

urlpatterns = [
        path('users/preferences', views.preferences),
        path('users/registration', views.registration),
        path('users/logincheck', views.logincheck),
        path('users/handle_routeinpput_data', views.handle_routeinpput_data),
        path('users/chatbox', views.chatbox_options),
        path('users/getquote', views.getquote),
        path('users/chatgpt', views.chatgpt),
        path('users/ratings', views.ratingsUpdate),
]
