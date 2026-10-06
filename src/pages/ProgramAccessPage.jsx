import React from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Video, 
  ExternalLink, 
  ShieldCheck, 
  Lock, 
  AlertCircle,
  Copy,
  Check,
  Share2,
  Download
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { FadeUp } from '../components/Animation';

export const ProgramAccessPage = ({ programId, onNavigate }) => {
  const { programs, currentUser, enrolledProgramIds, programRegistrations = [] } = useApp();
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState(false);

  const program = programs.find(p => p.id === programId) || programs[0];
  
  // Registration verification
  const isEnrolledInContext = enrolledProgramIds.includes(program?.id);
  const confirmedRegistration = programRegistrations.find(
    r => r.programId === program?.id && (r.studentId === currentUser?.id || r.studentEmail === currentUser?.email)
  );

  const hasAccess = Boolean(isEnrolledInContext || confirmedRegistration);

  const registrationCode = confirmedRegistration?.registrationCode || `PHN-REG-${String(Math.abs((program?.id || 'prog').split('').reduce((a, b) => a + b.charCodeAt(0), 1000) % 900000) + 100000).padStart(6, '0')}`;
  const meetUrl = program?.googleMeetUrl || confirmedRegistration?.googleMeetUrl || `https://meet.google.com/phn-${program?.id || 'live'}`;

  // If user is not logged in or not registered
  if (!currentUser || !hasAccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#101828] font-heading">Event Access Restricted</h2>
          <p className="text-sm text-[#667085] max-w-md mx-auto leading-relaxed">
            You don't have confirmed registration access for <strong>"{program?.title}"</strong>.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] text-left max-w-md mx-auto space-y-3 text-xs text-[#475467]">
          <div className="flex items-center gap-2 text-[#101828] font-semibold">
            <AlertCircle className="w-4 h-4 text-[#00A86B]" />
            <span>How to get access?</span>
          </div>
          <p>
            1. Visit the program details page and click <strong>Register Now</strong>.
          </p>
          <p>
            2. Complete the registration/payment. Your verified Google Meet link and entry ticket will automatically activate here.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => onNavigate(`/programs/${program?.id || ''}`)}
            className="px-6 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white text-xs font-semibold shadow-sm transition"
          >
            Register Now →
          </button>
          <button
            onClick={() => onNavigate('/programs')}
            className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-[#111827] text-xs font-semibold hover:bg-[#F8FAF9] transition"
          >
            Browse Other Programs
          </button>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white text-[#111827]">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate(`/programs/${program.id}`)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#00A86B] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Program Overview</span>
        </button>
      </div>

      {/* Confirmed Access Banner */}
      <FadeUp>
        <div className="p-8 sm:p-10 rounded-3xl bg-[#F8FAF9] border border-[#00A86B]/30 shadow-sm relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F8F1] text-[#087A52] flex items-center justify-center border border-[#00A86B]/20 flex-shrink-0">
                <CheckCircle2 className="w-7 h-7 text-[#00A86B]" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#087A52] bg-[#E8F8F1] px-2.5 py-0.5 rounded-full border border-[#00A86B]/20">
                  Confirmed Registration
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-[#101828] font-heading mt-1">
                  You're Registered for Live Event!
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-[#101828] font-bold flex items-center gap-2">
                <span>ID: {registrationCode}</span>
                <button
                  onClick={() => copyToClipboard(registrationCode, 'id')}
                  className="text-[#00A86B] hover:text-[#087A52]"
                  title="Copy Registration ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </span>
            </div>
          </div>

          {/* Event Details Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-[#101828] font-heading">{program.title}</h2>
                <p className="text-xs text-[#667085] mt-1 line-clamp-2">{program.overview}</p>
              </div>

              <div className="space-y-2.5 text-xs text-[#475467]">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#00A86B]" />
                  <span>Date: <strong className="text-[#101828]">{program.startDate}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#00A86B]" />
                  <span>Time: <strong className="text-[#101828]">{program.schedule} ({program.duration})</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
                  <span>Instructor: <strong className="text-[#101828]">{program.leadMentor}</strong></span>
                </div>
              </div>
            </div>

            {/* Google Meet Activation Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#101828] uppercase font-mono tracking-wider">
                  <Video className="w-4 h-4 text-[#00A86B]" />
                  <span>Live Video Conference</span>
                </div>
                <p className="text-xs text-[#667085]">
                  Google Meet link is verified and ready. The room admits attendees 5 minutes before scheduled start time.
                </p>
              </div>

              <div className="space-y-2.5">
                <a
                  href={meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 btn-primary-action"
                >
                  <Video className="w-4 h-4 stroke-[2.5]" />
                  <span>Join Google Meet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => copyToClipboard(meetUrl, 'link')}
                  className="w-full py-2 rounded-xl border border-[#E5E7EB] hover:border-[#00A86B] bg-white text-[#475467] text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-[#00A86B]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Google Meet Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Guidelines Box */}
          <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#667085] flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#00A86B] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#101828]">Attendee Guidelines:</strong> Please ensure your audio and microphone are connected. Keep your PharmNexia Registration ID (<span className="font-mono text-[#00A86B]">{registrationCode}</span>) handy for attendance and post-session capstone certificate issuance.
            </div>
          </div>

        </div>
      </FadeUp>

    </div>
  );
};
