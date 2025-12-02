import { supabase } from '@/integrations/supabase/client';

export interface MindfulAudioRequest {
  text: string;
  voiceId?: string;
}

export interface MindfulAudioResponse {
  audio: string; // base64 encoded audio
  voiceUsed: string;
}

export class MindfulAudioService {
  static async generateAudio(request: MindfulAudioRequest): Promise<MindfulAudioResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-mindful-audio', {
        body: {
          text: request.text,
          voiceId: request.voiceId || 'Sarah'
        }
      });

      if (error) {
        console.error('Error calling mindful audio function:', error);
        throw new Error('Failed to generate mindful audio');
      }

      return data;
    } catch (error) {
      console.error('Error in MindfulAudioService:', error);
      throw error;
    }
  }

  static createAudioUrl(base64Audio: string): string {
    const audioData = atob(base64Audio);
    const audioArray = new Uint8Array(audioData.length);
    
    for (let i = 0; i < audioData.length; i++) {
      audioArray[i] = audioData.charCodeAt(i);
    }
    
    const blob = new Blob([audioArray], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  }
}