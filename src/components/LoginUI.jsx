import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Unlock, Mail, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const LoginUI = ({ setIsTyping, isSubmitting, setIsSubmitting, isSuccess, setIsSuccess, onBackToLanding }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all security credentials.');
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError('Security keys do not match.');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      if (isRegister) {
        // Firebase Create User
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Firebase Sign In
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      // Success triggers combination lock spin and camera dolly
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      setIsSubmitting(false);
      // Map Firebase error codes to readable messages
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This node email is already registered.');
          break;
        case 'auth/weak-password':
          setError('Security key is too weak (minimum 6 characters).');
          break;
        case 'auth/invalid-credential':
          setError('Invalid node credentials or security key.');
          break;
        case 'auth/user-not-found':
          setError('No account associated with this email.');
          break;
        case 'auth/invalid-email':
          setError('Please provide a valid email format.');
          break;
        default:
          setError(err.message.replace('Firebase:', '').trim());
      }
    }
  };

  const toggleView = () => {
    setIsRegister(!isRegister);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      setIsSubmitting(false);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Login popup closed before completion.');
      } else {
        setError(err.message.replace('Firebase:', '').trim());
      }
    }
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
            {isSuccess 
              ? 'Decrypting...' 
              : isSubmitting 
              ? (isRegister ? 'Creating Node...' : 'Verifying Node...') 
              : (isRegister ? 'Establish Node' : 'Welcome Back')}
          </h2>
          <p className="text-gray-400 text-sm">
            {isSuccess 
              ? 'Access granted. Welcome to Finova.' 
              : isRegister 
              ? 'Deploy a new credentials pair into the ledger.' 
              : 'Access your personal financial command center.'}
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

        {/* Login/Register Form */}
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

          {/* Confirm Password input (only shown during registration) */}
          <AnimatePresence>
            {isRegister && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-1.5 overflow-hidden"
              >
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Confirm Security Key</label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    disabled={isSubmitting || isSuccess}
                    onChange={handleInputChange(setConfirmPassword)}
                    placeholder="••••••••••••"
                    className="w-full bg-black/60 border border-white/8 hover:border-white/15 focus:border-[#00e5ff] text-white rounded-xl pl-11 pr-4 py-3 text-sm transition-all duration-300 outline-none focus:scale-[1.01] focus:shadow-[0_0_15px_rgba(0,229,255,0.15)] disabled:opacity-50"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forgot Password link (only shown in Login view) */}
          {!isRegister && (
            <div className="text-right">
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-[#00e5ff] transition-all duration-300 cursor-pointer relative group"
              >
                Forgot Credentials?
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#00e5ff] transition-all duration-300 group-hover:w-full" />
              </button>
            </div>
          )}

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
                {isRegister ? 'Establishing Node' : 'Authorizing Node'}
              </>
            ) : (
              <>
                {isRegister ? 'Establish Node' : 'Enter Dashboard'} <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-1 h-[1px] bg-white/5" />
          <span className="px-3 text-[10px] uppercase font-bold text-gray-500 tracking-widest">or</span>
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting || isSuccess}
          className="w-full py-3 rounded-xl border border-white/8 hover:border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.57 5.57 0 0 1 8.35 12.999a5.57 5.57 0 0 1 5.64-5.514 5.378 5.378 0 0 1 3.82 1.545l3.14-3.138A9.778 9.778 0 0 0 13.99 3c-5.523 0-10 4.477-10 10s4.477 10 10 10c5.787 0 9.61-4.068 9.61-9.78a8.887 8.887 0 0 0-.16-1.935H12.24z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Secondary sign up / sign in toggle link */}
        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-xs text-gray-500">
            {isRegister ? 'Already registered? ' : 'Node unregistered? '}
            <button
              type="button"
              onClick={toggleView}
              className="text-[#00e5ff] font-bold hover:text-white transition-colors cursor-pointer relative group"
            >
              {isRegister ? 'Sign In' : 'Establish Account'}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginUI;
