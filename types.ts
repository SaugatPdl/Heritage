export enum SiteCategory {
  HINDU = 'Hindu Temple',
  BUDDHIST = 'Buddhist',
  PALACE = 'Palace/Fort'
}

export interface HeritageSite {
  id: string;
  name: string;
  location: string;
  type: string;
  latitude: number;
  longitude: number;
  significance: string;
  imageUrl: string;
  images: string[];
  historicalBackground: string;
  culturalImportance: string;
  architecture: string;
  era: string;
  unescoStatus: boolean;
  bestTime: string;
  legend?: string;
  sketchfabId?: string;
  external3dUrl?: string;
  categories: SiteCategory[];
}

export interface MapSettings {
  center: [number, number];
  zoom: number;
  tileLayer: string;
}