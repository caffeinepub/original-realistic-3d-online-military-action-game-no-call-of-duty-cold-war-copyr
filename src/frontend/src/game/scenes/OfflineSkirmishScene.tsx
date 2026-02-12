import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useFpsControls from '../controls/useFpsControls';
import PlayerArmsAndWeapon from '../components/PlayerArmsAndWeapon';
import ImpactEffects from '../components/ImpactEffects';
import type { WeaponConfig } from '../weapons/offlineWeapons';
import { OFFLINE_WEAPONS } from '../weapons/offlineWeapons';
import { useGraphicsSettings } from '../settings/useGraphicsSettings';
import { getGraphicsSettings } from '../settings/graphics';

interface OfflineSkirmishSceneProps {
  onHit: () => void;
  onMiss: () => void;
  currentWeapon: 'rifle' | 'smg';
}

interface MovingTarget {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mesh: THREE.Mesh | null;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
}

export default function OfflineSkirmishScene({ onHit, onMiss, currentWeapon }: OfflineSkirmishSceneProps) {
  const { position, rotation, cameraRef } = useFpsControls();
  const impactRef = useRef<{ addImpact: (point: THREE.Vector3) => void }>(null);
  const { graphicsMode } = useGraphicsSettings();
  const settings = getGraphicsSettings(graphicsMode);
  
  const [targets] = useState<MovingTarget[]>([
    {
      id: 1,
      position: new THREE.Vector3(-5, 1, -15),
      velocity: new THREE.Vector3(2, 0, 0),
      mesh: null,
      bounds: { minX: -8, maxX: -2, minZ: -15, maxZ: -15 },
    },
    {
      id: 2,
      position: new THREE.Vector3(5, 1, -18),
      velocity: new THREE.Vector3(-1.5, 0, 0),
      mesh: null,
      bounds: { minX: 2, maxX: 8, minZ: -18, maxZ: -18 },
    },
    {
      id: 3,
      position: new THREE.Vector3(0, 1, -22),
      velocity: new THREE.Vector3(0, 0, 1.2),
      mesh: null,
      bounds: { minX: 0, maxX: 0, minZ: -25, maxZ: -19 },
    },
  ]);

  useFrame(({ camera }, delta) => {
    camera.position.set(position.x, position.y, position.z);
    camera.rotation.set(rotation.x, rotation.y, rotation.z);

    // Update moving targets
    targets.forEach(target => {
      target.position.x += target.velocity.x * delta;
      target.position.z += target.velocity.z * delta;

      // Bounce off bounds
      if (target.position.x <= target.bounds.minX || target.position.x >= target.bounds.maxX) {
        target.velocity.x *= -1;
      }
      if (target.position.z <= target.bounds.minZ || target.position.z >= target.bounds.maxZ) {
        target.velocity.z *= -1;
      }

      // Update mesh position
      if (target.mesh) {
        target.mesh.position.copy(target.position);
      }
    });
  });

  const handleFire = (direction: THREE.Vector3) => {
    const weaponConfig = OFFLINE_WEAPONS[currentWeapon];
    
    // Apply weapon spread
    const spreadX = (Math.random() - 0.5) * weaponConfig.spread;
    const spreadY = (Math.random() - 0.5) * weaponConfig.spread;
    const spreadDirection = direction.clone();
    spreadDirection.x += spreadX;
    spreadDirection.y += spreadY;
    spreadDirection.normalize();

    // Raycast for hit detection
    const raycaster = new THREE.Raycaster(
      new THREE.Vector3(position.x, position.y, position.z),
      spreadDirection
    );

    let hitDetected = false;

    // Check hits against targets
    targets.forEach(target => {
      if (target.mesh) {
        const intersects = raycaster.intersectObject(target.mesh, true);
        if (intersects.length > 0) {
          hitDetected = true;
          onHit();
          impactRef.current?.addImpact(intersects[0].point);
        }
      }
    });

    if (!hitDetected) {
      onMiss();
      // Show impact on environment
      const impactPoint = new THREE.Vector3(
        position.x + spreadDirection.x * 30,
        position.y + spreadDirection.y * 30,
        position.z + spreadDirection.z * 30
      );
      impactRef.current?.addImpact(impactPoint);
    }
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        castShadow={settings.shadowsEnabled}
        shadow-mapSize={[settings.shadowMapSize, settings.shadowMapSize]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight args={['#87ceeb', '#545454', 0.5]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={settings.shadowsEnabled} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#3a3a3a" 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Training structures */}
      {/* Walls */}
      <mesh position={[-10, 1.5, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
        <boxGeometry args={[0.5, 3, 20]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>
      <mesh position={[10, 1.5, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
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
        <mesh key={i} position={pos as [number, number, number]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[1.5, pos[1] * 2, 1.5]} />
          <meshStandardMaterial 
            color="#5a5a5a" 
            roughness={0.85}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Moving targets */}
      {targets.map((target, i) => (
        <group key={`target-${target.id}`}>
          <mesh 
            ref={(ref) => {
              if (ref) targets[i].mesh = ref;
            }}
            position={target.position}
            castShadow={settings.shadowsEnabled}
          >
            <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
            <meshStandardMaterial color="#c41e3a" roughness={0.9} />
          </mesh>
          <mesh position={[target.position.x, target.position.y + 1.2, target.position.z]} castShadow={settings.shadowsEnabled}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#ff4444" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Player arms and weapon */}
      <PlayerArmsAndWeapon 
        cameraRef={cameraRef}
        onFire={handleFire}
        weaponConfig={OFFLINE_WEAPONS[currentWeapon]}
      />

      {/* Impact effects */}
      <ImpactEffects ref={impactRef} />
    </>
  );
}
