import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'consistency' | 'milestone' | 'selfcare';
  unlocked: boolean;
  unlockedAt?: number;
  requirement: {
    type: 'streak' | 'count' | 'pattern' | 'completion';
    value: number;
    target?: string;
  };
  points: number;
}

export interface UserProgress {
  totalPoints: number;
  level: number;
  streakDays: number;
  totalCheckIns: number;
  totalDiaryEntries: number;
  totalMeditations: number;
  achievements: Achievement[];
  badges: string[];
}

const defaultAchievements: Achievement[] = [
  {
    id: 'first-step',
    title: 'Primer paso',
    description: 'Has completado tu primer registro emocional',
    icon: '🌱',
    category: 'milestone',
    unlocked: false,
    requirement: { type: 'count', value: 1, target: 'checkins' },
    points: 10
  },
  {
    id: 'week-warrior',
    title: 'Guerrera de la semana',
    description: '7 días consecutivos cuidándote',
    icon: '🌟',
    category: 'consistency',
    unlocked: false,
    requirement: { type: 'streak', value: 7 },
    points: 50
  },
  {
    id: 'mindful-month',
    title: 'Mes consciente',
    description: '30 días de autocuidado continuo',
    icon: '👑',
    category: 'consistency',
    unlocked: false,
    requirement: { type: 'streak', value: 30 },
    points: 200
  },
  {
    id: 'emotion-explorer',
    title: 'Exploradora emocional',
    description: 'Has registrado 10 emociones diferentes',
    icon: '🎨',
    category: 'progress',
    unlocked: false,
    requirement: { type: 'pattern', value: 10, target: 'unique_emotions' },
    points: 30
  },
  {
    id: 'pause-master',
    title: 'Maestra de la pausa',
    description: 'Has usado 20 veces técnicas de calma',
    icon: '🧘‍♀️',
    category: 'selfcare',
    unlocked: false,
    requirement: { type: 'count', value: 20, target: 'meditations' },
    points: 75
  },
  {
    id: 'self-compassion',
    title: 'Autocompasión',
    description: 'Has elegido cuidarte en momentos difíciles',
    icon: '💝',
    category: 'selfcare',
    unlocked: false,
    requirement: { type: 'pattern', value: 5, target: 'low_risk_choices' },
    points: 40
  },
  {
    id: 'diary-keeper',
    title: 'Guardiana del diario',
    description: 'Has escrito 25 entradas en tu diario',
    icon: '📖',
    category: 'progress',
    unlocked: false,
    requirement: { type: 'count', value: 25, target: 'diary_entries' },
    points: 60
  },
  {
    id: 'risk-navigator',
    title: 'Navegadora de riesgo',
    description: 'Has identificado y gestionado 10 situaciones de riesgo',
    icon: '🧭',
    category: 'progress',
    unlocked: false,
    requirement: { type: 'count', value: 10, target: 'risk_situations' },
    points: 80
  }
];

