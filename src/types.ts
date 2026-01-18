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