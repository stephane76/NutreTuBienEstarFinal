import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  showHomeIcon?: boolean;
  customPath?: string;
  className?: string;
}

export function BackButton({ showHomeIcon = false, customPath, className = "" }: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (customPath) {
      navigate(customPath);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBack}
        className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background-submenu transition-all duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Button>
      
      {showHomeIcon && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleHome}
          className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background-submenu transition-all duration-200"
        >
          <Home className="w-4 h-4" />
          Inicio
        </Button>
      )}
    </div>
  );
}