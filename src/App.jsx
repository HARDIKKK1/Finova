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
import AddTransactionCanvas from './components/AddTransactionCanvas';
import AddTransactionUI from './components/AddTransactionUI';
import { auth } from './firebase';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  // View states: 'landing' | 'login' | 'dashboard' | 'transactions' | 'add-transaction'
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

  // States for the 3D Add/Edit Transaction Page
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState('expense');
  const [txCategory, setTxCategory] = useState('');
  const [txDate, setTxDate] = useState('');
  const [txNotes, setTxNotes] = useState('');
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check auth state on load
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Safe redirect to active view
        setCurrentView((prev) => 
          prev === 'transactions' || prev === 'add-transaction' ? prev : 'dashboard'
        );
      } else {
        setCurrentView('landing');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Scroll handling is only needed on 'landing', 'dashboard', and 'transactions' views
    if (currentView === 'login' || currentView === 'add-transaction') return;

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
    const sectionsCount = currentView === 'landing' ? 5 : currentView === 'dashboard' ? 4 : 1;
    
    const trigger = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
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

  // Navigate to Add Transaction
  const handleNavigateAddTransaction = () => {
    setIsEditMode(false);
    setTxTitle('');
    setTxAmount('');
    setTxType('expense');
    setTxCategory('');
    setTxDate(new Date().toISOString().split('T')[0]);
    setTxNotes('');
    setCurrentView('add-transaction');
  };

  // Navigate to Edit Transaction
  const handleNavigateEditTransaction = () => {
    if (!selectedTransaction) {
      alert("Please select a transaction node in the timeline list first!");
      return;
    }
    setIsEditMode(true);
    setTxTitle(selectedTransaction.title);
    // Parse numeric value from string
    const rawAmt = selectedTransaction.amount.replace(/[^0-9]/g, '');
    setTxAmount(rawAmt);
    setTxType(selectedTransaction.type);
    setTxCategory(selectedTransaction.category);
    
    // Map human readable dates
    const dateMapping = {
      'May 25': '2026-05-25',
      'May 26': '2026-05-26',
      'May 27': '2026-05-27',
      'May 28': '2026-05-28',
      'May 29': '2026-05-29'
    };
    setTxDate(dateMapping[selectedTransaction.date] || new Date().toISOString().split('T')[0]);
    setTxNotes(selectedTransaction.notes);
    setCurrentView('add-transaction');
  };

  const handleSaveTransaction = () => {
    setIsSaving(true);
  };

  const handleSaveAnimComplete = () => {
    setIsSaving(false);
    setSelectedTransaction(null);
    setCurrentView('transactions');
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
      ) : currentView === 'transactions' ? (
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
            onNavigateAddTransaction={handleNavigateAddTransaction}
            onNavigateEditTransaction={handleNavigateEditTransaction}
          />
        </>
      ) : (
        <>
          {/* Add/Edit Transaction Page WebGL Layer */}
          <AddTransactionCanvas
            amount={txAmount}
            type={txType}
            category={txCategory}
            isSaving={isSaving}
            onSaveComplete={handleSaveAnimComplete}
          />

          {/* HTML Add/Edit Transaction UI Overlay */}
          <AddTransactionUI
            title={txTitle}
            setTitle={setTxTitle}
            amount={txAmount}
            setAmount={setTxAmount}
            type={txType}
            setType={setTxType}
            category={txCategory}
            setCategory={setTxCategory}
            date={txDate}
            setDate={setTxDate}
            notes={txNotes}
            setNotes={setTxNotes}
            isEditMode={isEditMode}
            isSaving={isSaving}
            onSave={handleSaveTransaction}
            onCancel={() => setCurrentView('transactions')}
          />
        </>
      )}
    </>
  );
}

export default App;
