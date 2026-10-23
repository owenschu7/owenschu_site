from django.shortcuts import render, get_object_or_404
from django.template.exceptions import TemplateDoesNotExist
from .models import Project

# render the project list html
def projects_list(request):
    projects = Project.objects.all()
    return render(request, 'projects/project_list.html', {'projects': projects})

# tell django to look for an html file that matches the project's slug in custom_details
def project_detail(request, slug):
    project = get_object_or_404(Project, slug=slug)
    
    # Dynamically build the template name based on the slug
    template_name = f"projects/custom_details/{slug}.html"
    
    try:
        # Try to load the custom page for this specific project
        return render(request, template_name, {'project': project})
    except TemplateDoesNotExist:
        # Fallback in case HTML file isnt created yet
        return render(request, 'projects/fallback_detail.html', {'project': project})
