import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  Award, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Bell, 
  Share2, 
  BarChart2, 
  ClipboardList, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Plus, 
  Copy, 
  Check, 
  ExternalLink,
  Shield,
  FileCheck,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useApp } from '../store/AppContext';

export const AdminDashboard = ({ onNavigate }) => {
  const { 
    currentUser, 
    mentors, 
    updateMentorStatus, 
    addMentor, 
    certificates, 
    issueCertificate, 
    bookings, 
    opportunities, 
    programs,
    auditLogs 
  } = useApp();

  // Security check for Admin Hub
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#101828] font-heading">Admin Hub Restricted</h2>
        <p className="text-xs text-[#667085] leading-relaxed">
          Access to the institutional governance and verification console is restricted to verified PharmNexia administrators.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white text-xs font-semibold shadow-sm transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const [activeSection, setActiveSection] = useState('dashboard'); // 'dashboard' | 'mentors' | 'applications' | 'certificates' | 'social' | 'audit' | 'bookings'
  const [copiedPostId, setCopiedPostId] = useState(null);

  // New certificate modal state
  const [showIssueCertModal, setShowIssueCertModal] = useState(false);
  const [newCertStudentName, setNewCertStudentName] = useState("");
  const [newCertProgName, setNewCertProgName] = useState("Hands-on Pharmacovigilance & Argus Safety Mastery");
  const [newCertGrade, setNewCertGrade] = useState("Distinction (Score: 92%)");

  const handleIssueNewCert = (e) => {
    e.preventDefault();
    if (!newCertStudentName.trim()) return;
    issueCertificate({
      studentName: newCertStudentName,
      programName: newCertProgName,
      completionDate: new Date().toISOString().split('T')[0],
      grade: newCertGrade,
      signatoryName: currentUser?.name || "Dr. K. Sen",
      signatoryTitle: "Chief Platform Administrator",
      skillsAcquired: ["Core Curriculum Mastery", "Capstone Assessment Cleared", "PharmNexia Standards"]
    });
    setShowIssueCertModal(false);
    setNewCertStudentName("");
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedPostId(id);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  // KPIs
  const totalStudents = 1420;
  const totalMentors = mentors.length;
  const totalPrograms = programs.length;
  const totalBookings = bookings.length + 384;
  const totalCertificates = certificates.length + 210;
  const totalRevenue = "₹1,84,500";
  const activeOpps = opportunities.length;

  const pendingMentors = mentors.filter(m => m.verificationStatus === 'pending');
  const verifiedMentors = mentors.filter(m => m.verificationStatus === 'verified');

  // Pre-formatted Social Content drafts for Admin Hub
  const socialDrafts = [
    {
      id: "social-1",
      platform: "LinkedIn",
      title: "Mentor Spotlight: B.Pharm to IIM Transition",
      tags: ["#PharmacyCareers", "#BPharmToMBA", "#IIM", "#PharmNexia"],
      content: `🎓 From Pharmacy Lab to Boardroom: How to Leverage B.Pharm for Top B-Schools!

Did you know that top IIMs award valuable academic diversity points to Pharmacy graduates during CAT shortlists?

On PharmNexia, talk directly to verified alumni like Rahul Sharma (B.Pharm → IIM Lucknow) who have walked this exact road:
✅ CAT strategy for non-engineering students
✅ How to answer "Why MBA after Pharmacy?" in personal interviews
✅ High-paying Pharma Brand Management & Consulting trajectories

👉 Book your 1-on-1 strategy session today on PharmNexia: https://pharmnexia.in/mentors`
    },
    {
      id: "social-2",
      platform: "Instagram",
      title: "Carousel Post: Pharmacovigilance Career Scope",
      tags: ["#pharmacovigilance", "#drugsafety", "#pharmacyjobs", "#pharmnexia"],
      content: `🚨 Confused about jobs after B.Pharm? Ever considered Pharmacovigilance (PV)?

Slide 1: What is PV? Drug safety monitoring & ADR reporting.
Slide 2: Top Employers: Cognizant, IQVIA, Parexel, Accenture, Novartis.
Slide 3: Key Tools to Learn: Argus Safety, MedDRA, WHO-UMC causality.
Slide 4: Starting Package: ₹4.5 - 7.5 LPA with rapid global promotion.

Want hands-on training? Join our weekend PV Cohort on PharmNexia!
🔗 Link in bio to enroll & receive verifiable digital credentials.`
    },
    {
      id: "social-3",
      platform: "LinkedIn",
      title: "Announcement: Free Scientific Writing Cohort",
      tags: ["#ResearchMethodology", "#PubMed", "#ScientificPublishing", "#PharmNexia"],
      content: `📢 Empowering Pharmacy Researchers across India!

PharmNexia is proud to announce a 100% FREE Cohort on:
"Scientific Writing & Research Methodology for B.Pharm Students"

Led by Dr. Elena D'Souza (Harvard Postdoc & Purdue Alumna):
🔹 Systematic literature searches using PubMed & Scopus MeSH terms
🔹 Managing 100+ citations effortlessly with Zotero
🔹 Avoiding predatory journals & writing publishable review papers

Seats are strictly limited to 100 students across recognized colleges.
Reserve your free seat here: https://pharmnexia.in/programs`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-white text-[#111827]">
      
      {/* Admin Header */}
      <div className="bg-[#F8FAF9] p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20">
              Platform Administration
            </span>
            <span className="text-xs text-[#667085]">Institutional Governance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828] mt-1 font-heading">
            PharmNexia Management Hub
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Admin: <strong className="text-[#101828]">{currentUser?.name}</strong> • Institutional Governance & Verification Console
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowIssueCertModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Issue Certificate</span>
          </button>
          <button
            onClick={() => onNavigate('/dashboard')}
            className="px-3.5 py-2.5 rounded-xl bg-white text-[#111827] hover:bg-[#F8FAF9] text-xs font-semibold border border-[#E5E7EB] transition"
          >
            Switch to Student View
          </button>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E5E7EB] text-xs font-semibold scrollbar-none">
        {[
          { id: 'dashboard', label: 'Metrics & Analytics', icon: LayoutDashboard },
          { id: 'mentors', label: 'Mentors Management', icon: Users, count: mentors.length },
          { id: 'applications', label: 'Credential Verifications', icon: ShieldCheck, count: pendingMentors.length },
          { id: 'certificates', label: 'Certificates Registry', icon: Award, count: certificates.length },
          { id: 'social', label: 'Social Content Studio', icon: Share2 },
          { id: 'bookings', label: 'Bookings & Payments', icon: CreditCard, count: bookings.length },
          { id: 'audit', label: 'Security & Audit Logs', icon: ClipboardList, count: auditLogs.length },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap flex items-center gap-2 transition ${
                isActive 
                  ? 'bg-[#00A86B] text-white shadow-sm font-semibold' 
                  : 'bg-white border border-[#E5E7EB] text-[#667085] hover:text-[#111827] hover:border-[#00A86B]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#00A86B]'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#E8F8F1] text-[#087A52]'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SECTION: DASHBOARD KPI OVERVIEW */}
      {activeSection === 'dashboard' && (
        <div className="space-y-8">
          
          {/* 7 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm">
              <div className="text-[11px] font-mono uppercase text-[#667085]">Total Students</div>
              <div className="text-2xl font-black text-[#101828] mt-1 font-mono">{totalStudents.toLocaleString()}</div>
              <div className="text-[10px] text-[#087A52] font-semibold mt-1">↑ +18% this month</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm">
              <div className="text-[11px] font-mono uppercase text-[#667085]">Active Mentors</div>
              <div className="text-2xl font-black text-[#00A86B] mt-1 font-mono">{totalMentors}</div>
              <div className="text-[10px] text-[#667085] mt-1 font-mono">{verifiedMentors.length} Verified, {pendingMentors.length} Pending</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm">
              <div className="text-[11px] font-mono uppercase text-[#667085]">Total Bookings</div>
              <div className="text-2xl font-black text-[#101828] mt-1 font-mono">{totalBookings}</div>
              <div className="text-[10px] text-[#087A52] font-semibold mt-1">98.4% attendance rate</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm">
              <div className="text-[11px] font-mono uppercase text-[#667085]">Gross Platform Volume</div>
              <div className="text-2xl font-black text-[#101828] mt-1 font-mono">{totalRevenue}</div>
              <div className="text-[10px] text-[#667085] mt-1">Honorarium & fee pool</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm">
              <div className="text-[11px] font-mono uppercase text-[#667085]">Issued Certificates</div>
              <div className="text-2xl font-black text-[#087A52] mt-1 font-mono">{totalCertificates}</div>
              <div className="text-[10px] text-[#667085] mt-1">Publicly verifiable</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm">
              <div className="text-[11px] font-mono uppercase text-[#667085]">Active Programs</div>
              <div className="text-2xl font-black text-[#101828] mt-1 font-mono">{totalPrograms}</div>
              <div className="text-[10px] text-[#667085] mt-1">4 Cohorts in session</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm col-span-2 sm:col-span-1">
              <div className="text-[11px] font-mono uppercase text-[#667085]">Active Opportunities</div>
              <div className="text-2xl font-black text-[#101828] mt-1 font-mono">{activeOpps}</div>
              <div className="text-[10px] text-[#667085] mt-1">Internships & grants</div>
            </div>
          </div>

          {/* Quick Verification Queue Alert */}
          {pendingMentors.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <strong className="text-sm font-bold text-[#101828]">
                    {pendingMentors.length} Mentor Application Pending Credential Review
                  </strong>
                  <p className="text-[#667085] text-xs">
                    Degree certificates and corporate credentials submitted for evaluation.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSection('applications')}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm"
              >
                Review Credentials →
              </button>
            </div>
          )}

          {/* Recent Bookings and Audit Snapshot */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
              <h3 className="font-bold text-[#101828] text-sm font-heading">Recent Mentorship Bookings</h3>
              <div className="space-y-3">
                {bookings.slice(0, 3).map(b => (
                  <div key={b.id} className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#101828]">{b.studentName} → {b.mentorName}</div>
                      <div className="text-[#667085] text-[11px] font-mono">{b.scheduledDate} ({b.scheduledTime})</div>
                    </div>
                    <span className="font-mono text-[#087A52] font-bold">
                      {b.paymentAmount === 0 ? 'FREE' : `₹${b.paymentAmount}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
              <h3 className="font-bold text-[#101828] text-sm font-heading">Recent Security & Audit Events</h3>
              <div className="space-y-3">
                {auditLogs.slice(0, 3).map(log => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#087A52] font-bold">{log.action}</span>
                      <span className="text-[10px] text-[#667085] font-mono">{log.timestamp}</span>
                    </div>
                    <div className="text-[#667085] text-[11px]">{log.details}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SECTION: MENTORS MANAGEMENT */}
      {activeSection === 'mentors' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#101828] font-heading">Registered Mentors</h2>
              <p className="text-xs text-[#667085]">Configure pricing, expertise, and institutional honorarium status</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F8FAF9] text-[#667085] uppercase tracking-wider font-mono text-[10px]">
                  <th className="p-3">Mentor</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Model</th>
                  <th className="p-3">30m Fee</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {mentors.map(m => (
                  <tr key={m.id} className="hover:bg-[#F8FAF9] transition">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img src={m.avatarUrl} alt={m.name} className="w-8 h-8 rounded-full object-cover border border-[#00A86B]" />
                        <div>
                          <div className="font-bold text-[#101828]">{m.name}</div>
                          <div className="text-[11px] text-[#667085] truncate max-w-[200px]">{m.currentRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-[#E8F8F1] font-mono text-[10px] text-[#087A52] border border-[#00A86B]/20">
                        {m.mentorType}
                      </span>
                    </td>
                    <td className="p-3 text-[#111827] font-medium">
                      {m.paymentModel}
                    </td>
                    <td className="p-3 font-mono font-bold text-[#101828]">
                      {m.price30 === 0 ? 'Free' : `₹${m.price30}`}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        m.verificationStatus === 'verified' 
                          ? 'bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20' 
                          : m.verificationStatus === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}>
                        {m.verificationStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {m.verificationStatus !== 'verified' && (
                          <button
                            onClick={() => updateMentorStatus(m.id, 'verified')}
                            className="px-2.5 py-1 rounded-lg bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[11px]"
                          >
                            Verify
                          </button>
                        )}
                        {m.verificationStatus !== 'suspended' && (
                          <button
                            onClick={() => updateMentorStatus(m.id, 'suspended', 'Suspended by admin')}
                            className="px-2.5 py-1 rounded-lg border border-[#E5E7EB] text-[#667085] text-[11px] hover:bg-[#F8FAF9] hover:text-[#111827]"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION: CREDENTIAL VERIFICATIONS WORKFLOW */}
      {activeSection === 'applications' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#101828] font-heading">Credential Verification Queue</h2>
            <p className="text-xs text-[#667085]">
              Admin verification workflow: Inspect uploaded degree certificates, employer appointments, and licenses.
            </p>
          </div>

          <div className="space-y-4">
            {pendingMentors.map(pm => (
              <div key={pm.id} className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={pm.avatarUrl} alt={pm.name} className="w-12 h-12 rounded-xl object-cover border border-[#00A86B]" />
                    <div>
                      <h3 className="font-bold text-[#101828] text-sm font-heading">{pm.name}</h3>
                      <div className="text-[#667085]">{pm.currentRole} at {pm.currentOrg}</div>
                      <div className="text-[#087A52] font-mono text-[11px] mt-0.5">{pm.qualification}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateMentorStatus(pm.id, 'verified', 'Approved degree and employer credential documents.')}
                      className="px-4 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      <span>Approve & Verify</span>
                    </button>
                    <button
                      onClick={() => updateMentorStatus(pm.id, 'rejected', 'Insufficient credential proof.')}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#E5E7EB] flex items-center justify-between text-[#667085]">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#00A86B]" />
                    <span>Submitted Document: <strong className="text-[#101828]">{pm.credentialProof}</strong></span>
                  </div>
                  <span className="text-[11px] font-mono text-[#667085]">Encrypted Admin Storage</span>
                </div>
              </div>
            ))}

            {pendingMentors.length === 0 && (
              <div className="p-8 text-center bg-[#F8FAF9] rounded-2xl border border-[#E5E7EB] text-[#667085]">
                <CheckCircle2 className="w-8 h-8 text-[#00A86B] mx-auto mb-2" />
                <p className="font-bold text-[#101828]">All Mentor Applications Have Been Processed</p>
                <p className="text-xs text-[#667085] mt-0.5">No pending credential documents awaiting audit review.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION: CERTIFICATES REGISTRY */}
      {activeSection === 'certificates' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#101828] font-heading">Verifiable Certificates Registry</h2>
              <p className="text-xs text-[#667085]">Issued credentials with cryptographic proof and public verification URLs</p>
            </div>
            <button
              onClick={() => setShowIssueCertModal(true)}
              className="px-4 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Issue New Certificate</span>
            </button>
          </div>

          <div className="space-y-3">
            {certificates.map(c => (
              <div key={c.certificateId} className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#101828] text-sm font-heading">{c.studentName}</span>
                    <span className="font-mono text-[#087A52] bg-[#E8F8F1] px-2.5 py-0.5 rounded font-bold text-[10px] border border-[#00A86B]/20">
                      {c.certificateId}
                    </span>
                  </div>
                  <div className="text-[#667085] mt-0.5">{c.programName}</div>
                  <div className="text-[#667085] text-[10px] font-mono mt-0.5">Hash: {c.credentialIdHash?.substring(0, 24)}...</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate(`/verify-certificate/${c.certificateId}`)}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] font-semibold text-xs hover:border-[#00A86B] flex items-center gap-1 transition"
                  >
                    <span>Public Verification</span>
                    <ExternalLink className="w-3 h-3 text-[#00A86B]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: SOCIAL CONTENT STUDIO */}
      {activeSection === 'social' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#101828] font-heading">Social Media Content Studio</h2>
            <p className="text-xs text-[#667085]">
              Pre-formatted, high-converting copy drafts for LinkedIn & Instagram. Click to copy directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {socialDrafts.map(post => (
              <div key={post.id} className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                      post.platform === 'LinkedIn' ? 'bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20' : 'bg-pink-50 text-pink-700 border border-pink-200'
                    }`}>
                      {post.platform}
                    </span>
                    <span className="text-[#667085] text-[10px]">Ready to Publish</span>
                  </div>

                  <h3 className="font-bold text-[#101828] text-sm leading-snug font-heading">{post.title}</h3>

                  <div className="p-3 bg-white rounded-xl border border-[#E5E7EB] text-xs text-[#111827] whitespace-pre-line font-mono max-h-56 overflow-y-auto leading-relaxed">
                    {post.content}
                  </div>

                  <div className="flex flex-wrap gap-1 text-[10px] text-[#087A52] font-mono">
                    {post.tags.join(' ')}
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(post.content, post.id)}
                  className="w-full py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  {copiedPostId === post.id ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Full Post Text</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: BOOKINGS & PAYMENTS */}
      {activeSection === 'bookings' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#101828] font-heading">Bookings & Payments Ledger</h2>
            <p className="text-xs text-[#667085]">
              PCI-DSS compliant payment transaction records (zero raw card or UPI coordinates stored).
            </p>
          </div>

          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b.id} className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#101828]">{b.bookingCode}</span>
                    <span className="font-mono text-[#087A52] bg-[#E8F8F1] px-2 py-0.5 rounded text-[10px] border border-[#00A86B]/20">
                      {b.paymentStatus}
                    </span>
                  </div>
                  <div className="text-[#111827] mt-0.5">Student: {b.studentName} ({b.studentEmail})</div>
                  <div className="text-[#667085] text-[11px]">Mentor: {b.mentorName} • {b.scheduledDate} ({b.scheduledTime})</div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-[#101828] text-sm">
                    {b.paymentAmount === 0 ? 'FREE' : `₹${b.paymentAmount}`}
                  </div>
                  <span className="text-[10px] text-[#087A52] font-mono">Gateway: Razorpay Escrow Settlement</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: AUDIT LOGS */}
      {activeSection === 'audit' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#101828] font-heading">System Security & Audit Trail</h2>
            <p className="text-xs text-[#667085]">Immutable ledger of administrative changes and student bookings</p>
          </div>

          <div className="space-y-2">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] flex items-start justify-between gap-4 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#087A52]">{log.action}</span>
                    <span className="text-[#667085]">• Actor: <strong className="text-[#101828]">{log.actor}</strong></span>
                  </div>
                  <div className="text-[#667085] text-[11px]">{log.details}</div>
                </div>
                <div className="text-right font-mono text-[10px] text-[#667085] flex-shrink-0">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Issue Certificate */}
      {showIssueCertModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101828]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#E5E7EB] shadow-2xl animate-fadeIn text-[#111827]">
            <h3 className="text-base font-bold text-[#101828] font-heading">Generate Official Verifiable Certificate</h3>
            
            <form onSubmit={handleIssueNewCert} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#667085] font-semibold mb-1">Student Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newCertStudentName}
                  onChange={(e) => setNewCertStudentName(e.target.value)}
                  placeholder="e.g. Srushti K. More"
                  className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[#667085] font-semibold mb-1">Program Title</label>
                <select
                  value={newCertProgName}
                  onChange={(e) => setNewCertProgName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] text-xs focus:outline-none focus:border-[#00A86B] focus:bg-white"
                >
                  {programs.map(p => (
                    <option key={p.id} value={p.title}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#667085] font-semibold mb-1">Grade / Outcome</label>
                <input 
                  type="text" 
                  value={newCertGrade}
                  onChange={(e) => setNewCertGrade(e.target.value)}
                  placeholder="e.g. Distinction (Score: 94%)"
                  className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowIssueCertModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#111827] font-semibold text-xs hover:bg-[#F8FAF9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm"
                >
                  Issue & Create Hash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
