from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing_view, name='poker_login'),
    path('dashboard/', views.dashboard_view, name='poker_dashboard'),
]
