import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PharmNexiaLogo } from './PharmNexiaLogo';

export const AuthModal = ({ isOpen, initialMode = 'login', onClose, onSuccess }) => {
  if (!isOpen) return null;

  const { loginWithGoogle, loginWithEmail, signupWithEmail, isSupabaseConfigured } = useApp();
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Form fields (Clean - NO dummy credentials)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [degree, setDegree] = useState('B.Pharm');
  const [year, setYear] = useState('1st Year');

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Google OAuth Login
  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);

    try {
      await loginWithGoogle();
      // Browser will redirect to Google login consent screen
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      setErrorMessage(
        err.message || 'Failed to initialize Google Sign-In. Please check your Supabase configuration.'
      );
      setIsGoogleLoading(false);
    }
  };

  // Handle Email / Password Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password, { name, degree, year });
      }

      setIsLoading(false);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error('Authentication Error:', err);
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101828]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E5E7EB] overflow-hidden animate-fadeIn text-[#111827]">
        
        {/* Header */}
        <div className="bg-[#F8FAF9] p-5 flex items-center justify-between border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center p-0.5 shadow-sm">
              <PharmNexiaLogo size="sm" showIconOnly={true} theme="light" />
            </div>
            <div>
              <h3 className="font-bold text-[#101828] text-base font-heading">
                {mode === 'login' ? 'Welcome Back' : 'Create Free Account'}
              </h3>
              <p className="text-xs text-[#087A52] font-semibold">PharmNexia Career Ecosystem</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-[#667085] hover:text-[#111827] hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex border-b border-[#E5E7EB] text-xs font-bold">
          <button
            onClick={() => { setMode('login'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-center transition border-b-2 ${
              mode === 'login' 
                ? 'border-[#00A86B] text-[#087A52] bg-white' 
                : 'border-transparent text-[#667085] hover:text-[#111827] bg-[#F8FAF9]'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-center transition border-b-2 ${
              mode === 'signup' 
                ? 'border-[#00A86B] text-[#087A52] bg-white' 
                : 'border-transparent text-[#667085] hover:text-[#111827] bg-[#F8FAF9]'
            }`}
          >
            Register Student
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* 1. GOOGLE LOGIN BUTTON */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-[#E5E7EB] hover:border-[#00A86B] bg-white hover:bg-[#F8FAF9] text-[#111827] font-semibold text-xs transition shadow-sm flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#00A86B]" />
                  <span>Connecting with Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-[#E5E7EB] w-full"></div>
            <span className="bg-white px-3 text-[11px] text-[#667085] uppercase tracking-wider font-semibold absolute">
              or continue with email
            </span>
          </div>

          {/* 2. EMAIL / PASSWORD FORM */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#667085] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#667085] absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#667085] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#667085] absolute left-3 top-2.5" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu or personal email"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#667085] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#667085] absolute left-3 top-2.5" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[#667085] mb-1">Degree</label>
                  <select 
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white text-xs"
                  >
                    <option value="B.Pharm">B.Pharm</option>
                    <option value="D.Pharm">D.Pharm</option>
                    <option value="M.Pharm">M.Pharm</option>
                    <option value="Pharm.D">Pharm.D</option>
                    <option value="Life Sciences">Life Sciences / Biotech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#667085] mb-1">Current Year</label>
                  <select 
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white text-xs"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="Final Year">Final Year</option>
                    <option value="Recent Graduate">Recent Graduate</option>
                  </select>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>{mode === 'login' ? 'Sign In' : 'Create Free Account'}</span>
                )}
              </button>
            </div>
          </form>

          <div className="text-[11px] text-[#667085] text-center pt-1 leading-normal">
            🔒 By continuing, you agree to PharmNexia's{" "}
            <a href="/terms" className="text-[#087A52] font-semibold hover:underline">Terms</a> and{" "}
            <a href="/privacy" className="text-[#087A52] font-semibold hover:underline">Privacy Policy</a> (Indian DPDP compliant).
          </div>

        </div>

      </div>
    </div>
  );
};

export default AuthModal;
