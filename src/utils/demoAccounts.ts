/**
 * MathPulse AI - Demo Accounts
 * Test credentials for development and demonstration purposes
 */

export type UserRole = 'admin' | 'teacher' | 'student';

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  avatar: string;
  department?: string;
  gradeLevel?: string;
  classroomId?: string;
  studentId?: string; // Links to Student data for student accounts
}

/**
 * Demo Admin Accounts
 */
export const adminAccounts: UserAccount[] = [
  {
    id: 'admin-001',
    email: 'admin@mathpulse.edu',
    password: 'admin123',
    role: 'admin',
    name: 'Dr. Maria Santos',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    department: 'Mathematics Department Head'
  },
  {
    id: 'admin-002',
    email: 'principal@school.edu',
    password: 'principal123',
    role: 'admin',
    name: 'Dr. Robert Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    department: 'School Principal'
  }
];

/**
 * Demo Teacher Accounts
 */
export const teacherAccounts: UserAccount[] = [
  {
    id: 'teacher-001',
    email: 'anderson@school.edu',
    password: 'teacher123',
    role: 'teacher',
    name: 'Prof. Anderson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anderson',
    department: 'Mathematics'
  },
  {
    id: 'teacher-002',
    email: 'johnson@school.edu',
    password: 'teacher123',
    role: 'teacher',
    name: 'Ms. Rebecca Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rebecca',
    department: 'Mathematics'
  },
  {
    id: 'teacher-003',
    email: 'garcia@school.edu',
    password: 'teacher123',
    role: 'teacher',
    name: 'Mr. Carlos Garcia',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    department: 'Statistics'
  }
];

/**
 * Demo Student Accounts
 * These link to the student data in mockData.ts via studentId
 */
export const studentAccounts: UserAccount[] = [
  {
    id: 'student-001',
    email: 'sarah.chen@student.edu',
    password: 'student123',
    role: 'student',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    gradeLevel: 'Grade 12',
    classroomId: 'class-1',
    studentId: '1'
  },
  {
    id: 'student-002',
    email: 'marcus.williams@student.edu',
    password: 'student123',
    role: 'student',
    name: 'Marcus Williams',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    gradeLevel: 'Grade 12',
    classroomId: 'class-1',
    studentId: '2'
  },
  {
    id: 'student-003',
    email: 'emily.rodriguez@student.edu',
    password: 'student123',
    role: 'student',
    name: 'Emily Rodriguez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    gradeLevel: 'Grade 12',
    classroomId: 'class-1',
    studentId: '3'
  },
  {
    id: 'student-004',
    email: 'james.park@student.edu',
    password: 'student123',
    role: 'student',
    name: 'James Park',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    gradeLevel: 'Grade 11',
    classroomId: 'class-2',
    studentId: '4'
  },
  {
    id: 'student-005',
    email: 'olivia.thompson@student.edu',
    password: 'student123',
    role: 'student',
    name: 'Olivia Thompson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
    gradeLevel: 'Grade 11',
    classroomId: 'class-2',
    studentId: '5'
  },
  {
    id: 'student-006',
    email: 'alex.johnson@student.edu',
    password: 'student123',
    role: 'student',
    name: 'Alex Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    gradeLevel: 'Grade 11',
    classroomId: 'class-2',
    studentId: '6'
  }
];

/**
 * All demo accounts combined
 */
export const allDemoAccounts: UserAccount[] = [
  ...adminAccounts,
  ...teacherAccounts,
  ...studentAccounts
];

/**
 * Authenticate user with email and password
 * Returns the user account if credentials match, null otherwise
 */
export function authenticateUser(email: string, password: string): UserAccount | null {
  const normalizedEmail = email.toLowerCase().trim();
  
  const account = allDemoAccounts.find(
    acc => acc.email.toLowerCase() === normalizedEmail && acc.password === password
  );
  
  return account || null;
}

/**
 * Get user by ID
 */
export function getUserById(userId: string): UserAccount | null {
  return allDemoAccounts.find(acc => acc.id === userId) || null;
}

/**
 * Get users by role
 */
export function getUsersByRole(role: UserRole): UserAccount[] {
  return allDemoAccounts.filter(acc => acc.role === role);
}

/**
 * Demo credentials display helper
 * Returns formatted credentials for login screen
 * NOTE: Passwords must meet Firebase requirements (uppercase + special char)
 */
export const demoCredentials = {
  admin: {
    email: 'admin@mathpulse.edu',
    password: 'Admin123!',
    description: 'System Administrator'
  },
  teacher: {
    email: 'anderson@school.edu',
    password: 'Teacher123!',
    description: 'Mathematics Teacher'
  },
  student: {
    email: 'alex.johnson@student.edu',
    password: 'Student123!',
    description: 'Grade 11 Student'
  }
};
