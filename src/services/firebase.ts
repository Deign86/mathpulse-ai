/**
 * MathPulse AI - Firebase Configuration
 * Initializes Firebase and exports services
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, query, where, orderBy, limit, Timestamp, deleteDoc, onSnapshot, writeBatch } from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  deleteUser,
  updatePassword,
  updateEmail
} from 'firebase/auth';
import { Student, RiskLevel, ChatMessage, Module, SystemSettings, Activity, Classroom } from '../types';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfRTTSiCT4HCD09qz2B-Dbl7aTQPIWSXI",
  authDomain: "mathpulse-ai-edu.firebaseapp.com",
  projectId: "mathpulse-ai-edu",
  storageBucket: "mathpulse-ai-edu.firebasestorage.app",
  messagingSenderId: "384967168096",
  appId: "1:384967168096:web:23bd219f6d3750a403f305"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Collection references
const COLLECTIONS = {
  students: 'students',
  chatHistory: 'chatHistory',
  learningProgress: 'learningProgress',
  modules: 'modules',
  classrooms: 'classrooms',
  analytics: 'analytics',
  users: 'users',
  studentProgress: 'studentProgress', // XP, levels, streaks
  achievements: 'achievements',
  systemSettings: 'systemSettings',
  announcements: 'announcements',
  activities: 'activities' // Live classroom pulse
};

// User profile interface
export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  name: string;
  avatar: string;
  department?: string;
  gradeLevel?: string;
  classroomId?: string;
  studentId?: string;
  createdAt: Date;
  lastLogin?: Date;
}

/**
 * Authentication Service - Firebase Auth integration
 */
export const authService = {
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ user: FirebaseUser; profile: UserProfile } | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const profile = await this.getUserProfile(userCredential.user.uid);
      if (profile) {
        // Update lastLogin timestamp
        try {
          const userDocRef = doc(db, COLLECTIONS.users, userCredential.user.uid);
          await updateDoc(userDocRef, { lastLogin: Timestamp.now() });
        } catch (updateError) {
          console.warn('Could not update lastLogin:', updateError);
        }
        return { user: userCredential.user, profile };
      }
      return null;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  },

  // Subscribe to auth state changes
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // Get user profile from Firestore
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, COLLECTIONS.users, uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  // Create user profile in Firestore
  async createUserProfile(uid: string, profile: Omit<UserProfile, 'uid' | 'createdAt'>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.users, uid);
      await setDoc(docRef, {
        uid,
        ...profile,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  // Create new user with email and password (for admin use)
  async createUser(email: string, password: string, profile: Omit<UserProfile, 'uid' | 'createdAt'>): Promise<FirebaseUser | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: profile.name });
      await this.createUserProfile(userCredential.user.uid, profile);
      return userCredential.user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
};

/**
 * Student Service - CRUD operations for students
 */
export const studentService = {
  // Get all students
  async getAll(): Promise<Student[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.students));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Student));
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  },

  // Get students by classroom
  async getByClassroom(classroomId: string): Promise<Student[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.students),
        where('classroomId', '==', classroomId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Student));
    } catch (error) {
      console.error('Error fetching students by classroom:', error);
      return [];
    }
  },

  // Get single student
  async getById(studentId: string): Promise<Student | null> {
    try {
      const docRef = doc(db, COLLECTIONS.students, studentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Student;
      }
      return null;
    } catch (error) {
      console.error('Error fetching student:', error);
      return null;
    }
  },

  // Create or update student
  async save(student: Student): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.students, student.id);
      await setDoc(docRef, {
        name: student.name,
        avatar: student.avatar,
        riskLevel: student.riskLevel,
        engagementScore: student.engagementScore,
        avgQuizScore: student.avgQuizScore,
        weakestTopic: student.weakestTopic,
        classroomId: student.classroomId,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error saving student:', error);
      throw error;
    }
  },

  // Update student risk level
  async updateRiskLevel(studentId: string, riskLevel: RiskLevel): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.students, studentId);
      await updateDoc(docRef, { 
        riskLevel,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating risk level:', error);
      throw error;
    }
  }
};

/**
 * Chat History Service - Store and retrieve AI tutor conversations
 */
