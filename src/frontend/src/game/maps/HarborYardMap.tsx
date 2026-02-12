import { useGraphicsSettings } from '../settings/useGraphicsSettings';
import { getGraphicsSettings } from '../settings/graphics';
import GroundDetailGrass from './props/GroundDetailGrass';
import LowPolyTree from './props/LowPolyTree';
import Door from './props/Door';

export default function HarborYardMap() {
  const { graphicsMode } = useGraphicsSettings();
  const settings = getGraphicsSettings(graphicsMode);

  const treePositions = graphicsMode === 'Performance' 
    ? [
        [-45, 0, 35],
        [45, 0, 35],
        [-45, 0, -35],
        [45, 0, -35],
        [-40, 0, 0],
        [40, 0, 0],
      ]
    : [
        [-45, 0, 35],
        [45, 0, 35],
        [-45, 0, -35],
        [45, 0, -35],
        [-40, 0, 0],
        [40, 0, 0],
        [-48, 0, 18],
        [48, 0, 18],
        [-48, 0, -18],
        [48, 0, -18],
        [-42, 0, -40],
        [42, 0, 40],
        [-35, 0, 42],
        [35, 0, -42],
      ];

  return (
    <>
      {/* Ground - concrete/asphalt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={settings.shadowsEnabled} position={[0, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Ground detail - sparse weeds */}
      <GroundDetailGrass 
        graphicsMode={graphicsMode}
        bounds={{ minX: -50, maxX: 50, minZ: -50, maxZ: 50 }}
        density={0.4}
      />

      {/* Trees around perimeter */}
      {treePositions.map((pos, i) => (
        <LowPolyTree 
          key={`tree-${i}`}
          position={pos as [number, number, number]}
          shadowsEnabled={settings.shadowsEnabled}
          variant="normal"
          scale={0.85}
        />
      ))}

      {/* Large shipping containers - scattered layout */}
      {[
        { pos: [-8, 1.2, -10], size: [2.4, 2.4, 6], color: '#8b4513' },
        { pos: [-8, 3.6, -10], size: [2.4, 2.4, 6], color: '#654321' },
        { pos: [12, 1.2, -5], size: [2.4, 2.4, 6], color: '#4a5568' },
        { pos: [12, 3.6, -5], size: [2.4, 2.4, 6], color: '#2d3748' },
        { pos: [0, 1.2, 8], size: [6, 2.4, 2.4], color: '#1a365d' },
        { pos: [-15, 1.2, 5], size: [2.4, 2.4, 6], color: '#742a2a' },
        { pos: [8, 1.2, 12], size: [6, 2.4, 2.4], color: '#2f855a' },
      ].map((container, i) => (
        <mesh 
          key={`container-${i}`} 
          position={container.pos as [number, number, number]} 
          castShadow={settings.shadowsEnabled} 
          receiveShadow={settings.shadowsEnabled}
        >
          <boxGeometry args={container.size as [number, number, number]} />
          <meshStandardMaterial 
            color={container.color} 
            roughness={0.8}
            metalness={0.3}
          />
        </mesh>
      ))}

      {/* Additional container stacks */}
      {[
        { pos: [18, 1.2, -15], size: [2.4, 2.4, 6], color: '#5a3a2a', rot: Math.PI / 2 },
        { pos: [18, 3.6, -15], size: [2.4, 2.4, 6], color: '#4a2a1a', rot: Math.PI / 2 },
        { pos: [-20, 1.2, -8], size: [6, 2.4, 2.4], color: '#3a4a5a', rot: 0 },
        { pos: [-20, 3.6, -8], size: [6, 2.4, 2.4], color: '#2a3a4a', rot: 0 },
        { pos: [5, 1.2, -18], size: [2.4, 2.4, 6], color: '#6a4a3a', rot: 0 },
        { pos: [-5, 1.2, 15], size: [2.4, 2.4, 6], color: '#4a5a4a', rot: Math.PI / 3 },
        { pos: [22, 1.2, 8], size: [2.4, 2.4, 6], color: '#5a4a6a', rot: 0 },
      ].map((container, i) => (
        <mesh 
          key={`container-extra-${i}`} 
          position={container.pos as [number, number, number]}
          rotation={[0, container.rot, 0]}
          castShadow={settings.shadowsEnabled} 
          receiveShadow={settings.shadowsEnabled}
        >
          <boxGeometry args={container.size as [number, number, number]} />
          <meshStandardMaterial 
            color={container.color} 
            roughness={0.8}
            metalness={0.3}
          />
        </mesh>
      ))}

      {/* Warehouse structure */}
      <group position={[-20, 0, -15]}>
        {/* Walls */}
        <mesh position={[0, 2.5, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[0.3, 5, 12]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
        </mesh>
        <mesh position={[8, 2.5, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[0.3, 5, 12]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
        </mesh>
        <mesh position={[4, 2.5, -6]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[8, 5, 0.3]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
        </mesh>
        {/* Roof */}
        <mesh position={[4, 5.2, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[8.5, 0.2, 12.5]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.7} metalness={0.4} />
        </mesh>
        {/* Door */}
        <Door 
          position={[4, 0, 6.2]}
          shadowsEnabled={settings.shadowsEnabled}
          style="metal"
          scale={1.2}
        />
      </group>

      {/* Additional utility sheds */}
      <group position={[15, 0, 18]}>
        <mesh position={[0, 1.5, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[4, 3, 4]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.2, 0]} castShadow={settings.shadowsEnabled}>
          <boxGeometry args={[4.3, 0.3, 4.3]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.85} />
        </mesh>
        <Door 
          position={[0, 0, 2.15]}
          shadowsEnabled={settings.shadowsEnabled}
          style="metal"
          scale={1}
        />
      </group>

      <group position={[-25, 0, 10]}>
        <mesh position={[0, 1.2, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[3, 2.4, 3.5]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.6, 0]} castShadow={settings.shadowsEnabled}>
          <boxGeometry args={[3.3, 0.3, 3.8]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.85} />
        </mesh>
        <Door 
          position={[0, 0, 1.9]}
          shadowsEnabled={settings.shadowsEnabled}
          style="metal"
          scale={0.95}
        />
      </group>

      <group position={[10, 0, -25]}>
        <mesh position={[0, 1.8, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[5, 3.6, 4]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.8, 0]} castShadow={settings.shadowsEnabled}>
          <boxGeometry args={[5.3, 0.3, 4.3]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.85} />
        </mesh>
        <Door 
          position={[0, 0, 2.15]}
          shadowsEnabled={settings.shadowsEnabled}
          style="metal"
          scale={1.1}
        />
      </group>

      {/* Concrete barriers */}
      {[
        [5, 0.4, -2],
        [5, 0.4, 0],
        [5, 0.4, 2],
        [-3, 0.4, -15],
        [-1, 0.4, -15],
        [1, 0.4, -15],
      ].map((pos, i) => (
        <mesh key={`barrier-${i}`} position={pos as [number, number, number]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[1.5, 0.8, 0.4]} />
          <meshStandardMaterial 
            color="#5a5a5a" 
            roughness={0.95}
          />
        </mesh>
      ))}

      {/* Additional barrier lines */}
      {[
        [-10, 0.4, 18],
        [-8, 0.4, 18],
        [-6, 0.4, 18],
        [20, 0.4, 0],
        [20, 0.4, 2],
        [20, 0.4, 4],
        [-18, 0.4, -20],
        [-16, 0.4, -20],
      ].map((pos, i) => (
        <mesh key={`barrier-extra-${i}`} position={pos as [number, number, number]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[1.5, 0.8, 0.4]} />
          <meshStandardMaterial color="#5a5a5a" roughness={0.95} />
        </mesh>
      ))}

      {/* Metal crates */}
      {[
        [18, 0.5, 0],
        [18, 0.5, 2],
        [18, 1.5, 1],
        [-12, 0.5, 12],
        [-10, 0.5, 12],
      ].map((pos, i) => (
        <mesh key={`crate-${i}`} position={pos as [number, number, number]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            color="#4a4a4a" 
            roughness={0.7}
            metalness={0.5}
          />
        </mesh>
      ))}

      {/* Additional crate clusters */}
      {[
        { base: [-8, 0, 0], stacks: [[0, 0.5, 0], [1.2, 0.5, 0], [0, 0.5, 1.2], [0.6, 1.5, 0.6]] },
        { base: [25, 0, -10], stacks: [[0, 0.5, 0], [1.2, 0.5, 0], [0, 1.5, 0]] },
        { base: [-15, 0, -25], stacks: [[0, 0.5, 0], [1.2, 0.5, 0], [2.4, 0.5, 0]] },
        { base: [8, 0, 20], stacks: [[0, 0.5, 0], [0, 0.5, 1.2], [0, 1.5, 0.6]] },
      ].map((area, ai) => (
        <group key={`crate-cluster-${ai}`} position={area.base as [number, number, number]}>
          {area.stacks.map((offset, si) => (
            <mesh 
              key={si} 
              position={offset as [number, number, number]}
              castShadow={settings.shadowsEnabled} 
              receiveShadow={settings.shadowsEnabled}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#4a4a4a" roughness={0.7} metalness={0.5} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Pallet stacks */}
      {[
        { pos: [2, 0.15, 5], count: 3 },
        { pos: [-22, 0.15, 2], count: 4 },
        { pos: [12, 0.15, -12], count: 2 },
      ].map((stack, si) => (
        <group key={`pallet-${si}`}>
          {Array.from({ length: stack.count }).map((_, i) => (
            <mesh 
              key={i} 
              position={[stack.pos[0], stack.pos[1] + i * 0.3, stack.pos[2]]}
              castShadow={settings.shadowsEnabled} 
              receiveShadow={settings.shadowsEnabled}
            >
              <boxGeometry args={[1.2, 0.15, 1.2]} />
              <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Low walls for cover */}
      {[
        { pos: [-2, 0.6, 10], size: [4, 1.2, 0.3] },
        { pos: [15, 0.6, 5], size: [0.3, 1.2, 3] },
        { pos: [-18, 0.6, -5], size: [3, 1.2, 0.3] },
        { pos: [6, 0.6, -8], size: [0.3, 1.2, 4] },
      ].map((wall, i) => (
        <mesh 
          key={`wall-${i}`} 
          position={wall.pos as [number, number, number]}
          castShadow={settings.shadowsEnabled} 
          receiveShadow={settings.shadowsEnabled}
        >
          <boxGeometry args={wall.size as [number, number, number]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
        </mesh>
      ))}
    </>
  );
}
