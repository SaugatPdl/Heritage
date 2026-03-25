import React, { useState, useEffect, useCallback } from 'react';
import { HeritageSite, SiteCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Clock, 
  History, 
  Boxes, 
  Heart, 
  Calendar, 
  BookOpen,
  Award,
  ExternalLink,
  Search
} from 'lucide-react';

interface SiteDetailsPopupProps {
  site: HeritageSite;
  onClose: () => void;
}

const SiteDetailsPopup: React.FC<SiteDetailsPopupProps> = ({ site, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [tab, setTab] = useState<'info' | '3d'>('info');

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setActiveImageIndex(null);
    document.body.style.overflow = 'unset';
  }, []);

  const nextImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev !== null ? (prev + 1) % site.images.length : null));
  }, [site.images.length]);

  const prevImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev !== null ? (prev - 1 + site.images.length) % site.images.length : null));
  }, [site.images.length]);

  // Keyboard support for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, closeLightbox, nextImage, prevImage]);

  return (
    <div className="w-[420px] max-h-[600px] overflow-y-auto bg-white shadow-2xl flex flex-col no-scrollbar">
      {/* Visual Header / Gallery */}
      <div className="relative h-60 bg-gray-100 shrink-0 group overflow-hidden">
        <div 
          className="relative w-full h-full cursor-pointer overflow-hidden"
          onClick={() => openLightbox(0)}
        >
          <img 
              src={site.images[0]} 
              alt={site.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <div className="bg-white/95 p-3 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <Maximize2 size={24} className="text-gray-900" />
             </div>
          </div>
        </div>
        
        {/* Thumbnails Overlay */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          {site.images.slice(1, 3).map((img, i) => (
            <button 
              key={i} 
              onClick={() => openLightbox(i + 1)}
              className="w-12 h-12 border-2 border-white shadow-lg overflow-hidden transition-all hover:scale-110 hover:border-red-600"
            >
              <img src={img} className="w-full h-full object-cover" />
            </button>
          ))}
          <button 
            onClick={() => openLightbox(0)}
            className="w-12 h-12 bg-black/60 backdrop-blur-md text-white flex items-center justify-center border-2 border-white shadow-lg hover:bg-red-600 transition-colors"
          >
            <Search size={16} />
          </button>
        </div>

        {site.unescoStatus && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-yellow-500 text-white px-3 py-1.5 shadow-xl">
            <Award size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">UNESCO World Heritage</span>
          </div>
        )}

        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 z-30 w-8 h-8 bg-white/90 backdrop-blur-sm text-gray-900 flex items-center justify-center rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all"
          title="Close Popup"
        >
          <X size={16} strokeWidth={3} />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-100 bg-white sticky top-0 z-20">
        <button 
          onClick={() => setTab('info')}
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-colors ${tab === 'info' ? 'border-b-2 border-red-600 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Site Profile
        </button>
        <button 
          onClick={() => setTab('3d')}
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-colors ${tab === '3d' ? 'border-b-2 border-red-600 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Interactive 3D
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-6">
        {tab === 'info' ? (
          <>
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-none mb-2 uppercase tracking-tight">{site.name}</h2>
              <div className="flex items-center gap-2 text-gray-400">
                <Boxes size={14} />
                <p className="text-[10px] font-bold uppercase tracking-widest">{site.location}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {site.categories.map(cat => (
                <span 
                  key={cat} 
                  className="px-2 py-1 text-[9px] font-black uppercase text-white tracking-wider"
                  style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                >
                  {cat}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-600 font-medium leading-relaxed border-l-4 border-red-500 pl-4 py-1">
              {site.significance}
            </p>

            <div className="grid grid-cols-1 gap-6 pt-4 border-t border-gray-50">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-red-600">
                  <History size={18} />
                  <h4 className="text-[11px] font-black uppercase tracking-widest">Historical Context</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{site.historicalBackground}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-red-600">
                  <Heart size={18} />
                  <h4 className="text-[11px] font-black uppercase tracking-widest">Cultural Significance</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{site.culturalImportance}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 border border-gray-100">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Boxes size={10} /> Architecture
                  </span>
                  <p className="text-[11px] font-bold text-gray-700">{site.architecture}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Clock size={10} /> Historical Era
                  </span>
                  <p className="text-[11px] font-bold text-gray-700">{site.era}</p>
                </div>
                <div className="space-y-1 col-span-2 mt-2">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Calendar size={10} /> Visitor Information
                  </span>
                  <p className="text-[11px] font-bold text-gray-700">{site.bestTime}</p>
                </div>
              </div>

              {site.legend && (
                <div className="p-4 bg-blue-50/50 border border-blue-100 flex gap-4">
                  <BookOpen size={20} className="text-blue-500 shrink-0" />
                  <div className="space-y-1">
                    <h5 className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Legends & Oral Traditions</h5>
                    <p className="text-xs text-blue-800 italic leading-relaxed">{site.legend}</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col gap-4">
             {(site.external3dUrl || site.sketchfabId) ? (
                <div className="space-y-4">
                   <div className="h-96 w-full relative group bg-black overflow-hidden shadow-2xl rounded-lg">
                      <iframe 
                        title={`${site.name} 3D Model`} 
                        className="w-full h-full border-none"
                        allow="autoplay; fullscreen; xr-spatial-tracking" 
                        src={site.external3dUrl || `https://sketchfab.com/models/${site.sketchfabId}/embed?autostart=1&ui_theme=dark`}
                      ></iframe>
                   </div>
                   <div className="p-4 bg-gray-900 border border-gray-800 text-white rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                         <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-red-500">Interactive 3D Twin</h4>
                         <a 
                           href={site.external3dUrl || `https://sketchfab.com/models/${site.sketchfabId}`} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-[9px] font-black text-white/60 uppercase flex items-center gap-1 hover:text-white transition-colors"
                         >
                           Open Link <ExternalLink size={10} />
                         </a>
                      </div>
                      <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                        Explore the high-fidelity 3D reconstruction of {site.name}. Use your mouse or touch to navigate the spatial data.
                      </p>
                   </div>
                </div>
             ) : (
                <div className="h-80 w-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 p-8 text-center rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 flex items-center justify-center mb-4 rounded-full">
                    <Boxes size={32} className="text-gray-400" />
                  </div>
                  <h4 className="text-sm font-black text-gray-700 uppercase mb-2">3D Capture in Progress</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed max-w-xs">
                    Digital twin processing is underway for this site.
                  </p>
                </div>
             )}
          </div>
        )}
      </div>

      {/* IMMERSIVE FACEBOOK-STYLE LIGHTBOX */}
      {activeImageIndex !== null && (
        <div 
          className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          {/* Close Button Top-Right (Large and clear) */}
          <button 
            className="absolute top-8 right-8 text-white/40 hover:text-white hover:bg-white/10 transition-all p-4 rounded-full z-[10002] active:scale-90"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
          >
            <X size={44} strokeWidth={1.5} />
          </button>
          
          {/* Main Visual Container - Takes max screen real estate */}
          <div 
            className="relative w-full h-full flex items-center justify-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button (Centered vertically) */}
            <button 
              onClick={prevImage}
              className="absolute left-8 w-20 h-20 bg-black/30 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-all group z-[10001] active:scale-90 backdrop-blur-md"
            >
              <ChevronLeft size={48} strokeWidth={1} />
            </button>
            
            {/* The Image Itself - Uses 100% of available viewport while maintaining aspect ratio */}
            <div className="w-full h-full flex items-center justify-center p-2 md:p-8">
               <img 
                 src={site.images[activeImageIndex]} 
                 alt={`${site.name} view`}
                 className="max-w-full max-h-full object-contain shadow-[0_0_100px_rgba(0,0,0,0.8)] transition-all duration-500 transform scale-100 group-hover:scale-[1.02]"
               />
            </div>

            {/* Next Button (Centered vertically) */}
            <button 
              onClick={nextImage}
              className="absolute right-8 w-20 h-20 bg-black/30 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-all group z-[10001] active:scale-90 backdrop-blur-md"
            >
              <ChevronRight size={48} strokeWidth={1} />
            </button>
          </div>

          {/* Immersive Footer - Minimalistic Metadata */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/40 to-transparent pt-32 pb-12 flex flex-col items-center">
             <div className="text-center px-6">
                <h3 className="text-white text-3xl font-black uppercase tracking-[0.2em] leading-tight drop-shadow-2xl">{site.name}</h3>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <div className="h-px w-12 bg-white/20"></div>
                  <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.4em]">
                    Heritage Site Capture • {activeImageIndex + 1} of {site.images.length}
                  </p>
                  <div className="h-px w-12 bg-white/20"></div>
                </div>
             </div>
             
             {/* Large Thumbnail Progress Dots */}
             <div className="flex gap-4 mt-10 p-3 bg-white/5 rounded-full backdrop-blur-lg">
               {site.images.map((_, i) => (
                 <button 
                  key={i} 
                  onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i); }}
                  className={`h-2 rounded-full transition-all duration-500 ${activeImageIndex === i ? 'w-20 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)]' : 'w-2 bg-white/20 hover:bg-white/50'}`}
                 />
               ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteDetailsPopup;