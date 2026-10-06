import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Award, 
  Briefcase, 
  Bookmark, 
  FileText, 
  User, 
  Settings, 
  Video, 
  Calendar, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Edit3,
  Camera,
  LogOut,
  Sparkles,
  X,
  MessageSquare,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { CertificateViewer } from '../components/CertificateViewer';
import { MentorCalendarManager } from '../components/MentorCalendarManager';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const StudentDashboard = ({ onNavigate }) => {
  const { 
    currentUser, 
    bookings, 
    certificates, 
    programs, 
    enrolledProgramIds, 
    opportunities, 
    savedOpportunityIds,
    updateStudentProfile,
    cancelBooking,
    supportTickets = []
  } = useApp();

  const [copiedId, setCopiedId] = useState(null);

  // Redirect / prompt if not signed in
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#E8F8F1] text-[#00A86B] flex items-center justify-center mx-auto">
          <LayoutDashboard className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#101828] font-heading">Sign In Required</h2>
        <p className="text-xs text-[#667085] leading-relaxed">
          Please sign in or create an account to view your scheduled mentorships, enrolled programs, certificates, and student dashboard.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('/auth?mode=login')}
            className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white text-xs font-semibold shadow-sm transition"
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate('/auth?mode=signup')}
            className="px-5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] text-[#111827] text-xs font-semibold transition"
          >
            Register Free
          </button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'mentorships' | 'programs' | 'certificates' | 'applications' | 'saved' | 'profile'
  const [activeVideoRoomBooking, setActiveVideoRoomBooking] = useState(null);
  const [selectedCertForView, setSelectedCertForView] = useState(null);

  // Edit Profile Form state (Clean - uses real logged in user)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profCollege, setProfCollege] = useState(currentUser?.college || "");
  const [profDegree, setProfDegree] = useState(currentUser?.degree || "B.Pharm");
  const [profYear, setProfYear] = useState(currentUser?.year || "1st Year");
  const [profBio, setProfBio] = useState(currentUser?.bio || "");

  // Synchronize profile form state whenever currentUser updates from DB
  useEffect(() => {
    if (currentUser) {
      setProfCollege(currentUser.college || "");
      setProfDegree(currentUser.degree || "B.Pharm");
      setProfYear(currentUser.year || "1st Year");
      setProfBio(currentUser.bio || "");
    }
  }, [currentUser]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateStudentProfile({
      college: profCollege,
      degree: profDegree,
      year: profYear,
      bio: profBio
    });
    setIsEditingProfile(false);
  };

  // Find enrolled programs objects defensively
  const enrolledProgsList = (programs || []).filter(p => (enrolledProgramIds || []).includes(p?.id));
  const savedOppsList = (opportunities || []).filter(o => (savedOpportunityIds || []).includes(o?.id));
  const studentCertificates = (certificates || []).filter(c => {
    if (!currentUser?.name || !c?.studentName) return false;
    const studentFirst = currentUser.name.trim().toLowerCase().split(' ')[0];
    return c.studentName.toLowerCase().includes(studentFirst);
  });

  const upcomingBooking = (bookings || []).find(b => b?.status === 'CONFIRMED');

  const userTickets = (supportTickets || []).filter(t => 
    t?.userId === currentUser?.id || t?.userPharmNexiaId === currentUser?.pharmNexiaId || t?.userEmail === currentUser?.email
  );

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'calendar', label: 'Mentor Google Calendar', icon: Calendar, badge: 'Meet Sync' },
    { id: 'mentorships', label: 'My Mentorships', icon: Users, badge: bookings.length },
    { id: 'programs', label: 'My Programs', icon: BookOpen, badge: enrolledProgramIds.length },
    { id: 'certificates', label: 'My Certificates', icon: Award, badge: studentCertificates.length },
    { id: 'support', label: 'Support Desk', icon: MessageSquare, badge: `${userTickets.length} Tickets` },
    { id: 'applications', label: 'My Applications', icon: Briefcase, badge: '0 Active' },
    { id: 'saved', label: 'Saved Opportunities', icon: Bookmark, badge: savedOpportunityIds.length },
    { id: 'profile', label: 'Student Profile', icon: User },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-white text-[#111827]">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F8FAF9] p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center gap-4">
          <img 
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"} 
            alt={currentUser?.name} 
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#00A86B] shadow-sm"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-[#101828] font-heading">{currentUser?.name || 'Student Portal'}</h1>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20 font-bold flex items-center gap-1.5">
                <span>{currentUser?.pharmNexiaId || 'PHN-STU-001247'}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentUser?.pharmNexiaId || 'PHN-STU-001247');
                    setCopiedId('header-id');
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="hover:text-[#00A86B] text-emerald-600 focus:outline-none"
                  title="Copy Student ID"
                >
                  {copiedId === 'header-id' ? <Check className="w-3 h-3 text-[#00A86B]" /> : <Copy className="w-3 h-3" />}
                </button>
              </span>
            </div>
            <p className="text-xs text-[#667085] mt-0.5">
              {currentUser?.college ? `${currentUser.college} • ` : ''}{currentUser?.degree || 'B.Pharm'} ({currentUser?.year || '3rd Year'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('/mentors')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Book New Mentor</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar & Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1 bg-[#F8FAF9] p-3 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                  isActive 
                    ? 'bg-[#00A86B] text-white font-semibold shadow-sm' 
                    : 'text-[#667085] hover:bg-white hover:text-[#111827]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#00A86B]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-[#667085] border border-[#E5E7EB]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Panel */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* TAB: MENTOR GOOGLE CALENDAR & MEET INTEGRATION */}
          {activeTab === 'calendar' && (
            <MentorCalendarManager onNavigate={onNavigate} />
          )}

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
                  <div className="text-[10px] uppercase font-mono text-[#667085]">Upcoming Sessions</div>
                  <div className="text-2xl font-black text-[#101828] mt-1 font-mono">{bookings.filter(b => b.status === 'CONFIRMED').length}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
                  <div className="text-[10px] uppercase font-mono text-[#667085]">Enrolled Programs</div>
                  <div className="text-2xl font-black text-[#101828] mt-1 font-mono">{enrolledProgramIds.length}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
                  <div className="text-[10px] uppercase font-mono text-[#667085]">Certificates Earned</div>
                  <div className="text-2xl font-black text-[#087A52] mt-1 font-mono">{studentCertificates.length}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
                  <div className="text-[10px] uppercase font-mono text-[#667085]">Saved Openings</div>
                  <div className="text-2xl font-black text-[#101828] mt-1 font-mono">{savedOpportunityIds.length}</div>
                </div>
              </div>

              {/* UPCOMING MENTORSHIP SESSION CARD (Highlighted) */}
              {upcomingBooking ? (
                <div className="p-6 rounded-2xl bg-[#F8FAF9] text-[#111827] border border-[#00A86B]/30 shadow-sm relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={upcomingBooking.mentorAvatar} 
                        alt={upcomingBooking.mentorName} 
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-[#00A86B]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#087A52] bg-[#E8F8F1] px-2.5 py-0.5 rounded-full border border-[#00A86B]/20 font-semibold">
                            Upcoming 1-on-1 Mentorship
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#101828] mt-1 font-heading">{upcomingBooking.mentorName}</h3>
                        <p className="text-xs text-[#667085]">{upcomingBooking.mentorRole}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#087A52]">
                          <span className="flex items-center gap-1 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-[#00A86B]" />
                            <span>{upcomingBooking.scheduledDate}</span>
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5 text-[#00A86B]" />
                            <span>{upcomingBooking.scheduledTime} ({upcomingBooking.sessionDuration}m)</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setActiveVideoRoomBooking(upcomingBooking)}
                        className="px-6 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-2"
                      >
                        <Video className="w-4 h-4 stroke-[2.5]" />
                        <span>Join Secure Room</span>
                      </button>

                      <button
                        onClick={() => cancelBooking(upcomingBooking.id)}
                        className="text-[11px] text-[#667085] hover:text-rose-600 transition text-center"
                      >
                        Cancel / Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-white border border-[#E5E7EB] text-center space-y-3 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#F8FAF9] text-[#00A86B] flex items-center justify-center mx-auto border border-[#E5E7EB]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#101828] font-heading">No Upcoming Mentorship Sessions</h3>
                  <p className="text-xs text-[#667085] max-w-sm mx-auto">
                    Get first-hand clarity on CAT, GPAT, or corporate Pharmacovigilance by connecting with an alumnus today.
                  </p>
                  <button
                    onClick={() => onNavigate('/mentors')}
                    className="px-4 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm"
                  >
                    Find a Mentor
                  </button>
                </div>
              )}

              {/* Active Programs & Certificates Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Enrolled Programs */}
                <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#101828] font-heading">Enrolled Cohorts</h3>
                    <button onClick={() => setActiveTab('programs')} className="text-xs text-[#087A52] font-semibold hover:underline">
                      View all
                    </button>
                  </div>

                  {enrolledProgsList.map(prog => (
                    <div key={prog.id} className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] space-y-1 text-xs">
                      <div className="font-bold text-[#101828]">{prog.title}</div>
                      <div className="text-[11px] text-[#667085] font-mono">{prog.schedule} • {prog.mode}</div>
                      <div className="pt-1 flex items-center justify-between text-[11px]">
                        <span className="text-[#087A52] font-semibold">Active Enrollment</span>
                        <button onClick={() => onNavigate(`/programs/${prog.id}`)} className="text-[#00A86B] font-bold hover:underline">
                          View Syllabus →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Certificates */}
                <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#101828] font-heading">My Certificates</h3>
                    <button onClick={() => setActiveTab('certificates')} className="text-xs text-[#087A52] font-semibold hover:underline">
                      View all
                    </button>
                  </div>

                  {studentCertificates.map(cert => (
                    <div key={cert.certificateId} className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-[#101828]">{cert.programName}</div>
                        <div className="text-[11px] font-mono text-[#087A52]">{cert.certificateId}</div>
                      </div>
                      <button
                        onClick={() => setSelectedCertForView(cert)}
                        className="px-3 py-1.5 rounded-lg bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[11px] shadow-sm"
                      >
                        Verify
                      </button>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* TAB: MENTORSHIPS */}
          {activeTab === 'mentorships' && (
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#101828] font-heading">My Mentorship Bookings</h2>
                  <p className="text-xs text-[#667085]">Scheduled 1-on-1 private advisory sessions</p>
                </div>
                <button
                  onClick={() => onNavigate('/mentors')}
                  className="px-4 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm"
                >
                  Book New Session
                </button>
              </div>

              <div className="space-y-4">
                {bookings.map(b => (
                  <div key={b.id} className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <img 
                        src={b.mentorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(b.mentorName || 'Mentor')}`} 
                        alt={b.mentorName} 
                        className="w-12 h-12 rounded-xl object-cover border border-[#00A86B]" 
                      />
                      <div>
                        <div className="font-bold text-[#101828] text-sm">{b.mentorName}</div>
                        <div className="text-[#667085]">{b.mentorRole}</div>
                        <div className="font-mono text-[#087A52] text-[11px] mt-0.5">
                          {b.scheduledDate} at {b.scheduledTime} ({b.sessionDuration}m)
                        </div>
                        {b.paymentAmount > 0 && (
                          <div className="text-[10px] text-[#667085] mt-0.5 font-mono">
                            Paid ₹{b.paymentAmount} • {b.paymentId ? `Razorpay: ${b.paymentId}` : 'Verified'}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        b.status === 'CONFIRMED' ? 'bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20' : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}>
                        {b.status}
                      </span>
                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => setActiveVideoRoomBooking(b)}
                          className="px-4 py-2 rounded-lg bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <Video className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Join Meeting</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PROGRAMS */}
          {activeTab === 'programs' && (
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#101828] font-heading">Enrolled Skill Cohorts</h2>
                <p className="text-xs text-[#667085]">Live weekend masterclasses and capstone assessments</p>
              </div>

              <div className="space-y-4">
                {enrolledProgsList.map(prog => (
                  <div key={prog.id} className="p-5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#087A52] bg-[#E8F8F1] px-2.5 py-0.5 rounded-full border border-[#00A86B]/20">{prog.category}</span>
                      <span className="font-mono text-[#667085]">Next session: {prog.schedule}</span>
                    </div>

                    <h3 className="font-bold text-[#101828] text-sm font-heading">{prog.title}</h3>
                    <p className="text-xs text-[#667085]">{prog.overview}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB] text-xs">
                      <span className="text-[#667085]">Instructor: <strong className="text-[#101828]">{prog.leadMentor}</strong></span>
                      <button 
                        onClick={() => onNavigate(`/programs/${prog.id}`)}
                        className="px-4 py-1.5 rounded-lg bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm"
                      >
                        Enter Learning Portal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#101828] font-heading">My Verifiable Credentials</h2>
                <p className="text-xs text-[#667085]">Share your digital proof of skill with recruiters on LinkedIn</p>
              </div>

              <div className="space-y-4">
                {studentCertificates.map(cert => (
                  <div key={cert.certificateId} className="p-5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 text-[#087A52] font-bold mb-1">
                        <CheckCircle2 className="w-4 h-4 text-[#00A86B]" />
                        <span>{cert.status}</span>
                      </div>
                      <h3 className="font-bold text-[#101828] text-sm font-heading">{cert.programName}</h3>
                      <div className="font-mono text-[#667085] mt-0.5">ID: {cert.certificateId} • Issued: {cert.issueDate}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedCertForView(cert)}
                        className="px-4 py-2 rounded-lg bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition"
                      >
                        Inspect Certificate
                      </button>
                      <button
                        onClick={() => onNavigate(`/verify-certificate/${cert.certificateId}`)}
                        className="px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] font-semibold text-xs hover:border-[#00A86B] transition font-mono"
                      >
                        Public Link
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#101828] font-heading">My Opportunity Applications</h2>
                <p className="text-xs text-[#667085]">Track internship and fellowship review status</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-[10px] text-[#087A52] uppercase font-bold">In Review</span>
                  <div className="font-bold text-[#101828] text-sm mt-0.5 font-heading">Graduate Drug Safety Associate Intern</div>
                  <div className="text-[#667085]">Global Health CRO Solutions • Applied Oct 01, 2026</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  Profile Shared with HR
                </span>
              </div>
            </div>
          )}

          {/* TAB: SAVED OPPORTUNITIES */}
          {activeTab === 'saved' && (
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#101828] font-heading">Saved Opportunities</h2>
                <p className="text-xs text-[#667085]">Bookmarked openings to apply before deadlines</p>
              </div>

              <div className="space-y-3">
                {savedOppsList.map(opp => (
                  <div key={opp.id} className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#101828] text-sm font-heading">{opp.title}</div>
                      <div className="text-[#667085]">{opp.organization} • {opp.stipend}</div>
                      <div className="text-rose-600 font-mono text-[11px] mt-0.5">Deadline: {opp.deadline}</div>
                    </div>
                    <button
                      onClick={() => onNavigate(`/opportunities/${opp.id}`)}
                      className="px-4 py-2 rounded-lg bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm"
                    >
                      View & Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SUPPORT DESK */}
          {activeTab === 'support' && (
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#101828] font-heading">Personalized Support Desk</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8F8F1] text-[#087A52]">
                      {currentUser?.pharmNexiaId || 'PHN-STU-001247'}
                    </span>
                  </div>
                  <p className="text-xs text-[#667085] mt-0.5">
                    Your queries are permanently linked to your PharmNexia ID. No repeated explanations needed.
                  </p>
                </div>
                <button
                  onClick={() => {
                    // Open floating desk modal
                    const triggerBtn = document.querySelector('[aria-label="Open PharmNexia Support Desk"]');
                    if (triggerBtn) triggerBtn.click();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition flex items-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open Live Chat / New Ticket</span>
                </button>
              </div>

              {/* Tickets List */}
              <div className="space-y-3">
                {userTickets.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#667085] border border-dashed border-[#E5E7EB] rounded-2xl">
                    No active support requests. Have a question about a mentor session, payment, or roadmap?
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          const triggerBtn = document.querySelector('[aria-label="Open PharmNexia Support Desk"]');
                          if (triggerBtn) triggerBtn.click();
                        }}
                        className="text-xs font-semibold text-[#00A86B] hover:underline"
                      >
                        Start support chat now →
                      </button>
                    </div>
                  </div>
                ) : (
                  userTickets.map(tkt => (
                    <div
                      key={tkt.id}
                      onClick={() => {
                        const triggerBtn = document.querySelector('[aria-label="Open PharmNexia Support Desk"]');
                        if (triggerBtn) triggerBtn.click();
                      }}
                      className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] hover:border-[#00A86B] transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#101828]">{tkt.id}</span>
                          <span className="text-xs text-[#667085]">• {tkt.category}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F1] text-[#087A52]">
                            {tkt.status}
                          </span>
                        </div>
                        <div className="font-semibold text-xs text-[#101828] group-hover:text-[#00A86B] transition-colors">
                          {tkt.subject}
                        </div>
                        {tkt.assignedAgent && (
                          <div className="text-[11px] text-[#667085]">
                            Assigned to: <strong className="text-[#475467]">{tkt.assignedAgent.name}</strong> ({tkt.assignedAgent.pharmNexiaId})
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-[11px] font-semibold text-[#00A86B] group-hover:underline">
                          View Conversation →
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#101828] font-heading">Student Academic Profile</h2>
                  <p className="text-xs text-[#667085]">Update your college, course, and career interests</p>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="px-3.5 py-1.5 rounded-lg border border-[#E5E7EB] hover:border-[#00A86B] bg-white text-xs font-semibold text-[#111827] flex items-center gap-1.5 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#00A86B]" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-xs font-semibold text-[#667085] mb-1">College Name</label>
                    <input 
                      type="text" 
                      value={profCollege}
                      onChange={(e) => setProfCollege(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#667085] mb-1">Degree</label>
                      <input 
                        type="text" 
                        value={profDegree}
                        onChange={(e) => setProfDegree(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#667085] mb-1">Year</label>
                      <input 
                        type="text" 
                        value={profYear}
                        onChange={(e) => setProfYear(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#667085] mb-1">Bio & Career Goals</label>
                    <textarea 
                      rows="3" 
                      value={profBio}
                      onChange={(e) => setProfBio(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#111827] text-xs hover:bg-[#F8FAF9]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                    <div>
                      <span className="text-[#667085] block text-[10px] uppercase font-mono">College</span>
                      <strong className="text-[#101828]">{currentUser?.college}</strong>
                    </div>
                    <div>
                      <span className="text-[#667085] block text-[10px] uppercase font-mono">Degree & Year</span>
                      <strong className="text-[#101828]">{currentUser?.degree} • {currentUser?.year}</strong>
                    </div>
                    <div>
                      <span className="text-[#667085] block text-[10px] uppercase font-mono">Email</span>
                      <strong className="text-[#101828]">{currentUser?.email}</strong>
                    </div>
                    <div>
                      <span className="text-[#667085] block text-[10px] uppercase font-mono">Target Career Interests</span>
                      <strong className="text-[#087A52]">{currentUser?.careerInterests?.join(', ') || 'Pharmacovigilance, MBA'}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Simulated Video Room Modal (Join Session - Medium System Modal) */}
      {activeVideoRoomBooking && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-[#0F172A]/35 backdrop-blur-[4px] flex items-center justify-center p-3 sm:p-5"
          onClick={() => setActiveVideoRoomBooking(null)}
        >
          <div 
            className="bg-white text-[#111827] rounded-[20px] max-w-[620px] w-full p-6 sm:p-7 space-y-5 border border-[#E5E7EB] shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-modal-pop relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-[#00A86B] animate-ping" />
                <h3 className="font-bold text-[#101828] text-base font-heading">PharmNexia Secure Virtual Advisory Room</h3>
              </div>
              <button onClick={() => setActiveVideoRoomBooking(null)} className="p-1 text-[#667085] hover:text-[#111827]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-64 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-[#E8F8F1] text-[#087A52] flex items-center justify-center mb-3 border border-[#00A86B]/20">
                <Video className="w-8 h-8 text-[#00A86B]" />
              </div>
              <h4 className="font-bold text-[#101828] text-base font-heading">Connected: {activeVideoRoomBooking.mentorName}</h4>
              <p className="text-xs text-[#667085] mt-1 max-w-sm">
                Topic: "{activeVideoRoomBooking.notes}" • Session length: {activeVideoRoomBooking.sessionDuration} minutes
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00A86B]" />
                  <span>Encrypted Peer-to-Peer Stream</span>
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-xs text-[#667085] font-mono">
                Booking Reference: <span className="text-[#087A52] font-semibold">{activeVideoRoomBooking.bookingCode}</span>
              </div>
              <button
                onClick={() => setActiveVideoRoomBooking(null)}
                className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Certificate Modal (Large System Modal) */}
      {selectedCertForView && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-[#0F172A]/35 backdrop-blur-[4px] flex items-center justify-center p-3 sm:p-5"
          onClick={() => setSelectedCertForView(null)}
        >
          <div 
            className="bg-white rounded-[20px] max-w-[860px] w-full p-6 sm:p-7 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)] relative border border-[#E5E7EB] animate-modal-pop my-auto max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
              <span className="font-mono text-xs text-[#087A52] font-bold">Credential Viewer</span>
              <button onClick={() => setSelectedCertForView(null)} className="p-1 rounded-lg text-[#667085] hover:text-[#111827]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <CertificateViewer certificate={selectedCertForView} />
          </div>
        </div>
      )}

    </div>
  );
};
