import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/components/UserProfile';
import { 
  Heart, 
  Headphones, 
  Users, 
  Brain, 
  BookOpen, 
  MessageSquare, 
  AlertCircle,
  TrendingUp,
  User,
  HelpCircle,
  Wrench,
  Camera,
  Utensils,
  CheckCircle,
  PenTool,
  GamepadIcon,
  Palette,
  Music,
  Pause,
  Sparkles,
  ArrowRight,
  Play,
  ChevronRight
} from 'lucide-react';

// Import images
import heroWellness from '@/assets/hero-wellness.jpg';
import mentalHealthSupport from '@/assets/mental-health-support.jpg';
import mindfulEating from '@/assets/mindful-eating.jpg';
import communitySupport from '@/assets/community-support.jpg';
import progressTracking from '@/assets/progress-tracking.jpg';

interface MenuOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  path: string;
  category: string;
  color: string;
  gradient: string;
  image?: string;
  badge?: string;
  featured?: boolean;
}

const menuOptions: MenuOption[] = [
  // Featured options
  {
    id: 'apoyo-ia',
    title: 'Acompañante IA',
    description: 'Tu compañero inteligente disponible 24/7 para apoyo emocional y guía personalizada',
    icon: MessageSquare,
    path: '/apoyo',
    category: 'featured',
    color: 'from-violet-500 to-purple-600',
    gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
    image: mentalHealthSupport,
    badge: '24/7',
    featured: true
  },
  {
    id: 'diario-emocional',
    title: 'Diario Emocional',
    description: 'Registra y comprende tus emociones con herramientas de análisis inteligente',
    icon: Heart,
    path: '/diario-emocional',
    category: 'featured',
    color: 'from-pink-500 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-500 to-rose-500',
    badge: 'Esencial',
    featured: true
  },

  // Principal tools
  {
    id: 'registro-alimentario',
    title: 'Registro Alimentario',
    description: 'Seguimiento consciente y sin juicios de tu relación con la comida',
    icon: Utensils,
    path: '/registro-alimentario',
    category: 'principal',
    color: 'from-emerald-500 to-teal-500',
    gradient: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    image: mindfulEating
  },
  {
    id: 'crisis',
    title: 'Apoyo de Crisis',
    description: 'Ayuda inmediata y recursos de emergencia cuando más los necesitas',
    icon: AlertCircle,
    path: '/crisis',
    category: 'principal',
    color: 'from-red-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-red-500 to-pink-500',
    badge: 'Urgente'
  },
  {
    id: 'recursos-audio',
    title: 'Recursos de Audio',
    description: 'Meditaciones guiadas, ejercicios de respiración y contenido calmante',
    icon: Headphones,
    path: '/recursos',
    category: 'principal',
    color: 'from-indigo-500 to-blue-500',
    gradient: 'bg-gradient-to-br from-indigo-500 to-blue-500'
  },

  // Wellness tools
  {
    id: 'pausa-mindful',
    title: 'Pausa Mindful',
    description: 'Técnicas de respiración y mindfulness para momentos de calma',
    icon: Pause,
    path: '/pausa',
    category: 'bienestar',
    color: 'from-cyan-500 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-500 to-blue-500'
  },
  {
    id: 'detector-hambre',
    title: 'Detector de Hambre',
    description: 'Aprende a diferenciar entre hambre física y emocional',
    icon: Brain,
    path: '/detector-hambre',
    category: 'bienestar',
    color: 'from-purple-500 to-indigo-500',
    gradient: 'bg-gradient-to-br from-purple-500 to-indigo-500'
  },
  {
    id: 'check-in',
    title: 'Check-in Diario',
    description: 'Evaluación rápida de tu estado emocional y físico',
    icon: CheckCircle,
    path: '/check-in',
    category: 'bienestar',
    color: 'from-amber-500 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-500 to-orange-500'
  },

  // Community
  {
    id: 'comunidad',
    title: 'Comunidad',
    description: 'Conecta con personas que entienden tu proceso de recuperación',
    icon: Users,
    path: '/comunidad',
    category: 'comunidad',
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
    image: communitySupport
  },
  {
    id: 'talleres',
    title: 'Talleres Virtuales',
    description: 'Sesiones educativas y terapéuticas con expertos',
    icon: PenTool,
    path: '/talleres',
    category: 'comunidad',
    color: 'from-rose-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-500 to-pink-500'
  },
  {
    id: 'juegos-educativos',
    title: 'Actividades Interactivas',
    description: 'Juegos terapéuticos diseñados para tu crecimiento personal',
    icon: GamepadIcon,
    path: '/juegos',
    category: 'comunidad',
    color: 'from-yellow-500 to-amber-500',
    gradient: 'bg-gradient-to-br from-yellow-500 to-amber-500'
  },

  // Progress tracking
  {
    id: 'progreso',
    title: 'Mi Progreso',
    description: 'Visualiza tu evolución y celebra cada logro en tu camino',
    icon: TrendingUp,
    path: '/progreso',
    category: 'seguimiento',
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    image: progressTracking
  },
  {
    id: 'cuestionarios',
    title: 'Evaluaciones',
    description: 'Herramientas de autoevaluación para conocerte mejor',
    icon: HelpCircle,
    path: '/cuestionarios',
    category: 'seguimiento',
    color: 'from-violet-500 to-purple-500',
    gradient: 'bg-gradient-to-br from-violet-500 to-purple-500'
  }
];

