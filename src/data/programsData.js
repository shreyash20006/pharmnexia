export const PROGRAMS = [
  {
    id: "prog-pv-mastery",
    title: "Hands-on Pharmacovigilance & Argus Safety Mastery",
    category: "Pharmacovigilance",
    level: "Beginner to Intermediate",
    mode: "Live Interactive + LMS Access",
    duration: "4 Weeks (Weekend Cohort)",
    schedule: "Saturdays & Sundays, 6:00 PM - 8:00 PM IST",
    startDate: "2026-11-01",
    endDate: "2026-11-28",
    price: 999,
    originalPrice: 2499,
    isFree: false,
    seatsTotal: 50,
    seatsBooked: 42,
    rating: 4.96,
    reviewCount: 64,
    certificateIncluded: true,
    certificateType: "PharmNexia Verified Professional Credential",
    leadMentor: "Dr. Shalini Nair",
    mentorRole: "Lead Drug Safety Scientist & PV Consultant",
    overview: "A comprehensive practical immersion program designed to take pharmacy and life-science students from zero to job-ready in Pharmacovigilance. Covers ICSR triage, MedDRA coding hierarchy, causality assessment, and hands-on case narrative drafting.",
    learningOutcomes: [
      "Understand end-to-end Individual Case Safety Report (ICSR) processing workflows",
      "Proficiency in MedDRA and WHO Drug Dictionary coding principles",
      "Apply WHO-UMC and Naranjo causality assessment algorithms with confidence",
      "Draft compliant 3500A FDA and CIOMS-I medical case narratives",
      "Crack campus and off-campus recruitment tests at Cognizant, IQVIA, and Parexel"
    ],
    curriculum: [
      {
        week: "Week 1",
        title: "Introduction to PV & Regulatory Foundations",
        topics: [
          "History of Drug Safety (Thalidomide to modern era)",
          "FDA 21 CFR 314.80, EMA GVP Modules, and ICH-E2A guidelines",
          "What is an Adverse Event (AE) vs Adverse Drug Reaction (ADR)?",
          "Day 0 identification & Minimum criteria for a valid ICSR"
        ]
      },
      {
        week: "Week 2",
        title: "Medical Coding & Safety Databases",
        topics: [
          "MedDRA hierarchy: SOC, HLGT, HLT, PT, and LLT with practical exercises",
          "WHO Drug Global dictionary matching",
          "Argus Safety and ARISg navigation principles",
          "Duplicate search & source document triage"
        ]
      },
      {
        week: "Week 3",
        title: "Causality, Seriousness & Case Processing",
        topics: [
          "Seriousness criteria (Death, Life-threatening, Hospitalization, etc.)",
          "Expectedness & Reference Safety Information (IB / SmPC / USPI)",
          "Naranjo and WHO causality assessment methods",
          "Drafting chronological, concise medical narratives"
        ]
      },
      {
        week: "Week 4",
        title: "Aggregate Reports & Corporate Mock Interviews",
        topics: [
          "Overview of PSUR / PBRER and Signal Detection basics",
          "Live mock technical interview with corporate panel feedback",
          "Resume formatting specifically for Drug Safety Associate roles",
          "Final capstone case processing assessment"
        ]
      }
    ],
    eligibility: "B.Pharm, D.Pharm, M.Pharm, Pharm.D, MBBS, BDS, and Life-Science students/graduates.",
    faqs: [
      {
        q: "Will I receive a verifiable digital certificate upon completion?",
        a: "Yes! Every participant who submits the capstone assessment receives a unique cryptographic certificate verifiable publicly at /verify-certificate/:certId."
      },
      {
        q: "What if I miss a live weekend session?",
        a: "All live sessions are recorded and made available on the student LMS within 4 hours with lifetime revision access."
      }
    ]
  },
  {
    id: "prog-reg-affairs",
    title: "Global Regulatory Affairs: CTD & eCTD Dossier Workshop",
    category: "Regulatory Affairs",
    level: "Intermediate",
    mode: "Live Interactive Cohort",
    duration: "3 Weeks",
    schedule: "Thursdays & Fridays, 7:00 PM - 9:00 PM IST",
    startDate: "2026-11-10",
    endDate: "2026-11-30",
    price: 1199,
    originalPrice: 2999,
    isFree: false,
    seatsTotal: 40,
    seatsBooked: 31,
    rating: 4.93,
    reviewCount: 48,
    certificateIncluded: true,
    certificateType: "PharmNexia Regulatory Dossier Certification",
    leadMentor: "Vikram Kulkarni",
    mentorRole: "Associate Director - Global Regulatory Affairs",
    overview: "Master the international filing standards for medicines. Learn how to draft and review Common Technical Document (CTD) Modules 1 through 5, manage US FDA ANDA filings, and handle regulatory deficiency responses.",
    learningOutcomes: [
      "Understand the architectural structure of CTD Modules 1 to 5",
      "Deep-dive into Module 3 Quality (CMC - Chemistry, Manufacturing, Controls)",
      "Learn eCTD compilation and NeeS electronic submission formats",
      "Draft compliant responses to FDA Complete Response Letters (CRL)",
      "Prepare for corporate Regulatory Affairs executive interviews"
    ],
    curriculum: [
      {
        week: "Week 1",
        title: "Global Regulatory Bodies & CTD Architecture",
        topics: ["US FDA, EMA, PMDA, and CDSCO frameworks", "Overview of CTD Modules 1 to 5", "Module 1 Administrative details"]
      },
      {
        week: "Week 2",
        title: "Module 3 (Quality / CMC) Masterclass",
        topics: ["Drug Substance (S) specifications & stability", "Drug Product (P) formulation & manufacturing process validation", "Packaging & container closure systems"]
      },
      {
        week: "Week 3",
        title: "eCTD Publishing & Query Management",
        topics: ["eCTD validation criteria & life-cycle management", "US FDA ANDA filing journey & PAI readiness", "Answering regulatory queries & deficiencies"]
      }
    ],
    eligibility: "B.Pharm (3rd/4th year), M.Pharm students, and young quality/regulatory professionals.",
    faqs: [
      {
        q: "Is prior regulatory experience necessary?",
        a: "No! The curriculum starts from basic terminology and builds up to complex dossier preparation."
      }
    ]
  },
  {
    id: "prog-ai-pharmacy",
    title: "AI in Pharmacy: Molecular Docking & Drug Discovery",
    category: "AI in Pharmacy",
    level: "All Levels",
    mode: "Self-Paced + Weekend Live Labs",
    duration: "3 Weeks",
    schedule: "Sundays 11:00 AM - 1:00 PM IST (Live Lab)",
    startDate: "2026-11-15",
    endDate: "2026-12-05",
    price: 799,
    originalPrice: 1999,
    isFree: false,
    seatsTotal: 60,
    seatsBooked: 54,
    rating: 4.97,
    reviewCount: 72,
    certificateIncluded: true,
    certificateType: "Computational Drug Discovery Specialist",
    leadMentor: "Dr. Arvind Verma",
    mentorRole: "Associate Professor & Research Chair",
    overview: "Harness artificial intelligence, machine learning models, and computer-aided drug design (CADD) tools to accelerate pharmaceutical innovation. Learn Python for chemistry, AutoDock Vina, and AlphaFold applications.",
    learningOutcomes: [
      "Understand how generative AI is transforming pharmaceutical target identification",
      "Perform molecular docking using open-source tools (PyMOL, AutoDock)",
      "Predict ADMET properties using machine learning algorithms",
      "Publish computational research findings in peer-reviewed journals"
    ],
    curriculum: [
      {
        week: "Week 1",
        title: "Basics of CADD & Protein-Ligand Preparation",
        topics: ["Protein Data Bank (PDB) exploration", "Ligand 3D coordinate optimization", "Binding pocket identification"]
      },
      {
        week: "Week 2",
        title: "Molecular Docking & Virtual Screening",
        topics: ["Running AutoDock Vina calculations", "Analyzing binding affinity & hydrogen bond networks", "High-throughput virtual screening of natural compounds"]
      },
      {
        week: "Week 3",
        title: "AI & Machine Learning in ADMET Prediction",
        topics: ["Predicting bioavailability and BBB permeability using ML models", "Integrating AlphaFold structures into your thesis", "Drafting your computational research paper"]
      }
    ],
    eligibility: "Any pharmacy or chemistry student with a personal laptop.",
    faqs: [
      {
        q: "Do I need coding or programming knowledge?",
        a: "No prior programming is required. All software tools and scripts are taught step-by-step using beginner-friendly interfaces."
      }
    ]
  },
  {
    id: "prog-sci-writing",
    title: "Scientific Writing & Research Methodology",
    category: "Scientific Writing",
    level: "Beginner",
    mode: "Live Online",
    duration: "2 Weeks",
    schedule: "Tuesdays & Thursdays, 6:00 PM - 7:30 PM IST",
    startDate: "2026-11-05",
    endDate: "2026-11-19",
    price: 0, // FREE Community Program
    originalPrice: 999,
    isFree: true,
    seatsTotal: 100,
    seatsBooked: 96,
    rating: 4.94,
    reviewCount: 110,
    certificateIncluded: true,
    certificateType: "PharmNexia Academic Writing Honor",
    leadMentor: "Dr. Elena D'Souza",
    mentorRole: "Postdoctoral Research Fellow",
    overview: "A completely free foundational masterclass for undergraduate pharmacy students on how to choose research topics, search scientific databases (PubMed, Scopus), avoid predatory journals, and draft publishable review articles.",
    learningOutcomes: [
      "Conduct systematic literature reviews using MeSH terms on PubMed",
      "Master citation managers like Zotero and Mendeley",
      "Structure review articles according to standard IMRaD conventions",
      "Identify high-impact open-access journals without paying publication fees"
    ],
    curriculum: [
      {
        week: "Week 1",
        title: "Literature Mining & Hypothesis Formulation",
        topics: ["Formulating research questions", "Effective Boolean search operators on PubMed & ScienceDirect", "Managing 100+ references effortlessly in Zotero"]
      },
      {
        week: "Week 2",
        title: "Manuscript Drafting & Journal Submission",
        topics: ["Writing an engaging abstract & introduction", "Designing professional scientific schematics and figures", "Writing a compelling Cover Letter to the Editor"]
      }
    ],
    eligibility: "Open to all B.Pharm, D.Pharm, and M.Pharm students across India.",
    faqs: [
      {
        q: "Is this program truly 100% free?",
        a: "Yes! As part of PharmNexia's academic empowerment mission, this program is sponsored and free for all verified students."
      }
    ]
  },
  {
    id: "prog-clinical-trials",
    title: "Clinical Research Operations & GCP Certification",
    category: "Clinical Research",
    level: "Intermediate",
    mode: "Live Interactive",
    duration: "4 Weeks",
    schedule: "Wednesdays & Saturdays, 7:00 PM - 8:30 PM IST",
    startDate: "2026-11-12",
    endDate: "2026-12-08",
    price: 899,
    originalPrice: 2199,
    isFree: false,
    seatsTotal: 45,
    seatsBooked: 35,
    rating: 4.91,
    reviewCount: 39,
    certificateIncluded: true,
    certificateType: "ICH-GCP Compliant Clinical Investigator Credential",
    leadMentor: "Dr. Shalini Nair",
    mentorRole: "Clinical Research Operations Mentor",
    overview: "Gain comprehensive operational training on how clinical trials are designed, monitored, and audited in compliance with ICH-GCP E6(R2) and Indian New Drugs & Clinical Trials Rules 2019.",
    learningOutcomes: [
      "Master clinical trial phases (Phase 0 to Phase IV)",
      "Conduct Source Document Verification (SDV) during trial monitoring visits",
      "Navigate Electronic Data Capture (EDC) systems like Medidata Rave",
      "Draft Informed Consent Documents (ICD) and handle ethical review boards"
    ],
    curriculum: [
      {
        week: "Week 1",
        title: "Ethics & ICH-GCP Guidelines",
        topics: ["Belmont Report & Declaration of Helsinki", "Investigator responsibilities & IRB/IEC approvals"]
      },
      {
        week: "Week 2",
        title: "Trial Operations & Site Management",
        topics: ["Site Selection, Initiation, and Monitoring Visits", "Investigator Site File (ISF) & Trial Master File (TMF)"]
      },
      {
        week: "Week 3",
        title: "Data Management & EDC Workflows",
        topics: ["Case Report Forms (CRF) design", "Electronic Data Capture & query resolution"]
      },
      {
        week: "Week 4",
        title: "Audits, Inspections & Career Roadmap",
        topics: ["US FDA & CDSCO GCP inspection scenarios", "CRA vs CRC interview readiness"]
      }
    ],
    eligibility: "Pharmacy, medical, and bioscience graduates.",
    faqs: [
      {
        q: "Does this include ICH-GCP training?",
        a: "Yes, fully compliant with the latest TransCelerate ICH-GCP guidelines."
      }
    ]
  },
  {
    id: "prog-career-bootcamp",
    title: "Pharmacy Career Acceleration Bootcamp (All Tracks)",
    category: "Career Bootcamps",
    level: "All Levels",
    mode: "Live Intensive Workshop",
    duration: "2 Weeks (Express)",
    schedule: "Daily 8:00 PM - 9:15 PM IST (Mon-Fri)",
    startDate: "2026-11-20",
    endDate: "2026-12-04",
    price: 499,
    originalPrice: 1499,
    isFree: false,
    seatsTotal: 80,
    seatsBooked: 68,
    rating: 4.98,
    reviewCount: 142,
    certificateIncluded: true,
    certificateType: "PharmNexia Career Readiness Badge",
    leadMentor: "Rahul Sharma",
    mentorRole: "Senior Commercial Brand Manager",
    overview: "The ultimate 10-day sprint covering resume engineering, LinkedIn optimization for life sciences, mock HR & technical interviews, and salary negotiation for entry-level pharma roles.",
    learningOutcomes: [
      "Transform your generic CV into an ATS-optimized, high-converting pharma resume",
      "Build a magnetic LinkedIn profile that attracts pharma recruiters organically",
      "Ace behavioral questions ('Tell me about yourself', 'Why our company?')",
      "Understand industry salary bands and negotiate initial offers with confidence"
    ],
    curriculum: [
      {
        week: "Week 1",
        title: "Resume & Personal Branding",
        topics: ["ATS-proof resume templates for pharma", "Optimizing your LinkedIn headline & summary", "Cold messaging hiring managers effectively"]
      },
      {
        week: "Week 2",
        title: "Interview Mastery & Negotiations",
        topics: ["Behavioral STAR technique for campus drives", "Overcoming confidence gaps and imposter syndrome", "Salary negotiation framework for freshers"]
      }
    ],
    eligibility: "Final and pre-final year pharmacy students of all disciplines.",
    faqs: [
      {
        q: "Will my resume get individually reviewed?",
        a: "Yes! Every participant receives personalized bullet-point feedback on their resume draft."
      }
    ]
  }
];
