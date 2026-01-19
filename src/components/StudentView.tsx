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
  moduleService,
  ModuleContent,
  Announcement
} from '../services/firebase';
import { UserAccount } from '../utils/demoAccounts';
import { ProfileEditModal } from './ProfileEditModal';
import { RewardSystem } from './RewardSystem';
import { ModuleContent as ModuleContentComponent } from './ModuleContent';

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
  
  // Modules state (loaded from Firebase with mock fallback)
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>([]);

  // Load modules from Firebase
  useEffect(() => {
    const loadModules = async () => {
      try {
        setIsLoadingModules(true);
        // Try to load from Firebase modules collection
        const firebaseModules = await moduleService.getByClassroom(currentUser.classroomId || 'class-1');
        
        if (firebaseModules.length > 0) {
          // Convert ModuleContent to Module format
          const convertedModules: Module[] = firebaseModules.map(m => ({
            id: m.id,
            title: m.title,
            type: m.type,
            duration: m.duration,
            completed: completedModuleIds.includes(m.id)
          }));
          setModules(convertedModules);
        } else {
          // Fall back to mock modules
          setModules(mockModules);
        }
      } catch (error) {
        console.error('Error loading modules:', error);
        setModules(mockModules);
      } finally {
        setIsLoadingModules(false);
      }
    };
    loadModules();
  }, [currentUser.classroomId, completedModuleIds]);

  // Load completed modules from progress service
  useEffect(() => {
    const loadCompletedModules = async () => {
      try {
        const completed = await progressService.getCompletedModules(academicStudentId);
        setCompletedModuleIds(completed);
      } catch (error) {
        console.error('Error loading completed modules:', error);
      }
    };
    loadCompletedModules();
  }, [academicStudentId]);

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

  // Calculate progress based on completed modules
  const completedModulesCount = modules.filter(m => m.completed || completedModuleIds.includes(m.id)).length;
  const progress = modules.length > 0 ? Math.round((completedModulesCount / modules.length) * 100) : 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-primary-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg blur opacity-50"></div>
              <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-lg shadow-md">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-gradient font-bold text-lg">MathPulse AI</h1>
              <p className="text-sm text-slate-500">Student Learning Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* XP Display */}
            <button
              onClick={() => setIsRewardsOpen(true)}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-2 rounded-xl hover:from-accent-400 hover:to-accent-500 transition-all shadow-lg shadow-accent-500/25 cursor-pointer"
            >
              <Star className="w-4 h-4" />
              <div className="text-left">
                <p className="text-xs text-white/80">Level {level}</p>
                <p className="text-sm font-semibold">{xp} XP</p>
              </div>
            </button>
            
            <div className="text-right hidden md:block">
              <p className="text-sm text-slate-800 font-medium">{studentName}</p>
              <p className="text-xs text-slate-500">Grade 11 - Math</p>
            </div>
            
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary-200 hover:ring-primary-400 transition-all cursor-pointer"
            >
              <img src={studentAvatar} alt={studentName} className="w-full h-full" />
            </button>
            
            <button
              onClick={() => setIsRewardsOpen(true)}
              className="p-2 text-accent-500 hover:bg-accent-50 rounded-lg transition-colors cursor-pointer"
              title="View Rewards"
            >
              <Trophy className="w-5 h-5" />
            </button>
            
            <button
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-primary-100 px-4 py-2">
        <div className="flex gap-2 p-1 bg-primary-50 rounded-xl border border-primary-100">
          <button
            onClick={() => setActiveTab('modules')}
            className={`flex-1 py-2 px-4 rounded-lg transition-all cursor-pointer ${
              activeTab === 'modules'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-white hover:text-primary-600'
            }`}
          >
            Modules
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 px-4 rounded-lg transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-white hover:text-primary-600'
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
              <ModuleContentComponent
                module={selectedModule}
                onComplete={handleModuleComplete}
                onBack={handleBackToModules}
              />
            </div>
            
            {/* Floating Chat Button */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="fixed bottom-6 right-6 bg-gradient-to-r from-primary-500 to-accent-500 text-white p-4 rounded-full shadow-lg shadow-primary-500/30 hover:shadow-xl transition-all hover:scale-110 z-40 cursor-pointer"
            >
              {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </button>
            
            {/* Floating Chat Window */}
            {isChatOpen && (
              <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] glass-card z-40 flex flex-col h-[500px] border border-white/10">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 rounded-t-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <BrainCircuit className="w-5 h-5" />
                    <h4 className="text-white font-semibold">AI Math Tutor</h4>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream-100/90">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-xl p-3 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                            : 'bg-white border border-primary-100 text-slate-700 shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-white/60' : 'text-slate-400'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="border-t border-primary-100 p-3 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about this lesson..."
                      disabled={isChatLoading}
                      className="flex-1 px-3 py-2 text-sm bg-primary-50 border border-primary-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-primary-100"
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-2 rounded-xl hover:from-primary-400 hover:to-primary-500 transition-colors disabled:opacity-50 cursor-pointer"
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
              <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-2xl p-8 text-white shadow-xl shadow-primary-500/20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="relative">
                  <h2 className="text-white/90 text-sm font-medium mb-2">Remedial Focus</h2>
                  <p className="text-white text-2xl font-bold mb-6">Master Calculus: Derivatives</p>
                  
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
                          stroke="url(#progressGradient)"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FF6648" />
                            <stop offset="100%" stopColor="#FFE1D7" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{progress}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-white/90 mb-2">Your Progress</p>
                      <p className="text-sm text-white/70">{completedModulesCount} of {modules.length} modules completed</p>
                      <p className="text-sm text-accent-200 mt-2">Keep going! You're doing great.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Module List */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-100">
                <h3 className="text-slate-800 font-semibold mb-4">Recommended Learning Modules</h3>
                <div className="space-y-3">
                  {modules.map((module) => {
                    const Icon = getModuleIcon(module.type);
                    const isCompleted = module.completed || completedModuleIds.includes(module.id);
                    return (
                      <div
                        key={module.id}
                        onClick={() => handleModuleClick(module)}
                        className={`border rounded-xl p-4 cursor-pointer transition-all hover:bg-primary-50 ${
                          selectedModule?.id === module.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-primary-100 hover:border-primary-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl ${
                            module.type === 'video' ? 'bg-primary-100 border border-primary-200' :
                            module.type === 'quiz' ? 'bg-green-100 border border-green-200' :
                            'bg-accent-100 border border-accent-200'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              module.type === 'video' ? 'text-primary-600' :
                              module.type === 'quiz' ? 'text-green-600' :
                              'text-accent-600'
                            }`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-slate-800 font-medium">{module.title}</p>
                              {isCompleted && (
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs px-2 py-1 bg-primary-50 text-slate-600 rounded-lg capitalize border border-primary-100">
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
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-100">
                  <h3 className="text-slate-800 font-semibold mb-4">Module Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Title</p>
                      <p className="text-slate-800">{selectedModule.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Type</p>
                      <p className="text-slate-800 capitalize">{selectedModule.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Duration</p>
                      <p className="text-slate-800">{selectedModule.duration}</p>
                    </div>
                    <button className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 rounded-xl hover:from-primary-400 hover:to-accent-400 transition-all shadow-lg shadow-primary-500/20 font-medium cursor-pointer">
                      {selectedModule.completed ? 'Review Module' : 'Start Module'}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Floating Chat Button - Homepage */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="fixed bottom-6 right-6 bg-gradient-to-r from-primary-500 to-accent-500 text-white p-4 rounded-full shadow-lg shadow-primary-500/30 hover:shadow-xl transition-all hover:scale-110 z-40 group cursor-pointer"
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
              <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl z-40 flex flex-col h-[600px] border border-primary-100 overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <BrainCircuit className="w-5 h-5" />
                    <div>
                      <h4 className="text-white font-semibold">AI Math Tutor</h4>
                      <p className="text-xs text-white/70">Online • Ready to help</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-primary-50/50">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl p-3 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                            : 'bg-white text-slate-700 border border-primary-100 shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-white/60' : 'text-slate-400'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="border-t border-primary-100 p-4 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask a question about derivatives..."
                      className="flex-1 px-3 py-2 text-sm bg-primary-50 border border-primary-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-3 py-2 rounded-xl hover:from-primary-400 hover:to-accent-400 transition-colors cursor-pointer"
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