// PharmNexia Staff Roles & Institutional Permission Matrix

export const STAFF_ROLES = {
  SUPER_ADMIN: {
    id: 'SUPER_ADMIN',
    name: 'Super Admin',
    shortName: 'SuperAdmin',
    description: 'Full unconstrained system authority across governance, databases, billing, staff, and security configurations',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    dotColor: 'bg-purple-500',
    departmentDefault: 'Executive Governance',
    permissions: [
      'manage_staff',
      'manage_programs',
      'manage_mentors',
      'manage_content',
      'view_analytics',
      'manage_support',
      'view_bookings',
      'issue_certificates',
      'manage_technical_settings',
      'view_audit_logs'
    ]
  },
  ADMIN: {
    id: 'ADMIN',
    name: 'Platform Administrator',
    shortName: 'Admin',
    description: 'Operational governance: programs, mentor applications, certificates, and student support',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dotColor: 'bg-emerald-500',
    departmentDefault: 'Platform Operations',
    permissions: [
      'manage_programs',
      'manage_mentors',
      'manage_content',
      'view_analytics',
      'manage_support',
      'view_bookings',
      'issue_certificates',
      'view_audit_logs'
    ]
  },
  DEVELOPER: {
    id: 'DEVELOPER',
    name: 'Developer & DevOps',
    shortName: 'Developer',
    description: 'Technical infrastructure, database migrations, webhooks, edge settings, and security audits',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    dotColor: 'bg-blue-500',
    departmentDefault: 'Engineering & DevOps',
    permissions: [
      'manage_programs',
      'view_analytics',
      'manage_technical_settings',
      'view_audit_logs'
    ]
  },
  MENTOR_MANAGER: {
    id: 'MENTOR_MANAGER',
    name: 'Mentor Relations Manager',
    shortName: 'Mentor Mgr',
    description: 'Vetting mentor credentials, reviewing onboarding applications, and booking coordination',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    dotColor: 'bg-amber-500',
    departmentDefault: 'Mentor Partnerships',
    permissions: [
      'manage_mentors',
      'view_bookings',
      'view_audit_logs'
    ]
  },
  CONTENT_MANAGER: {
    id: 'CONTENT_MANAGER',
    name: 'Content & Curriculum Manager',
    shortName: 'Content Mgr',
    description: 'Publishes and edits live cohorts, masterclasses, syllabus agendas, and educational resources',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    dotColor: 'bg-indigo-500',
    departmentDefault: 'Academic Curriculum',
    permissions: [
      'manage_programs',
      'manage_content',
      'view_analytics'
    ]
  },
  SUPPORT: {
    id: 'SUPPORT',
    name: 'Student Support Specialist',
    shortName: 'Support',
    description: 'Resolves student tickets, answers program queries, and verifies ticket access',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    dotColor: 'bg-teal-500',
    departmentDefault: 'Student Success',
    permissions: [
      'manage_support',
      'view_bookings'
    ]
  },
  ANALYST: {
    id: 'ANALYST',
    name: 'Data & Growth Analyst',
    shortName: 'Analyst',
    description: 'Monitors program funnels, student retention, drop-offs, revenue, and conversion metrics',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    dotColor: 'bg-cyan-500',
    departmentDefault: 'Business Intelligence',
    permissions: [
      'view_analytics',
      'view_bookings'
    ]
  }
};

export const ALL_STAFF_PERMISSIONS = [
  { key: 'manage_staff', label: 'Manage Staff & Roles', description: 'Invite, edit, or deactivate institutional staff members' },
  { key: 'manage_programs', label: 'Manage Programs & Events CMS', description: 'Create, edit, duplicate, archive, and publish cohorts' },
  { key: 'manage_mentors', label: 'Mentor Verification & Status', description: 'Approve or reject mentor verification applications' },
  { key: 'manage_content', label: 'Manage Content & Resources', description: 'Edit opportunities, articles, and learning guides' },
  { key: 'view_analytics', label: 'View Program Funnel Analytics', description: 'Inspect conversion funnels, drop-offs, and GMV' },
  { key: 'manage_support', label: 'Student Support Console', description: 'Answer tickets, assign agents, and update ticket states' },
  { key: 'view_bookings', label: 'Bookings & Registrations', description: 'Inspect confirmed student bookings and program enrollments' },
  { key: 'issue_certificates', label: 'Certificate Authority', description: 'Issue and sign cryptographic student credentials' },
  { key: 'manage_technical_settings', label: 'DevOps & Technical Settings', description: 'Manage Edge functions, webhooks, and DB configurations' },
  { key: 'view_audit_logs', label: 'Audit & Compliance Logs', description: 'Inspect chronological administrative action trails' }
];

