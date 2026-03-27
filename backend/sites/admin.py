from django.contrib.gis import admin
from .models import Site


@admin.register(Site)
class SiteAdmin(admin.GISModelAdmin):
    list_display = ['name', 'category', 'location_name', 'unesco_status', 'created_at']
    list_filter = ['category', 'unesco_status']
    search_fields = ['name', 'location_name', 'description']
