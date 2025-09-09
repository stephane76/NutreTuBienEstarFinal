import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

const mitos = [
  {
    afirmacion: "Tener un TCA es una elección y solo es cuestión de fuerza de voluntad para superarlo",
    esVerdad: false,
    explicacion: "Los TCA son condiciones de salud mental complejas con raíces biológicas, psicológicas y sociales. No son una elección y superarlos requiere apoyo profesional, no solo 'fuerza de voluntad'."
  },
  {
    afirmacion: "Solo las personas muy delgadas pueden tener un trastorno de la conducta alimentaria",
    esVerdad: false,
    explicacion: "Los TCA pueden afectar a personas de cualquier peso, forma, edad, género y origen. La apariencia física no determina la presencia o gravedad de un TCA."
  },
  {
    afirmacion: "Los TCA solo afectan a mujeres jóvenes",
    esVerdad: false,
    explicacion: "Aunque son más comunes en mujeres jóvenes, los TCA pueden afectar a personas de cualquier edad, género y trasfondo. Los hombres, adultos mayores y niños también pueden desarrollar TCA."
  },
  {
    afirmacion: "La recuperación completa de un TCA es posible",
    esVerdad: true,
    explicacion: "Sí, la recuperación completa es posible con el tratamiento adecuado y el apoyo necesario. Muchas personas se recuperan completamente y viven vidas plenas y saludables."
  },
  {
    afirmacion: "Los comentarios sobre el peso o la comida pueden ser desafiantes para alguien con un TCA",
    esVerdad: true,
    explicacion: "Los comentarios sobre peso, comida o apariencia pueden ser muy triggereantes para personas con TCA, incluso si están hechos con buenas intenciones."
  },
  {
    afirmacion: "Las personas con TCA simplemente buscan atención",
    esVerdad: false,
    explicacion: "Los TCA son enfermedades mentales serias, no un pedido de atención. Las personas con TCA a menudo se esfuerzan por ocultar sus síntomas debido a la vergüenza y el estigma."
  },
  {
    afirmacion: "Si alguien come normalmente en público, no puede tener un TCA",
    esVerdad: false,
    explicacion: "Muchas personas con TCA pueden comer 'normalmente' en público para ocultar sus síntomas. Los comportamientos restrictivos o compulsivos suelen ocurrir en privado."
  }
];

export function VerdadFalsoMitos() {
  const [indiceActual, setIndiceActual] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<boolean | null>(null);
  const [mostrarExplicacion, setMostrarExplicacion] = useState(false);
  const [puntuacion, setPuntuacion] = useState({ correctas: 0, total: 0 });
  const [completado, setCompletado] = useState(false);

  const responder = (respuesta: boolean) => {
    setRespuestaSeleccionada(respuesta);
    setMostrarExplicacion(true);
    
    const esCorrecta = respuesta === mitos[indiceActual].esVerdad;
    if (esCorrecta) {
      setPuntuacion(prev => ({ ...prev, correctas: prev.correctas + 1, total: prev.total + 1 }));
    } else {
      setPuntuacion(prev => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const siguiente = () => {
    if (indiceActual < mitos.length - 1) {
      setIndiceActual(indiceActual + 1);
      setRespuestaSeleccionada(null);
      setMostrarExplicacion(false);
    } else {
      setCompletado(true);
    }
  };

  const reiniciar = () => {
    setIndiceActual(0);
    setRespuestaSeleccionada(null);
    setMostrarExplicacion(false);
    setPuntuacion({ correctas: 0, total: 0 });
    setCompletado(false);
  };

  if (completado) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-green-600" />
              <CardTitle>¡Completado!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h3 className="text-2xl font-bold">Has terminado el juego</h3>
              <p className="text-muted-foreground">
                Obtuviste {puntuacion.correctas} de {puntuacion.total} respuestas correctas
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Reflexiones finales:</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• ¿Alguna de las explicaciones te sorprendió?</p>
                <p>• ¿Cómo te hace sentir saber que muchas creencias sobre los TCA son mitos?</p>
                <p>• ¿De qué manera este conocimiento puede cambiar la forma en que te hablas a ti misma?</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                <Lightbulb className="w-4 h-4 inline mr-2" />
                <strong>Recuerda:</strong> Derribar mitos reduce la vergüenza y el aislamiento. 
                No eres culpable y tu lucha es válida. Esto fomenta la búsqueda de ayuda y la autocompasión.
              </p>
            </div>

            <Button onClick={reiniciar} className="w-full">
              Jugar de nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mitoActual = mitos[indiceActual];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-green-600" />
            <CardTitle>Verdad o Falso: Mitos sobre los TCA</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Identifica y desafía creencias erróneas sobre los trastornos de la conducta alimentaria.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <Badge variant="outline">
              Pregunta {indiceActual + 1} de {mitos.length}
            </Badge>
            <Badge variant="secondary">
              {puntuacion.correctas}/{puntuacion.total} correctas
            </Badge>
          </div>

          <Card className="bg-muted/20">
            <CardContent className="p-6">
              <p className="text-lg font-medium text-center">
                "{mitoActual.afirmacion}"
              </p>
            </CardContent>
          </Card>

          {!mostrarExplicacion ? (
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => responder(true)}
                variant="outline"
                size="lg"
                className="flex-1 max-w-xs hover:bg-green-50 hover:border-green-500"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Verdad
              </Button>
              <Button
                onClick={() => responder(false)}
                variant="outline"
                size="lg"
                className="flex-1 max-w-xs hover:bg-red-50 hover:border-red-500"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Falso
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                respuestaSeleccionada === mitoActual.esVerdad 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {respuestaSeleccionada === mitoActual.esVerdad ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-semibold">
                    {respuestaSeleccionada === mitoActual.esVerdad ? '¡Correcto!' : 'Incorrecto'}
                  </span>
                </div>
                <p className="text-sm">
                  La respuesta correcta es: <strong>{mitoActual.esVerdad ? 'Verdad' : 'Falso'}</strong>
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Explicación:</h4>
                <p className="text-sm">{mitoActual.explicacion}</p>
              </div>

              <Button onClick={siguiente} className="w-full">
                {indiceActual < mitos.length - 1 ? 'Siguiente pregunta' : 'Ver resultados'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}