export const chatService = {
  // Save a chat message
  async saveMessage(studentId: string, message: ChatMessage): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.chatHistory), {
        studentId,
        sender: message.sender,
        message: message.message,
        timestamp: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving chat message:', error);
      throw error;
    }
  },

  // Get chat history for a student
  async getHistory(studentId: string, limitCount: number = 50): Promise<ChatMessage[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.chatHistory),
        where('studentId', '==', studentId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          sender: data.sender,
          message: data.message,
          timestamp: data.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } as ChatMessage;
      }).reverse(); // Reverse to get chronological order
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  },

  // Clear chat history for a student
  async clearHistory(studentId: string): Promise<void> {
    try {
      const q = query(
        collection(db, COLLECTIONS.chatHistory),
        where('studentId', '==', studentId)
      );
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(doc => 
        import('firebase/firestore').then(({ deleteDoc }) => deleteDoc(doc.ref))
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  }
};

/**
 * Learning Progress Service - Track module completion and progress
 */
export const progressService = {
  // Record module completion
  async recordCompletion(studentId: string, moduleId: string, score?: number): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.learningProgress, `${studentId}_${moduleId}`);
      await setDoc(docRef, {
        studentId,
        moduleId,
        completed: true,
        completedAt: Timestamp.now(),
        score: score || null
      });
    } catch (error) {
      console.error('Error recording completion:', error);
      throw error;
    }
  },

  // Get student's completed modules
  async getCompletedModules(studentId: string): Promise<string[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.learningProgress),
        where('studentId', '==', studentId),
        where('completed', '==', true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data().moduleId);
    } catch (error) {
      console.error('Error fetching completed modules:', error);
      return [];
    }
  },

  // Get student's overall progress percentage
  async getProgressPercentage(studentId: string, totalModules: number): Promise<number> {
    try {
      const completed = await this.getCompletedModules(studentId);
      return Math.round((completed.length / totalModules) * 100);
    } catch (error) {
      console.error('Error calculating progress:', error);
      return 0;
    }
  }
};

/**
 * Analytics Service - Store and retrieve learning analytics
 */
export const analyticsService = {
  // Log a learning event
  async logEvent(studentId: string, eventType: string, data: Record<string, unknown>): Promise<void> {
    try {
      await addDoc(collection(db, COLLECTIONS.analytics), {
        studentId,
        eventType,
        data,
        timestamp: Timestamp.now()
      });
    } catch (error) {
      console.error('Error logging analytics event:', error);
    }
  },

  // Get student engagement metrics
  async getEngagementMetrics(studentId: string, days: number = 7): Promise<{
    totalSessions: number;
    avgSessionDuration: number;
    modulesCompleted: number;
  }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const q = query(
        collection(db, COLLECTIONS.analytics),
        where('studentId', '==', studentId),
        where('timestamp', '>=', Timestamp.fromDate(startDate))
      );
      const querySnapshot = await getDocs(q);
      
      const events = querySnapshot.docs.map(doc => doc.data());
      const sessions = events.filter(e => e.eventType === 'session_start').length;
      const completions = events.filter(e => e.eventType === 'module_complete').length;
      
      return {
        totalSessions: sessions,
        avgSessionDuration: sessions > 0 ? Math.round(events.length / sessions * 5) : 0, // Estimate
        modulesCompleted: completions
      };
    } catch (error) {
      console.error('Error fetching engagement metrics:', error);
      return { totalSessions: 0, avgSessionDuration: 0, modulesCompleted: 0 };
    }
  }
};

// Export Firebase instances
export { app, db, auth };

// Re-export types
export type { FirebaseUser };
// ============ STUDENT PROGRESS SERVICE (XP, Levels, Streaks) ============

export interface StudentProgressData {
  odIndex: string;
  xp: number;
  level: number;
  streak: number;
  lastLoginDate: string; // ISO date string YYYY-MM-DD
  totalModulesCompleted: number;
  totalQuizzesPassed: number;
  totalVideoWatched: number;
  totalExercisesCompleted: number;
  highestQuizScore: number;
  updatedAt: Date;
}

