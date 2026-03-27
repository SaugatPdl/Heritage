# Heritage Sites of Nepal — GeoDjango + PostGIS

An interactive full-stack web application for exploring Nepal's ancient temples, stupas, palaces, and UNESCO World Heritage Sites. The backend is powered by **Django + GeoDjango + PostGIS** serving a GeoJSON REST API; the frontend is a **React + Vite** SPA with a Leaflet map, and the Django backend also serves a standalone map page at `/`.

---

## Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Backend   | Django 4.2, GeoDjango, Django REST Framework |
| Geo       | PostGIS 3.3, GDAL, GEOS, PROJ               |
| Database  | PostgreSQL 15 + PostGIS                     |
| Frontend  | React 18, Vite, Leaflet                     |
| Container | Docker, Docker Compose                      |

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/) (recommended)
- **OR** Python 3.11+, PostgreSQL 15 with PostGIS, GDAL installed locally
- Node.js 20+ (optional — only needed for the React frontend dev server)

---

## Quick Start (Docker — one command)

```bash
docker-compose up --build
```

This will:
1. Start a PostGIS database
2. Run Django migrations
3. Seed 10 sample Nepal heritage sites
4. Start the Django dev server on port 8000
5. Start the Vite frontend dev server on port 5173

**Access the app:**

| URL | Description |
|-----|-------------|
| http://localhost:8000 | Django map page (standalone, no Node required) |
| http://localhost:8000/map/ | Same map page |
| http://localhost:8000/admin/ | Django admin |
| http://localhost:8000/api/sites/ | REST API (GeoJSON) |
| http://localhost:5173 | React + Vite frontend |

---

## Manual Setup (without Docker)

### 1. Database

Install PostgreSQL 15 + PostGIS and create a database:

```sql
CREATE USER heritage_user WITH PASSWORD 'heritage_pass';
CREATE DATABASE heritage_db OWNER heritage_user;
\c heritage_db
CREATE EXTENSION postgis;
```

### 2. Environment

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Run Migrations

```bash
python manage.py migrate
```

### 5. Load Seed Data

```bash
python manage.py seed_sites
```

### 6. Create a Superuser (optional, for admin access)

```bash
python manage.py createsuperuser
```

### 7. Start the Backend

```bash
python manage.py runserver
```

### 8. Start the Frontend (optional)

```bash
# From the repo root
npm install
npm run dev
```

---

## API Reference

The API returns **GeoJSON FeatureCollection** responses.

### List all sites

```bash
curl http://localhost:8000/api/sites/
```

### Filter by category

```bash
curl "http://localhost:8000/api/sites/?category=buddhist"
```

Available categories: `hindu_temple`, `buddhist`, `palace_fort`, `archaeological`, `unesco`, `natural_religious`, `religious_site`, `other`

### Filter by bounding box

```bash
curl "http://localhost:8000/api/sites/?bbox=83.0,27.0,86.0,28.5"
```

Format: `min_lon,min_lat,max_lon,max_lat`

### Get a single site

```bash
curl http://localhost:8000/api/sites/1/
```

### Create a site (requires authentication)

```bash
curl -X POST http://localhost:8000/api/sites/ \
  -H "Content-Type: application/json" \
  -u admin:password \
  -d '{
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [85.3240, 27.7172] },
    "properties": {
      "name": "Kathmandu Durbar Square",
      "category": "palace_fort",
      "location_name": "Kathmandu, Bagmati Province",
      "description": "Historic royal palace complex in the heart of Kathmandu.",
      "unesco_status": true
    }
  }'
```

### Update a site

```bash
curl -X PATCH http://localhost:8000/api/sites/1/ \
  -H "Content-Type: application/json" \
  -u admin:password \
  -d '{"type":"Feature","geometry":{"type":"Point","coordinates":[85.3486,27.7104]},"properties":{"description":"Updated description."}}'
```

---

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable       | Default                                      | Description               |
|----------------|----------------------------------------------|---------------------------|
| `SECRET_KEY`   | `django-insecure-dev-key-change-in-production` | Django secret key        |
| `DEBUG`        | `True`                                       | Debug mode                |
| `ALLOWED_HOSTS`| `localhost,127.0.0.1,0.0.0.0`               | Comma-separated hostnames |
| `DB_NAME`      | `heritage_db`                                | Database name             |
| `DB_USER`      | `heritage_user`                              | Database user             |
| `DB_PASSWORD`  | `heritage_pass`                              | Database password         |
| `DB_HOST`      | `localhost`                                  | Database host             |
| `DB_PORT`      | `5432`                                       | Database port             |

---

## Project Structure

```
Heritage/
├── backend/
│   ├── Dockerfile
│   ├── manage.py
│   ├── requirements.txt
│   ├── templates/
│   │   └── map.html              # Standalone Leaflet map page
│   ├── heritage_project/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── sites/
│       ├── models.py             # GeoDjango Site model (PointField)
│       ├── serializers.py        # GeoFeatureModelSerializer
│       ├── views.py              # ModelViewSet
│       ├── urls.py               # Router URLs
│       ├── filters.py            # Category + bbox filters
│       ├── admin.py              # GISModelAdmin
│       ├── migrations/
│       └── management/commands/
│           └── seed_sites.py     # Load sample data
├── src/                          # React frontend source
├── docker-compose.yml
├── vite.config.ts
└── .env.example
```
