import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FpsState {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  cameraRef: React.MutableRefObject<THREE.Camera | null>;
}

export default function useFpsControls(): FpsState {
  const cameraRef = useRef<THREE.Camera | null>(null);
  const [position] = useState(() => new THREE.Vector3(0, 1.6, 5));
  const [rotation] = useState(() => new THREE.Euler(0, 0, 0, 'YXZ'));
  
  const keysPressed = useRef<Set<string>>(new Set());
  const mouseMovement = useRef({ x: 0, y: 0 });
  const velocity = useRef(new THREE.Vector3());
  const isSprinting = useRef(false);
  const isCrouching = useRef(false);
  const isJumping = useRef(false);
  const pointerLocked = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
      if (e.key.toLowerCase() === 'shift') isSprinting.current = true;
      if (e.key.toLowerCase() === 'c') isCrouching.current = !isCrouching.current;
      if (e.key === ' ' && !isJumping.current) {
        isJumping.current = true;
        velocity.current.y = 5;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
      if (e.key.toLowerCase() === 'shift') isSprinting.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!pointerLocked.current) return;
      mouseMovement.current.x = e.movementX;
      mouseMovement.current.y = e.movementY;
    };

    const handleClick = () => {
      if (!pointerLocked.current) {
        document.body.requestPointerLock();
      }
    };

    const handlePointerLockChange = () => {
      pointerLocked.current = document.pointerLockElement === document.body;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, []);

  useFrame((_, delta) => {
    if (!pointerLocked.current) return;

    // Mouse look
    rotation.y -= mouseMovement.current.x * 0.002;
    rotation.x -= mouseMovement.current.y * 0.002;
    rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.x));
    mouseMovement.current.x = 0;
    mouseMovement.current.y = 0;

    // Movement
    const moveSpeed = isSprinting.current ? 8 : 4;
    const direction = new THREE.Vector3();
    
    if (keysPressed.current.has('w')) direction.z -= 1;
    if (keysPressed.current.has('s')) direction.z += 1;
    if (keysPressed.current.has('a')) direction.x -= 1;
    if (keysPressed.current.has('d')) direction.x += 1;

    if (direction.length() > 0) {
      direction.normalize();
      direction.applyEuler(new THREE.Euler(0, rotation.y, 0));
      velocity.current.x = direction.x * moveSpeed;
      velocity.current.z = direction.z * moveSpeed;
    } else {
      velocity.current.x *= 0.9;
      velocity.current.z *= 0.9;
    }

    // Gravity and jumping
    if (isJumping.current) {
      velocity.current.y -= 20 * delta;
      if (position.y <= (isCrouching.current ? 1.2 : 1.6)) {
        position.y = isCrouching.current ? 1.2 : 1.6;
        velocity.current.y = 0;
        isJumping.current = false;
      }
    } else {
      position.y = isCrouching.current ? 1.2 : 1.6;
    }

    position.x += velocity.current.x * delta;
    position.y += velocity.current.y * delta;
    position.z += velocity.current.z * delta;

    // Boundaries
    position.x = Math.max(-9, Math.min(9, position.x));
    position.z = Math.max(-25, Math.min(25, position.z));
  });

  return { position, rotation, cameraRef };
}
