import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { TrendingUp, TrendingDown, Landmark, PiggyBank, DollarSign, Wallet } from 'lucide-react';

const CardContent = ({ type, title, value, change, percent, chartData, trend }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef();

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;  // -0.5 to 0.5
    setTilt({ x: x * 15, y: -y * 15 }); // Max 15 degrees tilt
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const getIcon = () => {
    switch (type) {
      case 'income': return <Landmark className="text-[#00f5a0]" size={20} />;
      case 'expenses': return <Wallet className="text-[#ff4b72]" size={20} />;
      case 'savings': return <PiggyBank className="text-[#00d2ff]" size={20} />;
      case 'investments': return <TrendingUp className="text-[#bd00ff]" size={20} />;
      default: return <DollarSign size={20} />;
    }
  };

  return (
    <div
      ref={cardRef}
      className={`hologram-card ${type} ui-interactive`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(1.02)`,
        transition: 'transform 0.1s ease-out, border-color 0.3s',
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {getIcon()}
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            {title}
          </span>
        </div>
        <span style={{
          fontSize: '0.75rem',
          padding: '0.2rem 0.5rem',
          borderRadius: '20px',
          fontWeight: 600,
          background: trend === 'up' ? 'rgba(0, 245, 160, 0.1)' : 'rgba(255, 75, 114, 0.1)',
          color: trend === 'up' ? '#00f5a0' : '#ff4b72',
          border: trend === 'up' ? '1px solid rgba(0, 245, 160, 0.2)' : '1px solid rgba(255, 75, 114, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem'
        }}>
          {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </span>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-sans)', letterSpacing: '-0.5px' }}>
          {value}
        </h3>
        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.2rem' }}>
          {trend === 'up' ? `+${percent} from last month` : `-${percent} from last month`}
        </p>
      </div>

      {/* Sparkline chart */}
      <div style={{ height: '40px', marginTop: '1.2rem', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
        {chartData.map((val, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              height: `${val}%`,
              background: type === 'income' ? 'linear-gradient(to top, rgba(0, 245, 160, 0.1), #00f5a0)' :
                          type === 'expenses' ? 'linear-gradient(to top, rgba(255, 75, 114, 0.1), #ff4b72)' :
                          type === 'savings' ? 'linear-gradient(to top, rgba(0, 210, 255, 0.1), #00d2ff)' :
                          'linear-gradient(to top, rgba(189, 0, 255, 0.1), #bd00ff)',
              borderRadius: '2px',
              opacity: 0.7 + (idx / chartData.length) * 0.3
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const HolographicCards = ({ scrollProgressRef }) => {
  const cardsRef = useRef([]);

  const cardData = [
    {
      type: 'income',
      title: 'Income',
      value: '₹1,42,500',
      change: '+12%',
      percent: '8.4%',
      chartData: [40, 45, 35, 50, 65, 55, 70, 80, 75, 90, 85, 100],
      trend: 'up',
      baseAngle: 0
    },
    {
      type: 'expenses',
      title: 'Expenses',
      value: '₹58,300',
      change: '-4%',
      percent: '2.1%',
      chartData: [80, 75, 85, 90, 70, 60, 50, 45, 55, 40, 35, 30],
      trend: 'down',
      baseAngle: Math.PI / 2
    },
    {
      type: 'savings',
      title: 'Savings',
      value: '₹4,20,000',
      change: '+18%',
      percent: '11.2%',
      chartData: [30, 35, 42, 48, 50, 55, 60, 68, 72, 80, 88, 95],
      trend: 'up',
      baseAngle: Math.PI
    },
    {
      type: 'investments',
      title: 'Investments',
      value: '₹8,75,000',
      change: '+24%',
      percent: '14.7%',
      chartData: [20, 25, 30, 40, 38, 45, 55, 65, 70, 85, 92, 100],
      trend: 'up',
      baseAngle: (3 * Math.PI) / 2
    }
  ];

  // Positions for 2x2 grid in Dashboard Mode
  const gridPositions = [
    [-2.2, 1.4, 0], // Income: Top Left
    [2.2, 1.4, 0],  // Expenses: Top Right
    [-2.2, -1.2, 0], // Savings: Bottom Left
    [2.2, -1.2, 0]  // Investments: Bottom Right
  ];

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const sp = scrollProgressRef.current;
    
    // Smooth lerp speed
    const lerpFactor = 0.08;

    cardsRef.current.forEach((ref, idx) => {
      if (!ref) return;

      const data = cardData[idx];
      const gridPos = gridPositions[idx];

      // 1. Calculate Orbit State (sp = 0)
      const orbitSpeed = 0.25;
      const orbitRadius = 3.2;
      const angle = data.baseAngle + time * orbitSpeed;
      
      const orbitX = Math.cos(angle) * orbitRadius;
      const orbitY = Math.sin(time * 0.8 + idx) * 0.25; // floating wave offset
      const orbitZ = Math.sin(angle) * orbitRadius;

      // 2. Dashboard Grid State (sp = 1)
      const gridX = gridPos[0];
      const gridY = gridPos[1];
      const gridZ = gridPos[2];

      // Interpolation factor between Orbit (0) and Grid (1)
      // When sp is between 0 and 1, morph. When > 1, stay at Grid.
      const transitionProgress = Math.max(0, Math.min(1, sp));

      // Calculate final target positions
      const targetX = THREE.MathUtils.lerp(orbitX, gridX, transitionProgress);
      const targetY = THREE.MathUtils.lerp(orbitY, gridY, transitionProgress);
      const targetZ = THREE.MathUtils.lerp(orbitZ, gridZ, transitionProgress);

      // Lerp actual mesh position
      ref.position.x = THREE.MathUtils.lerp(ref.position.x, targetX, lerpFactor);
      ref.position.y = THREE.MathUtils.lerp(ref.position.y, targetY, lerpFactor);
      ref.position.z = THREE.MathUtils.lerp(ref.position.z, targetZ, lerpFactor);

      // Rotations
      // Orbiting: Face the center (angle-based rotation)
      // Grid: Flat facing the screen (0, 0, 0)
      let targetRotY = 0;
      if (transitionProgress < 0.95) {
        // Orbit facing
        targetRotY = -angle + Math.PI / 2;
      } else {
        targetRotY = 0;
      }
      
      ref.rotation.y = THREE.MathUtils.lerp(ref.rotation.y, targetRotY, lerpFactor);
      ref.rotation.x = THREE.MathUtils.lerp(ref.rotation.x, 0, lerpFactor);
      ref.rotation.z = THREE.MathUtils.lerp(ref.rotation.z, 0, lerpFactor);

      // Scaling down and fading out after Section 2 (sp > 1)
      // When sp goes from 1 to 2, we fade out completely.
      let scale = 1.0;
      let opacity = 1.0;
      
      if (sp > 1) {
        const fadeProgress = Math.max(0, Math.min(1, sp - 1)); // 0 to 1
        scale = THREE.MathUtils.lerp(1.0, 0.1, fadeProgress);
        opacity = THREE.MathUtils.lerp(1.0, 0.0, fadeProgress);
      }
      
      ref.scale.setScalar(THREE.MathUtils.lerp(ref.scale.x, scale, lerpFactor));
      
      // Update DOM element opacity
      if (ref.element) {
        ref.element.style.opacity = opacity;
        ref.element.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
        ref.element.style.display = opacity < 0.01 ? 'none' : 'block';
      }
    });
  });

  return (
    <group>
      {cardData.map((card, idx) => (
        <group
          key={card.type}
          ref={(el) => (cardsRef.current[idx] = el)}
          position={[0, 0, 0]} // Initialized at center, useFrame updates this
        >
          <Html
            transform
            distanceFactor={8}
            zIndexRange={[10, 50]}
            occlude="blending"
          >
            <CardContent {...card} />
          </Html>
        </group>
      ))}
    </group>
  );
};
