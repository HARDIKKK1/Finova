import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import ParticlesBG from './ParticlesBG';

const CategoryPlanet = ({ name, emoji, color, idx, totalCount, selectedCategory, positionRef }) => {
  const planetRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Compute resting position in a circular ring at y = -1.8
  const restingPos = useMemo(() => {
    const angle = idx * ((Math.PI * 2) / totalCount);
    const radius = 3.2;
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      -1.8 + Math.sin(idx) * 0.1, // float heights
      Math.sin(angle) * radius
    );
  }, [idx, totalCount]);

  useFrame((state, delta) => {
    if (!planetRef.current) return;
    const time = state.clock.getElapsedTime();
    const isSelected = selectedCategory.toLowerCase() === name.toLowerCase();

    // 1. Calculate target position
    let targetPos = new THREE.Vector3();
    if (isSelected) {
      // Fly into close orbit around the transaction core at y = 0
      const orbitSpeed = 1.4;
      const orbitRadius = 1.5;
      const angle = time * orbitSpeed + idx;
      targetPos.set(
        Math.cos(angle) * orbitRadius,
        Math.sin(time * 0.8) * 0.15,
        Math.sin(angle) * orbitRadius
      );
    } else {
      // Return to resting circular Suggestion Deck position
      targetPos.copy(restingPos);
      targetPos.y += Math.sin(time * 0.8 + idx) * 0.05; // floating wave
    }

    // Lerp position
    planetRef.current.position.lerp(targetPos, 0.08);
    positionRef.current = planetRef.current.position;

    // Slow rotation
    planetRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={planetRef}>
      {/* Planet Sphere */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={selectedCategory.toLowerCase() === name.toLowerCase() ? 1.2 : hovered ? 1.15 : 1.0}
      >
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          transmission={0.4}
          thickness={0.5}
          emissive={color}
          emissiveIntensity={selectedCategory.toLowerCase() === name.toLowerCase() ? 1.0 : hovered ? 0.7 : 0.25}
        />
      </mesh>

      {/* Orbit ring around planet (only when selected) */}
      {selectedCategory.toLowerCase() === name.toLowerCase() && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.42, 0.012, 4, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      )}

      {/* Emoji/Label Billboards */}
      <Html distanceFactor={6} position={[0, 0.45, 0]} center>
        <div style={{
          padding: '0.2rem 0.5rem',
          borderRadius: '6px',
          fontSize: '0.55rem',
          fontWeight: 800,
          whiteSpace: 'nowrap',
          border: `1px solid ${color}40`,
          background: 'rgba(5, 8, 22, 0.85)',
          color: 'white',
          userSelect: 'none',
          pointerEvents: 'none',
          opacity: hovered || selectedCategory.toLowerCase() === name.toLowerCase() ? 1 : 0.65,
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.2s ease'
        }}>
          {emoji} {name}
        </div>
      </Html>
    </group>
  );
};

