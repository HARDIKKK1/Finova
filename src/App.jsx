import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import FinanceCanvas from './components/FinanceCanvas';
import OverlayUI from './components/OverlayUI';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scrolling
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential deceleration
      smoothWheel: true,
      wheelMultiplier: 1.1,
      infinite: false,
    });

    // Connect Lenis to requestAnimationFrame
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger with Lenis scroll updates
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Set up GSAP ScrollTrigger to track scroll progress
    // The landing page has 6 sections, mapping scroll from 0.0 to 5.0
    const trigger = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        // self.progress ranges from 0 (top) to 1 (bottom)
        // Map this to a 0-5 float representing our 3D sections
        scrollProgressRef.current = self.progress * 5;
      }
    });

    // Cleanup on unmount
    return () => {
      lenis.destroy();
      trigger.kill();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <>
      {/* 3D WebGL Canvas Layer */}
      <FinanceCanvas scrollProgressRef={scrollProgressRef} />

      {/* Aesthetic ambient glow orbs behind text panels */}
      <div className="glow-orb glow-orb-purple" />
      <div className="glow-orb glow-orb-blue" />

      {/* HTML Interface Overlay Layer */}
      <OverlayUI />
    </>
  );
}

export default App;
