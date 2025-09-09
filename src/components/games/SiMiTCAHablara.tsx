import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Volume2, Heart, Lightbulb } from 'lucide-react';

const ejemplosVozTCA = [
  "No deberías comer eso",
  "Has vuelto a fallar",
  "Todos te están juzgando por lo que comes",
  "No tienes suficiente autocontrol",
  "Eres demasiado débil"
];

export function SiMiTCAHablara() {
  const [paso, setPaso] = useState(1);
  const [pensamientoNegativo, setPensamientoNegativo] = useState('');
  const [nombreVozTCA, setNombreVozTCA] = useState('');
  const [respuestaVozSana, setRespuestaVozSana] = useState('');
  const [completado, setCompletado] = useState(false);
  const [ejemploSeleccionado, setEjemploSeleccionado] = useState('');

  const seleccionarEjemplo = (ejemplo: string) => {
    setPensamientoNegativo(ejemplo);
    setEjemploSeleccionado(ejemplo);
  };

  const siguientePaso = () => {
    setPaso(paso + 1);
  };

  const finalizar = () => {
    setCompletado(true);
  };

  const reiniciar = () => {
    setPaso(1);
    setPensamientoNegativo('');
    setNombreVozTCA('');
    setRespuestaVozSana('');
    setCompletado(false);
    setEjemploSeleccionado('');
  };

  const obtenerRespuestaSugerida = (pensamiento: string) => {
    const respuestas: { [key: string]: string } = {
      "No deberías comer eso": "Mi cuerpo necesita nutrición y energía. Puedo elegir qué comer desde la calma, no desde el miedo. Merezco nutrir mi cuerpo con amor.",
      "Has vuelto a fallar": "No se trata de fallar, sino de aprender. Estoy en un proceso de sanación y cada día hago lo mejor que puedo con las herramientas que tengo.",
      "Todos te están juzgando por lo que comes": "La gente a mi alrededor está disfrutando de su comida y de la compañía. Yo también merezco hacerlo. Mi valor no depende de lo que como.",
      "No tienes suficiente autocontrol": "El autocontrol no es lo que necesito, sino autocompasión. Mi relación con la comida es compleja y merece paciencia y comprensión.",
      "Eres demasiado débil": "Tener un TCA no me hace débil. De hecho, buscar ayuda y trabajar en mi recuperación requiere mucha valentía y fortaleza."
    };
    return respuestas[pensamiento] || "Esa voz crítica no define quién soy. Soy digna de amor y compasión, especialmente de la mía propia.";
  };

  if (completado) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-purple-600" />
              <CardTitle>Tu diálogo interno transformado</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-red-50 border-red-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-red-600" />
                    <h3 className="font-semibold text-red-800">Voz del TCA: "{nombreVozTCA}"</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-700 italic">"{pensamientoNegativo}"</p>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-green-600" />
                    <h3 className="font-semibold text-green-800">Tu voz sana</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-700 italic">"{respuestaVozSana}"</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Reflexiones para ti:</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• ¿Cómo se siente diferenciar estas dos voces?</p>
                <p>• ¿Qué características tiene tu voz sana? ¿Es tranquila, firme, cariñosa?</p>
                <p>• ¿Qué puedes hacer para darle más volumen a tu voz sana en el día a día?</p>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-800">
                <Lightbulb className="w-4 h-4 inline mr-2" />
                <strong>Recuerda:</strong> Esta técnica te permite distanciarte de los pensamientos negativos, 
                reduciendo su poder sobre ti. Fortalece tu capacidad de elegir a qué voz hacerle caso, 
                cultivando la autocompasión.
              </p>
            </div>

            <Button onClick={reiniciar} className="w-full">
              Practicar con otro pensamiento
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-purple-600" />
            <CardTitle>Si mi TCA hablara</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Aprende a diferenciar la voz crítica y exigente del TCA de tu propia voz sana y compasiva.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Badge variant="outline" className="mb-4">
            Paso {paso} de 4
          </Badge>

          {paso === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Piensa en un pensamiento negativo recurrente que tengas sobre ti, la comida o tu cuerpo. 
                Puedes elegir uno de estos ejemplos o escribir el tuyo propio:
              </p>

              <div className="grid grid-cols-1 gap-2">
                {ejemplosVozTCA.map((ejemplo, indice) => (
                  <Button
                    key={indice}
                    variant="outline"
                    className="text-left justify-start h-auto p-4"
                    onClick={() => seleccionarEjemplo(ejemplo)}
                  >
                    "{ejemplo}"
                  </Button>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">O escribe tu propio pensamiento:</p>
                <Textarea
                  placeholder="Ej: Nunca voy a ser suficiente..."
                  value={pensamientoNegativo}
                  onChange={(e) => setPensamientoNegativo(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={siguientePaso} 
                className="w-full"
                disabled={!pensamientoNegativo.trim()}
              >
                Continuar
              </Button>
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-800 font-medium">Pensamiento identificado:</p>
                <p className="text-red-700 italic">"{pensamientoNegativo}"</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ahora imagina que ese pensamiento es una "voz". Dale un nombre o una forma a esa voz del TCA. 
                  Puede ser un personaje, un color o un sonido. Esto te ayuda a verlo como algo externo a ti:
                </p>
                <Textarea
                  placeholder="Ej: La voz crítica gris, El juez interno, La voz del miedo..."
                  value={nombreVozTCA}
                  onChange={(e) => setNombreVozTCA(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={siguientePaso} 
                className="w-full"
                disabled={!nombreVozTCA.trim()}
              >
                Siguiente
              </Button>
            </div>
          )}

          {paso === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ahora, pregúntate: ¿Qué diría mi voz sana en esta situación? La voz sana es esa parte de ti 
                que es sabia, amable y que quiere tu bienestar. Suele ser más calmada y compasiva.
              </p>

              {ejemploSeleccionado && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 mb-1">Sugerencia:</p>
                  <p className="text-sm text-blue-800 italic">
                    "{obtenerRespuestaSugerida(ejemploSeleccionado)}"
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-sm font-medium">Tu respuesta de voz sana:</label>
                <Textarea
                  placeholder="Ej: Estás pasando por un momento difícil. ¿Qué necesitas ahora mismo para sentirte mejor?"
                  value={respuestaVozSana}
                  onChange={(e) => setRespuestaVozSana(e.target.value)}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Imagina qué le dirías a una amiga muy querida en tu misma situación.
                </p>
              </div>
              
              <Button 
                onClick={siguientePaso} 
                className="w-full"
                disabled={!respuestaVozSana.trim()}
              >
                Ver mi diálogo
              </Button>
            </div>
          )}

          {paso === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-center">Tu nuevo diálogo interno</h3>
              
              <div className="space-y-4">
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="w-4 h-4 text-red-600" />
                      <span className="font-semibold text-red-800">Voz del TCA: "{nombreVozTCA}"</span>
                    </div>
                    <p className="text-sm text-red-700 italic">"{pensamientoNegativo}"</p>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto">
                    →
                  </div>
                </div>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-800">Tu voz sana responde:</span>
                    </div>
                    <p className="text-sm text-green-700 italic">"{respuestaVozSana}"</p>
                  </CardContent>
                </Card>
              </div>

              <Button onClick={finalizar} className="w-full">
                Completar ejercicio
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}