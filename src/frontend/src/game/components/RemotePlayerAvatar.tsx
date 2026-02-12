import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import RemotePlayerLabel from './RemotePlayerLabel';

interface RemotePlayerAvatarProps {
  position: [number, number, number];
  rotation: number;
  username: string;
}

export default function RemotePlayerAvatar({ position, rotation, username }: RemotePlayerAvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetPosition = useRef(new THREE.Vector3(...position));
  const targetRotation = useRef(rotation);

  // Update target refs only when props change, not every frame
  useMemo(() => {
    targetPosition.current.set(...position);
    targetRotation.current = rotation;
  }, [position, rotation]);

  useFrame(() => {
    if (!groupRef.current) return;

    // Smooth interpolation
    groupRef.current.position.lerp(targetPosition.current, 0.2);
    
    const currentY = groupRef.current.rotation.y;
    const diff = targetRotation.current - currentY;
    const shortestDiff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
    groupRef.current.rotation.y += shortestDiff * 0.2;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Body - capsule shape */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color="#4a5568" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#5a6a78" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Direction indicator */}
      <mesh position={[0, 1.7, -0.3]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.2]} />
        <meshStandardMaterial color="#ff6b35" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Name label using WebGL sprite instead of DOM */}
      <RemotePlayerLabel username={username} position={[0, 2.3, 0]} />
    </group>
  );
}
