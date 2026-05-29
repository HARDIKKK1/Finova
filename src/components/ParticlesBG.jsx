import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticlesBG = ({ count = 1200 }) => {
  const pointsRef = useRef();
  
  // Create random particle coordinates, speeds, and colors
  const [positions, randomSpeeds, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const cols = new Float32Array(count * 3);
    
    const colorPalette = [
      new THREE.Color("#00d2ff"), // Electric Blue
      new THREE.Color("#bd00ff"), // Neon Purple
      new THREE.Color("#00f5a0"), // Emerald Green
      new THREE.Color("#ffffff")  // White
    ];

    for (let i = 0; i < count; i++) {
      // Scatter in a cylinder around the center y-axis spanning all sections (y = 5 to -22)
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 12;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.7) * 30; // vertically stretched from +10 to -20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      
      speeds[i] = 0.05 + Math.random() * 0.15;
      
      // Random color from palette
      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }
    
    return [pos, speeds, cols];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // Slow rotation
    pointsRef.current.rotation.y += 0.0008;
    
    // Smooth mouse parallax
    const targetRotX = state.mouse.y * 0.15;
    const targetRotY = state.mouse.x * 0.15;
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetRotX, 0.05);
    pointsRef.current.rotation.z = THREE.MathUtils.lerp(pointsRef.current.rotation.z, -targetRotY * 0.5, 0.05);

    // Dynamic upward drifting
    const posArr = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const idxY = i * 3 + 1;
      posArr[idxY] += randomSpeeds[i] * 0.02; // slow upward drift
      
      // Reset if it goes too high
      if (posArr[idxY] > 10) {
        posArr[idxY] = -22;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticlesBG;
