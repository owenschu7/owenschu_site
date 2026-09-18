from django.db import migrations


def add_react_to_poker_tracker(apps, schema_editor):
    Project = apps.get_model('projects', 'Project')
    # No-op if this row doesn't exist in a given environment (it isn't
    # seeded by a migration -- it was added by hand via the admin).
    project = Project.objects.filter(slug='poker-tracker').first()
    if project and 'react' not in project.technology.lower():
        project.technology = f"{project.technology}, React"
        project.save(update_fields=['technology'])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0005_project_status'),
    ]

    operations = [
        migrations.RunPython(add_react_to_poker_tracker, noop_reverse),
    ]
