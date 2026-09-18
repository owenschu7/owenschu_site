from django.db import migrations

def load_initial_projects(apps, schema_editor):
    # Retrieve the historical version of the Project model
    Project = apps.get_model('projects', 'Project')
    
    # Create the initial data instances
    Project.objects.bulk_create([
        Project(
            title="Portfolio Website",
            slug="portfolio-website",
            description="My personal portfolio showing off my work.",
            technology="Django, Python, Bootstrap",
            github_link="https://github.com/yourusername/portfolio"
        ),
        Project(
            title="E-commerce API",
            slug="ecommerce-api",
            description="A RESTful API for an online store.",
            technology="Django REST Framework, PostgreSQL",
            github_link="https://github.com/yourusername/ecommerce"
        ),
        Project(
            title="Data Dashboard",
            slug="data-dashboard",
            description="Interactive dashboard for visualizing sales metrics.",
            technology="React, Django, Chart.js",
            github_link="" # URLField with blank=True can be an empty string
        ),
    ])

class Migration(migrations.Migration):

    dependencies = [
        # this is the initial migration for the projects class
        ('projects', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(
            code=load_initial_projects,
        ),
    ]
