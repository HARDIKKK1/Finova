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
import TransactionsCanvas from './components/TransactionsCanvas';
import TransactionsUI from './components/TransactionsUI';
import { auth } from './firebase';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  // View states: 'landing' | 'login' | 'dashboard' | 'transactions'
  const [currentView, setCurrentView] = useState('landing');
  const scrollProgressRef = useRef(0);

  // States for the 3D Login Page interactions
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // States for the 3D Transactions Page filters & actions
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Check auth state on load
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // If logged in, send them to dashboard unless they specifically want to go to transactions
        setCurrentView((prev) => (prev === 'transactions' ? 'transactions' : 'dashboard'));
      } else {
        setCurrentView('landing');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Scroll handling is only needed on 'landing', 'dashboard', and 'transactions' views
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
    // Landing has 6 sections (0-5), Dashboard has 5 (0-4), Transactions has 2 (0-1)
    const sectionsCount = currentView === 'landing' ? 5 : currentView === 'dashboard' ? 4 : 1;
    
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
    setIsTyping(false);
    setIsSubmitting(false);
    setIsSuccess(false);
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

  const handleExportTrigger = () => {
    setIsExporting(true);
  };

  const handleExportAnimComplete = () => {
    setIsExporting(false);
    // Trigger mock CSV download
    const csvContent = "data:text/csv;charset=utf-8,ID,Title,Amount,Category,Date,Status,Method\n1,Employer Salary,₹120000,Salary,May 25,Success,NEFT\n2,Luxe Apartment Rent,₹22000,Bills,May 26,Success,UPI\n3,HDFC Fund SIP,₹15000,Education,May 27,Success,ACH\n4,Amazon Prime Sub,₹1200,Entertainment,May 28,Success,Card\n5,Freelance Work,₹7500,Salary,May 28,Success,UPI\n6,Dhaba Dining,₹1450,Food,May 29,Success,Cash";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "finova_transactions_ledger.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      ) : currentView === 'dashboard' ? (
        <>
          {/* Dashboard Page WebGL Layer */}
          <DashboardCanvas scrollProgressRef={scrollProgressRef} />

          {/* HTML Dashboard UI Overlay */}
          <DashboardUI 
            onSignOut={handleSignOut} 
            onNavigateTransactions={() => setCurrentView('transactions')}
          />
        </>
      ) : (
        <>
          {/* Transactions Page WebGL Layer */}
          <TransactionsCanvas
            scrollProgressRef={scrollProgressRef}
            searchQuery={searchQuery}
            selectedType={selectedType}
            selectedCategory={selectedCategory}
            onSelectTransaction={setSelectedTransaction}
            isExporting={isExporting}
            onExportAnimComplete={handleExportAnimComplete}
          />

          {/* HTML Transactions UI Overlay */}
          <TransactionsUI
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedTransaction={selectedTransaction}
            setSelectedTransaction={setSelectedTransaction}
            onExportTrigger={handleExportTrigger}
            isExporting={isExporting}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        </>
      )}
    </>
  );
}

export default App;
