/**
 * MathPulse AI - Firebase Data Injection Script
 * 
 * This script injects all test data into Firebase:
 * - Creates users in Firebase Auth
 * - Creates user profiles in Firestore
 * - Injects student data, classrooms, modules, and sample chat messages
 * 
 * Run with: npx ts-node scripts/injectFirebaseData.ts
 * Or compile and run: npx tsc scripts/injectFirebaseData.ts && node scripts/injectFirebaseData.js
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithEmailAndPassword,
  connectAuthEmulator
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  writeBatch,
  Timestamp,
  connectFirestoreEmulator
} from 'firebase/firestore';

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
const auth = getAuth(app);
const db = getFirestore(app);

// Risk Level Enum
enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

// Test Users Data - Passwords meet Firebase requirements (uppercase + special char)
const testUsers = [
  // Admins
  {
    email: 'admin@mathpulse.edu',
    password: 'Admin123!',
    profile: {
      role: 'admin' as const,
      name: 'Dr. Maria Santos',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      department: 'Mathematics Department Head'
    }
  },
  {
    email: 'principal@school.edu',
    password: 'Principal123!',
    profile: {
      role: 'admin' as const,
      name: 'Dr. Robert Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
      department: 'School Principal'
    }
  },
  // Teachers
  {
    email: 'anderson@school.edu',
    password: 'Teacher123!',
    profile: {
      role: 'teacher' as const,
      name: 'Prof. Anderson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anderson',
      department: 'Mathematics'
    }
  },
  {
    email: 'johnson@school.edu',
    password: 'Teacher123!',
    profile: {
      role: 'teacher' as const,
      name: 'Ms. Rebecca Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rebecca',
      department: 'Mathematics'
    }
  },
  {
    email: 'garcia@school.edu',
    password: 'Teacher123!',
    profile: {
      role: 'teacher' as const,
      name: 'Mr. Carlos Garcia',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      department: 'Statistics'
    }
  },
  // Students
  {
    email: 'sarah.chen@student.edu',
    password: 'Student123!',
    profile: {
      role: 'student' as const,
      name: 'Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      gradeLevel: 'Grade 12',
      classroomId: 'class-1',
      studentId: '1'
    }
  },
  {
    email: 'marcus.williams@student.edu',
    password: 'Student123!',
    profile: {
      role: 'student' as const,
      name: 'Marcus Williams',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
      gradeLevel: 'Grade 12',
      classroomId: 'class-1',
      studentId: '2'
    }
  },
  {
    email: 'emily.rodriguez@student.edu',
    password: 'Student123!',
    profile: {
      role: 'student' as const,
      name: 'Emily Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      gradeLevel: 'Grade 12',
      classroomId: 'class-1',
      studentId: '3'
    }
  },
  {
    email: 'james.park@student.edu',
    password: 'Student123!',
    profile: {
      role: 'student' as const,
      name: 'James Park',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      gradeLevel: 'Grade 11',
      classroomId: 'class-2',
      studentId: '4'
    }
  },
  {
    email: 'olivia.thompson@student.edu',
    password: 'Student123!',
    profile: {
      role: 'student' as const,
      name: 'Olivia Thompson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
      gradeLevel: 'Grade 11',
      classroomId: 'class-2',
      studentId: '5'
    }
  },
  {
    email: 'alex.johnson@student.edu',
    password: 'Student123!',
    profile: {
      role: 'student' as const,
      name: 'Alex Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      gradeLevel: 'Grade 11',
      classroomId: 'class-2',
      studentId: '6'
    }
  },
  {
    email: 'david.kim@student.edu',
    password: 'Student123!',
    profile: {
      role: 'student' as const,
      name: 'David Kim',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      gradeLevel: 'Grade 11',
      classroomId: 'class-2',
      studentId: '7'
    }
  },
  {
    email: 'isabella.garcia@student.edu',
    password: 'Student123!',
    profile: {
      role: 'student' as const,
      name: 'Isabella Garcia',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella',
      gradeLevel: 'Grade 11',
      classroomId: 'class-3',
      studentId: '8'
    }
  },
  {
    email: 'ethan.brown@student.edu',
    password: 'Student123!',
    profile: {
      role: 'student' as const,
      name: 'Ethan Brown',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
      gradeLevel: 'Grade 11',
      classroomId: 'class-3',
      studentId: '9'
    }
  },
  {
    email: 'sophia.lee@student.edu',
    password: 'Student123!',
    profile: {
      role: 'student' as const,
      name: 'Sophia Lee',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
      gradeLevel: 'Grade 11',
      classroomId: 'class-3',
      studentId: '10'
    }
  }
];

// Student academic data
const studentData = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    riskLevel: RiskLevel.HIGH,
    engagementScore: 45,
    avgQuizScore: 58,
    weakestTopic: 'Calculus - Derivatives',
    classroomId: 'class-1'
  },
  {
    id: '2',
    name: 'Marcus Williams',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    riskLevel: RiskLevel.MEDIUM,
    engagementScore: 68,
    avgQuizScore: 72,
    weakestTopic: 'Algebra - Quadratic Equations',
    classroomId: 'class-1'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    riskLevel: RiskLevel.LOW,
    engagementScore: 92,
    avgQuizScore: 88,
    weakestTopic: 'Statistics - Standard Deviation',
    classroomId: 'class-1'
  },
  {
    id: '4',
    name: 'James Park',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    riskLevel: RiskLevel.HIGH,
    engagementScore: 38,
    avgQuizScore: 52,
    weakestTopic: 'Trigonometry - Unit Circle',
    classroomId: 'class-2'
  },
  {
    id: '5',
    name: 'Olivia Thompson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
    riskLevel: RiskLevel.LOW,
    engagementScore: 85,
    avgQuizScore: 91,
    weakestTopic: 'Geometry - Proofs',
    classroomId: 'class-2'
  },
  {
    id: '6',
    name: 'Alex Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    riskLevel: RiskLevel.MEDIUM,
    engagementScore: 71,
    avgQuizScore: 75,
    weakestTopic: 'Algebra - Logarithms',
    classroomId: 'class-2'
  },
  {
    id: '7',
    name: 'David Kim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    riskLevel: RiskLevel.MEDIUM,
    engagementScore: 71,
    avgQuizScore: 75,
    weakestTopic: 'Algebra - Logarithms',
    classroomId: 'class-2'
  },
  {
    id: '8',
    name: 'Isabella Garcia',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella',
    riskLevel: RiskLevel.MEDIUM,
    engagementScore: 65,
    avgQuizScore: 70,
    weakestTopic: 'Algebra - Functions',
    classroomId: 'class-3'
  },
  {
    id: '9',
    name: 'Ethan Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
    riskLevel: RiskLevel.HIGH,
    engagementScore: 42,
    avgQuizScore: 55,
    weakestTopic: 'Calculus - Integrals',
    classroomId: 'class-3'
  },
  {
    id: '10',
    name: 'Sophia Lee',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    riskLevel: RiskLevel.LOW,
    engagementScore: 88,
    avgQuizScore: 86,
    weakestTopic: 'Statistics - Probability',
    classroomId: 'class-3'
  }
];

// Classroom data
const classroomData = [
  {
    id: 'class-1',
    name: 'Advanced Calculus',
    section: 'Section A',
    gradeLevel: 'Grade 12',
    schedule: 'MWF 8:00-9:30 AM',
    studentCount: 3,
    semester: '1st Semester',
    academicYear: '2024-2025',
    room: 'Room 301'
  },
  {
    id: 'class-2',
    name: 'Algebra & Trigonometry',
    section: 'Section B',
    gradeLevel: 'Grade 11',
    schedule: 'TTh 10:00-11:30 AM',
    studentCount: 4,
    semester: '1st Semester',
    academicYear: '2024-2025',
    room: 'Room 205'
  },
  {
    id: 'class-3',
    name: 'Statistics & Probability',
    section: 'Section C',
    gradeLevel: 'Grade 11',
    schedule: 'MWF 1:00-2:30 PM',
    studentCount: 3,
    semester: '1st Semester',
    academicYear: '2024-2025',
    room: 'Room 108'
  }
];

// Module data
const moduleData = [
  {
    id: 'module-1',
    title: 'Understanding Derivatives - Visual Introduction',
    type: 'video',
    duration: '12 min',
    completed: false,
    content: {
      videoUrl: 'https://www.youtube.com/embed/WUvTyaaNkzM',
      description: 'Learn the fundamental concept of derivatives through visual representations.'
    }
  },
  {
    id: 'module-2',
    title: 'Derivatives Fundamentals Quiz',
    type: 'quiz',
    duration: '15 min',
    completed: false,
    content: {
      questions: [
        {
          id: 'q1',
          question: 'What is the derivative of x²?',
          options: ['x', '2x', '2x²', 'x²/2'],
          correctAnswer: 1
        },
        {
          id: 'q2',
          question: 'The derivative represents:',
          options: ['Area under curve', 'Rate of change', 'Maximum value', 'Minimum value'],
          correctAnswer: 1
        }
      ]
    }
  },
  {
    id: 'module-3',
    title: 'Practice Problems: Basic Differentiation',
    type: 'exercise',
    duration: '20 min',
    completed: false,
    content: {
      problems: [
        { id: 'p1', problem: 'Find the derivative of f(x) = 3x³ + 2x² - 5x + 1', answer: '9x² + 4x - 5' },
        { id: 'p2', problem: 'Find the derivative of f(x) = sin(x) + cos(x)', answer: 'cos(x) - sin(x)' }
      ]
    }
  },
  {
    id: 'module-4',
    title: 'Chain Rule Explained',
    type: 'video',
    duration: '10 min',
    completed: false,
    content: {
      videoUrl: 'https://www.youtube.com/embed/HaHsqDjWMLU',
      description: 'Master the chain rule for differentiating composite functions.'
    }
  }
];

// Sample chat history for demo
const sampleChatHistory = [
  {
    studentId: '6', // Alex Johnson
    messages: [
      {
        sender: 'ai',
        message: "Hi! I'm your AI Math Tutor. I can help you understand derivatives better. What would you like to work on?",
        timestamp: new Date(Date.now() - 3600000) // 1 hour ago
      },
      {
        sender: 'user',
        message: "I'm struggling with the chain rule. Can you explain it?",
        timestamp: new Date(Date.now() - 3500000)
      },
      {
        sender: 'ai',
        message: "Of course! The chain rule is used when you have a composite function. If y = f(g(x)), then dy/dx = f'(g(x)) × g'(x). Let me show you an example...",
        timestamp: new Date(Date.now() - 3400000)
      }
    ]
  }
];

// External links data
const externalLinksData = [
  {
    id: 'link-1',
    title: 'The Essence of Calculus - 3Blue1Brown',
    url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
    type: 'video',
    topic: 'Calculus - Derivatives',
    recommendedFor: ['1', '4'],
    aiReason: 'This visual explanation excels at building intuition for derivatives through animation.',
    status: 'pending',
    recommendedDate: Timestamp.now(),
    source: 'YouTube - 3Blue1Brown'
  },
  {
    id: 'link-2',
    title: 'Khan Academy: Derivative Introduction',
    url: 'https://www.khanacademy.org/math/calculus-1/cs1-derivatives-intro',
    type: 'interactive',
    topic: 'Calculus - Derivatives',
    recommendedFor: ['1'],
    aiReason: 'Interactive practice problems with immediate feedback.',
    status: 'pending',
    recommendedDate: Timestamp.now(),
    source: 'Khan Academy'
  }
];

async function createFirebaseUsers() {
  console.log('\n📝 Creating Firebase Auth users...\n');
  
  const createdUsers: Map<string, string> = new Map(); // email -> uid mapping
  
  for (const user of testUsers) {
    try {
      // Try to create the user
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      await updateProfile(userCredential.user, { displayName: user.profile.name });
      createdUsers.set(user.email, userCredential.user.uid);
      console.log(`✅ Created user: ${user.email} (${user.profile.name})`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        // User exists, try to sign in to get the UID
        try {
          const signInResult = await signInWithEmailAndPassword(auth, user.email, user.password);
          createdUsers.set(user.email, signInResult.user.uid);
          console.log(`ℹ️  User exists: ${user.email} (${user.profile.name})`);
        } catch (signInError) {
          console.log(`⚠️  Could not access existing user: ${user.email}`);
        }
      } else {
        console.error(`❌ Error creating user ${user.email}:`, error.message);
      }
    }
  }
  
  return createdUsers;
}

async function injectUserProfiles(userMapping: Map<string, string>) {
  console.log('\n📝 Injecting user profiles into Firestore...\n');
  
  const batch = writeBatch(db);
  
  for (const user of testUsers) {
    const uid = userMapping.get(user.email);
    if (uid) {
      const userRef = doc(db, 'users', uid);
      batch.set(userRef, {
        uid,
        email: user.email,
        ...user.profile,
        createdAt: Timestamp.now()
      });
      console.log(`✅ Added profile for: ${user.profile.name}`);
    }
  }
  
  await batch.commit();
  console.log('✅ User profiles committed to Firestore');
}

async function injectStudentData() {
  console.log('\n📝 Injecting student academic data...\n');
  
  const batch = writeBatch(db);
  
  for (const student of studentData) {
    const studentRef = doc(db, 'students', student.id);
    batch.set(studentRef, {
      ...student,
      updatedAt: Timestamp.now()
    });
    console.log(`✅ Added student: ${student.name}`);
  }
  
  await batch.commit();
  console.log('✅ Student data committed to Firestore');
}

async function injectClassroomData() {
  console.log('\n📝 Injecting classroom data...\n');
  
  const batch = writeBatch(db);
  
  for (const classroom of classroomData) {
    const classroomRef = doc(db, 'classrooms', classroom.id);
    batch.set(classroomRef, {
      ...classroom,
      createdAt: Timestamp.now()
    });
    console.log(`✅ Added classroom: ${classroom.name} - ${classroom.section}`);
  }
  
  await batch.commit();
  console.log('✅ Classroom data committed to Firestore');
}

async function injectModuleData() {
  console.log('\n📝 Injecting module data...\n');
  
  const batch = writeBatch(db);
  
  for (const module of moduleData) {
    const moduleRef = doc(db, 'modules', module.id);
    batch.set(moduleRef, {
      ...module,
      createdAt: Timestamp.now()
    });
    console.log(`✅ Added module: ${module.title}`);
  }
  
  await batch.commit();
  console.log('✅ Module data committed to Firestore');
}

async function injectChatHistory() {
  console.log('\n📝 Injecting sample chat history...\n');
  
  for (const chat of sampleChatHistory) {
    for (const msg of chat.messages) {
      const chatRef = doc(collection(db, 'chatHistory'));
      await setDoc(chatRef, {
        studentId: chat.studentId,
        sender: msg.sender,
        message: msg.message,
        timestamp: Timestamp.fromDate(msg.timestamp)
      });
    }
    console.log(`✅ Added chat history for student: ${chat.studentId}`);
  }
  
  console.log('✅ Chat history committed to Firestore');
}

async function injectExternalLinks() {
  console.log('\n📝 Injecting external links data...\n');
  
  const batch = writeBatch(db);
  
  for (const link of externalLinksData) {
    const linkRef = doc(db, 'externalLinks', link.id);
    batch.set(linkRef, link);
    console.log(`✅ Added link: ${link.title}`);
  }
  
  await batch.commit();
  console.log('✅ External links committed to Firestore');
}

async function main() {
  console.log('🚀 MathPulse AI - Firebase Data Injection Script');
  console.log('================================================\n');
  
  try {
    // Step 1: Create Firebase Auth users
    const userMapping = await createFirebaseUsers();
    
    // Step 2: Inject user profiles
    await injectUserProfiles(userMapping);
    
    // Step 3: Inject student academic data
    await injectStudentData();
    
    // Step 4: Inject classroom data
    await injectClassroomData();
    
    // Step 5: Inject module data
    await injectModuleData();
    
    // Step 6: Inject sample chat history
    await injectChatHistory();
    
    // Step 7: Inject external links
    await injectExternalLinks();
    
    console.log('\n================================================');
    console.log('✅ All data successfully injected into Firebase!');
    console.log('================================================\n');
    
    console.log('📋 Test Accounts Summary:');
    console.log('------------------------');
    console.log('Admin:   admin@mathpulse.edu / admin123');
    console.log('Teacher: anderson@school.edu / teacher123');
    console.log('Student: alex.johnson@student.edu / student123');
    console.log('\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during data injection:', error);
    process.exit(1);
  }
}

// Run the script
main();
