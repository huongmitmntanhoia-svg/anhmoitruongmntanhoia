
import React, { useState } from 'react';
import { Class, Photo, GradeId } from '../types';
import { GRADES } from '../constants';
import PhotoGallery from './PhotoGallery';

interface ExploreViewProps {
  currentYearId: string;
  allClasses: Class[];
  photos: Photo[];
}

const ExploreView: React.FC<ExploreViewProps> = ({ currentYearId, allClasses, photos }) => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const grades = GRADES(currentYearId);

  const selectedClass = allClasses.find(c => c.id === selectedClassId);
  const classPhotos = photos.filter(p => p.classId === selectedClassId && p.yearId === currentYearId);

  if (selectedClassId && selectedClass) {
    return (
      <div className="animate-fade-in">
        <button 
          onClick={() => setSelectedClassId(null)}
          className="mb-6 flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Quay lại danh sách lớp
        </button>
        
        <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-8 mb-8">
          <h2 className="text-3xl font-bold text-emerald-900 mb-2">Lớp {selectedClass.name}</h2>
          <p className="text-emerald-600 font-medium">Năm học: {currentYearId} • {classPhotos.length} hình ảnh</p>
        </div>

        <PhotoGallery photos={classPhotos} />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl font-bold text-emerald-900 mb-4">Khám phá môi trường lớp học</h2>
        <p className="text-gray-600">Chọn một lớp bên dưới để xem chi tiết các góc học tập, xây dựng và trang trí môi trường giáo dục.</p>
      </header>

      {grades.map(grade => {
        const gradeClasses = allClasses.filter(c => c.gradeId === grade.id);
        return (
          <section key={grade.id} className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-bold text-emerald-800 whitespace-nowrap">{grade.name}</h3>
              <div className="h-px bg-mint-200 w-full"></div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {gradeClasses.map(cls => {
                const count = photos.filter(p => p.classId === cls.id && p.yearId === currentYearId).length;
                const hasPhotos = count > 0;
                
                return (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`group relative p-6 rounded-2xl border transition-all hover:shadow-lg text-center ${
                      hasPhotos 
                        ? 'bg-white border-emerald-200 hover:border-emerald-400' 
                        : 'bg-emerald-50/50 border-dashed border-emerald-200 hover:bg-emerald-50'
                    }`}
                  >
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                      hasPhotos ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <span className="block font-bold text-emerald-900 text-lg">Lớp {cls.name}</span>
                    <span className={`text-xs mt-1 block ${hasPhotos ? 'text-emerald-600 font-medium' : 'text-gray-400 italic'}`}>
                      {hasPhotos ? `${count} ảnh` : 'Chưa có ảnh'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ExploreView;
