import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowRight, RotateCcw, Lightbulb } from 'lucide-react';

const historias = [
  {
    id: 'espejo',
    titulo: 'Frente al espejo',
    inicio: 'Te levantas por la mañana y te diriges al baño. Al verte en el espejo, surge un pensamiento crítico sobre tu apariencia. Sientes una ola de malestar...',
    opciones: [
      {
        texto: 'Evitas mirarte y sales rápidamente del baño',
        continuacion: 'Sales del baño sintiéndote agitada. Durante el desayuno, esa sensación de malestar persiste y empiezas a cuestionar qué ponerte. Te das cuenta de que evitar el espejo no hizo que te sintieras mejor, solo trasladó la incomodidad a otras actividades.',
        reflexion: 'Evitar puede dar alivio momentáneo, pero a menudo el malestar se traslada a otras áreas. ¿Qué pasaría si te permitieras sentir esa incomodidad sin huir de ella?'
      },
      {
        texto: 'Te quedas frente al espejo y te hablas con compasión',
        continuacion: 'Respiras profundo y te dices: "Estoy teniendo un día difícil con mi imagen corporal, y está bien. Mi valor no está en mi apariencia". Aunque la incomodidad no desaparece completamente, sientes una sensación de calma interior.',
        reflexion: 'La autocompasión no elimina el malestar inmediatamente, pero cambia tu relación con él. Te permite estar presente con tus emociones difíciles de una manera más amable.'
      },
      {
        texto: 'Practicas gratitud hacia tu cuerpo',
        continuacion: 'Decides enfocarte en lo que tu cuerpo hace por ti: "Estos ojos me permiten ver un nuevo día, estas manos me ayudan a cuidarme". Gradualmente, el foco cambia de la crítica a la apreciación, y sales del baño con una perspectiva diferente.',
        reflexion: 'Cambiar el foco hacia la funcionalidad y gratitud corporal puede transformar momentos difíciles en oportunidades de conexión más profunda contigo misma.'
      }
    ]
  },
  {
    id: 'impulso-comida',
    titulo: 'Impulso intenso',
    inicio: 'Llegas a casa después de un día agotador. Abres la nevera y sientes un impulso muy fuerte de comer, aunque no tienes hambre física. Tu mente se acelera...',
    opciones: [
      {
        texto: 'Sigues el impulso sin pensar',
        continuacion: 'Comes rápidamente, sin prestar atención a los sabores o sensaciones. Al terminar, sientes culpa y frustración. Te das cuenta de que la sensación que te llevó a la nevera sigue ahí, sin resolver.',
        reflexion: 'Actuar desde el impulso puede proporcionar distracción temporal, pero rara vez resuelve la necesidad emocional subyacente. ¿Qué estabas sintiendo realmente antes de abrir la nevera?'
      },
      {
        texto: 'Cierras la nevera y respiras hondo',
        continuacion: 'Te alejas de la cocina y te sientas un momento. Respiras profundamente y te preguntas: "¿Qué estoy sintiendo realmente?". Identificas cansancio, soledad y estrés. Decides darte un baño relajante primero.',
        reflexion: 'Crear espacio entre el impulso y la acción te permite conectar con tus verdaderas necesidades. A veces lo que interpretamos como hambre es en realidad una necesidad emocional diferente.'
      },
      {
        texto: 'Llamas a una amiga',
        continuacion: 'Decides llamar a tu mejor amiga para contarle sobre tu día. Mientras hablas, te das cuenta de que necesitabas conexión y ser escuchada. El impulso de comer se desvanece gradualmente mientras te sientes acompañada.',
        reflexion: 'La conexión humana puede ser un poderoso antídoto para muchos impulsos emocionales. A veces lo que interpretamos como hambre es realmente hambre de compañía o comprensión.'
      }
    ]
  },
  {
    id: 'comentario-heriente',
    titulo: 'Comentario inesperado',
    inicio: 'Estás en una reunión familiar cuando alguien hace un comentario sobre tu apariencia o tu forma de comer. Sientes como si te hubieran golpeado en el estómago...',
    opciones: [
      {
        texto: 'Te guardas el dolor y finges que no te afectó',
        continuacion: 'Sonríes y cambias de tema, pero por dentro te sientes herida y enojada. Durante el resto de la reunión, te cuesta concentrarte en las conversaciones. Esa noche te cuesta dormir, dando vueltas al comentario.',
        reflexion: 'Reprimir el dolor emocional no lo hace desaparecer; a menudo se intensifica en privado. ¿Qué hubiera pasado si te hubieras permitido reconocer tu dolor, aunque sea solo para ti misma?'
      },
      {
        texto: 'Expresas cómo te hace sentir ese comentario',
        continuacion: 'Con voz temblorosa pero firme, dices: "Ese comentario me duele. No me siento cómoda cuando hablan de mi cuerpo". Aunque hay un momento incómodo, sientes alivio de haber puesto un límite.',
        reflexion: 'Poner límites puede ser incómodo al principio, pero te empodera y enseña a otros cómo tratarte. Tu bienestar emocional vale más que evitar momentos incómodos.'
      },
      {
        texto: 'Te disculpas y vas al baño para calmar tu sistema nervioso',
        continuacion: 'Te excusas amablemente y vas al baño. Allí respiras profundamente y te recuerdas: "Este comentario dice más sobre esa persona que sobre mí. No tengo que internalizar su perspectiva". Regresas sintiéndote más centrada.',
        reflexion: 'Tomar descansos para regularte emocionalmente es una estrategia válida de autocuidado. No tienes que procesar todo en el momento; puedes darte tiempo y espacio para responder desde la calma.'
      }
    ]
  }
];

