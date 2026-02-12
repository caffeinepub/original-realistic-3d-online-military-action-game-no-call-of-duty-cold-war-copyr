import { Canvas } from '@react-three/fiber';
import { ReactNode } from 'react';
import { useGraphicsSettings } from './settings/useGraphicsSettings';
import { getGraphicsSettings } from './settings/graphics';

interface GameCanvasProps {
  children: ReactNode;
}

export default function GameCanvas({ children }: GameCanvasProps) {
  const { graphicsMode } = useGraphicsSettings();
  const settings = getGraphicsSettings(graphicsMode);

  return (
    <Canvas
      shadows={settings.shadowsEnabled}
      camera={{ position: [0, 1.6, 0], fov: 75 }}
      gl={{ 
        antialias: settings.antialias,
        alpha: false,
        powerPreference: 'high-performance'
      }}
      dpr={settings.dpr}
    >
      <color attach="background" args={['#0a0a0a']} />
      <fog attach="fog" args={['#0a0a0a', 10, 50]} />
      {children}
    </Canvas>
  );
}
