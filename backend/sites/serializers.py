from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Site


class SiteSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Site
        geo_field = 'location'
        fields = [
            'id', 'name', 'description', 'category', 'tags',
            'location_name', 'significance', 'image_url', 'era',
            'unesco_status', 'created_at', 'updated_at',
        ]
