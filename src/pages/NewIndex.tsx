import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Headphones, Users } from 'lucide-react';

const quickActions = [
  {
    id: 'emotion',
    title: 'Registrar emoción',
    description: '¿Cómo te sientes hoy? Regístralo en un minuto.',
    icon: Heart,
    path: '/diario-emocional',
    color: 'bg-primary/10 text-primary',
  },
  {
    id: 'audio',
    title: 'Escuchar audio de calma',
    description: 'Aquí siempre hay un recurso listo para ti.',
    icon: Headphones,
    path: '/recursos',
    color: 'bg-secondary/10 text-secondary-foreground',
  },
  {
    id: 'community',
    title: 'Comunidad',
    description: 'Conecta con otras personas en tu mismo camino.',
    icon: Users,
    path: '/comunidad',
    color: 'bg-warm-green/10 text-warm-green',
  },
];

export default function NewIndex() {
  const navigate = useNavigate();
  const [userName] = useState(''); // Aquí se podría obtener del contexto de usuario
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Buenos días');
    } else if (hour < 18) {
      setGreeting('Buenas tardes');
    } else {
      setGreeting('Buenas noches');
    }
  }, []);

  const handleQuickAction = (path: string) => {
    navigate(path);
    // Vibración suave
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-20 right-10 w-24 h-24 bg-primary/5 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-40 left-8 w-32 h-32 bg-secondary/5 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
      
      <div className="container mx-auto px-6 pt-12 space-y-10">
        {/* Saludo dinámico mejorado */}
        <div className="text-center space-y-6 animate-fade-in-up">
          <h1 className="text-4xl font-poppins font-bold gradient-text">
            {greeting}{userName && `, ${userName}`} 
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            Hoy es un buen día para <span className="text-primary font-medium">cuidarte</span>
          </p>
        </div>

        {/* Ilustración central mejorada */}
        <div className="flex justify-center py-8">
          <div className="relative">
            <div className="w-40 h-40 bg-gradient-primary rounded-full flex items-center justify-center animate-scale-in glow-primary">
              <div className="w-28 h-28 glass-card rounded-full flex items-center justify-center border-2 border-white/20">
                <Heart className="w-12 h-12 text-white animate-heart-beat" />
              </div>
            </div>
            {/* Efectos decorativos alrededor */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full animate-bounce-gentle"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-tertiary rounded-full animate-bounce-gentle" style={{animationDelay: '0.5s'}}></div>
          </div>
        </div>

        {/* Accesos rápidos mejorados */}
        <div className="space-y-6">
          <h2 className="text-2xl font-poppins font-semibold text-center text-foreground">
            ¿Qué necesitas ahora?
          </h2>
          
          <div className="space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div 
                  key={action.id}
                  className="card-interactive animate-fade-in hover-lift"
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => handleQuickAction(action.path)}
                >
                  <div className="flex items-center space-x-6 p-6">
                    <div className={`w-16 h-16 rounded-3xl ${action.color} flex items-center justify-center hover-scale shadow-soft`}>
                      <Icon size={28} className="drop-shadow-sm" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-poppins font-semibold text-lg text-foreground mb-2">
                        {action.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mensaje de apoyo mejorado */}
        <div className="text-center py-8">
          <div className="card-feature max-w-md mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <p className="text-primary font-poppins font-medium text-lg leading-relaxed">
                "Este es tu espacio seguro. Aquí no hay juicios, solo comprensión y cuidado."
              </p>
            </div>
          </div>
        </div>

        {/* CTA suave al final */}
        <div className="text-center pb-8">
          <p className="text-sm text-muted-foreground mb-4">
            ¿Primera vez aquí?
          </p>
          <button 
            onClick={() => navigate('/recursos')}
            className="btn-ghost text-sm px-6 py-3"
          >
            Descubre todas las herramientas
          </button>
        </div>
      </div>
    </div>
  );
}