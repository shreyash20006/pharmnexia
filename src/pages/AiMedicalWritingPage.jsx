import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Check, 
  AlertTriangle, 
  BookOpen, 
  Search, 
  Layers, 
  FileText, 
  ShieldCheck, 
  ExternalLink, 
  Share2, 
  Copy, 
  ArrowDown, 
  ArrowUp, 
  Compass, 
  GraduationCap, 
  Lock, 
  Zap, 
  Cpu, 
  CheckCheck,
  ChevronDown,
  Eye,
  Bookmark
} from 'lucide-react';
import { ScrollReveal, FadeUp, FadeLeft, FadeRight } from '../components/Animation';

// ==============================================================================
// 1. REUSABLE EDITORIAL HELPER COMPONENTS
// ==============================================================================

/**
 * Editorial Highlight Block
 * Expands behind selected keywords like a magazine marker
 */
export const HighlightBlock = ({ children, className = '' }) => {
  return (
    <span className={`relative inline-block px-1.5 py-0.5 mx-0.5 ${className}`}>
      <span className="highlight-expand" />
      <span className="relative z-10 font-bold text-[#101828]">{children}</span>
    </span>
  );
};

/**
 * Typewriter Text Component with Reduced Motion Support
 */
export const TypewriterText = ({ 
  text, 
  speed = 60, 
  delay = 100, 
  cursor = true, 
  onComplete,
  className = '' 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIsTypingComplete(true);
      if (onComplete) onComplete();
      return;
    }

    let currentIndex = 0;
    let timer;

    const startTimeout = setTimeout(() => {
      timer = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(timer);
          setIsTypingComplete(true);
          if (onComplete) onComplete();
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(timer);
    };
  }, [text, speed, delay]);

  return (
    <span className={`inline-block ${className}`}>
      {displayedText}
      {cursor && !isTypingComplete && (
        <span className="inline-block text-[#00A86B] font-light animate-cursor ml-0.5 select-none">|</span>
      )}
    </span>
  );
};

// ==============================================================================
// 2. MAIN GUIDE COMPONENT
// ==============================================================================

