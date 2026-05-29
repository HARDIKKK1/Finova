import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import ParticlesBG from './ParticlesBG';
import { HolographicCards } from './HolographicCard';
import Timeline3D from './Timeline3D';
import Analytics3D from './Analytics3D';
import Pipelines3D from './Pipelines3D';
import CrystalTree3D from './CrystalTree3D';

const GlassOrb = ({ scrollProgressRef }) => {
  const orbRef = useRef();
  const innerRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const sp = scrollProgressRef.current;

    // Slow rotation
    if (orbRef.current) {
      orbRef.current.rotation.y = time * 0.15;
      orbRef.current.rotation.x = time * 0.08;
      
      // Zooms camera through orb. During sp = 0 to 1, scale orb up or down, or fade out
      // Fade out opacity when camera enters/zooms through the orb (sp around 0.5 to 1)
      let scale = 1.0;
      let opacity = 1.0;

      if (sp < 0.6) {
        scale = 1.0 + sp * 1.5; // slight scale up as camera zooms in
      } else if (sp >= 0.6 && sp < 1.2) {
        scale = 1.0; // scale back
      } else {
        scale = 0.5; // shrink and move to background in other sections
      }
      
      orbRef.current.scale.setScalar(THREE.MathUtils.lerp(orbRef.current.scale.x, scale, 0.08));
    }
    
    if (innerRef.current) {
      innerRef.current.rotation.y = -time * 0.3;
      innerRef.current.rotation.z = time * 0.2;
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.5) * 0.1;
      ringRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer polished Glass Orb */}
      <mesh ref={orbRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial
          color="#00d2ff"
          roughness={0.03}
          metalness={0.1}
          transmission={0.9} // High glass transmission
          thickness={1.5}
          ior={1.48}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          specularIntensity={1.0}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Inner Glowing Hologram Core */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial
          color="#bd00ff"
          wireframe
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Tiny solid white core light source */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Orbital glowing ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.0, 0.03, 8, 64]} />
        <meshBasicMaterial
          color="#00f5a0"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

