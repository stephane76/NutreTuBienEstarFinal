import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, FileText, CheckCircle, Calendar, Heart } from 'lucide-react';
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
    icon: Heart,
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

const bienestarQuestions = [
  "En general, me siento satisfecho/a con mi vida",
  "Soy capaz de manejar el estrés de manera efectiva",
  "Tengo relaciones cercanas y significativas en mi vida",
  "Me siento cómodo/a expresando mis emociones",
  "Dedico tiempo regularmente al autocuidado",
  "Tengo confianza en mi capacidad para superar desafíos",
  "Me siento conectado/a con mi propósito en la vida",
  "Duermo bien la mayoría de las noches",
  "Soy compasivo/a conmigo mismo/a cuando cometo errores",
  "Me siento energizado/a y motivado/a la mayor parte del tiempo",
  "Tengo estrategias saludables para lidiar con emociones difíciles",
  "Me siento apoyado/a por las personas importantes en mi vida",
  "Puedo establecer límites saludables en mis relaciones",
  "Practico la gratitud y aprecio las cosas buenas de mi vida",
  "Me siento capaz de adaptarme a los cambios y transiciones"
];

const respuestasEAT = [
  { value: '0', label: 'Nunca' },
  { value: '1', label: 'Raramente' },
  { value: '2', label: 'A veces' },
  { value: '3', label: 'A menudo' },
  { value: '4', label: 'Muy a menudo' },
  { value: '5', label: 'Siempre' }
];

const respuestasBienestar = [
  { value: '1', label: 'Totalmente en desacuerdo' },
  { value: '2', label: 'En desacuerdo' },
  { value: '3', label: 'Neutral' },
  { value: '4', label: 'De acuerdo' },
  { value: '5', label: 'Totalmente de acuerdo' }
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
    const questionsLength = selectedCuestionario === 'eat-40' ? eat40Questions.length : bienestarQuestions.length;
    if (currentQuestion < questionsLength - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateEATScore = () => {
    const score = Object.values(respuestas).reduce((sum, value) => sum + parseInt(value), 0);
    return score;
  };

  const calculateBienestarScore = () => {
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

  const getBienestarInterpretation = (score: number) => {
    // Puntuación máxima: 75 (15 preguntas x 5 puntos)
    const percentage = (score / 75) * 100;
    
    if (percentage >= 80) {
      return {
        level: 'Excelente bienestar',
        message: 'Tu bienestar emocional está en un nivel muy saludable. Tienes herramientas sólidas para manejar la vida y te sientes generalmente satisfecho/a.',
        color: 'text-success',
        bgColor: 'bg-success-soft',
        percentage: Math.round(percentage),
        recommendations: [
          'Mantén tus prácticas actuales de autocuidado',
          'Comparte tus estrategias con otros',
          'Considera ser mentor de alguien que necesite apoyo',
          'Continúa cultivando tu crecimiento personal'
        ]
      };
    } else if (percentage >= 60) {
      return {
        level: 'Buen bienestar',
        message: 'Tu bienestar emocional está en un nivel saludable, con algunas áreas donde puedes seguir creciendo y fortaleciéndote.',
        color: 'text-primary',
        bgColor: 'bg-primary-soft',
        percentage: Math.round(percentage),
        recommendations: [
          'Explora nuestros talleres de gestión emocional',
          'Dedica más tiempo al autocuidado diario',
          'Practica técnicas de mindfulness regularmente',
          'Fortalece tus relaciones cercanas'
        ]
      };
    } else if (percentage >= 40) {
      return {
        level: 'Bienestar moderado',
        message: 'Hay varias áreas de tu bienestar emocional que se beneficiarían de atención y cuidado. Es un buen momento para implementar nuevas estrategias.',
        color: 'text-warning',
        bgColor: 'bg-warning-soft',
        percentage: Math.round(percentage),
        recommendations: [
          'Considera hablar con un profesional de salud mental',
          'Usa nuestros recursos de autocuidado diariamente',
          'Practica ejercicios de respiración y relajación',
          'Busca apoyo en tu comunidad o círculo cercano'
        ]
      };
    } else {
      return {
        level: 'Necesita atención',
        message: 'Tu bienestar emocional indica que podrías beneficiarte significativamente de apoyo adicional y estrategias de cuidado personal.',
        color: 'text-destructive',
        bgColor: 'bg-destructive-soft',
        percentage: Math.round(percentage),
        recommendations: [
          'Te recomendamos encarecidamente buscar apoyo profesional',
          'Usa nuestros recursos de crisis si es necesario',
          'Contacta con personas de confianza en tu vida',
          'Practica el autocuidado básico: sueño, alimentación, hidratación'
        ]
      };
    }
  };

  const resetQuestionario = () => {
    setShowResults(false);
    setSelectedCuestionario(null);
    setCurrentQuestion(0);
    setRespuestas({});
  };

  // Resultados para Bienestar Emocional
  if (showResults && selectedCuestionario === 'bienestar') {
    const score = calculateBienestarScore();
    const interpretation = getBienestarInterpretation(score);

    return (
      <div className="min-h-screen bg-gradient-calm p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6 pt-4">
            <Button variant="ghost" size="sm" onClick={resetQuestionario}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-heading text-lg font-medium text-foreground">
              Resultados Bienestar
            </h1>
            <div></div>
          </div>

          <div className="space-y-6">
            <Card className={`${interpretation.bgColor} border-0`}>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{score}</div>
                    <div className="text-xs text-white/80">{interpretation.percentage}%</div>
                  </div>
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
                      <Heart className="w-5 h-5 text-primary mt-0.5" />
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
                onClick={resetQuestionario}
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

  // Resultados para EAT-40
  if (showResults && selectedCuestionario === 'eat-40') {
    const score = calculateEATScore();
    const interpretation = getEATInterpretation(score);

    return (
      <div className="min-h-screen bg-gradient-calm p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6 pt-4">
            <Button variant="ghost" size="sm" onClick={resetQuestionario}>
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
                onClick={resetQuestionario}
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

  // Vista del cuestionario activo
  if (selectedCuestionario) {
    const questions = selectedCuestionario === 'eat-40' ? eat40Questions : bienestarQuestions;
    const respuestasOptions = selectedCuestionario === 'eat-40' ? respuestasEAT : respuestasBienestar;
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-calm p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6 pt-4">
            <Button variant="ghost" size="sm" onClick={resetQuestionario}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-heading text-lg font-medium text-foreground">
              {selectedCuestionario === 'eat-40' ? 'EAT-40' : 'Bienestar Emocional'}
            </h1>
            <div className="text-sm text-muted-foreground">
              {currentQuestion + 1}/{questions.length}
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
                  {questions[currentQuestion]}
                </h3>

                <RadioGroup 
                  value={respuestas[currentQuestion] || ''} 
                  onValueChange={(value) => handleAnswer(currentQuestion, value)}
                >
                  <div className="space-y-3">
                    {respuestasOptions.map((respuesta) => (
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
              {currentQuestion < questions.length - 1 ? 'Siguiente' : 'Ver resultados'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Vista principal de cuestionarios
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