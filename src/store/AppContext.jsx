import React, { createContext, useContext, useState, useEffect } from 'react';
import { MENTORS } from '../data/mentorsData';
import { PROGRAMS } from '../data/programsData';
import { OPPORTUNITIES } from '../data/opportunitiesData';
import { RESOURCES } from '../data/resourcesData';
import { INITIAL_CERTIFICATES } from '../data/certificatesData';
import { CAREER_PATHS } from '../data/careerPathsData';

const AppContext = createContext(null);

const DEFAULT_STUDENT = {
  id: "std-001",
  name: "Aarav Patel",
  email: "aarav.patel@student.edu",
  role: "STUDENT",
  college: "Bombay College of Pharmacy",
  degree: "B.Pharm",
  year: "3rd Year (Semester 6)",
  expectedGraduation: "2027",
  careerInterests: ["pharmacovigilance", "mba-after-bpharm", "regulatory-affairs"],
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
  bio: "Aspiring drug safety and pharmaceutical strategy enthusiast exploring high-growth corporate careers."
};

const DEFAULT_MENTOR_USER = {
  id: "mentor-03",
  name: "Dr. Shalini Nair",
  email: "dr.nair@cro-safety.com",
  role: "MENTOR",
  mentorProfileId: "mentor-03",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
  currentRole: "Lead Drug Safety Scientist & PV Consultant",
  currentOrg: "Global Clinical Research Organization"
};

const DEFAULT_ADMIN_USER = {
  id: "adm-001",
  name: "Dr. K. Sen",
  email: "admin@pharmnexia.in",
  role: "ADMIN",
  title: "Academic & Career Council Director",
  avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
};

const INITIAL_BOOKINGS = [
  {
    id: "BK-2026-9041",
    bookingCode: "BK-2026-9041",
    studentId: "std-001",
    studentName: "Aarav Patel",
    studentEmail: "aarav.patel@student.edu",
    mentorId: "mentor-03",
    mentorName: "Dr. Shalini Nair",
    mentorRole: "Lead Drug Safety Scientist & PV Consultant",
    mentorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    scheduledDate: "2026-10-18",
    scheduledTime: "07:00 PM - 07:30 PM IST",
    sessionDuration: 30,
    status: "CONFIRMED",
    meetingLink: "https://meet.pharmnexia.in/room/safety-session-9041",
    paymentAmount: 199,
    paymentStatus: "PAID",
    notes: "Guidance on transition into Drug Safety Associate roles and Argus database preparation."
  }
];

const INITIAL_AUDIT_LOGS = [
  {
    id: "log-1",
    timestamp: "2026-10-03 14:22:10",
    actor: "Dr. K. Sen (ADMIN)",
    action: "MENTOR_CREDENTIAL_VERIFIED",
    details: "Approved degree certificates for Dr. Arvind Verma",
    status: "SUCCESS"
  },
  {
    id: "log-2",
    timestamp: "2026-10-03 12:45:00",
    actor: "Payment Gateway Webhook",
    action: "PAYMENT_SETTLED",
    details: "₹199 booking fee captured for BK-2026-9041 (Student: Aarav Patel)",
    status: "SUCCESS"
  },
  {
    id: "log-3",
    timestamp: "2026-10-02 18:30:15",
    actor: "System Automation",
    action: "CERTIFICATE_HASH_GENERATED",
    details: "Issued verifiable certificate PHN-2026-000001 to Aarav Patel",
    status: "SUCCESS"
  }
];

