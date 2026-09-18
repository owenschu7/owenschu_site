from datetime import date

from django.db import migrations

def load_initial_resume(apps, schema_editor):
    # Placeholder content -- edit through the admin once the real details are ready.
    Profile = apps.get_model('resume', 'Profile')
    Education = apps.get_model('resume', 'Education')
    Experience = apps.get_model('resume', 'Experience')
    Skill = apps.get_model('resume', 'Skill')

    Profile.objects.bulk_create([
        Profile(
            name="Owen Schumacher",
            headline="Full-Stack Developer & Computer Science Student",
            summary=(
                "CS student at Chico State who likes programming and building things, "
                "backend, frontend, and occasional game development "
                "Recently been mixing web development with game-dev tools like Godot "
                "and Rust, and low-level networking in C++."
            ),
            location="Chico, CA",
            email="owenschu7@gmail.com",
            resume_link="",
        ),
    ])

    Education.objects.bulk_create([
        Education(
            institution="California State University, Chico",
            degree="Bachelor of Science",
            field_of_study="Computer Science",
            location="Chico, CA",
            start_date=date(2023, 8, 21),
            end_date=None,
            description=(
                "Coursework in data structures, algorithms, databases, server-side, cloud computing, and operating systems, "
                "alongside self-directed full-stack and game-dev projects."
            ),
        ),
    ])

    Experience.objects.bulk_create([
        Experience(
            title="Independent Full-Stack Developer",
            company="Personal Projects",
            location="Chico, CA",
            start_date=date(2024, 1, 1),
            end_date=None,
            description=(
                "Designing and building this portfolio site (Django + a custom "
                "Godot-powered background), a poker win/loss tracker, with users, and authentication, a multiplayer "
                "casino-style RPG in C++ with raw socket networking, and a "
                "JavaScript chess engine."
            ),
        ),
    ])

    # apps.get_model() returns a historical model reconstructed from field
    # definitions only -- it doesn't carry Skill.Category, so use the raw
    # stored values directly (must match Skill.Category's values in models.py).
    Skill.objects.bulk_create([
        Skill(name="Python", category="language"),
        Skill(name="JavaScript", category="language"),
        Skill(name="C++", category="language"),
        Skill(name="HTML", category="language"),
        Skill(name="CSS", category="language"),
        Skill(name="GDScript", category="language"),
        Skill(name="Django", category="framework"),
        Skill(name="React", category="framework"),
        Skill(name="SFML", category="framework"),
        Skill(name="PostgreSQL", category="platform"),
        Skill(name="Google Cloud Platform", category="platform"),
        Skill(name="Docker", category="platform"),
        Skill(name="Git", category="platform"),
    ])

class Migration(migrations.Migration):

    dependencies = [
        ('resume', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(
            code=load_initial_resume,
        ),
    ]
