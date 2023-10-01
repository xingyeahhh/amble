"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic.base import TemplateView
from users import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/preferences', views.preferences),
    path('users/registration', views.registration),
    path('users/logincheck', views.logincheck),
    path('users/getquote', views.getquote),
    path('users/handle_routeinpput_data', views.handle_routeinpput_data),
    path('users/chatbox', views.chatbox_options),
    path('users/chatgpt', views.chatgpt),
    path('users/ratings', views.ratingsUpdate),
    path("chatbox", TemplateView.as_view(template_name="base.html")),
    path("loginCheck", TemplateView.as_view(template_name="base.html")),
    path("userpref", TemplateView.as_view(template_name="base.html")),
    path("", TemplateView.as_view(template_name="base.html")),
    path("login", TemplateView.as_view(template_name="base.html")),
    path("comms", TemplateView.as_view(template_name="base.html")),
    path("homepage", TemplateView.as_view(template_name="base.html")),
    path("showroute", TemplateView.as_view(template_name="base.html")),
    path("landingpage", TemplateView.as_view(template_name="base.html")),
    path("quotes", TemplateView.as_view(template_name="base.html")),
    path("carbon_calculator", TemplateView.as_view(template_name="base.html")),
    path("resources", TemplateView.as_view(template_name="base.html")),
    path("quotes", TemplateView.as_view(template_name="base.html")),
    path("map", TemplateView.as_view(template_name="base.html")),
    path("mobilehomepage", TemplateView.as_view(template_name="base.html")),
    path("mobilemappage", TemplateView.as_view(template_name="base.html")),
    path("realrespage", TemplateView.as_view(template_name="base.html")),
    path("realmappage", TemplateView.as_view(template_name="base.html")),
    path("realhomepage", TemplateView.as_view(template_name="base.html")),
    path("foryou-error", TemplateView.as_view(template_name="base.html")),
]
