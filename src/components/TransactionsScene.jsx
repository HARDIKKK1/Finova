import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import ParticlesBG from './ParticlesBG';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, DollarSign, 
  HelpCircle, ShoppingBag, Coffee, Plane, BookOpen, Gamepad, Landmark 
} from 'lucide-react';

const TransactionCard = ({ tx, onClick, isFilteredOut }) => {
  const cardRef = useRef();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const scaleRef = useRef(1.0);

  const handleMouseMove = (e) => {
    if (!cardRef.current || isFilteredOut) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 15, y: -y * 15 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const getIcon = () => {
    switch (tx.category.toLowerCase()) {
      case 'salary': return <Landmark className="text-[#00ffb2]" size={16} />;
      case 'food': return <Coffee className="text-[#ff5f6d]" size={16} />;
      case 'shopping': return <ShoppingBag className="text-[#7b61ff]" size={16} />;
      case 'travel': return <Plane className="text-[#00e5ff]" size={16} />;
      case 'education': return <BookOpen className="text-[#ffd166]" size={16} />;
      case 'entertainment': return <Gamepad className="text-white" size={16} />;
      default: return <DollarSign size={16} />;
    }
  };

  useFrame((state, delta) => {
    if (!cardRef.current) return;
    
    // Scale animation on filter out/in
    const targetScale = isFilteredOut ? 0.001 : 1.0;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 0.1);
    
    if (cardRef.current.parentElement) {
      cardRef.current.parentElement.style.transform = `scale(${scaleRef.current})`;
      cardRef.current.parentElement.style.opacity = scaleRef.current < 0.1 ? '0' : '1';
      cardRef.current.parentElement.style.pointerEvents = scaleRef.current < 0.1 ? 'none' : 'auto';
      cardRef.current.parentElement.style.display = scaleRef.current < 0.01 ? 'none' : 'block';
    }
  });

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => !isFilteredOut && onClick(tx)}
      className="hologram-card ui-interactive"
      style={{
        width: '220px',
        padding: '1.2rem',
        borderRadius: '16px',
        background: 'rgba(5, 8, 22, 0.85)',
        border: `1px solid ${tx.color}35`,
        borderLeft: `3px solid ${tx.color}`,
        transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
        transition: 'transform 0.1s ease-out, border-color 0.3s',
        cursor: 'pointer',
        boxShadow: `0 10px 30px ${tx.color}10`,
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {getIcon()}
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {tx.category}
          </span>
        </div>
        <span style={{ fontSize: '0.6rem', color: '#6b7280', fontWeight: 600 }}>{tx.date}</span>
      </div>
      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {tx.title}
      </h4>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white' }}>{tx.amount}</span>
        <span style={{
          fontSize: '0.6rem',
          padding: '0.15rem 0.4rem',
          borderRadius: '10px',
          fontWeight: 700,
          background: `${tx.color}15`,
          color: tx.color
        }}>
          {tx.status}
        </span>
      </div>
    </div>
  );
};

