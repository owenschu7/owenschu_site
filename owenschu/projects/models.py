from django.db import models

class Project(models.Model):
    class Status(models.TextChoices):
        NOT_FINISHED = 'not_finished', 'Not finished'
        IN_PROGRESS = 'in_progress', 'In progress'
        COMPLETED = 'completed', 'Completed'

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    technology = models.CharField(max_length=100)
    github_link = models.URLField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NOT_FINISHED,
    )

    def __str__(self):
        return self.title
