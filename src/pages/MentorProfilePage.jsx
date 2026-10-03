import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Star, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Briefcase, 
  GraduationCap, 
  Award, 
  ExternalLink,
  Lock,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { BookingModal } from '../components/BookingModal';

export const MentorProfilePage = ({ mentorId, onNavigate }) => {
  const { mentors } = useApp();
  const [selectedSessionDuration, setSelectedSessionDuration] = useState(30);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Find mentor by id (fallback to first mentor if not found)
  const mentor = mentors.find(m => m.id === mentorId) || mentors[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 bg-white text-[#111827]">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate('/mentors')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#667085] hover:text-[#00A86B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Mentors Directory</span>
        </button>
      </div>

      {/* Hero Profile Header Card */}
      <div className="p-8 rounded-3xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
          <div className="relative">
            <img 
              src={mentor.avatarUrl} 
              alt={mentor.name} 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-[#00A86B] shadow-sm"
            />
            {mentor.verifiedBadge && (
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#00A86B] text-white shadow" title="Verified Practitioner">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828] tracking-tight font-heading">
                {mentor.name}
              </h1>
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20 font-medium">
                {mentor.mentorType}
              </span>
            </div>

            <p className="text-sm font-semibold text-[#087A52]">
              {mentor.currentRole}
            </p>
            <p className="text-xs text-[#667085]">
              {mentor.currentOrg}
            </p>

            <div className="flex items-center gap-4 pt-1.5 text-xs text-[#667085]">
              <div className="flex items-center gap-1 font-bold text-[#101828]">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{mentor.rating}</span>
                <span className="text-[#667085] font-normal">({mentor.reviewCount} verified reviews)</span>
              </div>
              <span className="text-[#E5E7EB]">•</span>
              <span className="text-[#667085] font-mono">
                {mentor.sessionsCompleted} sessions completed
              </span>
            </div>
          </div>
        </div>

        {/* Quick Booking Action Box */}
        <div className="w-full md:w-auto p-5 rounded-2xl bg-white border border-[#E5E7EB] text-center space-y-3 flex-shrink-0 relative z-10 shadow-sm">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#667085]">Starting Fee</div>
          <div className="text-2xl font-black text-[#101828] font-mono">
            {mentor.price30 === 0 ? 'FREE' : `₹${mentor.price30}`}
            <span className="text-xs font-normal text-[#667085] font-sans"> / 30 mins</span>
          </div>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="w-full px-6 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition duration-200"
          >
            Book 1-on-1 Session
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Bio, Journey, What I Can Help With, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Section */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-3">
            <h2 className="text-base font-bold text-[#101828] font-heading">About {mentor.name}</h2>
            <p className="text-xs text-[#667085] leading-relaxed">
              {mentor.about}
            </p>
          </div>

          {/* Education & Qualifications */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#00A86B]" />
              <h2 className="text-base font-bold text-[#101828] font-heading">Education & Academic Background</h2>
            </div>
            
            <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-xs space-y-1">
              <div className="font-bold text-[#101828]">{mentor.qualification}</div>
              <div className="text-[#667085] font-mono text-[11px]">{mentor.previousEducation}</div>
            </div>

            {/* Credential verification proof notice */}
            <div className="p-3.5 bg-[#E8F8F1] rounded-xl border border-[#00A86B]/20 text-[11px] text-[#087A52] flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#00A86B] flex-shrink-0" />
              <span>
                <strong className="text-[#087A52]">Verified Credentials:</strong> Academic degrees and professional affiliations vetted via PharmNexia verification protocol ({mentor.credentialProof}).
              </span>
            </div>
          </div>

          {/* Career Journey */}
          {mentor.careerJourney && mentor.careerJourney.length > 0 && (
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#00A86B]" />
                <h2 className="text-base font-bold text-[#101828] font-heading">Career Journey & Milestones</h2>
              </div>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-[#E5E7EB] pl-6">
                {mentor.careerJourney.map((milestone, idx) => (
                  <div key={idx} className="relative">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#00A86B] border-2 border-white absolute -left-6 top-1 shadow-sm" />
                    <div className="text-xs text-[#111827] font-medium leading-relaxed">{milestone}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What I Can Help With */}
          {mentor.whatICanHelpWith && mentor.whatICanHelpWith.length > 0 && (
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-3">
              <h2 className="text-base font-bold text-[#101828] font-heading">What I Can Help You With</h2>
              <div className="space-y-2.5">
                {mentor.whatICanHelpWith.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#111827]">
                    <CheckCircle2 className="w-4 h-4 text-[#00A86B] flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student Reviews */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#00A86B]" />
                <h2 className="text-base font-bold text-[#101828] font-heading">Mentee Reviews</h2>
              </div>
              <span className="text-xs text-[#667085] font-mono">{mentor.reviewCount} total reviews</span>
            </div>

            <div className="space-y-3">
              {mentor.reviews?.map(rev => (
                <div key={rev.id} className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-bold text-[#101828]">{rev.studentName}</div>
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#667085] leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                  <div className="text-[10px] text-[#667085] font-mono">{rev.date}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Availability, Session Options & Privacy Protection */}
        <div className="space-y-6">
          
          {/* Session Booking Options Card */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-5">
            <h3 className="font-bold text-[#101828] text-sm font-heading">Session Options</h3>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setSelectedSessionDuration(30)}
                className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                  selectedSessionDuration === 30 
                    ? 'border-[#00A86B] bg-[#E8F8F1] ring-1 ring-[#00A86B]' 
                    : 'border-[#E5E7EB] bg-[#F8FAF9] hover:border-[#00A86B]/40'
                }`}
              >
                <div>
                  <div className="font-bold text-[#101828] text-xs">30 Minutes 1-on-1</div>
                  <div className="text-[11px] text-[#667085]">Roadmap clarity & strategy review</div>
                </div>
                <div className="text-sm font-extrabold text-[#087A52] font-mono">
                  {mentor.price30 === 0 ? 'FREE' : `₹${mentor.price30}`}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSessionDuration(60)}
                className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                  selectedSessionDuration === 60 
                    ? 'border-[#00A86B] bg-[#E8F8F1] ring-1 ring-[#00A86B]' 
                    : 'border-[#E5E7EB] bg-[#F8FAF9] hover:border-[#00A86B]/40'
                }`}
              >
                <div>
                  <div className="font-bold text-[#101828] text-xs">60 Minutes Deep-Dive</div>
                  <div className="text-[11px] text-[#667085]">Detailed mock interview & CV review</div>
                </div>
                <div className="text-sm font-extrabold text-[#087A52] font-mono">
                  {mentor.price60 === 0 ? 'FREE' : `₹${mentor.price60}`}
                </div>
              </button>
            </div>

            {/* Availability preview */}
            <div className="pt-3 border-t border-[#E5E7EB] space-y-2.5 text-xs">
              <div className="font-semibold text-[#101828]">Regular Availability:</div>
              <div className="flex flex-wrap gap-1.5">
                {mentor.availableDays?.map(d => (
                  <span key={d} className="px-2.5 py-1 rounded-md bg-[#F8FAF9] text-[#667085] border border-[#E5E7EB] text-[11px] font-medium">
                    {d}
                  </span>
                ))}
              </div>
              <div className="text-[11px] text-[#667085] flex items-center gap-1.5 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#00A86B]" />
                <span>Slots typically: {mentor.availableSlots?.[0]}</span>
              </div>
            </div>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full py-3 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition duration-200"
            >
              Choose Slot & Book Now
            </button>
          </div>

          {/* Privacy Guarantee Notice */}
          <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] space-y-2.5 text-xs text-[#667085]">
            <div className="flex items-center gap-2 font-bold text-[#101828]">
              <Lock className="w-4 h-4 text-[#00A86B]" />
              <span>Direct Privacy Protocol</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#667085]">
              In accordance with PharmNexia platform security guidelines, private phone numbers and banking coordinates are never shared. All sessions are conducted via secure, recorded virtual rooms with verified attendance.
            </p>
          </div>

        </div>

      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal 
          mentor={mentor} 
          onClose={() => setIsBookingModalOpen(false)}
          onNavigateToDashboard={onNavigate}
        />
      )}

    </div>
  );
};
