import { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Impact {
  id: number;
  position: THREE.Vector3;
  createdAt: number;
}

const ImpactEffects = forwardRef<{ addImpact: (point: THREE.Vector3) => void }>((_, ref) => {
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const nextId = useRef(0);

  useImperativeHandle(ref, () => ({
    addImpact: (point: THREE.Vector3) => {
      const impact: Impact = {
        id: nextId.current++,
        position: point.clone(),
        createdAt: Date.now(),
      };
      setImpacts(prev => [...prev, impact]);
    },
  }));

  useFrame(() => {
    const now = Date.now();
    setImpacts(prev => prev.filter(impact => now - impact.createdAt < 500));
  });

  return (
    <>
      {impacts.map(impact => (
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
