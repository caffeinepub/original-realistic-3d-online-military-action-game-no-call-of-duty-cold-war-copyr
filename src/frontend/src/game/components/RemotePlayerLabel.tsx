import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface RemotePlayerLabelProps {
  username: string;
  position: [number, number, number];
}

export default function RemotePlayerLabel({ username, position }: RemotePlayerLabelProps) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    // Create canvas texture for the label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    const displayName = username.length > 20 
      ? `${username.slice(0, 8)}...${username.slice(-6)}`
      : username;

    // Set canvas size
    canvas.width = 512;
    canvas.height = 128;

    // Draw background
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.roundRect(0, 0, canvas.width, canvas.height, 16);
    context.fill();

    // Draw text
    context.fillStyle = '#ffffff';
    context.font = 'bold 48px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(displayName, canvas.width / 2, canvas.height / 2);

    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    textureRef.current = texture;

    if (spriteRef.current) {
      spriteRef.current.material.map = texture;
      spriteRef.current.material.needsUpdate = true;
    }

    return () => {
      texture.dispose();
    };
  }, [username]);

  return (
    <sprite ref={spriteRef} position={position} scale={[2, 0.5, 1]}>
      <spriteMaterial transparent opacity={0.9} />
    </sprite>
  );
}
