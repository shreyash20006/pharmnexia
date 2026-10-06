import React, { createContext, useContext, useState, useEffect } from 'react';
import { MENTORS } from '../data/mentorsData';
import { PROGRAMS } from '../data/programsData';
import { OPPORTUNITIES } from '../data/opportunitiesData';
import { RESOURCES } from '../data/resourcesData';
import { INITIAL_CERTIFICATES } from '../data/certificatesData';
import { CAREER_PATHS } from '../data/careerPathsData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { formatPharmNexiaId, formatTicketId, formatBookingId, SUPPORT_AGENTS } from '../utils/idGenerator';
import { INITIAL_SUPPORT_TICKETS } from '../data/supportTicketsData';

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

  // 6. Support Tickets State (Persistent & linked to student)
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

  // Program registration
  const registerForProgram = (programId) => {
    if (!enrolledProgramIds.includes(programId)) {
      setEnrolledProgramIds(prev => [...prev, programId]);
      const prog = PROGRAMS.find(p => p.id === programId);
      addNotification({
        title: "Enrolled in Program",
        message: `You have successfully enrolled in ${prog?.title || 'the program'}. Check your dashboard!`,
        type: "PROGRAM",
        link: "/dashboard"
      });
    }
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
        programs: PROGRAMS,
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
