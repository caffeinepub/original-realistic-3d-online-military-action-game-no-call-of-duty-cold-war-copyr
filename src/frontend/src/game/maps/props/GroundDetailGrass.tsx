import { useMemo } from 'react';
import { GraphicsMode, getGraphicsSettings } from '../../settings/graphics';

interface GroundDetailGrassProps {
  graphicsMode: GraphicsMode;
  bounds?: { minX: number; maxX: number; minZ: number; maxZ: number };
  density?: number;
}

export default function GroundDetailGrass({ 
  graphicsMode, 
  bounds = { minX: -40, maxX: 40, minZ: -40, maxZ: 40 },
  density = 1
}: GroundDetailGrassProps) {
  const settings = getGraphicsSettings(graphicsMode);
  
  const grassTufts = useMemo(() => {
    const baseDensity = graphicsMode === 'Performance' ? 30 : 60;
    const count = Math.floor(baseDensity * density);
    const tufts: Array<{ pos: [number, number, number]; rot: number; scale: number }> = [];
    
    for (let i = 0; i < count; i++) {
      const x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
      const z = bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ);
      const rot = Math.random() * Math.PI * 2;
      const scale = 0.3 + Math.random() * 0.4;
      
      tufts.push({ pos: [x, 0.05, z], rot, scale });
    }
    
    return tufts;
  }, [graphicsMode, bounds, density]);

  return (
    <>
      {grassTufts.map((tuft, i) => (
        <group key={i} position={tuft.pos} rotation={[0, tuft.rot, 0]} scale={tuft.scale}>
          {/* Simple cross-shaped grass tuft */}
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.1, 0.3, 0.6]} />
            <meshStandardMaterial 
              color="#4a6a3a" 
              roughness={0.9}
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh position={[0, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.1, 0.3, 0.6]} />
            <meshStandardMaterial 
              color="#4a6a3a" 
              roughness={0.9}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}
