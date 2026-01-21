
import React, { useState, useEffect, useMemo } from 'react';
import { SchoolYear, Class, Photo, ViewMode } from './types';
import { SCHOOL_YEARS, CLASSES } from './constants';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ExploreView from './components/ExploreView';
import StatisticsView from './components/StatisticsView';
import AdminPanel from './components/AdminPanel';

const STORAGE_KEY = 'KINDERGARTEN_PHOTOS';

const App: React.FC = () => {
  const [currentYearId, setCurrentYearId] = useState<string>(SCHOOL_YEARS[3].id); // Default to 2024-2025
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.EXPLORE);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load data from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPhotos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved photos", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save data to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    }
  }, [photos, isLoaded]);

  const currentYear = useMemo(() => 
    SCHOOL_YEARS.find(y => y.id === currentYearId) || SCHOOL_YEARS[0], 
  [currentYearId]);

  const allYearClasses = useMemo(() => CLASSES(currentYearId), [currentYearId]);

  const handleAddPhoto = (photo: Omit<Photo, 'id' | 'createdAt'>) => {
    const newPhoto: Photo = {
      ...photo,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    setPhotos(prev => [...prev, newPhoto]);
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleYearSelect = (id: string) => {
    setCurrentYearId(id);
    setViewMode(ViewMode.EXPLORE);
    setIsSidebarOpen(false); // Đóng menu sau khi chọn trên mobile
  };

  return (
    <div className="min-h-screen flex flex-col bg-mint-50">
      <Navbar 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        currentYear={currentYear}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          years={SCHOOL_YEARS} 
          currentYearId={currentYearId} 
          onYearSelect={handleYearSelect}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {viewMode === ViewMode.EXPLORE && (
              <ExploreView 
                currentYearId={currentYearId}
                allClasses={allYearClasses}
                photos={photos}
              />
            )}
            
            {viewMode === ViewMode.STATISTICS && (
              <StatisticsView 
                currentYearId={currentYearId}
                allClasses={allYearClasses}
                photos={photos}
              />
            )}
            
            {viewMode === ViewMode.ADMIN && (
              <AdminPanel 
                currentYearId={currentYearId}
                allClasses={allYearClasses}
                photos={photos}
                onAddPhoto={handleAddPhoto}
                onDeletePhoto={handleDeletePhoto}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
