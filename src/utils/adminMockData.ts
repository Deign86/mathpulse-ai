/**
 * MathPulse AI - Admin Panel Mock Data
 * Test data for admin panel development and demonstration
 */

import { SystemUser, AuditLogEntry, SystemSettings, SystemStats, ModuleTemplate } from '../types';

/**
 * Mock System Users - Combines all user types for admin management
 */
export const mockSystemUsers: SystemUser[] = [
  // Admins
  {
    id: 'admin-001',
    email: 'admin@mathpulse.edu',
    name: 'Dr. Maria Santos',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    role: 'admin',
    status: 'active',
    department: 'Mathematics Department Head',
    lastLogin: '2025-01-18T09:30:00',
    createdAt: '2024-08-01T00:00:00',
    updatedAt: '2025-01-18T09:30:00'
  },
  {
    id: 'admin-002',
    email: 'principal@school.edu',
    name: 'Dr. Robert Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    role: 'admin',
    status: 'active',
    department: 'School Principal',
    lastLogin: '2025-01-17T14:20:00',
    createdAt: '2024-06-15T00:00:00',
    updatedAt: '2025-01-17T14:20:00'
  },
  // Teachers
  {
    id: 'teacher-001',
    email: 'anderson@school.edu',
    name: 'Prof. Anderson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anderson',
    role: 'teacher',
    status: 'active',
    department: 'Mathematics',
    lastLogin: '2025-01-18T08:45:00',
    createdAt: '2024-07-01T00:00:00',
    updatedAt: '2025-01-18T08:45:00'
  },
  {
    id: 'teacher-002',
    email: 'johnson@school.edu',
    name: 'Ms. Rebecca Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rebecca',
    role: 'teacher',
    status: 'active',
    department: 'Mathematics',
    lastLogin: '2025-01-17T16:30:00',
    createdAt: '2024-07-15T00:00:00',
    updatedAt: '2025-01-17T16:30:00'
  },
  {
    id: 'teacher-003',
    email: 'garcia@school.edu',
    name: 'Mr. Carlos Garcia',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    role: 'teacher',
    status: 'inactive',
    department: 'Statistics',
    lastLogin: '2024-12-20T10:00:00',
    createdAt: '2024-08-01T00:00:00',
    updatedAt: '2024-12-20T10:00:00'
  },
  // Students
  {
    id: 'student-001',
    email: 'sarah.chen@student.edu',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'student',
    status: 'active',
    gradeLevel: 'Grade 12',
    classroomId: 'class-1',
    lastLogin: '2025-01-18T10:15:00',
    createdAt: '2024-08-15T00:00:00',
    updatedAt: '2025-01-18T10:15:00'
  },
  {
    id: 'student-002',
    email: 'marcus.williams@student.edu',
    name: 'Marcus Williams',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    role: 'student',
    status: 'active',
    gradeLevel: 'Grade 12',
    classroomId: 'class-1',
    lastLogin: '2025-01-18T09:00:00',
    createdAt: '2024-08-15T00:00:00',
    updatedAt: '2025-01-18T09:00:00'
  },
  {
    id: 'student-003',
    email: 'emily.rodriguez@student.edu',
    name: 'Emily Rodriguez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    role: 'student',
    status: 'active',
    gradeLevel: 'Grade 12',
    classroomId: 'class-1',
    lastLogin: '2025-01-17T15:45:00',
    createdAt: '2024-08-15T00:00:00',
    updatedAt: '2025-01-17T15:45:00'
  },
  {
    id: 'student-004',
    email: 'james.park@student.edu',
    name: 'James Park',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    role: 'student',
    status: 'suspended',
    gradeLevel: 'Grade 11',
    classroomId: 'class-2',
    lastLogin: '2025-01-10T14:30:00',
    createdAt: '2024-08-15T00:00:00',
    updatedAt: '2025-01-10T14:30:00'
  },
  {
    id: 'student-005',
    email: 'olivia.thompson@student.edu',
    name: 'Olivia Thompson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
    role: 'student',
    status: 'active',
    gradeLevel: 'Grade 11',
    classroomId: 'class-2',
    lastLogin: '2025-01-18T08:00:00',
    createdAt: '2024-08-15T00:00:00',
    updatedAt: '2025-01-18T08:00:00'
  },
  {
    id: 'student-006',
    email: 'alex.johnson@student.edu',
    name: 'Alex Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    role: 'student',
    status: 'active',
    gradeLevel: 'Grade 11',
    classroomId: 'class-2',
    lastLogin: '2025-01-18T11:00:00',
    createdAt: '2024-08-15T00:00:00',
    updatedAt: '2025-01-18T11:00:00'
  }
];

/**
 * Mock Audit Log Entries
 */