const TransactionsScene = ({ 
  scrollProgressRef, 
  searchQuery, 
  selectedType, 
  selectedCategory, 
  onSelectTransaction,
  isExporting,
  onExportAnimComplete
}) => {
  const { camera } = useThree();
  const smoothProgressRef = useRef(0);
  const cardsRef = useRef([]);
  const portalRef = useRef();

  // Export cubes state
  const exportCubes = useRef([]);
  const exportProgress = useRef(0);
  const [cubesCount] = useState(15);

  const transactionsData = [
    { id: 1, title: 'Employer Salary', amount: '₹1,20,000', category: 'Salary', type: 'income', date: 'May 25', status: 'Success', color: '#00ffb2', notes: 'Monthly payroll deposit.', method: 'NEFT' },
    { id: 2, title: 'Luxe Apartment Rent', amount: '₹22,000', category: 'Bills', type: 'expense', date: 'May 26', status: 'Success', color: '#ff5f6d', notes: 'Monthly flat maintenance and rent.', method: 'UPI' },
    { id: 3, title: 'HDFC Nifty Fund SIP', amount: '₹15,000', category: 'Education', type: 'investment', date: 'May 27', status: 'Success', color: '#ffd166', notes: 'Automated index SIP.', method: 'ACH' },
    { id: 4, title: 'Amazon Prime Sub', amount: '₹1,200', category: 'Entertainment', type: 'expense', date: 'May 28', status: 'Success', color: '#ff5f6d', notes: 'Yearly subscription renewal.', method: 'Card' },
    { id: 5, title: 'UI Freelance Consulting', amount: '₹7,500', category: 'Salary', type: 'income', date: 'May 28', status: 'Success', color: '#00ffb2', notes: 'Contract payout for Finova UI mockup.', method: 'UPI' },
    { id: 6, title: 'Nandu Dhaba Dining', amount: '₹1,450', category: 'Food', type: 'expense', date: 'May 29', status: 'Success', color: '#ff5f6d', notes: 'Team dinner.', method: 'Cash' }
  ];

  // Coordinates for timeline curve centerpiece (y = 0)
  const timelinePoints = useMemo(() => [
    new THREE.Vector3(-5.0, 1.8, -1.5),
    new THREE.Vector3(-3.0, 0.4, -0.5),
    new THREE.Vector3(-1.0, -0.6, 0.5),
    new THREE.Vector3(1.0, 0.8, -0.5),
    new THREE.Vector3(3.0, -0.4, 0.5),
    new THREE.Vector3(5.0, -1.8, -1.5)
  ], []);

  const timelineCurve = useMemo(() => new THREE.CatmullRomCurve3(timelinePoints), [timelinePoints]);
  const timelineTube = useMemo(() => {
    return new THREE.TubeGeometry(timelineCurve, 64, 0.04, 8, false);
  }, [timelineCurve]);

  // Coordinates mapping database items along the timeline
  const cardsCoords = useMemo(() => [0.1, 0.28, 0.45, 0.62, 0.78, 0.92], []);

  // Expense heatmap coordinates (y = -6)
  const heatmapClusters = [
    { name: "Food", size: 0.55, color: "#ff5f6d", pos: [-1.8, -6 - 0.2, 0], speed: 0.8 },
    { name: "Shopping", size: 0.48, color: "#7b61ff", pos: [0.2, -6 + 0.4, -1.0], speed: -0.6 },
    { name: "Travel", size: 0.42, color: "#00e5ff", pos: [1.8, -6 - 0.5, 0.5], speed: 1.0 },
    { name: "Bills", size: 0.38, color: "#00ffb2", pos: [-0.8, -6 - 0.8, -0.5], speed: -0.5 },
    { name: "Education", size: 0.32, color: "#ffd166", pos: [1.2, -6 + 0.9, -0.2], speed: 0.4 },
    { name: "Leisure", size: 0.24, color: "#ffffff", pos: [-2.2, -6 + 0.8, 0.8], speed: -1.2 }
  ];

  // Camera paths:
  // sp = 0: Winding timeline centerpiece
  // sp = 1: Expense heatmap clusters
  const cameraPaths = useMemo(() => [
    { pos: [0, 0, 7.5], lookAt: [0, 0, 0] },
    { pos: [0, -6, 6.8], lookAt: [0, -6, 0] }
  ], []);

  // Initialize cubes coordinates for export animation
  const initialCubes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < cubesCount; i++) {
      arr.push({
        tOffset: Math.random(),
        speed: 0.3 + Math.random() * 0.4,
        size: 0.05 + Math.random() * 0.08,
        color: ['#00e5ff', '#7b61ff', '#00ffb2'][Math.floor(Math.random() * 3)]
      });
    }
    return arr;
  }, [cubesCount]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const sp = scrollProgressRef.current;
    
    // Smooth lerp progress
    smoothProgressRef.current = THREE.MathUtils.lerp(smoothProgressRef.current, Math.min(1.0, sp), 0.08);
    const p = smoothProgressRef.current;

    // Calculate camera target translation
    let currentCamPos = new THREE.Vector3();
    let currentCamLookAt = new THREE.Vector3();

    const startPos = new THREE.Vector3(...cameraPaths[0].pos);
    const endPos = new THREE.Vector3(...cameraPaths[1].pos);
    currentCamPos.lerpVectors(startPos, endPos, p);

    const startLook = new THREE.Vector3(...cameraPaths[0].lookAt);
    const endLook = new THREE.Vector3(...cameraPaths[1].lookAt);
    currentCamLookAt.lerpVectors(startLook, endLook, p);

    camera.position.copy(currentCamPos);

    // Subtle cursor mouse parallax
    camera.position.x += state.mouse.x * 0.35;
    camera.position.y += state.mouse.y * 0.35;

    camera.lookAt(currentCamLookAt);

    // Update 3D card layout float waves
    cardsRef.current.forEach((ref, idx) => {
      if (!ref) return;
      const t = cardsCoords[idx];
      const pt = timelineCurve.getPointAt(t);

      ref.position.x = pt.x;
      ref.position.y = pt.y + Math.sin(time * 1.5 + idx) * 0.12; // wave
      ref.position.z = pt.z;
    });

    // Animate export portal sphere glow
    if (portalRef.current) {
      portalRef.current.rotation.y = time * 0.5;
      portalRef.current.rotation.z = -time * 0.3;
      const pulse = 1.0 + Math.sin(time * 4) * 0.15;
      portalRef.current.scale.setScalar(pulse);
    }

    // Animate export terminal cubes flow
    if (isExporting) {
      exportProgress.current += delta * 0.35; // speed
      
      exportCubes.current.forEach((cubeMesh, idx) => {
        if (!cubeMesh) return;
        const config = initialCubes[idx];
        
        // Cubes flow from left timeline nodes towards the portal centered at y=-12, x=0
        // Calculate interpolation factor
        let t = (exportProgress.current * config.speed + config.tOffset) % 1.0;
        
        // Path from curve endpoint to portal
        const pt = timelineCurve.getPointAt(1 - t); // flow back
        const targetPortalPos = new THREE.Vector3(0, -12, 0);
        
        // Blend path to portal centered
        const currentPos = new THREE.Vector3().lerpVectors(pt, targetPortalPos, Math.pow(t, 2.0));
        currentPos.y -= 12; // offset since timeline is at y=0, portal at y=-12
        
        cubeMesh.position.copy(currentPos);
        cubeMesh.rotation.x += delta * 2;
        cubeMesh.rotation.y += delta * 3;
        
        // Scale down to 0 as it merges into portal
        const cubeScale = config.size * (1.0 - t);
        cubeMesh.scale.setScalar(Math.max(0.001, cubeScale));
      });

      // Export complete callback at end of animation
      if (exportProgress.current >= 1.5) {
        exportProgress.current = 0;
        onExportAnimComplete();
      }
    }
  });

  return (
    <group>
      {/* Background Starfield */}
      <ParticlesBG count={1200} />

      {/* SECTION 1: TIMELINE GALAXY CENTERPIECE (y = 0) */}
      <group position={[0, 0, 0]}>
        {/* Glow guide tube */}
        <mesh geometry={timelineTube}>
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.06} wireframe />
        </mesh>
        
        {/* Winding timeline pathway core */}
        <mesh geometry={timelineTube}>
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={1.0}
            roughness={0.15}
            metalness={0.8}
          />
        </mesh>

        {/* 3D suspended transaction cards along path */}
        {transactionsData.map((tx, idx) => {
          // Check if card passes criteria filter
          const query = searchQuery.toLowerCase();
          const matchesSearch = query === '' 
            || tx.title.toLowerCase().includes(query)
            || tx.category.toLowerCase().includes(query)
            || tx.notes.toLowerCase().includes(query);
            
          const matchesType = selectedType === 'all' || tx.type === selectedType;
          const matchesCategory = selectedCategory === 'all' || tx.category.toLowerCase() === selectedCategory.toLowerCase();
          
          const isFilteredOut = !matchesSearch || !matchesType || !matchesCategory;

          return (
            <group
              key={tx.id}
              ref={(el) => (cardsRef.current[idx] = el)}
              position={[0, 0, 0]}
            >
              <Html transform distanceFactor={7} zIndexRange={[10, 40]}>
                <TransactionCard
                  tx={tx}
                  onClick={onSelectTransaction}
                  isFilteredOut={isFilteredOut}
                />
              </Html>
            </group>
          );
        })}
      </group>

      {/* SECTION 2: EXPENSE HEATMAP CLUSTERS (y = -6) */}
      <group position={[0, 0, 0]}>
        {heatmapClusters.map((cluster, idx) => (
          <group key={idx} position={cluster.pos}>
            <Float speed={cluster.speed * 2} rotationIntensity={0.3} floatIntensity={0.4}>
              <mesh>
                <sphereGeometry args={[cluster.size, 32, 32]} />
                <meshPhysicalMaterial
                  color={cluster.color}
                  roughness={0.15}
                  transmission={0.6}
                  thickness={0.5}
                  emissive={cluster.color}
                  emissiveIntensity={0.6}
                />
              </mesh>
              <mesh rotation={[0, 0, 1]}>
                <torusGeometry args={[cluster.size * 1.4, 0.015, 8, 32]} />
                <meshBasicMaterial color={cluster.color} transparent opacity={0.35} />
              </mesh>
              <Html distanceFactor={6} position={[0, cluster.size + 0.3, 0]} center>
                <div style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.55rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  background: 'rgba(5, 8, 22, 0.85)',
                  border: `1px solid ${cluster.color}40`,
                  color: 'white',
                  userSelect: 'none'
                }}>
                  🔥 {cluster.name}
                </div>
              </Html>
            </Float>
          </group>
        ))}
      </group>

      {/* SECTION 3: EXPORT TERMINAL PORTAL (y = -12) */}
      <group position={[0, -12, 0]}>
        {/* Terminal portal gateway sphere */}
        <mesh ref={portalRef}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshBasicMaterial
            color="#7b61ff"
            wireframe
            transparent
            opacity={isExporting ? 0.95 : 0.4}
          />
        </mesh>
        
        {/* Inner portal light */}
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color={isExporting ? "#00e5ff" : "#bd00ff"} />
          <pointLight color={isExporting ? "#00e5ff" : "#bd00ff"} intensity={isExporting ? 4.0 : 1.5} distance={6} decay={2} />
        </mesh>

        <Html distanceFactor={6} position={[0, -1.0, 0]} center>
          <div className="glass-panel" style={{
            padding: '0.4rem 0.8rem',
            whiteSpace: 'nowrap',
            fontSize: '0.65rem',
            fontWeight: 800,
            color: isExporting ? '#00e5ff' : '#9ca3af',
            border: `1px solid ${isExporting ? '#00e5ff40' : 'rgba(255,255,255,0.08)'}`,
            background: 'rgba(5, 8, 22, 0.85)',
            textShadow: isExporting ? '0 0 8px #00e5ff' : 'none'
          }}>
            {isExporting ? 'Transmitting Data Cube...' : 'Export Center Ready'}
          </div>
        </Html>

        {/* Floating animated data cubes during export */}
        {isExporting && initialCubes.map((cube, idx) => (
          <mesh key={idx} ref={(el) => (exportCubes.current[idx] = el)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={cube.color} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default TransactionsScene;
