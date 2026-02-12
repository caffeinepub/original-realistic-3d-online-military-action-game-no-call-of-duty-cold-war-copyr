import { useGraphicsSettings } from '../settings/useGraphicsSettings';
import { getGraphicsSettings } from '../settings/graphics';
import GroundDetailGrass from './props/GroundDetailGrass';
import LowPolyTree from './props/LowPolyTree';
import Door from './props/Door';

export default function TrainingRangeMap() {
  const { graphicsMode } = useGraphicsSettings();
  const settings = getGraphicsSettings(graphicsMode);

  const treePositions = graphicsMode === 'Performance' 
    ? [
        [-35, 0, 30],
        [35, 0, 30],
        [-35, 0, -30],
        [35, 0, -30],
        [-30, 0, 0],
        [30, 0, 0],
      ]
    : [
        [-35, 0, 30],
        [35, 0, 30],
        [-35, 0, -30],
        [35, 0, -30],
        [-30, 0, 0],
        [30, 0, 0],
        [-38, 0, 15],
        [38, 0, 15],
        [-38, 0, -15],
        [38, 0, -15],
        [-32, 0, -35],
        [32, 0, 35],
      ];

  return (
    <>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={settings.shadowsEnabled} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#3a3a3a" 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Ground detail grass */}
      <GroundDetailGrass 
        graphicsMode={graphicsMode}
        bounds={{ minX: -45, maxX: 45, minZ: -45, maxZ: 45 }}
        density={0.8}
      />

      {/* Trees around perimeter */}
      {treePositions.map((pos, i) => (
        <LowPolyTree 
          key={`tree-${i}`}
          position={pos as [number, number, number]}
          shadowsEnabled={settings.shadowsEnabled}
          variant="normal"
          scale={0.9}
        />
      ))}

      {/* Side walls */}
      <mesh position={[-10, 1.5, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
        <boxGeometry args={[0.5, 3, 20]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>
      <mesh position={[10, 1.5, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
        <boxGeometry args={[0.5, 3, 20]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>

      {/* Cover boxes - original */}
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

      {/* Small sheds - distributed */}
      <group position={[-6, 0, 5]}>
        <mesh position={[0, 1, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[2.5, 2, 2.5]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.3, 0]} castShadow={settings.shadowsEnabled}>
          <boxGeometry args={[2.7, 0.3, 2.7]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.85} />
        </mesh>
        <Door 
          position={[0, 0, 1.3]}
          shadowsEnabled={settings.shadowsEnabled}
          style="metal"
          scale={0.9}
        />
      </group>

      <group position={[7, 0, -3]}>
        <mesh position={[0, 1, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.2, 0]} castShadow={settings.shadowsEnabled}>
          <boxGeometry args={[2.2, 0.3, 2.2]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.85} />
        </mesh>
        <Door 
          position={[0, 0, 1.05]}
          shadowsEnabled={settings.shadowsEnabled}
          style="metal"
          scale={0.85}
        />
      </group>

      <group position={[-7, 0, -15]}>
        <mesh position={[0, 1.2, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[3, 2.4, 2.5]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.6, 0]} castShadow={settings.shadowsEnabled}>
          <boxGeometry args={[3.2, 0.3, 2.7]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.85} />
        </mesh>
        <Door 
          position={[0, 0, 1.3]}
          shadowsEnabled={settings.shadowsEnabled}
          style="metal"
          scale={1}
        />
      </group>

      {/* Lean-to structures */}
      <group position={[8, 0, 8]}>
        <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 6]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[2.5, 0.1, 2]} />
          <meshStandardMaterial color="#5a5a5a" roughness={0.9} />
        </mesh>
        <mesh position={[-0.5, 0.4, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[0.1, 0.8, 2]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
        </mesh>
      </group>

      <group position={[-8, 0, -7]}>
        <mesh position={[0, 0.9, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[2, 0.1, 2.5]} />
          <meshStandardMaterial color="#5a5a5a" roughness={0.9} />
        </mesh>
        <mesh position={[0.4, 0.45, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[0.1, 0.9, 2.5]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
        </mesh>
      </group>

      {/* Barricade clusters */}
      {[
        { center: [2, 0, 3], count: 4 },
        { center: [-4, 0, -3], count: 3 },
        { center: [6, 0, -18], count: 5 },
        { center: [-6, 0, 12], count: 4 },
      ].map((cluster, ci) => (
        <group key={`cluster-${ci}`}>
          {Array.from({ length: cluster.count }).map((_, i) => {
            const angle = (i / cluster.count) * Math.PI * 1.5;
            const radius = 1.5;
            const x = cluster.center[0] + Math.cos(angle) * radius;
            const z = cluster.center[2] + Math.sin(angle) * radius;
            return (
              <mesh 
                key={i} 
                position={[x, 0.5, z]} 
                rotation={[0, angle, 0]}
                castShadow={settings.shadowsEnabled} 
                receiveShadow={settings.shadowsEnabled}
              >
                <boxGeometry args={[1.2, 1, 0.2]} />
                <meshStandardMaterial color="#5a5a5a" roughness={0.9} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Stacked crate areas */}
      {[
        { base: [4, 0, 15], stacks: [[0, 0.5, 0], [1.2, 0.5, 0], [0.6, 1.5, 0]] },
        { base: [-5, 0, 8], stacks: [[0, 0.5, 0], [1.1, 0.5, 0], [0, 0.5, 1.1], [0.55, 1.5, 0.55]] },
        { base: [8, 0, -8], stacks: [[0, 0.5, 0], [1.2, 0.5, 0], [0, 0.5, 1.2]] },
      ].map((area, ai) => (
        <group key={`crates-${ai}`} position={area.base as [number, number, number]}>
          {area.stacks.map((offset, si) => (
            <mesh 
              key={si} 
              position={offset as [number, number, number]}
              castShadow={settings.shadowsEnabled} 
              receiveShadow={settings.shadowsEnabled}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#5a5a5a" roughness={0.85} metalness={0.1} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Wall segments for cover */}
      {[
        { pos: [0, 0.75, 10], size: [3, 1.5, 0.3], rot: 0 },
        { pos: [3, 0.75, -2], size: [0.3, 1.5, 2.5], rot: 0 },
        { pos: [-3, 0.75, -18], size: [2, 1.5, 0.3], rot: 0 },
        { pos: [9, 0.75, -12], size: [0.3, 1.5, 3], rot: 0 },
      ].map((wall, i) => (
        <mesh 
          key={`wall-${i}`} 
          position={wall.pos as [number, number, number]}
          rotation={[0, wall.rot, 0]}
          castShadow={settings.shadowsEnabled} 
          receiveShadow={settings.shadowsEnabled}
        >
          <boxGeometry args={wall.size as [number, number, number]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
        </mesh>
      ))}

      {/* Additional scattered cover boxes */}
      {[
        [2, 0.4, 12],
        [-2, 0.4, 14],
        [6, 0.5, 2],
        [-7, 0.6, -10],
        [8, 0.5, -15],
        [-4, 0.5, 16],
        [5, 0.4, -5],
        [-6, 0.5, -20],
      ].map((pos, i) => (
        <mesh key={`extra-${i}`} position={pos as [number, number, number]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[1.2, pos[1] * 2, 1.2]} />
          <meshStandardMaterial color="#5a5a5a" roughness={0.85} metalness={0.1} />
        </mesh>
      ))}
    </>
  );
}