export const AiMedicalWritingPage = ({ onNavigate }) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // SEO Page Title
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "AI in Medical & Scientific Writing | PharmNexia";
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // Section Tracking & Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 500);

      // Detect current section in view
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 220;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setCurrentSection(i + 1);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'section-01', num: '01', title: 'Overview' },
    { id: 'section-02', num: '02', title: 'Literature Search' },
    { id: 'section-03', num: '03', title: 'Understanding Papers' },
    { id: 'section-04', num: '04', title: 'Writing & Editing' },
    { id: 'section-05', num: '05', title: 'Drafting Assistance' },
    { id: 'section-06', num: '06', title: 'References & Analysis' },
    { id: 'section-07', num: '07', title: 'Workflow Support' },
    { id: 'section-08', num: '08', title: 'The Golden Rule' },
    { id: 'section-09', num: '09', title: 'Responsible Use' },
    { id: 'section-10', num: '10', title: 'Data & Policy' },
    { id: 'section-11', num: '11', title: 'Human in the Loop' },
    { id: 'section-12', num: '12', title: 'Key Takeaway' },
    { id: 'section-13', num: '13', title: 'Share & Practice' }
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2400);
  };

  return (
    <div className="min-h-screen bg-white text-[#101828] selection:bg-[#00D084]/25 selection:text-[#087A52] relative font-sans">

      {/* ==============================================================================
          FIXED TOP READING PROGRESS BAR & ACTIVE SECTION INDICATOR
          ============================================================================== */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-xs transition-all">
        {/* Progress track */}
        <div className="w-full h-1 bg-[#F0F2F1]">
          <div 
            className="h-full bg-gradient-to-r from-[#00A86B] via-[#00D084] to-[#087A52] transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Section Progress Meta Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/resources')}
              className="inline-flex items-center gap-1.5 text-[#667085] hover:text-[#00A86B] font-medium transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resources</span>
            </button>
            <span className="text-[#E5E7EB] hidden sm:inline">|</span>
            <span className="font-semibold text-[#101828] truncate max-w-[200px] sm:max-w-md">
              AI in Medical & Scientific Writing
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Reading section counter */}
            <div className="font-mono text-[11px] font-semibold text-[#087A52] bg-[#E8F8F1] px-2.5 py-0.5 rounded-full border border-[#00A86B]/20">
              <span className="hidden sm:inline">SECTION </span>
              {currentSection} / 13
            </div>

            {/* Mobile Contents Toggle */}
            <div className="relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="px-2.5 py-1 rounded-lg border border-[#E5E7EB] bg-white text-[#101828] font-semibold hover:border-[#00A86B] transition flex items-center gap-1.5 text-xs shadow-xs"
              >
                <span>Contents</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mobile Table of Contents Dropdown */}
              {mobileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 max-h-[70vh] overflow-y-auto bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl p-2 z-50 text-xs animate-pageFadeIn">
                  <div className="px-3 py-2 font-bold text-[#101828] border-b border-[#E5E7EB] flex items-center justify-between font-heading">
                    <span>Jump to Section</span>
                    <span className="font-mono text-[10px] text-[#667085]">13 Topics</span>
                  </div>
                  <div className="py-1">
                    {sections.map((s, idx) => (
                      <button
                        key={s.id}
                        onClick={() => scrollToSection(s.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between ${
                          currentSection === idx + 1
                            ? 'bg-[#E8F8F1] text-[#087A52] font-bold'
                            : 'text-[#4B5563] hover:bg-[#F8FAF9]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-[10px] opacity-70">{s.num}</span>
                          <span>{s.title}</span>
                        </span>
                        {currentSection === idx + 1 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Share / Copy Button */}
            <button
              onClick={handleCopyLink}
              title="Copy Guide Link"
              className="p-1.5 rounded-lg border border-[#E5E7EB] hover:border-[#00A86B] text-[#667085] hover:text-[#00A86B] transition shadow-xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#00A86B]" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ==============================================================================
          HERO SECTION (Editorial, High-Impact Typography, Staggered Load)
          ============================================================================== */}
      <header className="pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative overflow-hidden">
        
        {/* Floating Category Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F8F1] border border-[#00A86B]/25 text-[#087A52] text-xs font-semibold uppercase tracking-wider mb-8 shadow-xs animate-hero-eyebrow">
          <Sparkles className="w-3.5 h-3.5 text-[#00A86B]" />
          <span>PharmNexia Resource • Medical Writing Guide</span>
          <span className="text-[#00A86B]/40">•</span>
          <span className="font-mono text-[11px] normal-case text-[#087A52]">8–10 min read</span>
        </div>

        {/* Main Title with Typewriting & Highlight */}
        <h1 className="text-[44px] sm:text-6xl lg:text-[76px] font-extrabold tracking-tight text-[#101828] font-heading leading-[1.08] mb-6">
          <span className="block text-[#101828]">
            <TypewriterText text="AI in" speed={70} delay={150} cursor={false} />
          </span>
          <span className="block my-1 text-[#00A86B]">
            <span className="relative inline-block px-2">
              <span className="absolute inset-0 bg-[#00A86B]/15 rounded-xl -rotate-1" />
              <span className="relative z-10">Medical</span>
            </span>
          </span>
          <span className="block text-[#101828]">
            <TypewriterText text="Writing" speed={70} delay={650} />
          </span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="mt-6 text-[17px] sm:text-[20px] text-[#4B5563] max-w-2xl mx-auto leading-[1.65] font-normal animate-hero-desc">
          Tools, workflows and responsible-use principles for pharmacy and life-science writers who want speed without losing accuracy.
        </p>

        {/* Handwritten / Editorial signature line */}
        <div className="mt-4 animate-hero-desc flex items-center justify-center gap-2">
          <span className="italic font-serif text-[17px] text-[#087A52] tracking-wide font-normal">
            — You stay in charge.
          </span>
        </div>

        {/* Action CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => scrollToSection('section-01')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[16px] shadow-sm flex items-center justify-center gap-2 btn-primary-action"
          >
            <span>Start Reading</span>
            <ArrowDown className="w-4 h-4 btn-arrow" />
          </button>

          <button
            onClick={() => scrollToSection('section-02')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-[#F8FAF9] text-[#101828] border border-[#E5E7EB] hover:border-[#00A86B] font-semibold text-[16px] flex items-center justify-center gap-2 btn-secondary-action shadow-xs"
          >
            <Compass className="w-4 h-4 text-[#00A86B]" />
            <span>Explore Tools</span>
          </button>
        </div>

      </header>

      {/* ==============================================================================
          DESKTOP STICKY TABLE OF CONTENTS DRAWER / FLOATING PILL
          ============================================================================== */}
      <aside className="hidden xl:block fixed left-6 top-32 z-40 w-56 text-xs text-[#667085]">
        <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-xs space-y-2.5">
          <div className="font-bold text-[#101828] uppercase font-mono tracking-wider text-[10px] text-[#087A52]">
            Table of Contents
          </div>
          <div className="space-y-1">
            {sections.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`w-full text-left px-2 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                  currentSection === idx + 1
                    ? 'bg-white font-bold text-[#087A52] shadow-xs border border-[#00A86B]/30'
                    : 'hover:text-[#101828] hover:bg-white/60'
                }`}
              >
                <span className="font-mono text-[10px] text-[#667085]">{s.num}</span>
                <span className="truncate">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* ==============================================================================
          MAIN CONTENT CONTAINER
          ============================================================================== */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pb-28">

        {/* ----------------------------------------------------------------------------
            SECTION 01: OVERVIEW
            ---------------------------------------------------------------------------- */}
        <section id="section-01" className="scroll-mt-28 space-y-8">
          <FadeUp>
            <div className="space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#087A52]">
                01 / OVERVIEW
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#101828] font-heading leading-[1.12]">
                AI helps. <br />
                <span className="text-[#00A86B]">You decide.</span>
              </h2>
              <p className="text-[17px] text-[#4B5563] leading-[1.65] max-w-2xl">
                Across the writing process, AI can assist with literature discovery, summarizing, drafting, editing and organizing.
              </p>
            </div>
          </FadeUp>

          {/* 5 Animated Pills */}
          <FadeUp delay={80}>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {[
                "Literature discovery",
                "Summarizing",
                "Drafting",
                "Editing",
                "Organizing"
              ].map((pill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] hover:border-[#00A86B] text-[14.5px] font-semibold text-[#101828] transition duration-200 card-lift inline-flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#00A86B]" />
                  <span>{pill}</span>
                </span>
              ))}
            </div>
          </FadeUp>

          {/* Benefits Checkpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <FadeLeft delay={100}>
              <div className="p-6 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] flex items-start gap-3.5 card-lift h-full">
                <CheckCircle2 className="w-5 h-5 text-[#00A86B] flex-shrink-0 mt-0.5" />
                <div className="text-[15.5px] font-medium text-[#101828] leading-[1.6]">
                  Reduces repetitive work and saves significant manuscript assembly time.
                </div>
              </div>
            </FadeLeft>

            <FadeRight delay={120}>
              <div className="p-6 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] flex items-start gap-3.5 card-lift h-full">
                <CheckCircle2 className="w-5 h-5 text-[#00A86B] flex-shrink-0 mt-0.5" />
                <div className="text-[15.5px] font-medium text-[#101828] leading-[1.6]">
                  Supports writers without ever replacing scientific and clinical judgment.
                </div>
              </div>
            </FadeRight>
          </div>

          {/* Highlight Card: Human review stays essential */}
          <FadeUp delay={140}>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#E8F8F1] via-[#F4FCF8] to-[#E8F8F1] border-2 border-[#00A86B]/30 shadow-sm relative overflow-hidden card-lift">
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#087A52]">
                  <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
                  <span>Core Principle</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#101828] font-heading">
                  Human review stays essential
                </h3>
                <p className="text-[16px] text-[#4B5563] leading-[1.65] max-w-xl">
                  For scientific accuracy, validated references, pharmacokinetic interpretation, and regulatory compliance.
                </p>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* ----------------------------------------------------------------------------
            SECTION 02: LITERATURE SEARCH
            ---------------------------------------------------------------------------- */}
        <section id="section-02" className="scroll-mt-28 space-y-8">
          <FadeUp>
            <div className="space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#087A52]">
                02 / LITERATURE SEARCH
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#101828] font-heading leading-[1.15]">
                Find the right papers, <HighlightBlock>faster</HighlightBlock>.
              </h2>
              <p className="text-[16.5px] text-[#4B5563] leading-[1.65]">
                Traditional keyword boolean search takes hours. Modern biomedical search engines synthesize paper relevance directly from research queries.
              </p>
            </div>
          </FadeUp>

          {/* Alternating Tool Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* PubMed - from Left */}
            <FadeLeft delay={60}>
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] transition-all card-lift shadow-xs h-full flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xl text-[#101828] font-heading">PubMed</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F8FAF9] text-[#667085] border border-[#E5E7EB]">Gold Standard</span>
                  </div>
                  <p className="text-[15px] font-semibold text-[#087A52]">
                    Biomedical literature search
                  </p>
                  <p className="text-[14px] text-[#667085] leading-relaxed">
                    National Library of Medicine repository for peer-reviewed clinical trials, pharmacology journals, and indexed MeSH terms.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E5E7EB] mt-4 flex items-center justify-between text-xs text-[#087A52] font-semibold">
                  <span>Indexed Medical Citations</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </FadeLeft>

            {/* Elicit - from Right */}
            <FadeRight delay={100}>
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] transition-all card-lift shadow-xs h-full flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xl text-[#101828] font-heading">Elicit</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20">AI Research Assistant</span>
                  </div>
                  <p className="text-[15px] font-semibold text-[#087A52]">
                    Research question and literature discovery
                  </p>
                  <p className="text-[14px] text-[#667085] leading-relaxed">
                    Finds relevant papers even without exact keyword matches. Extracts study design, sample size, and measured outcomes into customizable matrices.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E5E7EB] mt-4 flex items-center justify-between text-xs text-[#087A52] font-semibold">
                  <span>Structured Outcome Extraction</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </FadeRight>

            {/* Consensus - from Left */}
            <FadeLeft delay={140}>
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] transition-all card-lift shadow-xs h-full flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xl text-[#101828] font-heading">Consensus</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F8FAF9] text-[#667085] border border-[#E5E7EB]">Evidence Synthesis</span>
                  </div>
                  <p className="text-[15px] font-semibold text-[#087A52]">
                    Evidence-based search and synthesis
                  </p>
                  <p className="text-[14px] text-[#667085] leading-relaxed">
                    Uses AI to find scientific consensus across hundreds of papers, aggregating whether findings generally agree, disagree, or remain inconclusive.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E5E7EB] mt-4 flex items-center justify-between text-xs text-[#087A52] font-semibold">
                  <span>Consensus Meter & Citations</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </FadeLeft>

            {/* Semantic Scholar - from Right */}
            <FadeRight delay={180}>
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] transition-all card-lift shadow-xs h-full flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xl text-[#101828] font-heading">Semantic Scholar</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F8FAF9] text-[#667085] border border-[#E5E7EB]">Citation Graph</span>
                  </div>
                  <p className="text-[15px] font-semibold text-[#087A52]">
                    Academic literature discovery
                  </p>
                  <p className="text-[14px] text-[#667085] leading-relaxed">
                    Developed by the Allen Institute for AI. Highlights influential citations and generates one-line TLDR summaries for rapid screening.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E5E7EB] mt-4 flex items-center justify-between text-xs text-[#087A52] font-semibold">
                  <span>Highly Influential Citations</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </FadeRight>

          </div>
        </section>

        {/* ----------------------------------------------------------------------------
            SECTION 03: UNDERSTANDING PAPERS
            ---------------------------------------------------------------------------- */}
        <section id="section-03" className="scroll-mt-28 space-y-8">
          <FadeUp>
            <div className="space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#087A52]">
                03 / UNDERSTANDING PAPERS
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#101828] font-heading leading-[1.15]">
                Understand what you found.
              </h2>
              <p className="text-[16.5px] text-[#4B5563] leading-[1.65]">
                Complex statistical tables, pharmacokinetic graphs, and multi-arm trial protocols can be interrogated directly with conversational AI models.
              </p>
            </div>
          </FadeUp>

          {/* Workflow Visualization: Find -> Screen -> Understand -> Verify */}
          <FadeUp delay={80}>
            <div className="p-6 sm:p-8 rounded-3xl bg-[#F8FAF9] border border-[#E5E7EB] space-y-4">
              <div className="text-xs font-mono font-bold uppercase text-[#667085] tracking-wider">
                Recommended Research Workflow
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                
                <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] text-center space-y-1 card-lift">
                  <div className="font-mono text-xs text-[#667085]">Step 01</div>
                  <div className="font-bold text-[#101828] text-base font-heading">Find</div>
                  <div className="text-[12px] text-[#667085]">PubMed / Elicit</div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] text-center space-y-1 card-lift">
                  <div className="font-mono text-xs text-[#667085]">Step 02</div>
                  <div className="font-bold text-[#101828] text-base font-heading">Screen</div>
                  <div className="text-[12px] text-[#667085]">TLDR & Consensus</div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] text-center space-y-1 card-lift">
                  <div className="font-mono text-xs text-[#667085]">Step 03</div>
                  <div className="font-bold text-[#101828] text-base font-heading">Understand</div>
                  <div className="text-[12px] text-[#667085]">SciSpace / NotebookLM</div>
                </div>

                <div className="p-4 rounded-xl bg-[#E8F8F1] border-2 border-[#00A86B] text-center space-y-1 card-lift shadow-xs">
                  <div className="font-mono text-xs text-[#087A52] font-semibold">Step 04</div>
                  <div className="font-bold text-[#087A52] text-base font-heading">Verify</div>
                  <div className="text-[12px] text-[#087A52] font-medium">Original Full Text</div>
                </div>

              </div>
            </div>
          </FadeUp>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FadeUp delay={100}>
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] transition-all card-lift h-full space-y-2">
                <h3 className="font-bold text-lg text-[#101828] font-heading">SciSpace</h3>
                <p className="text-xs font-semibold text-[#087A52]">Ask questions about research papers</p>
                <p className="text-[13.5px] text-[#667085] leading-relaxed">
                  Highlight confusing paragraphs, mathematical formulas, or statistical appendices to get plain-language explanations in real time.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={140}>
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] transition-all card-lift h-full space-y-2">
                <h3 className="font-bold text-lg text-[#101828] font-heading">NotebookLM</h3>
                <p className="text-xs font-semibold text-[#087A52]">Interact with uploaded research sources</p>
                <p className="text-[13.5px] text-[#667085] leading-relaxed">
                  Google’s personalized AI research assistant grounded strictly in your uploaded PDF sources, clinical notes, and guidelines without hallucinations.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={180}>
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] transition-all card-lift h-full space-y-2">
                <h3 className="font-bold text-lg text-[#101828] font-heading">Perplexity</h3>
                <p className="text-xs font-semibold text-[#087A52]">Research search with cited sources</p>
                <p className="text-[13.5px] text-[#667085] leading-relaxed">
                  Combines conversational answering with explicit footnotes linking directly to published clinical journals and regulatory directives.
                </p>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ----------------------------------------------------------------------------
            SECTION 04: WRITING AND EDITING
            ---------------------------------------------------------------------------- */}
        <section id="section-04" className="scroll-mt-28 space-y-8">
          <FadeUp>
            <div className="space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#087A52]">
                04 / WRITING AND EDITING
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#101828] font-heading leading-[1.15]">
                Draft, rewrite and polish.
              </h2>
              <p className="text-[16.5px] text-[#4B5563] leading-[1.65]">
                Use language models to overcome blank-page inertia, restructure complex compound sentences, and format paragraphs according to medical writing style guides.
              </p>
            </div>
          </FadeUp>

          {/* Tools List with Vertical Green Accent Lines */}
          <div className="space-y-4">
            {[
              {
                name: "ChatGPT",
                badge: "Versatile Reasoning",
                role: "Brainstorming, outlining, drafting and rewriting",
                description: "Ideal for converting raw laboratory notes into structured paragraphs, generating section headings, and testing alternate phrasing."
              },
              {
                name: "Claude",
                badge: "Long Context",
                role: "Long-document analysis and drafting",
                description: "Handles massive context windows (up to 200k tokens), perfect for synthesizing multi-page CTD Module 2 summaries, clinical study reports, and lengthy protocols."
              },
              {
                name: "Grammarly",
                badge: "Style & Clarity",
                role: "Grammar, clarity and tone",
                description: "Ensures concise scientific tone, eliminates passive-voice ambiguities, and maintains consistent terminology across manuscript sections."
              },
              {
                name: "QuillBot",
                badge: "Paraphrasing",
                role: "Paraphrasing and sentence refinement",
                description: "Assists with restructuring dense biomedical sentences without altering the pharmacological meaning or data integrity."
              },
              {
                name: "DeepL Write",
                badge: "Language Precision",
                role: "Language and style improvement",
                description: "AI writing companion tailored for non-native English medical writers to achieve native-level scientific precision."
              }
            ].map((tool, idx) => (
              <FadeUp key={tool.name} delay={idx * 60}>
                <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] transition-all card-lift shadow-xs flex items-start gap-5 relative pl-7 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-1.5 before:bg-[#00A86B] before:rounded-full">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-extrabold text-[#101828] text-lg font-heading">{tool.name}</h3>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#E8F8F1] text-[#087A52] font-semibold border border-[#00A86B]/20">
                        {tool.badge}
                      </span>
                    </div>
                    <p className="text-[14.5px] font-semibold text-[#087A52]">
                      {tool.role}
                    </p>
                    <p className="text-[14px] text-[#667085] leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------------------------------
            SECTION 05: WHAT AI DOES FOR YOUR DRAFT
            ---------------------------------------------------------------------------- */}
        <section id="section-05" className="scroll-mt-28 space-y-8">
          <FadeUp>
            <div className="space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#087A52]">
                05 / DRAFTING ASSISTANCE
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#101828] font-heading leading-[1.15]">
                What AI does for your <HighlightBlock>draft</HighlightBlock>.
              </h2>
              <p className="text-[16.5px] text-[#4B5563] leading-[1.65]">
                Focus on the high-value analytical reasoning while letting AI streamline structural drafting tasks.
              </p>
            </div>
          </FadeUp>

          {/* Staggered Checklist */}
          <div className="p-8 rounded-3xl bg-[#F8FAF9] border border-[#E5E7EB] space-y-3.5">
            {[
              "Creating structured outlines based on journal author guidelines",
              "Improving sentence clarity and removing redundant filler words",
              "Simplifying complex language for layperson patient summaries",
              "Converting bulleted data tables into narrative manuscript content",
              "Identifying repetitive arguments or unclear transitions across paragraphs"
            ].map((item, idx) => (
              <FadeLeft key={idx} delay={idx * 70}>
                <div className="flex items-start gap-3.5 text-[15.5px] text-[#101828] bg-white p-3.5 rounded-xl border border-[#E5E7EB]">
                  <div className="w-5 h-5 rounded-full bg-[#E8F8F1] text-[#00A86B] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="leading-relaxed font-medium">{item}</span>
                </div>
              </FadeLeft>
            ))}
          </div>

          {/* Caution Card: Green/Black Contrast */}
          <FadeUp delay={100}>
            <div className="p-8 rounded-3xl bg-[#101828] text-white border-2 border-[#00A86B] shadow-lg relative overflow-hidden card-lift">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#00A86B]/20 text-[#00D084] flex items-center justify-center flex-shrink-0 border border-[#00A86B]/30">
                  <AlertTriangle className="w-6 h-6 text-[#00D084]" />
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold tracking-widest text-[#00D084] uppercase">
                    CRITICAL CAUTION
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                    Never treat AI-generated content as automatically accurate.
                  </h3>
                  <p className="text-[15px] text-[#D1D5DB] leading-relaxed">
                    AI models generate text probabilistically, not factually. Every biochemical pathway, dosage recommendation, and statistical value must be verified against primary sources.
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* ----------------------------------------------------------------------------
            SECTION 06: REFERENCES, DATA & ANALYSIS
            ---------------------------------------------------------------------------- */}
        <section id="section-06" className="scroll-mt-28 space-y-8">
          <FadeUp>
            <div className="space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#087A52]">
                06 / REFERENCES & ANALYSIS
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#101828] font-heading leading-[1.15]">
                References, data and analysis.
              </h2>
              <p className="text-[16.5px] text-[#4B5563] leading-[1.65]">
                Pair AI writing assistants with dedicated reference managers to keep bibliographies bulletproof and free of hallucinated citations.
              </p>
            </div>
          </FadeUp>

          {/* Two Cards: Zotero & EndNote */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FadeLeft delay={80}>
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] transition-all card-lift shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#00A86B]" />
                  <h3 className="font-bold text-xl text-[#101828] font-heading">Zotero</h3>
                </div>
                <p className="text-xs font-semibold text-[#087A52]">Open-source Reference Manager</p>
                <p className="text-[14.5px] text-[#667085] leading-relaxed">
                  Collect, organize, annotate, and cite peer-reviewed literature. Automatically downloads PDF metadata and formats citations according to 10,000+ journal styles.
                </p>
              </div>
            </FadeLeft>

            <FadeRight delay={100}>
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] transition-all card-lift shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#00A86B]" />
                  <h3 className="font-bold text-xl text-[#101828] font-heading">EndNote</h3>
                </div>
                <p className="text-xs font-semibold text-[#087A52]">Industry Standard Citation Suite</p>
                <p className="text-[14.5px] text-[#667085] leading-relaxed">
                  Widely deployed across global pharma enterprises, CROs, and university faculties for managing large collaborative multi-author bibliographies.
                </p>
              </div>
            </FadeRight>
          </div>

          {/* Dark Section: DATA AND ANALYSIS SUPPORT */}
          <FadeUp delay={120}>
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0B0F19] text-white border border-white/10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A86B]/20 text-[#00D084] text-xs font-mono font-bold uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5" />
                <span>DATA AND ANALYSIS SUPPORT</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 text-[15.5px] text-[#E5E7EB] leading-relaxed">
                  <div className="w-5 h-5 rounded-full bg-[#00A86B] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>
                    AI can help explain complex datasets, identify trend patterns, and assist with exploratory drafting of Results sections.
                  </span>
                </div>

                <div className="flex items-start gap-3.5 text-[15.5px] text-[#E5E7EB] leading-relaxed">
                  <div className="w-5 h-5 rounded-full bg-[#00A86B] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>
                    Always use dedicated, validated statistical software (e.g. GraphPad Prism, R, SPSS) for actual hypothesis testing, ANOVA, and p-value calculation.
                  </span>
                </div>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* ----------------------------------------------------------------------------
            SECTION 07: AI WORKFLOW
            ---------------------------------------------------------------------------- */}
        <section id="section-07" className="scroll-mt-28 space-y-8">
          <FadeUp>
            <div className="space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#087A52]">
                07 / WORKFLOW SUPPORT
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#101828] font-heading leading-[1.15]">
                Let AI do the groundwork.
              </h2>
              <p className="text-[16.5px] text-[#4B5563] leading-[1.65]">
                Delegate high-friction preparatory tasks to AI models so your cognitive energy is reserved for synthesis and clinical deduction.
              </p>
            </div>
          </FadeUp>

          {/* 5 Large Green Horizontal Cards */}
          <div className="space-y-3">
            {[
              "Generate comprehensive article outlines & heading hierarchies",
              "Create literature-review comparison matrices",
              "Summarize 50-page regulatory guidance documents into key takeaways",
              "Convert bulleted clinical study notes into structured draft paragraphs",
              "Prepare audit checklists and data summary tables"
            ].map((title, idx) => (
              <FadeLeft key={idx} delay={idx * 60}>
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#E8F8F1] via-[#F4FCF8] to-white border border-[#00A86B]/25 hover:border-[#00A86B] transition-all card-lift shadow-xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-[#087A52] text-sm bg-white w-8 h-8 rounded-xl flex items-center justify-center border border-[#00A86B]/20">
                      0{idx + 1}
                    </span>
                    <span className="font-bold text-[#101828] text-[16px] sm:text-[17px] font-heading">
                      {title}
                    </span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-[#00A86B] flex-shrink-0" />
                </div>
              </FadeLeft>
            ))}
          </div>

          {/* Handwritten Footnote */}
          <FadeUp delay={120}>
            <div className="pt-2 text-center">
              <span className="italic font-serif text-[18px] sm:text-[20px] text-[#087A52] tracking-wide">
                ...then check every single line yourself.
              </span>
            </div>
          </FadeUp>
        </section>

        {/* ----------------------------------------------------------------------------
            SECTION 08: THE GOLDEN RULE
            ---------------------------------------------------------------------------- */}
        <section id="section-08" className="scroll-mt-28 space-y-8">
          <FadeUp>
            <div className="space-y-3 text-center max-w-xl mx-auto">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#087A52]">
                08 / GOLDEN RULE
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#101828] font-heading leading-[1.12]">
                The golden rule
              </h2>
              <p className="text-[16.5px] text-[#4B5563] leading-[1.65]">
                Every single deliverable follows this non-negotiable pipeline before submission to journals or regulatory bodies.
              </p>
            </div>
          </FadeUp>

          {/* Vertical Workflow */}
          <div className="max-w-md mx-auto space-y-3 text-center">
            
            {/* Step 1: AI Output */}
            <FadeUp delay={60}>
              <div className="p-6 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] text-[#4B5563] card-lift">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#667085] block mb-1">Step 01</span>
                <div className="text-xl font-bold font-heading text-[#101828]">AI Output</div>
                <div className="text-xs text-[#667085] mt-1">Raw draft, outline, or suggested synthesis</div>
              </div>
            </FadeUp>

            {/* Down Arrow */}
            <div className="flex justify-center text-[#00A86B] py-1">
              <ArrowDown className="w-6 h-6 stroke-[2.5]" />
            </div>

            {/* Step 2: Human Verification (Pulsing Green Block) */}
            <FadeUp delay={120}>
              <div className="p-7 rounded-2xl bg-[#00A86B] text-white shadow-md animate-pulse-green relative card-lift">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#E8F8F1] block mb-1 font-semibold">
                  Step 02 (Essential)
                </span>
                <div className="text-2xl font-black font-heading text-white">
                  Human Verification
                </div>
                <div className="text-xs text-[#E8F8F1] mt-1 font-medium">
                  Authoritative review of claims, calculations, citations & tone
                </div>
              </div>
            </FadeUp>

            {/* Down Arrow */}
            <div className="flex justify-center text-[#00A86B] py-1">
              <ArrowDown className="w-6 h-6 stroke-[2.5]" />
            </div>

            {/* Step 3: Final Content */}
            <FadeUp delay={180}>
              <div className="p-6 rounded-2xl bg-[#101828] text-white border border-[#101828] card-lift">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#00D084] block mb-1">Step 03</span>
                <div className="text-xl font-bold font-heading text-white">Final Content</div>
                <div className="text-xs text-[#9CA3AF] mt-1">Validated, publication-ready scientific deliverable</div>
              </div>
            </FadeUp>

          </div>
        </section>

        {/* ----------------------------------------------------------------------------
            SECTION 09: RESPONSIBLE USE
            ---------------------------------------------------------------------------- */}
        <section id="section-09" className="scroll-mt-28 space-y-8">
          <FadeUp>
            <div className="space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#087A52]">
                09 / RESPONSIBLE USE
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#101828] font-heading leading-[1.15]">
                Use AI <HighlightBlock>responsibly</HighlightBlock>.
              </h2>
              <p className="text-[16.5px] text-[#4B5563] leading-[1.65]">
                Trust is the foundational currency of medical science. Adhere strictly to these core verification principles.
              </p>
            </div>
          </FadeUp>

          {/* Rule 1 (Left) & Rule 2 (Right) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Rule 1 */}
            <FadeLeft delay={80}>
              <div className="p-8 rounded-3xl bg-[#101828] text-white border border-white/10 card-lift h-full space-y-4 shadow-sm">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00A86B]/20 text-[#00D084] text-xs font-mono font-bold tracking-wider">
                  <span>RULE 01</span>
                </div>
                <h3 className="text-2xl font-bold font-heading text-white">
                  Verify every important claim
                </h3>
                <p className="text-[15px] text-[#D1D5DB] leading-[1.65]">
                  Check each pharmacological mechanism, clinical endpoint, and trial statistic directly against the original peer-reviewed publication or source document.
                </p>
              </div>
            </FadeLeft>

            {/* Rule 2 */}
            <FadeRight delay={120}>
              <div className="p-8 rounded-3xl bg-[#101828] text-white border border-white/10 card-lift h-full space-y-4 shadow-sm">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00A86B]/20 text-[#00D084] text-xs font-mono font-bold tracking-wider">
                  <span>RULE 02</span>
                </div>
                <h3 className="text-2xl font-bold font-heading text-white">
                  Never blindly trust AI references
                </h3>
                <p className="text-[15px] text-[#D1D5DB] leading-[1.65]">
                  AI tools frequently fabricate believable-looking DOIs and author lists. Confirm that the paper exists, is indexed in PubMed, and genuinely supports your assertion.
                </p>
              </div>
            </FadeRight>

          </div>
        </section>

        {/* ----------------------------------------------------------------------------
            SECTION 10: DATA & POLICY
            ---------------------------------------------------------------------------- */}
        <section id="section-10" className="scroll-mt-28 space-y-8">
          <FadeUp>
            <div className="space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#087A52]">
                10 / DATA & POLICY
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#101828] font-heading leading-[1.15]">
                Protect the data. Follow the policy.
              </h2>
              <p className="text-[16.5px] text-[#4B5563] leading-[1.65]">
                Compliance with international privacy statutes (DPDP Act, HIPAA, GDPR) and journal declaration policies is legally mandatory.
              </p>
            </div>
          </FadeUp>

          {/* Rule 3 & Rule 4 on Light Gray Background */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Rule 3 */}
            <FadeLeft delay={80}>
              <div className="p-8 rounded-3xl bg-[#F8FAF9] border border-[#E5E7EB] card-lift h-full space-y-3.5 shadow-xs">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#087A52] text-xs font-mono font-bold border border-[#E5E7EB]">
                  <Lock className="w-3.5 h-3.5 text-[#00A86B]" />
                  <span>RULE 03</span>
                </div>
                <h3 className="text-2xl font-bold font-heading text-[#101828]">
                  Protect confidential information
                </h3>
                <p className="text-[15px] text-[#4B5563] leading-[1.65]">
                  Do not paste sensitive patient records, unpublished chemical structures, or proprietary pharmaceutical trial dossiers into public LLM prompts without explicit legal authorization.
                </p>
              </div>
            </FadeLeft>

            {/* Rule 4 */}
            <FadeRight delay={120}>
              <div className="p-8 rounded-3xl bg-[#F8FAF9] border border-[#E5E7EB] card-lift h-full space-y-3.5 shadow-xs">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#087A52] text-xs font-mono font-bold border border-[#E5E7EB]">
                  <FileText className="w-3.5 h-3.5 text-[#00A86B]" />
                  <span>RULE 04</span>
                </div>
                <h3 className="text-2xl font-bold font-heading text-[#101828]">
                  Follow journal & organizational policies
                </h3>
                <p className="text-[15px] text-[#4B5563] leading-[1.65]">
                  AI disclosure requirements differ across publishers (ICMJE, Elsevier, Springer). Always provide transparent AI-use disclosures in the manuscript methodology or acknowledgments.
                </p>
              </div>
            </FadeRight>

          </div>
        </section>

        {/* ----------------------------------------------------------------------------
            SECTION 11 & 12: HUMAN IN THE LOOP & KEY TAKEAWAY
            ---------------------------------------------------------------------------- */}
        <section id="section-11" className="scroll-mt-28 space-y-8">
          <FadeUp>
            <div className="space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#087A52]">
                11 / HUMAN IN THE LOOP
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#101828] font-heading leading-[1.15]">
                Keep the human in the loop.
              </h2>
              <p className="text-[16.5px] text-[#4B5563] leading-[1.65] max-w-2xl">
                The medical writer and principal investigator remain strictly responsible for the quality, safety interpretations, and intellectual integrity of the final work.
              </p>
            </div>
          </FadeUp>

          {/* Dramatic Dark Section: Key Takeaway */}
          <div id="section-12" className="scroll-mt-28">
            <FadeUp delay={100}>
              <div className="p-10 sm:p-14 rounded-3xl bg-[#101828] text-white border-2 border-[#00A86B]/40 shadow-xl relative overflow-hidden card-lift text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00A86B]/20 text-[#00D084] text-xs font-mono font-bold uppercase tracking-widest">
                  <span>12 / KEY TAKEAWAY</span>
                </div>
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white leading-tight max-w-2xl mx-auto">
                  AI is a writing assistant, <br />
                  not the <span className="text-[#00D084] underline decoration-[#00A86B] decoration-wavy underline-offset-8">scientific authority</span>.
                </h3>
                <p className="text-[16px] text-[#D1D5DB] max-w-xl mx-auto leading-relaxed pt-2">
                  Use it to accelerate your research throughput, but let your pharmaceutical training validate every single claim.
                </p>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ----------------------------------------------------------------------------
            SECTION 13: FINAL TAKEAWAY & SHARE
            ---------------------------------------------------------------------------- */}
        <section id="section-13" className="scroll-mt-28 pt-8 border-t border-[#E5E7EB] space-y-8">
          <FadeUp>
            <div className="p-8 sm:p-12 rounded-3xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-xs text-center space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8F8F1] text-[#087A52] text-xs font-mono font-bold uppercase tracking-wider">
                <span>13 / FINAL TAKEAWAY</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#101828] font-heading leading-tight max-w-2xl mx-auto">
                Save this. <br />
                Share it with a fellow pharmacy student.
              </h2>

              <p className="text-[16.5px] text-[#4B5563] max-w-xl mx-auto leading-relaxed">
                Follow PharmNexia for more practical guides covering pharmacy career paths, medical writing cohorts, research methodologies, and verified alumni mentorship.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => onNavigate('/resources')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[15.5px] shadow-sm flex items-center justify-center gap-2 btn-primary-action"
                >
                  <span>Explore More Resources</span>
                  <ArrowRight className="w-4 h-4 btn-arrow" />
                </button>

                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-[#F8FAF9] text-[#101828] border border-[#E5E7EB] hover:border-[#00A86B] font-semibold text-[15px] flex items-center justify-center gap-2 btn-secondary-action shadow-xs"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-[#00A86B]" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#00A86B]" />
                      <span>Copy Guide Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onNavigate('/career-paths')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-[#F8FAF9] text-[#101828] border border-[#E5E7EB] hover:border-[#00A86B] font-semibold text-[15px] flex items-center justify-center gap-2 btn-secondary-action shadow-xs"
                >
                  <GraduationCap className="w-4 h-4 text-[#00A86B]" />
                  <span>Explore Career Paths</span>
                </button>
              </div>

            </div>
          </FadeUp>
        </section>

      </main>

      {/* ==============================================================================
          FLOATING BACK TO TOP BUTTON
          ============================================================================== */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#101828] hover:bg-[#00A86B] text-white flex items-center justify-center shadow-lg transition-all duration-200 card-lift"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

    </div>
  );
};

export default AiMedicalWritingPage;
