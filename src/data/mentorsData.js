// ==============================================================================
// PHARMNEXIA MENTORS DATA STORE
// ==============================================================================
// Dynamically synchronized with Supabase "mentors" table when configured.
// Contains 1 safe DEMO test mentor clearly marked for system verification & testing.

export const DEMO_MENTOR_PRIYA = {
  id: "demo-mentor-priya-nair",
  name: "Dr. Priya Nair (DEMO)",
  email: "demo.priya.nair@pharmnexia.test",
  avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Dr+Priya+Nair",
  verificationStatus: "DEMO / PENDING",
  verifiedBadge: false,
  isDemo: true,
  currentRole: "Senior Pharmacovigilance Scientist",
  currentOrg: "Global Clinical Research",
  qualification: "B.Pharm, M.Pharm",
  previousEducation: "B.Pharm (Mumbai University) -> M.Pharm (NIPER)",
  mentorType: "Industry",
  paymentModel: "Free",
  careerPathSlugs: ["pharmacovigilance", "clinical-research"],
  expertise: ["Pharmacovigilance", "Drug Safety", "Clinical Research", "Regulatory Affairs"],
  rating: 4.9,
  reviewCount: 8,
  sessionsCompleted: 14,
  sessionDuration: "30 / 60 min",
  price30: 0,
  price60: 0,
  about: "Experienced pharmaceutical professional helping B.Pharm students understand pharmacovigilance, drug safety and industry career opportunities. (TEST / DEMO PROFILE ONLY)",
  whatICanHelpWith: [
    "Understanding entry-level PV Scientist and Drug Safety Associate roles",
    "ICH-GCP, MedDRA, and Argus Safety workflow fundamentals",
    "Navigating off-campus applications and technical interviews"
  ],
  availableDays: ["Saturday", "Sunday"],
  availableSlots: ["06:00 PM - 06:30 PM", "07:00 PM - 07:30 PM"],
  reviews: []
};

export const MENTORS = [DEMO_MENTOR_PRIYA];

export default MENTORS;
