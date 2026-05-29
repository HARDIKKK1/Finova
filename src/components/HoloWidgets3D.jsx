import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { TrendingUp, TrendingDown, Eye, ShieldCheck, CreditCard } from 'lucide-react';

const CardWidget = () => (
  <div className="hologram-card income" style={{ width: '260px', background: 'rgba(5, 8, 22, 0.75)', borderLeft: '3px solid #00e5ff' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Total Balance
      </span>
      <CreditCard size={16} className="text-[#00e5ff]" />
    </div>
    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', marginBottom: '0.3rem' }}>
      ₹12,95,430.50
    </h3>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#00ffb2' }}>
      <TrendingUp size={12} />
      <span>+₹18,400 today</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.2rem', fontSize: '0.7rem', color: '#6b7280' }}>
      <span>**** **** 9084</span>
      <span>PLATINUM ACC.</span>
    </div>
  </div>
);

const PieWidget = () => (
  <div className="hologram-card savings" style={{ width: '240px', background: 'rgba(5, 8, 22, 0.75)', borderLeft: '3px solid #7b61ff' }}>
    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.8rem' }}>
      Asset Allocation
    </span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      {/* Visual ring representation */}
      <div style={{ position: 'relative', width: '55px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.05)', borderTopColor: '#7b61ff', borderRightColor: '#00e5ff', borderBottomColor: '#00ffb2', animation: 'spin 10s linear infinite' }} />
        <div style={{ position: 'absolute', fontSize: '0.7rem', fontWeight: 700, color: 'white' }}>82%</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.7rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7b61ff' }} />
          <span style={{ color: '#e5e7eb' }}>Mutual Funds - 45%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00e5ff' }} />
          <span style={{ color: '#e5e7eb' }}>Equities - 25%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ffb2' }} />
          <span style={{ color: '#e5e7eb' }}>Gold Buffer - 12%</span>
        </div>
      </div>
    </div>
  </div>
);

const GraphWidget = () => {
  const points = [30, 45, 40, 60, 55, 75, 70, 95];
  return (
    <div className="hologram-card expenses" style={{ width: '250px', background: 'rgba(5, 8, 22, 0.75)', borderLeft: '3px solid #00ffb2' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Growth Yield
        </span>
        <span style={{ fontSize: '0.7rem', color: '#00ffb2', fontWeight: 700 }}>+14.8% YTD</span>
      </div>
      {/* Simple mini SVG graph */}
      <svg viewBox="0 0 100 35" style={{ width: '100%', height: '55px', stroke: '#00ffb2', strokeWidth: 2, fill: 'none' }}>
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00ffb2" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00ffb2" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={`M 0,35 Q 15,28 30,22 T 60,15 T 90,5 L 100,5 L 100,35 Z`} fill="url(#grad)" stroke="none" />
        <path d={`M 0,35 Q 15,28 30,22 T 60,15 T 90,5 L 100,5`} />
      </svg>
    </div>
  );
};

const RupeeSymbol3D = ({ position, speed, size }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    ref.current.position.y += Math.sin(time * speed) * 0.003;
    ref.current.rotation.y = time * 0.2 * speed;
  });

  return (
    <group ref={ref} position={position}>
      <Html distanceFactor={6} center>
        <div style={{
          fontSize: `${size}rem`,
          fontWeight: 800,
          color: 'rgba(0, 229, 255, 0.25)',
          textShadow: '0 0 10px rgba(0, 229, 255, 0.4)',
          userSelect: 'none',
          fontFamily: 'var(--font-display)'
        }}>
          ₹
        </div>
      </Html>
    </group>
  );
};

const HoloWidgets3D = ({ isSuccess }) => {
  const gRef = useRef();

  useFrame((state) => {
    if (!gRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Slow float/orbital movement
    gRef.current.position.y = Math.sin(time * 0.5) * 0.12;

    // Slide out/in or scale during success transition
    let targetScale = 1.0;
    let targetX = 0;
    if (isSuccess) {
      // Widgets expand and fly forward
      targetScale = 1.4;
      targetX = -1.5; // shift to center-left
    }
    
    gRef.current.scale.setScalar(THREE.MathUtils.lerp(gRef.current.scale.x, targetScale, 0.08));
    gRef.current.position.x = THREE.MathUtils.lerp(gRef.current.position.x, targetX, 0.08);
  });

  return (
    <group ref={gRef}>
      {/* 3D Rupee Floaties */}
      <RupeeSymbol3D position={[1.4, 2.0, -1.0]} speed={1.2} size={1.8} />
      <RupeeSymbol3D position={[3.6, -1.8, 0.5]} speed={0.8} size={2.4} />
      <RupeeSymbol3D position={[4.2, 1.4, -0.5]} speed={1.5} size={1.2} />

      {/* Balance Card Widget */}
      <group position={[2.3, 1.25, 0]}>
        <Html transform distanceFactor={7} zIndexRange={[10, 40]}>
          <CardWidget />
        </Html>
      </group>

      {/* Income/Expense Line Graph */}
      <group position={[2.7, 0.0, -0.3]}>
        <Html transform distanceFactor={7} zIndexRange={[10, 40]}>
          <GraphWidget />
        </Html>
      </group>

      {/* Pie Chart Widget */}
      <group position={[2.2, -1.25, 0.2]}>
        <Html transform distanceFactor={7} zIndexRange={[10, 40]}>
          <PieWidget />
        </Html>
      </group>
    </group>
  );
};

export default HoloWidgets3D;
