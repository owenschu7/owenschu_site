from django.db import models

class Profile(models.Model):
    name = models.CharField(max_length=200)
    headline = models.CharField(max_length=200)
    summary = models.TextField()
    location = models.CharField(max_length=200, blank=True)
    email = models.EmailField(blank=True)
    resume_link = models.URLField(blank=True)

    def __str__(self):
        return self.name


class Education(models.Model):
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    field_of_study = models.CharField(max_length=200, blank=True)
    location = models.CharField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.degree} - {self.institution}"


class Experience(models.Model):
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.title} - {self.company}"


class Skill(models.Model):
    class Category(models.TextChoices):
        LANGUAGE = 'language', 'Language'
        FRAMEWORK = 'framework', 'Framework & Library'
        PLATFORM = 'platform', 'Platform & Tool'

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.LANGUAGE)

    def __str__(self):
        return self.name
