import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubscriptionCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <XCircle className="h-16 w-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Pago cancelado</CardTitle>
          <CardDescription className="text-base">
            No se ha realizado ningún cargo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Puedes volver a intentarlo cuando quieras. Tu cuenta sigue activa con el plan actual.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate('/planes')} className="w-full">
              Ver planes disponibles
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Volver al inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
