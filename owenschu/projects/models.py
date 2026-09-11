from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    technology = models.CharField(max_length=100)
    github_link = models.URLField(blank=True)

    def __str__(self):
        return self.title
