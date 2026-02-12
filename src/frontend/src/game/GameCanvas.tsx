import { Canvas } from '@react-three/fiber';
import { ReactNode } from 'react';

interface GameCanvasProps {
  children: ReactNode;
}

export default function GameCanvas({ children }: GameCanvasProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.6, 0], fov: 75 }}
      gl={{ 
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#0a0a0a']} />
      <fog attach="fog" args={['#0a0a0a', 10, 50]} />
      {children}
    </Canvas>
  );
}