export const mockAuditLog: AuditLogEntry[] = [
  {
    id: 'log-001',
    userId: 'admin-001',
    userName: 'Dr. Maria Santos',
    userRole: 'admin',
    action: 'User Login',
    category: 'auth',
    details: 'Admin logged in successfully',
    ipAddress: '192.168.1.100',
    timestamp: '2025-01-18T09:30:00',
    severity: 'info'
  },
  {
    id: 'log-002',
    userId: 'teacher-001',
    userName: 'Prof. Anderson',
    userRole: 'teacher',
    action: 'Uploaded Class Records',
    category: 'data',
    details: 'Uploaded sample_grades.csv with 25 student records',
    ipAddress: '192.168.1.101',
    timestamp: '2025-01-18T08:50:00',
    severity: 'info'
  },
  {
    id: 'log-003',
    userId: 'admin-001',
    userName: 'Dr. Maria Santos',
    userRole: 'admin',
    action: 'User Status Changed',
    category: 'user',
    details: 'Suspended user: james.park@student.edu - Reason: Policy violation',
    ipAddress: '192.168.1.100',
    timestamp: '2025-01-17T16:00:00',
    severity: 'warning'
  },
  {
    id: 'log-004',
    userId: 'system',
    userName: 'System',
    userRole: 'admin',
    action: 'Automatic Backup',
    category: 'system',
    details: 'Daily automatic backup completed successfully - 1.2GB',
    timestamp: '2025-01-18T03:00:00',
    severity: 'info'
  },
  {
    id: 'log-005',
    userId: 'student-001',
    userName: 'Sarah Chen',
    userRole: 'student',
    action: 'Password Reset Request',
    category: 'auth',
    details: 'Password reset email sent to sarah.chen@student.edu',
    timestamp: '2025-01-17T14:22:00',
    severity: 'info'
  },
  {
    id: 'log-006',
    userId: 'admin-002',
    userName: 'Dr. Robert Chen',
    userRole: 'admin',
    action: 'System Settings Updated',
    category: 'system',
    details: 'Changed maintenance mode: disabled → enabled (scheduled)',
    ipAddress: '192.168.1.102',
    timestamp: '2025-01-17T12:00:00',
    severity: 'warning'
  },
  {
    id: 'log-007',
    userId: 'teacher-002',
    userName: 'Ms. Rebecca Johnson',
    userRole: 'teacher',
    action: 'Module Published',
    category: 'content',
    details: 'Published new module: "Quadratic Equations Practice"',
    ipAddress: '192.168.1.103',
    timestamp: '2025-01-16T15:30:00',
    severity: 'info'
  },
  {
    id: 'log-008',
    userId: 'system',
    userName: 'System',
    userRole: 'admin',
    action: 'Failed Login Attempt',
    category: 'auth',
    details: 'Multiple failed login attempts for: unknown@email.com - IP blocked',
    ipAddress: '203.0.113.45',
    timestamp: '2025-01-16T22:15:00',
    severity: 'error'
  },
  {
    id: 'log-009',
    userId: 'admin-001',
    userName: 'Dr. Maria Santos',
    userRole: 'admin',
    action: 'Created New User',
    category: 'user',
    details: 'Created new teacher account: Ms. Rebecca Johnson (johnson@school.edu)',
    ipAddress: '192.168.1.100',
    timestamp: '2024-07-15T09:00:00',
    severity: 'info'
  },
  {
    id: 'log-010',
    userId: 'system',
    userName: 'System',
    userRole: 'admin',
    action: 'AI Risk Analysis',
    category: 'system',
    details: 'Completed risk analysis for 156 students - 12 flagged as high risk',
    timestamp: '2025-01-18T06:00:00',
    severity: 'info'
  },
  {
    id: 'log-011',
    userId: 'teacher-001',
    userName: 'Prof. Anderson',
    userRole: 'teacher',
    action: 'External Link Approved',
    category: 'content',
    details: 'Approved external resource: Khan Academy - Derivatives Tutorial',
    ipAddress: '192.168.1.101',
    timestamp: '2025-01-17T11:30:00',
    severity: 'info'
  },
  {
    id: 'log-012',
    userId: 'system',
    userName: 'System',
    userRole: 'admin',
    action: 'Database Connection Error',
    category: 'system',
    details: 'Temporary database connection timeout - Auto-recovered after 2.3s',
    timestamp: '2025-01-15T23:45:00',
    severity: 'error'
  }
];

/**
 * Mock System Settings
 */