export const studentProgressService = {
  // Get student progress
  async getProgress(studentId: string): Promise<StudentProgressData | null> {
    try {
      const docRef = doc(db, COLLECTIONS.studentProgress, studentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as StudentProgressData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching student progress:', error);
      return null;
    }
  },

  // Initialize progress for new student
  async initializeProgress(studentId: string): Promise<StudentProgressData> {
    const today = new Date().toISOString().split('T')[0];
    const initialProgress: StudentProgressData = {
      odIndex: studentId,
      xp: 0,
      level: 1,
      streak: 1,
      lastLoginDate: today,
      totalModulesCompleted: 0,
      totalQuizzesPassed: 0,
      totalVideoWatched: 0,
      totalExercisesCompleted: 0,
      highestQuizScore: 0,
      updatedAt: new Date()
    };
    
    try {
      const docRef = doc(db, COLLECTIONS.studentProgress, studentId);
      await setDoc(docRef, {
        ...initialProgress,
        updatedAt: Timestamp.now()
      });
      return initialProgress;
    } catch (error) {
      console.error('Error initializing progress:', error);
      throw error;
    }
  },

  // Add XP and check for level up
  async addXP(studentId: string, xpAmount: number): Promise<{ newXP: number; newLevel: number; leveledUp: boolean }> {
    try {
      let progress = await this.getProgress(studentId);
      if (!progress) {
        progress = await this.initializeProgress(studentId);
      }

      const newXP = progress.xp + xpAmount;
      // Level formula: level = floor(sqrt(xp / 100)) + 1
      const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
      const leveledUp = newLevel > progress.level;

      const docRef = doc(db, COLLECTIONS.studentProgress, studentId);
      await updateDoc(docRef, {
        xp: newXP,
        level: newLevel,
        updatedAt: Timestamp.now()
      });

      return { newXP, newLevel, leveledUp };
    } catch (error) {
      console.error('Error adding XP:', error);
      throw error;
    }
  },

  // Update streak on login
  async updateStreak(studentId: string): Promise<{ streak: number; streakBroken: boolean }> {
    try {
      let progress = await this.getProgress(studentId);
      if (!progress) {
        progress = await this.initializeProgress(studentId);
        return { streak: 1, streakBroken: false };
      }

      const today = new Date().toISOString().split('T')[0];
      const lastLogin = new Date(progress.lastLoginDate);
      const todayDate = new Date(today);
      
      // Calculate day difference
      const diffTime = todayDate.getTime() - lastLogin.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let newStreak = progress.streak;
      let streakBroken = false;

      if (diffDays === 0) {
        // Same day, no change
      } else if (diffDays === 1) {
        // Consecutive day, increment streak
        newStreak = progress.streak + 1;
      } else {
        // Streak broken, reset to 1
        newStreak = 1;
        streakBroken = true;
      }

      const docRef = doc(db, COLLECTIONS.studentProgress, studentId);
      await updateDoc(docRef, {
        streak: newStreak,
        lastLoginDate: today,
        updatedAt: Timestamp.now()
      });

      return { streak: newStreak, streakBroken };
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  },

  // Record module completion stats
  async recordModuleCompletion(studentId: string, moduleType: 'video' | 'quiz' | 'exercise', score?: number): Promise<void> {
    try {
      let progress = await this.getProgress(studentId);
      if (!progress) {
        progress = await this.initializeProgress(studentId);
      }

      const updates: Partial<StudentProgressData> = {
        totalModulesCompleted: progress.totalModulesCompleted + 1
      };

      if (moduleType === 'video') {
        updates.totalVideoWatched = progress.totalVideoWatched + 1;
      } else if (moduleType === 'quiz') {
        updates.totalQuizzesPassed = progress.totalQuizzesPassed + 1;
        if (score && score > progress.highestQuizScore) {
          updates.highestQuizScore = score;
        }
      } else if (moduleType === 'exercise') {
        updates.totalExercisesCompleted = progress.totalExercisesCompleted + 1;
      }

      const docRef = doc(db, COLLECTIONS.studentProgress, studentId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error recording module completion:', error);
      throw error;
    }
  }
};

// ============ ACHIEVEMENT SERVICE ============

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'quiz' | 'social';
  requirement: {
    type: 'modules_completed' | 'streak_days' | 'quiz_score' | 'videos_watched' | 'exercises_completed' | 'level_reached' | 'xp_earned';
    value: number;
  };
}

export interface UnlockedAchievement {
  odIndex: string;
  achievementId: string;
  unlockedAt: Date;
}

// Predefined achievements
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-steps', title: 'First Steps', description: 'Complete your first video lesson', icon: 'star', category: 'learning', requirement: { type: 'videos_watched', value: 1 } },
  { id: 'quiz-master', title: 'Quiz Master', description: 'Score 100% on any quiz', icon: 'trophy', category: 'quiz', requirement: { type: 'quiz_score', value: 100 } },
  { id: 'week-warrior', title: 'Week Warrior', description: 'Maintain a 7-day login streak', icon: 'flame', category: 'streak', requirement: { type: 'streak_days', value: 7 } },
  { id: 'practice-perfect', title: 'Practice Makes Perfect', description: 'Complete 10 exercise sets', icon: 'target', category: 'learning', requirement: { type: 'exercises_completed', value: 10 } },
  { id: 'knowledge-seeker', title: 'Knowledge Seeker', description: 'Watch 20 video lessons', icon: 'award', category: 'learning', requirement: { type: 'videos_watched', value: 20 } },
  { id: 'speed-learner', title: 'Speed Learner', description: 'Complete 5 modules total', icon: 'zap', category: 'learning', requirement: { type: 'modules_completed', value: 5 } },
  { id: 'crown-achiever', title: 'Crown Achiever', description: 'Reach Level 10', icon: 'crown', category: 'learning', requirement: { type: 'level_reached', value: 10 } },
  { id: 'xp-hunter', title: 'XP Hunter', description: 'Earn 1000 XP', icon: 'medal', category: 'learning', requirement: { type: 'xp_earned', value: 1000 } },
  { id: 'two-week-streak', title: 'Dedicated Learner', description: 'Maintain a 14-day streak', icon: 'flame', category: 'streak', requirement: { type: 'streak_days', value: 14 } },
  { id: 'month-streak', title: 'Monthly Champion', description: 'Maintain a 30-day streak', icon: 'crown', category: 'streak', requirement: { type: 'streak_days', value: 30 } },
];

export const achievementService = {
  // Get all unlocked achievements for a student
  async getUnlockedAchievements(studentId: string): Promise<string[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.achievements),
        where('studentId', '==', studentId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data().achievementId);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  },

  // Check and unlock achievements based on progress
  async checkAndUnlockAchievements(studentId: string, progress: StudentProgressData): Promise<string[]> {
    try {
      const unlockedIds = await this.getUnlockedAchievements(studentId);
      const newlyUnlocked: string[] = [];

      for (const achievement of ACHIEVEMENTS) {
        if (unlockedIds.includes(achievement.id)) continue;

        let earned = false;
        switch (achievement.requirement.type) {
          case 'videos_watched':
            earned = progress.totalVideoWatched >= achievement.requirement.value;
            break;
          case 'modules_completed':
            earned = progress.totalModulesCompleted >= achievement.requirement.value;
            break;
          case 'exercises_completed':
            earned = progress.totalExercisesCompleted >= achievement.requirement.value;
            break;
          case 'streak_days':
            earned = progress.streak >= achievement.requirement.value;
            break;
          case 'quiz_score':
            earned = progress.highestQuizScore >= achievement.requirement.value;
            break;
          case 'level_reached':
            earned = progress.level >= achievement.requirement.value;
            break;
          case 'xp_earned':
            earned = progress.xp >= achievement.requirement.value;
            break;
        }

        if (earned) {
          await addDoc(collection(db, COLLECTIONS.achievements), {
            studentId,
            achievementId: achievement.id,
            unlockedAt: Timestamp.now()
          });
          newlyUnlocked.push(achievement.id);
        }
      }

      return newlyUnlocked;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  },

  // Get achievement details with unlock status for display
  getAchievementsWithStatus(unlockedIds: string[], progress: StudentProgressData): Array<Achievement & { unlocked: boolean; progress?: number; maxProgress?: number }> {
    return ACHIEVEMENTS.map(achievement => {
      const unlocked = unlockedIds.includes(achievement.id);
      let currentProgress: number | undefined;
      
      if (!unlocked) {
        switch (achievement.requirement.type) {
          case 'videos_watched':
            currentProgress = progress.totalVideoWatched;
            break;
          case 'modules_completed':
            currentProgress = progress.totalModulesCompleted;
            break;
          case 'exercises_completed':
            currentProgress = progress.totalExercisesCompleted;
            break;
          case 'streak_days':
            currentProgress = progress.streak;
            break;
          case 'level_reached':
            currentProgress = progress.level;
            break;
          case 'xp_earned':
            currentProgress = progress.xp;
            break;
        }
      }

      return {
        ...achievement,
        unlocked,
        progress: currentProgress,
        maxProgress: achievement.requirement.value
      };
    });
  }
};

// ============ SYSTEM SETTINGS SERVICE ============

const DEFAULT_SETTINGS: SystemSettings = {
  siteName: 'MathPulse AI',
  siteDescription: 'AI-Powered Mathematics Learning Platform',
  maintenanceMode: false,
  allowRegistration: true,
  maxStudentsPerClass: 40,
  sessionTimeout: 60,
  aiTutorEnabled: true,
  riskPredictionEnabled: true,
  autoBackupEnabled: true,
  emailNotificationsEnabled: true,
  defaultLanguage: 'en',
  academicYear: '2024-2025',
  semester: '1st Semester'
};

export const settingsService = {
  // Get system settings
  async getSettings(): Promise<SystemSettings> {
    try {
      const docRef = doc(db, COLLECTIONS.systemSettings, 'global');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { ...DEFAULT_SETTINGS, ...docSnap.data() } as SystemSettings;
      }
      // Initialize with defaults if not exists
      await this.saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  // Save system settings
  async saveSettings(settings: Partial<SystemSettings>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.systemSettings, 'global');
      await setDoc(docRef, {
        ...settings,
        updatedAt: Timestamp.now()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },

  // Subscribe to settings changes
  subscribeToSettings(callback: (settings: SystemSettings) => void): () => void {
    const docRef = doc(db, COLLECTIONS.systemSettings, 'global');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ ...DEFAULT_SETTINGS, ...docSnap.data() } as SystemSettings);
      } else {
        callback(DEFAULT_SETTINGS);
      }
    });
  }
};

