import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { PharmNexiaLogo } from './PharmNexiaLogo';

/**
 * Global React Error Boundary for PharmNexia
 * Prevents blank white screens of death when any component fails during render.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[PharmNexia ErrorBoundary] Uncaught runtime exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onNavigate) {
      this.props.onNavigate('/');
    } else {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback prop if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[500px] flex items-center justify-center p-6 bg-white text-[#111827]">
          <div className="max-w-md w-full bg-[#F8FAF9] rounded-3xl p-8 border border-[#E5E7EB] shadow-sm text-center space-y-5 animate-fadeIn">
            {/* Logo / Header */}
            <div className="flex justify-center mb-2">
              <PharmNexiaLogo size="modal" theme="light" />
            </div>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <AlertTriangle className="w-7 h-7" />
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#101828] font-heading">
                Something went wrong
              </h2>
              <p className="text-xs text-[#667085] leading-relaxed">
                An unexpected interface error occurred. Your account session, bookings, and data remain safe.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] text-[#111827] text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <Home className="w-3.5 h-3.5 text-[#00A86B]" />
                <span>Go Home</span>
              </button>
            </div>

            {/* Development Debug Info */}
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-left text-[11px] font-mono text-red-800 overflow-x-auto max-h-40">
                <div className="font-bold mb-1">{this.state.error.toString()}</div>
                <div className="whitespace-pre-wrap text-[10px] text-red-600">
                  {this.state.errorInfo?.componentStack}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
