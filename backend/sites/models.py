from django.contrib.gis.db import models

CATEGORY_CHOICES = [
    ('hindu_temple', 'Hindu Temple'),
    ('buddhist', 'Buddhist'),
    ('palace_fort', 'Palace/Fort'),
    ('archaeological', 'Archaeological'),
    ('unesco', 'UNESCO Heritage'),
    ('natural_religious', 'Natural/Religious'),
    ('religious_site', 'Religious Site'),
    ('other', 'Other'),
]


class Site(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    tags = models.JSONField(default=list, blank=True)
    location_name = models.CharField(max_length=255, blank=True, default='')
    location = models.PointField(srid=4326)
    significance = models.TextField(blank=True, default='')
    image_url = models.URLField(blank=True, default='')
    era = models.CharField(max_length=100, blank=True, default='')
    unesco_status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
