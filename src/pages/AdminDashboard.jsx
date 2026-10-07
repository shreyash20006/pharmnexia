import React, { useState, useEffect } from 'react';
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
  DollarSign,
  Video,
  Eye,
  MousePointer,
  UserCheck,
  RefreshCw,
  Lock,
  Filter,
  ArrowRight,
  ChevronRight,
  Trash2,
  Edit,
  Archive,
  PlayCircle,
  PauseCircle,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { SupportDeskAdmin } from '../components/SupportDeskAdmin';
import { STAFF_ROLES, ALL_STAFF_PERMISSIONS, checkPermission } from '../utils/staffRoles';

export const AdminDashboard = ({ initialSection = 'dashboard', onNavigate }) => {
  const { 
    currentUser, 
    mentors, 
    updateMentorStatus, 
    updateMentor,
    toggleMentorActive,
    addMentor, 
    certificates, 
    issueCertificate, 
    bookings, 
    opportunities, 
    programs,
    programRegistrations = [],
    programAnalytics = {},
    createProgram,
    updateProgram,
    duplicateProgram,
    archiveProgram,
    publishProgram,
    deleteProgram,
    staffAccounts = [],
    inviteStaff,
    updateStaffRole,
    toggleStaffStatus,
    removeStaff,
    auditLogs,
    supportTickets,
    platformSettings,
    updatePlatformSettings
  } = useApp();

  const [activeSection, setActiveSection] = useState(initialSection);
  const [copiedPostId, setCopiedPostId] = useState(null);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  // Security check: Verify that user has an administrative or staff role
  const isStaff = currentUser && (
    ['ADMIN', 'SUPER_ADMIN', 'DEVELOPER', 'MENTOR_MANAGER', 'CONTENT_MANAGER', 'SUPPORT', 'ANALYST'].includes(
      (currentUser.staffRole || currentUser.role || '').toUpperCase()
    )
  );

  if (!currentUser || !isStaff) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#101828] font-heading">Admin Hub Restricted</h2>
        <p className="text-xs text-[#667085] leading-relaxed">
          Access to the institutional governance and verification console is restricted to verified PharmNexia administrators and staff.
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

  // ---------------------------------------------------------------------------
  // PROGRAM CMS STATE & MODAL
  // ---------------------------------------------------------------------------
  const [programSearch, setProgramSearch] = useState('');
  const [programStatusFilter, setProgramStatusFilter] = useState('ALL');
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [activeModalStep, setActiveModalStep] = useState(1); // 1 to 12

  const defaultProgramForm = {
    title: '',
    shortTitle: '',
    slug: '',
    category: 'Pharmacovigilance',
    type: 'Cohort',
    status: 'DRAFT',
    coverImage: '',
    thumbnail: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    startTime: '6:00 PM',
    endTime: '8:00 PM',
    schedule: 'Saturdays & Sundays, 6:00 PM - 8:00 PM IST',
    duration: '4 Weeks',
    mode: 'Online via Google Meet',
    location: 'Google Meet Live',
    isFree: false,
    price: 999,
    originalPrice: 2499,
    currency: 'INR',
    registrationDeadline: '',
    ctaText: 'Get Access — ₹999',
    seatsTotal: 50,
    googleMeetUrl: 'https://meet.google.com/phn-live',
    meetStatus: 'UPCOMING',
    leadMentor: currentUser?.name || 'Dr. Shalini Nair',
    mentorRole: 'Lead Drug Safety Scientist & PV Consultant',
    organization: 'Global Pharmacovigilance Council',
    overview: 'A comprehensive practical immersion program covering real-world industry workflows.',
    longDescription: '',
    learningOutcomes: [
      'Understand core industry and regulatory frameworks',
      'Hands-on case processing and real-world tools',
      'Resume preparation and mock interview guidance'
    ],
    curriculum: [
      { week: 'Week 1', title: 'Foundations & Industry Standards', topics: ['Regulatory guidelines', 'Basic terminology'] },
      { week: 'Week 2', title: 'Hands-on Tools & Case Studies', topics: ['Software workflows', 'Live scenario drafting'] }
    ],
    eligibility: 'B.Pharm, M.Pharm, Pharm.D, and Life-Science students/graduates.',
    skills: 'Pharmacovigilance, Argus Safety, MedDRA, Case Narratives',
    faqs: [
      { q: 'Will I receive a verifiable certificate?', a: 'Yes, upon completing the final capstone assessment.' },
      { q: 'What if I miss a live session?', a: 'All sessions are recorded and made available on the student LMS.' }
    ],
    metaTitle: '',
    metaDescription: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    canonicalUrl: ''
  };

  const [programForm, setProgramForm] = useState(defaultProgramForm);

  const handleOpenCreateProgram = () => {
    setEditingProgramId(null);
    setProgramForm(defaultProgramForm);
    setActiveModalStep(1);
    setShowProgramModal(true);
  };

  const handleOpenEditProgram = (prog) => {
    setEditingProgramId(prog.id);
    setProgramForm({
      ...defaultProgramForm,
      ...prog,
      skills: Array.isArray(prog.skills) ? prog.skills.join(', ') : (prog.skills || '')
    });
    setActiveModalStep(1);
    setShowProgramModal(true);
  };

  const handleSaveProgram = (e) => {
    e.preventDefault();
    const skillsArray = typeof programForm.skills === 'string'
      ? programForm.skills.split(',').map(s => s.trim()).filter(Boolean)
      : (programForm.skills || []);

    const payload = {
      ...programForm,
      skills: skillsArray,
      price: programForm.isFree ? 0 : Number(programForm.price),
      originalPrice: Number(programForm.originalPrice),
      seatsTotal: Number(programForm.seatsTotal)
    };

    if (editingProgramId) {
      updateProgram(editingProgramId, payload);
    } else {
      createProgram(payload);
    }

    setShowProgramModal(false);
  };

  // ---------------------------------------------------------------------------
  // PROGRAM FUNNEL ANALYTICS STATE
  // ---------------------------------------------------------------------------
  const [selectedAnalyticsProgId, setSelectedAnalyticsProgId] = useState(programs[0]?.id || 'ALL');

  // Compute aggregated or specific analytics
  const getAnalyticsData = () => {
    if (selectedAnalyticsProgId !== 'ALL' && programAnalytics[selectedAnalyticsProgId]) {
      const p = programAnalytics[selectedAnalyticsProgId];
      const prog = programs.find(pr => pr.id === selectedAnalyticsProgId);
      return {
        title: prog?.title || 'Selected Program',
        price: prog?.isFree ? 'FREE' : `₹${prog?.price}`,
        pageViews: p.pageViews || 0,
        uniqueVisitors: p.uniqueVisitors || 0,
        ctaClicks: p.ctaClicks || 0,
        registrationVisits: p.registrationVisits || 0,
        paymentVisits: p.paymentVisits || 0,
        paymentInitiated: p.paymentInitiated || 0,
        paymentSuccess: p.paymentSuccess || 0,
        failedPayments: Math.max(0, (p.paymentInitiated || 0) - (p.paymentSuccess || 0)),
        revenue: p.revenue || 0,
        trafficSources: p.trafficSources || []
      };
    }

    // Aggregate over all programs
    let totalViews = 0;
    let totalUniques = 0;
    let totalCta = 0;
    let totalRegVisits = 0;
    let totalPayVisits = 0;
    let totalPayInit = 0;
    let totalPaySuccess = 0;
    let totalRevenue = 0;

    Object.values(programAnalytics).forEach(p => {
      totalViews += (p.pageViews || 0);
      totalUniques += (p.uniqueVisitors || 0);
      totalCta += (p.ctaClicks || 0);
      totalRegVisits += (p.registrationVisits || 0);
      totalPayVisits += (p.paymentVisits || 0);
      totalPayInit += (p.paymentInitiated || 0);
      totalPaySuccess += (p.paymentSuccess || 0);
      totalRevenue += (p.revenue || 0);
    });

    return {
      title: 'All Programs Aggregated',
      price: 'Platform-wide',
      pageViews: totalViews,
      uniqueVisitors: totalUniques,
      ctaClicks: totalCta,
      registrationVisits: totalRegVisits,
      paymentVisits: totalPayVisits,
      paymentInitiated: totalPayInit,
      paymentSuccess: totalPaySuccess,
      failedPayments: Math.max(0, totalPayInit - totalPaySuccess),
      revenue: totalRevenue,
      trafficSources: [
        { source: 'LinkedIn Feed & Bio', visitors: Math.round(totalViews * 0.38), percentage: 38 },
        { source: 'College WhatsApp Groups', visitors: Math.round(totalViews * 0.31), percentage: 31 },
        { source: 'Organic Search & Direct', visitors: Math.round(totalViews * 0.20), percentage: 20 },
        { source: 'Instagram Stories & Reels', visitors: Math.round(totalViews * 0.11), percentage: 11 }
      ]
    };
  };

  const analytics = getAnalyticsData();

  // Funnel conversion percentages
  const viewToCtaRate = analytics.pageViews > 0 ? ((analytics.ctaClicks / analytics.pageViews) * 100).toFixed(1) : 0;
  const ctaToRegRate = analytics.ctaClicks > 0 ? ((analytics.registrationVisits / analytics.ctaClicks) * 100).toFixed(1) : 0;
  const regToPayRate = analytics.registrationVisits > 0 ? ((analytics.paymentVisits / analytics.registrationVisits) * 100).toFixed(1) : 0;
  const payToSuccessRate = analytics.paymentInitiated > 0 ? ((analytics.paymentSuccess / analytics.paymentInitiated) * 100).toFixed(1) : 0;
  const overallConversionRate = analytics.pageViews > 0 ? ((analytics.paymentSuccess / analytics.pageViews) * 100).toFixed(1) : 0;

  // ---------------------------------------------------------------------------
  // STAFF MANAGEMENT STATE & MODAL
  // ---------------------------------------------------------------------------
  const [showInviteStaffModal, setShowInviteStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('SUPPORT');
  const [newStaffDepartment, setNewStaffDepartment] = useState('');
  const [newStaffTitle, setNewStaffTitle] = useState('');

  const handleInviteStaffSubmit = (e) => {
    e.preventDefault();
    if (!newStaffEmail.trim() || !newStaffName.trim()) return;

    inviteStaff({
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      department: newStaffDepartment,
      title: newStaffTitle
    });

    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffRole('SUPPORT');
    setNewStaffDepartment('');
    setNewStaffTitle('');
    setShowInviteStaffModal(false);
  };

  // ---------------------------------------------------------------------------
  // CERTIFICATES & OTHER MODAL STATES
  // ---------------------------------------------------------------------------
  const [showIssueCertModal, setShowIssueCertModal] = useState(false);
  const [newCertStudentName, setNewCertStudentName] = useState('');
  const [newCertProgName, setNewCertProgName] = useState(programs[0]?.title || 'Hands-on Pharmacovigilance & Argus Safety Mastery');
  const [newCertGrade, setNewCertGrade] = useState('Distinction (Score: 92%)');

  const handleIssueNewCert = (e) => {
    e.preventDefault();
    if (!newCertStudentName.trim()) return;
    issueCertificate({
      studentName: newCertStudentName,
      programName: newCertProgName,
      completionDate: new Date().toISOString().split('T')[0],
      grade: newCertGrade,
      signatoryName: currentUser?.name || 'Dr. K. Sen',
      signatoryTitle: 'Chief Platform Administrator',
      skillsAcquired: ['Core Curriculum Mastery', 'Capstone Assessment Cleared', 'PharmNexia Standards']
    });
    setShowIssueCertModal(false);
    setNewCertStudentName('');
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
  const totalRevenue = `₹${(analytics.revenue + 142542).toLocaleString()}`;
  const activeOpps = opportunities.length;

  const pendingMentors = mentors.filter(m => m.verificationStatus === 'pending');
  const verifiedMentors = mentors.filter(m => m.verificationStatus === 'verified');

  // ---------------------------------------------------------------------------
  // ADMIN MENTOR CMS STATE & MODALS
  // ---------------------------------------------------------------------------
  const defaultMentorForm = {
    name: '',
    email: '',
    avatarUrl: '',
    phone: '',
    location: 'India',
    shortBio: '',
    about: '',
    currentRole: '',
    currentOrg: '',
    mentorType: 'Industry Professional',
    qualification: 'B.Pharm, M.Pharm',
    previousEducation: '',
    expertise: 'Pharmacovigilance, Regulatory Affairs',
    careerPathSlugs: ['pharmacovigilance'],
    price30: 499,
    price60: 899,
    payoutModel: 'PERCENTAGE',
    payoutRate: 70,
    availableDays: ['Saturday', 'Sunday'],
    availableSlots: ['06:00 PM - 06:30 PM', '07:00 PM - 07:30 PM'],
    startTime: '06:00 PM',
    endTime: '08:00 PM',
    timezone: 'Asia/Kolkata (IST)',
    verificationStatus: 'verified',
    isActive: true
  };

  const [showCreateMentorModal, setShowCreateMentorModal] = useState(false);
  const [showEditMentorModal, setShowEditMentorModal] = useState(false);
  const [editingMentorId, setEditingMentorId] = useState(null);
  const [mentorFormData, setMentorFormData] = useState(defaultMentorForm);
  const [mentorSearch, setMentorSearch] = useState('');
  const [mentorTypeFilter, setMentorTypeFilter] = useState('ALL');
  const [mentorStatusFilter, setMentorStatusFilter] = useState('ALL');

  const [pricingForm, setPricingForm] = useState({
    membershipFee: platformSettings?.membershipFee || 99,
    mentorPayoutPercent: platformSettings?.mentorPayoutPercent || 70,
    minSessionPrice: platformSettings?.minSessionPrice || 99,
    maxSessionPrice: platformSettings?.maxSessionPrice || 10000
  });
  const [pricingSavedNotice, setPricingSavedNotice] = useState(false);

  useEffect(() => {
    if (platformSettings) {
      setPricingForm({
        membershipFee: platformSettings.membershipFee ?? 99,
        mentorPayoutPercent: platformSettings.mentorPayoutPercent ?? 70,
        minSessionPrice: platformSettings.minSessionPrice ?? 99,
        maxSessionPrice: platformSettings.maxSessionPrice ?? 10000
      });
    }
  }, [platformSettings]);

  const handleOpenCreateMentor = () => {
    setMentorFormData(defaultMentorForm);
    setShowCreateMentorModal(true);
  };

  const handleOpenEditMentor = (m) => {
    setEditingMentorId(m.id);
    setMentorFormData({
      name: m.name || '',
      email: m.email || '',
      avatarUrl: m.avatarUrl || '',
      phone: m.phone || '',
      location: m.location || 'India',
      shortBio: m.shortBio || '',
      about: m.about || '',
      currentRole: m.currentRole || '',
      currentOrg: m.currentOrg || '',
      mentorType: m.mentorType || 'Industry Professional',
      qualification: m.qualification || '',
      previousEducation: m.previousEducation || '',
      expertise: Array.isArray(m.expertise) ? m.expertise.join(', ') : (m.expertise || ''),
      careerPathSlugs: Array.isArray(m.careerPathSlugs) ? m.careerPathSlugs : ['pharmacovigilance'],
      price30: m.price30 ?? 0,
      price60: m.price60 ?? 0,
      payoutModel: m.payoutModel || 'PERCENTAGE',
      payoutRate: m.payoutRate ?? 70,
      availableDays: Array.isArray(m.availableDays) ? m.availableDays : ['Saturday', 'Sunday'],
      availableSlots: Array.isArray(m.availableSlots) ? m.availableSlots : ['06:00 PM - 06:30 PM', '07:00 PM - 07:30 PM'],
      startTime: m.startTime || '06:00 PM',
      endTime: m.endTime || '08:00 PM',
      timezone: m.timezone || 'Asia/Kolkata (IST)',
      verificationStatus: m.verificationStatus || 'verified',
      isActive: m.isActive !== false
    });
    setShowEditMentorModal(true);
  };

  const handleSaveCreateMentor = async (e) => {
    e.preventDefault();
    if (!mentorFormData.name || !mentorFormData.email || !mentorFormData.currentRole || !mentorFormData.currentOrg) {
      alert("Please provide at least Name, Professional Email, Current Role, and Organization.");
      return;
    }
    const expertiseArray = typeof mentorFormData.expertise === 'string'
      ? mentorFormData.expertise.split(',').map(s => s.trim()).filter(Boolean)
      : (Array.isArray(mentorFormData.expertise) ? mentorFormData.expertise : []);

    await addMentor({
      ...mentorFormData,
      expertise: expertiseArray,
      price30: Number(mentorFormData.price30) || 0,
      price60: Number(mentorFormData.price60) || 0,
      payoutRate: Number(mentorFormData.payoutRate) || 0,
      avatarUrl: mentorFormData.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(mentorFormData.name)}`
    });

    setShowCreateMentorModal(false);
  };

  const handleSaveEditMentor = async (e) => {
    e.preventDefault();
    if (!editingMentorId) return;
    const expertiseArray = typeof mentorFormData.expertise === 'string'
      ? mentorFormData.expertise.split(',').map(s => s.trim()).filter(Boolean)
      : (Array.isArray(mentorFormData.expertise) ? mentorFormData.expertise : []);

    await updateMentor(editingMentorId, {
      ...mentorFormData,
      expertise: expertiseArray,
      price30: Number(mentorFormData.price30) || 0,
      price60: Number(mentorFormData.price60) || 0,
      payoutRate: Number(mentorFormData.payoutRate) || 0
    });

    setShowEditMentorModal(false);
    setEditingMentorId(null);
  };

  const handleSavePricingSettings = async (e) => {
    e.preventDefault();
    await updatePlatformSettings({
      membershipFee: Number(pricingForm.membershipFee) || 99,
      mentorPayoutPercent: Number(pricingForm.mentorPayoutPercent) || 70,
      platformFeePercent: 100 - (Number(pricingForm.mentorPayoutPercent) || 70),
      minSessionPrice: Number(pricingForm.minSessionPrice) || 99,
      maxSessionPrice: Number(pricingForm.maxSessionPrice) || 10000
    });
    setPricingSavedNotice(true);
    setTimeout(() => setPricingSavedNotice(false), 3000);
  };

  // Filtered mentors list for admin table
  const filteredAdminMentors = mentors.filter(m => {
    if (!m) return false;
    const q = mentorSearch.toLowerCase().trim();
    const matchesSearch = !q ||
      (m.name || '').toLowerCase().includes(q) ||
      (m.currentRole || '').toLowerCase().includes(q) ||
      (m.currentOrg || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q);
    const matchesType = mentorTypeFilter === 'ALL' || m.mentorType === mentorTypeFilter;
    const matchesStatus = mentorStatusFilter === 'ALL' ||
      (mentorStatusFilter === 'ACTIVE' && m.isActive !== false) ||
      (mentorStatusFilter === 'INACTIVE' && m.isActive === false) ||
      (mentorStatusFilter === 'VERIFIED' && m.verificationStatus === 'verified') ||
      (mentorStatusFilter === 'PENDING' && m.verificationStatus === 'pending') ||
      (mentorStatusFilter === 'SUSPENDED' && m.verificationStatus === 'suspended');
    return matchesSearch && matchesType && matchesStatus;
  });

  // Filtered Programs list
  const filteredPrograms = programs.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(programSearch.toLowerCase()) ||
                          p.category.toLowerCase().includes(programSearch.toLowerCase());
    const matchesStatus = programStatusFilter === 'ALL' || (p.status || 'PUBLISHED') === programStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pre-formatted Social Content drafts for Admin Hub
  const socialDrafts = [
    {
      id: 'social-1',
      platform: 'LinkedIn',
      title: 'Mentor Spotlight: B.Pharm to IIM Transition',
      tags: ['#PharmacyCareers', '#BPharmToMBA', '#IIM', '#PharmNexia'],
      content: `🎓 From Pharmacy Lab to Boardroom: How to Leverage B.Pharm for Top B-Schools!

Did you know that top IIMs award valuable academic diversity points to Pharmacy graduates during CAT shortlists?

On PharmNexia, talk directly to verified alumni like Rahul Sharma (B.Pharm → IIM Lucknow) who have walked this exact road:
✅ CAT strategy for non-engineering students
✅ How to answer "Why MBA after Pharmacy?" in personal interviews
✅ High-paying Pharma Brand Management & Consulting trajectories

👉 Book your 1-on-1 strategy session today on PharmNexia: https://pharmnexia.in/mentors`
    },
    {
      id: 'social-2',
      platform: 'Instagram',
      title: 'Carousel Post: Pharmacovigilance Career Scope',
      tags: ['#pharmacovigilance', '#drugsafety', '#pharmacyjobs', '#pharmnexia'],
      content: `🚨 Confused about jobs after B.Pharm? Ever considered Pharmacovigilance (PV)?

Slide 1: What is PV? Drug safety monitoring & ADR reporting.
Slide 2: Top Employers: Cognizant, IQVIA, Parexel, Accenture, Novartis.
Slide 3: Key Tools to Learn: Argus Safety, MedDRA, WHO-UMC causality.
Slide 4: Starting Package: ₹4.5 - 7.5 LPA with rapid global promotion.

Want hands-on training? Join our weekend PV Cohort on PharmNexia!
🔗 Link in bio to enroll & receive verifiable digital credentials.`
    },
    {
      id: 'social-3',
      platform: 'LinkedIn',
      title: 'Announcement: Free Scientific Writing Cohort',
      tags: ['#ResearchMethodology', '#PubMed', '#ScientificPublishing', '#PharmNexia'],
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
              Institutional Governance
            </span>
            <span className="text-xs text-[#667085]">Administration & CMS Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828] mt-1 font-heading">
            PharmNexia Management Hub
          </h1>
          <p className="text-xs text-[#667085] mt-0.5 flex items-center gap-2">
            <span>Staff Account: <strong className="text-[#101828]">{currentUser?.name}</strong></span>
            <span>•</span>
            <span className="font-mono px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              {currentUser?.staffRole || currentUser?.role || 'ADMIN'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenCreateProgram}
            className="px-4 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create Program</span>
          </button>
          <button
            onClick={() => setShowIssueCertModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-white text-[#111827] hover:bg-[#F8FAF9] text-xs font-semibold border border-[#E5E7EB] transition flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Issue Cert</span>
          </button>
          <button
            onClick={() => onNavigate('/dashboard')}
            className="px-3.5 py-2.5 rounded-xl bg-white text-[#111827] hover:bg-[#F8FAF9] text-xs font-semibold border border-[#E5E7EB] transition"
          >
            Student View
          </button>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E5E7EB] text-xs font-semibold scrollbar-none">
        {[
          { id: 'dashboard', label: 'Metrics & KPIs', icon: LayoutDashboard },
          { id: 'programs', label: 'Programs CMS', icon: BookOpen, count: programs.length },
          { id: 'analytics', label: 'Funnel Analytics', icon: BarChart2 },
          { id: 'staff', label: 'Staff Accounts & Roles', icon: Shield, count: staffAccounts.length },
          { id: 'support', label: 'Support Desk', icon: MessageSquare, count: supportTickets.length },
          { id: 'mentors', label: 'Mentors Management', icon: Users, count: mentors.length },
          { id: 'payments', label: 'Payment & Pricing Settings', icon: DollarSign },
          { id: 'applications', label: 'Credential Verifications', icon: ShieldCheck, count: pendingMentors.length },
          { id: 'certificates', label: 'Certificates Registry', icon: Award, count: certificates.length },
          { id: 'bookings', label: 'Bookings & Ledger', icon: CreditCard, count: bookings.length },
          { id: 'social', label: 'Social Content Studio', icon: Share2 },
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

      {/* ========================================================================= */}
      {/* 1. SECTION: PROGRAMS & EVENTS CMS                                         */}
      {/* ========================================================================= */}
      {activeSection === 'programs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#101828] font-heading">Programs & Events CMS</h2>
              <p className="text-xs text-[#667085]">
                Configure cohort curricula, pricing models, Google Meet live access, and SEO metadata without editing code.
              </p>
            </div>
            <button
              onClick={handleOpenCreateProgram}
              className="px-4 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Program</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F8FAF9] p-4 rounded-2xl border border-[#E5E7EB]">
            <div className="w-full sm:w-80 relative">
              <Search className="w-4 h-4 text-[#667085] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search programs by title or category..."
                value={programSearch}
                onChange={(e) => setProgramSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#111827] placeholder-[#667085] focus:outline-none focus:border-[#00A86B]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs">
              <span className="text-[#667085] text-xs font-medium">Status:</span>
              {['ALL', 'PUBLISHED', 'DRAFT', 'PAUSED', 'COMPLETED', 'ARCHIVED'].map(st => (
                <button
                  key={st}
                  onClick={() => setProgramStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold transition ${
                    programStatusFilter === st 
                      ? 'bg-[#00A86B] text-white' 
                      : 'bg-white border border-[#E5E7EB] text-[#667085] hover:text-[#111827]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Programs Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F8FAF9] text-[#667085] uppercase tracking-wider font-mono text-[10px]">
                  <th className="p-3.5">Program Details</th>
                  <th className="p-3.5">Schedule & Delivery</th>
                  <th className="p-3.5">Fee</th>
                  <th className="p-3.5">Capacity</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredPrograms.map(p => {
                  const status = p.status || 'PUBLISHED';
                  const analyticsEntry = programAnalytics[p.id] || {};
                  return (
                    <tr key={p.id} className="hover:bg-[#F8FAF9] transition">
                      <td className="p-3.5 max-w-xs">
                        <div className="font-bold text-[#101828] text-sm leading-snug">{p.title}</div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F8F1] text-[#087A52]">
                            {p.category}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#F8FAF9] text-[#667085] border border-[#E5E7EB]">
                            {p.type || 'Cohort'}
                          </span>
                          {p.googleMeetUrl && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                              <Video className="w-2.5 h-2.5" />
                              <span>Meet Ready</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-[#101828] font-semibold">{p.startDate}</div>
                        <div className="text-[11px] text-[#667085]">{p.duration}</div>
                        <div className="text-[10px] text-[#087A52] font-mono mt-0.5">{p.leadMentor}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-sm text-[#101828]">
                          {p.isFree ? <span className="text-[#087A52]">FREE</span> : `₹${p.price}`}
                        </div>
                        {p.originalPrice > p.price && (
                          <div className="text-[10px] text-[#9CA3AF] line-through font-mono">₹{p.originalPrice}</div>
                        )}
                      </td>
                      <td className="p-3.5">
                        <div className="font-mono text-xs text-[#101828]">
                          <strong>{p.seatsBooked || 0}</strong> / {p.seatsTotal} enrolled
                        </div>
                        <div className="w-24 bg-[#E5E7EB] rounded-full h-1.5 mt-1 overflow-hidden">
                          <div 
                            className="bg-[#00A86B] h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, Math.round(((p.seatsBooked || 0) / (p.seatsTotal || 50)) * 100))}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                          status === 'PUBLISHED' ? 'bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20' :
                          status === 'DRAFT' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                          status === 'PAUSED' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          status === 'COMPLETED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onNavigate(`/programs/${p.id}`)}
                            title="View Public Program Page"
                            className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-white text-[#667085] hover:text-[#00A86B]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onNavigate(`/programs/${p.id}/access`)}
                            title="View Live Meet Access Room"
                            className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-white text-[#667085] hover:text-blue-600"
                          >
                            <Video className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditProgram(p)}
                            title="Edit Program Specifications"
                            className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-white text-[#667085] hover:text-[#111827]"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => duplicateProgram(p.id)}
                            title="Duplicate Program (Create Draft Copy)"
                            className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-white text-[#667085] hover:text-[#00A86B]"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {status === 'PUBLISHED' ? (
                            <button
                              onClick={() => publishProgram(p.id, 'PAUSED')}
                              title="Pause Registrations"
                              className="p-1.5 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50"
                            >
                              <PauseCircle className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => publishProgram(p.id, 'PUBLISHED')}
                              title="Publish Program Live"
                              className="p-1.5 rounded-lg border border-[#00A86B]/30 text-[#087A52] hover:bg-[#E8F8F1]"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => archiveProgram(p.id)}
                            title="Archive Program"
                            className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-rose-50 text-[#667085] hover:text-rose-600"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SECTION: PROGRAM FUNNEL ANALYTICS                                      */}
      {/* ========================================================================= */}
      {activeSection === 'analytics' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#101828] font-heading">Program Funnel & Revenue Analytics</h2>
              <p className="text-xs text-[#667085]">
                Real-time tracking of impressions, CTA clicks, checkout visits, conversion rates, and gross enrollment revenue.
              </p>
            </div>

            {/* Program Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#667085] font-medium">Program Scope:</span>
              <select
                value={selectedAnalyticsProgId}
                onChange={(e) => setSelectedAnalyticsProgId(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-xs font-semibold text-[#101828] focus:outline-none focus:border-[#00A86B]"
              >
                <option value="ALL">All Programs Aggregated</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 6 High-Level KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm">
              <div className="text-[10px] font-mono uppercase text-[#667085]">Page Views</div>
              <div className="text-2xl font-black text-[#101828] mt-1 font-mono">{analytics.pageViews.toLocaleString()}</div>
              <div className="text-[10px] text-[#667085] mt-1">{analytics.uniqueVisitors} Uniques</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm">
              <div className="text-[10px] font-mono uppercase text-[#667085]">CTA Clicks</div>
              <div className="text-2xl font-black text-[#00A86B] mt-1 font-mono">{analytics.ctaClicks.toLocaleString()}</div>
              <div className="text-[10px] text-[#087A52] font-semibold mt-1">{viewToCtaRate}% of views</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm">
              <div className="text-[10px] font-mono uppercase text-[#667085]">Reg. Started</div>
              <div className="text-2xl font-black text-[#101828] mt-1 font-mono">{analytics.registrationVisits.toLocaleString()}</div>
              <div className="text-[10px] text-[#667085] mt-1">{ctaToRegRate}% from CTA</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm">
              <div className="text-[10px] font-mono uppercase text-[#667085]">Payments Initiated</div>
              <div className="text-2xl font-black text-[#101828] mt-1 font-mono">{analytics.paymentInitiated.toLocaleString()}</div>
              <div className="text-[10px] text-amber-600 font-semibold mt-1">{analytics.failedPayments} Drop-offs</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm">
              <div className="text-[10px] font-mono uppercase text-[#667085]">Successful Enrollments</div>
              <div className="text-2xl font-black text-[#087A52] mt-1 font-mono">{analytics.paymentSuccess.toLocaleString()}</div>
              <div className="text-[10px] text-[#087A52] font-bold mt-1">{payToSuccessRate}% checkout rate</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm">
              <div className="text-[10px] font-mono uppercase text-[#667085]">Gross Program Revenue</div>
              <div className="text-2xl font-black text-[#101828] mt-1 font-mono">₹{analytics.revenue.toLocaleString()}</div>
              <div className="text-[10px] text-[#087A52] font-semibold mt-1">Confirmed escrow</div>
            </div>
          </div>

          {/* User Funnel Breakdown Visualization */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#101828] font-heading">Conversion Funnel & Drop-off Analysis</h3>
                <p className="text-xs text-[#667085]">Chronological pipeline from first program impression to confirmed live Google Meet entry.</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#E8F8F1] text-[#087A52] font-mono font-bold text-xs border border-[#00A86B]/20">
                End-to-End: {overallConversionRate}%
              </div>
            </div>

            <div className="space-y-4">
              {[
                { stage: '1. Program Page View', count: analytics.pageViews, pct: 100, dropOff: analytics.pageViews - analytics.ctaClicks, color: 'bg-emerald-500' },
                { stage: '2. Register / Get Access CTA Click', count: analytics.ctaClicks, pct: viewToCtaRate, dropOff: analytics.ctaClicks - analytics.registrationVisits, color: 'bg-teal-500' },
                { stage: '3. Registration Details Form Visited', count: analytics.registrationVisits, pct: ((analytics.registrationVisits / Math.max(1, analytics.pageViews)) * 100).toFixed(1), dropOff: analytics.registrationVisits - analytics.paymentVisits, color: 'bg-cyan-500' },
                { stage: '4. Checkout & Payment Page Opened', count: analytics.paymentVisits, pct: ((analytics.paymentVisits / Math.max(1, analytics.pageViews)) * 100).toFixed(1), dropOff: analytics.paymentVisits - analytics.paymentInitiated, color: 'bg-blue-500' },
                { stage: '5. Razorpay Gateway Order Initiated', count: analytics.paymentInitiated, pct: ((analytics.paymentInitiated / Math.max(1, analytics.pageViews)) * 100).toFixed(1), dropOff: analytics.paymentInitiated - analytics.paymentSuccess, color: 'bg-indigo-500' },
                { stage: '6. Payment Confirmed & Live Ticket Issued', count: analytics.paymentSuccess, pct: overallConversionRate, dropOff: 0, color: 'bg-emerald-600' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#101828]">
                    <span>{item.stage}</span>
                    <div className="flex items-center gap-3 font-mono">
                      <span>{item.count.toLocaleString()} visitors</span>
                      <span className="text-[#087A52]">({item.pct}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#E5E7EB] rounded-full h-2.5 overflow-hidden">
                    <div className={`${item.color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${Math.max(2, item.pct)}%` }} />
                  </div>
                  {item.dropOff > 0 && (
                    <div className="text-[10px] text-[#667085] flex items-center justify-between pt-0.5">
                      <span className="text-amber-700 font-mono">Drop-off: {item.dropOff.toLocaleString()} users ({(((item.dropOff) / Math.max(1, item.count)) * 100).toFixed(1)}%)</span>
                      <span>Next step drop mitigation active</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Channels Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
              <h3 className="font-bold text-[#101828] text-sm font-heading">Top Acquisition Channels</h3>
              <div className="space-y-3">
                {analytics.trafficSources.map((src, i) => (
                  <div key={i} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold text-[#101828]">
                      <span>{src.source}</span>
                      <span className="font-mono text-[#087A52]">{src.visitors} ({src.percentage}%)</span>
                    </div>
                    <div className="w-full bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
                      <div className="bg-[#00A86B] h-2 rounded-full" style={{ width: `${src.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
              <h3 className="font-bold text-[#101828] text-sm font-heading">Recent Program Registrations</h3>
              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {programRegistrations.slice(0, 5).map(reg => (
                  <div key={reg.id} className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#101828]">{reg.studentName}</div>
                      <div className="text-[11px] text-[#667085]">{reg.studentEmail}</div>
                      <span className="font-mono text-[10px] text-[#087A52] font-bold">{reg.registrationCode}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-[#101828]">{reg.paymentStatus === 'FREE' ? 'FREE' : `₹${reg.paymentAmount}`}</div>
                      <div className="text-[10px] text-[#667085]">{reg.registeredAt?.substring(0, 10)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SECTION: STAFF ACCOUNTS & PERMISSION MATRIX                            */}
      {/* ========================================================================= */}
      {activeSection === 'staff' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#101828] font-heading">Staff Accounts & Access Control</h2>
              <p className="text-xs text-[#667085]">
                Manage role-based governance across 7 distinct institutional tiers. Zero plaintext password storage.
              </p>
            </div>
            <button
              onClick={() => setShowInviteStaffModal(true)}
              className="px-4 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Invite Staff Member</span>
            </button>
          </div>

          {/* Current Staff Members Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F8FAF9] text-[#667085] uppercase tracking-wider font-mono text-[10px]">
                  <th className="p-3.5">Staff Member</th>
                  <th className="p-3.5">Assigned Role</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Joined Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {staffAccounts.map(s => {
                  const roleCfg = STAFF_ROLES[s.role] || STAFF_ROLES.SUPPORT;
                  return (
                    <tr key={s.id} className="hover:bg-[#F8FAF9] transition">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-full object-cover border border-[#E5E7EB]" />
                          <div>
                            <div className="font-bold text-[#101828] text-sm">{s.name}</div>
                            <div className="text-[11px] text-[#667085]">{s.email}</div>
                            <span className="font-mono text-[10px] text-[#087A52] font-semibold">{s.pharmNexiaId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${roleCfg.badgeColor}`}>
                          {roleCfg.name}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="text-[#101828] font-medium">{s.department}</div>
                        <div className="text-[11px] text-[#667085]">{s.title}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          s.status === 'ACTIVE' ? 'bg-[#E8F8F1] text-[#087A52]' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-[#667085]">
                        {s.joinedDate}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <select
                            value={s.role}
                            onChange={(e) => updateStaffRole(s.id, e.target.value)}
                            className="p-1 rounded bg-[#F8FAF9] border border-[#E5E7EB] text-[10px] font-semibold text-[#101828]"
                          >
                            {Object.keys(STAFF_ROLES).map(rk => (
                              <option key={rk} value={rk}>{STAFF_ROLES[rk].name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => toggleStaffStatus(s.id)}
                            className="px-2 py-1 rounded border border-[#E5E7EB] text-[10px] font-semibold text-[#667085] hover:text-[#111827]"
                          >
                            {s.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                          {s.id !== 'staff-001' && (
                            <button
                              onClick={() => removeStaff(s.id)}
                              className="p-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50"
                              title="Revoke Staff Access"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Institutional Permission Matrix Reference Table */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-[#101828] text-base font-heading">Institutional Permission Matrix</h3>
              <p className="text-xs text-[#667085]">Verified privileges enforced across each platform role.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAF9] text-[#667085] font-mono text-[10px]">
                    <th className="p-2.5">System Privilege</th>
                    {Object.keys(STAFF_ROLES).map(rk => (
                      <th key={rk} className="p-2.5 text-center">{STAFF_ROLES[rk].shortName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {ALL_STAFF_PERMISSIONS.map(perm => (
                    <tr key={perm.key} className="hover:bg-[#F8FAF9]">
                      <td className="p-2.5">
                        <strong className="text-[#101828] block">{perm.label}</strong>
                        <span className="text-[10px] text-[#667085]">{perm.description}</span>
                      </td>
                      {Object.keys(STAFF_ROLES).map(rk => {
                        const hasPerm = STAFF_ROLES[rk].permissions.includes(perm.key);
                        return (
                          <td key={rk} className="p-2.5 text-center font-mono">
                            {hasPerm ? (
                              <span className="text-[#087A52] font-bold">✓</span>
                            ) : (
                              <span className="text-[#D1D5DB]">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SECTION: SUPPORT DESK CONSOLE                                          */}
      {/* ========================================================================= */}
      {activeSection === 'support' && (
        <SupportDeskAdmin onNavigate={onNavigate} />
      )}

      {/* ========================================================================= */}
      {/* 5. SECTION: DASHBOARD KPI OVERVIEW                                        */}
      {/* ========================================================================= */}
      {activeSection === 'dashboard' && (
        <div className="space-y-8">
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
              <div className="text-[10px] text-[#667085] mt-1">Cohort & session GMV</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm">
              <div className="text-[11px] font-mono uppercase text-[#667085]">Active Programs</div>
              <div className="text-2xl font-black text-[#101828] mt-1 font-mono">{totalPrograms}</div>
              <div className="text-[10px] text-[#667085] mt-1">Live cohorts & events</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm">
              <div className="text-[11px] font-mono uppercase text-[#667085]">Staff Accounts</div>
              <div className="text-2xl font-black text-[#101828] mt-1 font-mono">{staffAccounts.length}</div>
              <div className="text-[10px] text-[#087A52] font-semibold mt-1">7 RBAC tiers</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm">
              <div className="text-[11px] font-mono uppercase text-[#667085]">Issued Certificates</div>
              <div className="text-2xl font-black text-[#087A52] mt-1 font-mono">{totalCertificates}</div>
              <div className="text-[10px] text-[#667085] mt-1">Verifiable on dashboard</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm">
              <div className="text-[11px] font-mono uppercase text-[#667085]">Active Opportunities</div>
              <div className="text-2xl font-black text-[#101828] mt-1 font-mono">{activeOpps}</div>
              <div className="text-[10px] text-[#667085] mt-1">Internships & grants</div>
            </div>
          </div>

          {/* Quick Alert: Pending Mentor Credentials */}
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

          {/* Snapshots Grid */}
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

      {/* ========================================================================= */}
      {/* 6. SECTION: MENTORS MANAGEMENT (ADMIN-CONTROLLED)                         */}
      {/* ========================================================================= */}
      {activeSection === 'mentors' && (
        <div className="space-y-6">
          {/* Header & Quick Action */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#101828] font-heading">Verified Mentors Directory</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20 font-mono">
                  Admin Sole Control
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-0.5">
                Admin is the sole authority creating mentors, setting session pricing, and managing payouts.
              </p>
            </div>

            <button
              onClick={handleOpenCreateMentor}
              className="px-4 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition flex items-center gap-2 btn-primary-action"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Create Mentor</span>
            </button>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-sm">
              <div className="text-[10px] font-mono uppercase text-[#667085]">Total Registered</div>
              <div className="text-xl font-black text-[#101828] mt-1 font-heading">{mentors.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-sm">
              <div className="text-[10px] font-mono uppercase text-[#667085]">Active in Directory</div>
              <div className="text-xl font-black text-[#087A52] mt-1 font-heading">
                {mentors.filter(m => m.isActive !== false && m.verificationStatus === 'verified').length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-sm">
              <div className="text-[10px] font-mono uppercase text-[#667085]">Pricing Configured</div>
              <div className="text-xl font-black text-[#101828] mt-1 font-heading">
                {mentors.filter(m => Number(m.price30) > 0).length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-sm">
              <div className="text-[10px] font-mono uppercase text-[#667085]">Pending Verification</div>
              <div className="text-xl font-black text-amber-600 mt-1 font-heading">
                {pendingMentors.length}
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="w-full md:w-80 relative">
              <Search className="w-3.5 h-3.5 text-[#667085] absolute left-3 top-2.5" />
              <input 
                type="text" 
                value={mentorSearch}
                onChange={(e) => setMentorSearch(e.target.value)}
                placeholder="Search mentor by name, role, email..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] text-[#111827] placeholder-[#667085] focus:outline-none focus:border-[#00A86B]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={mentorTypeFilter}
                onChange={(e) => setMentorTypeFilter(e.target.value)}
                className="p-1.5 rounded-lg bg-white border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B]"
              >
                <option value="ALL">All Categories</option>
                <option value="Industry Professional">Industry Professional</option>
                <option value="Academic">Academic</option>
                <option value="Researcher">Researcher</option>
                <option value="Entrepreneur">Entrepreneur</option>
                <option value="Healthcare Professional">Healthcare Professional</option>
              </select>

              <select
                value={mentorStatusFilter}
                onChange={(e) => setMentorStatusFilter(e.target.value)}
                className="p-1.5 rounded-lg bg-white border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B]"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active Only</option>
                <option value="INACTIVE">Hidden / Inactive</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING">Pending</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>

          {/* Mentors Table */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAF9] text-[#667085] uppercase tracking-wider font-mono text-[10px]">
                    <th className="p-3">Mentor</th>
                    <th className="p-3">Current Role & Org</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Pricing (30m / 60m)</th>
                    <th className="p-3">Payout Model</th>
                    <th className="p-3">Active Status</th>
                    <th className="p-3">Verification</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredAdminMentors.map(m => {
                    const hasPrice = Number(m.price30) > 0;
                    return (
                      <tr key={m.id} className="hover:bg-[#F8FAF9] transition">
                        {/* Mentor Profile */}
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img 
                              src={m.avatarUrl} 
                              alt={m.name} 
                              className="w-9 h-9 rounded-xl object-cover border border-[#00A86B] flex-shrink-0" 
                            />
                            <div>
                              <div className="font-bold text-[#101828] flex items-center gap-1">
                                <span>{m.name}</span>
                                {m.verifiedBadge && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-[#00A86B]" title="Verified" />
                                )}
                              </div>
                              <div className="text-[11px] text-[#667085] truncate max-w-[170px]">{m.email || 'No email set'}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role & Org */}
                        <td className="p-3">
                          <div className="font-semibold text-[#111827] max-w-[190px] truncate">{m.currentRole}</div>
                          <div className="text-[11px] text-[#667085] max-w-[190px] truncate">{m.currentOrg}</div>
                          {m.qualification && (
                            <span className="text-[10px] text-[#087A52] font-mono">{m.qualification}</span>
                          )}
                        </td>

                        {/* Category */}
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-[#E8F8F1] font-mono text-[10px] text-[#087A52] border border-[#00A86B]/20 whitespace-nowrap">
                            {m.mentorType}
                          </span>
                        </td>

                        {/* Pricing (30m / 60m) */}
                        <td className="p-3">
                          {hasPrice ? (
                            <div>
                              <div className="font-mono font-bold text-[#101828] text-xs">
                                ₹{m.price30} / ₹{m.price60 || Math.round(m.price30 * 1.8)}
                              </div>
                              <div className="text-[10px] text-[#667085]">30m / 60m</div>
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold text-[10px] border border-amber-200">
                              Price not set
                            </span>
                          )}
                        </td>

                        {/* Payout Model */}
                        <td className="p-3 font-mono text-[11px] text-[#111827]">
                          {m.payoutModel === 'PERCENTAGE' ? (
                            <span className="font-semibold">{m.payoutRate || 70}% Share</span>
                          ) : (
                            <span className="font-semibold">₹{m.payoutRate || 0} Fixed</span>
                          )}
                        </td>

                        {/* Active / Inactive Status */}
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => toggleMentorActive(m.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 ${
                              m.isActive !== false 
                                ? 'bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20 hover:bg-emerald-100' 
                                : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                            }`}
                            title="Click to toggle active status in public directory"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${m.isActive !== false ? 'bg-[#00A86B]' : 'bg-gray-400'}`} />
                            <span>{m.isActive !== false ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>

                        {/* Verification Status */}
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                            m.verificationStatus === 'verified' 
                              ? 'bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20' 
                              : m.verificationStatus === 'pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-600 border border-rose-200'
                          }`}>
                            {m.verificationStatus}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditMentor(m)}
                              className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#667085] hover:text-[#00A86B] hover:border-[#00A86B] bg-white transition"
                              title="Edit Mentor & Pricing"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => onNavigate(`/mentors/${m.id}`)}
                              className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#667085] hover:text-[#00A86B] hover:border-[#00A86B] bg-white transition"
                              title="View Public Profile"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>

                            {m.verificationStatus !== 'verified' ? (
                              <button
                                onClick={() => updateMentorStatus(m.id, 'verified')}
                                className="px-2.5 py-1 rounded-lg bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[11px]"
                              >
                                Verify
                              </button>
                            ) : (
                              <button
                                onClick={() => updateMentorStatus(m.id, 'suspended', 'Suspended by admin')}
                                className="px-2 py-1 rounded-lg border border-[#E5E7EB] text-rose-600 hover:bg-rose-50 text-[11px]"
                              >
                                Suspend
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredAdminMentors.length === 0 && (
                <div className="py-12 text-center text-[#667085] space-y-2">
                  <p className="text-sm font-semibold text-[#101828]">No mentors found matching your filters.</p>
                  <p className="text-xs">Click "+ Create Mentor" to add the first verified advisor.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6B. SECTION: PAYMENT & PRICING SETTINGS (RAZORPAY GATEWAY CONTROL)       */}
      {/* ========================================================================= */}
      {activeSection === 'payments' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#101828] font-heading">Payment Gateway & Pricing Controls</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20 font-mono">
                  Razorpay Live
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-0.5">
                Manage platform pricing, membership fees, mentor revenue splits, and inspect secure Razorpay webhook status.
              </p>
            </div>
          </div>

          {/* Gateway Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Razorpay Integration Status */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F8F1] text-[#00A86B] flex items-center justify-center border border-[#00A86B]/20">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#101828] text-sm font-heading">Razorpay Integration</h3>
                    <p className="text-[11px] text-[#667085]">Production checkout & escrow ledger</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-pulse" />
                  <span>Connected</span>
                </span>
              </div>

              <div className="space-y-3 pt-2 text-xs border-t border-[#E5E7EB]">
                <div className="flex items-center justify-between py-1 border-b border-[#E5E7EB]">
                  <span className="text-[#667085]">Public Key ID:</span>
                  <span className="font-mono text-[11px] font-bold text-[#101828] bg-[#F8FAF9] px-2 py-0.5 rounded border border-[#E5E7EB]">
                    {import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_... (Configured via ENV)'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#E5E7EB]">
                  <span className="text-[#667085]">Secret Key:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] text-[#667085]">••••••••••••••••••••••••</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-mono border border-emerald-200">
                      Hidden & Secure
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#E5E7EB]">
                  <span className="text-[#667085]">Webhook URL:</span>
                  <span className="font-mono text-[10px] text-blue-600 truncate max-w-xs">
                    https://wcvnhmrgvdgfgzfsgyhs.supabase.co/functions/v1/razorpay-webhook
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-[#667085]">Signature Verification:</span>
                  <span className="font-mono text-[11px] text-[#087A52] font-semibold">HMAC SHA256 Active</span>
                </div>
              </div>
            </div>

            {/* Platform Revenue Summary */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F8F1] text-[#00A86B] flex items-center justify-center border border-[#00A86B]/20">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#101828] text-sm font-heading">Financial Split Ledger</h3>
                    <p className="text-[11px] text-[#667085]">Real-time gross bookings & platform margin</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                  <div className="text-[10px] text-[#667085] uppercase font-mono">Gross Mentorship Volume</div>
                  <div className="text-lg font-black text-[#101828] font-mono mt-1">
                    ₹{bookings.reduce((sum, b) => sum + (Number(b.paymentAmount) || 0), 0).toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                  <div className="text-[10px] text-[#667085] uppercase font-mono">Mentor Payouts Share</div>
                  <div className="text-lg font-black text-[#087A52] font-mono mt-1">
                    ₹{bookings.reduce((sum, b) => sum + (Number(b.mentorPayoutAmount) || Math.round((Number(b.paymentAmount) || 0) * 0.7)), 0).toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                  <div className="text-[10px] text-[#667085] uppercase font-mono">Platform Fee Retained</div>
                  <div className="text-lg font-black text-indigo-700 font-mono mt-1">
                    ₹{bookings.reduce((sum, b) => sum + (Number(b.platformFeeAmount) || Math.round((Number(b.paymentAmount) || 0) * 0.3)), 0).toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                  <div className="text-[10px] text-[#667085] uppercase font-mono">Paid Bookings Count</div>
                  <div className="text-lg font-black text-[#101828] font-mono mt-1">
                    {bookings.filter(b => Number(b.paymentAmount) > 0).length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Controls Form */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-[#101828] text-base font-heading">Configurable Platform Pricing Settings</h3>
              <p className="text-xs text-[#667085] mt-0.5">
                Changes apply dynamically across all booking checkouts and membership programs.
              </p>
            </div>

            {pricingSavedNotice && (
              <div className="p-3 rounded-xl bg-[#E8F8F1] border border-[#00A86B]/30 text-xs text-[#087A52] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00A86B]" />
                <span>Pricing settings successfully saved to Supabase and synchronized.</span>
              </div>
            )}

            <form onSubmit={handleSavePricingSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[#667085] font-semibold mb-1">
                    Platform Membership Fee (₹)
                  </label>
                  <input 
                    type="number" 
                    value={pricingForm.membershipFee}
                    onChange={(e) => setPricingForm(f => ({ ...f, membershipFee: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] font-mono font-bold focus:outline-none focus:border-[#00A86B]"
                  />
                  <span className="text-[10px] text-[#667085]">Default ₹99 membership plan</span>
                </div>

                <div>
                  <label className="block text-[#667085] font-semibold mb-1">
                    Mentor Payout Share (%)
                  </label>
                  <input 
                    type="number" 
                    max="100"
                    min="0"
                    value={pricingForm.mentorPayoutPercent}
                    onChange={(e) => setPricingForm(f => ({ ...f, mentorPayoutPercent: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] font-mono font-bold focus:outline-none focus:border-[#00A86B]"
                  />
                  <span className="text-[10px] text-[#667085]">e.g. 70% share to mentor</span>
                </div>

                <div>
                  <label className="block text-[#667085] font-semibold mb-1">
                    Minimum Allowed Session Fee (₹)
                  </label>
                  <input 
                    type="number" 
                    value={pricingForm.minSessionPrice}
                    onChange={(e) => setPricingForm(f => ({ ...f, minSessionPrice: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] font-mono font-bold focus:outline-none focus:border-[#00A86B]"
                  />
                  <span className="text-[10px] text-[#667085]">Floor price threshold</span>
                </div>

                <div>
                  <label className="block text-[#667085] font-semibold mb-1">
                    Maximum Allowed Session Fee (₹)
                  </label>
                  <input 
                    type="number" 
                    value={pricingForm.maxSessionPrice}
                    onChange={(e) => setPricingForm(f => ({ ...f, maxSessionPrice: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] font-mono font-bold focus:outline-none focus:border-[#00A86B]"
                  />
                  <span className="text-[10px] text-[#667085]">Cap price threshold</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition btn-primary-action"
                >
                  Save Platform Pricing Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. SECTION: CREDENTIAL VERIFICATIONS WORKFLOW                             */}
      {/* ========================================================================= */}
      {activeSection === 'applications' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#101828] font-heading">Credential Verification Queue</h2>
            <p className="text-xs text-[#667085]">
              Inspect uploaded degree certificates, employer appointments, and licenses.
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
                    <span>Submitted Document: <strong className="text-[#101828]">{pm.credentialProof || 'Verified Pharmacist Registration Certificate'}</strong></span>
                  </div>
                  <span className="text-[11px] font-mono text-[#667085]">Encrypted Storage</span>
                </div>
              </div>
            ))}

            {pendingMentors.length === 0 && (
              <div className="p-8 text-center bg-[#F8FAF9] rounded-2xl border border-[#E5E7EB] text-[#667085]">
                <CheckCircle2 className="w-8 h-8 text-[#00A86B] mx-auto mb-2" />
                <p className="font-bold text-[#101828]">All Mentor Applications Processed</p>
                <p className="text-xs text-[#667085] mt-0.5">No pending documents awaiting review.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. SECTION: CERTIFICATES REGISTRY                                         */}
      {/* ========================================================================= */}
      {activeSection === 'certificates' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#101828] font-heading">Verifiable Certificates Registry</h2>
              <p className="text-xs text-[#667085]">Issued credentials with cryptographic proof and dashboard accessibility</p>
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

                <div className="text-right font-mono text-[11px] text-[#667085]">
                  Issue Date: {c.issueDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. SECTION: BOOKINGS & PAYMENTS LEDGER                                    */}
      {/* ========================================================================= */}
      {activeSection === 'bookings' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#101828] font-heading">Bookings & Payments Ledger</h2>
              <p className="text-xs text-[#667085]">
                Transaction ledger with escrow splits, mentor payouts, and Razorpay gateway references.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#667085] font-mono">
                {bookings.length} Total Records
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {bookings.map(b => {
              const gross = Number(b.paymentAmount) || 0;
              const mentorPayout = Number(b.mentorPayoutAmount) || Math.round(gross * 0.7);
              const platformShare = Number(b.platformFeeAmount) || Math.max(0, gross - mentorPayout);

              return (
                <div key={b.id} className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs hover:border-[#00A86B]/30 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#101828] font-mono text-sm">{b.bookingCode}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        b.status === 'CONFIRMED' 
                          ? 'bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20' 
                          : b.status === 'PENDING_PAYMENT'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {b.status || 'CONFIRMED'}
                      </span>
                      <span className="font-mono text-[#087A52] bg-white px-2 py-0.5 rounded text-[10px] border border-[#E5E7EB]">
                        {b.paymentStatus || 'PAID'}
                      </span>
                    </div>
                    <div className="text-[#111827]">
                      Student: <strong>{b.studentName}</strong> ({b.studentEmail})
                    </div>
                    <div className="text-[#667085] text-[11px]">
                      Mentor: <strong>{b.mentorName}</strong> • Scheduled: {b.scheduledDate} ({b.scheduledTime})
                    </div>
                    {b.paymentId && b.paymentId !== 'FREE_SESSION' && (
                      <div className="text-[10px] font-mono text-[#667085]">
                        Razorpay Payment ID: <span className="text-[#101828] font-bold">{b.paymentId}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0 space-y-1">
                    <div className="font-mono font-black text-[#101828] text-base">
                      {gross === 0 ? 'FREE' : `₹${gross}`}
                    </div>
                    {gross > 0 && (
                      <div className="text-[11px] font-mono space-y-0.5 text-[#667085]">
                        <div>Mentor Payout: <strong className="text-[#087A52]">₹{mentorPayout}</strong></div>
                        <div>Platform Fee: <strong className="text-indigo-600">₹{platformShare}</strong></div>
                      </div>
                    )}
                    <span className="text-[10px] text-[#667085] font-mono block">
                      Gateway: Razorpay Escrow
                    </span>
                  </div>
                </div>
              );
            })}

            {bookings.length === 0 && (
              <div className="py-12 text-center text-[#667085] text-xs">
                No bookings recorded in the ledger yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. SECTION: SOCIAL CONTENT STUDIO                                        */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 11. SECTION: SYSTEM SECURITY & AUDIT TRAIL                                */}
      {/* ========================================================================= */}
      {activeSection === 'audit' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#101828] font-heading">System Security & Audit Trail</h2>
            <p className="text-xs text-[#667085]">Immutable ledger of administrative actions, program releases, and user events.</p>
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

      {/* ========================================================================= */}
      {/* MODAL: 12-STEP PROGRAM / EVENT CMS BUILDER (Large System Modal)          */}
      {/* ========================================================================= */}
      {showProgramModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-[#0F172A]/35 backdrop-blur-[4px] flex items-center justify-center p-3 sm:p-5"
          onClick={() => setShowProgramModal(false)}
        >
          <div 
            className="bg-white rounded-[20px] max-w-[860px] w-full p-6 sm:p-8 space-y-6 border border-[#E5E7EB] shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-modal-pop text-[#111827] max-h-[85vh] overflow-y-auto relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E8F8F1] text-[#087A52]">
                  {editingProgramId ? 'EDIT PROGRAM' : 'NEW PROGRAM CMS'}
                </span>
                <h3 className="text-lg font-bold text-[#101828] font-heading mt-1">
                  {editingProgramId ? `Edit: ${programForm.title}` : 'Create Program or Live Cohort'}
                </h3>
              </div>
              <button
                onClick={() => setShowProgramModal(false)}
                className="p-2 rounded-xl text-[#667085] hover:bg-[#F8FAF9] hover:text-[#111827]"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Step Navigation Bar */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 text-[11px] font-semibold border-b border-[#E5E7EB]">
              {[
                '01 Info',
                '02 Schedule',
                '03 Pricing',
                '04 Google Meet',
                '05 Mentor',
                '06 Overview',
                '07 Curriculum',
                '08 Eligibility',
                '09 SEO & Meta',
                '10 Publish'
              ].map((stepLabel, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveModalStep(idx + 1)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    activeModalStep === idx + 1
                      ? 'bg-[#00A86B] text-white font-bold'
                      : 'bg-[#F8FAF9] text-[#667085] hover:bg-gray-200'
                  }`}
                >
                  {stepLabel}
                </button>
              ))}
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProgram} className="space-y-4 text-xs">
              
              {/* STEP 1: BASIC INFORMATION */}
              {activeModalStep === 1 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-[#101828]">01. Basic Program Information</h4>
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">Program Title *</label>
                    <input
                      type="text"
                      required
                      value={programForm.title}
                      onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                      placeholder="e.g. Career in Pharmacovigilance — From B.Pharm to Industry"
                      className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#667085] font-semibold mb-1">Short Title</label>
                      <input
                        type="text"
                        value={programForm.shortTitle}
                        onChange={(e) => setProgramForm({ ...programForm, shortTitle: e.target.value })}
                        placeholder="e.g. Pharmacovigilance Mastery"
                        className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#667085] font-semibold mb-1">Category</label>
                      <select
                        value={programForm.category}
                        onChange={(e) => setProgramForm({ ...programForm, category: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827]"
                      >
                        <option value="Pharmacovigilance">Pharmacovigilance</option>
                        <option value="Regulatory Affairs">Regulatory Affairs</option>
                        <option value="Clinical Research">Clinical Research</option>
                        <option value="AI in Pharmacy">AI in Pharmacy</option>
                        <option value="Scientific Writing">Scientific Writing</option>
                        <option value="Career Bootcamps">Career Bootcamps</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#667085] font-semibold mb-1">Type</label>
                      <select
                        value={programForm.type}
                        onChange={(e) => setProgramForm({ ...programForm, type: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827]"
                      >
                        <option value="Cohort">Cohort (Multi-week)</option>
                        <option value="Workshop">Hands-on Workshop</option>
                        <option value="Masterclass">Masterclass</option>
                        <option value="Webinar">Webinar</option>
                        <option value="Bootcamp">Bootcamp</option>
                        <option value="AMA">AMA / Live Q&A</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#667085] font-semibold mb-1">Initial Status</label>
                      <select
                        value={programForm.status}
                        onChange={(e) => setProgramForm({ ...programForm, status: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827]"
                      >
                        <option value="DRAFT">DRAFT (Hidden publicly)</option>
                        <option value="PUBLISHED">PUBLISHED (Live publicly)</option>
                        <option value="PAUSED">PAUSED (Registrations paused)</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: SCHEDULE & LOGISTICS */}
              {activeModalStep === 2 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-[#101828]">02. Schedule & Logistics</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#667085] font-semibold mb-1">Start Date</label>
                      <input
                        type="date"
                        value={programForm.startDate}
                        onChange={(e) => setProgramForm({ ...programForm, startDate: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#667085] font-semibold mb-1">End Date</label>
                      <input
                        type="date"
                        value={programForm.endDate}
                        onChange={(e) => setProgramForm({ ...programForm, endDate: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#667085] font-semibold mb-1">Duration</label>
                      <input
                        type="text"
                        value={programForm.duration}
                        onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })}
                        placeholder="e.g. 4 Weeks (Weekend Cohort)"
                        className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#667085] font-semibold mb-1">Live Timings & Schedule</label>
                      <input
                        type="text"
                        value={programForm.schedule}
                        onChange={(e) => setProgramForm({ ...programForm, schedule: e.target.value })}
                        placeholder="e.g. Saturdays & Sundays, 6:00 PM - 8:00 PM IST"
                        className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">Delivery Mode</label>
                    <select
                      value={programForm.mode}
                      onChange={(e) => setProgramForm({ ...programForm, mode: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827]"
                    >
                      <option value="Online via Google Meet">Online via Google Meet</option>
                      <option value="Live Interactive + LMS Access">Live Interactive + LMS Access</option>
                      <option value="Hybrid (Live + Self-Paced)">Hybrid (Live + Self-Paced)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 3: PRICING & REGISTRATION */}
              {activeModalStep === 3 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-[#101828]">03. Pricing & Registration Settings</h4>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                    <input
                      type="checkbox"
                      id="isFreeCheck"
                      checked={programForm.isFree}
                      onChange={(e) => setProgramForm({ ...programForm, isFree: e.target.checked })}
                      className="w-4 h-4 text-[#00A86B] rounded border-[#E5E7EB]"
                    />
                    <label htmlFor="isFreeCheck" className="font-semibold text-[#101828] cursor-pointer">
                      This is a 100% Free Program (No payment gateway required)
                    </label>
                  </div>

                  {!programForm.isFree && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#667085] font-semibold mb-1">Fee / Price (₹ INR) *</label>
                        <input
                          type="number"
                          value={programForm.price}
                          onChange={(e) => setProgramForm({ ...programForm, price: e.target.value, ctaText: `Get Access — ₹${e.target.value}` })}
                          placeholder="e.g. 999 (Configurable - not fixed)"
                          className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#101828] font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[#667085] font-semibold mb-1">Original Price (for Strike-through)</label>
                        <input
                          type="number"
                          value={programForm.originalPrice}
                          onChange={(e) => setProgramForm({ ...programForm, originalPrice: e.target.value })}
                          placeholder="e.g. 2499"
                          className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#101828] font-mono"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#667085] font-semibold mb-1">Total Capacity / Seats</label>
                      <input
                        type="number"
                        value={programForm.seatsTotal}
                        onChange={(e) => setProgramForm({ ...programForm, seatsTotal: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#101828] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#667085] font-semibold mb-1">Call To Action (CTA) Button Text</label>
                      <input
                        type="text"
                        value={programForm.ctaText}
                        onChange={(e) => setProgramForm({ ...programForm, ctaText: e.target.value })}
                        placeholder="e.g. Get Access — ₹999 or Register Now"
                        className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#101828]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: GOOGLE MEET INTEGRATION */}
              {activeModalStep === 4 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-[#101828]">04. Google Meet Integration</h4>
                  <p className="text-[#667085]">
                    Confirmed registrants will access this Google Meet link at <span className="font-mono text-[#087A52]">/programs/{programForm.slug || ':id'}/access</span>.
                  </p>
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">Google Meet URL *</label>
                    <input
                      type="url"
                      value={programForm.googleMeetUrl}
                      onChange={(e) => setProgramForm({ ...programForm, googleMeetUrl: e.target.value })}
                      placeholder="https://meet.google.com/phn-pv-live"
                      className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#101828] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">Room Live Status</label>
                    <select
                      value={programForm.meetStatus}
                      onChange={(e) => setProgramForm({ ...programForm, meetStatus: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#101828]"
                    >
                      <option value="UPCOMING">UPCOMING (Accessible 15 min prior or upon confirmation)</option>
                      <option value="LIVE_NOW">LIVE NOW (Active join session)</option>
                      <option value="ENDED">ENDED (Session completed)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 5: SPEAKER & MENTOR PROFILE */}
              {activeModalStep === 5 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-[#101828]">05. Speaker & Lead Mentor Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#667085] font-semibold mb-1">Speaker / Mentor Name *</label>
                      <input
                        type="text"
                        value={programForm.leadMentor}
                        onChange={(e) => setProgramForm({ ...programForm, leadMentor: e.target.value })}
                        placeholder="e.g. Dr. Shalini Nair"
                        className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#101828]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#667085] font-semibold mb-1">Title / Role</label>
                      <input
                        type="text"
                        value={programForm.mentorRole}
                        onChange={(e) => setProgramForm({ ...programForm, mentorRole: e.target.value })}
                        placeholder="e.g. Lead Drug Safety Scientist"
                        className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#101828]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">Organization / Affiliation</label>
                    <input
                      type="text"
                      value={programForm.organization}
                      onChange={(e) => setProgramForm({ ...programForm, organization: e.target.value })}
                      placeholder="e.g. Global Pharmacovigilance Council"
                      className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#101828]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 6: OVERVIEW & DESCRIPTION */}
              {activeModalStep === 6 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-[#101828]">06. Program Overview & Narrative</h4>
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">Short Overview (1-2 sentences) *</label>
                    <textarea
                      rows={3}
                      value={programForm.overview}
                      onChange={(e) => setProgramForm({ ...programForm, overview: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#101828]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">Detailed Description (Optional)</label>
                    <textarea
                      rows={4}
                      value={programForm.longDescription}
                      onChange={(e) => setProgramForm({ ...programForm, longDescription: e.target.value })}
                      placeholder="Comprehensive briefing on topics covered and industry career relevance..."
                      className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#101828]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 7: CURRICULUM BREAKDOWN */}
              {activeModalStep === 7 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-[#101828]">07. Curriculum Breakdown</h4>
                  <p className="text-[#667085]">Modules and syllabus topics covered during the cohort.</p>
                  <div className="space-y-2">
                    {programForm.curriculum?.map((mod, mi) => (
                      <div key={mi} className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] space-y-1">
                        <div className="font-bold text-[#101828] flex items-center justify-between">
                          <span>{mod.week}: {mod.title}</span>
                          <span className="text-[10px] text-[#667085] font-mono">{mod.topics?.length || 0} topics</span>
                        </div>
                        <div className="text-[#667085] text-[11px]">{mod.topics?.join(' • ')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 8: ELIGIBILITY & SKILLS */}
              {activeModalStep === 8 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-[#101828]">08. Eligibility & Target Audience</h4>
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">Who Should Attend / Eligibility</label>
                    <textarea
                      rows={2}
                      value={programForm.eligibility}
                      onChange={(e) => setProgramForm({ ...programForm, eligibility: e.target.value })}
                      placeholder="e.g. B.Pharm, D.Pharm, M.Pharm, and Life-Science students."
                      className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#101828]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">Target Skills & Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={programForm.skills}
                      onChange={(e) => setProgramForm({ ...programForm, skills: e.target.value })}
                      placeholder="e.g. Argus Safety, MedDRA, ICSR Processing, WHO-UMC"
                      className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#101828]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 9: SEO & METADATA */}
              {activeModalStep === 9 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-[#101828]">09. SEO & Social Metadata</h4>
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={programForm.metaTitle}
                      onChange={(e) => setProgramForm({ ...programForm, metaTitle: e.target.value })}
                      placeholder="e.g. Pharmacovigilance & Argus Safety Training Cohort | PharmNexia"
                      className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#101828]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">Meta Description</label>
                    <textarea
                      rows={2}
                      value={programForm.metaDescription}
                      onChange={(e) => setProgramForm({ ...programForm, metaDescription: e.target.value })}
                      placeholder="Master ICSR case processing and Argus Safety workflows with hands-on practice..."
                      className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#101828]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 10: PREVIEW & PUBLISH */}
              {activeModalStep === 10 && (
                <div className="space-y-4 p-4 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB]">
                  <h4 className="font-bold text-sm text-[#101828]">10. Review & Publish Program</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-[#E5E7EB] pb-1.5">
                      <span className="text-[#667085]">Title:</span>
                      <strong className="text-[#101828]">{programForm.title || 'Untitled'}</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#E5E7EB] pb-1.5">
                      <span className="text-[#667085]">Category / Type:</span>
                      <span>{programForm.category} ({programForm.type})</span>
                    </div>
                    <div className="flex justify-between border-b border-[#E5E7EB] pb-1.5">
                      <span className="text-[#667085]">Fee:</span>
                      <strong className="text-[#087A52] font-mono font-bold">
                        {programForm.isFree ? 'FREE' : `₹${programForm.price}`}
                      </strong>
                    </div>
                    <div className="flex justify-between border-b border-[#E5E7EB] pb-1.5">
                      <span className="text-[#667085]">Capacity:</span>
                      <span>{programForm.seatsTotal} seats</span>
                    </div>
                    <div className="flex justify-between border-b border-[#E5E7EB] pb-1.5">
                      <span className="text-[#667085]">Meet URL:</span>
                      <span className="font-mono text-blue-600 truncate max-w-xs">{programForm.googleMeetUrl}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#667085]">Status to Save:</span>
                      <span className="font-mono font-bold text-[#087A52]">{programForm.status}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation & Submit Buttons */}
              <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                <button
                  type="button"
                  disabled={activeModalStep === 1}
                  onClick={() => setActiveModalStep(s => Math.max(1, s - 1))}
                  className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#667085] hover:text-[#111827] disabled:opacity-30"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {activeModalStep < 10 ? (
                    <button
                      type="button"
                      onClick={() => setActiveModalStep(s => Math.min(10, s + 1))}
                      className="px-5 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold shadow-sm"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-bold shadow-sm"
                    >
                      {editingProgramId ? 'Update Program' : 'Save & Publish Program'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INVITE STAFF MEMBER (Small System Modal)                           */}
      {/* ========================================================================= */}
      {showInviteStaffModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-[#0F172A]/35 backdrop-blur-[4px] flex items-center justify-center p-3 sm:p-5"
          onClick={() => setShowInviteStaffModal(false)}
        >
          <div 
            className="bg-white rounded-[20px] max-w-[440px] w-full p-6 sm:p-7 space-y-4 border border-[#E5E7EB] shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-modal-pop text-[#111827] relative my-auto max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-[#101828] font-heading">Invite Institutional Staff Member</h3>
            <p className="text-xs text-[#667085]">
              Invited staff will receive access without password exposure. Assign appropriate governance tier.
            </p>

            <form onSubmit={handleInviteStaffSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#667085] font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Ananya Roy"
                  className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B]"
                />
              </div>

              <div>
                <label className="block text-[#667085] font-semibold mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="e.g. support@pharmnexia.in"
                  className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B]"
                />
              </div>

              <div>
                <label className="block text-[#667085] font-semibold mb-1">Role & Authority Tier *</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B]"
                >
                  {Object.keys(STAFF_ROLES).map(rk => (
                    <option key={rk} value={rk}>
                      {STAFF_ROLES[rk].name} — {STAFF_ROLES[rk].description.substring(0, 50)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#667085] font-semibold mb-1">Department</label>
                <input
                  type="text"
                  value={newStaffDepartment}
                  onChange={(e) => setNewStaffDepartment(e.target.value)}
                  placeholder="e.g. Student Success / Curriculum"
                  className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827]"
                />
              </div>

              <div>
                <label className="block text-[#667085] font-semibold mb-1">Title / Designation</label>
                <input
                  type="text"
                  value={newStaffTitle}
                  onChange={(e) => setNewStaffTitle(e.target.value)}
                  placeholder="e.g. Lead Support Specialist"
                  className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteStaffModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#111827] font-semibold text-xs hover:bg-[#F8FAF9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ISSUE CERTIFICATE (Small System Modal)                             */}
      {/* ========================================================================= */}
      {showIssueCertModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-[#0F172A]/35 backdrop-blur-[4px] flex items-center justify-center p-3 sm:p-5"
          onClick={() => setShowIssueCertModal(false)}
        >
          <div 
            className="bg-white rounded-[20px] max-w-[440px] w-full p-6 sm:p-7 space-y-4 border border-[#E5E7EB] shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-modal-pop text-[#111827] relative my-auto max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-[#101828] font-heading">Generate Official Verifiable Certificate</h3>
            
            <form onSubmit={handleIssueNewCert} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#667085] font-semibold mb-1">Student Full Name *</label>
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

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT MENTOR (ADMIN INTERNAL SCROLL MODAL)                 */}
      {/* ========================================================================= */}
      {(showCreateMentorModal || showEditMentorModal) && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-[#0F172A]/40 backdrop-blur-[4px] flex items-center justify-center p-3 sm:p-5"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateMentorModal(false);
              setShowEditMentorModal(false);
            }
          }}
        >
          <div 
            className="bg-white rounded-[24px] max-w-[860px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-[#E5E7EB] overflow-hidden animate-modal-pop text-[#111827] relative my-auto max-h-[calc(100vh-48px)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Header */}
            <div className="bg-[#F8FAF9] p-5 flex items-center justify-between border-b border-[#E5E7EB] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#E8F8F1] text-[#00A86B] flex items-center justify-center border border-[#00A86B]/20">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#101828] text-base font-heading">
                    {editingMentorId ? "Edit Mentor & Pricing Configuration" : "Create New Verified Mentor"}
                  </h3>
                  <p className="text-xs text-[#667085]">
                    Administrator portal control for mentor profiles, pricing tiers, and payout models.
                  </p>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => {
                  setShowCreateMentorModal(false);
                  setShowEditMentorModal(false);
                }}
                className="p-1.5 rounded-lg text-[#667085] hover:text-[#111827] hover:bg-white transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form 
              id="adminMentorModalForm"
              onSubmit={editingMentorId ? handleSaveEditMentor : handleSaveCreateMentor}
              className="p-6 overflow-y-auto flex-1 space-y-6 text-xs"
            >
              {/* SECTION 1: PERSONAL INFORMATION */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-[#E5E7EB]">
                  <span className="w-2 h-2 rounded-full bg-[#00A86B]" />
                  <h4 className="font-bold text-[#101828] text-xs font-mono uppercase tracking-wider">
                    1. Personal Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={mentorFormData.name}
                      onChange={(e) => setMentorFormData(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Dr. Priya Sharma"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      Professional Email *
                    </label>
                    <input 
                      type="email" 
                      required
                      value={mentorFormData.email}
                      onChange={(e) => setMentorFormData(f => ({ ...f, email: e.target.value }))}
                      placeholder="e.g. priya.sharma@novartis.com"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      Profile Photo URL
                    </label>
                    <input 
                      type="url" 
                      value={mentorFormData.avatarUrl}
                      onChange={(e) => setMentorFormData(f => ({ ...f, avatarUrl: e.target.value }))}
                      placeholder="https://... (Leave empty for auto-avatar)"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      Phone Number (Private)
                    </label>
                    <input 
                      type="tel" 
                      value={mentorFormData.phone}
                      onChange={(e) => setMentorFormData(f => ({ ...f, phone: e.target.value }))}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      Location / Base
                    </label>
                    <input 
                      type="text" 
                      value={mentorFormData.location}
                      onChange={(e) => setMentorFormData(f => ({ ...f, location: e.target.value }))}
                      placeholder="e.g. Hyderabad, India"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#667085] font-semibold mb-1">
                    Short Bio (One-Line Summary)
                  </label>
                  <input 
                    type="text" 
                    value={mentorFormData.shortBio}
                    onChange={(e) => setMentorFormData(f => ({ ...f, shortBio: e.target.value }))}
                    placeholder="e.g. 8+ years leading safety evaluations and global aggregate reporting."
                    className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[#667085] font-semibold mb-1">
                    About / Full Background
                  </label>
                  <textarea 
                    rows="3"
                    value={mentorFormData.about}
                    onChange={(e) => setMentorFormData(f => ({ ...f, about: e.target.value }))}
                    placeholder="Provide a comprehensive summary of experience, advising areas, and guidance approach..."
                    className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                  />
                </div>
              </div>

              {/* SECTION 2: PROFESSIONAL INFORMATION */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 pb-1.5 border-b border-[#E5E7EB]">
                  <span className="w-2 h-2 rounded-full bg-[#00A86B]" />
                  <h4 className="font-bold text-[#101828] text-xs font-mono uppercase tracking-wider">
                    2. Professional Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      Current Role / Designation *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={mentorFormData.currentRole}
                      onChange={(e) => setMentorFormData(f => ({ ...f, currentRole: e.target.value }))}
                      placeholder="e.g. Senior Drug Safety Associate"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      Organization / College *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={mentorFormData.currentOrg}
                      onChange={(e) => setMentorFormData(f => ({ ...f, currentOrg: e.target.value }))}
                      placeholder="e.g. Novartis Healthcare / NIPER"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      Mentor Type *
                    </label>
                    <select
                      value={mentorFormData.mentorType}
                      onChange={(e) => setMentorFormData(f => ({ ...f, mentorType: e.target.value }))}
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    >
                      <option value="Industry Professional">Industry Professional</option>
                      <option value="Academic">Academic</option>
                      <option value="Researcher">Researcher</option>
                      <option value="Entrepreneur">Entrepreneur</option>
                      <option value="Government Professional">Government Professional</option>
                      <option value="Healthcare Professional">Healthcare Professional</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      Academic Qualification *
                    </label>
                    <input 
                      type="text"
                      required
                      value={mentorFormData.qualification}
                      onChange={(e) => setMentorFormData(f => ({ ...f, qualification: e.target.value }))}
                      placeholder="e.g. B.Pharm, M.Pharm (Pharmacology)"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      Previous Education (Optional)
                    </label>
                    <input 
                      type="text"
                      value={mentorFormData.previousEducation}
                      onChange={(e) => setMentorFormData(f => ({ ...f, previousEducation: e.target.value }))}
                      placeholder="e.g. B.Pharm - Manipal University"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: EXPERTISE & DOMAINS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 pb-1.5 border-b border-[#E5E7EB]">
                  <span className="w-2 h-2 rounded-full bg-[#00A86B]" />
                  <h4 className="font-bold text-[#101828] text-xs font-mono uppercase tracking-wider">
                    3. Expertise & Career Domains
                  </h4>
                </div>

                <div>
                  <label className="block text-[#667085] font-semibold mb-1">
                    Expertise Areas (Comma-Separated) *
                  </label>
                  <input 
                    type="text" 
                    value={mentorFormData.expertise}
                    onChange={(e) => setMentorFormData(f => ({ ...f, expertise: e.target.value }))}
                    placeholder="e.g. Pharmacovigilance, Argus Safety, MedDRA Coding, ICSR Review, Aggregate Reporting"
                    className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                  />
                  <span className="text-[10px] text-[#667085] mt-1 block">Separate tags with commas. These appear as chips on mentor cards.</span>
                </div>
              </div>

              {/* SECTION 4: PRICING & REVENUE SPLIT */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 pb-1.5 border-b border-[#E5E7EB]">
                  <span className="w-2 h-2 rounded-full bg-[#00A86B]" />
                  <h4 className="font-bold text-[#101828] text-xs font-mono uppercase tracking-wider">
                    4. Session Pricing & Mentor Payout
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      30 Min Session Price (₹) *
                    </label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={mentorFormData.price30}
                      onChange={(e) => setMentorFormData(f => ({ ...f, price30: e.target.value }))}
                      placeholder="e.g. 499"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] font-mono font-bold focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                    <span className="text-[10px] text-[#667085]">Must be &gt; 0</span>
                  </div>

                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      60 Min Session Price (₹) *
                    </label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={mentorFormData.price60}
                      onChange={(e) => setMentorFormData(f => ({ ...f, price60: e.target.value }))}
                      placeholder="e.g. 899"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] font-mono font-bold focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                    <span className="text-[10px] text-[#667085]">Must be &gt; 0</span>
                  </div>

                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      Mentor Payout Model
                    </label>
                    <select
                      value={mentorFormData.payoutModel}
                      onChange={(e) => setMentorFormData(f => ({ ...f, payoutModel: e.target.value }))}
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    >
                      <option value="PERCENTAGE">Percentage Share (%)</option>
                      <option value="FIXED">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      Payout Rate ({mentorFormData.payoutModel === 'PERCENTAGE' ? '%' : '₹'})
                    </label>
                    <input 
                      type="number" 
                      value={mentorFormData.payoutRate}
                      onChange={(e) => setMentorFormData(f => ({ ...f, payoutRate: e.target.value }))}
                      placeholder="e.g. 70"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] font-mono font-bold focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: AVAILABILITY & TIMINGS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 pb-1.5 border-b border-[#E5E7EB]">
                  <span className="w-2 h-2 rounded-full bg-[#00A86B]" />
                  <h4 className="font-bold text-[#101828] text-xs font-mono uppercase tracking-wider">
                    5. Availability & Slots
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      Available Days
                    </label>
                    <input 
                      type="text" 
                      value={Array.isArray(mentorFormData.availableDays) ? mentorFormData.availableDays.join(', ') : mentorFormData.availableDays}
                      onChange={(e) => setMentorFormData(f => ({ ...f, availableDays: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                      placeholder="e.g. Saturday, Sunday"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      Time Slots
                    </label>
                    <input 
                      type="text" 
                      value={Array.isArray(mentorFormData.availableSlots) ? mentorFormData.availableSlots.join(', ') : mentorFormData.availableSlots}
                      onChange={(e) => setMentorFormData(f => ({ ...f, availableSlots: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                      placeholder="e.g. 06:00 PM - 06:30 PM, 07:00 PM - 07:30 PM"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      Timezone
                    </label>
                    <input 
                      type="text" 
                      value={mentorFormData.timezone}
                      onChange={(e) => setMentorFormData(f => ({ ...f, timezone: e.target.value }))}
                      placeholder="Asia/Kolkata (IST)"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 6: STATUS & VISIBILITY CONTROLS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 pb-1.5 border-b border-[#E5E7EB]">
                  <span className="w-2 h-2 rounded-full bg-[#00A86B]" />
                  <h4 className="font-bold text-[#101828] text-xs font-mono uppercase tracking-wider">
                    6. Status & Controls
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8FAF9] p-3.5 rounded-xl border border-[#E5E7EB]">
                  <div>
                    <label className="block text-[#667085] font-semibold mb-1">
                      Verification Status
                    </label>
                    <select
                      value={mentorFormData.verificationStatus}
                      onChange={(e) => setMentorFormData(f => ({ ...f, verificationStatus: e.target.value }))}
                      className="w-full p-2.5 rounded-lg bg-white border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B]"
                    >
                      <option value="verified">Verified (Approved for Directory)</option>
                      <option value="pending">Pending Review</option>
                      <option value="suspended">Suspended / Inactive</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between sm:justify-center gap-3 pt-4 sm:pt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={mentorFormData.isActive}
                        onChange={(e) => setMentorFormData(f => ({ ...f, isActive: e.target.checked }))}
                        className="w-4 h-4 rounded text-[#00A86B] focus:ring-[#00A86B]"
                      />
                      <span className="font-semibold text-[#101828]">
                        Active in Public Directory (Live)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </form>

            {/* Fixed Footer */}
            <div className="p-4 bg-[#F8FAF9] border-t border-[#E5E7EB] flex items-center justify-between flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowCreateMentorModal(false);
                  setShowEditMentorModal(false);
                }}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#667085] hover:text-[#111827] font-semibold text-xs transition"
              >
                Cancel
              </button>

              <button
                form="adminMentorModalForm"
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition btn-primary-action"
              >
                {editingMentorId ? "Update Mentor & Pricing" : "Save & Verify Mentor"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
