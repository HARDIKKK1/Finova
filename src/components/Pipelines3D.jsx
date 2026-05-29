import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const Pipelines3D = ({ scrollProgressRef }) => {
  const groupRef = useRef();
  const flowsRef = useRef([]);

  // Pipelines coordinates:
  // Central vault is at [0, 0, 0] (relative to y = -12)
  // Income nodes (left): Top-left, Mid-left, Bottom-left
  // Expense nodes (right): Top-right, Mid-right, Bottom-right
  const pipelines = useMemo(() => [
    // Income Pipelines (Green)
    {
      name: "Salary",
      color: "#00f5a0",
      points: [
        new THREE.Vector3(-4.5, 2.0, -1),
        new THREE.Vector3(-2.5, 1.5, 0),
        new THREE.Vector3(0, 0, 0)
      ],
      flowSpeed: 0.18
    },
    {
      name: "Dividends",
      color: "#00f5a0",
      points: [
        new THREE.Vector3(-4.5, 0.0, 0),
        new THREE.Vector3(-2.0, 0.0, 0),
        new THREE.Vector3(0, 0, 0)
      ],
      flowSpeed: 0.12
    },
    {
      name: "Freelance",
      color: "#00f5a0",
      points: [
        new THREE.Vector3(-4.5, -2.0, -1),
        new THREE.Vector3(-2.5, -1.5, 0),
        new THREE.Vector3(0, 0, 0)
      ],
      flowSpeed: 0.22
    },
    // Expense Pipelines (Red)
    {
      name: "Rent & Bills",
      color: "#ff4b72",
      points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(2.5, 1.5, 0),
        new THREE.Vector3(4.5, 2.0, -1)
      ],
      flowSpeed: -0.15 // Flows outward
    },
    {
      name: "Groceries",
      color: "#ff4b72",
      points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(2.0, 0.0, 0),
        new THREE.Vector3(4.5, 0.0, 0)
      ],
      flowSpeed: -0.18
    },
    {
      name: "Leisure",
      color: "#ff4b72",
      points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(2.5, -1.5, 0),
        new THREE.Vector3(4.5, -2.0, -1)
      ],
      flowSpeed: -0.25
    }
  ], []);

  // Build Bezier curves and tubes
  const tubes = useMemo(() => {
    return pipelines.map(pipe => {
      const curve = new THREE.CatmullRomCurve3(pipe.points);
      const geometry = new THREE.TubeGeometry(curve, 32, 0.05, 8, false);
      return { curve, geometry, ...pipe };
    });
  }, [pipelines]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const sp = scrollProgressRef.current;

    // Pipelines section is at y = -12 (Section 5). Active when sp is around 4.
    // Transition in between 3.2 and 4.0. Transition out between 4.8 and 5.5.
    let visibility = 0;
    if (sp >= 3.2 && sp < 5.5) {
      if (sp < 4.0) {
        visibility = (sp - 3.2) / 0.8;
      } else if (sp > 4.8) {
        visibility = 1 - (sp - 4.8) / 0.7;
      } else {
        visibility = 1.0;
      }
    }

    groupRef.current.position.y = -12 + (1 - visibility) * -2;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.001, 1, visibility));

    // Update pulsing flow particles along curves
    const time = state.clock.getElapsedTime();
    flowsRef.current.forEach((flowMesh, idx) => {
      if (!flowMesh) return;
      const pipe = tubes[idx];
      
      // Calculate interpolation percentage
      // Use pipe.flowSpeed to offset and direct flow direction
      let t = (time * Math.abs(pipe.flowSpeed)) % 1.0;
      if (pipe.flowSpeed < 0) {
        t = 1.0 - t; // flow outward for expenses
      }
      
      const pos = pipe.curve.getPointAt(t);
      flowMesh.position.copy(pos);
    });
  });

  return (
    <group ref={groupRef} position={[0, -12, 0]}>
      {/* Central Vault Core */}
      <group position={[0, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.65, 32, 32]} />
          <meshPhysicalMaterial
            color="#00d2ff"
            emissive="#0055ff"
            emissiveIntensity={0.8}
            transmission={0.9}
            thickness={1.0}
            roughness={0.1}
          />
        </mesh>
        
        {/* Core light glow */}
        <mesh>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} wireframe />
        </mesh>

        <Html distanceFactor={6} position={[0, 0.9, 0]} center>
          <div style={{
            fontSize: '0.8rem',
            color: '#fff',
            fontWeight: 800,
            textShadow: '0 0 10px rgba(0, 210, 255, 0.8)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Finova Vault
          </div>
        </Html>
      </group>

      {/* Render tubes and flowing lights */}
      {tubes.map((pipe, idx) => {
        const sourcePoint = pipe.flowSpeed > 0 ? pipe.points[0] : pipe.points[pipe.points.length - 1];
        
        return (
          <group key={idx}>
            {/* The transparent pipeline path */}
            <mesh geometry={pipe.geometry}>
              <meshBasicMaterial
                color={pipe.color}
                transparent
                opacity={0.1}
                wireframe
              />
            </mesh>

            {/* Glowing pipeline tube */}
            <mesh geometry={pipe.geometry}>
              <meshStandardMaterial
                color={pipe.color}
                emissive={pipe.color}
                emissiveIntensity={0.6}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>

            {/* The flowing energy particle */}
            <mesh ref={(el) => (flowsRef.current[idx] = el)}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshBasicMaterial color={pipe.color} />
              <pointLight color={pipe.color} intensity={2.0} distance={2.5} decay={2} />
            </mesh>

            {/* Terminal node node callouts */}
            <Html distanceFactor={6} position={sourcePoint} center>
              <div className="glass-panel" style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: pipe.color,
                border: `1px solid ${pipe.color}30`,
                background: 'rgba(5, 5, 12, 0.85)',
                boxShadow: `0 4px 12px ${pipe.color}15`,
                whiteSpace: 'nowrap',
                userSelect: 'none'
              }}>
                {pipe.name}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

export default Pipelines3D;
