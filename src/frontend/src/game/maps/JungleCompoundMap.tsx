import { useGraphicsSettings } from '../settings/useGraphicsSettings';
import { getGraphicsSettings } from '../settings/graphics';
import GroundDetailGrass from './props/GroundDetailGrass';
import Door from './props/Door';

export default function JungleCompoundMap() {
  const { graphicsMode } = useGraphicsSettings();
  const settings = getGraphicsSettings(graphicsMode);

  const extraTreeCount = graphicsMode === 'Performance' ? 4 : 8;

  return (
    <>
      {/* Ground - muddy/grass terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={settings.shadowsEnabled} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#3d5a3d" 
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Ground detail - jungle vegetation */}
      <GroundDetailGrass 
        graphicsMode={graphicsMode}
        bounds={{ minX: -45, maxX: 45, minZ: -45, maxZ: 45 }}
        density={1.2}
      />

      {/* Wooden platforms - elevated positions */}
      {[
        { pos: [-10, 2, -8], size: [4, 0.3, 4] },
        { pos: [12, 2.5, 5], size: [5, 0.3, 4] },
        { pos: [0, 1.5, 12], size: [4, 0.3, 3] },
      ].map((platform, i) => (
        <group key={`platform-${i}`}>
          {/* Platform surface */}
          <mesh position={platform.pos as [number, number, number]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
            <boxGeometry args={platform.size as [number, number, number]} />
            <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
          </mesh>
          {/* Support posts */}
          {[
            [platform.pos[0] - platform.size[0] / 2 + 0.3, platform.pos[1] / 2, platform.pos[2] - platform.size[2] / 2 + 0.3],
            [platform.pos[0] + platform.size[0] / 2 - 0.3, platform.pos[1] / 2, platform.pos[2] - platform.size[2] / 2 + 0.3],
            [platform.pos[0] - platform.size[0] / 2 + 0.3, platform.pos[1] / 2, platform.pos[2] + platform.size[2] / 2 - 0.3],
            [platform.pos[0] + platform.size[0] / 2 - 0.3, platform.pos[1] / 2, platform.pos[2] + platform.size[2] / 2 - 0.3],
          ].map((postPos, j) => (
            <mesh key={`post-${j}`} position={postPos as [number, number, number]} castShadow={settings.shadowsEnabled}>
              <cylinderGeometry args={[0.15, 0.15, platform.pos[1]]} />
              <meshStandardMaterial color="#4a3a2a" roughness={0.95} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Additional platforms */}
      {[
        { pos: [-18, 1.8, 10], size: [3.5, 0.3, 3] },
        { pos: [18, 2.2, -12], size: [4, 0.3, 3.5] },
        { pos: [8, 1.5, 15], size: [3, 0.3, 3] },
      ].map((platform, i) => (
        <group key={`platform-extra-${i}`}>
          <mesh position={platform.pos as [number, number, number]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
            <boxGeometry args={platform.size as [number, number, number]} />
            <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
          </mesh>
          {[
            [platform.pos[0] - platform.size[0] / 2 + 0.3, platform.pos[1] / 2, platform.pos[2] - platform.size[2] / 2 + 0.3],
            [platform.pos[0] + platform.size[0] / 2 - 0.3, platform.pos[1] / 2, platform.pos[2] - platform.size[2] / 2 + 0.3],
            [platform.pos[0] - platform.size[0] / 2 + 0.3, platform.pos[1] / 2, platform.pos[2] + platform.size[2] / 2 - 0.3],
            [platform.pos[0] + platform.size[0] / 2 - 0.3, platform.pos[1] / 2, platform.pos[2] + platform.size[2] / 2 - 0.3],
          ].map((postPos, j) => (
            <mesh key={`post-${j}`} position={postPos as [number, number, number]} castShadow={settings.shadowsEnabled}>
              <cylinderGeometry args={[0.15, 0.15, platform.pos[1]]} />
              <meshStandardMaterial color="#4a3a2a" roughness={0.95} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Wooden huts */}
      <group position={[-15, 0, 0]}>
        {/* Walls */}
        <mesh position={[0, 1.2, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[5, 2.4, 5]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 2.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow={settings.shadowsEnabled}>
          <coneGeometry args={[3.5, 1.5, 4]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.95} />
        </mesh>
        <Door 
          position={[0, 0, 2.65]}
          shadowsEnabled={settings.shadowsEnabled}
          style="wood"
          scale={0.95}
        />
      </group>

      <group position={[15, 0, -12]}>
        {/* Walls */}
        <mesh position={[0, 1, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[4, 2, 4]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 2.4, 0]} rotation={[0, 0, 0]} castShadow={settings.shadowsEnabled}>
          <coneGeometry args={[3, 1.2, 4]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.95} />
        </mesh>
        <Door 
          position={[0, 0, 2.15]}
          shadowsEnabled={settings.shadowsEnabled}
          style="wood"
          scale={0.85}
        />
      </group>

      {/* Additional huts */}
      <group position={[10, 0, 18]}>
        <mesh position={[0, 1.1, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[3.5, 2.2, 3.5]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow={settings.shadowsEnabled}>
          <coneGeometry args={[2.8, 1.3, 4]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.95} />
        </mesh>
        <Door 
          position={[0, 0, 1.9]}
          shadowsEnabled={settings.shadowsEnabled}
          style="wood"
          scale={0.9}
        />
      </group>

      <group position={[-20, 0, -15]}>
        <mesh position={[0, 1.3, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[4.5, 2.6, 4]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.9, 0]} rotation={[0, 0, 0]} castShadow={settings.shadowsEnabled}>
          <coneGeometry args={[3.2, 1.4, 4]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.95} />
        </mesh>
        <Door 
          position={[0, 0, 2.15]}
          shadowsEnabled={settings.shadowsEnabled}
          style="wood"
          scale={1}
        />
      </group>

      <group position={[20, 0, 8]}>
        <mesh position={[0, 0.9, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[3, 1.8, 3]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow={settings.shadowsEnabled}>
          <coneGeometry args={[2.5, 1.1, 4]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.95} />
        </mesh>
        <Door 
          position={[0, 0, 1.65]}
          shadowsEnabled={settings.shadowsEnabled}
          style="wood"
          scale={0.8}
        />
      </group>

      <group position={[-8, 0, 18]}>
        <mesh position={[0, 1, 0]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[3.5, 2, 3.5]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.4, 0]} rotation={[0, 0, 0]} castShadow={settings.shadowsEnabled}>
          <coneGeometry args={[2.8, 1.2, 4]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.95} />
        </mesh>
        <Door 
          position={[0, 0, 1.9]}
          shadowsEnabled={settings.shadowsEnabled}
          style="wood"
          scale={0.85}
        />
      </group>

      {/* Log barricades */}
      {[
        { center: [5, 0, 0], count: 4, radius: 1.5 },
        { center: [-12, 0, 8], count: 5, radius: 1.8 },
        { center: [15, 0, -5], count: 3, radius: 1.2 },
        { center: [-5, 0, -15], count: 4, radius: 1.6 },
      ].map((cluster, ci) => (
        <group key={`barricade-${ci}`}>
          {Array.from({ length: cluster.count }).map((_, i) => {
            const angle = (i / cluster.count) * Math.PI * 1.6;
            const x = cluster.center[0] + Math.cos(angle) * cluster.radius;
            const z = cluster.center[2] + Math.sin(angle) * cluster.radius;
            return (
              <mesh 
                key={i} 
                position={[x, 0.4, z]} 
                rotation={[0, angle + Math.PI / 2, Math.PI / 2]}
                castShadow={settings.shadowsEnabled} 
                receiveShadow={settings.shadowsEnabled}
              >
                <cylinderGeometry args={[0.15, 0.15, 1.5]} />
                <meshStandardMaterial color="#4a3a2a" roughness={0.95} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Vegetation - tree trunks */}
      {[
        { pos: [-8, 2.5, 8], height: 5 },
        { pos: [8, 3, -5], height: 6 },
        { pos: [-12, 2, -15], height: 4 },
        { pos: [18, 3.5, 10], height: 7 },
        { pos: [5, 2, 15], height: 4 },
        { pos: [-18, 2.5, -8], height: 5 },
      ].map((tree, i) => (
        <group key={`tree-${i}`}>
          {/* Trunk */}
          <mesh position={tree.pos as [number, number, number]} castShadow={settings.shadowsEnabled}>
            <cylinderGeometry args={[0.3, 0.4, tree.height]} />
            <meshStandardMaterial color="#3a2a1a" roughness={0.95} />
          </mesh>
          {/* Foliage */}
          <mesh position={[tree.pos[0], tree.pos[1] + tree.height / 2 + 1, tree.pos[2]]} castShadow={settings.shadowsEnabled}>
            <sphereGeometry args={[1.5, 8, 8]} />
            <meshStandardMaterial color="#2d4a2d" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Additional trees - performance aware */}
      {[
        { pos: [22, 2.8, -18], height: 5.6 },
        { pos: [-22, 3.2, 15], height: 6.4 },
        { pos: [12, 2.2, -20], height: 4.4 },
        { pos: [-15, 2.6, -22], height: 5.2 },
        { pos: [0, 2.4, -18], height: 4.8 },
        { pos: [-10, 2.7, 22], height: 5.4 },
        { pos: [25, 3, 12], height: 6 },
        { pos: [-25, 2.9, -10], height: 5.8 },
      ].slice(0, extraTreeCount).map((tree, i) => (
        <group key={`tree-extra-${i}`}>
          <mesh position={tree.pos as [number, number, number]} castShadow={settings.shadowsEnabled}>
            <cylinderGeometry args={[0.3, 0.4, tree.height]} />
            <meshStandardMaterial color="#3a2a1a" roughness={0.95} />
          </mesh>
          <mesh position={[tree.pos[0], tree.pos[1] + tree.height / 2 + 1, tree.pos[2]]} castShadow={settings.shadowsEnabled}>
            <sphereGeometry args={[1.5, 8, 8]} />
            <meshStandardMaterial color="#2d4a2d" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Wooden crates and barrels */}
      {[
        [5, 0.5, -2],
        [5, 1.5, -2],
        [6.5, 0.5, -2],
        [-5, 0.5, -10],
        [-3.5, 0.5, -10],
      ].map((pos, i) => (
        <mesh key={`crate-${i}`} position={pos as [number, number, number]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            color="#5a4a3a" 
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Additional crate clusters */}
      {[
        { base: [12, 0, 0], stacks: [[0, 0.5, 0], [1.2, 0.5, 0], [0, 0.5, 1.2], [0.6, 1.5, 0.6]] },
        { base: [-18, 0, 5], stacks: [[0, 0.5, 0], [1.2, 0.5, 0], [0, 1.5, 0]] },
        { base: [8, 0, -18], stacks: [[0, 0.5, 0], [0, 0.5, 1.2], [0, 1.5, 0.6]] },
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
              <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}

      {[
        [0, 0.6, -5],
        [2, 0.6, -5],
        [-8, 0.6, 3],
      ].map((pos, i) => (
        <mesh key={`barrel-${i}`} position={pos as [number, number, number]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <cylinderGeometry args={[0.4, 0.4, 1.2]} />
          <meshStandardMaterial 
            color="#4a3a2a" 
            roughness={0.85}
            metalness={0.2}
          />
        </mesh>
      ))}

      {/* Additional barrels */}
      {[
        [15, 0.6, 8],
        [16.5, 0.6, 8],
        [-12, 0.6, -8],
        [-10.5, 0.6, -8],
        [18, 0.6, -18],
      ].map((pos, i) => (
        <mesh key={`barrel-extra-${i}`} position={pos as [number, number, number]} castShadow={settings.shadowsEnabled} receiveShadow={settings.shadowsEnabled}>
          <cylinderGeometry args={[0.4, 0.4, 1.2]} />
          <meshStandardMaterial color="#4a3a2a" roughness={0.85} metalness={0.2} />
        </mesh>
      ))}

      {/* Rock cover */}
      {[
        { pos: [10, 0.5, 0], scale: [1.5, 1, 1.2] },
        { pos: [-6, 0.4, 6], scale: [1.2, 0.8, 1] },
        { pos: [3, 0.6, 8], scale: [1.8, 1.2, 1.5] },
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
            color="#5a5a5a" 
            roughness={0.95}
          />
        </mesh>
      ))}

      {/* Additional rock formations */}
      {[
        { pos: [-20, 0.7, -10], scale: [2, 1.4, 1.6] },
        { pos: [22, 0.8, 15], scale: [1.8, 1.6, 1.5] },
        { pos: [6, 0.5, -12], scale: [1.4, 1, 1.2] },
        { pos: [-15, 0.6, 20], scale: [1.6, 1.2, 1.4] },
        { pos: [18, 0.4, 0], scale: [1.3, 0.8, 1.1] },
        { pos: [-8, 0.7, -20], scale: [1.9, 1.4, 1.7] },
      ].map((rock, i) => (
        <mesh 
          key={`rock-extra-${i}`} 
          position={rock.pos as [number, number, number]} 
          scale={rock.scale as [number, number, number]}
          castShadow={settings.shadowsEnabled} 
          receiveShadow={settings.shadowsEnabled}
        >
          <dodecahedronGeometry args={[1]} />
          <meshStandardMaterial color="#5a5a5a" roughness={0.95} />
        </mesh>
      ))}
    </>
  );
}
