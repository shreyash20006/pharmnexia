import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { AppLoadingScreen } from './AppLoadingScreen';

/**
 * Reusable Protected Route Guard for PharmNexia
 * Handles:
 * - AUTH_LOADING
 * - UNAUTHENTICATED
 * - PROFILE_LOADING
 * - PROFILE_ERROR
 * - Role Authorization (403 Access Denied)
 */
export const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  onNavigate 
}) => {
  const { 
    currentUser, 
    authStatus = 'AUTH_LOADING', 
    profileStatus = 'PROFILE_LOADED', 
    profileError,
    retryProfileLoad
  } = useApp();

  // 1. Auth is initializing
  if (authStatus === 'AUTH_LOADING') {
    return <AppLoadingScreen message="Verifying session credentials..." />;
  }

  // 2. User is unauthenticated
  if (authStatus === 'UNAUTHENTICATED' || !currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4 animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl bg-[#E8F8F1] text-[#00A86B] flex items-center justify-center mx-auto border border-[#00A86B]/20">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#101828] font-heading">
          Sign In Required
        </h2>
        <p className="text-xs text-[#667085] leading-relaxed max-w-sm mx-auto">
          Please sign in to your PharmNexia account to access your personalized workspace, mentorship sessions, and programs.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => onNavigate && onNavigate('/auth?mode=login')}
            className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white text-xs font-semibold shadow-sm transition"
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate && onNavigate('/auth?mode=signup')}
            className="px-5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] text-[#111827] text-xs font-semibold transition"
          >
            Register Free
          </button>
        </div>
      </div>
    );
  }

  // 3. Profile is loading from Supabase DB
  if (profileStatus === 'PROFILE_LOADING') {
    return <AppLoadingScreen message="Synchronizing institutional profile & role..." />;
  }

  // 4. Profile query encountered an error
  if (profileStatus === 'PROFILE_ERROR') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4 animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#101828] font-heading">
          Unable to Load Profile
        </h2>
        <p className="text-xs text-[#667085] leading-relaxed max-w-sm mx-auto">
          {profileError || 'We encountered a momentary delay connecting to the database. Your session is active.'}
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => retryProfileLoad && retryProfileLoad()}
            className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white text-xs font-semibold shadow-sm transition flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Profile Load</span>
          </button>
          <button
            onClick={() => onNavigate && onNavigate('/')}
            className="px-5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] text-[#111827] text-xs font-semibold transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // 5. Role Authorization Check (if specific roles are restricted)
  if (allowedRoles.length > 0) {
    const currentRole = (currentUser.staffRole || currentUser.role || 'STUDENT').toUpperCase();
    const hasRole = allowedRoles.map(r => r.toUpperCase()).includes(currentRole);

    if (!hasRole) {
      return (
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4 animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#101828] font-heading">
            Access Restricted (403)
          </h2>
          <p className="text-xs text-[#667085] leading-relaxed max-w-sm mx-auto">
            You do not have administrative permissions to view this console. Your account role is{' '}
            <strong className="text-[#101828] font-mono">{currentRole}</strong>.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate('/dashboard')}
              className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white text-xs font-semibold shadow-sm transition flex items-center gap-2"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Go to My Dashboard</span>
            </button>
            <button
              onClick={() => onNavigate && onNavigate('/')}
              className="px-5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] text-[#111827] text-xs font-semibold transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }
  }

  // 6. Authorized
  return children;
};

export default ProtectedRoute;
