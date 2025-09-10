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
      className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-sm shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-110 animate-pulse border-4 border-red-400/30"
      aria-label="Ayuda de crisis - S.O.S"
      title="¡Necesito ayuda ahora! - S.O.S"
    >
      <span className="text-xs leading-tight">S.O.S</span>
    </button>
  );
}