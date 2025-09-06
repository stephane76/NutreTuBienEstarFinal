import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, FileText, CheckCircle, Calendar } from 'lucide-react';
import { Avatar } from '@/components/Avatar';

const cuestionarios = [
  {
    id: 'eat-40',
    title: 'Evaluación EAT-40',
    description: 'Cuestionario de actitudes alimentarias para identificar patrones de riesgo',
    duration: '10-15 min',
    lastTaken: null,
    frequency: 'Mensual',
    icon: FileText,
    questions: 40
  },
  {
    id: 'bienestar',
    title: 'Bienestar Emocional',
    description: 'Evalúa tu estado emocional y relación con el autocuidado',
    duration: '5-8 min',
    lastTaken: '2024-01-15',
    frequency: 'Semanal',
    icon: CheckCircle,
    questions: 15
  }
];

const eat40Questions = [
  "Me aterroriza tener sobrepeso",
  "Evito comer cuando tengo hambre",
  "Me obsesiono con la comida",
  "He sufrido atracones donde siento que no puedo parar de comer",
  "Corto la comida en pequeños trozos",
  "Soy consciente del contenido calórico de los alimentos que como",
  "Evito especialmente los alimentos con alto contenido en carbohidratos",
  "Siento que otros preferirían que comiera más",
  "Vomito después de haber comido",
  "Me siento extremadamente culpable después de comer"
];

const respuestasEAT = [
  { value: '0', label: 'Nunca' },
  { value: '1', label: 'Raramente' },
  { value: '2', label: 'A veces' },
  { value: '3', label: 'A menudo' },
  { value: '4', label: 'Muy a menudo' },
  { value: '5', label: 'Siempre' }
];

export default function Cuestionarios() {
  const navigate = useNavigate();
  const [selectedCuestionario, setSelectedCuestionario] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionIndex: number, value: string) => {
    setRespuestas(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < eat40Questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateEATScore = () => {
    const score = Object.values(respuestas).reduce((sum, value) => sum + parseInt(value), 0);
    return score;
  };

  const getEATInterpretation = (score: number) => {
    if (score >= 30) {
      return {
        level: 'Alto riesgo',
        message: 'Los resultados sugieren la presencia de patrones alimentarios que pueden requerir atención profesional. Te recomendamos buscar apoyo especializado.',
        color: 'text-destructive',
        bgColor: 'bg-destructive-soft',
        recommendations: [
          'Considera hablar con un profesional de la salud',
          'Usa nuestros recursos de "Pausa con Cuidado"',
          'Practica ejercicios de respiración diarios'
        ]
      };
    } else if (score >= 20) {
      return {
        level: 'Riesgo moderado',
        message: 'Hay algunas áreas de tu relación con la comida que podrían beneficiarse de atención y cuidado.',
        color: 'text-warning',
        bgColor: 'bg-warning-soft',
        recommendations: [
          'Explora nuestros talleres de alimentación consciente',
          'Usa el detector de hambre regularmente',
          'Practica el autocuidado diario'
        ]
      };
    } else {
      return {
        level: 'Bajo riesgo',
        message: 'Tus respuestas indican una relación relativamente saludable con la comida. ¡Sigue cuidándote!',
        color: 'text-success',
        bgColor: 'bg-success-soft',
        recommendations: [
          'Mantén tus hábitos de autocuidado',
          'Continúa con el registro emocional',
          'Celebra tus avances'
        ]
      };
    }
  };

  if (showResults && selectedCuestionario === 'eat-40') {
    const score = calculateEATScore();
    const interpretation = getEATInterpretation(score);

    return (
      <div className="min-h-screen bg-gradient-calm p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6 pt-4">
            <Button variant="ghost" size="sm" onClick={() => {
              setShowResults(false);
              setSelectedCuestionario(null);
              setCurrentQuestion(0);
              setRespuestas({});
            }}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-heading text-lg font-medium text-foreground">
              Resultados EAT-40
            </h1>
            <div></div>
          </div>

          <div className="space-y-6">
            <Card className={`${interpretation.bgColor} border-0`}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{score}</span>
                </div>
                <h3 className={`font-heading text-lg font-semibold mb-2 ${interpretation.color}`}>
                  {interpretation.level}
                </h3>
                <p className={`text-sm leading-relaxed ${interpretation.color}`}>
                  {interpretation.message}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="font-heading text-foreground">
                  Recomendaciones personalizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {interpretation.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                      <p className="text-sm text-muted-foreground">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button 
                onClick={() => navigate('/recursos')}
                className="flex-1 bg-gradient-primary text-white"
              >
                Ver recursos
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setSelectedCuestionario(null);
                  setCurrentQuestion(0);
                  setRespuestas({});
                }}
                className="flex-1"
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCuestionario === 'eat-40') {
    const progress = ((currentQuestion + 1) / eat40Questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-calm p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6 pt-4">
            <Button variant="ghost" size="sm" onClick={() => {
              setSelectedCuestionario(null);
              setCurrentQuestion(0);
              setRespuestas({});
            }}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-heading text-lg font-medium text-foreground">
              EAT-40
            </h1>
            <div className="text-sm text-muted-foreground">
              {currentQuestion + 1}/{eat40Questions.length}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Progress value={progress} className="h-2 mb-4" />
              <p className="text-sm text-muted-foreground text-center">
                {Math.round(progress)}% completado
              </p>
            </div>

            <Card className="bg-gradient-card">
              <CardContent className="p-6">
                <h3 className="font-heading text-lg font-medium text-foreground mb-6">
                  {eat40Questions[currentQuestion]}
                </h3>

                <RadioGroup 
                  value={respuestas[currentQuestion] || ''} 
                  onValueChange={(value) => handleAnswer(currentQuestion, value)}
                >
                  <div className="space-y-3">
                    {respuestasEAT.map((respuesta) => (
                      <div key={respuesta.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={respuesta.value} id={respuesta.value} />
                        <Label 
                          htmlFor={respuesta.value}
                          className="font-body text-foreground cursor-pointer flex-1"
                        >
                          {respuesta.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Button 
              onClick={nextQuestion}
              disabled={!respuestas[currentQuestion]}
              className="w-full h-12 bg-gradient-primary text-white disabled:opacity-50"
            >
              {currentQuestion < eat40Questions.length - 1 ? 'Siguiente' : 'Ver resultados'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-calm p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-heading text-lg font-medium text-foreground">
            Cuestionarios
          </h1>
          <div></div>
        </div>

        <div className="mb-6">
          <Avatar 
            message="Los cuestionarios te ayudan a conocerte mejor y identificar áreas de crecimiento. Responde con honestidad y sin juicio."
            mood="supportive"
          />
        </div>

        <div className="space-y-4">
          {cuestionarios.map((cuestionario) => {
            const IconComponent = cuestionario.icon;
            return (
              <Card 
                key={cuestionario.id}
                className="bg-gradient-card hover:shadow-warm transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedCuestionario(cuestionario.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-soft rounded-lg">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-medium text-foreground mb-1">
                        {cuestionario.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {cuestionario.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Duración: {cuestionario.duration}
                          </div>
                          <div>Frecuencia: {cuestionario.frequency}</div>
                        </div>
                        
                        {cuestionario.lastTaken ? (
                          <span className="text-xs text-success">
                            Último: {new Date(cuestionario.lastTaken).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No realizado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}