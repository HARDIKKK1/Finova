import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const CrystalTree3D = ({ scrollProgressRef }) => {
  const groupRef = useRef();
  
  // References for branches to control sequential growth
  const trunkRef = useRef();
  const branchL1_L = useRef();
  const branchL1_R = useRef();
  const branchL2_LL = useRef();
  const branchL2_LR = useRef();
  const branchL2_RL = useRef();
  const branchL2_RR = useRef();
  const leavesRef = useRef();

  // Positions and dimensions
  // y starts at -16 (Section 6).
  const treeConfig = {
    trunk: { pos: [0, -1.8, 0], scaleY: 1.2, radius: 0.08 },
    l1: {
      left: { pos: [-0.4, -0.4, 0], rot: [0, 0, 0.5], scaleY: 1.0, radius: 0.05 },
      right: { pos: [0.4, -0.4, 0], rot: [0, 0, -0.5], scaleY: 1.0, radius: 0.05 }
    },
    l2: {
      ll: { pos: [-1.0, 0.4, 0], rot: [0, 0, 0.9], scaleY: 0.8, radius: 0.03 },
      lr: { pos: [-0.2, 0.4, 0], rot: [0, 0, 0.1], scaleY: 0.8, radius: 0.03 },
      rl: { pos: [0.2, 0.4, 0], rot: [0, 0, -0.1], scaleY: 0.8, radius: 0.03 },
      rr: { pos: [1.0, 0.4, 0], rot: [0, 0, -0.9], scaleY: 0.8, radius: 0.03 }
    }
  };

  // Leaves coords (at the tips of the 4 second level branches)
  const leavesCoords = useMemo(() => [
    [-1.6, 0.8, 0],
    [-0.3, 0.8, 0],
    [0.3, 0.8, 0],
    [1.6, 0.8, 0]
  ], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const sp = scrollProgressRef.current;

    // Savings Tree section is at y = -16 (Section 6). Active when sp >= 4.2.
    // Transition in between 4.2 and 5.0. No transition out as it is the final section.
    let visibility = 0;
    if (sp >= 4.2) {
      visibility = Math.min(1.0, (sp - 4.2) / 0.8);
    }

    groupRef.current.position.y = -16 + (1 - visibility) * -2;
    
    // Slow rotational float
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.15;

    // Sequential Growth Logic:
    // 1. Trunk grows (0.0 to 0.3 visibility)
    const trunkG = Math.min(1.0, Math.max(0.001, visibility / 0.3));
    if (trunkRef.current) {
      trunkRef.current.scale.y = trunkG * treeConfig.trunk.scaleY;
      trunkRef.current.position.y = -1.8 + (trunkRef.current.scale.y / 2);
    }

    // 2. L1 branches grow (0.3 to 0.7 visibility)
    const l1G = Math.min(1.0, Math.max(0.001, (visibility - 0.3) / 0.4));
    if (branchL1_L.current && branchL1_R.current) {
      branchL1_L.current.scale.y = l1G * treeConfig.l1.left.scaleY;
      branchL1_R.current.scale.y = l1G * treeConfig.l1.right.scaleY;
      
      // Calculate branching Y anchor based on trunk height
      const trunkTopY = -1.8 + (trunkG * treeConfig.trunk.scaleY);
      
      branchL1_L.current.position.set(-0.25 * l1G, trunkTopY + (0.3 * l1G), 0);
      branchL1_R.current.position.set(0.25 * l1G, trunkTopY + (0.3 * l1G), 0);
    }

    // 3. L2 branches grow (0.6 to 0.9 visibility)
    const l2G = Math.min(1.0, Math.max(0.001, (visibility - 0.6) / 0.3));
    if (branchL2_LL.current && branchL2_LR.current && branchL2_RL.current && branchL2_RR.current) {
      branchL2_LL.current.scale.y = l2G * treeConfig.l2.ll.scaleY;
      branchL2_LR.current.scale.y = l2G * treeConfig.l2.lr.scaleY;
      branchL2_RL.current.scale.y = l2G * treeConfig.l2.rl.scaleY;
      branchL2_RR.current.scale.y = l2G * treeConfig.l2.rr.scaleY;

      const l1TopY_L = branchL1_L.current ? branchL1_L.current.position.y + (Math.cos(treeConfig.l1.left.rot[2]) * branchL1_L.current.scale.y * 0.5) : -0.8;
      const l1TopX_L = branchL1_L.current ? branchL1_L.current.position.x - (Math.sin(treeConfig.l1.left.rot[2]) * branchL1_L.current.scale.y * 0.5) : -0.6;
      
      const l1TopY_R = branchL1_R.current ? branchL1_R.current.position.y + (Math.cos(treeConfig.l1.right.rot[2]) * branchL1_R.current.scale.y * 0.5) : -0.8;
      const l1TopX_R = branchL1_R.current ? branchL1_R.current.position.x + (Math.sin(Math.abs(treeConfig.l1.right.rot[2])) * branchL1_R.current.scale.y * 0.5) : 0.6;

      branchL2_LL.current.position.set(l1TopX_L - (0.2 * l2G), l1TopY_L + (0.2 * l2G), 0);
      branchL2_LR.current.position.set(l1TopX_L + (0.1 * l2G), l1TopY_L + (0.25 * l2G), 0);
      
      branchL2_RL.current.position.set(l1TopX_R - (0.1 * l2G), l1TopY_R + (0.25 * l2G), 0);
      branchL2_RR.current.position.set(l1TopX_R + (0.2 * l2G), l1TopY_R + (0.2 * l2G), 0);
    }

    // 4. Leaves scale up & pulse (0.8 to 1.0 visibility)
    const leavesG = Math.min(1.0, Math.max(0.001, (visibility - 0.8) / 0.2));
    if (leavesRef.current) {
      leavesRef.current.children.forEach((leaf, idx) => {
        const pulse = 1.0 + Math.sin(time * 2.5 + idx) * 0.12; // breathing light effect
        leaf.scale.setScalar(leavesG * 0.3 * pulse);
        
        // Position leaves relative to branch tips
        if (idx === 0 && branchL2_LL.current) {
          const tipY = branchL2_LL.current.position.y + (Math.cos(treeConfig.l2.ll.rot[2]) * branchL2_LL.current.scale.y * 0.5);
          const tipX = branchL2_LL.current.position.x - (Math.sin(treeConfig.l2.ll.rot[2]) * branchL2_LL.current.scale.y * 0.5);
          leaf.position.set(tipX, tipY, 0);
        } else if (idx === 1 && branchL2_LR.current) {
          const tipY = branchL2_LR.current.position.y + (Math.cos(treeConfig.l2.lr.rot[2]) * branchL2_LR.current.scale.y * 0.5);
          const tipX = branchL2_LR.current.position.x - (Math.sin(treeConfig.l2.lr.rot[2]) * branchL2_LR.current.scale.y * 0.5);
          leaf.position.set(tipX, tipY, 0);
        } else if (idx === 2 && branchL2_RL.current) {
          const tipY = branchL2_RL.current.position.y + (Math.cos(treeConfig.l2.rl.rot[2]) * branchL2_RL.current.scale.y * 0.5);
          const tipX = branchL2_RL.current.position.x + (Math.sin(Math.abs(treeConfig.l2.rl.rot[2])) * branchL2_RL.current.scale.y * 0.5);
          leaf.position.set(tipX, tipY, 0);
        } else if (idx === 3 && branchL2_RR.current) {
          const tipY = branchL2_RR.current.position.y + (Math.cos(treeConfig.l2.rr.rot[2]) * branchL2_RR.current.scale.y * 0.5);
          const tipX = branchL2_RR.current.position.x + (Math.sin(Math.abs(treeConfig.l2.rr.rot[2])) * branchL2_RR.current.scale.y * 0.5);
          leaf.position.set(tipX, tipY, 0);
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, -16, 0]}>
      {/* Trunk */}
      <mesh ref={trunkRef} position={[0, -1.8, 0]}>
        <cylinderGeometry args={[treeConfig.trunk.radius * 0.7, treeConfig.trunk.radius, 1, 16]} />
        <meshStandardMaterial
          color="#00f5a0"
          emissive="#0055ff"
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Level 1 Left */}
      <mesh ref={branchL1_L} rotation={treeConfig.l1.left.rot}>
        <cylinderGeometry args={[treeConfig.l1.left.radius * 0.7, treeConfig.l1.left.radius, 1, 16]} />
        <meshStandardMaterial
          color="#00f5a0"
          emissive="#0055ff"
          emissiveIntensity={0.7}
          roughness={0.1}
        />
      </mesh>

      {/* Level 1 Right */}
      <mesh ref={branchL1_R} rotation={treeConfig.l1.right.rot}>
        <cylinderGeometry args={[treeConfig.l1.right.radius * 0.7, treeConfig.l1.right.radius, 1, 16]} />
        <meshStandardMaterial
          color="#00f5a0"
          emissive="#0055ff"
          emissiveIntensity={0.7}
          roughness={0.1}
        />
      </mesh>

      {/* Level 2 Left-Left */}
      <mesh ref={branchL2_LL} rotation={treeConfig.l2.ll.rot}>
        <cylinderGeometry args={[treeConfig.l2.ll.radius * 0.7, treeConfig.l2.ll.radius, 1, 8]} />
        <meshStandardMaterial color="#00f5a0" emissive="#00d2ff" emissiveIntensity={0.8} />
      </mesh>

      {/* Level 2 Left-Right */}
      <mesh ref={branchL2_LR} rotation={treeConfig.l2.lr.rot}>
        <cylinderGeometry args={[treeConfig.l2.lr.radius * 0.7, treeConfig.l2.lr.radius, 1, 8]} />
        <meshStandardMaterial color="#00f5a0" emissive="#00d2ff" emissiveIntensity={0.8} />
      </mesh>

      {/* Level 2 Right-Left */}
      <mesh ref={branchL2_RL} rotation={treeConfig.l2.rl.rot}>
        <cylinderGeometry args={[treeConfig.l2.rl.radius * 0.7, treeConfig.l2.rl.radius, 1, 8]} />
        <meshStandardMaterial color="#00f5a0" emissive="#00d2ff" emissiveIntensity={0.8} />
      </mesh>

      {/* Level 2 Right-Right */}
      <mesh ref={branchL2_RR} rotation={treeConfig.l2.rr.rot}>
        <cylinderGeometry args={[treeConfig.l2.rr.radius * 0.7, treeConfig.l2.rr.radius, 1, 8]} />
        <meshStandardMaterial color="#00f5a0" emissive="#00d2ff" emissiveIntensity={0.8} />
      </mesh>

      {/* Growing Glowing Leaves */}
      <group ref={leavesRef}>
        {leavesCoords.map((_, idx) => (
          <mesh key={idx}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color="#00f5a0"
              emissive="#00f5a0"
              emissiveIntensity={1.8}
              roughness={0.1}
            />
            <pointLight color="#00f5a0" intensity={1.5} distance={2.0} decay={2} />
          </mesh>
        ))}
      </group>

      {/* Growth summary label */}
      <Html distanceFactor={6} position={[0, 1.6, 0]} center>
        <div className="glass-panel text-center" style={{
          padding: '0.6rem 1.2rem',
          borderRadius: '12px',
          border: '1px solid rgba(0, 245, 160, 0.3)',
          background: 'rgba(5, 5, 12, 0.85)',
          boxShadow: '0 8px 32px rgba(0, 245, 160, 0.15)',
          whiteSpace: 'nowrap'
        }}>
          <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Wealth Growth</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00f5a0' }}>₹12,95,000</div>
          <div style={{ fontSize: '0.6rem', color: '#00d2ff', fontWeight: 600 }}>Compound Annual Yield 14.8%</div>
        </div>
      </Html>
    </group>
  );
};

export default CrystalTree3D;
