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
      console.error('[generate-hypnosis-audio] No authorization header')
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
      console.error('[generate-hypnosis-audio] Auth error:', authError?.message)
      return new Response(
        JSON.stringify({ error: 'No autorizado', message: 'Sesión inválida' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`[generate-hypnosis-audio] Usuario autenticado: ${user.id}`)

    // 3. Verificar suscripción y límites (usar service role para leer)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey)
    const { data: subscription, error: subError } = await adminClient
      .from('subscriptions')
      .select('tier, monthly_audio_count, last_reset_date')
      .eq('user_id', user.id)
      .single()

    if (subError || !subscription) {
      console.error('[generate-hypnosis-audio] Error obteniendo suscripción:', subError?.message)
      return new Response(
        JSON.stringify({ error: 'Error de suscripción', message: 'No se pudo verificar tu suscripción' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const limit = AUDIO_LIMITS[subscription.tier] ?? 0
    const currentCount = subscription.monthly_audio_count ?? 0

    console.log(`[generate-hypnosis-audio] Tier: ${subscription.tier}, Uso: ${currentCount}/${limit}`)

    // Verificar límite (si no es ilimitado)
    if (limit !== -1 && currentCount >= limit) {
      console.warn(`[generate-hypnosis-audio] Límite alcanzado para usuario ${user.id}`)
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
    const { script, voiceSettings, sessionTitle } = await req.json()
    
    if (!script) {
      return new Response(
        JSON.stringify({ error: 'Script requerido', message: 'Debes proporcionar el script para generar audio' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY')
    if (!ELEVENLABS_API_KEY) {
      console.error('[generate-hypnosis-audio] ElevenLabs API key no configurada')
      return new Response(
        JSON.stringify({ error: 'Configuración inválida', message: 'Servicio de audio no disponible' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Format script for better TTS narration
    const formatScriptForTTS = (text: string): string => {
      return text
        .replace(/\.\.\./g, '... <break time="1s"/>')
        .replace(/PAUSA DE (\d+) SEGUNDOS/g, '<break time="$1s"/>')
        .replace(/\n\n/g, ' <break time="0.5s"/> ')
        .replace(/\n/g, ' ')
        .trim()
    }

    const formattedScript = formatScriptForTTS(script)
    const voiceId = '9BWtsMINqrJLrRacOk9x' // Aria - Perfect for therapeutic content
    
    // 5. Generar audio con ElevenLabs
    console.log(`[generate-hypnosis-audio] Generando audio para: "${sessionTitle}"`)
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: formattedScript,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: voiceSettings?.stability || 0.85,
          similarity_boost: voiceSettings?.similarity_boost || 0.75,
          style: voiceSettings?.style || 0.20,
          use_speaker_boost: voiceSettings?.use_speaker_boost || true
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[generate-hypnosis-audio] ElevenLabs error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Error de generación', message: 'No se pudo generar el audio' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 6. Incrementar contador de uso (con service role)
    const { error: updateError } = await adminClient
      .from('subscriptions')
      .update({ 
        monthly_audio_count: currentCount + 1,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('[generate-hypnosis-audio] Error actualizando contador:', updateError.message)
    } else {
      console.log(`[generate-hypnosis-audio] Contador actualizado: ${currentCount + 1}`)
    }

    const audioBuffer = await response.arrayBuffer()
    console.log(`[generate-hypnosis-audio] Audio generado: "${sessionTitle}" - ${audioBuffer.byteLength} bytes`)

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    })

  } catch (error) {
    console.error('[generate-hypnosis-audio] Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error interno',
        details: 'Check server logs for more information'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
