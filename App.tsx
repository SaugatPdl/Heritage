import React, { useState, useMemo, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import { HeritageSite, SiteCategory } from './types';
import { parseHeritageData } from './utils/dataParser';
import { Layers, Home, Map as MapIcon, ChevronDown, Navigation, ArrowRight, Menu } from 'lucide-react';

const App: React.FC = () => {
  const allSites = useMemo(() => parseHeritageData(), []);
  
  const [showMap, setShowMap] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<SiteCategory[]>(Object.values(SiteCategory));
  const [activeSite, setActiveSite] = useState<HeritageSite | null>(null);
  const [mapType, setMapType] = useState<'osm' | 'light' | 'satellite'>('light');
  const [showLayerSelect, setShowLayerSelect] = useState(false);
  const [showNationalBoundary, setShowNationalBoundary] = useState(true);
  const [showProvinceBoundary, setShowProvinceBoundary] = useState(true);
  const [locateMe, setLocateMe] = useState(0);
  const [resetViewTrigger, setResetViewTrigger] = useState(0);

  const filteredSites = useMemo(() => {
    return allSites.filter(site => {
      const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           site.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = site.categories.some(cat => selectedCategories.includes(cat));
      return matchesSearch && matchesCategory;
    });
  }, [allSites, searchTerm, selectedCategories]);

  const handleFilterToggle = useCallback((category: SiteCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  }, []);

  const handleSiteSelect = useCallback((site: HeritageSite) => {
    setActiveSite(site);
  }, []);

  const handleReset = useCallback(() => {
    setActiveSite(null);
    setSearchTerm('');
    setSelectedCategories(Object.values(SiteCategory));
  }, []);

  const layers = [
    { id: 'light', label: 'Light Canvas' },
    { id: 'osm', label: 'Street Map' },
    { id: 'satellite', label: 'Satellite View' }
  ];

  if (!showMap) {
    return (
      <div className="h-screen w-screen relative overflow-hidden bg-gray-900 flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30"
            alt="Heritage Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/80 to-gray-900"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
           <div className="mb-12 group cursor-default">
              {/* --- SPLASH LOGO: Increased size and refined zoom effect --- */}
              <div className="w-[420px] h-80 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                <img 
                  src="./logo1.png" 
                  alt="Mappers Nepal Logo" 
                  className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.15)]"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const parent = target.parentElement;
                    if (parent) {
                      target.style.display = 'none';
                      const label = document.createElement('span');
                      label.className = "text-6xl font-black text-white leading-none text-center tracking-tighter uppercase";
                      label.innerHTML = "MAPPERS<br/><span class='text-red-600'>NEPAL</span>";
                      parent.appendChild(label);
                    }
                  }}
                />
              </div>
           </div>
           
           <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">
             Heritage Mapping <br/> <span className="text-red-600">in Nepal</span>
           </h1>
           
           <p className="text-gray-400 text-lg md:text-xl font-medium tracking-[0.2em] uppercase mb-12 max-w-2xl leading-relaxed">
             A Digital WebGIS Journey by Mappers Nepal
           </p>

           <button 
             onClick={() => setShowMap(true)}
             className="group relative flex items-center gap-4 bg-red-600 text-white px-14 py-6 text-sm font-black uppercase tracking-[0.4em] transition-all hover:bg-white hover:text-gray-900 shadow-[0_20px_50px_rgba(220,38,38,0.3)] hover:shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
           >
             Launch Experience
             <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
           </button>
           
           <div className="mt-20 border-t border-white/10 pt-8 w-full">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.6em]">Digital Heritage Project &copy; 2024</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-white overflow-hidden">
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 z-[1001]">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className={`p-3 rounded-lg transition-all ${isSidebarOpen ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            <Menu size={22} strokeWidth={2.5} />
          </button>
          
          {/* --- HEADER LOGO: Increased size by 5% --- */}
          <button 
            onClick={() => setShowMap(false)} 
            className="h-[50px] flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
            title="Return to Splash Screen"
          >
            <img 
              src="./logo2.png" 
              alt="Mappers Nepal Logo" 
              className="h-full w-auto object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                const parent = target.parentElement;
                if (parent) {
                  target.style.display = 'none';
                  const label = document.createElement('span');
                  label.className = "text-xl font-black text-red-600 tracking-tighter";
                  label.innerHTML = "MAPPERS NEPAL";
                  parent.appendChild(label);
                }
              }}
            />
          </button>
          
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Heritage Mapping Nepal</h1>
            <div className="h-4 w-px bg-gray-200 hidden md:block" />
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-[0.4em] hidden md:block">Interactive WebGIS</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
            <button 
              onClick={() => setLocateMe(prev => prev + 1)}
              className="h-9 px-4 bg-gray-50 border border-gray-100 flex items-center gap-2 hover:bg-red-50 hover:border-red-200 transition-all text-gray-600 hover:text-red-600"
              title="Find my location"
            >
              <Navigation size={14} />
              <span className="text-[8px] font-black uppercase tracking-widest hidden lg:block">Locate</span>
            </button>
            <button 
              onClick={() => setResetViewTrigger(prev => prev + 1)}
              className="h-9 px-4 bg-gray-50 border border-gray-100 flex items-center gap-2 hover:bg-red-50 hover:border-red-200 transition-all text-gray-600 hover:text-red-600"
              title="Reset zoom to full Nepal view"
            >
              <MapIcon size={14} />
              <span className="text-[8px] font-black uppercase tracking-widest hidden lg:block">Full View</span>
            </button>
            <button 
              onClick={handleReset}
              className="h-9 px-4 bg-gray-50 border border-gray-100 flex items-center gap-2 hover:bg-red-50 hover:border-red-200 transition-all text-gray-600 hover:text-red-600"
              title="Reset view to whole Nepal"
            >
              <Home size={14} />
              <span className="text-[8px] font-black uppercase tracking-widest hidden lg:block">Reset Map</span>
            </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar 
          sites={filteredSites}
          onSearch={setSearchTerm}
          onFilterToggle={handleFilterToggle}
          selectedCategories={selectedCategories}
          activeSiteId={activeSite?.id || null}
          onSiteClick={handleSiteSelect}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 relative bg-gray-50 overflow-hidden">
          <div className="absolute top-4 right-4 z-[1000]">
            <div className="relative">
              <button 
                onClick={() => setShowLayerSelect(!showLayerSelect)}
                className={`flex items-center justify-between gap-3 h-10 min-w-[180px] px-4 bg-white shadow-xl border border-gray-200 transition-all ${showLayerSelect ? 'border-red-600' : ''}`}
              >
                <div className="flex items-center gap-2">
                   <Layers size={14} className="text-gray-400" />
                   <span className="text-[8px] font-black text-gray-800 uppercase tracking-widest">
                     {layers.find(l => l.id === mapType)?.label}
                   </span>
                </div>
                <ChevronDown size={10} className={`text-gray-400 transition-transform ${showLayerSelect ? 'rotate-180' : ''}`} />
              </button>
              
              {showLayerSelect && (
                <div className="absolute right-0 mt-1 w-full bg-white shadow-2xl border border-gray-100 py-1">
                  {layers.map(layer => (
                    <button
                      key={layer.id}
                      onClick={() => { setMapType(layer.id as any); setShowLayerSelect(false); }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex flex-col border-l-4 transition-colors ${mapType === layer.id ? 'bg-red-50 border-red-600' : 'border-transparent'}`}
                    >
                      <span className={`text-[8px] font-black uppercase tracking-wider ${mapType === layer.id ? 'text-red-600' : 'text-gray-700'}`}>
                        {layer.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 bg-white shadow-xl border border-gray-200 p-4 min-w-[180px]">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-50">
                <MapIcon size={12} className="text-red-600" />
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Map Boundaries</p>
              </div>
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${showNationalBoundary ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    National
                  </span>
                  <div 
                    onClick={() => setShowNationalBoundary(!showNationalBoundary)}
                    className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${showNationalBoundary ? 'bg-red-600' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${showNationalBoundary ? 'left-[18px]' : 'left-0.5'}`} />
                  </div>
                </label>
                
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${showProvinceBoundary ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    Provinces
                  </span>
                  <div 
                    onClick={() => setShowProvinceBoundary(!showProvinceBoundary)}
                    className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${showProvinceBoundary ? 'bg-red-600' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${showProvinceBoundary ? 'left-[18px]' : 'left-0.5'}`} />
                  </div>
                </label>
              </div>
            </div>
          </div>

          <MapView 
            sites={filteredSites} 
            activeSite={activeSite}
            onSiteSelect={handleSiteSelect}
            mapType={mapType}
            locateMe={locateMe}
            resetViewTrigger={resetViewTrigger}
            showNationalBoundary={showNationalBoundary}
            showProvinceBoundary={showProvinceBoundary}
          />
        </main>
      </div>
    </div>
  );
};

export default App;