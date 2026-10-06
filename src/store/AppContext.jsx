import React, { createContext, useContext, useState, useEffect } from 'react';
import { MENTORS } from '../data/mentorsData';
import { PROGRAMS, INITIAL_PROGRAM_ANALYTICS, INITIAL_PROGRAM_REGISTRATIONS } from '../data/programsData';
import { OPPORTUNITIES } from '../data/opportunitiesData';
import { RESOURCES } from '../data/resourcesData';
import { INITIAL_CERTIFICATES } from '../data/certificatesData';
import { CAREER_PATHS } from '../data/careerPathsData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { formatPharmNexiaId, formatTicketId, formatBookingId, SUPPORT_AGENTS } from '../utils/idGenerator';
import { INITIAL_SUPPORT_TICKETS } from '../data/supportTicketsData';
import { STAFF_ROLES, INITIAL_STAFF_MEMBERS, checkPermission } from '../utils/staffRoles';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // 1. Current Authenticated User (Defaults to null - NO dummy credentials)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pharmnexia_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Purge legacy mock users
      if (parsed?.id === 'std-001' || parsed?.id === 'mentor-03' || parsed?.id === 'adm-001') {
        localStorage.removeItem('pharmnexia_user');
        return null;
      }
      // Ensure user has their unique PharmNexia ID
      if (!parsed.pharmNexiaId) {
        parsed.pharmNexiaId = formatPharmNexiaId(parsed.role || 'STUDENT', parsed.id || parsed.email);
        localStorage.setItem('pharmnexia_user', JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [authLoading, setAuthLoading] = useState(true);

  // 2. Mentors State (Empty default / Loaded from Supabase DB)
  const [mentors, setMentors] = useState(() => {
    try {
      const saved = localStorage.getItem('pharmnexia_mentors');
      if (!saved) return MENTORS;
      const parsed = JSON.parse(saved);
      // Purge legacy mock mentors
      if (Array.isArray(parsed) && parsed.some(m => m.id === 'mentor-01' || m.id === 'mentor-02')) {
        localStorage.removeItem('pharmnexia_mentors');
        return [];
      }
      return parsed;
    } catch {
      return [];
    }
  });

  // 3. Bookings State (Defaults to empty array for real users)
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('pharmnexia_bookings');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.some(b => b.id === 'BK-2026-9041')) {
        localStorage.removeItem('pharmnexia_bookings');
        return [];
      }
      return parsed;
    } catch {
      return [];
    }
  });

  // 4. Certificates State
  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('pharmnexia_certificates');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  // 5. Opportunities State
  const [opportunities, setOpportunities] = useState(() => {
    const saved = localStorage.getItem('pharmnexia_opportunities');
    return saved ? JSON.parse(saved) : OPPORTUNITIES;
  });

  const [savedOpportunityIds, setSavedOpportunityIds] = useState(() => {
    const saved = localStorage.getItem('pharmnexia_saved_opps');
    return saved ? JSON.parse(saved) : [];
  });

  const [enrolledProgramIds, setEnrolledProgramIds] = useState(() => {
    const saved = localStorage.getItem('pharmnexia_enrolled_progs');
    return saved ? JSON.parse(saved) : [];
  });

  // 6. Programs State (Mutable, Dynamic CMS, LocalStorage + Supabase sync)
  const [programs, setPrograms] = useState(() => {
    try {
      const saved = localStorage.getItem('pharmnexia_programs');
      return saved ? JSON.parse(saved) : PROGRAMS;
    } catch {
      return PROGRAMS;
    }
  });

  // 7. Program Registrations State
  const [programRegistrations, setProgramRegistrations] = useState(() => {
    try {
      const saved = localStorage.getItem('pharmnexia_program_registrations');
      return saved ? JSON.parse(saved) : INITIAL_PROGRAM_REGISTRATIONS;
    } catch {
      return INITIAL_PROGRAM_REGISTRATIONS;
    }
  });

  // 8. Program Funnel Analytics State
  const [programAnalytics, setProgramAnalytics] = useState(() => {
    try {
      const saved = localStorage.getItem('pharmnexia_program_analytics');
      return saved ? JSON.parse(saved) : INITIAL_PROGRAM_ANALYTICS;
    } catch {
      return INITIAL_PROGRAM_ANALYTICS;
    }
  });

  // 9. Staff Accounts State
  const [staffAccounts, setStaffAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('pharmnexia_staff_accounts');
      return saved ? JSON.parse(saved) : INITIAL_STAFF_MEMBERS;
    } catch {
      return INITIAL_STAFF_MEMBERS;
    }
  });

  // 10. Support Tickets State (Persistent & linked to student)
  const [supportTickets, setSupportTickets] = useState(() => {
    try {
      const saved = localStorage.getItem('pharmnexia_support_tickets');
      return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
    } catch {
      return INITIAL_SUPPORT_TICKETS;
    }
  });

  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Helper to map Supabase User / Google Auth User to application user object
  const mapSupabaseUser = (user) => {
    if (!user) return null;
    const meta = user.user_metadata || {};
    const fullName = meta.full_name || meta.name || user.email?.split('@')[0] || 'User';
    const role = (meta.role || 'STUDENT').toUpperCase();
    return {
      id: user.id,
      pharmNexiaId: meta.pharm_nexia_id || formatPharmNexiaId(role, user.id || user.email),
      email: user.email,
      name: fullName,
      role: role,
      college: meta.college || '',
      degree: meta.degree || 'B.Pharm',
      year: meta.year || '3rd Year',
      bio: meta.bio || '',
      interests: meta.interests || ['Pharmacovigilance', 'Medical Writing'],
      avatar: meta.avatar_url || meta.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
      provider: user.app_metadata?.provider || 'supabase'
    };
  };

  // Sync Supabase Auth & Real DB Mentors
  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    // A. Check active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const appUser = mapSupabaseUser(session.user);
        setCurrentUser(appUser);
      }
      setAuthLoading(false);
    }).catch(err => {
      console.warn('[PharmNexia Auth] Session check error:', err);
      setAuthLoading(false);
    });

    // B. Subscribe to Auth state changes (Google OAuth redirect, Login, Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const appUser = mapSupabaseUser(session.user);
        setCurrentUser(appUser);
      } else {
        setCurrentUser(null);
        localStorage.removeItem('pharmnexia_user');
      }
      setAuthLoading(false);
    });

    // C. Fetch real verified mentors from Supabase database
    const fetchSupabaseMentors = async () => {
      try {
        const { data, error } = await supabase
          .from('mentors')
          .select(`
            *,
            profiles:user_id(full_name, email, avatar_url)
          `)
          .eq('verification_status', 'VERIFIED');

        if (!error && data && data.length > 0) {
          const mapped = data.map(m => ({
            id: m.id,
            name: m.profiles?.full_name || 'Verified Mentor',
            email: m.profiles?.email || '',
            avatarUrl: m.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.profiles?.full_name || 'Mentor')}`,
            verificationStatus: 'verified',
            verifiedBadge: true,
            currentRole: m.current_role,
            currentOrg: m.current_org,
            qualification: m.qualification,
            previousEducation: m.previous_education,
            mentorType: m.mentor_type || 'Alumni',
            paymentModel: m.payment_model || 'Free',
            careerPathSlugs: m.career_paths || [],
            expertise: m.expertise || [],
            rating: Number(m.rating) || 5.0,
            reviewCount: Number(m.review_count) || 0,
            sessionsCompleted: Number(m.sessions_completed) || 0,
            sessionDuration: '30 / 60 min',
            price30: Number(m.price_30) || 0,
            price60: Number(m.price_60) || 0,
            about: m.about || '',
            whatICanHelpWith: m.what_i_can_help_with || [],
            availableDays: m.available_days || ['Saturday', 'Sunday'],
            availableSlots: m.available_slots || ['06:00 PM - 06:30 PM', '07:00 PM - 07:30 PM'],
            reviews: []
          }));
          setMentors(mapped);
        }
      } catch (err) {
        console.warn('[PharmNexia] Database mentors fetch:', err);
      }
    };

    fetchSupabaseMentors();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pharmnexia_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pharmnexia_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pharmnexia_mentors', JSON.stringify(mentors));
  }, [mentors]);

  useEffect(() => {
    localStorage.setItem('pharmnexia_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('pharmnexia_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('pharmnexia_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('pharmnexia_saved_opps', JSON.stringify(savedOpportunityIds));
  }, [savedOpportunityIds]);

  useEffect(() => {
    localStorage.setItem('pharmnexia_enrolled_progs', JSON.stringify(enrolledProgramIds));
  }, [enrolledProgramIds]);

  useEffect(() => {
    localStorage.setItem('pharmnexia_support_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem('pharmnexia_programs', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem('pharmnexia_program_registrations', JSON.stringify(programRegistrations));
  }, [programRegistrations]);

  useEffect(() => {
    localStorage.setItem('pharmnexia_program_analytics', JSON.stringify(programAnalytics));
  }, [programAnalytics]);

  useEffect(() => {
    localStorage.setItem('pharmnexia_staff_accounts', JSON.stringify(staffAccounts));
  }, [staffAccounts]);

  // ==============================================================================
  // AUTHENTICATION ACTIONS (REAL GOOGLE & EMAIL AUTH VIA SUPABASE)
  // ==============================================================================

  // 1. Google OAuth Sign In
  const loginWithGoogle = async () => {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error(
        "Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel Environment Variables."
      );
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) throw error;
    return data;
  };

  // 2. Email & Password Sign In
  const loginWithEmail = async (email, password) => {
    if (!supabase || !isSupabaseConfigured) {
      // Local fallback when Supabase keys are pending
      const mockUser = {
        id: `usr-${Date.now()}`,
        pharmNexiaId: formatPharmNexiaId('STUDENT', email),
        email: email.trim(),
        name: email.split('@')[0],
        role: 'STUDENT',
        degree: 'B.Pharm',
        year: '3rd Year',
        interests: ['Pharmacovigilance', 'Medical Writing'],
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
        provider: 'local'
      };
      setCurrentUser(mockUser);
      return { user: mockUser };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) throw error;
    return data;
  };

  // 3. Email & Password Sign Up
  const signupWithEmail = async (email, password, metadata = {}) => {
    if (!supabase || !isSupabaseConfigured) {
      const mockUser = {
        id: `usr-${Date.now()}`,
        pharmNexiaId: formatPharmNexiaId(metadata.role || 'STUDENT', email),
        email: email.trim(),
        name: metadata.name || email.split('@')[0],
        role: metadata.role || 'STUDENT',
        degree: metadata.degree || 'B.Pharm',
        year: metadata.year || '1st Year',
        college: metadata.college || '',
        interests: metadata.interests || ['Pharmacovigilance', 'Clinical Research'],
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(metadata.name || email)}`,
        provider: 'local'
      };
      setCurrentUser(mockUser);
      return { user: mockUser };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: metadata.name || '',
          degree: metadata.degree || 'B.Pharm',
          year: metadata.year || '1st Year',
          college: metadata.college || '',
          role: metadata.role || 'STUDENT',
          pharm_nexia_id: formatPharmNexiaId(metadata.role || 'STUDENT', email)
        }
      }
    });

    if (error) throw error;
    return data;
  };

  // Compatibility helper
  const loginUser = (email, password, role = 'STUDENT') => {
    return loginWithEmail(email, password);
  };

  // Sign Out
  const logoutUser = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out error:', err);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem('pharmnexia_user');
  };

  const updateStudentProfile = (updatedFields) => {
    if (currentUser) {
      const updated = { ...currentUser, ...updatedFields };
      setCurrentUser(updated);
      addNotification({
        title: "Profile Updated",
        message: "Your student academic details were saved successfully.",
        type: "SYSTEM"
      });
    }
  };

  // ==============================================================================
  // BOOKING ACTIONS
  // ==============================================================================
  const createBooking = ({ mentorId, sessionDuration, scheduledDate, scheduledTime, notes, paymentAmount, studentInfo }) => {
    const mentor = mentors.find(m => m.id === mentorId);
    const newBookingId = formatBookingId(Date.now().toString());
    const newBooking = {
      id: newBookingId,
      bookingCode: newBookingId,
      studentId: currentUser?.id || "guest-std",
      studentPharmNexiaId: currentUser?.pharmNexiaId || "PHN-STU-001247",
      studentName: studentInfo?.name || currentUser?.name || "Student Aspirant",
      studentEmail: studentInfo?.email || currentUser?.email || "",
      mentorId: mentor?.id,
      mentorName: mentor?.name || "Verified Mentor",
      mentorRole: mentor?.currentRole || "Career Mentor",
      mentorAvatar: mentor?.avatarUrl || "",
      scheduledDate,
      scheduledTime,
      sessionDuration: Number(sessionDuration),
      status: "CONFIRMED",
      meetingLink: `https://meet.pharmnexia.in/room/session-${newBookingId.toLowerCase()}`,
      paymentAmount: Number(paymentAmount) || 0,
      paymentStatus: paymentAmount > 0 ? "PAID" : "FREE_SESSION",
      notes: notes || "General career roadmap discussion",
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);

    addNotification({
      title: "Booking Confirmed!",
      message: `Your mentorship session with ${mentor?.name || 'Mentor'} is scheduled for ${scheduledDate} at ${scheduledTime}. (Booking ID: ${newBookingId})`,
      type: "BOOKING",
      link: "/dashboard"
    });

    return newBooking;
  };

  // ==============================================================================
  // SUPPORT DESK ACTIONS (Personalized, Ticket-Based, Privacy-Enforced)
  // ==============================================================================
  const createSupportTicket = ({ category, subject, initialMessage, attachedContext = {} }) => {
    const studentId = currentUser?.pharmNexiaId || formatPharmNexiaId(currentUser?.role || 'STUDENT', currentUser?.id || currentUser?.email || 'guest');
    const ticketId = formatTicketId(supportTickets.length + 4825);
    
    // Auto-assignment to available support executive
    const assignedAgent = SUPPORT_AGENTS[supportTickets.length % SUPPORT_AGENTS.length];

    const newTicket = {
      id: ticketId,
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Student Aspirant',
      userPharmNexiaId: studentId,
      userEmail: currentUser?.email || '',
      userRole: currentUser?.role || 'STUDENT',
      category: category || 'Other',
      subject: subject || `${category || 'Support'} Request`,
      context: {
        bookingId: attachedContext?.bookingId || '',
        mentorName: attachedContext?.mentorName || '',
        sessionDate: attachedContext?.sessionDate || '',
        paymentStatus: attachedContext?.paymentStatus || '',
        paymentAmount: attachedContext?.paymentAmount || null,
        education: currentUser?.degree ? `${currentUser.degree} — ${currentUser.year || 'Student'}` : 'B.Pharm',
        interests: currentUser?.interests || ['Pharmacovigilance', 'Medical Writing'],
        recentActivity: attachedContext?.recentActivity || [
          `Joined PharmNexia (${studentId})`,
          `Opened Support Ticket ${ticketId}`
        ]
      },
      status: 'ASSIGNED',
      assignedAgent: {
        id: assignedAgent.id,
        pharmNexiaId: assignedAgent.pharmNexiaId,
        name: assignedAgent.name,
        roleTitle: assignedAgent.roleTitle,
        avatar: assignedAgent.avatar
      },
      messages: [
        {
          id: `msg-${Date.now()}-1`,
          senderId: studentId,
          senderRole: 'STUDENT',
          senderName: currentUser?.name || 'Student',
          text: initialMessage,
          timestamp: 'Just now'
        },
        {
          id: `msg-${Date.now()}-2`,
          senderId: assignedAgent.pharmNexiaId,
          senderRole: 'SUPPORT',
          senderName: assignedAgent.name,
          text: `Hi ${currentUser?.name ? currentUser.name.split(' ')[0] : 'there'}! 👋 I am ${assignedAgent.name} from PharmNexia Support Desk. I've received your request under ticket ${ticketId}. Let me check that for you right away.`,
          timestamp: 'Just now'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSupportTickets(prev => [newTicket, ...prev]);

    addNotification({
      title: "Support Ticket Opened",
      message: `Your ticket ${ticketId} has been created and assigned to ${assignedAgent.name}.`,
      type: "SYSTEM"
    });

    return newTicket;
  };

  const sendMessageToTicket = (ticketId, text, senderRole = 'STUDENT', senderName = '') => {
    if (!text || !text.trim()) return;
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSupportTickets(prev => prev.map(tkt => {
      if (tkt.id !== ticketId) return tkt;
      const isStudent = senderRole === 'STUDENT';
      const senderId = isStudent 
        ? (currentUser?.pharmNexiaId || tkt.userPharmNexiaId)
        : (tkt.assignedAgent?.pharmNexiaId || 'PHN-SPT-000001');
      const name = senderName || (isStudent ? (currentUser?.name || tkt.userName) : (tkt.assignedAgent?.name || 'Support Executive'));

      const newMsg = {
        id: `msg-${Date.now()}`,
        senderId,
        senderRole,
        senderName: name,
        text: text.trim(),
        timestamp: `Today, ${timeFormatted}`
      };

      return {
        ...tkt,
        status: isStudent ? (tkt.status === 'WAITING_FOR_STUDENT' ? 'IN_PROGRESS' : tkt.status) : tkt.status,
        messages: [...tkt.messages, newMsg],
        updatedAt: now.toISOString()
      };
    }));
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    setSupportTickets(prev => prev.map(tkt => {
      if (tkt.id !== ticketId) return tkt;
      return {
        ...tkt,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
    }));
  };

  const assignTicketAgent = (ticketId, agentId) => {
    const agent = SUPPORT_AGENTS.find(a => a.id === agentId || a.pharmNexiaId === agentId) || SUPPORT_AGENTS[0];
    setSupportTickets(prev => prev.map(tkt => {
      if (tkt.id !== ticketId) return tkt;
      return {
        ...tkt,
        assignedAgent: {
          id: agent.id,
          pharmNexiaId: agent.pharmNexiaId,
          name: agent.name,
          roleTitle: agent.roleTitle,
          avatar: agent.avatar
        },
        status: tkt.status === 'NEW' ? 'ASSIGNED' : tkt.status,
        updatedAt: new Date().toISOString()
      };
    }));
  };

  const cancelBooking = (bookingId, reason = "Student requested cancellation") => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "CANCELLED", cancellationReason: reason } : b));
    addNotification({
      title: "Booking Cancelled",
      message: `Session ${bookingId} has been cancelled.`,
      type: "BOOKING"
    });
  };

  // ==============================================================================
  // PROGRAM & EVENT CMS ACTIONS
  // ==============================================================================
  const createProgram = (programData) => {
    const slug = (programData.slug || programData.title || `prog-${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const newId = programData.id || `prog-${slug}`;

    const newProgram = {
      id: newId,
      slug: slug,
      title: programData.title || "Untitled Program",
      shortTitle: programData.shortTitle || programData.title || "Program",
      category: programData.category || "Pharmacovigilance",
      type: programData.type || "Cohort",
      status: programData.status || "DRAFT",
      level: programData.level || "Beginner to Intermediate",
      mode: programData.mode || "Online via Google Meet",
      location: programData.location || "Google Meet Live",
      duration: programData.duration || "4 Weeks",
      schedule: programData.schedule || "Weekends",
      startDate: programData.startDate || new Date().toISOString().split('T')[0],
      endDate: programData.endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      startTime: programData.startTime || "6:00 PM",
      endTime: programData.endTime || "8:00 PM",
      price: Number(programData.price) || 0,
      originalPrice: Number(programData.originalPrice) || Number(programData.price) || 0,
      isFree: Boolean(programData.isFree || Number(programData.price) === 0),
      currency: programData.currency || "INR",
      paymentRequired: Boolean(!programData.isFree && Number(programData.price) > 0),
      registrationDeadline: programData.registrationDeadline || "",
      ctaText: programData.ctaText || (programData.isFree ? "Register for Free" : `Get Access — ₹${programData.price}`),
      seatsTotal: Number(programData.seatsTotal) || 50,
      seatsBooked: 0,
      rating: 5.0,
      reviewCount: 0,
      googleMeetUrl: programData.googleMeetUrl || `https://meet.google.com/phn-${slug.slice(0, 12)}`,
      meetStatus: programData.meetStatus || "UPCOMING",
      meetStartTime: programData.meetStartTime || programData.schedule || "Live on Google Meet",
      certificateIncluded: programData.certificateIncluded ?? true,
      certificateType: programData.certificateType || "PharmNexia Verified Credential",
      leadMentor: programData.leadMentor || currentUser?.name || "Verified Industry Mentor",
      mentorRole: programData.mentorRole || "Senior Industry Specialist",
      organization: programData.organization || "PharmNexia Academic Network",
      skills: Array.isArray(programData.skills) ? programData.skills : (typeof programData.skills === 'string' ? programData.skills.split(',').map(s => s.trim()) : []),
      metaTitle: programData.metaTitle || `${programData.title} | PharmNexia`,
      metaDescription: programData.metaDescription || programData.overview || "",
      ogTitle: programData.ogTitle || programData.title || "",
      ogDescription: programData.ogDescription || programData.overview || "",
      ogImage: programData.ogImage || programData.coverImage || "",
      canonicalUrl: programData.canonicalUrl || `https://pharmnexia.in/programs/${newId}`,
      coverImage: programData.coverImage || "",
      thumbnail: programData.thumbnail || "",
      overview: programData.overview || programData.description || "",
      longDescription: programData.longDescription || "",
      eligibility: programData.eligibility || "B.Pharm, M.Pharm, Pharm.D and Life Science aspirants.",
      careerPath: programData.careerPath || programData.category || "Pharmacovigilance",
      learningOutcomes: Array.isArray(programData.learningOutcomes) ? programData.learningOutcomes : [
        "Core foundational and industry concepts",
        "Hands-on case studies and real-world tools",
        "Verifiable certificate of completion"
      ],
      curriculum: Array.isArray(programData.curriculum) && programData.curriculum.length > 0 ? programData.curriculum : [
        { week: "Module 1", title: "Foundations & Industry Standards", topics: ["Introduction and fundamentals", "Regulatory guidelines"] },
        { week: "Module 2", title: "Practical Application & Hands-on Tools", topics: ["Real-world case workflows", "Capstone project"] }
      ],
      faqs: Array.isArray(programData.faqs) && programData.faqs.length > 0 ? programData.faqs : [
        { q: "Is session recording available if I miss live?", a: "Yes, recordings are posted to the student LMS with lifetime access." },
        { q: "Will I receive a verifiable certificate?", a: "Yes, upon completing the final module assessment." }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPrograms(prev => [newProgram, ...prev]);

    setProgramAnalytics(prev => ({
      ...prev,
      [newId]: {
        pageViews: 1,
        uniqueVisitors: 1,
        ctaClicks: 0,
        registrationVisits: 0,
        paymentVisits: 0,
        paymentInitiated: 0,
        paymentSuccess: 0,
        revenue: 0,
        trafficSources: [
          { source: "Direct Referral", visitors: 1, percentage: 100 }
        ]
      }
    }));

    addAuditLog({
      actor: currentUser?.name || 'Administrator',
      action: 'CREATE_PROGRAM',
      details: `Created new program: "${newProgram.title}" (Status: ${newProgram.status})`,
      status: 'SUCCESS'
    });

    addNotification({
      title: "Program Created",
      message: `"${newProgram.title}" has been saved as ${newProgram.status}.`,
      type: "SYSTEM"
    });

    return newProgram;
  };

  const updateProgram = (programId, updatedFields) => {
    setPrograms(prev => prev.map(p => {
      if (p.id === programId) {
        return {
          ...p,
          ...updatedFields,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    addAuditLog({
      actor: currentUser?.name || 'Administrator',
      action: 'UPDATE_PROGRAM',
      details: `Updated program specifications for ID: ${programId}`,
      status: 'SUCCESS'
    });
  };

  const duplicateProgram = (programId) => {
    const original = programs.find(p => p.id === programId);
    if (!original) return null;

    const copySuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `${original.id}-copy-${copySuffix}`;
    const duplicated = {
      ...original,
      id: newId,
      slug: `${original.slug || original.id}-copy-${copySuffix}`,
      title: `${original.title} (Draft Copy)`,
      status: 'DRAFT',
      seatsBooked: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPrograms(prev => [duplicated, ...prev]);

    setProgramAnalytics(prev => ({
      ...prev,
      [newId]: {
        pageViews: 0,
        uniqueVisitors: 0,
        ctaClicks: 0,
        registrationVisits: 0,
        paymentVisits: 0,
        paymentInitiated: 0,
        paymentSuccess: 0,
        revenue: 0,
        trafficSources: []
      }
    }));

    addAuditLog({
      actor: currentUser?.name || 'Administrator',
      action: 'DUPLICATE_PROGRAM',
      details: `Duplicated "${original.title}" into draft copy "${duplicated.title}"`,
      status: 'SUCCESS'
    });

    return duplicated;
  };

  const archiveProgram = (programId) => {
    setPrograms(prev => prev.map(p => p.id === programId ? { ...p, status: 'ARCHIVED', updatedAt: new Date().toISOString() } : p));
    addAuditLog({
      actor: currentUser?.name || 'Administrator',
      action: 'ARCHIVE_PROGRAM',
      details: `Archived program ID: ${programId}`,
      status: 'SUCCESS'
    });
  };

  const publishProgram = (programId, newStatus = 'PUBLISHED') => {
    setPrograms(prev => prev.map(p => p.id === programId ? { ...p, status: newStatus, updatedAt: new Date().toISOString() } : p));
    addAuditLog({
      actor: currentUser?.name || 'Administrator',
      action: 'CHANGE_PROGRAM_STATUS',
      details: `Set status of program ${programId} to ${newStatus}`,
      status: 'SUCCESS'
    });
  };

  const deleteProgram = (programId) => {
    setPrograms(prev => prev.filter(p => p.id !== programId));
    addAuditLog({
      actor: currentUser?.name || 'Administrator',
      action: 'DELETE_PROGRAM',
      details: `Deleted program ID: ${programId}`,
      status: 'SUCCESS'
    });
  };

  // ==============================================================================
  // PROGRAM FUNNEL ANALYTICS ACTIONS
  // ==============================================================================
  const trackAnalyticsEvent = ({ programId, eventType, metadata = {} }) => {
    if (!programId) return;

    setProgramAnalytics(prev => {
      const current = prev[programId] || {
        pageViews: 0,
        uniqueVisitors: 0,
        ctaClicks: 0,
        registrationVisits: 0,
        paymentVisits: 0,
        paymentInitiated: 0,
        paymentSuccess: 0,
        revenue: 0,
        trafficSources: [
          { source: "Direct Referral", visitors: 1, percentage: 100 }
        ]
      };

      const updated = { ...current };

      switch (eventType) {
        case 'PAGE_VIEW':
          updated.pageViews += 1;
          updated.uniqueVisitors += 1;
          break;
        case 'CTA_CLICK':
          updated.ctaClicks += 1;
          break;
        case 'REGISTRATION_VISIT':
          updated.registrationVisits += 1;
          break;
        case 'PAYMENT_PAGE_VISIT':
          updated.paymentVisits += 1;
          break;
        case 'PAYMENT_INITIATED':
          updated.paymentInitiated += 1;
          break;
        case 'PAYMENT_SUCCESS':
          updated.paymentSuccess += 1;
          if (metadata.amount) {
            updated.revenue += Number(metadata.amount);
          }
          break;
        default:
          break;
      }

      return {
        ...prev,
        [programId]: updated
      };
    });

    if (supabase && isSupabaseConfigured) {
      supabase.from('program_analytics_events').insert({
        program_id: programId,
        event_type: eventType,
        metadata: metadata,
        user_id: currentUser?.id || null
      }).then(() => {}).catch(() => {});
    }
  };

  // ==============================================================================
  // PROGRAM ENROLLMENT & LIVE ACCESS ACTIONS
  // ==============================================================================
  const registerForProgram = (programId, paymentDetails = {}) => {
    const prog = programs.find(p => p.id === programId) || programs[0];
    const ticketCode = `PHN-REG-${Math.floor(100000 + Math.random() * 900000)}`;
    const studentName = paymentDetails.name || currentUser?.name || 'Student Aspirant';
    const studentEmail = paymentDetails.email || currentUser?.email || 'student@example.com';
    const meetUrl = prog?.googleMeetUrl || `https://meet.google.com/phn-${prog?.id || 'live'}`;

    const newReg = {
      id: `reg-${Date.now()}`,
      registrationCode: ticketCode,
      programId: prog?.id,
      programTitle: prog?.title,
      studentId: currentUser?.id || `std-${Date.now()}`,
      studentPharmNexiaId: currentUser?.pharmNexiaId || formatPharmNexiaId('STUDENT', studentEmail),
      studentName,
      studentEmail,
      paymentStatus: prog?.isFree ? 'FREE' : 'PAID',
      paymentAmount: prog?.isFree ? 0 : (prog?.price || 0),
      paymentId: paymentDetails.paymentId || (prog?.isFree ? 'FREE_ENROLLMENT' : `pay_sim_${Date.now().toString().slice(-6)}`),
      currency: prog?.currency || 'INR',
      googleMeetUrl: meetUrl,
      registeredAt: new Date().toISOString()
    };

    setProgramRegistrations(prev => [newReg, ...prev]);

    if (!enrolledProgramIds.includes(programId)) {
      setEnrolledProgramIds(prev => [...prev, programId]);
    }

    setPrograms(prev => prev.map(p => {
      if (p.id === programId) {
        return {
          ...p,
          seatsBooked: Math.min((p.seatsBooked || 0) + 1, p.seatsTotal || 100)
        };
      }
      return p;
    }));

    trackAnalyticsEvent({
      programId,
      eventType: 'PAYMENT_SUCCESS',
      metadata: { amount: prog?.isFree ? 0 : prog?.price }
    });

    addAuditLog({
      actor: studentName,
      action: 'PROGRAM_ENROLLMENT',
      details: `Enrolled in "${prog?.title}" (Ticket: ${ticketCode}, Link: ${meetUrl})`,
      status: 'SUCCESS'
    });

    addNotification({
      title: "Enrollment Confirmed!",
      message: `You are enrolled in "${prog?.title}". Your live Google Meet link is active!`,
      type: "PROGRAM",
      link: `/programs/${programId}/access`
    });

    return newReg;
  };

  // ==============================================================================
  // STAFF ACCOUNTS & PERMISSION ACTIONS
  // ==============================================================================
  const inviteStaff = ({ name, email, role = 'SUPPORT', department = '', title = '', notes = '' }) => {
    const nextNum = staffAccounts.length + 1;
    const newStaff = {
      id: `staff-${String(nextNum).padStart(3, '0')}`,
      pharmNexiaId: `PHN-STF-${String(nextNum).padStart(6, '0')}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role,
      department: department || STAFF_ROLES[role]?.departmentDefault || 'Platform Operations',
      title: title || STAFF_ROLES[role]?.name || 'Staff Member',
      status: 'ACTIVE',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}`,
      invitedBy: currentUser?.name || 'Dr. K. Sen',
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Invited just now',
      notes: notes || ''
    };

    setStaffAccounts(prev => [newStaff, ...prev]);

    addAuditLog({
      actor: currentUser?.name || 'Super Admin',
      action: 'INVITE_STAFF',
      details: `Invited ${newStaff.name} (${newStaff.email}) as ${STAFF_ROLES[role]?.name || role} in ${newStaff.department}`,
      status: 'SUCCESS'
    });

    addNotification({
      title: "Staff Member Invited",
      message: `${newStaff.name} has been added as ${newStaff.role}.`,
      type: "SYSTEM"
    });

    return newStaff;
  };

  const updateStaffRole = (staffId, newRole) => {
    setStaffAccounts(prev => prev.map(s => {
      if (s.id === staffId) {
        return {
          ...s,
          role: newRole,
          title: STAFF_ROLES[newRole]?.name || s.title
        };
      }
      return s;
    }));

    addAuditLog({
      actor: currentUser?.name || 'Super Admin',
      action: 'UPDATE_STAFF_ROLE',
      details: `Changed role of staff ID ${staffId} to ${newRole}`,
      status: 'SUCCESS'
    });
  };

  const toggleStaffStatus = (staffId) => {
    setStaffAccounts(prev => prev.map(s => {
      if (s.id === staffId) {
        const nextStatus = s.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        addAuditLog({
          actor: currentUser?.name || 'Super Admin',
          action: 'TOGGLE_STAFF_STATUS',
          details: `Changed status of ${s.name} (${s.id}) to ${nextStatus}`,
          status: 'SUCCESS'
        });
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const removeStaff = (staffId) => {
    const target = staffAccounts.find(s => s.id === staffId);
    if (!target) return;
    if (target.id === 'staff-001') {
      alert("Cannot remove the Genesis Platform Super Admin account.");
      return;
    }
    setStaffAccounts(prev => prev.filter(s => s.id !== staffId));

    addAuditLog({
      actor: currentUser?.name || 'Super Admin',
      action: 'REMOVE_STAFF',
      details: `Revoked access and removed staff account ${target.name} (${target.email})`,
      status: 'SUCCESS'
    });
  };

  // Opportunities
  const toggleSaveOpportunity = (oppId) => {
    setSavedOpportunityIds(prev => 
      prev.includes(oppId) ? prev.filter(id => id !== oppId) : [...prev, oppId]
    );
  };

  // Certificate Verification & Generation
  const verifyCertificate = (certId) => {
    return certificates.find(c => c.certificateId.trim().toUpperCase() === certId.trim().toUpperCase());
  };

  const issueCertificate = (newCertData) => {
    const certId = `PHN-2026-${String(certificates.length + 1).padStart(6, '0')}`;
    const cert = {
      ...newCertData,
      certificateId: certId,
      issueDate: new Date().toISOString().split('T')[0],
      status: "Verified & Authentic",
      issuer: "PharmNexia Academic & Career Council",
      credentialIdHash: `0x${Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
      verificationUrl: `https://pharmnexia.in/verify-certificate/${certId}`
    };
    setCertificates(prev => [cert, ...prev]);
    return cert;
  };

  // Admin Mentor Actions
  const updateMentorStatus = (mentorId, status, notes = "") => {
    setMentors(prev => prev.map(m => {
      if (m.id === mentorId) {
        return {
          ...m,
          verificationStatus: status,
          verifiedBadge: status === 'verified'
        };
      }
      return m;
    }));
  };

  const addMentor = (mentorData) => {
    const newId = `mentor-${String(mentors.length + 1).padStart(2, '0')}`;
    const newMentor = {
      ...mentorData,
      id: newId,
      verificationStatus: 'pending',
      verifiedBadge: false,
      rating: 5.0,
      reviewCount: 0,
      sessionsCompleted: 0
    };
    setMentors(prev => [newMentor, ...prev]);
  };

  const addNotification = ({ title, message, type = "SYSTEM", link = null }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      time: "Just now",
      isRead: false,
      link
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addAuditLog = ({ actor, action, details, status = "SUCCESS" }) => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      action,
      details,
      status
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        authLoading,
        isSupabaseConfigured,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        loginUser,
        logoutUser,
        updateStudentProfile,
        mentors,
        programs,
        programRegistrations,
        programAnalytics,
        staffAccounts,
        staffRoles: STAFF_ROLES,
        checkPermission,
        createProgram,
        updateProgram,
        duplicateProgram,
        archiveProgram,
        publishProgram,
        deleteProgram,
        trackAnalyticsEvent,
        inviteStaff,
        updateStaffRole,
        toggleStaffStatus,
        removeStaff,
        careerPaths: CAREER_PATHS,
        opportunities,
        resources: RESOURCES,
        certificates,
        bookings,
        savedOpportunityIds,
        enrolledProgramIds,
        notifications,
        auditLogs,
        supportTickets,
        supportAgents: SUPPORT_AGENTS,
        createSupportTicket,
        sendMessageToTicket,
        updateTicketStatus,
        assignTicketAgent,
        createBooking,
        cancelBooking,
        registerForProgram,
        toggleSaveOpportunity,
        verifyCertificate,
        issueCertificate,
        updateMentorStatus,
        addMentor,
        addNotification,
        markAllNotificationsRead,
        addAuditLog
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};

export default AppContext;
