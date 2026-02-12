import { useState, useEffect } from 'react';
import GameCanvas from '../game/GameCanvas';
import OfflineSkirmishScene from '../game/scenes/OfflineSkirmishScene';
import HudOverlay from '../ui/HudOverlay';
import type { AppView } from '../App';
import { X } from 'lucide-react';

interface OfflineSkirmishViewProps {
  onNavigate: (view: AppView) => void;
}

export interface OfflineStats {
  shotsFired: number;
  hits: number;
  accuracy: number;
  score: number;
}

export default function OfflineSkirmishView({ onNavigate }: OfflineSkirmishViewProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [stats, setStats] = useState<OfflineStats>({
    shotsFired: 0,
    hits: 0,
    accuracy: 0,
    score: 0,
  });
  const [currentWeapon, setCurrentWeapon] = useState<'rifle' | 'smg'>('rifle');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowMenu(prev => !prev);
      }
      if (e.key === '1') {
        setCurrentWeapon('rifle');
      }
      if (e.key === '2') {
        setCurrentWeapon('smg');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleHit = () => {
    setStats(prev => {
      const newHits = prev.hits + 1;
      const newShotsFired = prev.shotsFired + 1;
      const newAccuracy = (newHits / newShotsFired) * 100;
      const newScore = prev.score + 10;
      return {
        shotsFired: newShotsFired,
        hits: newHits,
        accuracy: newAccuracy,
        score: newScore,
      };
    });
  };

  const handleMiss = () => {
    setStats(prev => {
      const newShotsFired = prev.shotsFired + 1;
      const newAccuracy = prev.hits > 0 ? (prev.hits / newShotsFired) * 100 : 0;
      return {
        ...prev,
        shotsFired: newShotsFired,
        accuracy: newAccuracy,
      };
    });
  };

  return (
    <div className="relative w-full h-screen">
      <GameCanvas>
        <OfflineSkirmishScene 
          onHit={handleHit}
          onMiss={handleMiss}
          currentWeapon={currentWeapon}
        />
      </GameCanvas>
      
      <HudOverlay 
        mode="offline" 
        offlineStats={stats}
        currentWeapon={currentWeapon}
      />

      {/* ESC Menu */}
      {showMenu && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Skirmish Paused</h2>
              <button
                onClick={() => setShowMenu(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowMenu(false)}
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors font-medium"
              >
                Resume Skirmish
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="w-full py-3 px-4 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 transition-colors font-medium"
              >
                Return to Menu
              </button>
            </div>

            <div className="text-sm text-muted-foreground space-y-1 pt-4 border-t border-border">
              <p className="font-bold text-foreground mb-2">Controls:</p>
              <p><strong>WASD</strong> - Move</p>
              <p><strong>Shift</strong> - Sprint</p>
              <p><strong>Space</strong> - Jump</p>
              <p><strong>C</strong> - Crouch</p>
              <p><strong>Mouse</strong> - Look</p>
              <p><strong>Left Click</strong> - Fire</p>
              <p><strong>1</strong> - Switch to Rifle</p>
              <p><strong>2</strong> - Switch to SMG</p>
              <p><strong>ESC</strong> - Menu</p>
            </div>

            <div className="text-sm pt-4 border-t border-border">
              <p className="font-bold text-foreground mb-2">Current Stats:</p>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <p>Score: <span className="text-foreground">{stats.score}</span></p>
                <p>Hits: <span className="text-foreground">{stats.hits}</span></p>
                <p>Shots: <span className="text-foreground">{stats.shotsFired}</span></p>
                <p>Accuracy: <span className="text-foreground">{stats.accuracy.toFixed(1)}%</span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
