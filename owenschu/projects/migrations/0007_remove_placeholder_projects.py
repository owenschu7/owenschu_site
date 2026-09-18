from django.db import migrations

# Removes the two generic placeholder rows seeded by 0003_auto_20260917_2222
# ("yourusername" github links etc.) -- filter().delete() is a no-op if
# they're already gone from a given environment.

PLACEHOLDER_SLUGS = ['ecommerce-api', 'data-dashboard']


def remove_placeholder_projects(apps, schema_editor):
    Project = apps.get_model('projects', 'Project')
    Project.objects.filter(slug__in=PLACEHOLDER_SLUGS).delete()


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0006_poker_tracker_add_react'),
    ]

    operations = [
        migrations.RunPython(remove_placeholder_projects, noop_reverse),
    ]
