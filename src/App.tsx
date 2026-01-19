import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { LoginView } from './components/LoginView';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentView } from './components/StudentView';
import { AdminPanel } from './components/AdminPanel';
import { UserAccount } from './utils/demoAccounts';
import { authService } from './services/firebase';
import { ToastProvider } from './components/ui/Toast';

function AppContent() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch their profile
        const profile = await authService.getUserProfile(firebaseUser.uid);
        if (profile) {
          const userAccount: UserAccount = {
            id: firebaseUser.uid,
            email: profile.email,
            password: '',
            role: profile.role,
            name: profile.name,
            avatar: profile.avatar,
            department: profile.department,
            gradeLevel: profile.gradeLevel,
            classroomId: profile.classroomId,
            studentId: profile.studentId
          };
          setCurrentUser(userAccount);
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="blob blob-primary w-[500px] h-[500px] absolute -top-32 -left-32"></div>
        <div className="blob blob-accent w-[400px] h-[400px] absolute -bottom-24 -right-24"></div>
        
        <div className="text-center relative z-10">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-200 border-t-primary-500 mx-auto"></div>
          </div>
          <p className="text-slate-600 mt-4 font-medium">Loading MathPulse AI...</p>
        </div>
      </div>
    );
  }

  // Render based on user role
  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  // Admin users get the Admin Panel
  if (currentUser.role === 'admin') {
    return (
      <AdminPanel 
        onLogout={handleLogout} 
        currentUser={currentUser}
      />
    );
  }

  // Teacher view
  if (currentUser.role === 'teacher') {
    return (
      <TeacherDashboard 
        onLogout={handleLogout} 
        currentUser={currentUser}
      />
    );
  }

  // Student view
  return (
    <StudentView 
      onLogout={handleLogout} 
      currentUser={currentUser}
    />
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
      <Analytics />
    </ToastProvider>
  );
}