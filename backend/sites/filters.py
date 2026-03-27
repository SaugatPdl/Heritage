import django_filters
from django.contrib.gis.geos import Polygon
from .models import Site


class SiteFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category', lookup_expr='iexact')
    bbox = django_filters.CharFilter(method='filter_bbox')

    class Meta:
        model = Site
        fields = ['category', 'bbox']

    def filter_bbox(self, queryset, name, value):
        try:
            coords = [float(c) for c in value.split(',')]
            if len(coords) != 4:
                return queryset
            min_lon, min_lat, max_lon, max_lat = coords
            bbox_polygon = Polygon.from_bbox((min_lon, min_lat, max_lon, max_lat))
            bbox_polygon.srid = 4326
            return queryset.filter(location__within=bbox_polygon)
        except (ValueError, Exception):
            return queryset
