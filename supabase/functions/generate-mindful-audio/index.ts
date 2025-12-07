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
      console.error('[generate-mindful-audio] No authorization header')
      return new Response(
        JSON.stringify({ error: 'No autorizado', message: 'Debes iniciar sesión para generar audio' }),
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
      console.error('[generate-mindful-audio] Auth error:', authError?.message)
      return new Response(
        JSON.stringify({ error: 'No autorizado', message: 'Sesión inválida' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`[generate-mindful-audio] Usuario autenticado: ${user.id}`)

    // 3. Verificar suscripción y límites
    const adminClient = createClient(supabaseUrl, supabaseServiceKey)
    const { data: subscription, error: subError } = await adminClient
      .from('subscriptions')
      .select('tier, monthly_audio_count, last_reset_date')
      .eq('user_id', user.id)
      .single()

    if (subError || !subscription) {
      console.error('[generate-mindful-audio] Error obteniendo suscripción:', subError?.message)
      return new Response(
        JSON.stringify({ error: 'Error de suscripción', message: 'No se pudo verificar tu suscripción' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const limit = AUDIO_LIMITS[subscription.tier] ?? 0
    const currentCount = subscription.monthly_audio_count ?? 0

    console.log(`[generate-mindful-audio] Tier: ${subscription.tier}, Uso: ${currentCount}/${limit}`)

    // Verificar límite
    if (limit !== -1 && currentCount >= limit) {
      console.warn(`[generate-mindful-audio] Límite alcanzado para usuario ${user.id}`)
      return new Response(
        JSON.stringify({ 
          error: 'LIMIT_REACHED',
          message: limit === 0 
            ? 'Tu plan gratuito no incluye generación de audio. Mejora a Básico o Premium.'
            : `Has alcanzado tu límite de ${limit} audios este mes. Mejora a Premium para audio ilimitado.`,
          current_tier: subscription.tier,
          current_count: currentCount,
          limit: limit,
          upgrade_required: subscription.tier === 'FREE' ? 'BASIC' : 'PREMIUM'
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 4. Obtener parámetros de audio
    const { text, voiceId = "Aria" } = await req.json()

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Texto requerido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY')
    if (!ELEVENLABS_API_KEY) {
      console.error('[generate-mindful-audio] ElevenLabs API key no configurada')
      return new Response(
        JSON.stringify({ error: 'Servicio de audio no disponible' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mapear nombres de voces a IDs de ElevenLabs
    const voiceIds: Record<string, string> = {
      "Aria": "9BWtsMINqrJLrRacOk9x",
      "Sarah": "EXAVITQu4vr4xnSDxMaL", 
      "Laura": "FGY2WhTYpPnrIDTdsKH5",
      "Charlotte": "XB0fDUnXU5powFXDhCwa",
      "Alice": "Xb7hH8MSUJpSbSDYk0k2"
    }

    const selectedVoiceId = voiceIds[voiceId] || voiceIds["Sarah"]

    // 5. Generar audio con ElevenLabs
    console.log(`[generate-mindful-audio] Generando audio con voz: ${voiceId}`)
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
          style: 0.2,
          use_speaker_boost: false
        }
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[generate-mindful-audio] ElevenLabs error:', error)
      return new Response(
        JSON.stringify({ error: 'No se pudo generar el audio' }),
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
      console.error('[generate-mindful-audio] Error actualizando contador:', updateError.message)
    } else {
      console.log(`[generate-mindful-audio] Contador actualizado: ${currentCount + 1}`)
    }

    const audioBuffer = await response.arrayBuffer()
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))

    console.log(`[generate-mindful-audio] Audio generado exitosamente`)

    return new Response(
      JSON.stringify({ 
        audio: base64Audio,
        voiceUsed: voiceId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[generate-mindful-audio] Error:', error)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
