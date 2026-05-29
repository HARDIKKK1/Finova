import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import VaultScene from './VaultScene';

const LoginCanvas = ({ isTyping, isSubmitting, isSuccess, onSuccessAnimComplete }) => {
  return (
    <div className="webgl-container">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
      >
        {/* Lights */}
        <ambientLight intensity={0.3} />
        
        {/* Neon blue keylight */}
        <directionalLight position={[-5, 5, 5]} intensity={1.5} color="#00e5ff" />
        
        {/* Ambient purple backlight */}
        <pointLight position={[-10, 10, -5]} intensity={2.0} color="#7b61ff" distance={30} decay={1.5} />
        
        {/* Success emerald light (initially soft, brightens during success) */}
        <pointLight position={[5, -5, 5]} intensity={isSuccess ? 5.0 : 0.8} color="#00ffb2" distance={25} decay={1.2} />
        
        {/* Soft top white light */}
        <directionalLight position={[0, 10, 3]} intensity={1.0} color="#ffffff" />
        
        <Suspense fallback={null}>
          <VaultScene
            isTyping={isTyping}
            isSubmitting={isSubmitting}
            isSuccess={isSuccess}
            onSuccessAnimComplete={onSuccessAnimComplete}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default LoginCanvas;
