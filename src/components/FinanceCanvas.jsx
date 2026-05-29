import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CommandCenterScene from './CommandCenterScene';

const FinanceCanvas = ({ scrollProgressRef }) => {
  return (
    <div className="webgl-container">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 2]} // Limit pixel ratio to 2 for performance
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
      >
        {/* Lights */}
        <ambientLight intensity={0.4} />
        
        {/* Deep blue fill light */}
        <directionalLight position={[-5, 5, -5]} intensity={1.5} color="#0055ff" />
        
        {/* Main electric blue light */}
        <pointLight position={[10, 10, 10]} intensity={2.5} color="#00d2ff" distance={30} decay={1.5} />
        
        {/* Ambient purple backlight */}
        <pointLight position={[-10, -10, -10]} intensity={2.0} color="#bd00ff" distance={30} decay={1.5} />
        
        {/* Soft white top light for card readability and reflections */}
        <directionalLight position={[0, 10, 5]} intensity={1.2} color="#ffffff" />
        
        <Suspense fallback={null}>
          <CommandCenterScene scrollProgressRef={scrollProgressRef} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default FinanceCanvas;