// ============ ANNOUNCEMENTS SERVICE ============

export interface Announcement {
  id?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  targetType: 'all' | 'classroom' | 'student';
  targetId?: string; // classroomId or studentId if targeted
  authorId: string;
  authorName: string;
  createdAt: Date;
  expiresAt?: Date;
  read?: string[]; // Array of student IDs who read it
}

export const announcementService = {
  // Create announcement
  async create(announcement: Omit<Announcement, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.announcements), {
        ...announcement,
        createdAt: Timestamp.now(),
        read: []
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  },

  // Get announcements for a student
  async getForStudent(studentId: string, classroomId?: string): Promise<Announcement[]> {
    try {
      const announcements: Announcement[] = [];
      
      // Get global announcements
      const globalQuery = query(
        collection(db, COLLECTIONS.announcements),
        where('targetType', '==', 'all'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const globalSnap = await getDocs(globalQuery);
      globalSnap.docs.forEach(doc => {
        announcements.push({ id: doc.id, ...doc.data() } as Announcement);
      });

      // Get classroom announcements
      if (classroomId) {
        const classQuery = query(
          collection(db, COLLECTIONS.announcements),
          where('targetType', '==', 'classroom'),
          where('targetId', '==', classroomId),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const classSnap = await getDocs(classQuery);
        classSnap.docs.forEach(doc => {
          announcements.push({ id: doc.id, ...doc.data() } as Announcement);
        });
      }

      // Get personal announcements
      const personalQuery = query(
        collection(db, COLLECTIONS.announcements),
        where('targetType', '==', 'student'),
        where('targetId', '==', studentId),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const personalSnap = await getDocs(personalQuery);
      personalSnap.docs.forEach(doc => {
        announcements.push({ id: doc.id, ...doc.data() } as Announcement);
      });

      // Sort by date and filter expired
      const now = new Date();
      return announcements
        .filter(a => !a.expiresAt || new Date(a.expiresAt) > now)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }
  },

  // Get all announcements for teacher view
  async getAllForTeacher(authorId?: string): Promise<Announcement[]> {
    try {
      const q = authorId
        ? query(collection(db, COLLECTIONS.announcements), where('authorId', '==', authorId), orderBy('createdAt', 'desc'), limit(50))
        : query(collection(db, COLLECTIONS.announcements), orderBy('createdAt', 'desc'), limit(50));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }
  },

  // Mark announcement as read
  async markAsRead(announcementId: string, studentId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.announcements, announcementId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const read = data.read || [];
        if (!read.includes(studentId)) {
          await updateDoc(docRef, { read: [...read, studentId] });
        }
      }
    } catch (error) {
      console.error('Error marking announcement as read:', error);
    }
  },

  // Delete announcement
  async delete(announcementId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.announcements, announcementId));
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  }
};

