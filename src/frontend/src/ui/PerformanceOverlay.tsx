import { useEffect, useRef, useState } from 'react';
import { useGraphicsSettings } from '../game/settings/useGraphicsSettings';

export default function PerformanceOverlay() {
  const [fps, setFps] = useState(0);
  const { graphicsMode } = useGraphicsSettings();
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    let rafId: number;

    const updateFps = () => {
      frameCountRef.current++;
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;

      // Update FPS display every 500ms to reduce React updates
      if (elapsed >= 500) {
        const currentFps = Math.round((frameCountRef.current / elapsed) * 1000);
        setFps(currentFps);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      rafId = requestAnimationFrame(updateFps);
    };

    rafId = requestAnimationFrame(updateFps);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white px-4 py-3 rounded-lg font-mono text-sm space-y-1 pointer-events-none z-50 border border-white/20">
      <div className="flex items-center gap-2">
        <span className="text-gray-400">FPS:</span>
        <span className={fps < 30 ? 'text-red-400' : fps < 50 ? 'text-yellow-400' : 'text-green-400'}>
          {fps}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Graphics:</span>
        <span className="text-blue-400">{graphicsMode}</span>
      </div>
    </div>
  );
}
