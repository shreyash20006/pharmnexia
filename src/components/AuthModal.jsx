import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  School, 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../store/AppContext';

export const AuthModal = ({ isOpen, initialMode = 'login', onClose, onSuccess }) => {
  if (!isOpen) return null;

  const { loginUser } = useApp();
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [degree, setDegree] = useState('B.Pharm');
  const [year, setYear] = useState('3rd Year');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      loginUser(email || 'student@pharmnexia.in', password, 'STUDENT');
      setIsLoading(false);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101828]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E5E7EB] overflow-hidden animate-fadeIn text-[#111827]">
        
        {/* Header */}
        <div className="bg-[#F8FAF9] p-5 flex items-center justify-between border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8F8F1] border border-[#00A86B]/20 flex items-center justify-center text-[#00A86B]">
              <GraduationCap className="w-5 h-5" />
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
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-center transition border-b-2 ${
              mode === 'login' 
                ? 'border-[#00A86B] text-[#087A52] bg-white' 
                : 'border-transparent text-[#667085] hover:text-[#111827] bg-[#F8FAF9]'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 text-center transition border-b-2 ${
              mode === 'signup' 
                ? 'border-[#00A86B] text-[#087A52] bg-white' 
                : 'border-transparent text-[#667085] hover:text-[#111827] bg-[#F8FAF9]'
            }`}
          >
            Register Student
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
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
                  placeholder="e.g. Aarav Patel"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] placeholder-[#667085] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#667085] mb-1">College Email / Personal Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#667085] absolute left-3 top-2.5" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@pharmacy.college.edu"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] placeholder-[#667085] focus:outline-none focus:border-[#00A86B] focus:bg-white"
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
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] placeholder-[#667085] focus:outline-none focus:border-[#00A86B] focus:bg-white"
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
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-sm shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Securing connection...</span>
              ) : (
                <span>{mode === 'login' ? 'Sign In to PharmNexia' : 'Create Free Student Profile'}</span>
              )}
            </button>
          </div>

          <div className="text-[11px] text-[#667085] text-center pt-2">
            🔒 By continuing, you agree to PharmNexia's{" "}
            <a href="/terms" className="text-[#087A52] font-semibold hover:underline">Terms</a> and{" "}
            <a href="/privacy" className="text-[#087A52] font-semibold hover:underline">Privacy Policy</a> (Indian DPDP compliant).
          </div>
        </form>

      </div>
    </div>
  );
};