// ============ ACTIVITY SERVICE (Real-time Dashboard) ============

export const activityService = {
  // Log an activity
  async logActivity(activity: Omit<Activity, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.activities), {
        ...activity,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  },

  // Get recent activities for a classroom
  async getRecentActivities(classroomId?: string, limitCount: number = 10): Promise<Activity[]> {
    try {
      const q = classroomId
        ? query(
            collection(db, COLLECTIONS.activities),
            where('classroomId', '==', classroomId),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
          )
        : query(
            collection(db, COLLECTIONS.activities),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
          );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate?.() || new Date();
        return {
          id: doc.id,
          studentName: data.studentName,
          action: data.action,
          timestamp: getRelativeTime(createdAt)
        } as Activity;
      });
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  },

  // Subscribe to real-time activities
  subscribeToActivities(classroomId: string | undefined, callback: (activities: Activity[]) => void): () => void {
    const q = classroomId
      ? query(
          collection(db, COLLECTIONS.activities),
          where('classroomId', '==', classroomId),
          orderBy('createdAt', 'desc'),
          limit(10)
        )
      : query(
          collection(db, COLLECTIONS.activities),
          orderBy('createdAt', 'desc'),
          limit(10)
        );

    return onSnapshot(q, (snapshot) => {
      const activities = snapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate?.() || new Date();
        return {
          id: doc.id,
          studentName: data.studentName,
          action: data.action,
          timestamp: getRelativeTime(createdAt)
        } as Activity;
      });
      callback(activities);
    });
  }
};