const AddTransactionScene = ({ amount, type, category, isSaving, onSaveComplete }) => {
  const { camera } = useThree();
  const coreRef = useRef();
  const cubeRef = useRef();
  
  // Track success animations
  const saveProgress = useRef(0);
  const isCompleteTriggered = useRef(false);

  const categoriesData = [
    { name: "Food", emoji: "🍔", color: "#ff5f6d" },
    { name: "Shopping", emoji: "🛍", color: "#7b61ff" },
    { name: "Travel", emoji: "✈", color: "#00e5ff" },
    { name: "Bills", emoji: "🏠", color: "#00ffb2" },
    { name: "Education", emoji: "🎓", color: "#ffd166" },
    { name: "Entertainment", emoji: "🎮", color: "#ffffff" },
    { name: "Salary", emoji: "💼", color: "#00ffb2" },
    { name: "Investment", emoji: "📈", color: "#ffd166" }
  ];

  // Track coordinates for category planets (so we can reference positions)
  const planetPositions = useRef(categoriesData.map(() => new THREE.Vector3()));

  // Map transaction type to color
  const typeColors = {
    income: '#00ffb2',
    expense: '#ff5f6d',
    investment: '#ffd166',
    transfer: '#00e5ff'
  };
  const activeColor = typeColors[type] || '#7b61ff';

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Core Sphere sizing and color updating dynamically
    if (coreRef.current && !isSaving) {
      // Calculate target sphere scale: base radius is 0.7, expands up to 2.2 based on amount
      const parsedAmount = parseFloat(amount) || 0;
      const scaleFactor = Math.min(parsedAmount / 60000, 1.8);
      const targetScale = 0.75 + scaleFactor * 0.85;

      coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, targetScale, 0.1));
      coreRef.current.rotation.y = time * 0.25;
      coreRef.current.rotation.x = Math.sin(time) * 0.1;
    }

    // 2. Volumetric lighting and camera adjustments (slight tilt)
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.mouse.x * 0.35, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, state.mouse.y * 0.35, 0.05);
    camera.lookAt(-0.6, 0, 0); // Offset lookAt to center-left to balance card on left

    // 3. Save Animation: Compress core into a cube and launch it
    if (isSaving) {
      saveProgress.current += delta;
      const t = Math.min(1.0, saveProgress.current / 1.6); // 1.6s timeline

      if (coreRef.current) {
        // Compress core to 0 rapidly
        const compressFactor = Math.max(0.001, 1.0 - t * 2.5); // compress in first 40% of animation
        coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, compressFactor * 0.001, 0.15));
      }

      if (cubeRef.current) {
        // Scale up and launch cube towards space depth
        const launchFactor = Math.max(0.0, (t - 0.3) / 0.7); // starts launching after 30% time
        const targetZ = THREE.MathUtils.lerp(0.0, -18.0, Math.pow(launchFactor, 2.5));
        
        cubeRef.current.position.set(0, 0, targetZ);
        cubeRef.current.rotation.x += delta * 4;
        cubeRef.current.rotation.y += delta * 6;
        
        // Cube scales up first, then shrinks as it flies away
        let cubeScale = 0.25;
        if (launchFactor > 0.8) {
          cubeScale = 0.25 * (1.0 - (launchFactor - 0.8) / 0.2); // shrink out
        } else if (t < 0.3) {
          cubeScale = t / 0.3 * 0.25; // grow in
        }
        
        cubeRef.current.scale.setScalar(Math.max(0.001, cubeScale));
      }

      if (t >= 0.95 && !isCompleteTriggered.current) {
        isCompleteTriggered.current = true;
        onSaveComplete();
      }
    }
  });

  return (
    <group>
      {/* Background Starfield */}
      <ParticlesBG count={1200} />

      {/* Centerpiece Transaction Core (Floating at y = 0) */}
      {!isSaving && (
        <group position={[0, 0, 0]} ref={coreRef}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            {/* Outer energy shell */}
            <mesh>
              <sphereGeometry args={[1.0, 32, 32]} />
              <meshPhysicalMaterial
                color={activeColor}
                roughness={0.05}
                transmission={0.85}
                thickness={0.8}
                clearcoat={1.0}
                emissive={activeColor}
                emissiveIntensity={0.4}
              />
            </mesh>

            {/* Inner rotating grid */}
            <mesh rotation={[0.5, 0.5, 0]}>
              <icosahedronGeometry args={[0.7, 1]} />
              <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.25} />
            </mesh>

            {/* Inner core point light */}
            <mesh>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </Float>
        </group>
      )}

      {/* Glowing Energy Cube launched during Save */}
      {isSaving && (
        <mesh ref={cubeRef} position={[0, 0, 0]} scale={[0.001, 0.001, 0.001]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={activeColor} />
          <pointLight color={activeColor} intensity={3.0} distance={6} decay={1.5} />
        </mesh>
      )}

      {/* Floating Suggestion Deck of Category Planets */}
      {categoriesData.map((planet, idx) => {
        const posRef = { current: new THREE.Vector3() };
        planetPositions.current[idx] = posRef.current;

        return (
          <CategoryPlanet
            key={planet.name}
            name={planet.name}
            emoji={planet.emoji}
            color={planet.color}
            idx={idx}
            totalCount={categoriesData.length}
            selectedCategory={category}
            positionRef={posRef}
          />
        );
      })}
    </group>
  );
};

export default AddTransactionScene;
