import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/BackButton';
import {
  Palette,
  ChefHat,
  Users,
  BookOpen,
  Gamepad2,
  Sparkles,
  Beaker,
  Heart,
  ArrowRight,
  Clock,
  Star
} from 'lucide-react';

interface LabTool {
  id: string;
  title: string;
  description: string;
  icon: any;
  path: string;
  category: string;
  estimatedTime: string;
  difficulty: 'Fácil' | 'Intermedio' | 'Avanzado';
  status: 'available' | 'coming-soon';
  featured?: boolean;
}

const labTools: LabTool[] = [
  {
    id: 'mandalas',
    title: 'Mandalas para Colorear',
    description: 'Arte terapia para calmar la mente y conectar contigo',
    icon: Palette,
    path: '/mandalas',
    category: 'arte-terapia',
    estimatedTime: '15-30 min',
    difficulty: 'Fácil',
    status: 'available',
    featured: true
  },
  {
    id: 'cocina-terapeutica',
    title: 'Cocina Terapéutica',
    description: 'Recetas mindful y técnicas culinarias sanadoras',
    icon: ChefHat,
    path: '/cocina-terapeutica',
    category: 'cocina-consciente',
    estimatedTime: '30-60 min',
    difficulty: 'Intermedio',
    status: 'available',
    featured: true
  },
  {
    id: 'talleres',
    title: 'Talleres Virtuales',
    description: 'Sesiones educativas y terapéuticas con expertos',
    icon: Users,
    path: '/talleres',
    category: 'educacion',
    estimatedTime: '45-90 min',
    difficulty: 'Intermedio',
    status: 'available'
  },
  {
    id: 'escritura-terapeutica',
    title: 'Escritura Terapéutica',
    description: 'Ejercicios de escritura para explorar emociones',
    icon: BookOpen,
    path: '/escritura-terapeutica',
    category: 'autoconocimiento',
    estimatedTime: '20-40 min',
    difficulty: 'Fácil',
    status: 'available'
  },
  {
    id: 'juegos-educativos',
    title: 'Juegos Educativos',
    description: 'Actividades interactivas para aprender jugando',
    icon: Gamepad2,
    path: '/juegos',
    category: 'gamificacion',
    estimatedTime: '10-25 min',
    difficulty: 'Fácil',
    status: 'available'
  },
  {
    id: 'respuestas-conscientes',
    title: 'Respuestas Conscientes',
    description: 'Práctica de respuestas mindful ante situaciones difíciles',
    icon: Heart,
    path: '/respuestas-conscientes',
    category: 'mindfulness',
    estimatedTime: '15-30 min',
    difficulty: 'Avanzado',
    status: 'available'
  }
];

const categories = [
  { id: 'all', label: 'Todos', color: 'ochre' },
  { id: 'arte-terapia', label: 'Arte Terapia', color: 'green' },
  { id: 'cocina-consciente', label: 'Cocina Consciente', color: 'yellow' },
  { id: 'educacion', label: 'Educación', color: 'ochre' },
  { id: 'autoconocimiento', label: 'Autoconocimiento', color: 'green' },
  { id: 'gamificacion', label: 'Gamificación', color: 'yellow' },
  { id: 'mindfulness', label: 'Mindfulness', color: 'ochre' }
];

export default function Laboratorio() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  const filteredTools = selectedCategory === 'all' 
    ? labTools 
    : labTools.filter(tool => tool.category === selectedCategory);

  const featuredTools = labTools.filter(tool => tool.featured);
  const regularTools = labTools.filter(tool => !tool.featured);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800';
      case 'Intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'Avanzado': return 'bg-ochre-100 text-ochre-800';
      default: return 'bg-cream-100 text-cream-800';
    }
  };

  const handleToolClick = (path: string, status: string) => {
    if (status === 'available') {
      navigate(path);
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-brand/10 px-4 py-2 rounded-full mb-4">
            <Beaker className="h-5 w-5 text-ochre-600" />
            <span className="text-ochre-700 font-semibold">Espacio Experimental</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Laboratorio de Bienestar
          </h1>
          <p className="text-muted-foreground">
            Herramientas adicionales para explorar y profundizar en tu crecimiento personal
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-ochre-500 text-white shadow-md'
                  : 'bg-card hover:bg-ochre-100 text-muted-foreground hover:text-ochre-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="max-w-6xl mx-auto space-y-12">
          {/* Featured Tools */}
          {selectedCategory === 'all' && (
            <section>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-brand/10 px-4 py-2 rounded-full mb-4">
                  <Star className="h-5 w-5 text-ochre-600" />
                  <span className="text-ochre-700 font-semibold">Destacados</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Herramientas más populares
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredTools.map((tool) => {
                  const Icon = tool.icon;
                  const isHovered = hoveredTool === tool.id;
                  
                  return (
                    <Card 
                      key={tool.id}
                      className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-105 glass-card"
                      onClick={() => handleToolClick(tool.path, tool.status)}
                      onMouseEnter={() => setHoveredTool(tool.id)}
                      onMouseLeave={() => setHoveredTool(null)}
                    >
                      <div className="relative p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge className={getDifficultyColor(tool.difficulty)}>
                              {tool.difficulty}
                            </Badge>
                            {tool.status === 'coming-soon' && (
                              <Badge variant="outline">Próximamente</Badge>
                            )}
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-3 text-foreground">{tool.title}</h3>
                        <p className="text-muted-foreground leading-relaxed mb-6">{tool.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{tool.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-2 text-ochre-600 group-hover:text-ochre-700 transition-colors">
                            <span className="font-medium">Explorar</span>
                            <ArrowRight className={`h-4 w-4 transition-transform duration-500 ${isHovered ? 'translate-x-2 scale-125' : ''}`} />
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* All Tools Grid */}
          <section>
            {selectedCategory !== 'all' && (
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  {categories.find(c => c.id === selectedCategory)?.label}
                </h2>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(selectedCategory === 'all' ? regularTools : filteredTools).map((tool, index) => {
                const Icon = tool.icon;
                const isHovered = hoveredTool === tool.id;
                
                return (
                  <Card 
                    key={tool.id}
                    className="group cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-2 border-0 shadow-md overflow-hidden glass-card"
                    onClick={() => handleToolClick(tool.path, tool.status)}
                    onMouseEnter={() => setHoveredTool(tool.id)}
                    onMouseLeave={() => setHoveredTool(null)}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className={getDifficultyColor(tool.difficulty)} variant="secondary">
                            {tool.difficulty}
                          </Badge>
                          {tool.status === 'coming-soon' && (
                            <Badge variant="outline" className="text-xs">
                              Pronto
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-xl group-hover:text-ochre-600 transition-colors">
                        {tool.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-muted-foreground mb-4 leading-relaxed">
                        {tool.description}
                      </CardDescription>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{tool.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-ochre-600 group-hover:text-ochre-700 transition-colors">
                          <span className="text-sm font-medium">Ir</span>
                          <ArrowRight className={`h-3 w-3 transition-transform duration-500 ${isHovered ? 'translate-x-1 scale-125' : ''}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Coming Soon Notice */}
          <div className="text-center bg-gradient-brand/5 rounded-2xl p-8 border border-ochre-200">
            <Sparkles className="h-12 w-12 text-ochre-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              ¿Tienes ideas para el laboratorio?
            </h3>
            <p className="text-muted-foreground mb-4">
              Estamos siempre agregando nuevas herramientas basadas en tu feedback
            </p>
            <Button variant="outline" className="border-ochre-300 hover:bg-ochre-50">
              Sugerir herramienta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}