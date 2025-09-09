import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, CheckCircle, Clock, Heart, Sparkles, ChevronRight, BookOpen } from 'lucide-react';
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
    { 
      id: 1, 
      title: 'Qué es el autocuidado real', 
      completed: true, 
      duration: '3 min',
      content: {
        intro: 'El autocuidado real va más allá de los baños de burbujas y las mascarillas faciales.',
        sections: [
          {
            title: 'Definición auténtica',
            content: 'El autocuidado es la práctica intencional de atender tus necesidades físicas, emocionales y mentales de manera sostenible y compasiva.'
          },
          {
            title: 'No es solo placer',
            content: 'A veces el autocuidado implica hacer cosas difíciles pero necesarias: establecer límites, ir al médico, o tener conversaciones incómodas.'
          },
          {
            title: 'Es una responsabilidad',
            content: 'Cuidarte no es egoísta, es esencial. No puedes dar lo que no tienes.'
          }
        ],
        reflection: '¿Qué creías que era el autocuidado antes de esta lección? ¿Cómo ha cambiado tu perspectiva?'
      }
    },
    { 
      id: 2, 
      title: 'Desmontando mitos', 
      completed: true, 
      duration: '4 min',
      content: {
        intro: 'Existen muchos mitos sobre el autocuidado que pueden sabotear tus esfuerzos.',
        sections: [
          {
            title: 'Mito: "Es caro"',
            content: 'El autocuidado efectivo puede ser gratuito: caminar, respirar conscientemente, decir "no" cuando es necesario.'
          },
          {
            title: 'Mito: "Es tiempo perdido"',
            content: 'Cuidarte te hace más productivo y resiliente a largo plazo. Es una inversión, no un gasto.'
          },
          {
            title: 'Mito: "Es egoísta"',
            content: 'Cuando te cuidas, tienes más energía y paciencia para los demás. Es un acto de amor hacia ti y otros.'
          }
        ],
        reflection: '¿Cuál de estos mitos has creído? ¿Cómo puedes replantearte el autocuidado?'
      }
    },
    { 
      id: 3, 
      title: 'Práctica: Tu ritual matutino', 
      completed: false, 
      duration: '5 min',
      content: {
        intro: 'Crea un ritual matutino que nutra tu bienestar desde el inicio del día.',
        sections: [
          {
            title: 'Elementos clave',
            content: 'Un buen ritual matutino incluye: conexión contigo mismo, movimiento suave, intención para el día.'
          },
          {
            title: 'Personaliza tu ritual',
            content: 'Puede ser 5 minutos de respiración, escribir gratitudes, estiramientos suaves, o simplemente beber agua consciente.'
          },
          {
            title: 'Consistencia sobre perfección',
            content: 'Es mejor 2 minutos cada día que 30 minutos una vez a la semana. La constancia crea el hábito.'
          }
        ],
        reflection: '¿Qué elementos incluirás en tu ritual matutino? ¿A qué hora lo harás?'
      }
    },
    { 
      id: 4, 
      title: 'Autocuidado en días difíciles', 
      completed: false, 
      duration: '3 min',
      content: {
        intro: 'Los días difíciles son cuando más necesitas autocuidado, pero también cuando es más difícil practicarlo.',
        sections: [
          {
            title: 'Versión mínima viable',
            content: 'Ten una versión súper simple de autocuidado para días difíciles: 3 respiraciones profundas, beber agua, llamar a alguien.'
          },
          {
            title: 'Autocompasión primero',
            content: 'En lugar de juzgarte por tener un mal día, trátate como tratarías a un amigo querido.'
          },
          {
            title: 'Busca apoyo',
            content: 'Los días difíciles no son para atravesarlos solo. Pide ayuda cuando la necesites.'
          }
        ],
        reflection: '¿Cuál será tu plan de autocuidado para los días difíciles?'
      }
    },
  ]
};

export default function Talleres() {
  const navigate = useNavigate();
  const [selectedTaller, setSelectedTaller] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const getProgressPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  // Vista de contenido de lección específica
  if (selectedTaller && selectedLesson) {
    const taller = talleres.find(t => t.id === selectedTaller)!;
    const lessons = lecciones[selectedTaller as keyof typeof lecciones] || [];
    const lesson = lessons.find(l => l.id === selectedLesson)!;
    
    return (
      <div className="min-h-screen bg-gradient-calm p-4 pb-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedLesson(null)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-heading text-lg font-medium text-foreground">
              {lesson.title}
            </h1>
            <div></div>
          </div>

          {/* Contenido de la lección */}
          <Card className="mb-6 bg-gradient-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-soft rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {lesson.duration}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{lesson.content.intro}</p>
              
              <div className="space-y-6">
                {lesson.content.sections.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-heading font-medium text-foreground">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Reflexión */}
              <div className="mt-8 p-4 bg-accent-soft rounded-lg border border-accent/20">
                <h4 className="font-heading font-medium text-accent-foreground mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Reflexión
                </h4>
                <p className="text-sm text-accent-foreground/80">
                  {lesson.content.reflection}
                </p>
              </div>

              {/* Botón de completar */}
              {!lesson.completed && (
                <Button 
                  className="w-full mt-6"
                  onClick={() => {
                    // Aquí se podría agregar lógica para marcar como completada
                    setSelectedLesson(null);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marcar como completada
                </Button>
              )}

              {/* Navegación entre lecciones */}
              <div className="flex justify-between mt-4">
                {selectedLesson > 1 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedLesson(selectedLesson - 1)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>
                )}
                {selectedLesson < lessons.length && (
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedLesson(selectedLesson + 1)}
                    className="ml-auto"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                  className={`transition-all duration-200 cursor-pointer ${
                    lesson.completed 
                      ? 'bg-success-soft border-success hover:shadow-card' 
                      : 'bg-gradient-card hover:shadow-card'
                  }`}
                  onClick={() => setSelectedLesson(lesson.id)}
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
                      <div className="flex items-center gap-2">
                        {lesson.completed && (
                          <Badge className="bg-success-soft text-success-foreground">
                            Completada
                          </Badge>
                        )}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
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