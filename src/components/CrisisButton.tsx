import React from 'react';
import { useNavigate } from 'react-router-dom';

export function CrisisButton() {
  const navigate = useNavigate();

  const handleCrisisClick = () => {
    navigate('/crisis');
    // Vibración de emergencia
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  return (
    <button
      onClick={handleCrisisClick}
      className="fixed top-4 right-4 z-50 w-20 h-20 rounded-2xl bg-gradient-to-br from-crisis to-crisis/90 hover:from-crisis hover:to-crisis/80 text-crisis-foreground font-bold text-sm shadow-2xl hover:shadow-crisis/50 transition-all duration-300 transform hover:scale-105 animate-pulse border-2 border-crisis/20"
      aria-label="Ayuda de Crisis - 024 y 112"
      title="Ayuda inmediata - 024 (Salud Mental) / 112 (Emergencias)"
    >
      <div className="flex flex-col items-center justify-center">
        <span className="text-xs font-bold">CRISIS</span>
        <span className="text-[10px] opacity-90">024•112</span>
      </div>
    </button>
  );
}