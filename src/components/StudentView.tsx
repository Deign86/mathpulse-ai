import { useState, useEffect } from 'react';
import { BrainCircuit, FileVideo, FileQuestion, FileText, Send, User, CheckCircle, Clock, LogOut, Star, Trophy, MessageSquare, X, ChevronDown, ChevronUp, Loader2, Bell } from 'lucide-react';
import { mockModules, mockChatMessages } from '../utils/mockData';
import { Module, ChatMessage } from '../types';
import { apiService } from '../services/api';
import { 
  chatService, 
  progressService, 
  analyticsService,
  studentProgressService,
  achievementService,
  ACHIEVEMENTS,
  StudentProgressData,
  activityService,
  announcementService,
  Announcement
} from '../services/firebase';
import { UserAccount } from '../utils/demoAccounts';
import { ProfileEditModal } from './ProfileEditModal';
import { RewardSystem } from './RewardSystem';
import { ModuleContent } from './ModuleContent';

interface StudentViewProps {
  onLogout: () => void;
  currentUser: UserAccount;
}

export function StudentView({ onLogout, currentUser }: StudentViewProps) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'modules' | 'chat'>('modules');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [studentAvatar, setStudentAvatar] = useState(currentUser.avatar);
  const [studentName, setStudentName] = useState(currentUser.name);
  const [viewingModuleContent, setViewingModuleContent] = useState(false);
  
  // Use Firebase UID for chat history (consistent across sessions)
  // Use studentId for academic data (links to student records)
  const chatUserId = currentUser.id; // Firebase UID
  const academicStudentId = currentUser.studentId || currentUser.id;
  
  // XP and Rewards Data (loaded from Firebase)
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [progressData, setProgressData] = useState<StudentProgressData | null>(null);
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<string[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [newAchievementToast, setNewAchievementToast] = useState<string | null>(null);

  // Load chat history from Firebase on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        console.log('Loading chat history for user:', chatUserId);
        const history = await chatService.getHistory(chatUserId);
        console.log('Chat history loaded:', history.length, 'messages');
        if (history.length > 0) {
          setChatMessages(history);
        }
        // Log session start for analytics
        analyticsService.logEvent(chatUserId, 'session_start', { timestamp: new Date().toISOString() });
      } catch (error) {
        console.warn('Could not load chat history from Firebase:', error);
      }
    };
    loadChatHistory();
  }, [chatUserId]);

  // Load progress data and achievements from Firebase
  useEffect(() => {
    const loadProgressAndAchievements = async () => {
      try {
        // Get or initialize progress
        let progress = await studentProgressService.getProgress(academicStudentId);
        if (!progress) {
          progress = await studentProgressService.initializeProgress(academicStudentId);
        }
        
        // Update streak on login
        const { streak: newStreak } = await studentProgressService.updateStreak(academicStudentId);
        progress.streak = newStreak;
        
        setProgressData(progress);
        setXp(progress.xp);
        setLevel(progress.level);
        setStreak(progress.streak);
        
        // Load unlocked achievements
        const unlockedIds = await achievementService.getUnlockedAchievements(academicStudentId);
        setUnlockedAchievementIds(unlockedIds);
        
        // Check for new achievements
        const newlyUnlocked = await achievementService.checkAndUnlockAchievements(academicStudentId, progress);
        if (newlyUnlocked.length > 0) {
          setUnlockedAchievementIds(prev => [...prev, ...newlyUnlocked]);
          // Show toast for first new achievement
          const achievement = ACHIEVEMENTS.find(a => a.id === newlyUnlocked[0]);
          if (achievement) {
            setNewAchievementToast(achievement.title);
            setTimeout(() => setNewAchievementToast(null), 5000);
          }
        }
        
        console.log('Progress loaded:', progress);
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };
    
    loadProgressAndAchievements();
  }, [academicStudentId]);

  // Load announcements
  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const studentAnnouncements = await announcementService.getForStudent(
          academicStudentId, 
          currentUser.classroomId
        );
        setAnnouncements(studentAnnouncements);
      } catch (error) {
        console.error('Error loading announcements:', error);
      }
    };
    loadAnnouncements();
  }, [academicStudentId, currentUser.classroomId]);

  const handleProfileSave = (newAvatar: string, newName: string) => {
    setStudentAvatar(newAvatar);
    setStudentName(newName);
  };

  const handleModuleClick = (module: Module) => {
    setSelectedModule(module);
    setViewingModuleContent(true);
  };

  const handleModuleComplete = async () => {
    // Award XP based on module type
    const xpReward = selectedModule?.type === 'video' ? 50 : 
                     selectedModule?.type === 'quiz' ? 75 : 100;
    
    // Record completion in Firebase with XP
    if (selectedModule) {
      try {
        // Add XP and update level
        const { newXP, newLevel, leveledUp } = await studentProgressService.addXP(academicStudentId, xpReward);
        setXp(newXP);
        setLevel(newLevel);
        
        if (leveledUp) {
          setNewAchievementToast(`Level Up! You're now Level ${newLevel}!`);
          setTimeout(() => setNewAchievementToast(null), 5000);
        }
        
        // Record module completion stats
        await studentProgressService.recordModuleCompletion(academicStudentId, selectedModule.type);
        
        // Record in learning progress
        await progressService.recordCompletion(academicStudentId, selectedModule.id);
        
        // Log activity for real-time dashboard
        await activityService.logActivity({
          studentName: currentUser.name,
          action: `Completed ${selectedModule.type}: ${selectedModule.title}`,
          timestamp: new Date().toLocaleTimeString(),
          classroomId: currentUser.classroomId
        });
        
        // Log analytics
        analyticsService.logEvent(academicStudentId, 'module_complete', { 
          moduleId: selectedModule.id, 
          type: selectedModule.type,
          xpAwarded: xpReward 
        });
        
        // Check for new achievements
        const progress = await studentProgressService.getProgress(academicStudentId);
        if (progress) {
          const newlyUnlocked = await achievementService.checkAndUnlockAchievements(academicStudentId, progress);
          if (newlyUnlocked.length > 0) {
            setUnlockedAchievementIds(prev => [...prev, ...newlyUnlocked]);
            const achievement = ACHIEVEMENTS.find(a => a.id === newlyUnlocked[0]);
            if (achievement) {
              setNewAchievementToast(`🏆 Achievement Unlocked: ${achievement.title}`);
              setTimeout(() => setNewAchievementToast(null), 5000);
            }
          }
          setProgressData(progress);
        }
      } catch (error) {
        console.warn('Could not record module completion:', error);
      }
    }
    
    setViewingModuleContent(false);
    setSelectedModule(null);
  };

  const handleBackToModules = () => {
    setViewingModuleContent(false);
  };

  // Build achievements list from Firebase data
  const achievements = progressData 
    ? achievementService.getAchievementsWithStatus(unlockedAchievementIds, progressData)
    : ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }));

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: userMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsChatLoading(true);

    // Save user message to Firebase using chatUserId
    try {
      await chatService.saveMessage(chatUserId, newMessage);
    } catch (error) {
      console.warn('Could not save message to Firebase:', error);
    }

    try {
      // Call the ML backend API for AI tutor response
      const response = await apiService.chat(userMessage, updatedMessages);
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        message: response.message,
        timestamp: response.timestamp
      };
      setChatMessages(prev => [...prev, aiResponse]);
      
      // Save AI response to Firebase
      try {
        await chatService.saveMessage(chatUserId, aiResponse);
      } catch (error) {
        console.warn('Could not save AI response to Firebase:', error);
      }
    } catch (error) {
      console.error('Chat API error:', error);
      // Fallback response on error
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        message: "I understand you're working on that. Let me help you break it down step by step...",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsChatLoading(false);
    }
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
                      disabled={isChatLoading}
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-slate-100"
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading}
                      className="bg-brand-500 text-white px-3 py-2 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
                    >
                      {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
    </div>
  );
}