import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface RiskPattern {
  id: string;
  type: 'emotional' | 'behavioral' | 'temporal' | 'trigger';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: number;
  data: any;
  recommendations: string[];
}

export interface RiskAlert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  dismissed: boolean;
  actionTaken?: string;
}

const riskKeywords = {
  high: ['no puedo', 'odio', 'horrible', 'descontrol', 'culpa', 'vergüenza', 'fracaso', 'imposible'],
  medium: ['difícil', 'triste', 'preocupada', 'ansiosa', 'confundida', 'abrumada'],
  triggers: ['comida', 'peso', 'espejo', 'ropa', 'báscula', 'hambre', 'atracón', 'purgar']
};

const criticalPhrases = [
  'quiero hacerme daño',
  'no quiero vivir',
  'no puedo más',
  'todo está mal',
  'soy un fracaso',
  'nadie me entiende'
];

export const useRiskDetection = () => {
  const [patterns, setPatterns] = useState<RiskPattern[]>([]);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = () => {
    const storedPatterns = localStorage.getItem('risk_patterns');
    const storedAlerts = localStorage.getItem('risk_alerts');
    
    if (storedPatterns) {
      setPatterns(JSON.parse(storedPatterns));
    }
    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts));
    }
  };

  const savePatterns = useCallback((newPatterns: RiskPattern[]) => {
    localStorage.setItem('risk_patterns', JSON.stringify(newPatterns));
    setPatterns(newPatterns);
  }, []);

  const saveAlerts = useCallback((newAlerts: RiskAlert[]) => {
    localStorage.setItem('risk_alerts', JSON.stringify(newAlerts));
    setAlerts(newAlerts);
  }, []);

  const analyzeText = useCallback((text: string): { risk: 'low' | 'medium' | 'high' | 'critical', factors: string[] } => {
    const lowerText = text.toLowerCase();
    let riskScore = 0;
    const factors: string[] = [];

    // Check for critical phrases
    for (const phrase of criticalPhrases) {
      if (lowerText.includes(phrase)) {
        riskScore += 10;
        factors.push(`Frase crítica detectada: "${phrase}"`);
      }
    }

    // Check for high risk keywords
    for (const keyword of riskKeywords.high) {
      if (lowerText.includes(keyword)) {
        riskScore += 3;
        factors.push(`Palabra de alto riesgo: "${keyword}"`);
      }
    }

    // Check for medium risk keywords
    for (const keyword of riskKeywords.medium) {
      if (lowerText.includes(keyword)) {
        riskScore += 1;
        factors.push(`Indicador emocional: "${keyword}"`);
      }
    }

    // Check for triggers
    for (const trigger of riskKeywords.triggers) {
      if (lowerText.includes(trigger)) {
        riskScore += 2;
        factors.push(`Posible trigger: "${trigger}"`);
      }
    }

    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (riskScore >= 10) riskLevel = 'critical';
    else if (riskScore >= 6) riskLevel = 'high';
    else if (riskScore >= 3) riskLevel = 'medium';
    else riskLevel = 'low';

    return { risk: riskLevel, factors };
  }, []);

  const detectPatterns = useCallback((data: {
    checkIns: any[];
    diaryEntries: any[];
    foodLogs: any[];
  }) => {
    const newPatterns: RiskPattern[] = [];
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

    // Detect emotional patterns
    const recentCheckIns = data.checkIns.filter(c => c.timestamp > oneWeekAgo);
    if (recentCheckIns.length >= 3) {
      const negativeEmotions = recentCheckIns.filter(c => 
        ['Tristeza', 'Ansiedad', 'Frustración', 'Culpa'].includes(c.emotion)
      );
      
      if (negativeEmotions.length / recentCheckIns.length > 0.7) {
        newPatterns.push({
          id: `emotional_${now}`,
          type: 'emotional',
          severity: 'medium',
          description: 'Patrón predominante de emociones difíciles en la última semana',
          detectedAt: now,
          data: { negativeRatio: negativeEmotions.length / recentCheckIns.length },
          recommendations: [
            'Considera hablar con un profesional de salud mental',
            'Prueba técnicas de relajación diarias',
            'Mantén un registro de qué situaciones desencadenan estas emociones'
          ]
        });
      }
    }

    // Detect behavioral patterns
    const recentHighRisk = data.checkIns.filter(c => 
      c.timestamp > oneWeekAgo && c.bingeRisk >= 4
    );
    
    if (recentHighRisk.length >= 3) {
      newPatterns.push({
        id: `behavioral_${now}`,
        type: 'behavioral',
        severity: 'high',
        description: 'Múltiples episodios de alto riesgo de atracón detectados',
        detectedAt: now,
        data: { highRiskCount: recentHighRisk.length },
        recommendations: [
          'Contacta con tu equipo de apoyo',
          'Revisa tus estrategias de afrontamiento',
          'Considera ajustar tu plan de comidas'
        ]
      });
    }

    // Detect temporal patterns
    const nightCheckIns = data.checkIns.filter(c => {
      const hour = new Date(c.timestamp).getHours();
      return hour >= 22 || hour <= 6;
    });

    if (nightCheckIns.length >= 5 && nightCheckIns.length / data.checkIns.length > 0.3) {
      newPatterns.push({
        id: `temporal_${now}`,
        type: 'temporal',
        severity: 'medium',
        description: 'Patrón de registros emocionales nocturnos frecuentes',
        detectedAt: now,
        data: { nightRatio: nightCheckIns.length / data.checkIns.length },
        recommendations: [
          'Establece una rutina de sueño regular',
          'Practica técnicas de relajación antes de dormir',
          'Evita pantallas 1 hora antes de acostarte'
        ]
      });
    }

    // Save new patterns
    if (newPatterns.length > 0) {
      const allPatterns = [...patterns, ...newPatterns];
      savePatterns(allPatterns);
      
      // Create alerts for new patterns
      const newAlerts = newPatterns.map(pattern => ({
        id: `alert_${pattern.id}`,
        title: 'Patrón de riesgo detectado',
        message: pattern.description,
        severity: pattern.severity,
        timestamp: now,
        dismissed: false
      }));

      setAlerts(prev => {
        const updated = [...prev, ...newAlerts];
        saveAlerts(updated);
        return updated;
      });
    }

    return newPatterns;
  }, [patterns, savePatterns, saveAlerts]);

  const analyzeEntry = useCallback((text: string, emotion?: string, context?: any) => {
    const textAnalysis = analyzeText(text);
    
    if (textAnalysis.risk === 'critical') {
      const alert: RiskAlert = {
        id: `critical_${Date.now()}`,
        title: '⚠️ Alerta crítica',
        message: 'Se detectaron indicadores de crisis. Tu bienestar es importante.',
        severity: 'critical',
        timestamp: Date.now(),
        dismissed: false
      };

      setAlerts(prev => {
        const updated = [...prev, alert];
        saveAlerts(updated);
        return updated;
      });

      toast({
        title: '🫂 Estamos aquí para ti',
        description: 'Se detectaron señales de crisis. ¿Necesitas apoyo inmediato?',
        duration: 10000,
      });
    } else if (textAnalysis.risk === 'high') {
      toast({
        title: '💙 Cuidado detectado',
        description: 'Parece que estás pasando por un momento difícil. Recuerda que no estás sola.',
        duration: 6000,
      });
    }

    return textAnalysis;
  }, [analyzeText, saveAlerts, toast]);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => {
      const updated = prev.map(alert => 
        alert.id === alertId ? { ...alert, dismissed: true } : alert
      );
      saveAlerts(updated);
      return updated;
    });
  }, [saveAlerts]);

  const getActiveAlerts = useCallback(() => {
    return alerts.filter(alert => !alert.dismissed);
  }, [alerts]);

  const getRiskSummary = useCallback(() => {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentPatterns = patterns.filter(p => p.detectedAt > oneWeekAgo);
    
    const summary = {
      total: recentPatterns.length,
      critical: recentPatterns.filter(p => p.severity === 'critical').length,
      high: recentPatterns.filter(p => p.severity === 'high').length,
      medium: recentPatterns.filter(p => p.severity === 'medium').length,
      low: recentPatterns.filter(p => p.severity === 'low').length
    };

    return summary;
  }, [patterns]);

  return {
    patterns,
    alerts,
    analyzeText,
    analyzeEntry,
    detectPatterns,
    dismissAlert,
    getActiveAlerts,
    getRiskSummary
  };
};