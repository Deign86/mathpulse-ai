export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  riskLevel: RiskLevel;
  engagementScore: number;
  avgQuizScore: number;
  weakestTopic: string;
  classroomId: string;
}

export interface InterventionPlan {
  analysis: {
    core_issue: string;
    gaps: string[];
  };
  remedial_path: {
    step: number;
    topic: string;
    activityType: string;
  }[];
  strategies: {
    title: string;
    action: string;
    icon: string;
  }[];
}

export interface Activity {
  id: string;
  studentName: string;
  action: string;
  timestamp: string;
}

export interface Module {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'exercise';
  duration: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: string;
}

export interface ExternalLink {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'article' | 'interactive' | 'tutorial';
  topic: string;
  recommendedFor: string[]; // Student IDs
  aiReason: string;
  status: 'pending' | 'approved' | 'rejected';
  recommendedDate: string;
  source: string; // e.g., "YouTube", "Khan Academy", "Wikipedia"
}

export interface Classroom {
  id: string;
  name: string;
  section: string;
  gradeLevel: string;
  schedule: string;
  studentCount: number;
  semester: string;
  academicYear: string;
  room: string;
}

// ============ Admin Panel Types ============

export type UserRole = 'admin' | 'teacher' | 'student';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface SystemUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  gradeLevel?: string;
  classroomId?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  category: 'auth' | 'user' | 'content' | 'system' | 'data';
  details: string;
  ipAddress?: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  maxStudentsPerClass: number;
  sessionTimeout: number; // minutes
  aiTutorEnabled: boolean;
  riskPredictionEnabled: boolean;
  autoBackupEnabled: boolean;
  emailNotificationsEnabled: boolean;
  defaultLanguage: string;
  academicYear: string;
  semester: string;
}

export interface SystemStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  totalClassrooms: number;
  totalModules: number;
  activeUsers24h: number;
  chatMessagesToday: number;
  averageEngagement: number;
  studentsAtRisk: number;
  systemUptime: string;
  lastBackup: string;
}

export interface ModuleTemplate {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'quiz' | 'exercise';
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  status: 'draft' | 'published' | 'archived';
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  assignedClassrooms: string[];
}