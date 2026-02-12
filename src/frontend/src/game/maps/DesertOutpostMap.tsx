import { useGraphicsSettings } from '../settings/useGraphicsSettings';
import { getGraphicsSettings } from '../settings/graphics';
import GroundDetailGrass from './props/GroundDetailGrass';
import LowPolyTree from './props/LowPolyTree';
import Door from './props/Door';

export default function DesertOutpostMap() {
  const { graphicsMode } = useGraphicsSettings();
  const settings = getGraphicsSettings(graphicsMode);

  const treePositions = graphicsMode === 'Performance' 
    ? [
        [-38, 0, 32],
        [38, 0, 32],
        [-38, 0, -32],
        [38, 0, -32],
        [-35, 0, 0],
        [35, 0, 0],
      ]
    : [
        [-38, 0, 32],
        [38, 0, 32],
        [-38, 0, -32],
        [38, 0, -32],
        [-35, 0, 0],
        [35, 0, 0],
        [-40, 0, 16],
        [40, 0, 16],
        [-40, 0, -16],
        [40, 0, -16],
        [-32, 0, -38],
        [32, 0, 38],
        [-30, 0, 38],
        [30, 0, -38],
      ];

  return (
    <>
      {/* Ground - sandy terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={settings.shadowsEnabled} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#d4a574" 
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      {/* Ground detail - dry scrub */}
      <GroundDetailGrass 
        graphicsMode={graphicsMode}
        bounds={{ minX: -45, maxX: 45, minZ: -45, maxZ: 45 }}
        density={0.5}
      />

      {/* Desert trees/shrubs around perimeter */}
      {treePositions.map((pos, i) => (
        <LowPolyTree 
          key={`tree-${i}`}
          position={pos as [number, number, number]}
          shadowsEnabled={settings.shadowsEnabled}
          variant={i % 3 === 0 ? 'shrub' : 'desert'}
          scale={i % 3 === 0 ? 0.8 : 0.75}
        />
      ))}

      {/* Central fortified building */}
      <group position={[0, 0, -8]}>
        {/* Main structure */}
        <mesh position={[0, 1.5, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[8, 3, 6]} />
          <meshStandardMaterial color="#8b7355" roughness={0.9} />
        </mesh>
        {/* Flat roof */}
        <mesh position={[0, 3.2, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[8.5, 0.3, 6.5]} />
          <meshStandardMaterial color="#7a6345" roughness={0.95} />
        </mesh>
        {/* Door */}
        <Door 
          position={[0, 0, 3.15]}
          shadowsEnabled={settings.shadowsEnabled}
          style="reinforced"
          scale={1.1}
        />
      </group>

      {/* Watchtower */}
      <group position={[12, 0, -12]}>
        {/* Base */}
        <mesh position={[0, 1.5, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[3, 3, 3]} />
          <meshStandardMaterial color="#8b7355" roughness={0.9} />
        </mesh>
        {/* Upper platform */}
        <mesh position={[0, 4, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[3.5, 0.3, 3.5]} />
          <meshStandardMaterial color="#7a6345" roughness={0.9} />
        </mesh>
        {/* Railings */}
        {[
          [0, 4.6, 1.75],
          [0, 4.6, -1.75],
          [1.75, 4.6, 0],
          [-1.75, 4.6, 0],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow={settings.shadowsEnabled}>
            <boxGeometry args={i < 2 ? [3, 0.2, 0.1] : [0.1, 0.2, 3]} />
            <meshStandardMaterial color="#6a5335" roughness={0.95} />
          </mesh>
        ))}
        {/* Door */}
        <Door 
          position={[0, 0, 1.65]}
          shadowsEnabled={settings.shadowsEnabled}
          style="wood"
          scale={0.9}
        />
      </group>

      {/* Adobe-style huts */}
      <group position={[-15, 0, 5]}>
        <mesh position={[0, 1, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[4, 2, 4]} />
          <meshStandardMaterial color="#8b7355" roughness={0.95} />
        </mesh>
        <mesh position={[0, 2.3, 0]} castShadow={settings.shadowsEnabled}>
          <boxGeometry args={[4.2, 0.3, 4.2]} />
          <meshStandardMaterial color="#7a6345" roughness={0.95} />
        </mesh>
        <Door 
          position={[0, 0, 2.15]}
          shadowsEnabled={settings.shadowsEnabled}
          style="wood"
          scale={0.85}
        />
      </group>

      <group position={[18, 0, 8]}>
        <mesh position={[0, 0.9, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[3.5, 1.8, 3.5]} />
          <meshStandardMaterial color="#8b7355" roughness={0.95} />
        </mesh>
        <mesh position={[0, 2, 0]} castShadow={settings.shadowsEnabled}>
          <boxGeometry args={[3.7, 0.3, 3.7]} />
          <meshStandardMaterial color="#7a6345" roughness={0.95} />
        </mesh>
        <Door 
          position={[0, 0, 1.9]}
          shadowsEnabled={settings.shadowsEnabled}
          style="wood"
          scale={0.8}
        />
      </group>

      <group position={[-20, 0, -15]}>
        <mesh position={[0, 1.1, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[4.5, 2.2, 4]} />
          <meshStandardMaterial color="#8b7355" roughness={0.95} />
        </mesh>
        <mesh position={[0, 2.4, 0]} castShadow={settings.shadowsEnabled}>
          <boxGeometry args={[4.7, 0.3, 4.2]} />
          <meshStandardMaterial color="#7a6345" roughness={0.95} />
        </mesh>
        <Door 
          position={[0, 0, 2.15]}
          shadowsEnabled={settings.shadowsEnabled}
          style="wood"
          scale={0.9}
        />
      </group>

      <group position={[15, 0, -18]}>
        <mesh position={[0, 0.8, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[3, 1.6, 3]} />
          <meshStandardMaterial color="#8b7355" roughness={0.95} />
        </mesh>
        <mesh position={[0, 1.8, 0]} castShadow={settings.shadowsEnabled}>
          <boxGeometry args={[3.2, 0.3, 3.2]} />
          <meshStandardMaterial color="#7a6345" roughness={0.95} />
        </mesh>
        <Door 
          position={[0, 0, 1.65]}
          shadowsEnabled={settings.shadowsEnabled}
          style="wood"
          scale={0.75}
        />
      </group>

      <group position={[-8, 0, 18]}>
        <mesh position={[0, 1, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[3.5, 2, 3.5]} />
          <meshStandardMaterial color="#8b7355" roughness={0.95} />
        </mesh>
        <mesh position={[0, 2.2, 0]} castShadow={settings.shadowsEnabled}>
          <boxGeometry args={[3.7, 0.3, 3.7]} />
          <meshStandardMaterial color="#7a6345" roughness={0.95} />
        </mesh>
        <Door 
          position={[0, 0, 1.9]}
          shadowsEnabled={settings.shadowsEnabled}
          style="wood"
          scale={0.85}
        />
      </group>

      {/* Canopy/lean-to structures */}
      <group position={[8, 0, 15]}>
        <mesh position={[0, 2, 0]} rotation={[0, 0, Math.PI / 8]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[3, 0.1, 3]} />
          <meshStandardMaterial color="#9a8565" roughness={0.9} />
        </mesh>
        {[[-1.2, 1, -1.2], [1.2, 1, -1.2], [-1.2, 1, 1.2], [1.2, 1, 1.2]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow={settings.shadowsEnabled}>
            <cylinderGeometry args={[0.1, 0.1, 2]} />
            <meshStandardMaterial color="#6a5335" roughness={0.95} />
          </mesh>
        ))}
      </group>

      <group position={[-12, 0, -8]}>
        <mesh position={[0, 1.8, 0]} rotation={[0, 0, -Math.PI / 8]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[2.5, 0.1, 2.5]} />
          <meshStandardMaterial color="#9a8565" roughness={0.9} />
        </mesh>
        {[[-1, 0.9, -1], [1, 0.9, -1], [-1, 0.9, 1], [1, 0.9, 1]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow={settings.shadowsEnabled}>
            <cylinderGeometry args={[0.1, 0.1, 1.8]} />
            <meshStandardMaterial color="#6a5335" roughness={0.95} />
          </mesh>
        ))}
      </group>

      {/* Sandbag fortifications */}
      {[
        { center: [5, 0, 0], count: 6, radius: 2 },
        { center: [-8, 0, -5], count: 5, radius: 1.8 },
        { center: [10, 0, -8], count: 4, radius: 1.5 },
        { center: [-15, 0, 12], count: 5, radius: 1.8 },
      ].map((cluster, ci) => (
        <group key={`sandbags-${ci}`}>
          {Array.from({ length: cluster.count }).map((_, i) => {
            const angle = (i / cluster.count) * Math.PI * 1.8;
            const x = cluster.center[0] + Math.cos(angle) * cluster.radius;
            const z = cluster.center[2] + Math.sin(angle) * cluster.radius;
            return (
              <mesh 
                key={i} 
                position={[x, 0.3, z]} 
                rotation={[0, angle, 0]}
                castShadow={settings.shadowsEnabled} 
                receiveShadow={settings.shadowsEnabled}
              >
                <boxGeometry args={[0.8, 0.6, 0.4]} />
                <meshStandardMaterial color="#9a8565" roughness={0.95} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Additional sandbag clusters */}
      {[
        { center: [20, 0, 15], count: 4, radius: 1.5 },
        { center: [-22, 0, -18], count: 5, radius: 1.8 },
        { center: [8, 0, -20], count: 4, radius: 1.4 },
        { center: [-5, 0, 22], count: 5, radius: 1.7 },
        { center: [18, 0, -5], count: 3, radius: 1.2 },
      ].map((cluster, ci) => (
        <group key={`sandbags-extra-${ci}`}>
          {Array.from({ length: cluster.count }).map((_, i) => {
            const angle = (i / cluster.count) * Math.PI * 1.8;
            const x = cluster.center[0] + Math.cos(angle) * cluster.radius;
            const z = cluster.center[2] + Math.sin(angle) * cluster.radius;
            return (
              <mesh 
                key={i} 
                position={[x, 0.3, z]} 
                rotation={[0, angle, 0]}
                castShadow={settings.shadowsEnabled} 
                receiveShadow={settings.shadowsEnabled}
              >
                <boxGeometry args={[0.8, 0.6, 0.4]} />
                <meshStandardMaterial color="#9a8565" roughness={0.95} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Supply crates */}
      {[
        [3, 0.5, 5],
        [3, 1.5, 5],
        [4.5, 0.5, 5],
        [-5, 0.5, -12],
        [-3.5, 0.5, -12],
      ].map((pos, i) => (
        <mesh key={`crate-${i}`} position={pos as [number, number, number]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial 
            color="#7a6345" 
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Additional crate groupings */}
      {[
        { base: [12, 0, 5], stacks: [[0, 0.6, 0], [1.4, 0.6, 0], [0, 0.6, 1.4], [0.7, 1.8, 0.7]] },
        { base: [-18, 0, 0], stacks: [[0, 0.6, 0], [1.4, 0.6, 0], [0, 1.8, 0]] },
        { base: [8, 0, -15], stacks: [[0, 0.6, 0], [0, 0.6, 1.4], [0, 1.8, 0.7]] },
        { base: [-10, 0, 20], stacks: [[0, 0.6, 0], [1.4, 0.6, 0], [2.8, 0.6, 0]] },
      ].map((area, ai) => (
        <group key={`crate-cluster-${ai}`} position={area.base as [number, number, number]}>
          {area.stacks.map((offset, si) => (
            <mesh 
              key={si} 
              position={offset as [number, number, number]}
              castShadow={settings.shadowsEnabled} 
              receiveShadow={settings.shadowsEnabled}
            >
              <boxGeometry args={[1.2, 1.2, 1.2]} />
              <meshStandardMaterial color="#7a6345" roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Rock formations */}
      {[
        { pos: [15, 0.8, 0], scale: [2, 1.6, 1.8] },
        { pos: [-10, 0.6, 8], scale: [1.5, 1.2, 1.4] },
        { pos: [5, 0.9, 12], scale: [2.2, 1.8, 2] },
      ].map((rock, i) => (
        <mesh 
          key={`rock-${i}`} 
          position={rock.pos as [number, number, number]} 
          scale={rock.scale as [number, number, number]}
          castShadow={settings.shadowsEnabled} 
          receiveShadow={settings.shadowsEnabled}
        >
          <dodecahedronGeometry args={[1]} />
          <meshStandardMaterial 
            color="#8a7a6a" 
            roughness={0.95}
          />
        </mesh>
      ))}

      {/* Additional rock formations */}
      {[
        { pos: [-25, 1, -12], scale: [2.5, 2, 2.2] },
        { pos: [25, 1.1, 18], scale: [2.3, 2.2, 2] },
        { pos: [8, 0.7, -15], scale: [1.8, 1.4, 1.6] },
        { pos: [-18, 0.9, 22], scale: [2, 1.8, 1.9] },
        { pos: [22, 0.6, -2], scale: [1.6, 1.2, 1.5] },
        { pos: [-12, 1, -22], scale: [2.4, 2, 2.3] },
        { pos: [18, 0.8, 20], scale: [1.9, 1.6, 1.7] },
        { pos: [-20, 0.7, -25], scale: [2.1, 1.7, 2] },
      ].map((rock, i) => (
        <mesh 
          key={`rock-extra-${i}`} 
          position={rock.pos as [number, number, number]} 
          scale={rock.scale as [number, number, number]}
          castShadow={settings.shadowsEnabled} 
          receiveShadow={settings.shadowsEnabled}
        >
          <dodecahedronGeometry args={[1]} />
          <meshStandardMaterial color="#8a7a6a" roughness={0.95} />
        </mesh>
      ))}
    </>
  );
}
