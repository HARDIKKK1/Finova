import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Unlock, Mail, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

const LoginUI = ({ setIsTyping, isSubmitting, setIsSubmitting, isSuccess, setIsSuccess, onBackToLanding }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef();

  // Reset typing state after a delay of no input activity
  const typingTimeoutRef = useRef(null);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setIsTyping(true);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 900);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // Card Tilt effect following cursor
  const handleMouseMove = (e) => {
    if (!cardRef.current || isSuccess) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;  // -0.5 to 0.5
    setTilt({ x: x * 12, y: -y * 12 }); // Max 12 degrees
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all security credentials.');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    // Simulate high-security credentials validation loader
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1800);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-start px-[8%] md:px-[10%] relative z-10 pointer-events-none">
      
      {/* Back button */}
      <div className="absolute top-8 left-[10%] pointer-events-auto">
        <button
          onClick={onBackToLanding}
          className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-3 cursor-pointer"
        >
          &larr; Back to Platform Info
        </button>
      </div>

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 40 }}
        animate={{ 
          opacity: isSuccess ? 0 : 1, 
          y: isSuccess ? -100 : 0,
          scale: isSuccess ? 0.8 : 1
        }}
        transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
        style={{
          transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="w-full max-w-[420px] bg-black/45 backdrop-blur-[16px] border border-white/8 rounded-[24px] p-8 md:p-10 shadow-[0_32px_64px_rgba(0,0,0,0.6)] pointer-events-auto"
      >
        {/* Animated Vault Lock Icon at top */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ 
              scale: isSuccess ? [1, 1.2, 0.9] : isSubmitting ? [1, 1.1, 1] : 1,
              rotate: isSuccess ? 360 : 0,
              borderColor: isSuccess ? '#00ffb2' : isSubmitting ? '#00e5ff' : 'rgba(255,255,255,0.08)'
            }}
            transition={{ 
              duration: isSuccess ? 1.2 : 1.0, 
              repeat: isSubmitting ? Infinity : 0,
              ease: "easeInOut"
            }}
            className="w-16 h-16 rounded-full border-2 flex items-center justify-center bg-black/60 shadow-[0_0_20px_rgba(123,97,255,0.15)]"
          >
            {isSuccess ? (
              <Unlock size={26} className="text-[#00ffb2] drop-shadow-[0_0_8px_#00ffb2]" />
            ) : (
              <Lock size={26} className={`transition-colors duration-300 ${isSubmitting ? 'text-[#00e5ff] drop-shadow-[0_0_8px_#00e5ff]' : 'text-[#7b61ff]'}`} />
            )}
          </motion.div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-white text-3xl font-extrabold tracking-tight mb-2 font-display">
            {isSubmitting ? 'Verifying Node...' : isSuccess ? 'Decrypting Vault...' : 'Welcome Back'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isSuccess ? 'Access granted. Welcome to Finova.' : 'Access your personal financial command center.'}
          </p>
        </div>

        {/* Error notification */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-950/45 border border-red-500/20 text-red-400 rounded-xl p-3 flex items-center gap-2 text-xs mb-5"
            >
              <ShieldAlert size={14} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="email"
                required
                value={email}
                disabled={isSubmitting || isSuccess}
                onChange={handleInputChange(setEmail)}
                placeholder="keymaster@finova.com"
                className="w-full bg-black/60 border border-white/8 hover:border-white/15 focus:border-[#00e5ff] text-white rounded-xl pl-11 pr-4 py-3 text-sm transition-all duration-300 outline-none focus:scale-[1.01] focus:shadow-[0_0_15px_rgba(0,229,255,0.15)] disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Security Key</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                disabled={isSubmitting || isSuccess}
                onChange={handleInputChange(setPassword)}
                placeholder="••••••••••••"
                className="w-full bg-black/60 border border-white/8 hover:border-white/15 focus:border-[#00e5ff] text-white rounded-xl pl-11 pr-4 py-3 text-sm transition-all duration-300 outline-none focus:scale-[1.01] focus:shadow-[0_0_15px_rgba(0,229,255,0.15)] disabled:opacity-50"
              />
            </div>
          </div>

          {/* Forgot Password link */}
          <div className="text-right">
            <button
              type="button"
              className="text-xs text-gray-500 hover:text-[#00e5ff] transition-all duration-300 cursor-pointer relative group"
            >
              Forgot Credentials?
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#00e5ff] transition-all duration-300 group-hover:w-full" />
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`w-full py-3.5 rounded-xl text-sm font-extrabold tracking-wider uppercase transition-all duration-500 flex items-center justify-center gap-2 cursor-pointer ${
              isSuccess
                ? 'bg-[#00ffb2] text-black shadow-[0_0_30px_rgba(0,255,178,0.4)]'
                : isSubmitting
                ? 'bg-black/80 text-[#00e5ff] border border-[#00e5ff]/30 shadow-[0_0_20px_rgba(0,229,255,0.2)]'
                : 'bg-gradient-to-r from-[#7b61ff] to-[#00e5ff] text-black hover:text-white font-bold hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,229,255,0.35),0_0_10px_rgba(123,97,255,0.35)]'
            }`}
          >
            {isSuccess ? (
              <>
                <CheckCircle2 size={16} className="animate-bounce" /> Decrypting...
              </>
            ) : isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-[#00e5ff] border-t-transparent rounded-full animate-spin" />
                Authorizing Node
              </>
            ) : (
              <>
                Enter Dashboard <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Secondary sign up options */}
        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-xs text-gray-500">
            Node unregistered?{' '}
            <button
              type="button"
              className="text-[#00e5ff] font-bold hover:text-white transition-colors cursor-pointer relative group"
            >
              Establish Account
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginUI;
