import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Global Modal Component for PharmNexia
 * 
 * Size Variants:
 * - 'sm': ~380–420px (Login, Confirmation dialogs, Alerts)
 * - 'md': ~520–650px (Booking, Profile editing, Quick forms)
 * - 'lg': ~760–900px (Become a Mentor application, Complex CMS creation forms)
 */
export const Modal = ({
  isOpen,
  onClose,
  size = 'md', // 'sm' | 'md' | 'lg'
  title,
  subtitle,
  icon,
  children,
  headerAction,
  showClose = true,
  className = '',
  bodyClassName = ''
}) => {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Max width classes based on size variant
  const sizeClasses = {
    sm: 'max-w-[410px]',
    md: 'max-w-[580px]',
    lg: 'max-w-[860px]'
  }[size] || 'max-w-[580px]';

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#0F172A]/35 backdrop-blur-[4px] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className={`bg-white rounded-[20px] w-full ${sizeClasses} shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-[#E5E7EB] p-6 sm:p-7 md:p-8 text-[#111827] animate-modal-pop relative my-auto max-h-[85vh] flex flex-col ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header (if title or custom header provided) */}
        {(title || icon || showClose || headerAction) && (
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F3F4F6] flex-shrink-0 mb-5">
            <div className="flex items-center gap-3 min-w-0">
              {icon && (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] flex items-center justify-center p-1.5 flex-shrink-0 shadow-xs">
                  {icon}
                </div>
              )}
              <div className="min-w-0">
                {title && (
                  <h3 className="text-lg sm:text-xl font-bold text-[#101828] tracking-tight leading-tight truncate">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs text-[#667085] mt-0.5 leading-snug">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {headerAction}
              {showClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="w-8 h-8 rounded-lg text-[#667085] hover:text-[#111827] hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Modal Content */}
        <div className={`overflow-y-auto flex-1 pr-0.5 ${bodyClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
