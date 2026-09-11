from django.shortcuts import render

def dashboard_view(request):
    return render(request, 'poker/dashboard.html')

def landing_view(request):
    return render(request, 'poker/landingPage.html')
