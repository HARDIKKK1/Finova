import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import TransactionsScene from './TransactionsScene';

const TransactionsCanvas = ({ 
  scrollProgressRef, 
  searchQuery, 
  selectedType, 
  selectedCategory, 
  onSelectTransaction,
  isExporting,
  onExportAnimComplete
}) => {
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
        {/* Deep Space Ambient Lighting */}
        <ambientLight intensity={0.4} />
        
        {/* Core cyan keylight representing data streams */}
        <directionalLight position={[-6, 6, 6]} intensity={1.5} color="#00e5ff" />
        
        {/* Warm fill light */}
        <directionalLight position={[6, 6, -6]} intensity={1.0} color="#7b61ff" />
        
        {/* Specific lights representing transaction categories */}
        <pointLight position={[-8, 0, 4]} intensity={1.5} color="#00ffb2" distance={20} decay={1.5} /> {/* Income Green */}
        <pointLight position={[8, 0, 4]} intensity={1.5} color="#ff5f6d" distance={20} decay={1.5} />  {/* Expense Red */}
        <pointLight position={[0, -6, 5]} intensity={2.0} color="#ffd166" distance={20} decay={1.5} />  {/* Investment Gold */}

        <Suspense fallback={null}>
          <TransactionsScene
            scrollProgressRef={scrollProgressRef}
            searchQuery={searchQuery}
            selectedType={selectedType}
            selectedCategory={selectedCategory}
            onSelectTransaction={onSelectTransaction}
            isExporting={isExporting}
            onExportAnimComplete={onExportAnimComplete}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default TransactionsCanvas;
