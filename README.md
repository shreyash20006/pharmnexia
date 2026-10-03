# PharmNexia 🌐💊
**"Your Pharmacy Career, Connected."**

PharmNexia is India's dedicated pharmacy career and mentorship ecosystem designed for **B.Pharm, D.Pharm, M.Pharm, Pharm.D**, and life-science students.

---

### Core USP
> *"Connect students with verified people who have already walked the career path they want to take."*

Rather than being just a static course catalog or generic college website, PharmNexia connects pharmacy undergraduates with verified alumni, researchers, faculty, and industry professionals across 14 high-demand trajectories:
- **B.Pharm → MBA / IIM**
- **B.Pharm → GPAT / NIPER**
- **B.Pharm → GATE / Biotech**
- **B.Pharm → M.Pharm**
- **B.Pharm → Research / PhD**
- **B.Pharm → Pharmacovigilance (PV)**
- **B.Pharm → Regulatory Affairs (RA)**
- **B.Pharm → Clinical Research**
- **B.Pharm → Medical Writing**
- **B.Pharm → QA / QC in Manufacturing**
- **B.Pharm → Production & Supply Chain**
- **B.Pharm → Government Careers / Drug Inspector**
- **B.Pharm → Higher Studies Abroad (MS/PhD)**
- **B.Pharm → Pharma Entrepreneurship & Startups**

---

## 🎨 Visual Identity & Design Philosophy
- **Colors**: Clean White (`#FFFFFF`) & Off-White (`#F8FAF9`) backgrounds, Slate Dark Headings (`#101828`), Muted text (`#667085`), and PharmNexia Green (`#00A86B` / `#00D084` / `#087A52`) accents.
- **Typography**: Clean, high-legibility Inter and modern sans-serif typography tailored for desktop and mobile devices.
- **Components**: Crisp rounded cards, subtle `#E5E7EB` borders, precision spacing, responsive navigation, and smooth hover interactions.

---

## 🚀 Key Features Implemented

### 1. Interactive Career Topology Visualizer
- Visual network graph mapping foundational pharmacy degrees to all 14 trajectories with live metrics on typical salary packages, entrance exams, and industry outlooks.

### 2. 14 Reusable Dynamic Career Path Roadmaps (`/career-paths/:slug`)
- Complete step-by-step milestone execution plans, recommended textbooks, entrance exams, skills required, FAQs, and linked verified mentors.

### 3. Mentor Marketplace & Safe Profiles (`/mentors` & `/mentors/:id`)
- Multi-parameter filtering by Career Path, Mentor Category (Faculty, Alumni, Industry, Researchers, Entrance Mentors), Price Model (Free, Honorarium, Paid), and Ratings.
- Privacy-first profile views: Zero public exposure of private phone numbers, personal emails, or bank coordinates.

### 4. 4-Step Interactive Booking Engine (`BookingModal`)
- Session selection (30m vs 60m) → Slot and date picking → Agenda & student goals → Test payment simulation (UPI/Card/NetBanking/Free) → Confirmed calendar booking with virtual room link.

### 5. Practical Skill Programs & Cohorts (`/programs` & `/programs/:id`)
- Covers Pharmacovigilance & Argus Safety, Regulatory Affairs CTD Dossiers, AI in Molecular Docking, and Scientific Writing.

### 6. Public Certificate Verification Engine (`/verify-certificate/:certId`)
- Every certificate issued features a unique ID (`PHN-2026-000001`), official gold seal, cryptographic hash, and instant public authenticity verification.

### 7. Student Dashboard (`/dashboard`)
- Full student portal with Overview, Upcoming 1-on-1 Sessions (with "Join Secure Room" button), Enrolled Cohorts, Digital Certificates, Opportunity Applications, and Profile editing.

### 8. Enterprise Admin Management Hub (`/admin`)
- Real-time KPIs (Students, Mentors, Programs, Bookings, Certificates, Gross Volume).
- **Mentor Credential Verification Queue**: Admin workflow to approve, reject, or suspend mentors based on degree proofs.
- **Social Media Studio**: Pre-formatted, high-converting LinkedIn and Instagram copy drafts with 1-click clipboard copy.
- **Security & Audit Logs**: Immutable time-stamped activity trail.

### 9. Indian DPDP Act Compliance & Legal Pages
- `/privacy` (Data minimization, no Aadhaar/PAN collection, DPDP compliance).
- `/terms`, `/refund-policy`, `/cancellation-policy`, and `/about`.

---

## 🗄️ Database Architecture (Supabase PostgreSQL)
A complete, production-ready schema is located at:
`src/database/supabase_schema.sql`

Includes:
- 19 relational tables (`profiles`, `students`, `mentors`, `mentor_credentials`, `career_paths`, `mentor_availability`, `programs`, `program_registrations`, `bookings`, `payments`, `opportunities`, `resources`, `certificates`, `certificate_verifications`, `reviews`, `notifications`, `audit_logs`).
- Strict **Row Level Security (RLS)** policies for `STUDENT`, `MENTOR`, `ADMIN`, `SUPER_ADMIN`, and `CONTENT_MANAGER`.
- PCI-DSS compliant payment tables storing zero raw credit card or UPI credentials.

---

## 🛠️ Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Or build and run production preview
npm run build
npm run preview -- --port 5173
```

Visit: `http://localhost:5173/`
