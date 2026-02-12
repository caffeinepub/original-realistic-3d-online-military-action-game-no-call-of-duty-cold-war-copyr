import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Impact {
  id: number;
  position: THREE.Vector3;
  createdAt: number;
}

const ImpactEffects = forwardRef<{ addImpact: (point: THREE.Vector3) => void }>((_, ref) => {
  const impactsRef = useRef<Impact[]>([]);
  const nextId = useRef(0);
  const lastCleanup = useRef(0);

  useImperativeHandle(ref, () => ({
    addImpact: (point: THREE.Vector3) => {
      const impact: Impact = {
        id: nextId.current++,
        position: point.clone(),
        createdAt: Date.now(),
      };
      impactsRef.current.push(impact);
    },
  }));

  useFrame(({ clock }) => {
    // Only cleanup every 100ms instead of every frame
    const now = clock.getElapsedTime();
    if (now - lastCleanup.current > 0.1) {
      lastCleanup.current = now;
      const currentTime = Date.now();
      impactsRef.current = impactsRef.current.filter(impact => currentTime - impact.createdAt < 500);
    }
  });

  return (
    <>
      {impactsRef.current.map(impact => (
        <group key={impact.id} position={impact.position}>
          <pointLight intensity={0.5} distance={2} color="#ff6600" />
          <mesh>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ffaa00" />
          </mesh>
        </group>
      ))}
    </>
  );
});

ImpactEffects.displayName = 'ImpactEffects';

export default ImpactEffects;
