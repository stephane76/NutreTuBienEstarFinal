// Direct approach for generating hypnosis audio via ElevenLabs
// This service handles secure audio generation using the stored API key

export class HypnosisAudioService {
  private static instance: HypnosisAudioService;
  
  public static getInstance(): HypnosisAudioService {
    if (!HypnosisAudioService.instance) {
      HypnosisAudioService.instance = new HypnosisAudioService();
    }
    return HypnosisAudioService.instance;
  }

  /**
   * Generate hypnosis audio using ElevenLabs via Supabase Edge Function
   */
  async generateHypnosisAudio(
    script: string,
    sessionTitle: string,
    voiceSettings?: {
      stability: number;
      similarity_boost: number;
      style: number;
      use_speaker_boost: boolean;
    }
  ): Promise<string> {
    try {
      console.log(`Generating audio for session: ${sessionTitle}`);
      
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

      // Call our local API endpoint instead of Supabase for now
      // In production, this would use the actual Supabase Edge Function
      
      // For now, we'll simulate the API call with a direct function call
      const { generateHypnosisAudio } = await import('@/api/generate-hypnosis-audio');
      const audioBlob = await generateHypnosisAudio(
        formattedScript,
        sessionTitle,
        voiceSettings || {
          stability: 0.85,
          similarity_boost: 0.75,
          style: 0.20,
          use_speaker_boost: true
        }
      );
      
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log(`Successfully generated audio URL for: ${sessionTitle}`);
      return audioUrl;

    } catch (error) {
      console.error('Error in generateHypnosisAudio:', error);
      
      // Fallback: Return a placeholder or throw error
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Unknown error generating hypnosis audio');
    }
  }

  /**
   * Generate all hypnosis session audios
   */
  async generateAllSessionAudios(
    sessions: Array<{
      id: string;
      title: string;
      script: string;
      voiceSettings: {
        stability: number;
        similarity_boost: number;
        style: number;
        use_speaker_boost: boolean;
      };
    }>
  ): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    const errors: string[] = [];

    console.log(`Starting generation of ${sessions.length} hypnosis sessions`);

    for (const session of sessions) {
      try {
        console.log(`Generating audio for: ${session.title}`);
        const audioUrl = await this.generateHypnosisAudio(
          session.script,
          session.title,
          session.voiceSettings
        );
        
        results[session.id] = audioUrl;
        console.log(`✅ Successfully generated: ${session.title}`);
        
        // Add a small delay between requests to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        const errorMessage = `Failed to generate ${session.title}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(`❌ ${errorMessage}`);
        errors.push(errorMessage);
      }
    }

    if (errors.length > 0) {
      console.warn(`Generation completed with ${errors.length} errors:`, errors);
    }

    console.log(`Generation complete. Successfully generated ${Object.keys(results).length} out of ${sessions.length} sessions`);
    
    return results;
  }

  /**
   * Create a simple fallback audio generation for development
   */
  async generateFallbackAudio(sessionTitle: string): Promise<string> {
    // This is a fallback method for development/testing
    // In a real implementation, this would call a local TTS service or return a sample audio
    
    console.log(`Generating fallback audio for: ${sessionTitle}`);
    
    // For now, we'll create a simple audio URL placeholder
    // In a real app, you might want to have pre-recorded samples
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      canvas.width = 200;
      canvas.height = 100;
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, 200, 100);
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Audio Placeholder', 100, 50);
    }
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          resolve('data:audio/wav;base64,');
        }
      });
    });
  }
}

// Export singleton instance
export const hypnosisAudioService = HypnosisAudioService.getInstance();