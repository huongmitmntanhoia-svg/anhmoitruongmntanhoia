
import React from 'react';
import { ViewMode, SchoolYear } from '../types';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currentYear: SchoolYear;
  onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ viewMode, setViewMode, currentYear, onMenuToggle }) => {
  return (
    <header className="bg-white border-b border-mint-200 sticky top-0 z-30 shadow-sm px-4 md:px-6 py-3 md:py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={onMenuToggle}
            className="p-2 -ml-2 md:hidden text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl">
            M
          </div>
          <div className="overflow-hidden">
            <h1 className="text-base md:text-xl font-bold text-emerald-900 leading-tight truncate">Mầm Non Xanh</h1>
            <p className="text-[10px] md:text-xs text-emerald-600 font-medium">Quản lý môi trường</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] md:text-sm font-semibold text-emerald-800 bg-emerald-50 px-2 md:px-3 py-1 rounded-full border border-emerald-100">
            {currentYear.id}
          </span>
        </div>
      </div>

      <div className="flex items-center bg-mint-100 p-1 rounded-xl w-full md:w-fit self-center">
        <button 
          onClick={() => setViewMode(ViewMode.EXPLORE)}
          className={`flex-1 md:flex-none px-3 md:px-6 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${viewMode === ViewMode.EXPLORE ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-600 hover:bg-emerald-50'}`}
        >
          Khám phá
        </button>
        <button 
          onClick={() => setViewMode(ViewMode.STATISTICS)}
          className={`flex-1 md:flex-none px-3 md:px-6 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${viewMode === ViewMode.STATISTICS ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-600 hover:bg-emerald-50'}`}
        >
          Thống kê
        </button>
        <button 
          onClick={() => setViewMode(ViewMode.ADMIN)}
          className={`flex-1 md:flex-none px-3 md:px-6 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${viewMode === ViewMode.ADMIN ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-600 hover:bg-emerald-50'}`}
        >
          Quản trị
        </button>
      </div>
    </header>
  );
};

export default Navbar;
