/**
 * Initial Support Tickets & Templates for PharmNexia Support Desk
 */

export const INITIAL_SUPPORT_TICKETS = [
  {
    id: "PHN-TKT-004821",
    userId: "usr-demo-student",
    userName: "Shreyash Borkar",
    userPharmNexiaId: "PHN-STU-001247",
    userEmail: "shreyash@pharmnexia.in",
    userRole: "STUDENT",
    category: "Mentor Booking",
    subject: "Rescheduling PV Strategy session with Dr. Ananya",
    context: {
      bookingId: "PHN-BKG-000128",
      mentorName: "Dr. Ananya Sharma",
      sessionDate: "15 Oct, 6:00 PM",
      paymentStatus: "Successful",
      paymentAmount: 599,
      education: "B.Pharm - 3rd Year",
      interests: ["Pharmacovigilance", "Medical Writing"],
      recentActivity: [
        "Viewed PV Career Path Roadmap",
        "Booked 1:1 Mentorship Session",
        "Payment of ₹599 Verified"
      ]
    },
    status: "IN_PROGRESS",
    assignedAgent: {
      id: "spt-001",
      pharmNexiaId: "PHN-SPT-000001",
      name: "Pooja Verma",
      roleTitle: "Senior Support Executive",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
    },
    messages: [
      {
        id: "msg-001",
        senderId: "PHN-STU-001247",
        senderRole: "STUDENT",
        senderName: "Shreyash Borkar",
        text: "Hi team, I booked a 1:1 PV session for Oct 15 at 6:00 PM (Booking ID: PHN-BKG-000128). My semester practical exam got rescheduled to the same evening. Can I shift the slot to 8:00 PM or the next day?",
        timestamp: "Yesterday, 04:30 PM"
      },
      {
        id: "msg-002",
        senderId: "PHN-SPT-000001",
        senderRole: "SUPPORT",
        senderName: "Pooja Verma",
        text: "Hi Shreyash! 👋 Thanks for reaching out. I've pulled up your booking record (PHN-BKG-000128) with Dr. Ananya. She has an opening on Oct 16 at 6:30 PM and Oct 15 at 8:00 PM. Would Oct 15 at 8:00 PM work better for your schedule?",
        timestamp: "Yesterday, 04:42 PM"
      },
      {
        id: "msg-003",
        senderId: "PHN-STU-001247",
        senderRole: "STUDENT",
        senderName: "Shreyash Borkar",
        text: "Yes, Oct 15 at 8:00 PM would be perfect! Thank you so much for the quick help.",
        timestamp: "Yesterday, 05:10 PM"
      },
      {
        id: "msg-004",
        senderId: "PHN-SPT-000001",
        senderRole: "SUPPORT",
        senderName: "Pooja Verma",
        text: "Great! I am updating the calendar invite and sending the revised meeting link to your email right away.",
        timestamp: "Yesterday, 05:15 PM"
      }
    ],
    createdAt: "2026-10-03T16:30:00Z",
    updatedAt: "2026-10-03T17:15:00Z"
  },
  {
    id: "PHN-TKT-003190",
    userId: "usr-demo-student",
    userName: "Shreyash Borkar",
    userPharmNexiaId: "PHN-STU-001247",
    userEmail: "shreyash@pharmnexia.in",
    userRole: "STUDENT",
    category: "Payment Issue",
    subject: "Receipt copy for college sponsorship reimbursement",
    context: {
      bookingId: "PHN-BKG-000104",
      paymentStatus: "Successful",
      paymentAmount: 499,
      education: "B.Pharm - 3rd Year"
    },
    status: "RESOLVED",
    assignedAgent: {
      id: "spt-002",
      pharmNexiaId: "PHN-SPT-000002",
      name: "Aman Sharma",
      roleTitle: "Academic Support Executive"
    },
    messages: [
      {
        id: "msg-101",
        senderId: "PHN-STU-001247",
        senderRole: "STUDENT",
        senderName: "Shreyash Borkar",
        text: "Need the official GST invoice for my GPAT orientation enrollment to submit to my HOD.",
        timestamp: "Sep 28, 11:20 AM"
      },
      {
        id: "msg-102",
        senderId: "PHN-SPT-000002",
        senderRole: "SUPPORT",
        senderName: "Aman Sharma",
        text: "Hello Shreyash, the stamped tax invoice has been generated and sent to your registered email address. You can also download it anytime from your dashboard.",
        timestamp: "Sep 28, 11:45 AM"
      }
    ],
    createdAt: "2026-09-28T11:20:00Z",
    updatedAt: "2026-09-28T11:45:00Z"
  }
];

export const SUPPORT_CATEGORIES = [
  { id: "Mentor Booking", label: "Mentor Booking", icon: "Calendar", desc: "Session rescheduling, meeting links, or mentor questions" },
  { id: "Career Question", label: "Career Question", icon: "Compass", desc: "Roadmap advice, eligibility, or path selection" },
  { id: "Payment Issue", label: "Payment Issue", icon: "CreditCard", desc: "Invoices, refund requests, or payment confirmation" },
  { id: "Account Help", label: "Account Help", icon: "User", desc: "Profile updates, credentials, or certificate syncing" },
  { id: "Resources", label: "Resources", icon: "BookOpen", desc: "Accessing editorial guides, materials, or mock papers" },
  { id: "Other", label: "Other", icon: "HelpCircle", desc: "General institutional query or partnership" }
];
