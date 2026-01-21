
import React, { useState, useMemo } from 'react';
import { Class, Photo, GradeId } from '../types';
import { GRADES } from '../constants';

interface StatisticsViewProps {
  currentYearId: string;
  allClasses: Class[];
  photos: Photo[];
}

type FilterStatus = 'all' | 'uploaded' | 'missing';

const StatisticsView: React.FC<StatisticsViewProps> = ({ currentYearId, allClasses, photos }) => {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const grades = GRADES(currentYearId);

  const statsByClass = useMemo(() => {
    return allClasses.map(cls => {
      const classPhotos = photos.filter(p => p.classId === cls.id && p.yearId === currentYearId);
      return {
        ...cls,
        count: classPhotos.length,
        hasPhotos: classPhotos.length > 0
      };
    });
  }, [allClasses, photos, currentYearId]);

  const totalClasses = statsByClass.length;
  const classesWithPhotos = statsByClass.filter(s => s.hasPhotos).length;
  const percentage = totalClasses > 0 ? Math.round((classesWithPhotos / totalClasses) * 100) : 0;

  const filteredStats = statsByClass.filter(s => {
    if (filter === 'uploaded') return s.hasPhotos;
    if (filter === 'missing') return !s.hasPhotos;
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-emerald-50" />
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * percentage) / 100} className="text-emerald-500 transition-all duration-1000 ease-out" strokeLinecap="round" />
          </svg>
          <span className="absolute text-2xl font-black text-emerald-900">{percentage}%</span>
        </div>
        
        <div className="flex-1 space-y-2">
          <h2 className="text-3xl font-bold text-emerald-900">Tiến độ cập nhật hình ảnh</h2>
          <p className="text-gray-600">Năm học {currentYearId}</p>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
              <span className="block text-xs text-emerald-600 font-bold uppercase">Tổng số lớp</span>
              <span className="text-xl font-bold text-emerald-900">{totalClasses}</span>
            </div>
            <div className="bg-mint-100 px-4 py-2 rounded-xl border border-mint-200">
              <span className="block text-xs text-mint-800 font-bold uppercase">Đã đăng</span>
              <span className="text-xl font-bold text-mint-800">{classesWithPhotos}</span>
            </div>
            <div className="bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
              <span className="block text-xs text-rose-600 font-bold uppercase">Chưa đăng</span>
              <span className="text-xl font-bold text-rose-900">{totalClasses - classesWithPhotos}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
           <button 
             onClick={() => window.print()}
             className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
             Xuất báo cáo
           </button>
        </div>
      </header>

      <div className="flex items-center gap-2 bg-white p-1 rounded-xl w-fit border border-mint-200 shadow-sm">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-500 hover:bg-emerald-50'}`}
        >
          Tất cả
        </button>
        <button 
          onClick={() => setFilter('uploaded')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'uploaded' ? 'bg-mint-100 text-mint-800 shadow-sm' : 'text-gray-500 hover:bg-emerald-50'}`}
        >
          Đã đăng
        </button>
        <button 
          onClick={() => setFilter('missing')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'missing' ? 'bg-rose-100 text-rose-800 shadow-sm' : 'text-gray-500 hover:bg-emerald-50'}`}
        >
          Chưa đăng
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStats.map(stat => (
          <div 
            key={stat.id} 
            className={`p-5 rounded-2xl border transition-all ${
              stat.hasPhotos 
                ? 'bg-mint-100 border-mint-200' 
                : 'bg-rose-50 border-rose-100'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-black text-xl text-gray-800">Lớp {stat.name}</h4>
              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${
                stat.hasPhotos ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                {stat.hasPhotos ? 'Hoàn thành' : 'Thiếu ảnh'}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              {grades.find(g => g.id === stat.gradeId)?.name}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">
                {stat.hasPhotos ? `${stat.count} ảnh đã đăng` : 'Chưa cập nhật'}
              </span>
              {stat.hasPhotos && (
                <div className="flex -space-x-2">
                   {[1,2,3].slice(0, Math.min(stat.count, 3)).map(i => (
                     <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-emerald-200"></div>
                   ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsView;
