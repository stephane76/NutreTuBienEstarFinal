import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Límites por tier
const AUDIO_LIMITS: Record<string, number> = {
  FREE: 0,
  BASIC: 10,
  PREMIUM: -1 // ilimitado
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Verificar autenticación
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('[generate-meditation-audio] No authorization header')
      return new Response(
        JSON.stringify({ success: false, error: 'Debes iniciar sesión para generar audio' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Crear cliente Supabase con token del usuario
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      console.error('[generate-meditation-audio] Auth error:', authError?.message)
      return new Response(
        JSON.stringify({ success: false, error: 'Sesión inválida' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`[generate-meditation-audio] Usuario autenticado: ${user.id}`)

    // 3. Verificar suscripción y límites
    const adminClient = createClient(supabaseUrl, supabaseServiceKey)
    const { data: subscription, error: subError } = await adminClient
      .from('subscriptions')
      .select('tier, monthly_audio_count, last_reset_date')
      .eq('user_id', user.id)
      .single()

    if (subError || !subscription) {
      console.error('[generate-meditation-audio] Error obteniendo suscripción:', subError?.message)
      return new Response(
        JSON.stringify({ success: false, error: 'No se pudo verificar tu suscripción' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const limit = AUDIO_LIMITS[subscription.tier] ?? 0
    const currentCount = subscription.monthly_audio_count ?? 0

    console.log(`[generate-meditation-audio] Tier: ${subscription.tier}, Uso: ${currentCount}/${limit}`)

    // Verificar límite
    if (limit !== -1 && currentCount >= limit) {
      console.warn(`[generate-meditation-audio] Límite alcanzado para usuario ${user.id}`)
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'LIMIT_REACHED',
          message: limit === 0 
            ? 'Tu plan gratuito no incluye generación de audio. Mejora a Básico o Premium.'
            : `Has alcanzado tu límite de ${limit} audios este mes. Mejora a Premium para audio ilimitado.`,
          current_tier: subscription.tier,
          upgrade_required: subscription.tier === 'FREE' ? 'BASIC' : 'PREMIUM'
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 4. Obtener parámetros de audio
    const { text, voiceId = 'EXAVITQu4vr4xnSDxMaL', modelId = 'eleven_multilingual_v2' } = await req.json()
    
    if (!text) {
      return new Response(
        JSON.stringify({ success: false, error: 'Texto requerido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY')
    if (!ELEVENLABS_API_KEY) {
      console.error('[generate-meditation-audio] ElevenLabs API key no configurada')
      return new Response(
        JSON.stringify({ success: false, error: 'Servicio de audio no disponible' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 5. Generar audio con ElevenLabs
    console.log('[generate-meditation-audio] Generando audio de meditación')
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: 0.85,
          similarity_boost: 0.75,
          style: 0.2,
          use_speaker_boost: true
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[generate-meditation-audio] ElevenLabs error:', errorText)
      return new Response(
        JSON.stringify({ success: false, error: 'No se pudo generar el audio' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 6. Incrementar contador de uso
    const { error: updateError } = await adminClient
      .from('subscriptions')
      .update({ 
        monthly_audio_count: currentCount + 1,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('[generate-meditation-audio] Error actualizando contador:', updateError.message)
    } else {
      console.log(`[generate-meditation-audio] Contador actualizado: ${currentCount + 1}`)
    }

    // Get audio blob and convert to base64
    const audioBlob = await response.blob()
    const arrayBuffer = await audioBlob.arrayBuffer()
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    console.log(`[generate-meditation-audio] Audio generado exitosamente`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        audioData: base64Audio,
        contentType: 'audio/mpeg'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[generate-meditation-audio] Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
