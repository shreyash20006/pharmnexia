import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle, 
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../store/AppContext';

export const AuthModal = ({ isOpen, initialMode = 'login', onClose, onSuccess }) => {
  if (!isOpen) return null;

  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useApp();
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [step, setStep] = useState(1); // 1: Credentials, 2: Academic Profile (for signup)

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [degree, setDegree] = useState('B.Pharm');
  const [year, setYear] = useState('1st Year');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync mode with props
  useEffect(() => {
    setMode(initialMode || 'login');
    setStep(1);
    setErrorMessage('');
    setShowPassword(false);
  }, [initialMode, isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll while modal is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Handle Google OAuth Login
  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);

    try {
      await loginWithGoogle();
      // Browser redirects to Google consent
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      setErrorMessage(
        err.message || 'Failed to initialize Google Sign-In. Please check your Supabase configuration.'
      );
      setIsGoogleLoading(false);
    }
  };

  // Step 1 Validation in Signup Mode
  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setStep(2);
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'signup' && step === 1) {
      handleNextStep(e);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setStep(1);
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
    <div 
      className="fixed inset-0 z-50 bg-[#0F172A]/35 backdrop-blur-[4px] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div 
        className="bg-white rounded-[20px] w-full max-w-[400px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-[#E5E7EB] p-6 sm:p-7 text-[#111827] animate-modal-pop relative my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header: Logo + Close Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] flex items-center justify-center p-1 shadow-xs">
            <img
              src="/logo_emblem.png"
              alt="PharmNexia"
              className="w-full h-full object-contain aspect-square select-none pointer-events-none"
              onError={(e) => {
                e.currentTarget.src = "https://res.cloudinary.com/axgam8br/image/upload/v1791050025/1000481598.jpg";
              }}
            />
          </div>
          <button 
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg text-[#667085] hover:text-[#111827] hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-5">
          {mode === 'login' ? (
            <>
              <h2 className="text-xl font-bold text-[#101828] tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs text-[#667085] mt-1">
                Sign in to continue your PharmNexia journey.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-[#101828] tracking-tight">
                {step === 1 ? 'Create your PharmNexia account' : 'Academic Profile'}
              </h2>
              <p className="text-xs text-[#667085] mt-1">
                {step === 1 
                  ? 'Start building your pharmacy career.' 
                  : 'Select your pharmacy program & current year.'}
              </p>

              {/* Tiny Compact Step Indicator */}
              <div className="flex items-center gap-2 mt-2.5">
                <div className="flex items-center gap-1.5">
                  <div className={`h-1.5 rounded-full transition-all duration-200 ${step === 1 ? 'w-5 bg-[#00A86B]' : 'w-2 bg-[#00A86B]'}`} />
                  <div className={`h-1.5 rounded-full transition-all duration-200 ${step === 2 ? 'w-5 bg-[#00A86B]' : 'w-2 bg-[#E5E7EB]'}`} />
                </div>
                <span className="text-[11px] font-medium text-[#667085]">
                  Step {step} of 2
                </span>
              </div>
            </>
          )}
        </div>

        {/* Error Message Alert */}
        {errorMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
            <div className="leading-snug">{errorMessage}</div>
          </div>
        )}

        {/* Google Login (Shown in Login or Signup Step 1) */}
        {(mode === 'login' || (mode === 'signup' && step === 1)) && (
          <>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
              className="w-full h-11 px-4 rounded-xl border border-[#E5E7EB] hover:border-[#D1D5DB] bg-white hover:bg-[#F9FAFB] text-[#1F2937] font-medium text-sm transition-all shadow-xs flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#00A86B]" />
                  <span>Connecting with Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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

            {/* Subtle Divider */}
            <div className="relative flex items-center justify-center my-3.5">
              <div className="w-full border-t border-[#E5E7EB]" />
              <span className="absolute bg-white px-3 text-[11px] font-medium text-[#9CA3AF] lowercase tracking-wide">
                or continue with email
              </span>
            </div>
          </>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* STEP 1 FIELDS (Login or Signup Step 1) */}
          {(mode === 'login' || (mode === 'signup' && step === 1)) && (
            <>
              {mode === 'signup' && (
                <div>
                  <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 pointer-events-none" />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full h-11 pl-10 pr-3.5 text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] transition-all focus:outline-none focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 hover:border-[#D1D5DB]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 pointer-events-none" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu or personal email"
                    className="w-full h-11 pl-10 pr-3.5 text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] transition-all focus:outline-none focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 hover:border-[#D1D5DB]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 pointer-events-none" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-10 text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] transition-all focus:outline-none focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 hover:border-[#D1D5DB]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 text-[#9CA3AF] hover:text-[#4B5563] p-1 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit / Continue Button */}
              <div className="pt-1">
                {mode === 'login' ? (
                  <button
                    type="submit"
                    disabled={isLoading || isGoogleLoading}
                    className="w-full h-11 sm:h-[46px] rounded-xl bg-[#00A86B] hover:bg-[#087A52] active:bg-[#066343] text-white font-semibold text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isLoading || isGoogleLoading}
                    className="w-full h-11 sm:h-[46px] rounded-xl bg-[#00A86B] hover:bg-[#087A52] active:bg-[#066343] text-white font-semibold text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}

          {/* STEP 2 FIELDS (Signup Academic Profile) */}
          {mode === 'signup' && step === 2 && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                    Degree Program
                  </label>
                  <select 
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full h-11 px-3 text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#111827] transition-all focus:outline-none focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 hover:border-[#D1D5DB]"
                  >
                    <option value="B.Pharm">B.Pharm</option>
                    <option value="D.Pharm">D.Pharm</option>
                    <option value="M.Pharm">M.Pharm</option>
                    <option value="Pharm.D">Pharm.D</option>
                    <option value="Life Sciences">Life Sciences / Biotech</option>
                  </select>
                </div>

                <div>
                  <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                    Current Year
                  </label>
                  <select 
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full h-11 px-3 text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#111827] transition-all focus:outline-none focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 hover:border-[#D1D5DB]"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="Final Year">Final Year</option>
                    <option value="Recent Graduate">Recent Graduate</option>
                  </select>
                </div>
              </div>

              <p className="text-[11px] text-[#667085] leading-normal">
                This helps us personalize mentorship recommendations and verified career pathways for you.
              </p>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => { setStep(1); setErrorMessage(''); }}
                  className="h-11 px-3.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#4B5563] font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-11 sm:h-[46px] rounded-xl bg-[#00A86B] hover:bg-[#087A52] active:bg-[#066343] text-white font-semibold text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </div>
            </div>
          )}

        </form>

        {/* Clean Bottom Mode Switcher */}
        <div className="text-center text-xs text-[#667085] pt-4 border-t border-[#F3F4F6] mt-4">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setStep(1); setErrorMessage(''); }}
                className="text-[#00A86B] font-semibold hover:text-[#087A52] hover:underline transition-colors cursor-pointer"
              >
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setStep(1); setErrorMessage(''); }}
                className="text-[#00A86B] font-semibold hover:text-[#087A52] hover:underline transition-colors cursor-pointer"
              >
                Log in
              </button>
            </>
          )}
        </div>

        {/* Minimal Legal Footer */}
        <div className="text-center text-[11px] text-[#9CA3AF] leading-relaxed pt-2">
          By continuing, you agree to PharmNexia's{' '}
          <a href="/terms" className="text-[#667085] hover:text-[#00A86B] underline transition-colors">
            Terms
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-[#667085] hover:text-[#00A86B] underline transition-colors">
            Privacy Policy
          </a>.
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
