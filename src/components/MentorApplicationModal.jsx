import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Briefcase, 
  Building2, 
  GraduationCap, 
  Tag, 
  Globe, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const MentorApplicationModal = ({ isOpen, onClose, onSuccess }) => {
  const { currentUser, addNotification, addMentor } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentRole: '',
    currentOrg: '',
    qualification: 'B.Pharm, M.Pharm',
    mentorType: 'Industry',
    expertise: 'Pharmacovigilance, Regulatory Affairs, Drug Safety',
    linkedinUrl: '',
    about: '',
    documentName: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Pre-fill user data when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        name: currentUser?.name || prev.name,
        email: currentUser?.email || prev.email
      }));
      setErrorMessage('');
      setIsSubmitted(false);
    }
  }, [isOpen, currentUser]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Safe background scroll lock & cleanup
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Prevent layout shift from scrollbar disappearing
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, documentName: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMessage('Please provide your full name and valid professional email.');
      return;
    }
    if (!formData.currentRole.trim() || !formData.currentOrg.trim()) {
      setErrorMessage('Please specify your current designation and organization.');
      return;
    }
    if (!formData.about.trim()) {
      setErrorMessage('Please provide a brief bio outlining your experience.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Add mentor to AppContext and Supabase mentors table
      if (addMentor) {
        await addMentor({
          name: formData.name,
          email: formData.email,
          currentRole: formData.currentRole,
          currentOrg: formData.currentOrg,
          qualification: formData.qualification,
          mentorType: formData.mentorType,
          about: formData.about,
          expertise: formData.expertise ? formData.expertise.split(',').map(s => s.trim()) : [],
          linkedinUrl: formData.linkedinUrl,
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name)}`,
          verificationStatus: 'pending',
          verifiedBadge: false,
          price30: 0,
          price60: 0,
          paymentModel: 'Free',
          availableDays: ["Saturday", "Sunday"],
          availableSlots: ["06:00 PM - 06:30 PM", "07:00 PM - 07:30 PM"]
        });
      }

      // 2. If Supabase is connected, record application in database audit logs
      if (supabase && isSupabaseConfigured) {
        try {
          await supabase.from('audit_logs').insert({
            actor: formData.name,
            action: 'MENTOR_APPLICATION_SUBMITTED',
            target_type: 'MENTOR_APPLICATION',
            details: `Applied as ${formData.mentorType} mentor: ${formData.currentRole} at ${formData.currentOrg}`,
            metadata: {
              email: formData.email,
              qualification: formData.qualification,
              expertise: formData.expertise,
              linkedin: formData.linkedinUrl,
              document: formData.documentName
            }
          });
        } catch (dbErr) {
          console.warn('[PharmNexia DB] Audit log insert notice:', dbErr);
        }
      }

      // 3. Add in-app notification
      if (addNotification) {
        addNotification({
          title: "Mentor Application Received",
          message: "Your application has been submitted to the Academic & Career Council for review.",
          type: "SYSTEM"
        });
      }

      setIsLoading(false);
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Mentor application error:', err);
      setErrorMessage(err.message || 'Failed to submit application. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-[4px] flex items-center justify-center p-3 sm:p-6 overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mentor-modal-title"
    >
      {/* Outer Modal Container: strictly contained within viewport, flex column, overflow hidden */}
      <div 
        className="bg-white rounded-[20px] w-[calc(100vw-24px)] sm:w-[min(900px,calc(100vw-48px))] max-h-[calc(100vh-24px)] sm:max-h-[calc(100vh-48px)] shadow-[0_20px_50px_rgba(0,0,0,0.16)] border border-[#E5E7EB] text-[#111827] animate-modal-pop relative flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ============================================================== */}
        {/* 1. FIXED/STICKY HEADER (Always visible, never scrolls away) */}
        {/* ============================================================== */}
        <div className="flex items-start justify-between gap-4 px-6 sm:px-8 py-5 border-b border-[#F3F4F6] bg-white flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] flex items-center justify-center p-1 shadow-xs flex-shrink-0">
              <img
                src="/logo_emblem.png"
                alt="PharmNexia"
                className="w-full h-full object-contain aspect-square select-none pointer-events-none"
                onError={(e) => {
                  e.currentTarget.src = "https://res.cloudinary.com/axgam8br/image/upload/v1791050025/1000481598.jpg";
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="mentor-modal-title" className="text-lg sm:text-xl font-bold text-[#101828] tracking-tight leading-tight font-heading">
                  Become a Verified Mentor
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#E8F8F1] text-[#00A86B] border border-[#00A86B]/20 font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  Practitioner Network
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-0.5 leading-snug">
                Share your industry experience and guide the next generation of pharmacy aspirants.
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg text-[#667085] hover:text-[#111827] hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ============================================================== */}
        {/* 2. MODAL CONTENT / SUBMITTED SUCCESS STATE */}
        {/* ============================================================== */}
        {isSubmitted ? (
          <div className="flex-1 min-h-0 overflow-y-auto p-8 sm:p-12 text-center space-y-4 max-w-md mx-auto my-auto flex flex-col justify-center items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#E8F8F1] border border-[#00A86B]/30 flex items-center justify-center text-[#00A86B] shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-bold text-[#101828] font-heading">
              Application Submitted!
            </h4>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Thank you for applying to the PharmNexia Practitioner Network. Our Academic & Career Council will verify your credentials and reach out to you via <strong className="text-[#101828]">{formData.email}</strong>.
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-6 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
              >
                Done & Back to Mentors
              </button>
            </div>
          </div>
        ) : (
          <form 
            id="mentor-application-form"
            onSubmit={handleSubmit} 
            className="flex-1 min-h-0 flex flex-col overflow-hidden"
          >
            
            {/* ============================================================ */}
            {/* 3. SCROLLABLE FORM BODY (flex: 1, min-height: 0, overflow-y: auto) */}
            {/* ============================================================ */}
            <div 
              className="flex-1 min-h-0 overflow-y-auto px-6 sm:px-8 py-5 space-y-4 sm:space-y-5"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              
              {/* Error Message Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                  <div className="leading-snug font-medium">{errorMessage}</div>
                </div>
              )}

              {/* Row 1: Full Name | Professional Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 pointer-events-none" />
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g. Dr. Priya Nair"
                      className="w-full h-11 pl-10 pr-3.5 text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] transition-all focus:outline-none focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 hover:border-[#D1D5DB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                    Professional Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 pointer-events-none" />
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="priya.nair@organization.com"
                      className="w-full h-11 pl-10 pr-3.5 text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] transition-all focus:outline-none focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 hover:border-[#D1D5DB]"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Current Role | Organization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                    Current Role / Designation <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Briefcase className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 pointer-events-none" />
                    <input 
                      type="text" 
                      required
                      value={formData.currentRole}
                      onChange={(e) => handleInputChange('currentRole', e.target.value)}
                      placeholder="e.g. Senior Pharmacovigilance Scientist"
                      className="w-full h-11 pl-10 pr-3.5 text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] transition-all focus:outline-none focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 hover:border-[#D1D5DB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                    Organization / College <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Building2 className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 pointer-events-none" />
                    <input 
                      type="text" 
                      required
                      value={formData.currentOrg}
                      onChange={(e) => handleInputChange('currentOrg', e.target.value)}
                      placeholder="e.g. Global Clinical Research / Top Biopharma"
                      className="w-full h-11 pl-10 pr-3.5 text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] transition-all focus:outline-none focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 hover:border-[#D1D5DB]"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Qualification | Mentor Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                    Academic Qualification <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <GraduationCap className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 pointer-events-none" />
                    <input 
                      type="text" 
                      required
                      value={formData.qualification}
                      onChange={(e) => handleInputChange('qualification', e.target.value)}
                      placeholder="e.g. B.Pharm, M.Pharm (NIPER)"
                      className="w-full h-11 pl-10 pr-3.5 text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] transition-all focus:outline-none focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 hover:border-[#D1D5DB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                    Mentor Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.mentorType}
                    onChange={(e) => handleInputChange('mentorType', e.target.value)}
                    className="w-full h-11 px-3 text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#111827] transition-all focus:outline-none focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 hover:border-[#D1D5DB]"
                  >
                    <option value="Industry">Industry Professional</option>
                    <option value="Faculty">Faculty / Professor</option>
                    <option value="Alumni">Alumni Practitioner</option>
                    <option value="Researchers">PhD / Research Scholar</option>
                    <option value="Exam/Entrance Mentors">Exam Topper (GPAT / NIPER / CAT)</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Expertise Areas | LinkedIn URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                    Expertise Areas (comma separated)
                  </label>
                  <div className="relative flex items-center">
                    <Tag className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 pointer-events-none" />
                    <input 
                      type="text" 
                      value={formData.expertise}
                      onChange={(e) => handleInputChange('expertise', e.target.value)}
                      placeholder="e.g. Pharmacovigilance, Argus Safety, Regulatory Affairs"
                      className="w-full h-11 pl-10 pr-3.5 text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] transition-all focus:outline-none focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 hover:border-[#D1D5DB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                    LinkedIn / Profile URL (optional)
                  </label>
                  <div className="relative flex items-center">
                    <Globe className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 pointer-events-none" />
                    <input 
                      type="url" 
                      value={formData.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full h-11 pl-10 pr-3.5 text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] transition-all focus:outline-none focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 hover:border-[#D1D5DB]"
                    />
                  </div>
                </div>
              </div>

              {/* Full width: Short Bio */}
              <div>
                <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                  Short Bio & Mentorship Overview <span className="text-rose-500">*</span>
                </label>
                <textarea 
                  rows={3}
                  required
                  value={formData.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  placeholder="Briefly describe your career journey, milestones, and how you can guide pharmacy students..."
                  className="w-full min-h-[96px] p-3 text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] transition-all focus:outline-none focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 hover:border-[#D1D5DB] resize-none"
                />
              </div>

              {/* Full width: Clean Credentials / Document upload */}
              <div>
                <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                  Credential Verification Document (optional)
                </label>
                <div className="border border-dashed border-[#D1D5DB] rounded-xl p-3.5 bg-[#F8FAF9] hover:bg-[#F3F4F6] transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#00A86B] flex-shrink-0">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 truncate">
                      <p className="text-xs font-semibold text-[#101828] truncate">
                        {formData.documentName || "Degree certificate, college ID or employer badge"}
                      </p>
                      <p className="text-[11px] text-[#667085]">
                        PDF, JPG, or PNG up to 10MB (Encrypted & Private)
                      </p>
                    </div>
                  </div>
                  <label className="cursor-pointer px-3.5 py-1.5 text-xs font-semibold bg-white border border-[#E5E7EB] rounded-lg text-[#111827] hover:bg-gray-50 transition-colors flex-shrink-0">
                    Browse
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Privacy Protocol Notice */}
              <div className="p-3 bg-[#E8F8F1] rounded-xl border border-[#00A86B]/20 text-[11.5px] text-[#087A52] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00A86B] flex-shrink-0" />
                <span>
                  <strong>Academic Privacy Protocol:</strong> Mentor documents are securely stored and verified solely by the Academic & Career Council.
                </span>
              </div>

            </div>

            {/* ============================================================ */}
            {/* 4. FIXED/STICKY FOOTER (Always visible, Submit never cut off) */}
            {/* ============================================================ */}
            <div className="flex-shrink-0 px-6 sm:px-8 py-4 border-t border-[#F3F4F6] bg-[#F8FAF9] flex items-center justify-between sm:justify-end gap-3 z-10">
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#4B5563] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="h-11 px-6 sm:px-7 rounded-xl bg-[#00A86B] hover:bg-[#087A52] active:bg-[#066343] text-white font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer btn-primary-action"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <span>Submit Application</span>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default MentorApplicationModal;