export const checkPermission = (userOrStaff, permissionKey) => {
  if (!userOrStaff) return false;
  const role = userOrStaff.staffRole || userOrStaff.role;
  if (role === 'SUPER_ADMIN') return true;
  const config = STAFF_ROLES[role];
  if (!config) {
    if (userOrStaff.role === 'ADMIN') return true;
    return false;
  }
  return config.permissions.includes(permissionKey);
};

export const INITIAL_STAFF_MEMBERS = [
  {
    id: 'staff-001',
    pharmNexiaId: 'PHN-STF-000001',
    name: 'Dr. K. Sen',
    email: 'admin@pharmnexia.in',
    role: 'SUPER_ADMIN',
    department: 'Executive Governance',
    title: 'Chief Platform Administrator',
    status: 'ACTIVE',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Dr+K+Sen',
    invitedBy: 'System Genesis',
    joinedDate: '2026-08-01',
    lastActive: 'Active now'
  },
  {
    id: 'staff-002',
    pharmNexiaId: 'PHN-STF-000002',
    name: 'Priya Sharma',
    email: 'priya.sharma@pharmnexia.in',
    role: 'CONTENT_MANAGER',
    department: 'Academic Curriculum',
    title: 'Head of Pharmacy Cohorts',
    status: 'ACTIVE',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Priya+Sharma',
    invitedBy: 'Dr. K. Sen',
    joinedDate: '2026-08-15',
    lastActive: '2 hours ago'
  },
  {
    id: 'staff-003',
    pharmNexiaId: 'PHN-STF-000003',
    name: 'Rohit Verma',
    email: 'rohit.verma@pharmnexia.in',
    role: 'MENTOR_MANAGER',
    department: 'Mentor Partnerships',
    title: 'Mentor Onboarding Lead',
    status: 'ACTIVE',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Rohit+Verma',
    invitedBy: 'Dr. K. Sen',
    joinedDate: '2026-08-20',
    lastActive: '5 hours ago'
  },
  {
    id: 'staff-004',
    pharmNexiaId: 'PHN-STF-000004',
    name: 'Ananya Roy',
    email: 'support@pharmnexia.in',
    role: 'SUPPORT',
    department: 'Student Success',
    title: 'Lead Support Specialist',
    status: 'ACTIVE',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Ananya+Roy',
    invitedBy: 'Dr. K. Sen',
    joinedDate: '2026-09-01',
    lastActive: 'Active now'
  },
  {
    id: 'staff-005',
    pharmNexiaId: 'PHN-STF-000005',
    name: 'DevOps Engineering',
    email: 'dev@pharmnexia.in',
    role: 'DEVELOPER',
    department: 'Engineering & DevOps',
    title: 'Platform Infrastructure Lead',
    status: 'ACTIVE',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DevOps',
    invitedBy: 'Dr. K. Sen',
    joinedDate: '2026-09-10',
    lastActive: '1 day ago'
  },
  {
    id: 'staff-006',
    pharmNexiaId: 'PHN-STF-000006',
    name: 'Siddharth Rao',
    email: 'analytics@pharmnexia.in',
    role: 'ANALYST',
    department: 'Business Intelligence',
    title: 'Growth & Funnels Analyst',
    status: 'ACTIVE',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Siddharth+Rao',
    invitedBy: 'Dr. K. Sen',
    joinedDate: '2026-09-18',
    lastActive: '3 hours ago'
  }
];