export function HistoriasEncadenadas() {
  const [historiaActual, setHistoriaActual] = useState<number>(0);
  const [opcionElegida, setOpcionElegida] = useState<number | null>(null);
  const [mostrarReflexion, setMostrarReflexion] = useState(false);
  const [historiasCompletadas, setHistoriasCompletadas] = useState<number[]>([]);

  const elegirOpcion = (indiceOpcion: number) => {
    setOpcionElegida(indiceOpcion);
    setMostrarReflexion(true);
  };

  const explorarOtraOpcion = () => {
    setOpcionElegida(null);
    setMostrarReflexion(false);
  };

  const siguienteHistoria = () => {
    if (!historiasCompletadas.includes(historiaActual)) {
      setHistoriasCompletadas([...historiasCompletadas, historiaActual]);
    }
    
    if (historiaActual < historias.length - 1) {
      setHistoriaActual(historiaActual + 1);
      setOpcionElegida(null);
      setMostrarReflexion(false);
    }
  };

  const seleccionarHistoria = (indice: number) => {
    setHistoriaActual(indice);
    setOpcionElegida(null);
    setMostrarReflexion(false);
  };

  const reiniciar = () => {
    setHistoriaActual(0);
    setOpcionElegida(null);
    setMostrarReflexion(false);
    setHistoriasCompletadas([]);
  };

  const historia = historias[historiaActual];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <CardTitle>Historias encadenadas</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Explora de forma creativa y segura diferentes respuestas ante situaciones desafiantes.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selector de historias */}
          <div className="flex flex-wrap gap-2 mb-4">
            {historias.map((_, indice) => (
              <Button
                key={indice}
                variant={indice === historiaActual ? "default" : "outline"}
                size="sm"
                onClick={() => seleccionarHistoria(indice)}
                className="relative"
              >
                Historia {indice + 1}
                {historiasCompletadas.includes(indice) && (
                  <Badge className="absolute -top-2 -right-2 w-4 h-4 p-0 text-xs">✓</Badge>
                )}
              </Button>
            ))}
          </div>

          <Badge variant="outline" className="mb-4">
            {historia.titulo}
          </Badge>

          {/* Historia inicial */}
          <Card className="bg-muted/20">
            <CardContent className="p-6">
              <p className="text-sm leading-relaxed">
                {historia.inicio}
              </p>
            </CardContent>
          </Card>

          {!mostrarReflexion ? (
            /* Opciones para elegir */
            <div className="space-y-3">
              <h3 className="font-semibold text-center mb-4">¿Cómo respondes?</h3>
              {historia.opciones.map((opcion, indice) => (
                <Button
                  key={indice}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-4 hover:bg-primary/5"
                  onClick={() => elegirOpcion(indice)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                      {indice + 1}
                    </div>
                    <span className="text-sm">{opcion.texto}</span>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            /* Continuación y reflexión */
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="w-4 h-4 text-primary" />
                <span className="font-semibold">Elegiste: {historia.opciones[opcionElegida!].texto}</span>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Continuación:</h4>
                  <p className="text-sm text-blue-800">
                    {historia.opciones[opcionElegida!].continuacion}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-green-600" />
                    <h4 className="font-semibold text-green-800">Reflexión:</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    {historia.opciones[opcionElegida!].reflexion}
                  </p>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={explorarOtraOpcion}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Explorar otra opción
                </Button>
                
                {historiaActual < historias.length - 1 ? (
                  <Button onClick={siguienteHistoria} className="flex-1">
                    Siguiente historia
                  </Button>
                ) : (
                  <Button onClick={reiniciar} className="flex-1">
                    Empezar de nuevo
                  </Button>
                )}
              </div>
            </div>
          )}

          {historiasCompletadas.length === historias.length && (
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <p className="text-sm text-indigo-800 font-semibold">
                🎉 ¡Has explorado todas las historias!
              </p>
              <div className="mt-3 space-y-1 text-xs text-indigo-700">
                <p>• ¿Por qué elegiste esos caminos inicialmente?</p>
                <p>• ¿Cómo te sentiste al explorar las diferentes respuestas?</p>
                <p>• ¿Te dieron ideas nuevas sobre cómo reaccionar en situaciones similares?</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}