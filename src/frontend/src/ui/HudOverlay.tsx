import { useGetPlayersInGame } from '../hooks/useQueries';
import { Activity, Crosshair, Zap, Target } from 'lucide-react';
import type { OfflineStats } from '../pages/OfflineSkirmishView';

interface HudOverlayProps {
  mode: 'training' | 'online' | 'offline';
  offlineStats?: OfflineStats;
  currentWeapon?: 'rifle' | 'smg';
}

export default function HudOverlay({ mode, offlineStats, currentWeapon }: HudOverlayProps) {
  // Only call backend hooks when in online mode
  const shouldFetchPlayers = mode === 'online';
  const playersQuery = useGetPlayersInGame();
  
  // Only use the query data when in online mode
  const players = shouldFetchPlayers ? (playersQuery.data || []) : [];
  const dataUpdatedAt = shouldFetchPlayers ? playersQuery.dataUpdatedAt : undefined;
  
  const lastSyncSeconds = dataUpdatedAt && shouldFetchPlayers
    ? Math.floor((Date.now() - dataUpdatedAt) / 1000)
    : 0;

  const weaponName = currentWeapon === 'smg' ? 'Rapid SMG' : 'Tactical Rifle';

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Crosshair className="w-6 h-6 text-white/60" strokeWidth={1.5} />
      </div>

      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        <div className="hud-panel px-4 py-2 rounded space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-white font-mono">HP: 100</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-mono">AMMO: 30/120</span>
          </div>
          {mode === 'offline' && currentWeapon && (
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-white font-mono">{weaponName}</span>
            </div>
          )}
        </div>

        {mode === 'online' && (
          <div className="hud-panel px-4 py-2 rounded">
            <div className="text-xs text-gray-400 font-mono">
              SYNC: {lastSyncSeconds}s ago
            </div>
            <div className="text-xs text-gray-400 font-mono mt-1">
              PLAYERS: {players.length}
            </div>
          </div>
        )}

        {mode === 'offline' && offlineStats && (
          <div className="hud-panel px-4 py-2 rounded space-y-1">
            <div className="text-xs text-gray-400 font-mono">
              SCORE: <span className="text-white">{offlineStats.score}</span>
            </div>
            <div className="text-xs text-gray-400 font-mono">
              HITS: <span className="text-white">{offlineStats.hits}</span>
            </div>
            <div className="text-xs text-gray-400 font-mono">
              ACCURACY: <span className="text-white">{offlineStats.accuracy.toFixed(1)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-4 left-4 hud-panel px-4 py-2 rounded">
        <div className="text-xs text-gray-400 font-mono">
          {mode === 'training' && 'TRAINING MODE'}
          {mode === 'online' && 'ONLINE MATCH'}
          {mode === 'offline' && 'OFFLINE SKIRMISH'}
        </div>
        <div className="text-xs text-gray-500 font-mono mt-1">
          ESC - Menu
        </div>
        {mode === 'offline' && (
          <div className="text-xs text-gray-500 font-mono">
            1/2 - Switch Weapon
          </div>
        )}
      </div>
    </div>
  );
}
