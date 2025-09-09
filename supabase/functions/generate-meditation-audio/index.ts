import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voiceId = 'EXAVITQu4vr4xnSDxMaL', modelId = 'eleven_multilingual_v2' } = await req.json()
    
    // Get API key from Supabase secrets
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY')
    
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not configured')
    }

    // Call ElevenLabs API
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
          stability: 0.85, // Voz estable y serena
          similarity_boost: 0.75, // Mantiene características naturales  
          style: 0.2, // Estilo suave para meditación
          use_speaker_boost: true
        }
      }),
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`)
    }

    // Get audio blob
    const audioBlob = await response.blob()
    
    // Convert to base64 for JSON response
    const arrayBuffer = await audioBlob.arrayBuffer()
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    return new Response(
      JSON.stringify({ 
        success: true, 
        audioData: base64Audio,
        contentType: 'audio/mpeg'
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    )

  } catch (error) {
    console.error('Error generating audio:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    )
  }
})