import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Eye, Lightbulb, Heart } from 'lucide-react';

const situacionesEjemplo = [
  "Una situación en la que sentiste descontrol con la comida",
  "Un momento frente al espejo que te generó malestar",
  "Una ocasión en la que evitaste una comida social"
];

export function CartasLoQueNoSeVe() {
  const [cartaSeleccionada, setCartaSeleccionada] = useState<number | null>(null);
  const [situacionPersonal, setSituacionPersonal] = useState('');
  const [emocion, setEmocion] = useState('');
  const [pensamiento, setPensamiento] = useState('');
  const [necesidad, setNecesidad] = useState('');
  const [paso, setPaso] = useState(1);

  const seleccionarCarta = (indice: number) => {
    setCartaSeleccionada(indice);
    setPaso(2);
  };

  const siguientePaso = () => {
    setPaso(paso + 1);
  };

  const reiniciar = () => {
    setCartaSeleccionada(null);
    setSituacionPersonal('');
    setEmocion('');
    setPensamiento('');
    setNecesidad('');
    setPaso(1);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-blue-600" />
            <CardTitle>Cartas: Lo que no se ve</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Ayúdate a visualizar y comprender las emociones y pensamientos que se esconden 
            detrás de tus conductas alimentarias.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {paso === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Imagina que tienes frente a ti tres cartas boca abajo. Cada una representa una 
                situación reciente que te haya generado incomodidad. Elige una carta:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {situacionesEjemplo.map((situacion, indice) => (
                  <Card 
                    key={indice}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary"
                    onClick={() => seleccionarCarta(indice)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold">{indice + 1}</span>
                      </div>
                      <p className="text-sm">{situacion}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-4">
              <Badge variant="outline" className="mb-4">
                Carta {cartaSeleccionada! + 1} seleccionada
              </Badge>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Describe brevemente la situación específica que elegiste:
                </label>
                <Textarea
                  placeholder="Ej: Ayer por la noche, después de un día estresante en el trabajo..."
                  value={situacionPersonal}
                  onChange={(e) => setSituacionPersonal(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <Button 
                onClick={siguientePaso} 
                className="w-full"
                disabled={!situacionPersonal.trim()}
              >
                Continuar explorando
              </Button>
            </div>
          )}

          {paso === 3 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  ¿Qué emoción estabas sintiendo en ese momento?
                </label>
                <p className="text-xs text-muted-foreground">
                  No te juzgues, solo observa. Puede ser miedo, soledad, enfado, ansiedad, tristeza...
                </p>
                <Textarea
                  placeholder="Ej: Sentía una profunda soledad y ansiedad..."
                  value={emocion}
                  onChange={(e) => setEmocion(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={siguientePaso} 
                className="w-full"
                disabled={!emocion.trim()}
              >
                Profundizar más
              </Button>
            </div>
          )}

          {paso === 4 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Debajo de esa emoción, ¿qué pensamiento había?
                </label>
                <p className="text-xs text-muted-foreground">
                  Quizás era algo como "no soy suficiente", "no tengo control", "nadie me entiende"...
                </p>
                <Textarea
                  placeholder="Ej: Pensaba que no era suficiente, que había fallado otra vez..."
                  value={pensamiento}
                  onChange={(e) => setPensamiento(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={siguientePaso} 
                className="w-full"
                disabled={!pensamiento.trim()}
              >
                Último paso
              </Button>
            </div>
          )}

          {paso === 5 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  ¿Qué necesidad había detrás de todo esto?
                </label>
                <p className="text-xs text-muted-foreground">
                  Una necesidad de sentir control, seguridad, calma, compañía, comprensión...
                </p>
                <Textarea
                  placeholder="Ej: Necesitaba sentirme acompañada y comprendida..."
                  value={necesidad}
                  onChange={(e) => setNecesidad(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={siguientePaso} 
                className="w-full"
                disabled={!necesidad.trim()}
              >
                Ver reflexiones
              </Button>
            </div>
          )}

          {paso === 6 && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Lo que descubriste
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Situación:</strong> {situacionPersonal}
                  </div>
                  <div>
                    <strong>Emoción:</strong> {emocion}
                  </div>
                  <div>
                    <strong>Pensamiento:</strong> {pensamiento}
                  </div>
                  <div>
                    <strong>Necesidad oculta:</strong> {necesidad}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Reflexiones para ti:</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• ¿Qué descubriste sobre tus emociones en esta situación?</p>
                  <p>• ¿Hay alguna emoción o pensamiento que se repita en otras situaciones?</p>
                  <p>• ¿De qué otra manera podrías haber atendido esa necesidad que no fuera a través de la comida?</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Heart className="w-4 h-4 inline mr-2" />
                  <strong>Recuerda:</strong> Esta dinámica te ayuda a desarrollar la autoconciencia, 
                  separando tus acciones de tus emociones. Tus conductas son intentos de gestionar 
                  sentimientos difíciles, y eso es completamente humano.
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={reiniciar} variant="outline" className="flex-1">
                  Explorar otra carta
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}