export const AppProvider = ({ children }) => {
  // Authentication & Role
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('pharmnexia_user');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENT;
  });

  // State slices
  const [mentors, setMentors] = useState(() => {
    const saved = localStorage.getItem('pharmnexia_mentors');
    return saved ? JSON.parse(saved) : MENTORS;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('pharmnexia_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('pharmnexia_certificates');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [opportunities, setOpportunities] = useState(() => {
    const saved = localStorage.getItem('pharmnexia_opportunities');
    return saved ? JSON.parse(saved) : OPPORTUNITIES;
  });

  const [savedOpportunityIds, setSavedOpportunityIds] = useState(() => {
    const saved = localStorage.getItem('pharmnexia_saved_opps');
    return saved ? JSON.parse(saved) : ["opp-01", "opp-03"];
  });

  const [enrolledProgramIds, setEnrolledProgramIds] = useState(() => {
    const saved = localStorage.getItem('pharmnexia_enrolled_progs');
    return saved ? JSON.parse(saved) : ["prog-pv-mastery"];
  });

  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      title: "Mentorship Session Scheduled",
      message: "Your upcoming 1-on-1 with Dr. Shalini Nair is confirmed for Oct 18, 07:00 PM IST.",
      type: "BOOKING",
      time: "2 hours ago",
      isRead: false,
      link: "/dashboard"
    },
    {
      id: "notif-2",
      title: "Certificate Issued!",
      message: "Congratulations! Your certificate for Pharmacovigilance Mastery is ready for verification.",
      type: "CERTIFICATE",
      time: "Yesterday",
      isRead: false,
      link: "/verify-certificate/PHN-2026-000001"
    }
  ]);

  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('pharmnexia_user', JSON.stringify(currentUser));
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

  // Auth actions
  const switchRole = (role) => {
    if (role === 'STUDENT') setCurrentUser(DEFAULT_STUDENT);
    else if (role === 'MENTOR') setCurrentUser(DEFAULT_MENTOR_USER);
    else if (role === 'ADMIN') setCurrentUser(DEFAULT_ADMIN_USER);
    else if (role === 'GUEST') setCurrentUser(null);
  };

  const loginUser = (email, password, asRole = 'STUDENT') => {
    if (asRole === 'ADMIN') setCurrentUser(DEFAULT_ADMIN_USER);
    else if (asRole === 'MENTOR') setCurrentUser(DEFAULT_MENTOR_USER);
    else setCurrentUser({ ...DEFAULT_STUDENT, email: email || DEFAULT_STUDENT.email });
    return true;
  };

  const logoutUser = () => {
    setCurrentUser(null);
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

  // Booking actions
  const createBooking = ({ mentorId, sessionDuration, scheduledDate, scheduledTime, notes, paymentAmount, studentInfo }) => {
    const mentor = mentors.find(m => m.id === mentorId);
    const newBookingId = `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: newBookingId,
      bookingCode: newBookingId,
      studentId: currentUser?.id || "guest-std",
      studentName: studentInfo?.name || currentUser?.name || "Student",
      studentEmail: studentInfo?.email || currentUser?.email || "student@example.com",
      mentorId: mentor?.id,
      mentorName: mentor?.name,
      mentorRole: mentor?.currentRole,
      mentorAvatar: mentor?.avatarUrl,
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

    // Add notification
    addNotification({
      title: "Booking Confirmed!",
      message: `Your mentorship session with ${mentor?.name} is scheduled for ${scheduledDate} at ${scheduledTime}.`,
      type: "BOOKING",
      link: "/dashboard"
    });

    // Add Audit log
    addAuditLog({
      actor: `${currentUser?.name || 'Student'} (${currentUser?.role || 'STUDENT'})`,
      action: "BOOKING_CREATED",
      details: `Booked ${sessionDuration}m session with ${mentor?.name} for ${scheduledDate}. Amount: ₹${paymentAmount}`,
      status: "SUCCESS"
    });

    return newBooking;
  };

  const cancelBooking = (bookingId, reason = "Student requested cancellation") => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "CANCELLED", cancellationReason: reason } : b));
    addNotification({
      title: "Booking Cancelled",
      message: `Session ${bookingId} has been cancelled. If paid, refund is initiated automatically.`,
      type: "BOOKING"
    });
    addAuditLog({
      actor: `${currentUser?.name} (${currentUser?.role})`,
      action: "BOOKING_CANCELLED",
      details: `Booking ${bookingId} cancelled. Reason: ${reason}`,
      status: "SUCCESS"
    });
  };

  // Program registration
  const registerForProgram = (programId) => {
    if (!enrolledProgramIds.includes(programId)) {
      setEnrolledProgramIds(prev => [...prev, programId]);
      const prog = PROGRAMS.find(p => p.id === programId);
      addNotification({
        title: "Enrolled in Program",
        message: `You have successfully enrolled in ${prog?.title || 'the program'}. Check your dashboard for the schedule!`,
        type: "PROGRAM",
        link: "/dashboard"
      });
      addAuditLog({
        actor: `${currentUser?.name} (STUDENT)`,
        action: "PROGRAM_ENROLLED",
        details: `Enrolled in ${prog?.title} (ID: ${programId})`,
        status: "SUCCESS"
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
    addAuditLog({
      actor: `${currentUser?.name} (ADMIN)`,
      action: "CERTIFICATE_ISSUED",
      details: `Generated Certificate ${certId} for ${cert.studentName} (${cert.programName})`,
      status: "SUCCESS"
    });
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

    addAuditLog({
      actor: `${currentUser?.name} (ADMIN)`,
      action: `MENTOR_STATUS_${status.toUpperCase()}`,
      details: `Updated mentor ${mentorId} to ${status}. Notes: ${notes || 'Admin reviewed credentials'}`,
      status: "SUCCESS"
    });
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
    addAuditLog({
      actor: `${currentUser?.name} (ADMIN)`,
      action: "MENTOR_ADDED",
      details: `Created new mentor record: ${newMentor.name} (Type: ${newMentor.mentorType})`,
      status: "SUCCESS"
    });
  };

  // Notification & Audit Helpers
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
        switchRole,
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
