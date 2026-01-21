
import React, { useState, useCallback } from 'react';
import { Class, Photo } from '../types';

// CẤU HÌNH CLOUDINARY (Người dùng có thể thay thế bằng key của mình)
const CLOUDINARY_CLOUD_NAME = "demo"; // Thay "demo" bằng Cloud Name của bạn
const CLOUDINARY_UPLOAD_PRESET = "ml_default"; // Thay bằng Unsigned Upload Preset của bạn

interface AdminPanelProps {
  currentYearId: string;
  allClasses: Class[];
  photos: Photo[];
  onAddPhoto: (photo: Omit<Photo, 'id' | 'createdAt'>) => void;
  onDeletePhoto: (id: string) => void;
}

interface PendingImage {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentYearId, allClasses, photos, onAddPhoto, onDeletePhoto }) => {
  const [selectedClassId, setSelectedClassId] = useState(allClasses[0]?.id || '');
  const [description, setDescription] = useState('');
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Fix: Explicitly type the mapped element as File to resolve unknown type issues and satisfy URL.createObjectURL requirements
    const newPending: PendingImage[] = Array.from(files).map((file: File) => ({
      id: Math.random().toString(36).substr(2, 9),
      file: file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
      progress: 0
    }));

    setPendingImages(prev => [...prev, ...newPending]);
    e.target.value = ''; // Reset input
  };

  const removePendingImage = (id: string) => {
    setPendingImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const target = prev.find(img => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return filtered;
    });
  };

  const uploadToCloudinary = async (pendingImg: PendingImage): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', pendingImg.file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `mamnon_xanh/${currentYearId}/${selectedClassId}`);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary Error:', error);
      return null;
    }
  };

  const handleSaveAll = async () => {
    if (pendingImages.length === 0 || !selectedClassId) return;

    setIsProcessing(true);
    let successCount = 0;

    const updatedPending = [...pendingImages];

    for (let i = 0; i < updatedPending.length; i++) {
      const img = updatedPending[i];
      if (img.status === 'success') continue;

      // Cập nhật trạng thái đang tải
      setPendingImages(prev => prev.map(p => p.id === img.id ? { ...p, status: 'uploading' } : p));

      const uploadedUrl = await uploadToCloudinary(img);

      if (uploadedUrl) {
        onAddPhoto({
          classId: selectedClassId,
          yearId: currentYearId,
          url: uploadedUrl,
          description: description || 'Ảnh môi trường lớp học'
        });
        
        setPendingImages(prev => prev.map(p => p.id === img.id ? { ...p, status: 'success' } : p));
        successCount++;
      } else {
        setPendingImages(prev => prev.map(p => p.id === img.id ? { ...p, status: 'error' } : p));
      }
    }

    setIsProcessing(false);
    if (successCount > 0) {
      setDescription('');
      // Xóa các ảnh đã thành công khỏi danh sách chờ sau 2 giây
      setTimeout(() => {
        setPendingImages(prev => prev.filter(p => p.status !== 'success'));
      }, 2000);
      alert(`Đã tải lên thành công ${successCount} ảnh lên Cloudinary!`);
    }
  };

  const yearPhotos = photos.filter(p => p.yearId === currentYearId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 animate-fade-in pb-20">
      <div className="lg:col-span-1 space-y-6 md:space-y-8">
        <section className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-6 md:p-8 sticky top-24">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl md:text-2xl font-black text-emerald-900">Tải lên Cloudinary</h3>
            <div className="flex gap-1">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-75"></div>
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150"></div>
            </div>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Lớp học tiếp nhận</label>
              <select 
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                disabled={isProcessing}
                className="w-full bg-emerald-50 border border-mint-200 rounded-2xl px-4 py-4 text-emerald-900 font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all appearance-none disabled:opacity-50"
              >
                {allClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Mô tả chủ đề (Góc học tập...)</label>
              <input 
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isProcessing}
                placeholder="Nhập mô tả cho loạt ảnh này..."
                className="w-full bg-emerald-50 border border-mint-200 rounded-2xl px-4 py-4 text-emerald-900 font-medium focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Chọn ảnh từ thiết bị</label>
              <label className={`mt-1 flex flex-col items-center justify-center px-6 py-8 border-2 border-mint-200 border-dashed rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 cursor-pointer transition-colors group ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <svg className="h-10 w-10 text-emerald-400 group-hover:scale-110 transition-transform" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2 text-sm text-emerald-700 font-bold text-center">Nhấn để chọn nhiều ảnh<br/><span className="text-[10px] text-emerald-500 font-medium">Không giới hạn dung lượng</span></p>
                <input 
                  id="file-upload" 
                  type="file" 
                  className="sr-only" 
                  accept="image/*" 
                  multiple 
                  disabled={isProcessing}
                  onChange={handleFileChange} 
                />
              </label>
            </div>

            {pendingImages.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto p-3 bg-emerald-50 rounded-2xl border border-mint-100">
                <p className="text-[10px] font-black text-emerald-700 uppercase mb-2">Hàng chờ tải lên ({pendingImages.length})</p>
                <div className="grid grid-cols-4 gap-2">
                  {pendingImages.map((img) => (
                    <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden group border border-white shadow-sm">
                      <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      
                      {/* Overlay trạng thái */}
                      <div className={`absolute inset-0 flex items-center justify-center transition-colors ${
                        img.status === 'uploading' ? 'bg-black/40' : 
                        img.status === 'success' ? 'bg-emerald-500/60' : 
                        img.status === 'error' ? 'bg-rose-500/60' : 'group-hover:bg-black/20'
                      }`}>
                        {img.status === 'uploading' && (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {img.status === 'success' && (
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        )}
                        {img.status === 'error' && (
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        )}
                        {img.status === 'pending' && !isProcessing && (
                          <button 
                            type="button"
                            onClick={() => removePendingImage(img.id)}
                            className="text-white opacity-0 group-hover:opacity-100 active:scale-90"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={handleSaveAll}
              disabled={pendingImages.filter(p => p.status !== 'success').length === 0 || isProcessing}
              className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 text-sm tracking-wide ${pendingImages.length > 0 && !isProcessing ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              {isProcessing ? 'ĐANG TẢI LÊN ĐÁM MÂY...' : `LƯU TẤT CẢ LÊN ONLINE`}
            </button>
          </div>
        </section>
      </div>

      <div className="lg:col-span-2 space-y-6 md:space-y-8">
        <section className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-black text-emerald-900 mb-6">Thư viện ảnh Online ({yearPhotos.length})</h3>
          
          <div className="-mx-6 md:mx-0 overflow-x-auto px-6 md:px-0">
            <div className="min-w-[500px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-mint-100">
                    <th className="pb-4 font-bold text-gray-400 text-[10px] uppercase tracking-wider">Ảnh Cloud</th>
                    <th className="pb-4 font-bold text-gray-400 text-[10px] uppercase tracking-wider">Lớp</th>
                    <th className="pb-4 font-bold text-gray-400 text-[10px] uppercase tracking-wider">Mô tả</th>
                    <th className="pb-4 font-bold text-gray-400 text-[10px] uppercase tracking-wider text-right">Quản lý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mint-50">
                  {yearPhotos.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-400 italic font-medium">Chưa có ảnh nào được lưu trữ online.</td>
                    </tr>
                  ) : (
                    yearPhotos.sort((a,b) => b.createdAt - a.createdAt).map(photo => {
                      const cls = allClasses.find(c => c.id === photo.classId);
                      return (
                        <tr key={photo.id} className="hover:bg-mint-50/50 transition-colors group">
                          <td className="py-4">
                            <div className="relative w-16 h-12 rounded-xl overflow-hidden shadow-sm">
                              <img src={photo.url} className="w-full h-full object-cover" alt="Thumb" />
                              <div className="absolute top-0 right-0 p-0.5 bg-emerald-500 rounded-bl-lg">
                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" /></svg>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 font-black text-emerald-900">Lớp {cls?.name}</td>
                          <td className="py-4 text-sm text-gray-600 font-medium truncate max-w-[150px]">{photo.description}</td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => {
                                if(window.confirm('Xóa liên kết ảnh này khỏi hệ thống? (Ảnh gốc trên Cloudinary vẫn được giữ an toàn)')) {
                                  onDeletePhoto(photo.id);
                                }
                              }}
                              className="text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;
