import { useState, useEffect } from 'react';
import GameCanvas from '../game/GameCanvas';
import TrainingScene from '../game/scenes/TrainingScene';
import HudOverlay from '../ui/HudOverlay';
import type { AppView } from '../App';
import { X } from 'lucide-react';
import { useGraphicsSettings } from '../game/settings/useGraphicsSettings';
import { useDebugSettings } from '../game/settings/useDebugSettings';
import type { GraphicsMode } from '../game/settings/graphics';
import PerformanceOverlay from '../ui/PerformanceOverlay';

interface TrainingViewProps {
  onNavigate: (view: AppView) => void;
}

export default function TrainingView({ onNavigate }: TrainingViewProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { graphicsMode, setGraphicsMode } = useGraphicsSettings();
  const { showPerformanceOverlay, setShowPerformanceOverlay } = useDebugSettings();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowMenu(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full h-screen">
      <GameCanvas>
        <TrainingScene />
      </GameCanvas>
      
      <HudOverlay mode="training" />

      {showPerformanceOverlay && <PerformanceOverlay />}

      {/* ESC Menu */}
      {showMenu && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Training Paused</h2>
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
                Resume Training
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="w-full py-3 px-4 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 transition-colors font-medium"
              >
                Return to Menu
              </button>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Graphics Mode</span>
                <select
                  value={graphicsMode}
                  onChange={(e) => setGraphicsMode(e.target.value as GraphicsMode)}
                  className="bg-background border border-border rounded px-3 py-1 text-sm"
                >
                  <option value="Balanced">Balanced</option>
                  <option value="Performance">Performance</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Performance Overlay</span>
                <button
                  onClick={() => setShowPerformanceOverlay(!showPerformanceOverlay)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    showPerformanceOverlay 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {showPerformanceOverlay ? 'On' : 'Off'}
                </button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-1 pt-4 border-t border-border">
              <p><strong>WASD</strong> - Move</p>
              <p><strong>Shift</strong> - Sprint</p>
              <p><strong>Space</strong> - Jump</p>
              <p><strong>C</strong> - Crouch</p>
              <p><strong>Mouse</strong> - Look</p>
              <p><strong>Left Click</strong> - Fire</p>
              <p><strong>ESC</strong> - Menu</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
