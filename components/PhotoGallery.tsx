
import React, { useState } from 'react';
import { Photo } from '../types';

interface PhotoGalleryProps {
  photos: Photo[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);

  if (photos.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-emerald-200 p-20 text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <h4 className="text-emerald-900 font-bold text-lg">Chưa có hình ảnh</h4>
        <p className="text-gray-500">Giáo viên lớp này chưa cập nhật hình ảnh môi trường giáo dục.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map(photo => (
          <div 
            key={photo.id}
            onClick={() => setActivePhoto(photo)}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-emerald-100 cursor-pointer transform transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={photo.url} 
                alt={photo.description}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-bold text-sm bg-emerald-500/80 px-2 py-1 rounded backdrop-blur-sm">Xem chi tiết</span>
              </div>
            </div>
            <div className="p-4 bg-white">
              <p className="text-emerald-900 font-bold line-clamp-1">{photo.description}</p>
              <p className="text-gray-400 text-[10px] font-bold uppercase mt-1">
                {new Date(photo.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/90 backdrop-blur-md animate-fade-in"
          onClick={() => setActivePhoto(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-emerald-400 transition-colors"
            onClick={() => setActivePhoto(null)}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div className="max-w-5xl w-full flex flex-col items-center gap-6" onClick={e => e.stopPropagation()}>
            <img 
              src={activePhoto.url} 
              alt={activePhoto.description} 
              className="max-h-[75vh] w-auto rounded-3xl shadow-2xl border-4 border-white/10 object-contain"
            />
            <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl text-center border border-white/20 max-w-2xl">
              <h3 className="text-2xl font-bold text-white mb-1">{activePhoto.description}</h3>
              <p className="text-emerald-200 text-sm font-medium">Năm học: {activePhoto.yearId}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGallery;
