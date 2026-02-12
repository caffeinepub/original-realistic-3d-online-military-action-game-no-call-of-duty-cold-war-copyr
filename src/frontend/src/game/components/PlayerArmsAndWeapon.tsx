import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useWeapon from '../weapons/useWeapon';
import type { WeaponConfig } from '../weapons/offlineWeapons';

interface PlayerArmsAndWeaponProps {
  cameraRef: React.MutableRefObject<THREE.Camera | null>;
  onFire: (direction: THREE.Vector3) => void;
  weaponConfig?: WeaponConfig;
}

export default function PlayerArmsAndWeapon({ cameraRef, onFire, weaponConfig }: PlayerArmsAndWeaponProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { isFiring, fire } = useWeapon({ onFire, cameraRef, weaponConfig });
  const recoilRef = useRef(0);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && document.pointerLockElement) {
        fire();
        recoilRef.current = 0.1;
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    return () => window.removeEventListener('mousedown', handleMouseDown);
  }, [fire]);

  useFrame(({ camera }) => {
    if (!groupRef.current) return;

    // Smooth recoil recovery using ref instead of state
    if (recoilRef.current > 0) {
      recoilRef.current = Math.max(0, recoilRef.current - 0.01);
    }

    // Position weapon relative to camera
    groupRef.current.position.copy(camera.position);
    groupRef.current.quaternion.copy(camera.quaternion);
    
    // Offset to bottom right of screen
    const offset = new THREE.Vector3(0.3, -0.3, -0.5);
    offset.applyQuaternion(camera.quaternion);
    groupRef.current.position.add(offset);

    // Apply recoil
    groupRef.current.rotation.x += recoilRef.current;
  });

  // Adjust weapon visuals based on config
  const isSmg = weaponConfig?.name === 'Rapid SMG';
  const weaponColor = isSmg ? '#3a3a3a' : '#2a2a2a';
  const barrelLength = isSmg ? 0.2 : 0.3;

  return (
    <group ref={groupRef}>
      {/* Weapon body - simple tactical rifle/smg shape */}
      <mesh position={[0, 0, -0.3]}>
        <boxGeometry args={[0.05, 0.08, isSmg ? 0.4 : 0.5]} />
        <meshStandardMaterial color={weaponColor} roughness={0.6} metalness={0.8} />
      </mesh>
      
      {/* Barrel */}
      <mesh position={[0, 0, isSmg ? -0.5 : -0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, barrelLength, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.9} />
      </mesh>

      {/* Stock */}
      <mesh position={[0, -0.02, 0.1]}>
        <boxGeometry args={[0.06, 0.06, 0.2]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.8} metalness={0.3} />
      </mesh>

      {/* Muzzle flash */}
      {isFiring && (
        <pointLight position={[0, 0, isSmg ? -0.65 : -0.8]} intensity={2} distance={3} color="#ff8800" />
      )}
    </group>
  );
}
