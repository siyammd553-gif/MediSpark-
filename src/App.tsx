import React, { useState, useRef, useEffect } from 'react';
import { PageView, Course } from './types';
import { COURSES_DATA } from './data/mockData';
import { ThemeProvider } from './context/ThemeContext';
import { LearningProvider, useLearning } from './context/LearningContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { NavigationDrawer } from './components/NavigationDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { Footer } from './components/Footer';

// Home Page Subcomponents
import { HeroSection } from './components/home/HeroSection';
import { HighlightCards } from './components/home/HighlightCards';
import { MentorSection } from './components/home/MentorSection';
import { FeaturedCourses } from './components/home/FeaturedCourses';
import { MedicalPrepFeatures } from './components/home/MedicalPrepFeatures';
import { SuccessStats } from './components/home/SuccessStats';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { StudyResourcesSection } from './components/home/StudyResourcesSection';
import { CtaSection } from './components/home/CtaSection';

// Full Page Views
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { CourseOverviewView } from './components/learning/CourseOverviewView';
import { ChapterLearningPage } from './components/learning/ChapterLearningPage';
import { CoursesPage } from './pages/CoursesPage';
import { MentorsPage } from './pages/MentorsPage';
import { ExamPracticePage } from './pages/ExamPracticePage';
import { QnAPage } from './pages/QnAPage';
import { RankPredictorPage } from './pages/RankPredictorPage';
import { StudyResourcesPage } from './pages/StudyResourcesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

