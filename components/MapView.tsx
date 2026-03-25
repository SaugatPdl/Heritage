import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Cluster from 'ol/source/Cluster';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';
import Overlay from 'ol/Overlay';
import { createRoot } from 'react-dom/client';

import { HeritageSite, SiteCategory } from '../types';
import { DEFAULT_NEPAL_CENTER, DEFAULT_ZOOM, CATEGORY_COLORS, PROVINCE_CENTROIDS, DISTRICT_TO_PROVINCE } from '../constants';
import SiteDetailsPopup from './SiteDetailsPopup';

interface MapViewProps {
  sites: HeritageSite[];
  activeSite: HeritageSite | null;
  onSiteSelect: (site: HeritageSite) => void;
  mapType: 'osm' | 'light' | 'satellite';
  locateMe: number;
  resetViewTrigger: number;
  showNationalBoundary: boolean;
  showProvinceBoundary: boolean;
}

const MapView: React.FC<MapViewProps> = ({
  sites,
  activeSite,
  onSiteSelect,
  mapType,
  locateMe,
  resetViewTrigger,
  showNationalBoundary,
  showProvinceBoundary
}) => {

  const mapElement = useRef<HTMLDivElement>(null);
  const popupElement = useRef<HTMLDivElement>(null);

  const mapRef = useRef<Map | null>(null);
  const popupOverlayRef = useRef<Overlay | null>(null);
  const popupRootRef = useRef<any>(null);

  const vectorSourceRef = useRef<VectorSource | null>(null);
  const locationSourceRef = useRef<VectorSource | null>(null);
  const provinceSummarySourceRef = useRef<VectorSource | null>(null);
  const provinceLayerRef = useRef<VectorLayer<any> | null>(null);
  const countryBorderLayerRef = useRef<VectorLayer<any> | null>(null);
  const clusterLayerRef = useRef<VectorLayer<any> | null>(null);
  const provinceSummaryLayerRef = useRef<VectorLayer<any> | null>(null);

  const onSiteSelectRef = useRef(onSiteSelect);
  useEffect(() => { onSiteSelectRef.current = onSiteSelect; }, [onSiteSelect]);

  // ================= INIT MAP =================
  useEffect(() => {
    if (!mapElement.current) return;

    const vectorSource = new VectorSource();
    vectorSourceRef.current = vectorSource;

    const locationSource = new VectorSource();
    locationSourceRef.current = locationSource;

    const provinceSummarySource = new VectorSource();
    provinceSummarySourceRef.current = provinceSummarySource;

    const clusterSource = new Cluster({
      distance: 35,
      minDistance: 15,
      source: vectorSource,
    });

    const styleCache: any = {};

    const clusterLayer = new VectorLayer({
      source: clusterSource,
      zIndex: 10,
      visible: false, // Initially hidden, shown at higher zoom
      style: (feature) => {
        const features = feature.get('features');
        const size = features ? features.length : 0;

        if (size > 1) {
          let style = styleCache[size];
          if (!style) {
            style = new Style({
              image: new Circle({
                radius: 20,
                stroke: new Stroke({ color: '#fff', width: 3 }),
                fill: new Fill({ color: '#475569' }),
              }),
              text: new Text({
                text: size.toString(),
                fill: new Fill({ color: '#fff' }),
                font: 'bold 12px Inter, sans-serif',
              }) as any,
            });
            styleCache[size] = style;
          }
          return style;
        }

        if (size === 1) {
          const site: HeritageSite = features[0].get('site');
          const isBuddhist = site.categories.includes(SiteCategory.BUDDHIST);
          const color = isBuddhist
            ? CATEGORY_COLORS[SiteCategory.BUDDHIST]
            : CATEGORY_COLORS[site.categories[0]];

          return [
            new Style({
              image: new Circle({
                radius: 12,
                fill: new Fill({ color: 'rgba(0,0,0,0.2)' }),
              }),
            }),
            new Style({
              image: new Circle({
                radius: 10,
                fill: new Fill({ color: '#fff' }),
              }),
            }),
            new Style({
              image: new Circle({
                radius: 7,
                fill: new Fill({ color }),
              }),
            }),
          ];
        }

        return null;
      },
    });
    clusterLayerRef.current = clusterLayer;

    // ================= PROVINCE SUMMARY =================
    const provinceSummaryLayer = new VectorLayer({
      source: provinceSummarySource,
      zIndex: 20,
      visible: true, // Initially shown
      style: (feature) => {
        const count = feature.get('count');
        const name = feature.get('name');

        return [
          new Style({
            image: new Circle({
              radius: 25,
              fill: new Fill({ color: '#dc2626' }),
              stroke: new Stroke({ color: '#fff', width: 3 }),
            }),
            text: new Text({
              text: count.toString(),
              fill: new Fill({ color: '#fff' }),
              font: 'bold 16px Inter, sans-serif',
              offsetY: 0,
            }) as any,
          }),
          new Style({
            text: new Text({
              text: name.toUpperCase(),
              fill: new Fill({ color: '#1f2937' }),
              stroke: new Stroke({ color: '#fff', width: 2 }),
              font: 'bold 10px Inter, sans-serif',
              offsetY: 35,
              padding: [2, 4, 2, 4],
              backgroundFill: new Fill({ color: 'rgba(255,255,255,0.8)' }),
            }) as any,
          })
        ];
      },
    });
    provinceSummaryLayerRef.current = provinceSummaryLayer;

    // ================= LOCATION =================
    const locationLayer = new VectorLayer({
      source: locationSource,
      style: new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color: '#3b82f6' }),
          stroke: new Stroke({ color: '#fff', width: 3 }),
        }),
      }),
      zIndex: 100,
    });

    // ================= BASE MAP =================
    const baseLayer = new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      }),
    });

    // ================= PROVINCE BOUNDARY =================
    const provinceLayer = new VectorLayer({
      source: new VectorSource({
        url: '/data/province-boundary.geojson',
        format: new GeoJSON(),
      }),
      style: [
        new Style({
          stroke: new Stroke({
            color: 'rgba(255,255,255,0.6)',
            width: 3.5,
          }),
        }),
        new Style({
          stroke: new Stroke({
            color: 'rgba(0,0,0,0.4)',
            width: 1.2,
          }),
        }),
      ],
      zIndex: 4,
      visible: showProvinceBoundary,
    });
    provinceLayerRef.current = provinceLayer;

    // ================= COUNTRY BORDER =================
    const countryBorderLayer = new VectorLayer({
      source: new VectorSource({
        url: '/data/nepal-boundary.geojson',
        format: new GeoJSON(),
      }),
      style: [
        new Style({
          stroke: new Stroke({
            color: 'rgba(255,255,255,0.8)',
            width: 6,
          }),
        }),
        new Style({
          stroke: new Stroke({
            color: '#000000',
            width: 2.5,
          }),
        }),
      ],
      zIndex: 5,
      visible: showNationalBoundary,
    });
    countryBorderLayerRef.current = countryBorderLayer;

    // ================= POPUP =================
    const popupOverlay = new Overlay({
      element: popupElement.current!,
      autoPan: { animation: { duration: 300 }, margin: 100 },
      positioning: 'bottom-center',
    });

    popupOverlayRef.current = popupOverlay;

    // ================= MAP =================
    const map = new Map({
      target: mapElement.current,
      layers: [
        baseLayer,
        provinceLayer,
        countryBorderLayer,
        clusterLayer,
        provinceSummaryLayer,
        locationLayer
      ],
      view: new View({
        center: fromLonLat([
          DEFAULT_NEPAL_CENTER[1],
          DEFAULT_NEPAL_CENTER[0],
        ]),
        zoom: DEFAULT_ZOOM,
        minZoom: 5,
        maxZoom: 19,
      }),
      overlays: [popupOverlay],
    });

    mapRef.current = map;

    // ================= ZOOM LISTENER =================
    const handleZoom = () => {
      const zoom = map.getView().getZoom() || 0;
      const isLowZoom = zoom < 8.5;
      
      if (clusterLayerRef.current) clusterLayerRef.current.setVisible(!isLowZoom);
      if (provinceSummaryLayerRef.current) provinceSummaryLayerRef.current.setVisible(isLowZoom);
    };

    map.getView().on('change:resolution', handleZoom);
    handleZoom(); // Initial check

    // ================= CLICK =================
    map.on('click', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);

      if (feature) {
        const features = feature.get('features');
        const provinceName = feature.get('name');

        if (provinceName && !features) {
          // Clicked on a province summary
          const geometry = feature.getGeometry() as Point;
          map.getView().animate({
            center: geometry.getCoordinates(),
            zoom: 9,
            duration: 600,
          });
          return;
        }

        if (features && features.length === 1) {
          const site = features[0].get('site');
          onSiteSelectRef.current(site);
        } else if (features && features.length > 1) {
          const extent = feature.getGeometry()!.getExtent();
          map.getView().fit(extent, {
            duration: 600,
            padding: [80, 80, 80, 80],
          });
        }
      } else {
        popupOverlay.setPosition(undefined);
      }
    });

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // ================= LOAD SITES =================
  useEffect(() => {
    if (!vectorSourceRef.current) return;

    vectorSourceRef.current.clear();

    const features = sites.map((site) => {
      const f = new Feature({
        geometry: new Point(fromLonLat([site.longitude, site.latitude])),
      });
      f.set('site', site);
      return f;
    });

    vectorSourceRef.current.addFeatures(features);

    // Update province summaries
    if (provinceSummarySourceRef.current) {
      provinceSummarySourceRef.current.clear();
      
      const provinceCounts: Record<string, number> = {};
      sites.forEach(site => {
        const district = site.location.split(',')[0].trim();
        const province = DISTRICT_TO_PROVINCE[district] || 'Other';
        if (province !== 'Other') {
          provinceCounts[province] = (provinceCounts[province] || 0) + 1;
        }
      });

      const summaryFeatures = Object.entries(provinceCounts).map(([name, count]) => {
        const centroid = PROVINCE_CENTROIDS[name];
        const f = new Feature({
          geometry: new Point(fromLonLat([centroid[1], centroid[0]])),
        });
        f.set('name', name);
        f.set('count', count);
        return f;
      });

      provinceSummarySourceRef.current.addFeatures(summaryFeatures);
    }
  }, [sites]);

  // ================= BASE MAP SWITCH =================
  useEffect(() => {
    if (!mapRef.current) return;

    const baseLayer = mapRef.current.getLayers().item(0) as TileLayer<any>;

    let source;
    switch (mapType) {
      case 'satellite':
        source = new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        });
        break;
      case 'light':
        source = new XYZ({
          url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        });
        break;
      default:
        source = new OSM();
    }

    baseLayer.setSource(source);
  }, [mapType]);

  // ================= ACTIVE SITE POPUP =================
  useEffect(() => {
    if (!mapRef.current || !popupOverlayRef.current) return;

    if (activeSite) {
      const coord = fromLonLat([activeSite.longitude, activeSite.latitude]);
      
      if (!popupRootRef.current) {
        popupRootRef.current = createRoot(popupElement.current!);
      }
      
      popupRootRef.current.render(
        <SiteDetailsPopup site={activeSite} onClose={() => popupOverlayRef.current?.setPosition(undefined)} />
      );
      
      popupOverlayRef.current.setPosition(coord);
      mapRef.current.getView().animate({ center: coord, duration: 600 });
    } else {
      popupOverlayRef.current.setPosition(undefined);
    }
  }, [activeSite]);

  // ================= BOUNDARY TOGGLE =================
  useEffect(() => {
    if (provinceLayerRef.current) {
      provinceLayerRef.current.setVisible(showProvinceBoundary);
    }
  }, [showProvinceBoundary]);

  useEffect(() => {
    if (countryBorderLayerRef.current) {
      countryBorderLayerRef.current.setVisible(showNationalBoundary);
    }
  }, [showNationalBoundary]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapElement} className="w-full h-full" />
      <div ref={popupElement} className="ol-popup" />
    </div>
  );
};

export default MapView;