import { useState, useCallback, useRef } from 'react';
import * as THREE from 'three';
import type { WeaponConfig } from './offlineWeapons';

interface UseWeaponProps {
  onFire: (direction: THREE.Vector3) => void;
  cameraRef: React.MutableRefObject<THREE.Camera | null>;
  weaponConfig?: WeaponConfig;
}

export default function useWeapon({ onFire, cameraRef, weaponConfig }: UseWeaponProps) {
  const [isFiring, setIsFiring] = useState(false);
  const lastFireTime = useRef(0);
  const fireRate = weaponConfig?.fireRate || 150;

  const fire = useCallback(() => {
    const now = Date.now();
    if (now - lastFireTime.current < fireRate) return;

    lastFireTime.current = now;
    setIsFiring(true);

    // Get camera direction
    const direction = new THREE.Vector3(0, 0, -1);
    if (cameraRef.current) {
      direction.applyQuaternion(cameraRef.current.quaternion);
    }

    onFire(direction);

    setTimeout(() => setIsFiring(false), 50);
  }, [onFire, fireRate, cameraRef]);

  return { isFiring, fire };
}