export function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState<Course | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const hasRouted = useRef(false);

  const { user, profile, isAuthenticated, isReady, role, dashboard, hasActiveCourse, logout } = useAuth();
  const { enrollInCourse, navigateToCourse } = useLearning();

  // Landing-route decision, resolved once auth + the student's dashboard are loaded:
  // - Authenticated student WITHOUT an active enrolled course -> Home
  // - Authenticated student WITH an active enrolled course  -> Dashboard
  // - Everyone else (guest / teacher / admin)               -> Home
  useEffect(() => {
    if (!isReady) return;
    if (role === 'student' && dashboard === null) return; // still loading per-student data
    if (hasRouted.current) return;
    hasRouted.current = true;
    if (isAuthenticated && role === 'student') {
      setCurrentPage(hasActiveCourse ? 'dashboard' : 'home');
    } else {
      setCurrentPage('home');
    }
  }, [isReady, isAuthenticated, role, dashboard, hasActiveCourse]);

  // Scroll to top on page navigate
  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleDownloadResource = (title: string) => {
    triggerToast(`📥 Downloading "${title}" (High-Yield PDF)...`);
  };

  const handleEnrollCourse = async (course: Course) => {
    // Enrollment is tied to the authenticated student's account and is
    // recorded server-side against the course catalog.
    if (!isAuthenticated || role !== 'student') {
      triggerToast('🔒 Please log in to enroll in a course.');
      setIsAuthModalOpen(true);
      return;
    }
    if (course.isFree || course.price === 0) {
      const ok = await enrollInCourse(course.id);
      if (!ok) {
        triggerToast('⚠️ Enrollment failed. Please try again.');
        return;
      }
      navigateToCourse(course.id);
      triggerToast(`🎉 Enrolled in ${course.title}! Loading Course Overview...`);
      setTimeout(() => {
        handleNavigate('course-overview');
      }, 500);
      return;
    }
    setSelectedCourseForPayment(course);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (course: Course, paymentMethod?: string) => {
    if (!isAuthenticated || role !== 'student') {
      setIsAuthModalOpen(true);
      return;
    }
    const ok = await enrollInCourse(course.id, paymentMethod);
    if (!ok) {
      triggerToast('⚠️ Purchase confirmation failed. Please try again.');
      return;
    }
    navigateToCourse(course.id);
    triggerToast(`🎉 Successfully enrolled in ${course.title}!`);
    setTimeout(() => {
      handleNavigate('course-overview');
    }, 1000);
  };

  const handleLogout = async () => {
    await logout();
    hasRouted.current = false;
    setCurrentPage('home');
    triggerToast('👋 Logged out. Your session has been securely closed.');
  };

  const unreadNotificationsCount = (dashboard?.notifications ?? []).filter((n) => !n.read).length;

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#090909] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400 text-sm font-semibold">
          <span className="w-4 h-4 rounded-full border-2 border-[#E50914] border-t-transparent animate-spin" />
          Securing MediSpark session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col font-sans selection:bg-[#E50914] selection:text-white relative">
      {/* Elegant Dark Subtle Radial Pattern Layer */}
      <div className="bg-pattern" />
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#161822] border border-[#E50914]/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E50914] animate-ping shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Header with Theme Switch */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenNavDrawer={() => setIsNavDrawerOpen(true)}
        isLoggedIn={isAuthenticated}
        userStreak={profile?.streakDays ?? 0}
        unreadNotificationsCount={unreadNotificationsCount}
        userName={user?.name || ''}
        userRole={role || null}
        onLogout={handleLogout}
      />

      {/* Responsive Navigation Drawer */}
      <NavigationDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={() => {
          setIsNavDrawerOpen(false);
          setIsAuthModalOpen(true);
        }}
        isLoggedIn={isAuthenticated}
        userStreak={profile?.streakDays ?? 0}
      />

      {/* Main Content Router */}
      <main className="flex-1 pb-16 lg:pb-0">
        {/* Route: Home Page */}
        {currentPage === 'home' && (
          <div className="space-y-0">
            <HeroSection
              onNavigate={handleNavigate}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
            <HighlightCards onNavigate={handleNavigate} />
            <MentorSection onNavigate={handleNavigate} />
            <SuccessStats />
            <TestimonialsSection />
            <StudyResourcesSection
              onNavigate={handleNavigate}
              onDownload={handleDownloadResource}
            />
            <CtaSection
              onNavigate={handleNavigate}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          </div>
        )}

        {/* Route: Student Dashboard */}
        {currentPage === 'dashboard' && (
          <StudentDashboard
            onNavigate={handleNavigate}
            onDownloadResource={handleDownloadResource}
          />
        )}

        {/* Route: Course Overview Page */}
        {currentPage === 'course-overview' && (
          <CourseOverviewView onNavigate={handleNavigate} />
        )}

        {/* Route: Hierarchical Chapter Learning Page */}
        {currentPage === 'chapter-learning' && (
          <ChapterLearningPage
            onNavigate={handleNavigate}
            isAuthenticated={isAuthenticated}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* Route: All Courses */}
        {currentPage === 'courses' && (
          <CoursesPage
            onNavigate={handleNavigate}
            onEnroll={handleEnrollCourse}
          />
        )}

        {/* Route: Mentors & Faculty */}
        {currentPage === 'mentors' && (
          <MentorsPage onNavigate={handleNavigate} />
        )}

        {/* Route: DGHS Exam Practice & MCQ Simulator */}
        {currentPage === 'exam' && (
          <ExamPracticePage onNavigate={handleNavigate} />
        )}

        {/* Route: Q&A Doubt Clearance & AI Tutor */}
        {(currentPage === 'qna' || currentPage === 'ai-tutor') && (
          <QnAPage onNavigate={handleNavigate} />
        )}

        {/* Route: Rank & College Predictor */}
        {currentPage === 'rank-predictor' && (
          <RankPredictorPage onNavigate={handleNavigate} />
        )}

        {/* Route: Study Resources Vault */}
        {currentPage === 'resources' && (
          <StudyResourcesPage
            onNavigate={handleNavigate}
            onDownload={handleDownloadResource}
            isAuthenticated={isAuthenticated}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* Route: About MediSpark */}
        {currentPage === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {/* Route: Contact & Helpline */}
        {currentPage === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Global Footer (displayed on all pages) */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Bar for quick navigation on phones */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Auth Modal (Login / Register / Demo Roles) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(name, loginRole, accountId) => {
          const roleLabel =
            loginRole === 'admin'
              ? 'Academic Director'
              : loginRole === 'teacher'
                ? 'Mentor / Faculty'
                : 'Medical Aspirant';
          triggerToast(`Welcome back, ${name}! Logged in as ${roleLabel}. Account: ${accountId}`);
          // Post-login routing: students with an active enrolled course go to
          // their Dashboard; students without one (and other roles) go Home.
          if (loginRole === 'student') {
            handleNavigate(hasActiveCourse ? 'dashboard' : 'home');
          } else {
            handleNavigate('home');
          }
        }}
      />

      {/* Payment Gateway Modal (bKash / Nagad / SSL) */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        course={selectedCourseForPayment}
        onSuccess={handlePaymentSuccess}
      />

    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LearningProvider>
          <AppContent />
        </LearningProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

