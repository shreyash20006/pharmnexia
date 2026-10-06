import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { PageTransition } from './components/Animation';
import { SupportDeskModal } from './components/SupportDeskModal';
import { SupportDeskAdmin } from './components/SupportDeskAdmin';

// Pages
import { HomePage } from './pages/HomePage';
import { CareerPathsPage } from './pages/CareerPathsPage';
import { CareerPathDetailPage } from './pages/CareerPathDetailPage';
import { MentorsPage } from './pages/MentorsPage';
import { MentorProfilePage } from './pages/MentorProfilePage';
import { ProgramsPage } from './pages/ProgramsPage';
import { ProgramDetailPage } from './pages/ProgramDetailPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { OpportunityDetailPage } from './pages/OpportunityDetailPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AiMedicalWritingPage } from './pages/AiMedicalWritingPage';
import { VerifyCertificatePage } from './pages/VerifyCertificatePage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { 
  PrivacyPolicyPage, 
  TermsPage, 
  RefundPolicyPage, 
  CancellationPolicyPage, 
  AboutPage 
} from './pages/LegalPages';

function AppContent() {
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname || '/';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (currentPath === '/login') {
      setAuthModalMode('login');
      setAuthModalOpen(true);
    }

    if (currentPath === '/register') {
      setAuthModalMode('signup');
      setAuthModalOpen(true);
    }
  }, [currentPath]);

  const navigate = (path) => {
    if (path.startsWith('/auth')) {
      const mode = path.includes('signup') ? 'signup' : 'login';
      setAuthModalMode(mode);
      setAuthModalOpen(true);
      return;
    }

    if (path === '/login') {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    if (path === '/register') {
      setAuthModalMode('signup');
      setAuthModalOpen(true);
      return;
    }

    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route matching helper
  const renderCurrentPage = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={navigate} />;
    }

    // 2. Career Paths & Detail
    if (currentPath === '/career-paths') {
      return <CareerPathsPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/career-paths/')) {
      const slug = currentPath.replace('/career-paths/', '');
      return <CareerPathDetailPage slug={slug} onNavigate={navigate} />;
    }

    // 3. Mentors & Detail
    if (currentPath === '/mentors') {
      return <MentorsPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/mentors/')) {
      const mentorId = currentPath.replace('/mentors/', '');
      return <MentorProfilePage mentorId={mentorId} onNavigate={navigate} />;
    }

    // 4. Become a mentor / onboarding
    if (currentPath === '/become-a-mentor' || currentPath === '/mentor/onboarding') {
      return <MentorsPage onNavigate={navigate} />;
    }

    // 5. Programs & Detail
    if (currentPath === '/programs') {
      return <ProgramsPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/programs/')) {
      const programId = currentPath.replace('/programs/', '');
      return <ProgramDetailPage programId={programId} onNavigate={navigate} />;
    }

    // 6. Opportunities & Detail
    if (currentPath === '/opportunities') {
      return <OpportunitiesPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/opportunities/')) {
      const oppId = currentPath.replace('/opportunities/', '');
      return <OpportunityDetailPage opportunityId={oppId} onNavigate={navigate} />;
    }

    // 7. Resources & AI Medical Writing Interactive Guide
    if (currentPath === '/resources/ai-medical-writing') {
      return <AiMedicalWritingPage onNavigate={navigate} />;
    }
    if (currentPath === '/resources') {
      return <ResourcesPage onNavigate={navigate} />;
    }

    // 8. Verify Certificate
    if (currentPath.startsWith('/verify-certificate')) {
      const parts = currentPath.split('/verify-certificate/');
      const certId = parts.length > 1 ? parts[1] : '';
      return <VerifyCertificatePage initialCertId={certId} onNavigate={navigate} />;
    }

    // 9. Student / profile pages
    if (currentPath === '/profile' || currentPath === '/dashboard') {
      return <StudentDashboard onNavigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SupportDeskAdmin onNavigate={navigate} />
        </div>
      );
    }

    // 10. Admin Dashboard
    if (currentPath === '/admin') {
      return <AdminDashboard onNavigate={navigate} />;
    }

    // 11. Support Desk Management Console (Direct Route)
    if (currentPath === '/support-desk' || currentPath === '/support') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SupportDeskAdmin onNavigate={navigate} />
        </div>
      );
    }
    // 11. Legal & Compliance Pages
    if (currentPath === '/privacy') {
      return <PrivacyPolicyPage onNavigate={navigate} />;
    }
    if (currentPath === '/terms') {
      return <TermsPage onNavigate={navigate} />;
    }
    if (currentPath === '/refund-policy') {
      return <RefundPolicyPage onNavigate={navigate} />;
    }
    if (currentPath === '/cancellation-policy') {
      return <CancellationPolicyPage onNavigate={navigate} />;
    }
    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    // Default fallback
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#111111] font-sans selection:bg-[#00D084]/20 selection:text-[#087A52] antialiased">
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      <main className="flex-1">
        <PageTransition key={currentPath}>
          {renderCurrentPage()}
        </PageTransition>
      </main>

      <Footer onNavigate={navigate} />

      <AuthModal 
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => {
          setAuthModalOpen(false);
          const current = window.location.pathname;
          if (current === '/login' || current === '/register') {
            window.history.pushState({}, '', '/');
            setCurrentPath('/');
          }
        }}
        onSuccess={() => {
          setAuthModalOpen(false);
          navigate('/dashboard');
        }}
      />

      {/* Personalized PharmNexia Support Desk Floating Widget */}
      <SupportDeskModal 
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
