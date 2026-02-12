import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useFpsControls from '../controls/useFpsControls';
import PlayerArmsAndWeapon from '../components/PlayerArmsAndWeapon';
import ImpactEffects from '../components/ImpactEffects';
import RemotePlayerAvatar from '../components/RemotePlayerAvatar';
import { useGetPlayersInGame, useUpdatePlayerPosition } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function OnlineMatchScene() {
  const { position, rotation, cameraRef } = useFpsControls();
  const { identity } = useInternetIdentity();
  const { data: players = [] } = useGetPlayersInGame();
  const updatePosition = useUpdatePlayerPosition();
  const impactRef = useRef<{ addImpact: (point: THREE.Vector3) => void }>(null);
  const lastUpdateTime = useRef(0);

  const myPrincipal = identity?.getPrincipal().toString();

  useFrame(({ camera, clock }) => {
    camera.position.set(position.x, position.y, position.z);
    camera.rotation.set(rotation.x, rotation.y, rotation.z);

    // Send position updates every 100ms
    const now = clock.getElapsedTime();
    if (now - lastUpdateTime.current > 0.1) {
      lastUpdateTime.current = now;
      updatePosition.mutate({
        x: position.x,
        y: position.y,
        z: position.z,
        rotation: rotation.y,
      });
    }
  });

  // Filter out local player
  const remotePlayers = players.filter(
    p => p.username !== myPrincipal
  );

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

      {/* Training structures (same as training scene) */}
      <mesh position={[-10, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 3, 20]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>
      <mesh position={[10, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 3, 20]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>

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

      {/* Remote players */}
      {remotePlayers.map((player) => (
        <RemotePlayerAvatar
          key={player.username}
          position={[player.position.x, player.position.y, player.position.z]}
          rotation={player.position.rotation}
          username={player.username}
        />
      ))}

      {/* Player arms and weapon */}
      <PlayerArmsAndWeapon 
        cameraRef={cameraRef}
        onFire={(direction) => {
          const impactPoint = new THREE.Vector3(
            position.x + direction.x * 20,
            position.y + direction.y * 20,
            position.z + direction.z * 20
          );
          impactRef.current?.addImpact(impactPoint);
        }}
      />

      <ImpactEffects ref={impactRef} />
    </>
  );
}
