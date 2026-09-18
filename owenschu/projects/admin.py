from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'technology', 'status')
    list_filter = ('status',)
    prepopulated_fields = {'slug': ('title',)}
