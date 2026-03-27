from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from sites.models import Site

SAMPLE_SITES = [
    {
        'name': 'Pashupatinath Temple',
        'category': 'hindu_temple',
        'location_name': 'Kathmandu, Bagmati Province',
        'description': 'One of the most sacred Hindu temples in the world, dedicated to Lord Shiva. A UNESCO World Heritage Site located on the banks of the Bagmati River.',
        'significance': 'The most important Hindu temple in Nepal, attracting thousands of pilgrims annually. It is one of the four most important religious sites in Asia for devotees of Shiva.',
        'era': '5th century CE (current structure)',
        'tags': ['shiva', 'hindu', 'UNESCO', 'temple', 'sacred'],
        'unesco_status': True,
        'longitude': 85.3486,
        'latitude': 27.7104,
    },
    {
        'name': 'Swayambhunath Stupa',
        'category': 'buddhist',
        'location_name': 'Kathmandu, Bagmati Province',
        'description': 'An ancient religious complex atop a hill west of Kathmandu, also known as the Monkey Temple. One of the oldest and most revered religious sites in Nepal.',
        'significance': 'Sacred to both Buddhists and Hindus, this stupa is over 2,500 years old and offers panoramic views of the Kathmandu Valley.',
        'era': '5th century CE',
        'tags': ['buddhist', 'stupa', 'UNESCO', 'monkey temple', 'ancient'],
        'unesco_status': True,
        'longitude': 85.2900,
        'latitude': 27.7149,
    },
    {
        'name': 'Patan Durbar Square',
        'category': 'palace_fort',
        'location_name': 'Lalitpur, Bagmati Province',
        'description': 'A historic square in Lalitpur (Patan) featuring stunning Newari architecture, ancient palaces, and courtyards with intricately carved woodwork.',
        'significance': 'One of the finest examples of Newari architecture in Nepal, with temples and palaces dating back to the 3rd century.',
        'era': '3rd century CE onwards',
        'tags': ['Newari', 'palace', 'UNESCO', 'architecture', 'durbar'],
        'unesco_status': True,
        'longitude': 85.3252,
        'latitude': 27.6737,
    },
    {
        'name': 'Bhaktapur Durbar Square',
        'category': 'palace_fort',
        'location_name': 'Bhaktapur, Bagmati Province',
        'description': 'A magnificent plaza in the ancient city of Bhaktapur, housing royal palaces, temples, and courtyards that showcase medieval Newari art and culture.',
        'significance': 'Known as the "City of Devotees", Bhaktapur Durbar Square is one of the best preserved medieval cities in Asia.',
        'era': '12th–18th century',
        'tags': ['Newari', 'palace', 'UNESCO', 'medieval', 'bhaktapur'],
        'unesco_status': True,
        'longitude': 85.4293,
        'latitude': 27.6713,
    },
    {
        'name': 'Mayadevi Temple, Lumbini',
        'category': 'buddhist',
        'location_name': 'Lumbini, Lumbini Province',
        'description': 'The birthplace of Siddhartha Gautama (the Buddha), marked by the Mayadevi Temple. One of the holiest sites in Buddhism and a UNESCO World Heritage Site.',
        'significance': 'The exact birthplace of Lord Buddha, making it one of the most sacred pilgrimage destinations in the world for Buddhists.',
        'era': '3rd century BCE (Ashoka pillar)',
        'tags': ['buddha', 'birthplace', 'UNESCO', 'pilgrimage', 'sacred'],
        'unesco_status': True,
        'longitude': 83.2758,
        'latitude': 27.4696,
    },
    {
        'name': 'Boudhanath Stupa',
        'category': 'buddhist',
        'location_name': 'Kathmandu, Bagmati Province',
        'description': 'One of the largest spherical stupas in Nepal and the holiest Tibetan Buddhist temple outside Tibet. A major pilgrimage site in Asia.',
        'significance': 'The largest stupa in Nepal and one of the largest in the world, Boudhanath is the center of Tibetan culture in Nepal.',
        'era': '14th century (rebuilt many times)',
        'tags': ['tibetan', 'buddhist', 'stupa', 'UNESCO', 'pilgrimage'],
        'unesco_status': True,
        'longitude': 85.3620,
        'latitude': 27.7215,
    },
    {
        'name': 'Changu Narayan Temple',
        'category': 'hindu_temple',
        'location_name': 'Bhaktapur District, Bagmati Province',
        'description': 'The oldest Hindu temple in Nepal, dedicated to Lord Vishnu. Located on a hilltop east of Kathmandu Valley, featuring remarkable stone, metal, and woodwork.',
        'significance': 'The oldest surviving temple in Nepal with some of the finest examples of Newari sculpture, including a 5th-century Vishnu image.',
        'era': '4th century CE',
        'tags': ['vishnu', 'hindu', 'UNESCO', 'ancient', 'sculpture'],
        'unesco_status': True,
        'longitude': 85.4194,
        'latitude': 27.7136,
    },
    {
        'name': 'Gorkha Durbar',
        'category': 'palace_fort',
        'location_name': 'Gorkha, Gandaki Province',
        'description': 'The ancestral palace of the Shah dynasty, perched high on a hill above Gorkha town. It was the seat of power from which Prithvi Narayan Shah unified Nepal.',
        'significance': 'The birthplace of Prithvi Narayan Shah and the symbol of the unification of Nepal. Contains the Gorakhnath Temple and palace complex.',
        'era': '16th century',
        'tags': ['Shah dynasty', 'palace', 'unification', 'historic', 'fort'],
        'unesco_status': False,
        'longitude': 84.6295,
        'latitude': 28.0012,
    },
    {
        'name': 'Janaki Mandir',
        'category': 'hindu_temple',
        'location_name': 'Janakpur, Madhesh Province',
        'description': 'A grand Hindu temple dedicated to Goddess Sita (Janaki), wife of Lord Ram. Built in the Mughal-Rajput style, it is one of the most important religious sites in the Terai.',
        'significance': 'Believed to be the birthplace of Goddess Sita, making it a major pilgrimage site for Hindus from Nepal and India.',
        'era': '1911 CE',
        'tags': ['sita', 'ram', 'hindu', 'temple', 'pilgrimage', 'Terai'],
        'unesco_status': False,
        'longitude': 85.9259,
        'latitude': 26.7305,
    },
    {
        'name': 'Muktinath Temple',
        'category': 'religious_site',
        'location_name': 'Mustang District, Gandaki Province',
        'description': 'A sacred temple at an altitude of 3,710m in the Himalayas, revered by both Hindus and Buddhists. Features 108 water spouts and an eternal flame fed by natural gas.',
        'significance': 'One of the most important pilgrimage sites in Hinduism and Buddhism, believed to be a place of moksha (liberation). The eternal flame is considered miraculous.',
        'era': 'Ancient (exact date unknown)',
        'tags': ['moksha', 'himalaya', 'pilgrimage', 'sacred', 'mustang', 'altitude'],
        'unesco_status': False,
        'longitude': 83.8718,
        'latitude': 28.8167,
    },
]


class Command(BaseCommand):
    help = 'Seed the database with sample Nepal heritage sites'

    def handle(self, *args, **options):
        created_count = 0
        existing_count = 0

        for site_data in SAMPLE_SITES:
            longitude = site_data.pop('longitude')
            latitude = site_data.pop('latitude')
            site_data['location'] = Point(longitude, latitude)

            site, created = Site.objects.get_or_create(
                name=site_data['name'],
                defaults=site_data,
            )

            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'  Created: {site.name}'))
            else:
                existing_count += 1
                self.stdout.write(f'  Already exists: {site.name}')

        self.stdout.write('')
        self.stdout.write(
            self.style.SUCCESS(
                f'Done! Created {created_count} new site(s), {existing_count} already existed.'
            )
        )