// Helper function for relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// ============ ADMIN USER MANAGEMENT SERVICE ============

export const adminUserService = {
  // Get all users
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.users));
      return querySnapshot.docs.map(doc => doc.data() as UserProfile);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  // Create new user (requires admin privileges in Firebase)
  async createUser(email: string, password: string, profile: Omit<UserProfile, 'uid' | 'createdAt'>): Promise<string> {
    try {
      // Note: In production, this should be done via Cloud Functions
      // For now, we'll create the profile in Firestore with a generated ID
      const docRef = await addDoc(collection(db, COLLECTIONS.users), {
        ...profile,
        email,
        pendingPassword: password, // Store temporarily for admin to communicate
        status: 'pending',
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUser(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.users, uid);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Update user status (active/inactive/suspended)
  async updateUserStatus(uid: string, status: 'active' | 'inactive' | 'suspended'): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.users, uid);
      await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  // Delete user profile (soft delete)
  async deleteUser(uid: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.users, uid);
      await updateDoc(docRef, {
        status: 'deleted',
        deletedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Bulk import users
  async bulkImportUsers(users: Array<{ email: string; name: string; role: 'teacher' | 'student'; classroomId?: string }>): Promise<{ success: number; failed: number }> {
    try {
      const batch = writeBatch(db);
      let success = 0;
      let failed = 0;

      for (const user of users) {
        try {
          const docRef = doc(collection(db, COLLECTIONS.users));
          batch.set(docRef, {
            uid: docRef.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
            classroomId: user.classroomId,
            status: 'pending',
            createdAt: Timestamp.now()
          });
          success++;
        } catch {
          failed++;
        }
      }

      await batch.commit();
      return { success, failed };
    } catch (error) {
      console.error('Error bulk importing users:', error);
      throw error;
    }
  },

  // Export users to array
  async exportUsers(role?: 'admin' | 'teacher' | 'student'): Promise<UserProfile[]> {
    try {
      const q = role
        ? query(collection(db, COLLECTIONS.users), where('role', '==', role))
        : query(collection(db, COLLECTIONS.users));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as UserProfile);
    } catch (error) {
      console.error('Error exporting users:', error);
      return [];
    }
  }
};

// ============ CLASSROOM SERVICE ============

export const classroomService = {
  // Get all classrooms
  async getAll(): Promise<Classroom[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.classrooms));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Classroom));
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      return [];
    }
  },

  // Get single classroom
  async getById(classroomId: string): Promise<Classroom | null> {
    try {
      const docRef = doc(db, COLLECTIONS.classrooms, classroomId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Classroom;
      }
      return null;
    } catch (error) {
      console.error('Error fetching classroom:', error);
      return null;
    }
  },

  // Get classrooms by teacher
  async getByTeacher(teacherId: string): Promise<Classroom[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.classrooms),
        where('teacherId', '==', teacherId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Classroom));
    } catch (error) {
      console.error('Error fetching teacher classrooms:', error);
      return [];
    }
  },

  // Create classroom
  async create(classroom: Omit<Classroom, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.classrooms), {
        ...classroom,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating classroom:', error);
      throw error;
    }
  },

  // Update classroom
  async update(classroomId: string, updates: Partial<Classroom>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.classrooms, classroomId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating classroom:', error);
      throw error;
    }
  },

  // Delete classroom
  async delete(classroomId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.classrooms, classroomId));
    } catch (error) {
      console.error('Error deleting classroom:', error);
      throw error;
    }
  },

  // Seed classrooms from mock data (for initial setup)
  async seedFromMockData(classrooms: Classroom[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      for (const classroom of classrooms) {
        const docRef = doc(db, COLLECTIONS.classrooms, classroom.id);
        batch.set(docRef, {
          name: classroom.name,
          section: classroom.section,
          gradeLevel: classroom.gradeLevel,
          schedule: classroom.schedule,
          studentCount: classroom.studentCount,
          semester: classroom.semester,
          academicYear: classroom.academicYear,
          room: classroom.room,
          createdAt: Timestamp.now()
        });
      }
      await batch.commit();
    } catch (error) {
      console.error('Error seeding classrooms:', error);
      throw error;
    }
  }
};

