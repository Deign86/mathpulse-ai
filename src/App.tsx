import { useState } from 'react';
import { LoginView } from './components/LoginView';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentView } from './components/StudentView';

type UserRole = 'teacher' | 'student' | null;

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleLogin = (role: 'teacher' | 'student') => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  return (
    <>
      {!userRole ? (
        <LoginView onLogin={handleLogin} />
      ) : userRole === 'teacher' ? (
        <TeacherDashboard onLogout={handleLogout} />
      ) : (
        <StudentView onLogout={handleLogout} />
      )}
    </>
  );
}