export const mockSystemSettings: SystemSettings = {
  siteName: 'MathPulse AI',
  siteDescription: 'AI-Powered Math Learning Platform',
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

/**
 * Mock System Statistics
 */
// Generate a recent backup timestamp (3 AM today)
const getLastBackupTime = () => {
  const today = new Date();
  today.setHours(3, 0, 0, 0);
  return today.toISOString();
};

export const mockSystemStats: SystemStats = {
  totalUsers: 156,
  totalStudents: 148,
  totalTeachers: 6,
  totalAdmins: 2,
  totalClassrooms: 8,
  totalModules: 42,
  activeUsers24h: 87,
  chatMessagesToday: 234,
  averageEngagement: 72,
  studentsAtRisk: 12,
  systemUptime: '99.8%',
  lastBackup: getLastBackupTime()
};

/**
 * Mock Module Templates
 */
export const mockModuleTemplates: ModuleTemplate[] = [
  {
    id: 'module-001',
    title: 'Introduction to Derivatives',
    description: 'Visual introduction to the concept of derivatives and rate of change',
    type: 'video',
    topic: 'Calculus',
    difficulty: 'beginner',
    duration: '15 min',
    status: 'published',
    createdBy: 'Prof. Anderson',
    createdAt: '2024-09-01T10:00:00',
    updatedAt: '2025-01-10T14:30:00',
    assignedClassrooms: ['class-1', 'class-3']
  },
  {
    id: 'module-002',
    title: 'Derivatives Practice Quiz',
    description: 'Assessment quiz covering basic derivative rules and applications',
    type: 'quiz',
    topic: 'Calculus',
    difficulty: 'intermediate',
    duration: '20 min',
    status: 'published',
    createdBy: 'Prof. Anderson',
    createdAt: '2024-09-05T11:00:00',
    updatedAt: '2025-01-12T09:00:00',
    assignedClassrooms: ['class-1']
  },
  {
    id: 'module-003',
    title: 'Chain Rule Deep Dive',
    description: 'Comprehensive exploration of the chain rule with complex examples',
    type: 'video',
    topic: 'Calculus',
    difficulty: 'advanced',
    duration: '25 min',
    status: 'published',
    createdBy: 'Ms. Rebecca Johnson',
    createdAt: '2024-09-15T08:00:00',
    updatedAt: '2024-12-01T16:00:00',
    assignedClassrooms: ['class-1']
  },
  {
    id: 'module-004',
    title: 'Quadratic Equations Fundamentals',
    description: 'Complete guide to solving quadratic equations using multiple methods',
    type: 'video',
    topic: 'Algebra',
    difficulty: 'beginner',
    duration: '18 min',
    status: 'published',
    createdBy: 'Ms. Rebecca Johnson',
    createdAt: '2024-08-20T09:00:00',
    updatedAt: '2025-01-05T11:00:00',
    assignedClassrooms: ['class-2', 'class-3']
  },
  {
    id: 'module-005',
    title: 'Quadratic Equations Practice Set',
    description: 'Interactive exercise set with step-by-step solutions',
    type: 'exercise',
    topic: 'Algebra',
    difficulty: 'intermediate',
    duration: '30 min',
    status: 'published',
    createdBy: 'Ms. Rebecca Johnson',
    createdAt: '2024-08-25T14:00:00',
    assignedClassrooms: ['class-2']
  },
  {
    id: 'module-006',
    title: 'Unit Circle Mastery',
    description: 'Complete guide to the unit circle and trigonometric values',
    type: 'video',
    topic: 'Trigonometry',
    difficulty: 'intermediate',
    duration: '22 min',
    status: 'draft',
    createdBy: 'Mr. Carlos Garcia',
    createdAt: '2024-11-01T10:00:00',
    assignedClassrooms: []
  },
  {
    id: 'module-007',
    title: 'Statistics: Mean, Median, Mode',
    description: 'Introduction to measures of central tendency',
    type: 'video',
    topic: 'Statistics',
    difficulty: 'beginner',
    duration: '12 min',
    status: 'archived',
    createdBy: 'Mr. Carlos Garcia',
    createdAt: '2024-07-15T09:00:00',
    updatedAt: '2024-12-01T00:00:00',
    assignedClassrooms: []
  },
  {
    id: 'module-008',
    title: 'Integration Techniques',
    description: 'Advanced integration methods including substitution and parts',
    type: 'video',
    topic: 'Calculus',
    difficulty: 'advanced',
    duration: '35 min',
    status: 'draft',
    createdBy: 'Prof. Anderson',
    createdAt: '2025-01-15T08:00:00',
    assignedClassrooms: []
  }
];

/**
 * Helper functions
 */
export const getUsersByRole = (role: 'admin' | 'teacher' | 'student') => {
  return mockSystemUsers.filter(user => user.role === role);
};

export const getActiveUsers = () => {
  return mockSystemUsers.filter(user => user.status === 'active');
};

export const getRecentAuditLogs = (count: number = 10) => {
  return [...mockAuditLog]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, count);
};

export const getAuditLogsByCategory = (category: AuditLogEntry['category']) => {
  return mockAuditLog.filter(log => log.category === category);
};

export const getModulesByStatus = (status: ModuleTemplate['status']) => {
  return mockModuleTemplates.filter(module => module.status === status);
};
