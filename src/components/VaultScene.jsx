import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import HoloWidgets3D from './HoloWidgets3D';

const VaultScene = ({ isTyping, isSubmitting, isSuccess, onSuccessAnimComplete }) => {
  const { camera } = useThree();
  const vaultRef = useRef();
  const innerRef = useRef();
  
  // Vault Combo Lock Rings references
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  
  // Timing trackers
  const successTime = useRef(0);
  const isCompleteTriggered = useRef(false);

  // Background data streams/particles configuration
  const count = 600;
  const [positions, speeds, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spds = new Float32Array(count);
    const cols = new Float32Array(count * 3);
    
    const palette = [
      new THREE.Color("#00e5ff"), // Electric Blue
      new THREE.Color("#00ffb2"), // Success Green
      new THREE.Color("#7b61ff")  // Accent Purple
    ];

    for (let i = 0; i < count; i++) {
      // Cylindrical flow
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 8;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      
      spds[i] = 0.05 + Math.random() * 0.15;
      
      const c = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    return [pos, spds, cols];
  }, []);

  const particlesRef = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    
    // 1. Slow default rotations of the central Vault
    if (vaultRef.current && !isSuccess) {
      vaultRef.current.rotation.y = time * 0.15;
      
      // Focus/typing shifts: subtle extra rotation when typing
      const targetSpeed = isTyping ? 0.35 : 0.05;
      innerRef.current.rotation.y += targetSpeed * 0.05;
      innerRef.current.rotation.x = Math.sin(time) * 0.2;
    }

    // 2. Animate combination lock rings
    if (ring1Ref.current && ring2Ref.current && ring3Ref.current) {
      if (isSuccess) {
        // Spin lock combination rings at extreme speeds during unlock!
        ring1Ref.current.rotation.y += delta * 12.0;
        ring2Ref.current.rotation.x -= delta * 10.0;
        ring3Ref.current.rotation.z += delta * 15.0;
      } else if (isSubmitting) {
        // Spin fast during credentials validation
        ring1Ref.current.rotation.y += delta * 4.0;
        ring2Ref.current.rotation.x -= delta * 3.5;
        ring3Ref.current.rotation.z += delta * 5.0;
      } else {
        // Normal slow atmospheric rotation
        ring1Ref.current.rotation.y += delta * 0.4;
        ring2Ref.current.rotation.x -= delta * 0.3;
        ring3Ref.current.rotation.z += delta * 0.2;
      }
    }

    // 3. Animate background data streams
    if (particlesRef.current) {
      const posArr = particlesRef.current.geometry.attributes.position.array;
      const speedMultiplier = isSuccess ? 8.0 : isTyping ? 2.5 : 1.0;
      
      for (let i = 0; i < count; i++) {
        const idxY = i * 3 + 1;
        posArr[idxY] -= speeds[i] * 0.05 * speedMultiplier; // flow downwards
        
        // Reset if it flows out of bound
        if (posArr[idxY] < -8) {
          posArr[idxY] = 8;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Camera control & Success Flight transition
    if (isSuccess) {
      successTime.current += delta;
      
      // Accelerate camera straight through the center of the vault!
      // Start camera position at [0, 0, 7]. We want it to dolly to [0, 0, -5] (passing through the sphere at z=0)
      const t = Math.min(1.0, successTime.current / 2.2); // 2.2 second transition
      
      // Exponential curve for rapid camera acceleration flight feel
      const easeT = Math.pow(t, 3.5);
      const camZ = THREE.MathUtils.lerp(7.0, -4.5, easeT);
      camera.position.z = camZ;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, t);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, t);
      camera.lookAt(0, 0, -10);

      // Make Vault Core scale outward (split open visual)
      if (vaultRef.current) {
        vaultRef.current.scale.setScalar(THREE.MathUtils.lerp(1.0, 4.5, easeT));
      }
      
      // Trigger success callback at 90% of transition
      if (t >= 0.9 && !isCompleteTriggered.current) {
        isCompleteTriggered.current = true;
        onSuccessAnimComplete();
      }
    } else {
      // Normal camera controls (subtle mouse feedback)
      const mouseParallaxX = state.mouse.x * 0.35;
      const mouseParallaxY = state.mouse.y * 0.35;
      
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseParallaxX, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouseParallaxY, 0.05);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 7.0, 0.05);
      
      // In Desktop view, the form is on the left, so we offset camera target to center-left slightly
      // to balance the composition with the widgets on the right.
      camera.lookAt(-0.6, 0, 0);
    }
  });

  return (
    <group>
      {/* Background cashflow data stream particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.45}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Central 3D Vault Sphere (Centered, slightly shifted to left to avoid blocking input card in desktop) */}
      <group position={[-1.2, 0, 0]} ref={vaultRef}>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          {/* Main Sphere Outer Shell */}
          <mesh>
            <sphereGeometry args={[1.1, 48, 48]} />
            <meshPhysicalMaterial
              color="#050816"
              emissive="#00e5ff"
              emissiveIntensity={isSuccess ? 2.5 : isSubmitting ? 1.2 : 0.25}
              roughness={0.05}
              metalness={0.95}
              transmission={0.45}
              thickness={0.5}
              clearcoat={1.0}
            />
          </mesh>

          {/* Inner core wireframe combination lock */}
          <mesh ref={innerRef}>
            <octahedronGeometry args={[0.7, 2]} />
            <meshBasicMaterial
              color={isSuccess ? "#00ffb2" : "#7b61ff"}
              wireframe
              transparent
              opacity={0.6}
            />
          </mesh>

          {/* Combination Lock Ring 1 */}
          <mesh ref={ring1Ref} rotation={[0.4, 0, 0]}>
            <torusGeometry args={[1.4, 0.035, 8, 48]} />
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} />
          </mesh>

          {/* Combination Lock Ring 2 (Vertical orientation) */}
          <mesh ref={ring2Ref} rotation={[0, Math.PI / 2, 0.2]}>
            <torusGeometry args={[1.55, 0.035, 8, 48]} />
            <meshBasicMaterial color="#7b61ff" transparent opacity={0.5} />
          </mesh>

          {/* Combination Lock Ring 3 (Horizontal orientation) */}
          <mesh ref={ring3Ref} rotation={[Math.PI / 2, 0.1, 0]}>
            <torusGeometry args={[1.7, 0.035, 8, 48]} />
            <meshBasicMaterial color="#00ffb2" transparent opacity={0.5} />
          </mesh>
        </Float>
      </group>

      {/* Floating Holographic Dashboard Widgets (Right-side of scene) */}
      <HoloWidgets3D isSuccess={isSuccess} />
    </group>
  );
};

export default VaultScene;
