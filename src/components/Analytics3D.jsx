import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const Analytics3D = ({ scrollProgressRef }) => {
  const groupRef = useRef();
  const ringGroupRef = useRef();
  const barsRef = useRef([]);

  // Mock analytics data
  const barData = [
    { label: "Rent", value: 65, color: "#ff4b72", x: -2.0 },
    { label: "Food", value: 45, color: "#00d2ff", x: -1.0 },
    { label: "Travel", value: 30, color: "#bd00ff", x: 0.0 },
    { label: "Bills", value: 55, color: "#00f5a0", x: 1.0 },
    { label: "Leisure", value: 25, color: "#ffffff", x: 2.0 }
  ];

  // Spending rings configuration
  const ringData = [
    { radius: 1.2, width: 0.08, speed: 0.3, color: "#ff4b72", category: "Needs - 50%" },
    { radius: 0.95, width: 0.08, speed: -0.5, color: "#00d2ff", category: "Wants - 30%" },
    { radius: 0.7, width: 0.08, speed: 0.2, color: "#00f5a0", category: "Savings - 20%" }
  ];

  useFrame((state) => {
    if (!groupRef.current) return;
    const sp = scrollProgressRef.current;

    // Analytics section is at y = -8 (Section 4). Active when sp is around 3.
    // Transition in between 2.2 and 3.0. Transition out between 3.8 and 4.5.
    let visibility = 0;
    if (sp >= 2.2 && sp < 4.5) {
      if (sp < 3.0) {
        visibility = (sp - 2.2) / 0.8;
      } else if (sp > 3.8) {
        visibility = 1 - (sp - 3.8) / 0.7;
      } else {
        visibility = 1.0;
      }
    }

    groupRef.current.position.y = -8 + (1 - visibility) * -2;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.001, 1, visibility));

    // Animate extruded bars growth
    barsRef.current.forEach((bar, idx) => {
      if (!bar) return;
      const targetHeight = (barData[idx].value / 100) * 2.5; // Max height 2.5
      // Height grows with visibility
      const currentHeight = targetHeight * visibility;
      bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, currentHeight || 0.01, 0.1);
      // Adjust position so it scales from the base (y=0) upwards
      bar.position.y = bar.scale.y / 2 - 1.0;
    });

    // Rotate concentric spending rings
    if (ringGroupRef.current) {
      const time = state.clock.getElapsedTime();
      ringGroupRef.current.children.forEach((child, idx) => {
        const ring = ringData[idx];
        if (ring) {
          child.rotation.z = time * ring.speed;
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, -8, 0]}>
      {/* 3D Bar Charts Group */}
      <group position={[-2.5, 0, 0]}>
        {barData.map((bar, idx) => (
          <group key={idx} position={[bar.x, 0, 0]}>
            {/* The bar */}
            <mesh ref={(el) => (barsRef.current[idx] = el)}>
              <boxGeometry args={[0.4, 1, 0.4]} />
              <meshStandardMaterial
                color={bar.color}
                roughness={0.2}
                metalness={0.8}
                emissive={bar.color}
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Label below the bar */}
            <Html distanceFactor={6} position={[0, -1.25, 0]} center>
              <div style={{
                fontSize: '0.7rem',
                color: '#9ca3af',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {bar.label}
              </div>
            </Html>
            
            {/* Percentage/Value above the bar */}
            <Html distanceFactor={6} position={[0, (bar.value / 100) * 2.5 - 0.75, 0]} center>
              <div style={{
                fontSize: '0.8rem',
                color: bar.color,
                fontWeight: 700
              }}>
                {bar.value}%
              </div>
            </Html>
          </group>
        ))}
      </group>

      {/* 3D Circular Spending Rings Group */}
      <group ref={ringGroupRef} position={[3.2, 0, 0]} rotation={[0.4, -0.4, 0]}>
        {ringData.map((ring, idx) => (
          <mesh key={idx}>
            <torusGeometry args={[ring.radius, ring.width, 16, 64, Math.PI * 1.5]} /> {/* 3/4 circle */}
            <meshStandardMaterial
              color={ring.color}
              emissive={ring.color}
              emissiveIntensity={0.8}
              roughness={0.1}
            />
          </mesh>
        ))}

        {/* Labels overlay for rings */}
        <Html distanceFactor={6} position={[0, -1.6, 0]} center>
          <div className="glass-panel" style={{
            padding: '0.5rem 0.8rem',
            borderRadius: '10px',
            fontSize: '0.7rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            background: 'rgba(5, 5, 12, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {ringData.map((ring, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ring.color }} />
                <span style={{ color: '#e5e7eb' }}>{ring.category}</span>
              </div>
            ))}
          </div>
        </Html>
      </group>
    </group>
  );
};

export default Analytics3D;
