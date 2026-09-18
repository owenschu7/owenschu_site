from django.db import migrations

# 0002_seed_resume already ran once, so its RunPython code doesn't
# re-execute just because its source text changed -- migrations are
# one-shot. This migration pushes the edited copy into any DB where
# 0002 already applied (a no-op on a fresh DB, where 0002 already
# creates the rows with this text).

NEW_SUMMARY = (
    "CS student at Chico State who likes programming and building things, "
    "backend, frontend, and occasional game development "
    "Recently been mixing web development with game-dev tools like Godot "
    "and Rust, and low-level networking in C++."
)

NEW_EDUCATION_DESCRIPTION = (
    "Coursework in data structures, algorithms, databases, server-side, cloud computing, and operating systems, "
    "alongside self-directed full-stack and game-dev projects."
)

NEW_EXPERIENCE_DESCRIPTION = (
    "Designing and building this portfolio site (Django + a custom "
    "Godot-powered background), a poker win/loss tracker, with users, and authentication, a multiplayer "
    "casino-style RPG in C++ with raw socket networking, and a "
    "JavaScript chess engine."
)


def update_resume_text(apps, schema_editor):
    Profile = apps.get_model('resume', 'Profile')
    Education = apps.get_model('resume', 'Education')
    Experience = apps.get_model('resume', 'Experience')
    Skill = apps.get_model('resume', 'Skill')

    Profile.objects.filter(name="Owen Schumacher").update(summary=NEW_SUMMARY)
    Education.objects.filter(institution="California State University, Chico").update(
        description=NEW_EDUCATION_DESCRIPTION
    )
    Experience.objects.filter(title="Independent Full-Stack Developer").update(
        description=NEW_EXPERIENCE_DESCRIPTION
    )
    # "Godot Engine" was dropped from the skill list in 0002 -- remove it
    # from already-migrated DBs to match.
    Skill.objects.filter(name="Godot Engine").delete()


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('resume', '0002_seed_resume'),
    ]

    operations = [
        migrations.RunPython(update_resume_text, noop_reverse),
    ]
