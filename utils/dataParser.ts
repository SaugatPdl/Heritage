import { HeritageSite, SiteCategory } from '../types';
import { RAW_CSV_DATA } from '../constants';

const SKETCHFAB_MAP: Record<string, string> = {
  'Pashupatinath Temple': 'd1dbd0e3109548f3a99ae4a2eca1493b',
  'Swayambhunath Stupa': '01121856758641498642233f274719d2',
  'Patan Durbar Square': '9f584e03038a499092446777c5c00e6c',
  'Mayadevi Temple': '6c589b2f677c442eb9753907f9c21b2f'
};

const EXTERNAL_3D_MAP: Record<string, string> = {
  'Patan Durbar Square': 'https://lcc-viewer.xgrids.com/pub/dbdxnc-asan_dabu',
  'Chilancho Stupa': 'https://lcc-viewer.xgrids.com/pub/dbdxnc-cilancho_hd'
};

export const parseHeritageData = (): HeritageSite[] => {
  const lines = RAW_CSV_DATA.split('\n');
  const validLines = lines.filter(line => line.trim().length > 0 && !line.startsWith('Site_Name'));
  
  return validLines.map((line, index) => {
    const values = line.split(',');
    const name = values[0];
    const typeStr = values[2] || '';
    
    const categories: SiteCategory[] = [];
    const normalizedType = typeStr.toLowerCase();
    const normalizedName = name.toLowerCase();
    
    if (normalizedType.includes('buddhist') || normalizedType.includes('stupa') || normalizedType.includes('monastery') || normalizedType.includes('bihar') || normalizedName.includes('stupa') || normalizedName.includes('monastery') || normalizedName.includes('lumbini') || normalizedName.includes('mayadevi')) {
      categories.push(SiteCategory.BUDDHIST);
    }
    
    if (normalizedType.includes('hindu') || normalizedType.includes('temple') || normalizedType.includes('mandir') || normalizedType.includes('deuti') || normalizedType.includes('shakti') || normalizedName.includes('mandir') || normalizedName.includes('pashupati')) {
      categories.push(SiteCategory.HINDU);
    }
    
    if (normalizedType.includes('palace') || normalizedType.includes('fort') || normalizedType.includes('durbar') || normalizedType.includes('rajya') || normalizedType.includes('gadhi') || normalizedType.includes('museum') || normalizedType.includes('archaeological')) {
      categories.push(SiteCategory.PALACE);
    }

    // Fallback logic for sites that might have been missed
    if (categories.length === 0) {
      if (normalizedName.includes('temple') || normalizedName.includes('mandir') || normalizedName.includes('shrine')) {
        categories.push(SiteCategory.HINDU);
      } else if (normalizedName.includes('stupa') || normalizedName.includes('monastery')) {
        categories.push(SiteCategory.BUDDHIST);
      } else {
        categories.push(SiteCategory.PALACE);
      }
    }

    return {
      id: `site-${index}`,
      name,
      location: `${values[1]}, Nepal`,
      type: typeStr,
      latitude: parseFloat(values[3]),
      longitude: parseFloat(values[4]),
      significance: values[5],
      // Requesting larger images from the source to ensure they look sharp in the 'Facebook-style' lightbox
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(name)}-1/1600/1000`,
      images: [
        `https://picsum.photos/seed/${encodeURIComponent(name)}-1/1600/1000`,
        `https://picsum.photos/seed/${encodeURIComponent(name)}-2/1600/1000`,
        `https://picsum.photos/seed/${encodeURIComponent(name)}-3/1600/1000`
      ],
      historicalBackground: `Historical records indicate that ${name} has been a site of great importance for centuries, serving as a hub for art, spirituality, and culture in its region.`,
      culturalImportance: `This site represents the deep-rooted spiritual fabric of Nepal, drawing pilgrims and students of history from across the globe.`,
      architecture: index % 2 === 0 ? 'Traditional Newari Architecture with stone and wood masonry' : 'Sacred Religious Architecture with distinct cultural influence',
      era: 'Medieval to Contemporary',
      unescoStatus: normalizedType.includes('unesco'),
      bestTime: 'Post-monsoon season (Oct-Mar)',
      legend: 'Local oral traditions tell stories of divine manifestations that blessed this sacred location.',
      sketchfabId: SKETCHFAB_MAP[name] || undefined,
      external3dUrl: EXTERNAL_3D_MAP[name] || undefined,
      categories
    };
  });
};