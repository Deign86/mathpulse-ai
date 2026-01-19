import { useState } from 'react';
import { BrainCircuit, Eye, EyeOff, AlertCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Blobs - New Vibrant Colors */}
      <div className="blob blob-primary w-[600px] h-[600px] absolute -top-48 -left-48" style={{ animationDelay: '0s' }}></div>
      <div className="blob blob-accent w-[500px] h-[500px] absolute -bottom-32 -right-32" style={{ animationDelay: '2s' }}></div>
      <div className="blob blob-cream w-[400px] h-[400px] absolute top-1/2 right-1/4" style={{ animationDelay: '4s' }}></div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(2,89,221,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(2,89,221,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      
      {/* Login Card */}
      <div className="glass-card p-8 w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl blur-xl opacity-50"></div>
            <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-4 rounded-2xl shadow-lg">
              <BrainCircuit className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-center text-3xl font-bold mb-2">
          <span className="text-gradient">MathPulse</span>
          <span className="text-slate-800"> AI</span>
        </h1>
        
        {/* Research Title Highlight Box */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl p-4 mb-6">
          <p className="text-center text-primary-700 italic text-sm leading-relaxed">
            "Recommender System for Senior High School Student: An AI-Powered Predictive System for Identifying Students at Risk in Math Subjects"
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-slate-700 mb-2 text-sm font-medium">
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
              className="w-full px-4 py-3 bg-white/80 border border-primary-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-slate-700 mb-2 text-sm font-medium">
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
                className="w-full px-4 py-3 pr-12 bg-white/80 border border-primary-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-4 mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Section */}
        <div className="mt-6 border-t border-primary-100 pt-4">
          <button
            type="button"
            onClick={() => setShowDemoCredentials(!showDemoCredentials)}
            className="w-full flex items-center justify-between text-slate-500 hover:text-primary-600 transition-colors cursor-pointer"
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
                className="w-full p-3 text-left bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-xl transition-all cursor-pointer hover:border-primary-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-700">Administrator</p>
                    <p className="text-xs text-primary-500">{demoCredentials.admin.email}</p>
                  </div>
                  <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded-lg font-medium">Admin</span>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => fillDemoCredentials('teacher')}
                className="w-full p-3 text-left bg-secondary-50 hover:bg-secondary-100 border border-secondary-200 rounded-xl transition-all cursor-pointer hover:border-secondary-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-700">Teacher Account</p>
                    <p className="text-xs text-secondary-500">{demoCredentials.teacher.email}</p>
                  </div>
                  <span className="text-xs bg-secondary-500 text-white px-2 py-1 rounded-lg font-medium">Teacher</span>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => fillDemoCredentials('student')}
                className="w-full p-3 text-left bg-accent-50 hover:bg-accent-100 border border-accent-200 rounded-xl transition-all cursor-pointer hover:border-accent-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-accent-700">Student Account</p>
                    <p className="text-xs text-accent-500">{demoCredentials.student.email}</p>
                  </div>
                  <span className="text-xs bg-accent-500 text-white px-2 py-1 rounded-lg font-medium">Student</span>
                </div>
              </button>
              
              <p className="text-xs text-slate-400 text-center mt-2">
                Click any option above to auto-fill credentials
              </p>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-6">
          <Sparkles className="w-4 h-4 text-accent-500" />
          <p className="text-slate-500 text-sm">
            Powered by <span className="text-gradient font-semibold">Advanced Machine Learning</span>
          </p>
        </div>
      </div>
    </div>
  );
}
