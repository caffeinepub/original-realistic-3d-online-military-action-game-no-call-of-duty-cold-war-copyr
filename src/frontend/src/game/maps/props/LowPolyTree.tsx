import { useMemo } from 'react';

interface LowPolyTreeProps {
  position: [number, number, number];
  shadowsEnabled: boolean;
  variant?: 'normal' | 'desert' | 'shrub';
  scale?: number;
}

export default function LowPolyTree({ 
  position, 
  shadowsEnabled, 
  variant = 'normal',
  scale = 1 
}: LowPolyTreeProps) {
  const colors = useMemo(() => {
    switch (variant) {
      case 'desert':
        return { trunk: '#6a5a4a', foliage: '#7a8a5a' };
      case 'shrub':
        return { trunk: '#5a4a3a', foliage: '#5a7a4a' };
      default:
        return { trunk: '#4a3a2a', foliage: '#3a5a3a' };
    }
  }, [variant]);

  const trunkHeight = variant === 'shrub' ? 1.5 : 3.5;
  const foliageSize = variant === 'shrub' ? 1.2 : 2;
  const foliageY = position[1] + trunkHeight / 2 + foliageSize * 0.6;

  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh 
        position={[0, trunkHeight / 2, 0]} 
        castShadow={shadowsEnabled}
        receiveShadow={shadowsEnabled}
      >
        <cylinderGeometry args={[0.2, 0.3, trunkHeight, 6]} />
        <meshStandardMaterial color={colors.trunk} roughness={0.95} />
      </mesh>
      
      {/* Foliage - low poly cone */}
      <mesh 
        position={[0, foliageY, 0]} 
        castShadow={shadowsEnabled}
        receiveShadow={shadowsEnabled}
      >
        <coneGeometry args={[foliageSize, foliageSize * 1.5, 6]} />
        <meshStandardMaterial color={colors.foliage} roughness={0.9} />
      </mesh>
      
      {/* Additional foliage layer for non-shrub variants */}
      {variant !== 'shrub' && (
        <mesh 
          position={[0, foliageY - foliageSize * 0.5, 0]} 
          castShadow={shadowsEnabled}
        >
          <coneGeometry args={[foliageSize * 0.8, foliageSize * 1.2, 6]} />
          <meshStandardMaterial color={colors.foliage} roughness={0.9} />
        </mesh>
      )}
    </group>
  );
}
