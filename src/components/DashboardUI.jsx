import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, User, Plus, FileText, PieChart, Sparkles, 
  BrainCircuit, ShieldAlert, BadgeAlert, Award, LogOut 
} from 'lucide-react';

const DashboardUI = ({ onSignOut, onNavigateTransactions }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  const notifications = [
    { text: "Budget Alert: Shopping is at 95% of monthly threshold.", type: "alert", color: "#ff5f6d" },
    { text: "Milestone: You saved ₹15,000 in your SIP buffer.", type: "milestone", color: "#00ffb2" },
    { text: "New Log: Spotify premium renewal ₹179 deducted.", type: "log", color: "#00e5ff" }
  ];

  const insights = [
    { text: "Your food expenses increased by 18% this month.", color: "#ff5f6d" },
    { text: "You saved 22% more compared to last month.", color: "#00ffb2" },
    { text: "Travel spending remains within budget.", color: "#00e5ff" }
  ];

  return (
    <div className="ui-wrapper">
      {/* Floating Header Navigation */}
      <nav className="nav-container ui-interactive">
        <div className="logo">
          <div className="logo-dot" />
          <span>Finova</span>
          <span className="text-[0.65rem] font-bold tracking-widest text-[#7b61ff] border border-[#7b61ff]/30 px-1.5 py-0.5 rounded ml-2 uppercase">Command Center</span>
        </div>
        
        <ul className="nav-links hidden md:flex items-center gap-6">
          <li><a href="#hero" className="hover:text-white transition-colors">Overview</a></li>
          <li><a href="#galaxy" className="hover:text-white transition-colors">Galaxy</a></li>
          <li>
            <button 
              onClick={onNavigateTransactions} 
              className="hover:text-white cursor-pointer transition-colors bg-transparent border-none text-[0.95rem] font-semibold text-[#9ca3af] p-0"
            >
              Transactions
            </button>
          </li>
          <li>
            <button 
              onClick={onNavigateTransactions} 
              className="hover:text-white cursor-pointer transition-colors bg-transparent border-none text-[0.95rem] font-semibold text-[#9ca3af] p-0"
            >
              Analytics
            </button>
          </li>
          <li><a href="#insights" className="hover:text-white transition-colors">Insights</a></li>
        </ul>

        <div className="flex items-center gap-4">
          {/* Notifications Trigger */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-400 hover:text-white rounded-full bg-white/5 border border-white/8 hover:border-white/15 transition-all cursor-pointer"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ff5f6d] rounded-full shadow-[0_0_8px_#ff5f6d]" />
          </button>

          {/* User Profile Avatar with rotating ring */}
          <a href="#insights" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 flex items-center justify-center rounded-full bg-[#7b61ff]/10 border border-[#7b61ff]/30">
              <User size={18} className="text-[#00e5ff]" />
              <div className="absolute inset-0 rounded-full border border-dashed border-[#00e5ff]/50 group-hover:rotate-180 transition-transform duration-1000" />
            </div>
          </a>

          {/* Sign Out */}
          <button 
            onClick={onSignOut}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Floating Notifications Hub Card */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed top-24 right-[10%] w-[320px] bg-[#050816]/90 border border-white/8 rounded-[20px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 backdrop-blur-md ui-interactive"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Alerts Ledger</h4>
              <button 
                onClick={() => setShowNotifications(false)} 
                className="text-xs text-gray-400 hover:text-white"
              >
                Dismiss
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {notifications.map((notif, idx) => (
                <div 
                  key={idx} 
                  className="flex gap-3 items-start p-2.5 rounded-xl bg-white/5 border border-white/5"
                  style={{ borderLeft: `3px solid ${notif.color}` }}
                >
                  {notif.type === 'alert' ? (
                    <ShieldAlert size={16} style={{ color: notif.color }} className="shrink-0 mt-0.5" />
                  ) : (
                    <BadgeAlert size={16} style={{ color: notif.color }} className="shrink-0 mt-0.5" />
                  )}
                  <span className="text-[0.7rem] leading-relaxed text-gray-300">{notif.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 1: HERO OVERVIEW */}
      <section id="hero">
        <div className="hero-content text-center max-w-[800px] mt-16">
          <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/8 px-4 py-1.5 rounded-full mb-6 text-sm font-semibold tracking-wider text-[#00e5ff] uppercase">
            <Sparkles size={14} /> Unified Financial Ecosystem
          </div>
          
          {/* Scroll instruction indicator */}
          <div className="mt-40 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest animate-pulse">
              Scroll to explore the financial galaxy
            </p>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#00e5ff] to-transparent mx-auto mt-3" />
          </div>
        </div>
      </section>

      {/* SECTION 2: GALAXY */}
      <section id="galaxy" className="items-start">
        <div className="glass-panel ui-interactive p-8 max-w-[440px] my-auto">
          <div className="flex items-center gap-2 mb-3 text-[#7b61ff]">
            <BrainCircuit size={22} />
            <span className="text-xs font-bold uppercase tracking-wider">Financial Universe</span>
          </div>
          <h2 className="text-white text-3xl font-extrabold mb-3 tracking-tight font-display">
            Spending Category Galaxy
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Navigate through your monthly expenditure. Planets represent major categories (Food, Travel, Bills, Shopping). Planet scale correlates with total spent.
          </p>
          <div className="text-xs text-gray-500 italic">
            👉 Hover over planets in space to inspect transaction sizes, percentages, and performance indicators.
          </div>
        </div>
      </section>

      {/* SECTION 3: TIMELINE */}
      <section id="timeline" className="items-end">
        <div className="glass-panel ui-interactive p-8 max-w-[440px] my-auto">
          <div className="flex items-center gap-2 mb-3 text-[#00ffb2]">
            <Sparkles size={22} />
            <span className="text-xs font-bold uppercase tracking-wider">Interactive Timeline</span>
          </div>
          <h2 className="text-white text-3xl font-extrabold mb-3 tracking-tight font-display">
            Winding Data Stream
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your transactions exist as nodes floating along a chronological neon pipeline in deep space. Observe deposits and debits passing from the ledger in real-time.
          </p>
        </div>
      </section>

      {/* SECTION 4: ANALYTICS */}
      <section id="analytics" className="items-start">
        <div className="glass-panel ui-interactive p-8 max-w-[440px] my-auto">
          <div className="flex items-center gap-2 mb-3 text-[#00e5ff]">
            <PieChart size={22} />
            <span className="text-xs font-bold uppercase tracking-wider">Holographic Room</span>
          </div>
          <h2 className="text-white text-3xl font-extrabold mb-3 tracking-tight font-display">
            Analytics Chamber
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Witness your budgets transform into glowing 3D structures. On the left, monthly income trends wind through space. On the right, concentric budget allocation rings spin in sync.
          </p>
        </div>
      </section>

      {/* SECTION 5: INSIGHTS & PROFILE */}
      <section id="insights" className="flex flex-col md:flex-row gap-8 justify-center items-center">
        
        {/* Profile & achievements */}
        <div className="glass-panel ui-interactive p-8 w-full max-w-[420px] shrink-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-[#7b61ff]/10 border-2 border-[#00e5ff] flex items-center justify-center text-white font-black text-xl">
              SA
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Sachin Agarwal</h3>
              <p className="text-xs text-gray-400">Node Operator: #9084</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1.5">
              <span>Monthly Goal Buffer</span>
              <span className="text-[#00ffb2]">82%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-[#7b61ff] to-[#00ffb2]" style={{ width: '82%' }} />
            </div>
            <div className="flex justify-between text-[0.65rem] text-gray-500 mt-1">
              <span>Buffer: ₹82,000</span>
              <span>Goal: ₹1,00,000</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Trophy Badges</h4>
            <div className="flex gap-2">
              <span className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/8 text-[#00ffb2] flex items-center gap-1.5" title="Budget Master">
                <Award size={12} /> Budget Master
              </span>
              <span className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/8 text-[#00e5ff] flex items-center gap-1.5" title="Savings Star">
                <Award size={12} /> Savings Star
              </span>
            </div>
          </div>
        </div>

        {/* AI insights container */}
        <div className="glass-panel ui-interactive p-8 w-full max-w-[420px]">
          <div className="flex items-center gap-2 mb-4 text-[#00ffb2]">
            <BrainCircuit size={22} />
            <span className="text-xs font-bold uppercase tracking-wider">AI Assistant</span>
          </div>
          <h3 className="text-white text-xl font-extrabold mb-4 font-display">Holographic Analysis</h3>
          <div className="flex flex-col gap-3">
            {insights.map((item, idx) => (
              <div 
                key={idx} 
                className="p-3 bg-black/40 border border-white/5 rounded-xl flex gap-3 text-xs leading-relaxed text-gray-300"
              >
                <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Bottom Quick Actions Dock */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/70 border border-white/8 px-6 py-3 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md z-50 ui-interactive">
        <button 
          onClick={() => alert("Action triggered: Add Transaction")}
          className="text-xs font-bold text-white hover:text-[#00ffb2] transition-colors flex items-center gap-1.5 uppercase cursor-pointer"
        >
          <Plus size={14} className="text-[#00ffb2]" /> Add Log
        </button>
        <div className="w-[1px] h-4 bg-white/10" />
        <button 
          onClick={() => alert("Action triggered: Adjust Targets")}
          className="text-xs font-bold text-white hover:text-[#00e5ff] transition-colors flex items-center gap-1.5 uppercase cursor-pointer"
        >
          <Sparkles size={14} className="text-[#00e5ff]" /> Budget
        </button>
        <div className="w-[1px] h-4 bg-white/10" />
        <button 
          onClick={() => alert("Action triggered: Export Report")}
          className="text-xs font-bold text-white hover:text-[#7b61ff] transition-colors flex items-center gap-1.5 uppercase cursor-pointer"
        >
          <FileText size={14} className="text-[#7b61ff]" /> Export
        </button>
      </div>
    </div>
  );
};

export default DashboardUI;
