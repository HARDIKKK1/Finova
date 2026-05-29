import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import ParticlesBG from './ParticlesBG';
import UniverseGalaxy3D from './UniverseGalaxy3D';
import HoloCharts3D from './HoloCharts3D';
import { TrendingUp, TrendingDown, ArrowUpRight, DollarSign, Award, BrainCircuit, Activity } from 'lucide-react';

const SatelliteCard = ({ title, value, change, percent, color, type, baseAngle, timeOffset }) => {
  const cardRef = useRef();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 15, y: -y * 15 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hologram-card ui-interactive"
      style={{
        width: '210px',
        padding: '1.2rem',
        borderRadius: '16px',
        background: 'rgba(5, 8, 22, 0.8)',
        border: `1px solid ${color}30`,
        borderLeft: `3px solid ${color}`,
        transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(1.02)`,
        transition: 'transform 0.1s ease-out, border-color 0.3s',
        cursor: 'pointer',
        boxShadow: `0 10px 30px ${color}10`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </span>
        <span style={{
          fontSize: '0.65rem',
          padding: '0.15rem 0.4rem',
          borderRadius: '10px',
          fontWeight: 700,
          background: change === 'up' ? 'rgba(0, 255, 178, 0.1)' : 'rgba(255, 95, 109, 0.1)',
          color: change === 'up' ? '#00ffb2' : '#ff5f6d'
        }}>
          {percent}
        </span>
      </div>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-sans)', letterSpacing: '-0.5px' }}>
        {value}
      </h3>
    </div>
  );
};

const TimelineNode = ({ x, y, z, amount, details, date, color, icon: Icon, delay }) => {
  const nodeRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!nodeRef.current) return;
    const time = state.clock.getElapsedTime();
    // Gentle floating wave
    nodeRef.current.position.y = y + Math.sin(time * 1.2 + delay) * 0.08;
  });

  return (
    <group ref={nodeRef} position={[x, y, z]}>
      {/* Target sphere node */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.3 : 1.0}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2.0 : 0.8}
        />
      </mesh>

      {/* Floating transaction panel on hover */}
      <Html distanceFactor={6} position={[0, 0.55, 0]} center>
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
            background: 'rgba(5, 8, 22, 0.85)',
            boxShadow: `0 8px 24px ${color}15`,
            userSelect: 'none',
            opacity: hovered ? 1 : 0.4,
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f3f4f6' }}>{details}</span>
            <span style={{ fontSize: '0.6rem', color: '#9ca3af' }}>{date}</span>
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: color }}>
            {amount}
          </div>
        </div>
      </Html>
    </group>
  );
};

const DashboardScene = ({ scrollProgressRef }) => {
  const { camera } = useThree();
  const smoothProgressRef = useRef(0);
  const orbRef = useRef();
  
  // Quick stats cards nodes refs
  const satellitesRef = useRef([]);

  const satelliteData = [
    { title: 'Income', value: '₹1,42,500', change: 'up', percent: '+12%', color: '#00ffb2', baseAngle: 0 },
    { title: 'Expenses', value: '₹58,300', change: 'down', percent: '-4%', color: '#ff5f6d', baseAngle: Math.PI / 2 },
    { title: 'Savings', value: '₹4,20,000', change: 'up', percent: '+18%', color: '#00e5ff', baseAngle: Math.PI },
    { title: 'Transactions', value: '24 Logged', change: 'up', percent: 'Active', color: '#7b61ff', baseAngle: (3 * Math.PI) / 2 }
  ];

  // Coordinates for winding timeline curve (y = -12)
  const timelinePoints = useMemo(() => [
    new THREE.Vector3(-4.0, -12 + 1.2, -1.0),
    new THREE.Vector3(-2.0, -12 + 0.3, 0),
    new THREE.Vector3(0, -12 - 0.5, 0.5),
    new THREE.Vector3(2.0, -12 - 1.2, 0),
    new THREE.Vector3(4.0, -12 - 2.0, -1.0)
  ], []);

  const timelineCurve = useMemo(() => new THREE.CatmullRomCurve3(timelinePoints), [timelinePoints]);

  const timelineTube = useMemo(() => {
    return new THREE.TubeGeometry(timelineCurve, 64, 0.05, 8, false);
  }, [timelineCurve]);

  // Transaction items along winding timeline path
  const transactionNodes = [
    { t: 0.15, amount: "+₹1,20,000", details: "Salary Received", date: "May 25", color: "#00ffb2", delay: 0 },
    { t: 0.38, amount: "-₹22,000", details: "House Rent", date: "May 26", color: "#ff5f6d", delay: 1 },
    { t: 0.62, amount: "-₹1,200", details: "Amazon Prime", date: "May 27", color: "#ff5f6d", delay: 2 },
    { t: 0.85, amount: "-₹15,000", details: "HDFC Nifty SIP", date: "May 28", color: "#ffd166", delay: 3 }
  ];

  // Achievements badging positions (y = -24)
  const achievements = [
    { text: "Budget Master", color: "#00ffb2", x: -2.0, z: -0.5 },
    { text: "First Goal Met", color: "#00e5ff", x: 0, z: 0.8 },
    { text: "30 Days Tracking", color: "#ffd166", x: 2.0, z: -0.5 }
  ];

  // Camera paths for dashboard scrolling transitions:
  // Progress maps from [sp = 0, 1, 2, 3, 4]
  const cameraPaths = useMemo(() => [
    // sp = 0: Hero centerpiece y = 0
    { pos: [0, 0, 7.5], lookAt: [0, 0, 0] },
    
    // sp = 1: Spending Galaxy y = -6
    { pos: [0, -6, 6.8], lookAt: [0, -6, 0] },
    
    // sp = 2: Transaction Timeline y = -12
    { pos: [2.0, -12.2, 5.8], lookAt: [0.8, -12.0, 0] },
    
    // sp = 3: Analytics Chamber y = -18
    { pos: [-1.2, -18.2, 6.2], lookAt: [0.8, -18.0, 0] },
    
    // sp = 4: AI Insights & Badges y = -24
    { pos: [0, -24.2, 6.2], lookAt: [0, -23.8, 0] }
  ], []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const sp = scrollProgressRef.current;
    
    // Smooth lerp scroll progress
    smoothProgressRef.current = THREE.MathUtils.lerp(smoothProgressRef.current, sp, 0.08);
    const p = smoothProgressRef.current;

    // Calculate camera target translation based on keyframes
    const baseIdx = Math.floor(p);
    const nextIdx = Math.min(cameraPaths.length - 1, baseIdx + 1);
    const factor = p % 1.0;

    let currentCamPos = new THREE.Vector3();
    let currentCamLookAt = new THREE.Vector3();

    const startPos = new THREE.Vector3(...cameraPaths[baseIdx].pos);
    const endPos = new THREE.Vector3(...cameraPaths[nextIdx].pos);
    currentCamPos.lerpVectors(startPos, endPos, factor);

    const startLook = new THREE.Vector3(...cameraPaths[baseIdx].lookAt);
    const endLook = new THREE.Vector3(...cameraPaths[nextIdx].lookAt);
    currentCamLookAt.lerpVectors(startLook, endLook, factor);

    // Apply camera coords
    camera.position.copy(currentCamPos);

    // Subtle cursor mouse parallax on camera
    camera.position.x += state.mouse.x * 0.35;
    camera.position.y += state.mouse.y * 0.35;

    camera.lookAt(currentCamLookAt);

    // 1. Rotate Hero central balance core
    if (orbRef.current) {
      orbRef.current.rotation.y = time * 0.18;
      
      // Scale down when scroll progress moves to section 2 (p > 0.5)
      let scale = 1.0;
      if (p > 0.5) {
        const shrinkFactor = Math.max(0, Math.min(1, p - 0.5));
        scale = THREE.MathUtils.lerp(1.0, 0.25, shrinkFactor);
      }
      orbRef.current.scale.setScalar(THREE.MathUtils.lerp(orbRef.current.scale.x, scale, 0.08));
    }

    // 2. Animate Quick Stats satellite cards (orbiting the core at y=0)
    satellitesRef.current.forEach((ref, idx) => {
      if (!ref) return;
      const item = satelliteData[idx];
      const orbitSpeed = 0.22;
      const orbitRadius = 2.8;
      const angle = item.baseAngle + time * orbitSpeed;

      const targetX = Math.cos(angle) * orbitRadius;
      const targetZ = Math.sin(angle) * orbitRadius;
      const targetY = Math.sin(time * 0.9 + idx) * 0.18;

      // Scale down and fade out when scrolled down
      let scale = 1.0;
      let opacity = 1.0;

      if (p > 0.5) {
        const shrinkFactor = Math.max(0, Math.min(1, p - 0.5));
        scale = THREE.MathUtils.lerp(1.0, 0.05, shrinkFactor);
        opacity = THREE.MathUtils.lerp(1.0, 0.0, shrinkFactor);
      }

      ref.position.x = THREE.MathUtils.lerp(ref.position.x, targetX, 0.08);
      ref.position.z = THREE.MathUtils.lerp(ref.position.z, targetZ, 0.08);
      ref.position.y = THREE.MathUtils.lerp(ref.position.y, targetY, 0.08);

      // Card faces the camera/screen
      ref.rotation.y = -angle + Math.PI / 2;
      ref.scale.setScalar(THREE.MathUtils.lerp(ref.scale.x, scale, 0.08));

      // Control DOM opacity
      if (ref.element) {
        ref.element.style.opacity = opacity;
        ref.element.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
        ref.element.style.display = opacity < 0.01 ? 'none' : 'block';
      }
    });
  });

  return (
    <group>
      {/* Background Starfield */}
      <ParticlesBG count={1200} />

      {/* SECTION 1: HERO CENTERPIECE (y = 0) */}
      <group position={[0, 0, 0]}>
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
          {/* Main Holographic Balance core */}
          <group ref={orbRef}>
            <mesh>
              <sphereGeometry args={[1.35, 48, 48]} />
              <meshPhysicalMaterial
                color="#00e5ff"
                roughness={0.05}
                transmission={0.9}
                thickness={1.2}
                clearcoat={1.0}
                transparent
                opacity={0.7}
              />
            </mesh>

            {/* Glowing inner wireframe */}
            <mesh>
              <dodecahedronGeometry args={[0.9, 1]} />
              <meshBasicMaterial color="#7b61ff" wireframe transparent opacity={0.35} />
            </mesh>

            {/* Inner tiny glow core */}
            <mesh>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Balance text: floats but does not rotate to maintain readability */}
          <Html center distanceFactor={7.5} zIndexRange={[15, 30]}>
            <div className="text-center pointer-events-none select-none font-sans" style={{ minWidth: '150px' }}>
              <div className="text-[0.6rem] font-bold text-[#00e5ff] uppercase tracking-[2px] mb-1.5 drop-shadow-[0_0_8px_#00e5ff]">
                Current Balance
              </div>
              <div className="text-2xl font-black text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">
                ₹1,24,560
              </div>
            </div>
          </Html>
        </Float>

        {/* Orbit satellites cards */}
        {satelliteData.map((sat, idx) => (
          <group key={sat.title} ref={(el) => (satellitesRef.current[idx] = el)}>
            <Html transform distanceFactor={7} zIndexRange={[10, 40]}>
              <SatelliteCard {...sat} />
            </Html>
          </group>
        ))}
      </group>

      {/* SECTION 2: GALAXY PLANETS (y = -6) */}
      <UniverseGalaxy3D />

      {/* SECTION 3: TRANSACTION TIMELINE (y = -12) */}
      <group position={[0, 0, 0]}>
        {/* Glow guide tube */}
        <mesh geometry={timelineTube}>
          <meshBasicMaterial color="#7b61ff" transparent opacity={0.06} wireframe />
        </mesh>
        
        {/* Main core tube */}
        <mesh geometry={timelineTube}>
          <meshStandardMaterial
            color="#7b61ff"
            emissive="#7b61ff"
            emissiveIntensity={1.0}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Timeline node markers */}
        {transactionNodes.map((node, idx) => {
          const pt = timelineCurve.getPointAt(node.t);
          return (
            <TimelineNode
              key={idx}
              x={pt.x}
              y={pt.y}
              z={pt.z}
              amount={node.amount}
              details={node.details}
              date={node.date}
              color={node.color}
              delay={node.delay}
            />
          );
        })}
      </group>

      {/* SECTION 4: ANALYTICS CHAMBER CHARTS (y = -18) */}
      <HoloCharts3D />

      {/* SECTION 5: AI INSIGHTS ORB & ACHIEVEMENTS (y = -24) */}
      <group position={[0, -24, 0]}>
        {/* AI assistant glowing orb */}
        <Float speed={2.0} rotationIntensity={0.4} floatIntensity={0.5}>
          <mesh>
            <sphereGeometry args={[0.7, 32, 32]} />
            <meshPhysicalMaterial
              color="#00ffb2"
              roughness={0.1}
              transmission={0.8}
              thickness={0.5}
              clearcoat={1.0}
              emissive="#00ffb2"
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh rotation={[0, 0, 1.2]}>
            <octahedronGeometry args={[0.5, 2]} />
            <meshBasicMaterial color="#7b61ff" wireframe transparent opacity={0.4} />
          </mesh>
          <pointLight color="#00ffb2" intensity={1.5} distance={5} decay={2} />
        </Float>

        {/* Floating collectible achievement badges */}
        {achievements.map((badge, idx) => (
          <group key={idx} position={[badge.x, Math.sin(idx) * 0.3, badge.z]}>
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
              <mesh>
                <boxGeometry args={[0.4, 0.4, 0.05]} />
                <meshStandardMaterial
                  color={badge.color}
                  emissive={badge.color}
                  emissiveIntensity={1.0}
                  roughness={0.2}
                />
              </mesh>
              <Html distanceFactor={6} position={[0, 0.35, 0]} center>
                <div style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.55rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  background: 'rgba(5, 8, 22, 0.85)',
                  border: `1px solid ${badge.color}40`,
                  color: 'white',
                  userSelect: 'none'
                }}>
                  🏆 {badge.text}
                </div>
              </Html>
            </Float>
          </group>
        ))}
      </group>
    </group>
  );
};

export default DashboardScene;
