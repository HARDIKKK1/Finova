import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import FinanceCanvas from './components/FinanceCanvas';
import OverlayUI from './components/OverlayUI';
import LoginCanvas from './components/LoginCanvas';
import LoginUI from './components/LoginUI';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  // Simple state router: 'landing' | 'login'
  const [currentView, setCurrentView] = useState('landing');
  const scrollProgressRef = useRef(0);

  // States for the 3D Login Page interactions
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (currentView !== 'landing') return;

    // 1. Initialize Lenis Smooth Scrolling (Only active on Landing Page)
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      infinite: false,
    });

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
    const trigger = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress * 5;
      }
    });

    // Cleanup
    return () => {
      lenis.destroy();
      trigger.kill();
      gsap.ticker.remove(lenis.raf);
    };
  }, [currentView]);

  const handleLoginSuccessComplete = () => {
    // Reset login states
    setIsTyping(false);
    setIsSubmitting(false);
    setIsSuccess(false);
    // Transition back to main app dashboard (landing page)
    setCurrentView('landing');
  };

  return (
    <>
      {currentView === 'landing' ? (
        <>
          {/* Landing Page WebGL Layer */}
          <FinanceCanvas scrollProgressRef={scrollProgressRef} />

          {/* Ambient glow decoration orbs */}
          <div className="glow-orb glow-orb-purple" />
          <div className="glow-orb glow-orb-blue" />

          {/* HTML Landing UI Overlay */}
          <OverlayUI onLaunchApp={() => setCurrentView('login')} />
        </>
      ) : (
        <>
          {/* Login Page WebGL Layer */}
          <LoginCanvas
            isTyping={isTyping}
            isSubmitting={isSubmitting}
            isSuccess={isSuccess}
            onSuccessAnimComplete={handleLoginSuccessComplete}
          />

          {/* HTML Login UI Overlay */}
          <LoginUI
            setIsTyping={setIsTyping}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            isSuccess={isSuccess}
            setIsSuccess={setIsSuccess}
            onBackToLanding={() => setCurrentView('landing')}
          />
        </>
      )}
    </>
  );
}

export default App;
