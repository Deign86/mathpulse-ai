import { useState } from 'react';
import { BrainCircuit, Eye, EyeOff, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { demoCredentials, UserAccount } from '../utils/demoAccounts';
import { authService, UserProfile } from '../services/firebase';

interface LoginViewProps {
  onLogin: (user: UserAccount) => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Use Firebase Authentication
      const result = await authService.signIn(email, password);
      
      if (result && result.profile) {
        // Convert UserProfile to UserAccount format for compatibility
        const userAccount: UserAccount = {
          id: result.user.uid,
          email: result.profile.email,
          password: '', // Don't store password
          role: result.profile.role,
          name: result.profile.name,
          avatar: result.profile.avatar,
          department: result.profile.department,
          gradeLevel: result.profile.gradeLevel,
          classroomId: result.profile.classroomId,
          studentId: result.profile.studentId
        };
        onLogin(userAccount);
      } else {
        setError('User profile not found. Please contact support.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    }
    
    setIsLoading(false);
  };

  const fillDemoCredentials = (type: 'admin' | 'teacher' | 'student') => {
    const creds = demoCredentials[type];
    setEmail(creds.email);
    setPassword(creds.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Blue Blurs Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-900 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
      
      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-brand-500 to-brand-900 p-4 rounded-2xl">
            <BrainCircuit className="w-12 h-12 text-white" />
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-center text-sky-900 mb-4">MathPulse AI</h1>
        
        {/* Research Title Highlight Box */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-200 rounded-lg p-4 mb-6">
          <p className="text-center text-sky-800 italic font-serif text-sm leading-relaxed">
            "Recommender System for Senior High School Student: An AI-Powered Predictive System for Identifying Students at Risk in Math Subjects"
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-slate-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@school.edu"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white py-4 rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all shadow-lg hover:shadow-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Section */}
        <div className="mt-6 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() => setShowDemoCredentials(!showDemoCredentials)}
            className="w-full flex items-center justify-between text-slate-600 hover:text-slate-800 transition-colors"
          >
            <span className="text-sm font-medium">Demo Credentials (For Testing)</span>
            {showDemoCredentials ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          
          {showDemoCredentials && (
            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-800">Administrator</p>
                    <p className="text-xs text-purple-600">{demoCredentials.admin.email}</p>
                  </div>
                  <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">Admin</span>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => fillDemoCredentials('teacher')}
                className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Teacher Account</p>
                    <p className="text-xs text-blue-600">{demoCredentials.teacher.email}</p>
                  </div>
                  <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Teacher</span>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => fillDemoCredentials('student')}
                className="w-full p-3 text-left bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Student Account</p>
                    <p className="text-xs text-green-600">{demoCredentials.student.email}</p>
                  </div>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Student</span>
                </div>
              </button>
              
              <p className="text-xs text-slate-500 text-center mt-2">
                Click any option above to auto-fill credentials
              </p>
            </div>
          )}
        </div>
        
        <p className="text-center text-slate-500 mt-6 text-sm">
          Powered by Advanced Machine Learning
        </p>
      </div>
    </div>
  );
}
