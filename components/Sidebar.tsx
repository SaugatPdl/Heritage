
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeritageSite, SiteCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { 
  Search, 
  Map as MapIcon, 
  Building, 
  CircleDashed,
  Castle,
  Filter,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  sites: HeritageSite[];
  onSearch: (term: string) => void;
  onFilterToggle: (category: SiteCategory) => void;
  selectedCategories: SiteCategory[];
  activeSiteId: string | null;
  onSiteClick: (site: HeritageSite) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const getCategoryIcon = (category: SiteCategory) => {
  switch (category) {
    case SiteCategory.HINDU: return <Building size={18} />;
    case SiteCategory.BUDDHIST: return <CircleDashed size={18} />;
    case SiteCategory.PALACE: return <Castle size={18} />;
    default: return <MapIcon size={18} />;
  }
};

const Sidebar: React.FC<SidebarProps> = ({
  sites,
  onSearch,
  onFilterToggle,
  selectedCategories,
  activeSiteId,
  onSiteClick,
  isOpen,
  onToggle
}) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.aside 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 'auto', opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="w-80 md:w-96 h-full bg-white border-r border-gray-200 flex flex-col overflow-hidden z-[1002]"
        >
          {/* Search Header */}
          <div className="p-8 pb-4 flex items-center gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search heritage sites..."
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-red-50 outline-none transition-all placeholder:text-gray-400"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={onToggle}
              className="p-3 bg-gray-50 border border-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-lg"
              title="Close Sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-8 scroll-smooth">
            {/* Category Filters */}
            <section>
              <div className="flex items-center gap-2 mb-5">
                <Filter size={14} className="text-red-500" />
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Explore by Category</h3>
              </div>
              <div className="flex flex-col gap-3">
                {Object.values(SiteCategory).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onFilterToggle(cat)}
                    className={`flex items-center gap-5 p-5 transition-all border-2 rounded-xl ${
                      selectedCategories.includes(cat) 
                        ? 'bg-white border-red-600 shadow-xl ring-2 ring-red-50' 
                        : 'bg-gray-50/50 border-transparent hover:border-gray-200 opacity-80 grayscale hover:grayscale-0'
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center shrink-0 rounded-lg shadow-sm" style={{ backgroundColor: selectedCategories.includes(cat) ? CATEGORY_COLORS[cat] : '#f3f4f6', color: 'white' }}>
                      {getCategoryIcon(cat)}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">
                        {cat}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                        {sites.filter(s => s.categories.includes(cat)).length} Sites
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

        {/* Results List */}
        <section>
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2 z-10 border-b border-gray-100">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discovered Sites ({sites.length})</span>
          </div>
          
          <div className="space-y-3">
            {sites.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No sites found</p>
              </div>
            ) : (
              sites.map((site) => (
                <div 
                  key={site.id}
                  onClick={() => onSiteClick(site)}
                  className={`group relative p-5 cursor-pointer transition-all border ${
                    activeSiteId === site.id 
                    ? 'bg-gray-900 border-gray-900 text-white shadow-2xl translate-x-1' 
                    : 'bg-white border-gray-100 hover:border-red-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className={`font-black text-xs uppercase tracking-wider mb-1.5 ${activeSiteId === site.id ? 'text-white' : 'text-gray-900'}`}>
                        {site.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <MapIcon size={12} className={activeSiteId === site.id ? 'text-red-400' : 'text-red-500'} />
                        <span className={`text-[10px] font-bold uppercase tracking-tight ${activeSiteId === site.id ? 'text-gray-400' : 'text-gray-500'}`}>
                          {site.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {site.categories.slice(0, 1).map(c => (
                        <div key={c} className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[c] }} />
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </motion.aside>
  )}
</AnimatePresence>
  );
};

export default Sidebar;