export const useGamification = () => {
  const [progress, setProgress] = useState<UserProgress>({
    totalPoints: 0,
    level: 1,
    streakDays: 0,
    totalCheckIns: 0,
    totalDiaryEntries: 0,
    totalMeditations: 0,
    achievements: defaultAchievements,
    badges: []
  });

  const { toast } = useToast();

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    const savedProgress = localStorage.getItem('gamification_progress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setProgress({
        ...parsed,
        achievements: defaultAchievements.map(achievement => {
          const saved = parsed.achievements?.find((a: Achievement) => a.id === achievement.id);
          return saved ? { ...achievement, ...saved } : achievement;
        })
      });
    }
  };

  const saveProgress = useCallback((newProgress: UserProgress) => {
    localStorage.setItem('gamification_progress', JSON.stringify(newProgress));
    setProgress(newProgress);
  }, []);

  const calculateLevel = (points: number): number => {
    return Math.floor(points / 100) + 1;
  };

  const addPoints = useCallback((points: number, reason: string) => {
    setProgress(prev => {
      const newTotalPoints = prev.totalPoints + points;
      const newLevel = calculateLevel(newTotalPoints);
      const leveledUp = newLevel > prev.level;

      const newProgress = {
        ...prev,
        totalPoints: newTotalPoints,
        level: newLevel
      };

      toast({
        title: `+${points} puntos`,
        description: reason,
        duration: 3000,
      });

      if (leveledUp) {
        toast({
          title: `¡Nivel ${newLevel}!`,
          description: '¡Has subido de nivel! Sigue así.',
          duration: 5000,
        });
      }

      saveProgress(newProgress);
      return newProgress;
    });
  }, [saveProgress, toast]);

  const checkAchievements = useCallback((data: {
    checkIns: any[];
    diaryEntries: any[];
    meditations: number;
    streak: number;
  }) => {
    setProgress(prev => {
      const updatedAchievements = prev.achievements.map(achievement => {
        if (achievement.unlocked) return achievement;

        let shouldUnlock = false;

        switch (achievement.requirement.type) {
          case 'streak':
            shouldUnlock = data.streak >= achievement.requirement.value;
            break;
          case 'count':
            const target = achievement.requirement.target;
            if (target === 'checkins') shouldUnlock = data.checkIns.length >= achievement.requirement.value;
            if (target === 'diary_entries') shouldUnlock = data.diaryEntries.length >= achievement.requirement.value;
            if (target === 'meditations') shouldUnlock = data.meditations >= achievement.requirement.value;
            break;
          case 'pattern':
            if (achievement.requirement.target === 'unique_emotions') {
              const uniqueEmotions = new Set(data.checkIns.map(c => c.emotion)).size;
              shouldUnlock = uniqueEmotions >= achievement.requirement.value;
            }
            break;
        }

        if (shouldUnlock) {
          toast({
            title: `🏆 ¡Logro desbloqueado!`,
            description: `${achievement.icon} ${achievement.title}`,
            duration: 6000,
          });

          return {
            ...achievement,
            unlocked: true,
            unlockedAt: Date.now()
          };
        }

        return achievement;
      });

      const newUnlocked = updatedAchievements.filter(a => a.unlocked && !prev.achievements.find(p => p.id === a.id && p.unlocked));
      const pointsEarned = newUnlocked.reduce((sum, a) => sum + a.points, 0);

      const newProgress = {
        ...prev,
        achievements: updatedAchievements,
        totalPoints: prev.totalPoints + pointsEarned,
        level: calculateLevel(prev.totalPoints + pointsEarned)
      };

      saveProgress(newProgress);
      return newProgress;
    });
  }, [saveProgress, toast]);

  const updateStats = useCallback((type: 'checkin' | 'diary' | 'meditation', data?: any) => {
    setProgress(prev => {
      const newProgress = { ...prev };

      switch (type) {
        case 'checkin':
          newProgress.totalCheckIns++;
          addPoints(5, 'Registro emocional completado');
          break;
        case 'diary':
          newProgress.totalDiaryEntries++;
          addPoints(10, 'Entrada de diario guardada');
          break;
        case 'meditation':
          newProgress.totalMeditations++;
          addPoints(15, 'Sesión de calma completada');
          break;
      }

      saveProgress(newProgress);
      return newProgress;
    });
  }, [addPoints, saveProgress]);

  const getNextLevelProgress = () => {
    const currentLevelMin = (progress.level - 1) * 100;
    const nextLevelMin = progress.level * 100;
    const progressInLevel = progress.totalPoints - currentLevelMin;
    const progressNeeded = nextLevelMin - currentLevelMin;
    
    return {
      current: progressInLevel,
      total: progressNeeded,
      percentage: (progressInLevel / progressNeeded) * 100
    };
  };

  return {
    progress,
    addPoints,
    updateStats,
    checkAchievements,
    getNextLevelProgress,
    loadProgress
  };
};