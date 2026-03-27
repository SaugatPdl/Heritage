from django.db import migrations, models
import django.contrib.gis.db.models.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Site',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, default='')),
                ('category', models.CharField(
                    choices=[
                        ('hindu_temple', 'Hindu Temple'),
                        ('buddhist', 'Buddhist'),
                        ('palace_fort', 'Palace/Fort'),
                        ('archaeological', 'Archaeological'),
                        ('unesco', 'UNESCO Heritage'),
                        ('natural_religious', 'Natural/Religious'),
                        ('religious_site', 'Religious Site'),
                        ('other', 'Other'),
                    ],
                    default='other',
                    max_length=50,
                )),
                ('tags', models.JSONField(blank=True, default=list)),
                ('location_name', models.CharField(blank=True, default='', max_length=255)),
                ('location', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('significance', models.TextField(blank=True, default='')),
                ('image_url', models.URLField(blank=True, default='')),
                ('era', models.CharField(blank=True, default='', max_length=100)),
                ('unesco_status', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
    ]
