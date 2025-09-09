// Servicio para generar audios con ElevenLabs usando Supabase Edge Functions

export interface AudioGenerationOptions {
  text: string;
  voiceId?: string;
  modelId?: string;
}

export class ElevenLabsService {
  private supabaseUrl: string;

  constructor() {
    // En producción, esto debería venir de variables de entorno
    this.supabaseUrl = 'https://your-project.supabase.co'; // Será reemplazado automáticamente
  }

  async generateAudio(options: AudioGenerationOptions): Promise<Blob> {
    const {
      text,
      voiceId = 'EXAVITQu4vr4xnSDxMaL', // Sarah - voz femenina suave
      modelId = 'eleven_multilingual_v2'
    } = options;

    try {
      const response = await fetch('/api/generate-meditation-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId,
          modelId
        }),
      });

      if (!response.ok) {
        throw new Error(`Error generating audio: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error generating audio');
      }

      // Convert base64 back to blob
      const binaryString = atob(data.audioData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      return new Blob([bytes], { type: 'audio/mpeg' });

    } catch (error) {
      console.error('Error calling edge function:', error);
      // Fallback: generate audio directly (less secure but functional)
      return this.generateAudioDirect(options);
    }
  }

  // Método directo como fallback (menos seguro)
  private async generateAudioDirect(options: AudioGenerationOptions): Promise<Blob> {
    const apiKey = localStorage.getItem('elevenlabs_api_key');
    
    if (!apiKey) {
      throw new Error('ElevenLabs API key not found');
    }

    const {
      text,
      voiceId = 'EXAVITQu4vr4xnSDxMaL',
      modelId = 'eleven_multilingual_v2'
    } = options;

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
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
    });

    if (!response.ok) {
      throw new Error(`Error generating audio: ${response.statusText}`);
    }

    return response.blob();
  }

  async generateMeditationAudio(
    text: string, 
    filename: string
  ): Promise<{ audioBlob: Blob; audioUrl: string }> {
    try {
      const audioBlob = await this.generateAudio({
        text,
        voiceId: 'EXAVITQu4vr4xnSDxMaL' // Sarah para meditaciones
      });

      // Crear URL local para reproducción
      const audioUrl = URL.createObjectURL(audioBlob);

      // Guardar en localStorage para persistencia
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onload = () => {
        localStorage.setItem(`meditation-audio-${filename}`, reader.result as string);
      };

      return { audioBlob, audioUrl };
    } catch (error) {
      console.error('Error generating meditation audio:', error);
      throw error;
    }
  }

  getStoredAudioUrl(filename: string): string | null {
    const stored = localStorage.getItem(`meditation-audio-${filename}`);
    if (stored) {
      return stored;
    }
    return null;
  }

  removeStoredAudio(filename: string): void {
    localStorage.removeItem(`meditation-audio-${filename}`);
  }
}

// Hook para usar ElevenLabs en componentes
export const useElevenLabs = () => {
  const generateMeditationAudio = async (text: string, filename: string) => {
    const service = new ElevenLabsService();
    return service.generateMeditationAudio(text, filename);
  };

  return {
    generateMeditationAudio,
    getStoredAudioUrl: (filename: string) => {
      const service = new ElevenLabsService();
      return service.getStoredAudioUrl(filename);
    }
  };
};