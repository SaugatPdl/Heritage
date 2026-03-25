
import L from 'leaflet';
import { HeritageSite, SiteCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';

const getCategoryIconPath = (category: SiteCategory): string => {
  switch (category) {
    case SiteCategory.HINDU: return '<path d="M12 2L4 7h16L12 2zM12 7l-7 5h14l-7-5zM12 12l-8 5h16l-8-5zM5 17v3h14v-3H5z"/>';
    case SiteCategory.BUDDHIST: return '<path d="M12 2c-1 0-2 1-2 2h4c0-1-1-2-2-2zM7 12c0-3 2-5 5-5s5 2 5 5v2H7v-2zM5 16h14v2H5v-2zM4 20h16v2H4v-2z"/>';
    case SiteCategory.PALACE: return '<path d="M3 21h18v-2h-1V9l-4-4-4 4v10H10V9L6 5 2 9v10H1V21z"/>';
    default: return '<path d="M12 2L2 22h20L12 2z"/>';
  }
};

export const createCustomIcon = (site: HeritageSite) => {
  const primaryCategory = site.categories[0];
  const color = CATEGORY_COLORS[primaryCategory] || '#1e3a8a';
  const iconSvgPath = getCategoryIconPath(primaryCategory);

  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; margin-top: -10px;">
      <div style="
        width: 36px; 
        height: 36px; 
        border-radius: 50%; 
        border: 2px solid white; 
        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        display: flex; 
        align-items: center; 
        justify-content: center; 
        background: ${color};
        z-index: 2;
        transition: transform 0.2s ease;
      ">
        <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; color: white;" fill="currentColor">
          ${iconSvgPath}
        </svg>
      </div>
      <div style="
        position: absolute; 
        bottom: 1px; 
        left: 50%; 
        transform: translateX(-50%) rotate(45deg); 
        width: 12px; 
        height: 12px; 
        background: ${color}; 
        border-right: 2px solid white;
        border-bottom: 2px solid white;
        z-index: 1;
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-heritage-marker-container',
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -40]
  });
};
