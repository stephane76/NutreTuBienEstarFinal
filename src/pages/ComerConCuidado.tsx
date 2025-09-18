import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/BackButton';
import { ImageUpload } from '@/components/ImageUpload';
import { EmotionWheel } from '@/components/EmotionWheel';
import { Avatar } from '@/components/Avatar';
import { toast } from '@/hooks/use-toast';
import { useImageRecognition } from '@/hooks/useImageRecognition';
import { useEmotionalAnalysis } from '@/hooks/useEmotionalAnalysis';
import {
  Utensils,
  Brain,
  Heart,
  Clock,
  MapPin,
  Lightbulb,
  Sparkles
} from 'lucide-react';

interface HungerType {
  id: string;
  label: string;
  icon: any;
  description: string;
  color: string;
}

const hungerTypes: HungerType[] = [
  {
    id: 'fisica',
    label: 'Hambre Física',
    icon: Utensils,
    description: 'Sensación física de necesitar alimento',
    color: 'from-green-400 to-green-500'
  },
  {
    id: 'emocional',
    label: 'Hambre Emocional',
    icon: Heart,
    description: 'Deseo de comer por emociones',
    color: 'from-ochre-400 to-ochre-500'
  },
  {
    id: 'social',
    label: 'Hambre Social',
    icon: Brain,
    description: 'Comer por contexto social',
    color: 'from-yellow-400 to-yellow-500'
  },
  {
    id: 'habito',
    label: 'Hábito/Rutina',
    icon: Clock,
    description: 'Comer por costumbre horaria',
    color: 'from-green-300 to-green-400'
  }
];

export default function ComerConCuidado() {
  const navigate = useNavigate();
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [emotionIntensity, setEmotionIntensity] = useState<number[]>([5]);
  const [hungerLevel, setHungerLevel] = useState<number[]>([5]);
  const [hungerType, setHungerType] = useState<string>('');
  const [foodItems, setFoodItems] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  const { analyzeFoodImage } = useImageRecognition();
  const { analyzeText } = useEmotionalAnalysis();

  const handleFoodImageAnalysis = async (result: any) => {
    if (result.detected_foods && result.detected_foods.length > 0) {
      const detectedFoodNames = result.detected_foods.map((food: any) => food.name).join(', ');
      setFoodItems(detectedFoodNames);
      setAnalysisResult(result);
      
      toast({
        title: "Alimentos detectados",
        description: `Se detectaron: ${detectedFoodNames}`,
      });
    }
  };

  const handleSaveEntry = async () => {
    const emotionalAnalysis = await analyzeText(`${notes} ${location}`.trim(), selectedEmotion);

    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      emotion: selectedEmotion,
      emotionIntensity: emotionIntensity[0],
      hungerLevel: hungerLevel[0],
      hungerType,
      foodItems,
      location,
      notes,
      analysisResult,
      emotionalAnalysis,
      type: 'mindful-eating'
    };

    // Guardar en localStorage
    const existingEntries = JSON.parse(localStorage.getItem('mindfulEatingEntries') || '[]');
    existingEntries.push(entry);
    localStorage.setItem('mindfulEatingEntries', JSON.stringify(existingEntries));

    toast({
      title: "Registro guardado",
      description: "Tu experiencia de comer consciente ha sido registrada",
    });

    navigate('/dashboard');
  };

  const canSubmit = selectedEmotion && hungerType;

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-brand/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-ochre-600" />
            <span className="text-ochre-700 font-semibold">Comer con Cuidado</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Registro Consciente
          </h1>
          <p className="text-muted-foreground">
            Conecta con tus emociones y hambre para una relación saludable con la comida
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Avatar Guidance */}
          <Avatar 
            message="Te acompaño en este momento de conexión contigo mismo. Vamos a explorar juntos tu experiencia con la comida."
            mood="supportive"
          />

          {/* Emotion Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-ochre-600" />
                ¿Cómo te sientes?
              </CardTitle>
              <CardDescription>
                Identifica tu estado emocional actual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <EmotionWheel
                selectedEmotion={selectedEmotion}
                onEmotionSelect={setSelectedEmotion}
              />
              
              {selectedEmotion && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Intensidad: {emotionIntensity[0]}/10
                  </label>
                  <Slider
                    value={emotionIntensity}
                    onValueChange={setEmotionIntensity}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hunger Assessment */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-600" />
                Detector de Hambre
              </CardTitle>
              <CardDescription>
                Identifica qué tipo de hambre experimentas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-4 block">
                  Nivel de hambre física: {hungerLevel[0]}/10
                </label>
                <Slider
                  value={hungerLevel}
                  onValueChange={setHungerLevel}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-4 block">
                  Tipo de hambre que sientes:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hungerTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setHungerType(type.id)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                          hungerType === type.id
                            ? 'border-ochre-500 bg-ochre-50 shadow-md'
                            : 'border-border hover:border-ochre-300 bg-card'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${type.color}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{type.label}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Food Registration */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-yellow-600" />
                Registro de Alimentos
              </CardTitle>
              <CardDescription>
                Documenta qué comes de forma consciente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Alimentos (escribe o toma foto)
                </label>
                <Textarea
                  value={foodItems}
                  onChange={(e) => setFoodItems(e.target.value)}
                  placeholder="Ejemplo: Ensalada verde con aguacate, pan integral..."
                  className="min-h-[100px]"
                />
              </div>

              <ImageUpload
                onImageSelect={(file) => analyzeFoodImage(file).then(handleFoodImageAnalysis)}
                label="O toma una foto de tu comida"
              />

              {analysisResult && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Análisis de imagen</h4>
                  <p className="text-sm text-green-700">
                    {analysisResult.nutritional_advice || 'Alimento registrado exitosamente'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Context */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ochre-600" />
                Contexto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Ubicación</label>
                <Textarea
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="¿Dónde estás comiendo? (casa, trabajo, restaurante...)"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notas adicionales</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="¿Qué más quieres recordar sobre este momento?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="text-center">
            <Button
              onClick={handleSaveEntry}
              disabled={!canSubmit}
              className="bg-gradient-brand hover:opacity-90 text-white px-8 py-3 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Lightbulb className="mr-2 h-5 w-5" />
              Guardar Registro Consciente
            </Button>
            
            {!canSubmit && (
              <p className="text-sm text-muted-foreground mt-2">
                Completa tu emoción y tipo de hambre para continuar
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}