from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing_view, name='landing_view'),
    path('poker-tracker', views.landing_view, name='landing_view'),
]
