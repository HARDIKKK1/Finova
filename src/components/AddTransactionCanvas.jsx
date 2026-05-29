import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import AddTransactionScene from './AddTransactionScene';

const AddTransactionCanvas = ({ 
  amount, 
  type, 
  category, 
  isSaving, 
  onSaveComplete 
}) => {
  return (
    <div className="webgl-container">
      <Canvas
        camera={{ position: [0, 0, 7.0], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
      >
        {/* Futuristic Laboratory Lighting */}
        <ambientLight intensity={0.4} />
        
        {/* Neon blue keylight */}
        <directionalLight position={[-5, 5, 5]} intensity={1.5} color="#00e5ff" />
        
        {/* Soft purple fill light */}
        <directionalLight position={[5, 5, -5]} intensity={1.0} color="#7b61ff" />
        
        {/* Dynamic color-specific spotlight depending on selected type */}
        <pointLight 
          position={[0, 0, 4]} 
          intensity={3.0} 
          color={
            type === 'income' ? '#00ffb2' : 
            type === 'expense' ? '#ff5f6d' : 
            type === 'investment' ? '#ffd166' : 
            '#00e5ff'
          } 
          distance={15} 
          decay={1.2} 
        />

        <Suspense fallback={null}>
          <AddTransactionScene
            amount={amount}
            type={type}
            category={category}
            isSaving={isSaving}
            onSaveComplete={onSaveComplete}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default AddTransactionCanvas;
