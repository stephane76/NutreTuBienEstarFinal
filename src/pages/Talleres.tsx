import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, CheckCircle, Clock, Heart, Sparkles } from 'lucide-react';
import { Avatar } from '@/components/Avatar';

const talleres = [
  {
    id: 'autocuidado',
    title: 'Fundamentos del Autocuidado',
    description: 'Aprende a cuidarte con amabilidad y sin juicio',
    duration: '15 min',
    lessons: 5,
    completed: 2,
    category: 'Básico',
    color: 'bg-success-soft text-success-foreground',
    icon: Heart
  },
  {
    id: 'mindfulness',
    title: 'Alimentación Consciente',
    description: 'Conecta con tus señales de hambre y saciedad',
    duration: '20 min',
    lessons: 4,
    completed: 0,
    category: 'Intermedio',
    color: 'bg-primary-soft text-primary-foreground',
    icon: Sparkles
  },
  {
    id: 'emociones',
    title: 'Gestión Emocional',
    description: 'Herramientas para manejar emociones difíciles',
    duration: '25 min',
    lessons: 6,
    completed: 0,
    category: 'Avanzado',
    color: 'bg-accent-soft text-accent-foreground',
    icon: Heart
  },
  {
    id: 'hambre-emocional',
    title: 'Hambre Emocional vs Física',
    description: 'Aprende a distinguir y responder apropiadamente',
    duration: '18 min',
    lessons: 4,
    completed: 1,
    category: 'Intermedio',
    color: 'bg-warning-soft text-warning-foreground',
    icon: Sparkles
  }
];

const lecciones = {
  'autocuidado': [
    { id: 1, title: 'Qué es el autocuidado real', completed: true, duration: '3 min' },
    { id: 2, title: 'Desmontando mitos', completed: true, duration: '4 min' },
    { id: 3, title: 'Práctica: Tu ritual matutino', completed: false, duration: '5 min' },
    { id: 4, title: 'Autocuidado en días difíciles', completed: false, duration: '3 min' },
  ]
};

export default function Talleres() {
  const navigate = useNavigate();
  const [selectedTaller, setSelectedTaller] = useState<string | null>(null);

  const getProgressPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  if (selectedTaller) {
    const taller = talleres.find(t => t.id === selectedTaller)!;
    const lessons = lecciones[selectedTaller as keyof typeof lecciones] || [];

    return (
      <div className="min-h-screen bg-gradient-calm p-4 pb-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedTaller(null)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-heading text-lg font-medium text-foreground">
              {taller.title}
            </h1>
            <div></div>
          </div>

          {/* Progreso del taller */}
          <Card className="mb-6 bg-gradient-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <taller.icon className="w-6 h-6 text-primary" />
                <div className="flex-1">
                  <h3 className="font-heading font-medium text-foreground">{taller.title}</h3>
                  <p className="text-sm text-muted-foreground">{taller.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {taller.completed} de {taller.lessons} lecciones
                  </span>
                  <span className="font-medium text-primary">
                    {getProgressPercentage(taller.completed, taller.lessons)}%
                  </span>
                </div>
                <Progress 
                  value={getProgressPercentage(taller.completed, taller.lessons)} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Lista de lecciones */}
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <Card 
                key={lesson.id}
                className={`transition-all duration-200 ${
                  lesson.completed 
                    ? 'bg-success-soft border-success' 
                    : 'bg-gradient-card hover:shadow-card cursor-pointer'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      lesson.completed 
                        ? 'bg-success text-success-foreground' 
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      {lesson.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">
                        {lesson.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {lesson.duration}
                      </div>
                    </div>
                    {lesson.completed && (
                      <Badge className="bg-success-soft text-success-foreground">
                        Completada
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-calm p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-heading text-lg font-medium text-foreground">
            Talleres Interactivos
          </h1>
          <div></div>
        </div>

        {/* Avatar */}
        <div className="mb-6">
          <Avatar 
            message="Los talleres te ayudarán a desarrollar herramientas prácticas para tu bienestar. Ve a tu ritmo, sin presión."
            mood="encouraging"
          />
        </div>

        {/* Talleres */}
        <div className="space-y-4">
          {talleres.map((taller) => {
            const IconComponent = taller.icon;
            return (
              <Card 
                key={taller.id}
                className="bg-gradient-card hover:shadow-warm transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedTaller(taller.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-soft rounded-lg">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-heading font-medium text-foreground">
                          {taller.title}
                        </h3>
                        <Badge className={taller.color}>
                          {taller.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {taller.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {taller.duration}
                          </span>
                          <span>{taller.lessons} lecciones</span>
                        </div>
                        {taller.completed > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-16">
                              <Progress 
                                value={getProgressPercentage(taller.completed, taller.lessons)} 
                                className="h-1"
                              />
                            </div>
                            <span className="text-xs text-primary font-medium">
                              {getProgressPercentage(taller.completed, taller.lessons)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Próximamente */}
        <Card className="mt-6 bg-gradient-warm">
          <CardContent className="p-4 text-center">
            <Sparkles className="w-8 h-8 text-accent-foreground mx-auto mb-2" />
            <h3 className="font-heading font-medium text-accent-foreground mb-1">
              Más talleres próximamente
            </h3>
            <p className="text-sm text-accent-foreground/80">
              Estamos preparando nuevos contenidos para apoyar tu crecimiento
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}