const CommandCenterScene = ({ scrollProgressRef }) => {
  const { camera } = useThree();
  const smoothProgressRef = useRef(0);
  
  // Smoothly lerp mouse coordinate for card parallax
  const smoothMouse = useRef({ x: 0, y: 0 });

  // Camera scroll keyframes
  // Coordinates corresponding to [sp = 0, 1, 2, 3, 4, 5]
  const cameraPaths = useMemo(() => [
    // sp = 0: Hero Orb orbiting
    { pos: [0, 0, 8], lookAt: [0, 0, 0] },
    
    // sp = 0.5 (Mid-scroll 1-2): Dolly zoom THROUGH the glass orb shell
    { pos: [0, 0, 0.35], lookAt: [0, 0, -2] },
    
    // sp = 1: Dashboard Panel Layout
    { pos: [0, 0, 5.5], lookAt: [0, 0, 0] },
    
    // sp = 2: Winding Timeline Section (y = -4)
    { pos: [2.5, -4.2, 5.2], lookAt: [1.2, -4.0, 0] },
    
    // sp = 3: Analytics Section (y = -8)
    { pos: [-1.2, -8.2, 5.5], lookAt: [0.8, -8.0, 0] },
    
    // sp = 4: Pipelines Section (y = -12)
    { pos: [0, -12.2, 6.2], lookAt: [0, -12.0, 0] },
    
    // sp = 5: Savings Crystal Tree Section (y = -16)
    { pos: [1.8, -16.2, 5.2], lookAt: [0.3, -15.2, 0] }
  ], []);

  useFrame((state) => {
    const sp = scrollProgressRef.current;
    
    // Lerp scroll position for absolute cinematic smoothness
    smoothProgressRef.current = THREE.MathUtils.lerp(smoothProgressRef.current, sp, 0.075);
    const p = smoothProgressRef.current;

    // Calculate interpolated camera position and LookAt target based on keyframes
    let currentCamPos = new THREE.Vector3();
    let currentCamLookAt = new THREE.Vector3();

    // Map progress range to specific indices
    // 0 to 0.5 (dolly inside) -> segment 0
    // 0.5 to 1.0 (back to dashboard) -> segment 1
    // 1.0 to 2.0 (timeline) -> segment 2
    // 2.0 to 3.0 (analytics) -> segment 3
    // 3.0 to 4.0 (pipelines) -> segment 4
    // 4.0 to 5.0 (savings tree) -> segment 5
    
    if (p <= 0.5) {
      // Interpolate between [0] and [1] in path
      const factor = p / 0.5;
      const startPos = new THREE.Vector3(...cameraPaths[0].pos);
      const endPos = new THREE.Vector3(...cameraPaths[1].pos);
      currentCamPos.lerpVectors(startPos, endPos, factor);
      
      const startLook = new THREE.Vector3(...cameraPaths[0].lookAt);
      const endLook = new THREE.Vector3(...cameraPaths[1].lookAt);
      currentCamLookAt.lerpVectors(startLook, endLook, factor);
    } else if (p <= 1.0) {
      const factor = (p - 0.5) / 0.5;
      const startPos = new THREE.Vector3(...cameraPaths[1].pos);
      const endPos = new THREE.Vector3(...cameraPaths[2].pos);
      currentCamPos.lerpVectors(startPos, endPos, factor);
      
      const startLook = new THREE.Vector3(...cameraPaths[1].lookAt);
      const endLook = new THREE.Vector3(...cameraPaths[2].lookAt);
      currentCamLookAt.lerpVectors(startLook, endLook, factor);
    } else {
      // General section transitions
      // idx starts at 2 (corresponds to p = 1.0)
      const baseIdx = Math.floor(p) + 1; // mapping floor(p)=1 to cameraPaths[2], etc.
      const nextIdx = Math.min(cameraPaths.length - 1, baseIdx + 1);
      const factor = p % 1.0;

      const startPos = new THREE.Vector3(...cameraPaths[baseIdx].pos);
      const endPos = new THREE.Vector3(...cameraPaths[nextIdx].pos);
      currentCamPos.lerpVectors(startPos, endPos, factor);
      
      const startLook = new THREE.Vector3(...cameraPaths[baseIdx].lookAt);
      const endLook = new THREE.Vector3(...cameraPaths[nextIdx].lookAt);
      currentCamLookAt.lerpVectors(startLook, endLook, factor);
    }

    // Apply camera position
    camera.position.copy(currentCamPos);

    // Apply mouse parallax to camera position to create deep visual feedback
    const mouseParallaxX = state.mouse.x * 0.4;
    const mouseParallaxY = state.mouse.y * 0.4;
    camera.position.x += mouseParallaxX;
    camera.position.y += mouseParallaxY;

    // Apply LookAt target
    camera.lookAt(currentCamLookAt);
  });

  return (
    <group>
      {/* Dynamic Cosmic Background */}
      <ParticlesBG count={1500} />

      {/* Hero Central Orb + Orbiting Cards (at y = 0) */}
      <group position={[0, 0, 0]}>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <GlassOrb scrollProgressRef={scrollProgressRef} />
        </Float>
        <HolographicCards scrollProgressRef={scrollProgressRef} />
      </group>

      {/* Section 3: Winding Transaction Timeline (at y = -4) */}
      <Timeline3D scrollProgressRef={scrollProgressRef} />

      {/* Section 4: Spending Analytics Charts (at y = -8) */}
      <Analytics3D scrollProgressRef={scrollProgressRef} />

      {/* Section 5: Money Streams & Glowing Pipelines (at y = -12) */}
      <Pipelines3D scrollProgressRef={scrollProgressRef} />

      {/* Section 6: Savings Growth Crystal Tree (at y = -16) */}
      <CrystalTree3D scrollProgressRef={scrollProgressRef} />
    </group>
  );
};

export default CommandCenterScene;
