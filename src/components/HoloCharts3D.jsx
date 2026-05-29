import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const HoloCharts3D = () => {
  const lineRef = useRef();
  const pulseRef = useRef();
  
  // Winding ribbon points for the monthly graph line
  const graphPoints = useMemo(() => [
    new THREE.Vector3(-3.0, -18 - 1.0, 0),
    new THREE.Vector3(-2.2, -18 - 0.4, 0.4),
    new THREE.Vector3(-1.4, -18 - 0.8, -0.2),
    new THREE.Vector3(-0.6, -18 + 0.2, 0.3),
    new THREE.Vector3(0.2, -18 - 0.2, 0.1),
    new THREE.Vector3(1.0, -18 + 0.8, -0.4),
    new THREE.Vector3(1.8, -18 + 0.4, 0.2),
    new THREE.Vector3(2.6, -18 + 1.2, 0)
  ], []);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(graphPoints), [graphPoints]);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, 0.05, 8, false);
  }, [curve]);

  // Labels coordinates along the graph curve
  const labels = [
    { t: 0, text: "Jan" },
    { t: 0.14, text: "Feb" },
    { t: 0.28, text: "Mar" },
    { t: 0.42, text: "Apr" },
    { t: 0.57, text: "May" },
    { t: 0.71, text: "Jun" },
    { t: 0.85, text: "Jul" },
    { t: 1.0, text: "Aug" }
  ];

  // Budget concentric rings configs
  const rings = [
    { radius: 1.1, width: 0.07, color: "#00ffb2", text: "Income - ₹1.8L", speed: 0.2 },
    { radius: 0.85, width: 0.07, color: "#ff5f6d", text: "Expenses - ₹58K", speed: -0.3 },
    { radius: 0.6, width: 0.07, color: "#00e5ff", text: "Savings - ₹1.2L", speed: 0.15 }
  ];

  const ringGroupRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate glowing pulse along monthly graph
    if (pulseRef.current) {
      const t = (time * 0.18) % 1.0;
      const pos = curve.getPointAt(t);
      pulseRef.current.position.copy(pos);
    }

    // Rotate concentric budget rings
    if (ringGroupRef.current) {
      ringGroupRef.current.children.forEach((child, idx) => {
        const ring = rings[idx];
        if (ring) {
          child.rotation.z = time * ring.speed;
        }
      });
    }
  });

  return (
    <group>
      {/* Monthly Spending Graph (Left-Side) */}
      <group position={[-2.2, 0, 0]}>
        {/* Transparent background guide ribbon */}
        <mesh geometry={tubeGeometry}>
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.08} wireframe />
        </mesh>

        {/* Core neon tube */}
        <mesh geometry={tubeGeometry}>
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={1.2}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Pulsing signal light */}
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
          <pointLight color="#ffffff" intensity={2.0} distance={3.0} decay={2} />
        </mesh>

        {/* Timeline month indicators */}
        {labels.map((lbl, idx) => {
          const point = curve.getPointAt(lbl.t);
          return (
            <group key={idx} position={point}>
              <mesh>
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.0} />
              </mesh>
              <Html distanceFactor={6} position={[0, -0.4, 0]} center>
                <div style={{ fontSize: '0.6rem', color: '#9ca3af', fontWeight: 700 }}>
                  {lbl.text}
                </div>
              </Html>
            </group>
          );
        })}
        
        <Html distanceFactor={6} position={[0, -18 + 2.0, 0]} center>
          <div className="glass-panel" style={{ padding: '0.4rem 0.8rem', whiteSpace: 'nowrap', fontSize: '0.7rem', color: '#00e5ff', border: '1px solid rgba(0, 229, 255, 0.3)', background: 'rgba(5,8,22,0.85)' }}>
            Growth Trend: Steady Yield
          </div>
        </Html>
      </group>

      {/* concentric budget rings (Right-Side) */}
      <group ref={ringGroupRef} position={[2.6, -18, 0]} rotation={[0.3, -0.3, 0]}>
        {rings.map((ring, idx) => (
          <mesh key={idx}>
            <torusGeometry args={[ring.radius, ring.width, 16, 64, Math.PI * 1.65]} />
            <meshStandardMaterial
              color={ring.color}
              emissive={ring.color}
              emissiveIntensity={0.8}
              roughness={0.1}
            />
          </mesh>
        ))}

        <Html distanceFactor={6} position={[0, -1.6, 0]} center>
          <div className="glass-panel" style={{
            padding: '0.5rem 0.8rem',
            borderRadius: '10px',
            fontSize: '0.65rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            background: 'rgba(5, 8, 22, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {rings.map((ring, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ring.color }} />
                <span style={{ color: '#e5e7eb' }}>{ring.text}</span>
              </div>
            ))}
          </div>
        </Html>
      </group>
    </group>
  );
};

export default HoloCharts3D;
