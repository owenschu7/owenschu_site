# projects/context_processors.py
from .models import Project

def global_projects(request):
    # Fetch all projects (or limit to a top 5 using [:5])
    # We name it 'navbar_projects' to avoid clashing with other views
    return {
        'navbar_projects': Project.objects.all()
    }
