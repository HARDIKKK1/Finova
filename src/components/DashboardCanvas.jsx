import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import DashboardScene from './DashboardScene';

const DashboardCanvas = ({ scrollProgressRef }) => {
  return (
    <div className="webgl-container">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
      >
        {/* Cinematic Ambient Space Lights */}
        <ambientLight intensity={0.35} />
        
        {/* Primary neon blue keylight */}
        <directionalLight position={[-6, 6, 6]} intensity={1.8} color="#00e5ff" />
        
        {/* Soft violet fill light */}
        <directionalLight position={[6, 6, -6]} intensity={1.2} color="#7b61ff" />
        
        {/* Emerald green glow source for Income */}
        <pointLight position={[-10, -5, 5]} intensity={2.0} color="#00ffb2" distance={25} decay={1.5} />
        
        {/* Coral red glow source for Expenses */}
        <pointLight position={[10, -10, 5]} intensity={2.0} color="#ff5f6d" distance={25} decay={1.5} />
        
        {/* Gold highlight source for Investments */}
        <pointLight position={[0, -15, 8]} intensity={2.5} color="#ffd166" distance={30} decay={1.5} />
        
        <Suspense fallback={null}>
          <DashboardScene scrollProgressRef={scrollProgressRef} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default DashboardCanvas;
