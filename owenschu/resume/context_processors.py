# resume/context_processors.py
from .models import Profile, Education, Experience, Skill

# order_by('category') would sort alphabetically by the raw choice value
# (framework, language, platform) rather than the order they're meant to
# read in, so group order is fixed here instead.
CATEGORY_ORDER = [Skill.Category.LANGUAGE, Skill.Category.FRAMEWORK, Skill.Category.PLATFORM]

def resume_context(request):
    skills = sorted(
        Skill.objects.all(),
        key=lambda s: (CATEGORY_ORDER.index(s.category), s.name),
    )
    return {
        'resume_profile': Profile.objects.first(),
        'resume_education': Education.objects.order_by('-start_date'),
        'resume_experience': Experience.objects.order_by('-start_date'),
        'resume_skills': skills,
    }
