interface DoorProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  shadowsEnabled: boolean;
  style?: 'metal' | 'wood' | 'reinforced';
  scale?: number;
}

export default function Door({ 
  position, 
  rotation = [0, 0, 0],
  shadowsEnabled, 
  style = 'metal',
  scale = 1 
}: DoorProps) {
  const colors = {
    metal: { door: '#3a3a3a', frame: '#2a2a2a', handle: '#5a5a5a' },
    wood: { door: '#5a4a3a', frame: '#4a3a2a', handle: '#3a2a1a' },
    reinforced: { door: '#4a4a3a', frame: '#3a3a2a', handle: '#6a6a5a' }
  };

  const doorColor = colors[style];
  const doorWidth = 1.2 * scale;
  const doorHeight = 2 * scale;
  const doorDepth = 0.1 * scale;

  return (
    <group position={position} rotation={rotation}>
      {/* Door frame */}
      <mesh 
        position={[0, doorHeight / 2, 0]} 
        castShadow={shadowsEnabled}
        receiveShadow={shadowsEnabled}
      >
        <boxGeometry args={[doorWidth + 0.2 * scale, doorHeight + 0.2 * scale, doorDepth * 0.5]} />
        <meshStandardMaterial color={doorColor.frame} roughness={0.9} />
      </mesh>
      
      {/* Door slab */}
      <mesh 
        position={[0, doorHeight / 2, doorDepth * 0.3]} 
        castShadow={shadowsEnabled}
        receiveShadow={shadowsEnabled}
      >
        <boxGeometry args={[doorWidth, doorHeight, doorDepth]} />
        <meshStandardMaterial 
          color={doorColor.door} 
          roughness={style === 'metal' ? 0.7 : 0.9}
          metalness={style === 'metal' ? 0.3 : 0}
        />
      </mesh>
      
      {/* Door handle */}
      <mesh 
        position={[doorWidth * 0.35, doorHeight * 0.5, doorDepth * 0.6]} 
        castShadow={shadowsEnabled}
      >
        <boxGeometry args={[0.15 * scale, 0.05 * scale, 0.2 * scale]} />
        <meshStandardMaterial 
          color={doorColor.handle} 
          roughness={0.6}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}
