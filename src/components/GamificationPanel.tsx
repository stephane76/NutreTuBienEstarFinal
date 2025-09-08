import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Target, Award, TrendingUp } from 'lucide-react';
import { useGamification, Achievement } from '@/hooks/useGamification';

const categoryIcons = {
  progress: TrendingUp,
  consistency: Star,
  milestone: Trophy,
  selfcare: Award
};

const categoryColors = {
  progress: 'text-primary',
  consistency: 'text-warning',
  milestone: 'text-accent',
  selfcare: 'text-success'
};

interface GamificationPanelProps {
  className?: string;
}

export const GamificationPanel = ({ className }: GamificationPanelProps) => {
  const { progress, getNextLevelProgress } = useGamification();
  const levelProgress = getNextLevelProgress();

  const unlockedAchievements = progress.achievements.filter(a => a.unlocked);
  const lockedAchievements = progress.achievements.filter(a => !a.unlocked);

  const getAchievementsByCategory = (achievements: Achievement[]) => {
    return achievements.reduce((acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = [];
      }
      acc[achievement.category].push(achievement);
      return acc;
    }, {} as Record<string, Achievement[]>);
  };

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const IconComponent = categoryIcons[achievement.category];
    
    return (
      <Card className={`${achievement.unlocked ? 'bg-gradient-card border-success/50' : 'bg-muted/30 opacity-60'}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
              {achievement.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-medium text-sm ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {achievement.title}
                </h4>
                <IconComponent className={`w-3 h-3 ${categoryColors[achievement.category]}`} />
              </div>
              <p className={`text-xs ${achievement.unlocked ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                {achievement.description}
              </p>
              <div className="flex items-center justify-between mt-2">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${achievement.unlocked ? 'bg-success-soft text-success-foreground' : ''}`}
                >
                  {achievement.points} pts
                </Badge>
                {achievement.unlocked && achievement.unlockedAt && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(achievement.unlockedAt).toLocaleDateString('es')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={className}>
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="w-5 h-5 text-accent" />
            Tu Progreso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Level and Points */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-warning" />
              <span className="text-2xl font-bold text-foreground">Nivel {progress.level}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {progress.totalPoints.toLocaleString()} puntos totales
            </p>
            
            {/* Progress to next level */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{levelProgress.current} / {levelProgress.total}</span>
                <span>Siguiente nivel</span>
              </div>
              <Progress value={levelProgress.percentage} className="h-2" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-primary">
                {unlockedAchievements.length}
              </div>
              <div className="text-xs text-muted-foreground">Logros</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-success">
                {progress.streakDays}
              </div>
              <div className="text-xs text-muted-foreground">Días seguidos</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-accent">
                {progress.totalCheckIns}
              </div>
              <div className="text-xs text-muted-foreground">Check-ins</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-0 shadow-card mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="w-5 h-5 text-success" />
            Logros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="unlocked" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="unlocked" className="text-xs">
                Desbloqueados ({unlockedAchievements.length})
              </TabsTrigger>
              <TabsTrigger value="locked" className="text-xs">
                Por desbloquear ({lockedAchievements.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="unlocked" className="space-y-3 mt-4">
              {unlockedAchievements.length > 0 ? (
                unlockedAchievements.map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))
              ) : (
                <div className="text-center py-6">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    ¡Completa acciones para desbloquear tus primeros logros!
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="locked" className="space-y-3 mt-4">
              {lockedAchievements.slice(0, 6).map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
              
              {lockedAchievements.length > 6 && (
                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground">
                    Y {lockedAchievements.length - 6} logros más por descubrir...
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};