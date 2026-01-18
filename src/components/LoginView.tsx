import { useState } from 'react';
import { BrainCircuit } from 'lucide-react';

interface LoginViewProps {
  onLogin: (role: 'teacher' | 'student') => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student'>('teacher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
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
        
        {/* Role Switcher */}
        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setSelectedRole('teacher')}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              selectedRole === 'teacher'
                ? 'bg-white shadow-md text-brand-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teacher
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('student')}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              selectedRole === 'student'
                ? 'bg-white shadow-md text-brand-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student
          </button>
        </div>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-slate-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@school.edu"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-slate-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white py-4 rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all shadow-lg hover:shadow-xl mt-6"
          >
            Enter System
          </button>
        </form>
        
        <p className="text-center text-slate-500 mt-6 text-sm">
          Powered by Advanced Machine Learning
        </p>
      </div>
    </div>
  );
}
