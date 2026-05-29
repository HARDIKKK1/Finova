import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Landmark, DollarSign, Calendar, Tag, FileText, 
  Sparkles, CheckCircle2, AlertTriangle, Lightbulb 
} from 'lucide-react';

const AddTransactionUI = ({
  title, setTitle,
  amount, setAmount,
  type, setType,
  category, setCategory,
  date, setDate,
  notes, setNotes,
  isEditMode,
  isSaving,
  onSave,
  onCancel
}) => {
  const [error, setError] = useState('');
  
  // Suggested templates configuration to auto-fill fields
  const templates = [
    { label: "Salary", title: "Monthly Salary Credit", amount: "120000", type: "income", category: "Salary", notes: "Standard payroll deposit." },
    { label: "Grocery", title: "Supermarket Groceries", amount: "3450", type: "expense", category: "Food", notes: "Weekly pantry stock." },
    { label: "Rent", title: "Luxe Flat Rent Maintenance", amount: "22000", type: "expense", category: "Bills", notes: "Flat rent + maintenance." },
    { label: "Fuel", title: "HP Petrol Refuel", amount: "2800", type: "expense", category: "Travel", notes: "Weekly petrol tank fill." },
    { label: "Invest", title: "SIP Mutual Fund Allocation", amount: "15000", type: "investment", category: "Investment", notes: "Index fund monthly SIP." }
  ];

  const handleApplyTemplate = (tpl) => {
    setTitle(tpl.title);
    setAmount(tpl.amount);
    setType(tpl.type);
    setCategory(tpl.category);
    setNotes(tpl.notes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !category) {
      setError('Please supply Title, Amount, and Category.');
      return;
    }
    setError('');
    onSave();
  };

  // Dynamic AI assistant suggestions
  const getAiAssistantText = () => {
    const numAmt = parseFloat(amount) || 0;
    if (type === 'expense') {
      if (numAmt > 10000) return { text: "This expense exceeds your average budget. Consider breaking it down.", type: "warning", color: "#ff5f6d" };
      if (category.toLowerCase() === 'food') return { text: "Food spending is already high this month. Think twice before confirming.", type: "warning", color: "#ff5f6d" };
      return { text: "This expense fits within your threshold coordinates.", type: "info", color: "#00e5ff" };
    }
    if (type === 'income') {
      return { text: "Great! This increases your savings rate buffer.", type: "success", color: "#00ffb2" };
    }
    if (type === 'investment') {
      return { text: "Superb allocation. Committing to assets compounds long-term.", type: "success", color: "#ffd166" };
    }
    return { text: "Finova core listening for telemetry data input...", type: "neutral", color: "#7b61ff" };
  };

  const aiFeedback = getAiAssistantText();

  return (
    <div className="w-screen min-h-screen flex items-center justify-between px-[8%] md:px-[10%] py-24 relative z-10 pointer-events-none">
      
      {/* Back to Transactions Button */}
      <div className="absolute top-8 left-[10%] pointer-events-auto">
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-3 cursor-pointer"
        >
          &larr; Return to Transactions
        </button>
      </div>

      {/* FORM CARD (LEFT-SIDE) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: isSaving ? 0 : 1, x: isSaving ? -100 : 0 }}
        transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] bg-black/45 backdrop-blur-[16px] border border-white/8 rounded-[24px] p-6 md:p-8 shadow-[0_24px_50px_rgba(0,0,0,0.5)] pointer-events-auto flex flex-col gap-5 overflow-y-auto max-h-[85vh]"
      >
        <div>
          <h2 className="title-gradient text-3xl font-extrabold tracking-tight font-display">
            {isEditMode ? 'Modify Financial Event' : 'Create Financial Event'}
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Track every rupee with precision and intelligence.
          </p>
        </div>

        {/* Suggestion suggested suggested templates suggestions */}
        <div>
          <span className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-widest block mb-2">Suggestions</span>
          <div className="flex gap-1.5 flex-wrap">
            {templates.map((tpl) => (
              <button
                key={tpl.label}
                type="button"
                onClick={() => handleApplyTemplate(tpl)}
                className="text-[0.6rem] px-2 py-1 rounded bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:border-[#00e5ff] cursor-pointer transition-all duration-300"
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-950/45 border border-red-500/20 text-red-400 rounded-xl p-3 flex items-center gap-2 text-xs">
            <AlertTriangle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Amount input (Numbers animate while typing) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-extrabold">₹</span>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount in Rupees"
                className="w-full bg-black/60 border border-white/8 hover:border-white/15 focus:border-[#00e5ff] text-white rounded-xl pl-8 pr-4 py-2.5 text-sm transition-all duration-300 outline-none focus:shadow-[0_0_15px_rgba(0,229,255,0.15)]"
              />
            </div>
          </div>

          {/* Title input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Event Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Coffee Refuel, Broker Dividends"
              className="w-full bg-black/60 border border-white/8 hover:border-white/15 focus:border-[#00e5ff] text-white rounded-xl px-4 py-2.5 text-sm transition-all duration-300 outline-none focus:shadow-[0_0_15px_rgba(0,229,255,0.15)]"
            />
          </div>

          {/* Type Selector (displayed as grid selection) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Transaction Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['income', 'expense', 'investment', 'transfer'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 border cursor-pointer text-center ${
                    type === t
                      ? t === 'income' ? 'border-[#00ffb2] bg-[#00ffb2]/10 text-white shadow-[0_0_12px_rgba(0,255,178,0.2)]'
                      : t === 'expense' ? 'border-[#ff5f6d] bg-[#ff5f6d]/10 text-white shadow-[0_0_12px_rgba(255,95,109,0.2)]'
                      : t === 'investment' ? 'border-[#ffd166] bg-[#ffd166]/10 text-white shadow-[0_0_12px_rgba(255,209,102,0.2)]'
                      : 'border-[#00e5ff] bg-[#00e5ff]/10 text-white shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                      : 'bg-black/60 border-white/8 text-gray-400 hover:text-white hover:border-white/15'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#050816] border border-white/8 hover:border-white/15 focus:border-[#00e5ff] text-white rounded-xl px-4 py-2.5 text-sm transition-all duration-300 outline-none focus:shadow-[0_0_15px_rgba(0,229,255,0.15)] cursor-pointer"
            >
              <option value="">Select Category Node</option>
              <option value="Salary">Salary</option>
              <option value="Bills">Bills</option>
              <option value="Food">Food</option>
              <option value="Shopping">Shopping</option>
              <option value="Travel">Travel</option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Investment">Investment</option>
            </select>
          </div>

          {/* Date Picker */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Event Timestamp</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#050816] border border-white/8 hover:border-white/15 focus:border-[#00e5ff] text-white rounded-xl pl-11 pr-4 py-2.5 text-sm transition-all duration-300 outline-none focus:shadow-[0_0_15px_rgba(0,229,255,0.15)] cursor-pointer"
              />
            </div>
          </div>

          {/* Notes Area */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Security Notes</label>
            <div className="relative">
              <FileText className="absolute left-4 top-3.5 text-gray-500" size={16} />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter transactional metadata..."
                rows="2"
                className="w-full bg-black/60 border border-white/8 hover:border-white/15 focus:border-[#00e5ff] text-white rounded-xl pl-11 pr-4 py-3 text-sm transition-all duration-300 outline-none focus:shadow-[0_0_15px_rgba(0,229,255,0.15)] resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 border border-white/8 bg-white/5 text-gray-400 hover:text-white rounded-xl text-xs font-bold uppercase transition-all duration-300 cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-[#7b61ff] to-[#00e5ff] text-black font-extrabold rounded-xl text-xs uppercase hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-300 cursor-pointer text-center"
            >
              {isEditMode ? 'Update Event' : 'Save Event'}
            </button>
          </div>

        </form>
      </motion.div>

      {/* LIVE PREVIEW & AI ASSISTANT ORB SIDEBAR (RIGHT-SIDE) */}
      <div className="w-full max-w-[360px] flex flex-col gap-5 justify-center items-end">
        
        {/* Live 3D Preview panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: isSaving ? 0 : 1, x: isSaving ? 100 : 0 }}
          transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="w-full bg-black/45 border border-white/8 p-6 rounded-[20px] backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.4)] pointer-events-auto"
        >
          <span className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-widest block mb-4">Live Preview</span>
          
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-white text-base font-bold truncate max-w-[180px]">
              {title || 'Untitled Financial Event'}
            </h4>
            <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
              <Calendar size={12} /> {date || 'YYYY-MM-DD'}
            </span>
          </div>

          <div className="mb-4">
            <span className="text-[0.65rem] text-gray-500 font-semibold block uppercase">Amount Value</span>
            <h3 className="text-2xl font-black text-white" style={{ textShadow: `0 0 10px ${aiFeedback.color}30` }}>
              ₹{amount ? parseFloat(amount).toLocaleString('en-IN') : '0.00'}
            </h3>
          </div>

          <div className="flex justify-between items-center border-t border-white/5 pt-4">
            <span className="text-[0.65rem] px-2 py-1 rounded bg-white/5 border border-white/8 text-gray-400 uppercase font-semibold">
              Type: {type}
            </span>
            <span className="text-[0.65rem] px-2 py-1 rounded bg-white/5 border border-white/8 text-gray-400 uppercase font-semibold">
              Node: {category || 'None'}
            </span>
          </div>
        </motion.div>

        {/* AI Assistant orb suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isSaving ? 0 : 1, y: isSaving ? 80 : 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full bg-black/45 border border-white/8 p-5 rounded-[20px] backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.4)] pointer-events-auto"
          style={{ borderLeft: `3px solid ${aiFeedback.color}` }}
        >
          <div className="flex items-center gap-2 mb-3" style={{ color: aiFeedback.color }}>
            <Sparkles size={16} />
            <span className="text-[0.65rem] font-bold uppercase tracking-wider">AI Insight</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-semibold">
            "{aiFeedback.text}"
          </p>
        </motion.div>
      </div>

    </div>
  );
};

export default AddTransactionUI;
