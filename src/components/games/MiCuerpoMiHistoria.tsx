import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Smile, Frown, Lightbulb } from 'lucide-react';

export function MiCuerpoMiHistoria() {
  const [paso, setPaso] = useState(1);
  const [momentoFeliz, setMomentoFeliz] = useState('');
  const [sensacionFeliz, setSensacionFeliz] = useState('');
  const [momentoDificil, setMomentoDificil] = useState('');
  const [apoyCuerpo, setApoyCuerpo] = useState('');
  const [cartaAgradecimiento, setCartaAgradecimiento] = useState('');
  const [completado, setCompletado] = useState(false);

  const siguientePaso = () => {
    setPaso(paso + 1);
  };

  const finalizar = () => {
    setCompletado(true);
  };

  const reiniciar = () => {
    setPaso(1);
    setMomentoFeliz('');
    setSensacionFeliz('');
    setMomentoDificil('');
    setApoyCuerpo('');
    setCartaAgradecimiento('');
    setCompletado(false);
  };

  if (completado) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-600" />
              <CardTitle>Tu historia corporal</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Tu reflexión completa:</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <strong>Momento feliz:</strong> {momentoFeliz}
                  <br />
                  <strong>Sensaciones:</strong> {sensacionFeliz}
                </div>
                
                <div>
                  <strong>Momento difícil:</strong> {momentoDificil}
                  <br />
                  <strong>Cómo te apoyó tu cuerpo:</strong> {apoyCuerpo}
                </div>
                
                <div className="bg-pink-50 p-3 rounded">
                  <strong>Tu carta de agradecimiento:</strong>
                  <p className="mt-2 italic">"{cartaAgradecimiento}"</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Reflexiones para ti:</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• ¿Qué sentiste al pensar en tu cuerpo como un compañero en lugar de un adversario?</p>
                <p>• ¿Qué historias de fortaleza, resiliencia o alegría guarda tu cuerpo?</p>
                <p>• ¿Qué es lo más amable que podrías hacer por tu cuerpo hoy?</p>
              </div>
            </div>

            <div className="bg-pink-50 p-4 rounded-lg">
              <p className="text-sm text-pink-800">
                <Heart className="w-4 h-4 inline mr-2" />
                <strong>Recuerda:</strong> Este ejercicio fomenta la gratitud corporal y la neutralidad, 
                moviendo el foco de la crítica estética a la apreciación funcional y experiencial. 
                Te ayuda a sentirte más "en casa" en tu propio cuerpo.
              </p>
            </div>

            <Button onClick={reiniciar} className="w-full">
              Crear nueva historia
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
            <Heart className="w-6 h-6 text-pink-600" />
            <CardTitle>Mi cuerpo, mi historia</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Reconstruye tu relación con tu cuerpo a través de una narrativa personal, 
            enfocada en sus funciones, sensaciones y experiencias.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Badge variant="outline" className="mb-4">
            Paso {paso} de 5
          </Badge>

          {paso === 1 && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  Busca un lugar tranquilo donde te sientas cómoda. Respira profundamente 
                  un par de veces. Piensa en tu cuerpo no como un objeto que se ve, sino como 
                  el compañero que ha estado contigo en cada momento de tu vida.
                </p>
              </div>
              
              <Button onClick={siguientePaso} className="w-full">
                Estoy lista para comenzar
              </Button>
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Smile className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold">Momento feliz</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Recuerda un momento feliz: un abrazo, una risa a carcajadas, un baile, 
                  un paseo por la naturaleza. Describe ese momento:
                </p>
                <Textarea
                  placeholder="Ej: El día que bailé bajo la lluvia con mis amigos..."
                  value={momentoFeliz}
                  onChange={(e) => setMomentoFeliz(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <Button 
                onClick={siguientePaso} 
                className="w-full"
                disabled={!momentoFeliz.trim()}
              >
                Continuar
              </Button>
            </div>
          )}

          {paso === 3 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  ¿Qué sentía tu cuerpo en ese momento feliz? ¿Calidez, energía, ligereza?
                </p>
                <Textarea
                  placeholder="Ej: Sentía una energía increíble, mis músculos estaban relajados, mi corazón latía con alegría..."
                  value={sensacionFeliz}
                  onChange={(e) => setSensacionFeliz(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={siguientePaso} 
                className="w-full"
                disabled={!sensacionFeliz.trim()}
              >
                Siguiente
              </Button>
            </div>
          )}

          {paso === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Frown className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Momento difícil</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ahora piensa en un momento difícil. Describe brevemente esa situación:
                </p>
                <Textarea
                  placeholder="Ej: Cuando perdí a mi mascota y me sentía muy triste..."
                  value={momentoDificil}
                  onChange={(e) => setMomentoDificil(e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  ¿Cómo te sostuvo tu cuerpo? Quizás tus piernas te llevaron lejos de un lugar triste, 
                  o tus brazos te permitieron abrazar a alguien que querías:
                </p>
                <Textarea
                  placeholder="Ej: Mis brazos pudieron abrazar a mi familia, mis ojos pudieron llorar y liberar el dolor..."
                  value={apoyCuerpo}
                  onChange={(e) => setApoyCuerpo(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={siguientePaso} 
                className="w-full"
                disabled={!momentoDificil.trim() || !apoyCuerpo.trim()}
              >
                Último paso
              </Button>
            </div>
          )}

          {paso === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold">Carta de agradecimiento</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Escribe una pequeña carta dirigida a tu cuerpo, agradeciéndole por algo 
                  que ha hecho por ti hoy o en el pasado:
                </p>
                <Textarea
                  placeholder="Ej: Querido cuerpo, gracias por permitirme sentir el calor del sol hoy, por sostenerme cuando estaba triste..."
                  value={cartaAgradecimiento}
                  onChange={(e) => setCartaAgradecimiento(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              
              <Button 
                onClick={finalizar} 
                className="w-full"
                disabled={!cartaAgradecimiento.trim()}
              >
                Completar mi historia
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}