import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { PageTransition } from './components/Animation';
import { SupportDeskAdmin } from './components/SupportDeskAdmin';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { CareerPathsPage } from './pages/CareerPathsPage';
import { CareerPathDetailPage } from './pages/CareerPathDetailPage';
import { MentorsPage } from './pages/MentorsPage';
import { MentorProfilePage } from './pages/MentorProfilePage';
import { ProgramsPage } from './pages/ProgramsPage';
import { ProgramDetailPage } from './pages/ProgramDetailPage';
import { ProgramAccessPage } from './pages/ProgramAccessPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { OpportunityDetailPage } from './pages/OpportunityDetailPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AiMedicalWritingPage } from './pages/AiMedicalWritingPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFoundPage } from './pages/NotFoundPage';
import { 
  PrivacyPolicyPage, 
  TermsPage, 
  RefundPolicyPage, 
  CancellationPolicyPage, 
  AboutPage 
} from './pages/LegalPages';

function AppContent() {
  const { currentUser, authStatus, logoutUser } = useApp();

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

  // Sync auth modal with path & redirect authenticated users away from /login & /register
  useEffect(() => {
    // If user is already authenticated and visits /login or /register, redirect to / cleanly
    if (authStatus === 'AUTHENTICATED' && (currentPath === '/login' || currentPath === '/register')) {
      setAuthModalOpen(false);
      window.history.replaceState({}, '', '/');
      setCurrentPath('/');
      return;
    }

    if (currentPath === '/login') {
      setAuthModalMode('login');
      setAuthModalOpen(true);
    } else if (currentPath === '/register') {
      setAuthModalMode('signup');
      setAuthModalOpen(true);
    }

    // Handle Google Calendar OAuth Return
    const params = new URLSearchParams(window.location.search);
    if (params.get('calendar') === 'connected') {
      const email = params.get('email') || '';
      const connectionData = {
        isConnected: true,
        googleAccountEmail: email,
        calendarId: 'primary',
        syncStatus: 'SYNCED',
        connectedAt: new Date().toISOString()
      };
      localStorage.setItem('pharmnexia_mentor_cal_connection', JSON.stringify(connectionData));
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [currentPath, authStatus]);

  const navigate = (path, options = {}) => {
    if (path.startsWith('/auth')) {
      const mode = path.includes('signup') ? 'signup' : 'login';
      setAuthModalMode(mode);
      setAuthModalOpen(true);
      return;
    }

    if (path === '/login') {
      if (authStatus === 'AUTHENTICATED') {
        navigate('/dashboard', { replace: true });
        return;
      }
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    if (path === '/register') {
      if (authStatus === 'AUTHENTICATED') {
        navigate('/dashboard', { replace: true });
        return;
      }
      setAuthModalMode('signup');
      setAuthModalOpen(true);
      return;
    }

    if (options.replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Staff and Developer Authorization Roles
  const staffRoles = ['ADMIN', 'SUPER_ADMIN', 'DEVELOPER', 'MENTOR_MANAGER', 'CONTENT_MANAGER', 'SUPPORT', 'ANALYST'];

  // Route matching helper
  const renderCurrentPage = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '' || currentPath === '/login' || currentPath === '/register') {
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
      return <MentorsPage onNavigate={navigate} initialApplyOpen={true} />;
    }

    // 5. Programs, Detail & Verified Event Access
    if (currentPath === '/programs') {
      return <ProgramsPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/programs/') && currentPath.endsWith('/access')) {
      const programId = currentPath.replace('/programs/', '').replace('/access', '');
      return (
        <ProtectedRoute onNavigate={navigate}>
          <ProgramAccessPage programId={programId} onNavigate={navigate} />
        </ProtectedRoute>
      );
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

    // 8. Certificate verification (Disabled from public navigation; redirects home)
    if (currentPath.startsWith('/verify-certificate')) {
      return <HomePage onNavigate={navigate} />;
    }

    // 9. Dashboard / Profile Pages (Role-Driven Dynamic Routing)
    if (currentPath === '/profile' || currentPath === '/dashboard') {
      const role = (currentUser?.staffRole || currentUser?.role || 'STUDENT').toUpperCase();
      if (staffRoles.includes(role)) {
        return (
          <ProtectedRoute allowedRoles={staffRoles} onNavigate={navigate}>
            <AdminDashboard onNavigate={navigate} />
          </ProtectedRoute>
        );
      }
      return (
        <ProtectedRoute onNavigate={navigate}>
          <StudentDashboard onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    if (currentPath === '/contact') {
      return <HomePage onNavigate={navigate} />;
    }

    // 10. Admin Dashboard & Subroutes (Strictly Role Protected)
    if (currentPath === '/admin/programs') {
      return (
        <ProtectedRoute allowedRoles={staffRoles} onNavigate={navigate}>
          <AdminDashboard initialSection="programs" onNavigate={navigate} />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/admin/analytics') {
      return (
        <ProtectedRoute allowedRoles={staffRoles} onNavigate={navigate}>
          <AdminDashboard initialSection="analytics" onNavigate={navigate} />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/admin/staff') {
      return (
        <ProtectedRoute allowedRoles={staffRoles} onNavigate={navigate}>
          <AdminDashboard initialSection="staff" onNavigate={navigate} />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/admin') {
      return (
        <ProtectedRoute allowedRoles={staffRoles} onNavigate={navigate}>
          <AdminDashboard onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    // 11. Support Desk Management Console (Protected Route for Staff)
    if (currentPath === '/support-desk' || currentPath === '/support') {
      return (
        <ProtectedRoute allowedRoles={staffRoles} onNavigate={navigate}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SupportDeskAdmin onNavigate={navigate} />
          </div>
        </ProtectedRoute>
      );
    }

    // 12. Legal & Compliance Pages
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

    // 13. 404 Fallback for unknown routes
    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#111827] font-sans selection:bg-[#00D084]/20 selection:text-[#087A52] antialiased">
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      <main className="flex-1">
        <ErrorBoundary onNavigate={navigate}>
          <PageTransition key={currentPath}>
            {renderCurrentPage()}
          </PageTransition>
        </ErrorBoundary>
      </main>

      <Footer onNavigate={navigate} />

      <AuthModal 
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => {
          setAuthModalOpen(false);
          const current = window.location.pathname;
          if (current === '/login' || current === '/register') {
            window.history.replaceState({}, '', '/');
            setCurrentPath('/');
          }
        }}
        onSuccess={() => {
          setAuthModalOpen(false);
          // Use replace: true so /login or /register is replaced in history
          navigate('/dashboard', { replace: true });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
