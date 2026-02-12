import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useFpsControls from '../controls/useFpsControls';
import PlayerArmsAndWeapon from '../components/PlayerArmsAndWeapon';
import ImpactEffects from '../components/ImpactEffects';
import RemotePlayerAvatar from '../components/RemotePlayerAvatar';
import { useGetPlayersInGame, useUpdatePlayerPosition, useGetActiveLobbies } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGraphicsSettings } from '../settings/useGraphicsSettings';
import { getGraphicsSettings } from '../settings/graphics';
import { getMapInfo } from '../maps/mapRegistry';
import { GameMap } from '../../backend';

interface OnlineMatchSceneProps {
  lobbyId: bigint | null;
}

export default function OnlineMatchScene({ lobbyId }: OnlineMatchSceneProps) {
  const { position, rotation, cameraRef } = useFpsControls();
  const { identity } = useInternetIdentity();
  const { data: players = [] } = useGetPlayersInGame();
  const { data: lobbies = [] } = useGetActiveLobbies();
  const updatePosition = useUpdatePlayerPosition();
  const impactRef = useRef<{ addImpact: (point: THREE.Vector3) => void }>(null);
  const lastUpdateTime = useRef(0);
  const lastPosition = useRef({ x: 0, y: 0, z: 0, rotation: 0 });
  const { graphicsMode } = useGraphicsSettings();
  const settings = getGraphicsSettings(graphicsMode);

  const myPrincipal = identity?.getPrincipal().toString();

  // Resolve the map for this lobby
  const currentLobby = lobbyId ? lobbies.find(l => l.id === lobbyId) : null;
  const selectedMap = currentLobby?.selectedMap ?? GameMap.island;
  const mapInfo = getMapInfo(selectedMap);
  const MapComponent = mapInfo.component;

  useFrame(({ camera, clock }) => {
    camera.position.set(position.x, position.y, position.z);
    camera.rotation.set(rotation.x, rotation.y, rotation.z);

    // Throttle position updates with movement threshold
    const now = clock.getElapsedTime();
    if (now - lastUpdateTime.current > 0.1) {
      const dx = position.x - lastPosition.current.x;
      const dy = position.y - lastPosition.current.y;
      const dz = position.z - lastPosition.current.z;
      const dr = Math.abs(rotation.y - lastPosition.current.rotation);
      
      const movementThreshold = 0.01;
      const rotationThreshold = 0.01;
      
      const hasMoved = Math.abs(dx) > movementThreshold || 
                       Math.abs(dy) > movementThreshold || 
                       Math.abs(dz) > movementThreshold ||
                       dr > rotationThreshold;

      if (hasMoved) {
        lastUpdateTime.current = now;
        lastPosition.current = {
          x: position.x,
          y: position.y,
          z: position.z,
          rotation: rotation.y,
        };
        
        updatePosition.mutate({
          x: position.x,
          y: position.y,
          z: position.z,
          rotation: rotation.y,
        });
      }
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
        castShadow={settings.shadowsEnabled}
        shadow-mapSize={[settings.shadowMapSize, settings.shadowMapSize]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight args={['#87ceeb', '#545454', 0.5]} />

      {/* Render selected map */}
      <MapComponent />

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
