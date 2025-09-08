import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Star, Sun, Moon } from 'lucide-react';

interface MotivationalMessage {
  id: string;
  message: string;
  category: 'morning' | 'afternoon' | 'evening' | 'crisis' | 'celebration' | 'general';
  icon: string;
  color: string;
}

const messages: MotivationalMessage[] = [
  // Morning messages
  {
    id: 'morning1',
    message: 'Cada nuevo día es una oportunidad para cuidarte con amor. Tu bienestar importa.',
    category: 'morning',
    icon: '🌅',
    color: 'text-warning'
  },
  {
    id: 'morning2',
    message: 'Buenos días, guerrera. Hoy tienes la fuerza para enfrentar cualquier desafío.',
    category: 'morning',
    icon: '☀️',
    color: 'text-primary'
  },
  {
    id: 'morning3',
    message: 'Tu cuerpo y mente merecen compasión. Comienza el día honrando tus necesidades.',
    category: 'morning',
    icon: '🌱',
    color: 'text-success'
  },

  // Afternoon messages
  {
    id: 'afternoon1',
    message: 'A mitad del día, recuerda: ya has logrado mucho solo por estar aquí.',
    category: 'afternoon',
    icon: '🌞',
    color: 'text-accent'
  },
  {
    id: 'afternoon2',
    message: 'Tus emociones son válidas. Todas ellas tienen algo importante que decirte.',
    category: 'afternoon',
    icon: '💙',
    color: 'text-primary'
  },

  // Evening messages
  {
    id: 'evening1',
    message: 'Al final del día, celebra cada pequeño paso que diste hacia tu bienestar.',
    category: 'evening',
    icon: '🌙',
    color: 'text-secondary'
  },
  {
    id: 'evening2',
    message: 'Descansa con la certeza de que mañana es otra oportunidad para crecer.',
    category: 'evening',
    icon: '✨',
    color: 'text-muted-foreground'
  },

  // Crisis support
  {
    id: 'crisis1',
    message: 'Respiremos juntas. Este momento difícil pasará. No estás sola.',
    category: 'crisis',
    icon: '🫂',
    color: 'text-destructive'
  },
  {
    id: 'crisis2',
    message: 'Tu vida tiene valor. Tus sentimientos son temporales. Hay ayuda disponible.',
    category: 'crisis',
    icon: '💝',
    color: 'text-success'
  },

  // Celebration
  {
    id: 'celebration1',
    message: '¡Increíble! Cada registro que haces es un acto de amor propio.',
    category: 'celebration',
    icon: '🎉',
    color: 'text-warning'
  },
  {
    id: 'celebration2',
    message: 'Tu constancia es inspiradora. Sigue brillando con tu propia luz.',
    category: 'celebration',
    icon: '🌟',
    color: 'text-accent'
  },

  // General support
  {
    id: 'general1',
    message: 'Comer sin culpa es un acto revolucionario de amor propio.',
    category: 'general',
    icon: '💪',
    color: 'text-primary'
  },
  {
    id: 'general2',
    message: 'Tu cuerpo es tu hogar. Trátatelo con la gentileza que merece.',
    category: 'general',
    icon: '🏠',
    color: 'text-success'
  },
  {
    id: 'general3',
    message: 'No hay prisa. La recuperación es un camino, no un destino.',
    category: 'general',
    icon: '🛤️',
    color: 'text-secondary'
  }
];

interface MotivationalMessagesProps {
  category?: 'morning' | 'afternoon' | 'evening' | 'crisis' | 'celebration' | 'general';
  onlyOne?: boolean;
  className?: string;
}

export const MotivationalMessages = ({ 
  category = 'general', 
  onlyOne = false, 
  className 
}: MotivationalMessagesProps) => {
  const [currentMessage, setCurrentMessage] = useState<MotivationalMessage | null>(null);
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    selectMessage();
  }, [category]);

  const selectMessage = () => {
    const timeOfDay = getTimeOfDay();
    let relevantMessages = messages.filter(msg => 
      category === 'general' ? 
        (msg.category === 'general' || msg.category === timeOfDay) : 
        msg.category === category
    );

    if (relevantMessages.length === 0) {
      relevantMessages = messages.filter(msg => msg.category === 'general');
    }

    const randomMessage = relevantMessages[Math.floor(Math.random() * relevantMessages.length)];
    setCurrentMessage(randomMessage);
    setShowMessage(true);
  };

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
  };

  const getTimeIcon = () => {
    const timeOfDay = getTimeOfDay();
    switch (timeOfDay) {
      case 'morning': return Sun;
      case 'afternoon': return Sparkles;
      case 'evening': return Moon;
      default: return Heart;
    }
  };

  const handleNewMessage = () => {
    setShowMessage(false);
    setTimeout(() => {
      selectMessage();
    }, 300);
  };

  const handleDismiss = () => {
    setShowMessage(false);
  };

  if (!currentMessage || !showMessage) {
    return null;
  }

  const TimeIcon = getTimeIcon();

  return (
    <div className={className}>
      <Card className={`bg-gradient-warm border-0 shadow-warm transition-all duration-300 ${
        showMessage ? 'animate-fade-in' : 'animate-fade-out'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl flex-shrink-0">
              {currentMessage.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground leading-relaxed">
                {currentMessage.message}
              </p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1">
                  <TimeIcon className={`w-4 h-4 ${currentMessage.color}`} />
                  <span className={`text-xs ${currentMessage.color} capitalize`}>
                    {currentMessage.category === 'general' ? getTimeOfDay() : currentMessage.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNewMessage}
                    className="text-xs h-6 px-2"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Otro mensaje
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="text-xs h-6 px-2 text-muted-foreground"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};