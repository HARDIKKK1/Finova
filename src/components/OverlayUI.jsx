import React from 'react';
import { ArrowRight, Play, Shield, Compass, Landmark, PieChart, Sparkles } from 'lucide-react';

const OverlayUI = () => {
  return (
    <div className="ui-wrapper">
      {/* Navigation Bar */}
      <nav className="nav-container ui-interactive">
        <div className="logo">
          <div className="logo-dot" />
          <span>Finova</span>
        </div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#analytics">Analytics</a></li>
          <li><a href="#security">Security</a></li>
        </ul>
        <a href="#launch" className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
          Launch App
        </a>
      </nav>

      {/* SECTION 1: HERO */}
      <section id="hero">
        <div className="hero-content ui-interactive">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
            <Sparkles size={14} className="text-[#00d2ff]" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e5e7eb', letterSpacing: '1px', textTransform: 'uppercase' }}>Introducing Finova 2.0</span>
          </div>
          <h1 className="title-gradient">Take Control of Every Rupee.</h1>
          <p>
            Track expenses, visualize spending patterns, and grow your savings with an intelligent, futuristic finance dashboard.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Start Tracking <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Play size={16} fill="white" /> Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: DASHBOARD */}
      <section id="dashboard" style={{ alignItems: 'flex-start' }}>
        <div className="glass-panel ui-interactive" style={{ padding: '2.5rem', maxWidth: '480px', margin: 'auto 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#00f5a0' }}>
            <Landmark size={22} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Financial Command Center</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.5px' }}>
            All-in-One Dashboard
          </h2>
          <p style={{ color: '#9ca3af', lineHeight: '1.6', fontSize: '1rem' }}>
            Your cash, assets, and liabilities unified in a singular interface. Holographic panels align dynamically to show your net worth, overhead burn rates, and savings buffers in real-time.
          </p>
        </div>
      </section>

      {/* SECTION 3: TIMELINE */}
      <section id="timeline" style={{ alignItems: 'flex-end' }}>
        <div className="glass-panel ui-interactive" style={{ padding: '2.5rem', maxWidth: '480px', margin: 'auto 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#00d2ff' }}>
            <Compass size={22} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Fluid Tracking</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Cinematic Stream
          </h2>
          <p style={{ color: '#9ca3af', lineHeight: '1.6', fontSize: '1rem' }}>
            Every transactions flows as a glowing signal along your timeline. Visualize financial speed, see instant transaction details, and identify anomalies as they occur.
          </p>
        </div>
      </section>

      {/* SECTION 4: ANALYTICS */}
      <section id="analytics-section" style={{ alignItems: 'flex-start' }}>
        <div className="glass-panel ui-interactive" style={{ padding: '2.5rem', maxWidth: '480px', margin: 'auto 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#ff4b72' }}>
            <PieChart size={22} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Budget Control</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Spending Analytics
          </h2>
          <p style={{ color: '#9ca3af', lineHeight: '1.6', fontSize: '1rem' }}>
            Intelligent classification filters your spending into structured concentric categories. Get a clear graphical balance of needs vs. wants and isolate leakages instantly.
          </p>
        </div>
      </section>

      {/* SECTION 5: PIPELINES */}
      <section id="pipelines" style={{ alignItems: 'flex-end' }}>
        <div className="glass-panel ui-interactive" style={{ padding: '2.5rem', maxWidth: '480px', margin: 'auto 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#bd00ff' }}>
            <Landmark size={22} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Neon Routing</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Interactive Cashflow
          </h2>
          <p style={{ color: '#9ca3af', lineHeight: '1.6', fontSize: '1rem' }}>
            Observe energy streams of salary, side gigs, and equity routing into the vault. Custom routing automatically branches money into saving rings, tax buffers, and assets.
          </p>
        </div>
      </section>

      {/* SECTION 6: CRYSTAL TREE */}
      <section id="savings" style={{ alignItems: 'center', textAlign: 'center' }}>
        <div className="glass-panel ui-interactive" style={{ padding: '3rem', maxWidth: '640px', margin: 'auto 0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#00f5a0' }}>
            <Shield size={22} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Wealth Creation</span>
          </div>
          <h2 className="green-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-1px' }}>
            Growing Savings Tree
          </h2>
          <p style={{ color: '#9ca3af', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '2rem' }}>
            Your wealth is alive. Automated round-ups and interest compounding trigger growth nodes on your crystal tree. Watch your savings blossom as your financial discipline grows.
          </p>
          <button className="btn btn-primary btn-primary-green" style={{
            background: 'linear-gradient(135deg, #00f5a0 0%, #00d2ff 100%)',
            boxShadow: '0 0 20px rgba(0, 245, 160, 0.3)',
            fontWeight: 800
          }}>
            Secure Your Future Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default OverlayUI;