export default function MainMenu() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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

  const handleNavigation = (path: string) => {
    navigate(path);
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const featuredOptions = menuOptions.filter(option => option.featured);
  const regularOptions = menuOptions.filter(option => !option.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-24">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-purple-500/5"></div>
        <div className="container mx-auto px-4 py-6 relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                {greeting} ✨
              </h1>
              <p className="text-slate-600 mt-1">¿En qué te puedo acompañar hoy?</p>
            </div>
            <UserProfile />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroWellness} 
            alt="Wellness hero" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent"></div>
        </div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              Tu espacio de <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">cuidado personal</span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              Herramientas diseñadas con amor para acompañarte en cada paso de tu proceso de recuperación y bienestar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => handleNavigation('/apoyo')}
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Hablar ahora
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleNavigation('/diario-emocional')}
                className="border-2 border-violet-200 hover:border-violet-300 text-violet-700 px-8 py-3 text-lg rounded-xl hover:bg-violet-50 transition-all duration-300"
              >
                <Heart className="mr-2 h-5 w-5" />
                Registrar emociones
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Featured Tools */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-purple-100 px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-5 w-5 text-violet-600" />
              <span className="text-violet-700 font-semibold">Herramientas Destacadas</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Tus aliados principales</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredOptions.map((option) => {
              const Icon = option.icon;
              const isHovered = hoveredCard === option.id;
              
              return (
                <Card 
                  key={option.id}
                  className="group relative cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                  onClick={() => handleNavigation(option.path)}
                  onMouseEnter={() => setHoveredCard(option.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className={`absolute inset-0 ${option.gradient} opacity-90`}></div>
                  {option.image && (
                    <div className="absolute inset-0 opacity-20">
                      <img 
                        src={option.image} 
                        alt={option.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="relative z-10 p-8 text-white">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8" />
                      </div>
                      {option.badge && (
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                          {option.badge}
                        </Badge>
                      )}
                    </div>
                    <h4 className="text-2xl font-bold mb-3">{option.title}</h4>
                    <p className="text-white/90 leading-relaxed mb-6">{option.description}</p>
                    <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                      <span className="font-medium">Comenzar</span>
                      <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Regular Tools Grid */}
        <section>
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Todas las herramientas</h3>
            <p className="text-slate-600">Descubre todo lo que tenemos para acompañarte</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularOptions.map((option) => {
              const Icon = option.icon;
              const isHovered = hoveredCard === option.id;
              
              return (
                <Card 
                  key={option.id}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-md overflow-hidden bg-white"
                  onClick={() => handleNavigation(option.path)}
                  onMouseEnter={() => setHoveredCard(option.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {option.image && (
                    <div className="h-32 overflow-hidden">
                      <img 
                        src={option.image} 
                        alt={option.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${option.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {option.badge && (
                        <Badge 
                          variant={option.badge === 'Urgente' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {option.badge}
                        </Badge>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-violet-600 transition-colors">
                      {option.title}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {option.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        {option.category === 'principal' && 'Herramienta Principal'}
                        {option.category === 'bienestar' && 'Bienestar'}
                        {option.category === 'comunidad' && 'Comunidad'}
                        {option.category === 'seguimiento' && 'Seguimiento'}
                      </span>
                      <ChevronRight className={`h-4 w-4 text-slate-400 group-hover:text-violet-600 transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 overflow-hidden">
            <CardContent className="p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-left">
                  <h3 className="text-3xl font-bold text-slate-800 mb-4">
                    ¿Primera vez aquí?
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    Te recomendamos empezar hablando con tu Acompañante IA. Está entrenado específicamente 
                    para ayudarte a navegar por todas las herramientas según tus necesidades del momento.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={() => handleNavigation('/apoyo')}
                      className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl"
                    >
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Empezar conversación
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleNavigation('/recursos')}
                      className="border-violet-200 text-violet-700 hover:bg-violet-50 px-6 py-3 rounded-xl"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Ver recursos
                    </Button>
                  </div>
                </div>
                <div className="w-32 h-32 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Heart className="w-16 h-16 text-white animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}