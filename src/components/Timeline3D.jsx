import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const Timeline3D = ({ scrollProgressRef }) => {
  const groupRef = useRef();
  const pulseRef = useRef();
  
  // Define points for a winding S-shaped 3D curve
  const points = useMemo(() => [
    new THREE.Vector3(-4, 1.5, -1),
    new THREE.Vector3(-2, 0.5, 0),
    new THREE.Vector3(0, -0.5, 1),
    new THREE.Vector3(2, -1.5, 0),
    new THREE.Vector3(4, -2.5, -1)
  ], []);

  // Create curve
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);

  // Generate tube geometry
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, 0.08, 8, false);
  }, [curve]);

  // Static transactions data to place at points along the curve
  const transactions = [
    { t: 0.15, text: "Salary Received", amount: "+₹1,20,000", type: "income", date: "May 25" },
    { t: 0.38, text: "Rent Payment", amount: "-₹22,000", type: "expense", date: "May 26" },
    { t: 0.62, text: "Apple Premium", amount: "-₹1,200", type: "expense", date: "May 27" },
    { t: 0.85, text: "Mutual Fund SIP", amount: "-₹15,000", type: "investment", date: "May 28" }
  ];

  useFrame((state) => {
    if (!groupRef.current) return;
    const sp = scrollProgressRef.current;
    
    // Scale and visibility based on scroll progress
    // Timeline is at y = -4 (Section 3). Active when sp is around 2.
    // Transition in between 1.2 and 2.0. Transition out between 2.8 and 3.5.
    let visibility = 0;
    if (sp >= 1.2 && sp < 3.5) {
      if (sp < 2.0) {
        visibility = (sp - 1.2) / 0.8; // fade in
      } else if (sp > 2.8) {
        visibility = 1 - (sp - 2.8) / 0.7; // fade out
      } else {
        visibility = 1.0;
      }
    }
    
    groupRef.current.position.y = -4 + (1 - visibility) * -2; // smooth entry slide
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.001, 1, visibility));
    
    // Animate neon pulses along the curve
    if (pulseRef.current) {
      const time = state.clock.getElapsedTime();
      const t = (time * 0.15) % 1.0; // speed
      const pos = curve.getPointAt(t);
      pulseRef.current.position.copy(pos);
    }
  });

  return (
    <group ref={groupRef} position={[0, -4, 0]}>
      {/* Background glow strip */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial
          color="#00d2ff"
          transparent
          opacity={0.12}
          wireframe
        />
      </mesh>

      {/* Main glowing line */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color="#00d2ff"
          emissive="#0055ff"
          emissiveIntensity={1.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Moving neon pulse ball */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color="#00f5a0" />
        <pointLight color="#00f5a0" intensity={2.5} distance={3} decay={2} />
      </mesh>

      {/* Floating transaction bubbles */}
      {transactions.map((tx, idx) => {
        const point = curve.getPointAt(tx.t);
        const color = tx.type === 'income' ? '#00f5a0' : tx.type === 'investment' ? '#bd00ff' : '#ff4b72';
        
        return (
          <group key={idx} position={point}>
            {/* Anchor sphere node */}
            <mesh>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={2.0}
              />
            </mesh>
            
            {/* HTML notification tooltip */}
            <Html
              distanceFactor={6}
              position={[0, 0.45, 0]}
              center
              zIndexRange={[5, 20]}
            >
              <div
                className="glass-panel"
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '12px',
                  border: `1px solid ${color}40`,
                  minWidth: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  pointerEvents: 'none',
                  background: 'rgba(5, 5, 12, 0.85)',
                  boxShadow: `0 8px 24px ${color}15`,
                  userSelect: 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f3f4f6' }}>{tx.text}</span>
                  <span style={{ fontSize: '0.65rem', color: '#9ca3af' }}>{tx.date}</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: color }}>
                  {tx.amount}
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

export default Timeline3D;
