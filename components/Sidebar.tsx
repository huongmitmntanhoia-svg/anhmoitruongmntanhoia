
import React from 'react';
import { SchoolYear } from '../types';

interface SidebarProps {
  years: SchoolYear[];
  currentYearId: string;
  onYearSelect: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ years, currentYearId, onYearSelect, isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 w-72 bg-white border-r border-mint-200 z-50 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:w-64 md:flex
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8 md:hidden">
            <h2 className="text-lg font-black text-emerald-900">Năm học</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-emerald-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2 className="hidden md:block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Năm học</h2>
          
          <div className="space-y-2 overflow-y-auto flex-1 pr-2 -mr-2">
            {years.map(year => (
              <button
                key={year.id}
                onClick={() => onYearSelect(year.id)}
                className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-between group ${
                  currentYearId === year.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                  : 'text-gray-600 hover:bg-emerald-50'
                }`}
              >
                <span>{year.name}</span>
                {currentYearId === year.id && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-mint-100">
            <div className="bg-emerald-50 p-5 rounded-2xl text-emerald-800 text-xs leading-relaxed border border-emerald-100">
              <p className="font-black text-emerald-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Ghi chú
              </p>
              <p>Hình ảnh là minh chứng quan trọng cho công tác xây dựng môi trường giáo dục lấy trẻ làm trung tâm.</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
