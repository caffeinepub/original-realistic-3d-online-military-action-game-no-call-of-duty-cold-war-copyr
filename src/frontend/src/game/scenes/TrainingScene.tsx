import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useFpsControls from '../controls/useFpsControls';
import PlayerArmsAndWeapon from '../components/PlayerArmsAndWeapon';
import ImpactEffects from '../components/ImpactEffects';

export default function TrainingScene() {
  const { position, rotation, cameraRef } = useFpsControls();
  const impactRef = useRef<{ addImpact: (point: THREE.Vector3) => void }>(null);

  useFrame(({ camera }) => {
    camera.position.set(position.x, position.y, position.z);
    camera.rotation.set(rotation.x, rotation.y, rotation.z);
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight args={['#87ceeb', '#545454', 0.5]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#3a3a3a" 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Training structures */}
      {/* Walls */}
      <mesh position={[-10, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 3, 20]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>
      <mesh position={[10, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 3, 20]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>

      {/* Cover boxes */}
      {[
        [0, 0.5, -5],
        [3, 0.5, -8],
        [-3, 0.5, -8],
        [5, 0.75, -12],
        [-5, 0.75, -12],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[1.5, pos[1] * 2, 1.5]} />
          <meshStandardMaterial 
            color="#5a5a5a" 
            roughness={0.85}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Target dummies */}
      {[
        [0, 1, -15],
        [4, 1, -18],
        [-4, 1, -18],
      ].map((pos, i) => (
        <group key={`target-${i}`} position={pos as [number, number, number]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
            <meshStandardMaterial color="#8b4513" roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.2, 0]} castShadow>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#d2691e" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Player arms and weapon */}
      <PlayerArmsAndWeapon 
        cameraRef={cameraRef}
        onFire={(direction) => {
          // Simple raycast for impact
          const raycaster = new THREE.Raycaster(
            new THREE.Vector3(position.x, position.y, position.z),
            direction
          );
          // This is simplified - in production you'd raycast against scene objects
          const impactPoint = new THREE.Vector3(
            position.x + direction.x * 20,
            position.y + direction.y * 20,
            position.z + direction.z * 20
          );
          impactRef.current?.addImpact(impactPoint);
        }}
      />

      {/* Impact effects */}
      <ImpactEffects ref={impactRef} />
    </>
  );
}
