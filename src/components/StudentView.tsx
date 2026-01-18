import { useState } from 'react';
import { BrainCircuit, FileVideo, FileQuestion, FileText, Send, User, CheckCircle, Clock, LogOut, Star, Trophy, MessageSquare, X, ChevronDown, ChevronUp } from 'lucide-react';
import { mockModules, mockChatMessages } from '../utils/mockData';
import { Module, ChatMessage } from '../types';
import { ProfileEditModal } from './ProfileEditModal';
import { RewardSystem } from './RewardSystem';
import { ModuleContent } from './ModuleContent';

interface StudentViewProps {
  onLogout: () => void;
}

export function StudentView({ onLogout }: StudentViewProps) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'modules' | 'chat'>('modules');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [studentAvatar, setStudentAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Alex');
  const [studentName, setStudentName] = useState('Alex Johnson');
  const [viewingModuleContent, setViewingModuleContent] = useState(false);
  
  // XP and Rewards Data
  const [xp, setXp] = useState(850);
  const [level, setLevel] = useState(4);
  const [streak, setStreak] = useState(7);

  const handleProfileSave = (newAvatar: string, newName: string) => {
    setStudentAvatar(newAvatar);
    setStudentName(newName);
  };

  const handleModuleClick = (module: Module) => {
    setSelectedModule(module);
    setViewingModuleContent(true);
  };

  const handleModuleComplete = () => {
    // Award XP based on module type
    const xpReward = selectedModule?.type === 'video' ? 50 : 
                     selectedModule?.type === 'quiz' ? 75 : 100;
    setXp(prev => prev + xpReward);
    
    // Mark module as complete (in real app, this would update backend)
    setViewingModuleContent(false);
    setSelectedModule(null);
  };

  const handleBackToModules = () => {
    setViewingModuleContent(false);
  };

  const achievements = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first video lesson',
      icon: 'star',
      unlocked: true
    },
    {
      id: '2',
      title: 'Quiz Master',
      description: 'Score 100% on any quiz',
      icon: 'trophy',
      unlocked: true
    },
    {
      id: '3',
      title: 'Week Warrior',
      description: 'Maintain a 7-day login streak',
      icon: 'flame',
      unlocked: true
    },
    {
      id: '4',
      title: 'Practice Makes Perfect',
      description: 'Complete 10 exercise sets',
      icon: 'target',
      unlocked: false,
      progress: 6,
      maxProgress: 10
    },
    {
      id: '5',
      title: 'Knowledge Seeker',
      description: 'Watch 20 video lessons',
      icon: 'award',
      unlocked: false,
      progress: 12,
      maxProgress: 20
    },
    {
      id: '6',
      title: 'Speed Learner',
      description: 'Complete 3 modules in one day',
      icon: 'zap',
      unlocked: false,
      progress: 1,
      maxProgress: 3
    },
    {
      id: '7',
      title: 'Crown Achiever',
      description: 'Reach Level 10',
      icon: 'crown',
      unlocked: false,
      progress: 4,
      maxProgress: 10
    },
    {
      id: '8',
      title: 'Medal of Honor',
      description: 'Help 5 classmates through AI tutor',
      icon: 'medal',
      unlocked: false,
      progress: 2,
      maxProgress: 5
    }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        message: "I understand you're working on that. Let me help you break it down step by step...",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getModuleIcon = (type: Module['type']) => {
    switch (type) {
      case 'video': return FileVideo;
      case 'quiz': return FileQuestion;
      case 'exercise': return FileText;
    }
  };

  const progress = 70; // Overall progress percentage
  const completedModules = mockModules.filter(m => m.completed).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-brand-500 to-brand-900 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900">MathPulse AI</h1>
              <p className="text-sm text-slate-500">Student Learning Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* XP Display */}
            <button
              onClick={() => setIsRewardsOpen(true)}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-lg hover:from-yellow-500 hover:to-amber-600 transition-all shadow-md hover:shadow-lg"
            >
              <Star className="w-4 h-4" />
              <div className="text-left">
                <p className="text-xs">Level {level}</p>
                <p className="text-sm">{xp} XP</p>
              </div>
            </button>
            
            <div className="text-right hidden md:block">
              <p className="text-sm text-slate-900">{studentName}</p>
              <p className="text-xs text-slate-500">Grade 11 - Math</p>
            </div>
            
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-10 h-10 rounded-full overflow-hidden hover:ring-2 hover:ring-brand-500 transition-all cursor-pointer"
            >
              <img src={studentAvatar} alt={studentName} className="w-full h-full" />
            </button>
            
            <button
              onClick={() => setIsRewardsOpen(true)}
              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="View Rewards"
            >
              <Trophy className="w-5 h-5" />
            </button>
            
            <button
              onClick={onLogout}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('modules')}
            className={`flex-1 py-2 px-4 rounded-lg transition-all ${
              activeTab === 'modules'
                ? 'bg-brand-500 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Modules
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 px-4 rounded-lg transition-all ${
              activeTab === 'chat'
                ? 'bg-brand-500 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            AI Tutor
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 relative">
        {viewingModuleContent && selectedModule ? (
          /* Module Content View - Full Width */
          <>
            <div className="relative">
              <ModuleContent
                module={selectedModule}
                onComplete={handleModuleComplete}
                onBack={handleBackToModules}
              />
            </div>
            
            {/* Floating Chat Button */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="fixed bottom-6 right-6 bg-gradient-to-r from-brand-500 to-brand-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40"
            >
              {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </button>
            
            {/* Floating Chat Window */}
            {isChatOpen && (
              <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-xl shadow-2xl border border-slate-200 z-40 flex flex-col h-[500px]">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-4 rounded-t-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <BrainCircuit className="w-5 h-5" />
                    <h4 className="text-white">AI Math Tutor</h4>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-brand-500 text-white'
                            : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-white/75' : 'text-slate-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about this lesson..."
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="bg-brand-500 text-white px-3 py-2 rounded-lg hover:bg-brand-600 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Homepage View - Spacious Single Column */}
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Hero Section */}
              <div className="bg-gradient-to-br from-brand-500 to-brand-900 rounded-xl p-8 text-white shadow-lg">
                <h2 className="text-white mb-2">Remedial Focus</h2>
                <p className="text-white/90 text-xl mb-6">Master Calculus: Derivatives</p>
                
                {/* Circular Progress */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="white"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white">{progress}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-white/90 mb-2">Your Progress</p>
                    <p className="text-sm text-white/75">{completedModules} of {mockModules.length} modules completed</p>
                    <p className="text-sm text-white/75 mt-2">Keep going! You're doing great.</p>
                  </div>
                </div>
              </div>

              {/* Module List */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-slate-900 mb-4">Recommended Learning Modules</h3>
                <div className="space-y-3">
                  {mockModules.map((module) => {
                    const Icon = getModuleIcon(module.type);
                    return (
                      <div
                        key={module.id}
                        onClick={() => handleModuleClick(module)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                          selectedModule?.id === module.id
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-slate-200 hover:border-brand-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            module.type === 'video' ? 'bg-purple-100' :
                            module.type === 'quiz' ? 'bg-green-100' :
                            'bg-blue-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              module.type === 'video' ? 'text-purple-600' :
                              module.type === 'quiz' ? 'text-green-600' :
                              'text-blue-600'
                            }`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-slate-900">{module.title}</p>
                              {module.completed && (
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded capitalize">
                                {module.type}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock className="w-3 h-3" />
                                {module.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Module Detail */}
              {selectedModule && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-slate-900 mb-4">Module Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Title</p>
                      <p className="text-slate-900">{selectedModule.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Type</p>
                      <p className="text-slate-900 capitalize">{selectedModule.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Duration</p>
                      <p className="text-slate-900">{selectedModule.duration}</p>
                    </div>
                    <button className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white py-3 rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all shadow-md hover:shadow-lg">
                      {selectedModule.completed ? 'Review Module' : 'Start Module'}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Floating Chat Button - Homepage */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="fixed bottom-6 right-6 bg-gradient-to-r from-brand-500 to-brand-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40 group"
            >
              {isChatOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <>
                  <MessageSquare className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                </>
              )}
            </button>
            
            {/* Floating Chat Window - Homepage */}
            {isChatOpen && (
              <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-xl shadow-2xl border border-slate-200 z-40 flex flex-col h-[600px]">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-4 rounded-t-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <BrainCircuit className="w-5 h-5" />
                    <div>
                      <h4 className="text-white">AI Math Tutor</h4>
                      <p className="text-xs text-white/75">Online • Ready to help</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-brand-500 text-white'
                            : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-white/75' : 'text-slate-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask a question about derivatives..."
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="bg-brand-500 text-white px-3 py-2 rounded-lg hover:bg-brand-600 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentAvatar={studentAvatar}
        name={studentName}
        role="student"
        email="alex.johnson@school.edu"
        onSave={handleProfileSave}
      />
      
      {/* Rewards System Modal */}
      {isRewardsOpen && (
        <RewardSystem
          xp={xp}
          level={level}
          streak={streak}
          achievements={achievements}
          onClose={() => setIsRewardsOpen(false)}
        />
      )}
      
      {/* Module Content Modal */}
      {viewingModuleContent && selectedModule && (
        <ModuleContent
          module={selectedModule}
          onComplete={handleModuleComplete}
          onBack={handleBackToModules}
        />
      )}
    </div>
  );
}