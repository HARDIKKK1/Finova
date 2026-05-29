import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import FinanceCanvas from './components/FinanceCanvas';
import OverlayUI from './components/OverlayUI';
import LoginCanvas from './components/LoginCanvas';
import LoginUI from './components/LoginUI';
import DashboardCanvas from './components/DashboardCanvas';
import DashboardUI from './components/DashboardUI';
import { auth } from './firebase';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  // View states: 'landing' | 'login' | 'dashboard'
  const [currentView, setCurrentView] = useState('landing');
  const scrollProgressRef = useRef(0);

  // States for the 3D Login Page interactions
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check auth state on load
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('landing');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Scroll handling is only needed on 'landing' and 'dashboard' views
    if (currentView === 'login') return;

    // 1. Initialize Lenis Smooth Scrolling
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
    const sectionsCount = currentView === 'landing' ? 5 : 4; // landing has 6 sections (0-5), dashboard has 5 (0-4)
    
    const trigger = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        // Map scroll percentage to view sections range
        scrollProgressRef.current = self.progress * sectionsCount;
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
    // Reset login interaction flags
    setIsTyping(false);
    setIsSubmitting(false);
    setIsSuccess(false);
    
    // Auth state listener handles redirect, but set to dashboard explicitly to guarantee visual transition
    setCurrentView('dashboard');
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setCurrentView('landing');
    } catch (err) {
      console.error("Sign out failed", err);
    }
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
      ) : currentView === 'login' ? (
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
      ) : (
        <>
          {/* Dashboard Page WebGL Layer */}
          <DashboardCanvas scrollProgressRef={scrollProgressRef} />

          {/* HTML Dashboard UI Overlay */}
          <DashboardUI onSignOut={handleSignOut} />
        </>
      )}
    </>
  );
}

export default App;