// ============ MODULE CONTENT SERVICE ============

export interface ModuleContent {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'quiz' | 'exercise';
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  status: 'draft' | 'published' | 'archived';
  createdBy: string;
  content: {
    videoUrl?: string;
    questions?: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
    }>;
    exercises?: Array<{
      problem: string;
      hint?: string;
      solution: string;
    }>;
  };
  assignedClassrooms: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export const moduleService = {
  // Get all modules
  async getAll(): Promise<ModuleContent[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.modules));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ModuleContent));
    } catch (error) {
      console.error('Error fetching modules:', error);
      return [];
    }
  },

  // Get modules by classroom
  async getByClassroom(classroomId: string): Promise<ModuleContent[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.modules),
        where('assignedClassrooms', 'array-contains', classroomId),
        where('status', '==', 'published')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ModuleContent));
    } catch (error) {
      console.error('Error fetching classroom modules:', error);
      return [];
    }
  },

  // Get single module
  async getById(moduleId: string): Promise<ModuleContent | null> {
    try {
      const docRef = doc(db, COLLECTIONS.modules, moduleId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ModuleContent;
      }
      return null;
    } catch (error) {
      console.error('Error fetching module:', error);
      return null;
    }
  },

  // Create module
  async create(module: Omit<ModuleContent, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.modules), {
        ...module,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating module:', error);
      throw error;
    }
  },

  // Update module
  async update(moduleId: string, updates: Partial<ModuleContent>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.modules, moduleId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating module:', error);
      throw error;
    }
  },

  // Delete module
  async delete(moduleId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.modules, moduleId));
    } catch (error) {
      console.error('Error deleting module:', error);
      throw error;
    }
  },

  // Update module status
  async updateStatus(moduleId: string, status: 'draft' | 'published' | 'archived'): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.modules, moduleId);
      await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating module status:', error);
      throw error;
    }
  }
};