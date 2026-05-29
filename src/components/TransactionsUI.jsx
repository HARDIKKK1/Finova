import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, SlidersHorizontal, Plus, Edit3, Trash2, Download, 
  ArrowLeft, Landmark, DollarSign, Calendar, Tag, ShieldCheck, 
  ArrowRight, Clock, HelpCircle 
} from 'lucide-react';

const TransactionsUI = ({ 
  searchQuery, setSearchQuery,
  selectedType, setSelectedType,
  selectedCategory, setSelectedCategory,
  selectedTransaction, setSelectedTransaction,
  onExportTrigger, isExporting,
  onBackToDashboard,
  onNavigateAddTransaction,
  onNavigateEditTransaction
}) => {
  
  const stats = [
    { label: "Total Transactions", value: "6 items", color: "#00e5ff" },
    { label: "Total Income", value: "₹1,27,500", color: "#00ffb2" },
    { label: "Total Expenses", value: "₹24,650", color: "#ff5f6d" },
    { label: "Largest Expense", value: "₹22,000", color: "#7b61ff" }
  ];

  const logs = [
    { action: "Node Added", detail: "+₹7,500 Consulting", time: "2 min ago", color: "#00ffb2" },
    { action: "Node Updated", detail: "-₹22,000 Rent", time: "1 hr ago", color: "#7b61ff" },
    { action: "Portal Export", detail: "PDF document compile", time: "Yesterday", color: "#00e5ff" }
  ];

  const types = [
    { value: 'all', label: 'All Ledgers' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expenses' },
    { value: 'investment', label: 'Investments' }
  ];

  const categories = ['All', 'Salary', 'Bills', 'Education', 'Entertainment', 'Food'];

  return (
    <div className="ui-wrapper">
      
      {/* LEFT SIDEBAR: Stats & Activity Stream */}
      <div className="w-[280px] bg-[#050816]/75 border-r border-white/8 p-6 h-screen fixed top-0 left-0 flex flex-col justify-between pt-24 z-20 pointer-events-auto backdrop-blur-md">
        
        {/* Navigation back */}
        <div className="mb-6">
          <button 
            onClick={onBackToDashboard}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to CommandCenter
          </button>
        </div>

        {/* Real-time Metrics */}
        <div className="flex flex-col gap-5 my-auto">
          <h4 className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">
            Nexus Metrics
          </h4>
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <span className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</span>
              <span className="text-xl font-extrabold text-white" style={{ textShadow: `0 0 10px ${stat.color}20` }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Activity Ticker */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">
            Activity Ticker
          </h4>
          <div className="flex flex-col gap-2">
            {logs.map((log, idx) => (
              <div key={idx} className="p-2 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center text-[0.65rem]">
                <div className="flex gap-2 items-center">
                  <Clock size={10} style={{ color: log.color }} />
                  <span className="font-semibold text-gray-300">{log.action}</span>
                </div>
                <span className="text-gray-500">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT/CENTER OVERLAY CONTENT */}
      <div className="pl-[300px] pr-[5%] pt-24 pb-8 min-h-screen flex flex-col justify-between relative z-10">
        
        {/* Header Title Section */}
        <div className="flex justify-between items-center mb-6 ui-interactive">
          <div>
            <h2 className="title-gradient text-3xl font-extrabold tracking-tight font-display">
              Transaction Nexus
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Monitor, manage, and explore every financial movement in your ecosystem.
            </p>
          </div>

          {/* Search box with scanning waves */}
          <div className="relative w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Scan transaction ledger..."
              className="w-full bg-black/60 border border-white/8 hover:border-white/15 focus:border-[#00e5ff] text-white text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(0,229,255,0.15)]"
            />
            {/* Pulsing glow scanning ring */}
            <div className="absolute inset-0 rounded-xl border border-[#00e5ff]/20 animate-pulse pointer-events-none" />
          </div>
        </div>

        {/* Filter Chip Dock Center */}
        <div className="flex flex-col gap-4 mb-24 ui-interactive">
          {/* Types filters */}
          <div className="flex gap-2">
            {types.map((tp) => (
              <button
                key={tp.value}
                onClick={() => setSelectedType(tp.value)}
                className={`text-xs px-4 py-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
                  selectedType === tp.value
                    ? 'bg-[#00e5ff] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)] font-bold'
                    : 'bg-white/5 border border-white/8 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tp.label}
              </button>
            ))}
          </div>

          {/* Category filters */}
          <div className="flex gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'All' ? 'all' : cat)}
                className={`text-[0.7rem] px-3.5 py-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                  (cat === 'All' && selectedCategory === 'all') || (selectedCategory.toLowerCase() === cat.toLowerCase())
                    ? 'border-2 border-[#7b61ff] bg-[#7b61ff]/10 text-white font-bold shadow-[0_0_12px_rgba(123,97,255,0.2)]'
                    : 'bg-white/5 border border-white/5 text-gray-500 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Explore guide scroll text */}
        <div className="text-center mb-8">
          <p className="text-[0.65rem] text-gray-500 uppercase tracking-widest animate-pulse">
            Scroll down to view category expenditure heatmap clusters
          </p>
        </div>

        {/* Bottom Quick Actions Dock */}
        <div className="flex justify-center ui-interactive">
          <div className="flex items-center gap-4 bg-black/70 border border-white/8 px-6 py-3 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <button 
              onClick={onNavigateAddTransaction}
              className="text-xs font-bold text-white hover:text-[#00ffb2] transition-colors flex items-center gap-1.5 uppercase cursor-pointer"
            >
              <Plus size={14} className="text-[#00ffb2]" /> Add Log
            </button>
            <div className="w-[1px] h-4 bg-white/10" />
            <button 
              onClick={onNavigateEditTransaction}
              className="text-xs font-bold text-white hover:text-[#00e5ff] transition-colors flex items-center gap-1.5 uppercase cursor-pointer"
            >
              <Edit3 size={14} className="text-[#00e5ff]" /> Edit
            </button>
            <div className="w-[1px] h-4 bg-white/10" />
            <button 
              onClick={() => alert("Action: Delete Selected Transaction")}
              className="text-xs font-bold text-white hover:text-[#ff5f6d] transition-colors flex items-center gap-1.5 uppercase cursor-pointer"
            >
              <Trash2 size={14} className="text-[#ff5f6d]" /> Wipe
            </button>
            <div className="w-[1px] h-4 bg-white/10" />
            <button 
              onClick={onExportTrigger}
              disabled={isExporting}
              className="text-xs font-bold text-white hover:text-[#ffd166] transition-colors flex items-center gap-1.5 uppercase cursor-pointer disabled:opacity-50"
            >
              <Download size={14} className="text-[#ffd166]" /> Export
            </button>
          </div>
        </div>
      </div>

      {/* FLOATING HOLOGRAPHIC DETAIL MODAL CHAMBER */}
      <AnimatePresence>
        {selectedTransaction && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[4px] z-50 pointer-events-auto">
            {/* Click backdrop to close */}
            <div className="absolute inset-0" onClick={() => setSelectedTransaction(null)} />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-[400px] bg-[#050816]/90 border border-white/8 rounded-[24px] p-6 shadow-[0_24px_50px_rgba(0,0,0,0.5)] backdrop-blur-md relative z-10"
              style={{ borderLeft: `4px solid ${selectedTransaction.color}` }}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Tag size={16} style={{ color: selectedTransaction.color }} />
                  <span className="text-xs font-bold uppercase tracking-wider">{selectedTransaction.category}</span>
                </div>
                <button 
                  onClick={() => setSelectedTransaction(null)}
                  className="text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-white text-xl font-bold mb-2">{selectedTransaction.title}</h3>
                <h2 className="text-3xl font-black" style={{ color: selectedTransaction.color }}>
                  {selectedTransaction.amount}
                </h2>
              </div>

              <div className="flex flex-col gap-4 border-t border-white/5 pt-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Record Node Date</span>
                  <span className="text-gray-300 font-semibold flex items-center gap-1.5"><Calendar size={12} /> {selectedTransaction.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transfer Channel</span>
                  <span className="text-gray-300 font-semibold flex items-center gap-1.5"><Landmark size={12} /> {selectedTransaction.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ledger Status</span>
                  <span className="font-semibold flex items-center gap-1.5" style={{ color: selectedTransaction.color }}><ShieldCheck size={12} /> {selectedTransaction.status}</span>
                </div>
                <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
                  <span className="text-gray-500 font-semibold">Security Note Ledger</span>
                  <p className="text-gray-400 leading-relaxed bg-white/5 p-3 rounded-xl mt-1 italic">
                    "{selectedTransaction.notes}"
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionsUI;
