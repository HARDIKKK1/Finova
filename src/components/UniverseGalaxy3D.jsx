import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const Planet = ({ name, emoji, amount, percent, trend, size, orbitRadius, orbitSpeed, color, initialAngle }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Calculate orbit path position
    const angle = initialAngle + time * orbitSpeed;
    const targetX = Math.cos(angle) * orbitRadius;
    const targetZ = Math.sin(angle) * orbitRadius;
    
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);
    meshRef.current.position.y = -6 + Math.sin(time * 0.8 + initialAngle) * 0.15; // float slightly

    // Slow rotation on its own axis
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <group ref={meshRef} position={[Math.cos(initialAngle) * orbitRadius, -6, Math.sin(initialAngle) * orbitRadius]}>
      {/* The Planet Sphere */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1.0}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          transmission={0.4}
          thickness={0.5}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.2}
        />
      </mesh>

      {/* Halo Glow Ring around planet */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[size * 1.5, 0.015, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>

      {/* Holographic Label */}
      <Html distanceFactor={6} position={[0, size + 0.35, 0]} center>
        <div
          style={{
            padding: '0.3rem 0.6rem',
            borderRadius: '8px',
            fontSize: '0.65rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            border: `1px solid ${color}40`,
            background: 'rgba(5, 8, 22, 0.85)',
            boxShadow: `0 4px 12px ${color}20`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            pointerEvents: 'none',
            userSelect: 'none',
            opacity: hovered ? 1 : 0.75,
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.2s ease'
          }}
        >
          <span>{emoji}</span>
          <span>{name}</span>
        </div>
      </Html>

      {/* Interactive Tooltip Card on Hover */}
      <Html distanceFactor={5} position={[0, -size - 0.5, 0]} center>
        <div
          className="glass-panel"
          style={{
            padding: '0.6rem 1rem',
            borderRadius: '12px',
            border: `1px solid ${color}60`,
            background: 'rgba(5, 8, 22, 0.9)',
            boxShadow: `0 8px 24px ${color}30`,
            display: hovered ? 'block' : 'none',
            pointerEvents: 'none',
            width: '140px',
            userSelect: 'none'
          }}
        >
          <div style={{ fontSize: '0.6rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Spent</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white', margin: '2px 0' }}>{amount}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: color }}>
            <span>{percent}</span>
            <span style={{ color: trend === 'down' ? '#00ffb2' : '#ff5f6d' }}>
              {trend === 'down' ? '↓ down' : '↑ up'}
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
};

const UniverseGalaxy3D = () => {
  // Category planets database mapped to sizes based on expenditure
  const planets = [
    { name: "Food", emoji: "🍔", amount: "₹31,140", percent: "25%", trend: "up", size: 0.6, orbitRadius: 2.2, orbitSpeed: 0.12, color: "#ff5f6d", initialAngle: 0 },
    { name: "Shopping", emoji: "🛍", amount: "₹24,910", percent: "20%", trend: "up", size: 0.5, orbitRadius: 3.2, orbitSpeed: -0.08, color: "#7b61ff", initialAngle: Math.PI / 3 },
    { name: "Travel", emoji: "✈", amount: "₹22,420", percent: "18%", trend: "down", size: 0.45, orbitRadius: 4.2, orbitSpeed: 0.06, color: "#00ffb2", initialAngle: (2 * Math.PI) / 3 },
    { name: "Bills", emoji: "🏠", amount: "₹21,170", percent: "17%", trend: "down", size: 0.45, orbitRadius: 5.2, orbitSpeed: -0.05, color: "#00e5ff", initialAngle: Math.PI },
    { name: "Education", emoji: "🎓", amount: "₹14,940", percent: "12%", trend: "down", size: 0.38, orbitRadius: 6.2, orbitSpeed: 0.04, color: "#ffd166", initialAngle: (4 * Math.PI) / 3 },
    { name: "Entertainment", emoji: "🎮", amount: "₹9,960", percent: "8%", trend: "up", size: 0.3, orbitRadius: 7.2, orbitSpeed: -0.03, color: "#ffffff", initialAngle: (5 * Math.PI) / 3 }
  ];

  return (
    <group position={[0, -6, 0]}>
      {/* Galaxy Core Light */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#7b61ff" transparent opacity={0.15} />
      </mesh>
      <pointLight color="#7b61ff" intensity={1.5} distance={10} decay={2} />

      {/* Orbit paths lines */}
      {planets.map((planet, idx) => (
        <mesh key={`orbit-${idx}`} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[planet.orbitRadius, 0.006, 4, 64]} />
          <meshBasicMaterial color="rgba(255,255,255,0.04)" />
        </mesh>
      ))}

      {/* Render the planets */}
      {planets.map((planet, idx) => (
        <Planet key={idx} {...planet} />
      ))}
    </group>
  );
};

export default UniverseGalaxy3D;
