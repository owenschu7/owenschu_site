from django.shortcuts import render, get_object_or_404
from django.template.exceptions import TemplateDoesNotExist
from .models import Project

# Instead of sending every project to one generic template
# tell Django to look for an html file that matches the project's slug
def projects_list(request):
    projects = Project.objects.all()
    return render(request, 'projects/project_list.html', {'projects': projects})

def project_detail(request, slug):
    project = get_object_or_404(Project, slug=slug)
    
    # Dynamically build the template name based on the slug
    template_name = f"projects/custom_details/{slug}.html"
    
    try:
        # Try to load the custom page for this specific project
        return render(request, template_name, {'project': project})
    except TemplateDoesNotExist:
        # Fallback just in case you haven't built the custom HTML file yet
        return render(request, 'projects/fallback_detail.html', {'project': project})
