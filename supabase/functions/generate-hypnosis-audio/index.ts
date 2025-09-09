import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { script, voiceSettings, sessionTitle } = await req.json()
    
    if (!script) {
      throw new Error('Script is required')
    }

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY')
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not configured')
    }

    // Format script for better TTS narration
    const formatScriptForTTS = (text: string): string => {
      return text
        .replace(/\.\.\./g, '... <break time="1s"/>') // Pausas para puntos suspensivos
        .replace(/PAUSA DE (\d+) SEGUNDOS/g, '<break time="$1s"/>') // Pausas específicas
        .replace(/\n\n/g, ' <break time="0.5s"/> ') // Pausas entre párrafos
        .replace(/\n/g, ' ') // Eliminar saltos de línea simples
        .trim();
    };

    const formattedScript = formatScriptForTTS(script);

    // Use Aria voice (best for Spanish hypnosis) - Voice ID: 9BWtsMINqrJLrRacOk9x
    const voiceId = '9BWtsMINqrJLrRacOk9x'; // Aria - Perfect for therapeutic content
    
    // Call ElevenLabs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: formattedScript,
        model_id: 'eleven_multilingual_v2', // Best model for Spanish
        voice_settings: {
          stability: voiceSettings?.stability || 0.85, // High stability for hypnosis
          similarity_boost: voiceSettings?.similarity_boost || 0.75,
          style: voiceSettings?.style || 0.20, // Low style for consistent tone
          use_speaker_boost: voiceSettings?.use_speaker_boost || true
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    // Get the audio data
    const audioBuffer = await response.arrayBuffer();
    
    console.log(`Successfully generated audio for "${sessionTitle}" - Size: ${audioBuffer.byteLength} bytes`);

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('Error generating hypnosis audio:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate audio',
        details: 'Check server logs for more information'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
})