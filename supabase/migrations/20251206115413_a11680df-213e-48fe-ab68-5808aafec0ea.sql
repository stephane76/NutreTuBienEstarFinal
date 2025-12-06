-- Añadir política INSERT para subscriptions
-- Permite a usuarios crear su propia suscripción (necesario para el trigger de nuevos usuarios)
CREATE POLICY "Users can insert their own subscription"
ON public.subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);