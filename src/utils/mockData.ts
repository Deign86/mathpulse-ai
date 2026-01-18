import { Student, RiskLevel, Activity, Module, ChatMessage, InterventionPlan, ExternalLink, Classroom } from '../types';

export const mockStudents: Student[] = [
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
    name: 'David Kim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    riskLevel: RiskLevel.MEDIUM,
    engagementScore: 71,
    avgQuizScore: 75,
    weakestTopic: 'Algebra - Logarithms',
    classroomId: 'class-2'
  },
  {
    id: '7',
    name: 'Isabella Garcia',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella',
    riskLevel: RiskLevel.MEDIUM,
    engagementScore: 65,
    avgQuizScore: 70,
    weakestTopic: 'Algebra - Functions',
    classroomId: 'class-3'
  },
  {
    id: '8',
    name: 'Ethan Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
    riskLevel: RiskLevel.HIGH,
    engagementScore: 42,
    avgQuizScore: 55,
    weakestTopic: 'Calculus - Integrals',
    classroomId: 'class-3'
  },
  {
    id: '9',
    name: 'Sophia Lee',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    riskLevel: RiskLevel.LOW,
    engagementScore: 88,
    avgQuizScore: 86,
    weakestTopic: 'Statistics - Probability',
    classroomId: 'class-3'
  }
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    studentName: 'Sarah Chen',
    action: 'Completed quiz on Derivatives',
    timestamp: '2 minutes ago'
  },
  {
    id: '2',
    studentName: 'Emily Rodriguez',
    action: 'Watched video: Introduction to Limits',
    timestamp: '15 minutes ago'
  },
  {
    id: '3',
    studentName: 'Marcus Williams',
    action: 'Submitted exercise set #4',
    timestamp: '32 minutes ago'
  },
  {
    id: '4',
    studentName: 'Olivia Thompson',
    action: 'Asked AI tutor about chain rule',
    timestamp: '1 hour ago'
  }
];

export const mockModules: Module[] = [
  {
    id: '1',
    title: 'Understanding Derivatives - Visual Introduction',
    type: 'video',
    duration: '12 min',
    completed: false
  },
  {
    id: '2',
    title: 'Derivatives Fundamentals Quiz',
    type: 'quiz',
    duration: '15 min',
    completed: false
  },
  {
    id: '3',
    title: 'Practice Problems: Basic Differentiation',
    type: 'exercise',
    duration: '20 min',
    completed: false
  },
  {
    id: '4',
    title: 'Chain Rule Explained',
    type: 'video',
    duration: '10 min',
    completed: false
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'ai',
    message: 'Hi! I\'m your AI Math Tutor. I can help you understand derivatives better. What would you like to work on?',
    timestamp: '10:30 AM'
  },
  {
    id: '2',
    sender: 'user',
    message: 'I\'m struggling with the chain rule. Can you explain it?',
    timestamp: '10:32 AM'
  },
  {
    id: '3',
    sender: 'ai',
    message: 'Of course! The chain rule is used when you have a composite function. If y = f(g(x)), then dy/dx = f\'(g(x)) × g\'(x). Let me show you an example...',
    timestamp: '10:32 AM'
  }
];

export const mockInterventionPlan: InterventionPlan = {
  analysis: {
    core_issue: 'Student struggles with understanding the fundamental concept of rate of change in derivatives',
    gaps: [
      'Weak foundation in algebraic manipulation',
      'Limited visual understanding of slope concepts',
      'Difficulty applying derivative rules in context'
    ]
  },
  remedial_path: [
    {
      step: 1,
      topic: 'Visual Introduction to Derivatives',
      activityType: 'video'
    },
    {
      step: 2,
      topic: 'Derivatives Fundamentals Assessment',
      activityType: 'quiz'
    },
    {
      step: 3,
      topic: 'Guided Practice Problems',
      activityType: 'exercise'
    },
    {
      step: 4,
      topic: 'Chain Rule Mastery',
      activityType: 'video'
    },
    {
      step: 5,
      topic: 'Comprehensive Review Quiz',
      activityType: 'quiz'
    }
  ],
  strategies: [
    {
      title: 'Additional Practice',
      action: 'Assign extra exercises for reinforcement',
      icon: 'trophy'
    },
    {
      title: 'Parent Notification',
      action: 'Send progress update and recommended home practice',
      icon: 'bell'
    },
    {
      title: 'Printed Materials',
      action: 'Generate offline worksheets for practice without internet',
      icon: 'users'
    },
    {
      title: 'Progress Monitoring',
      action: 'Set up weekly check-ins to track improvement',
      icon: 'calendar'
    }
  ]
};

export const mockExternalLinks: ExternalLink[] = [
  {
    id: '1',
    title: 'The Essence of Calculus - 3Blue1Brown',
    url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
    type: 'video',
    topic: 'Calculus - Derivatives',
    recommendedFor: ['1', '4'], // Sarah Chen, James Park
    aiReason: 'This visual explanation excels at building intuition for derivatives through animation. Highly rated pedagogical approach matches learning gaps identified in students.',
    status: 'pending',
    recommendedDate: '2 hours ago',
    source: 'YouTube - 3Blue1Brown'
  },
  {
    id: '2',
    title: 'Khan Academy: Derivative Introduction',
    url: 'https://www.khanacademy.org/math/calculus-1/cs1-derivatives-intro',
    type: 'interactive',
    topic: 'Calculus - Derivatives',
    recommendedFor: ['1'],
    aiReason: 'Interactive practice problems with immediate feedback. Well-structured progression from basics to advanced concepts.',
    status: 'pending',
    recommendedDate: '3 hours ago',
    source: 'Khan Academy'
  },
  {
    id: '3',
    title: 'Understanding Quadratic Equations Visually',
    url: 'https://www.mathsisfun.com/algebra/quadratic-equation.html',
    type: 'article',
    topic: 'Algebra - Quadratic Equations',
    recommendedFor: ['2'],
    aiReason: 'Clear step-by-step explanations with interactive graphs. Addresses common misconceptions about parabolas and roots.',
    status: 'approved',
    recommendedDate: '1 day ago',
    source: 'Math is Fun'
  },
  {
    id: '4',
    title: 'Unit Circle Practice Tool',
    url: 'https://www.mathwarehouse.com/unit-circle/',
    type: 'interactive',
    topic: 'Trigonometry - Unit Circle',
    recommendedFor: ['4'],
    aiReason: 'Interactive visualization helps memorize unit circle values. Includes practice quizzes with immediate feedback.',
    status: 'pending',
    recommendedDate: '4 hours ago',
    source: 'Math Warehouse'
  },
  {
    id: '5',
    title: 'Logarithms Explained - Eddie Woo',
    url: 'https://www.youtube.com/watch?v=ntBWrcbAhaY',
    type: 'video',
    topic: 'Algebra - Logarithms',
    recommendedFor: ['6'],
    aiReason: 'Engaging teaching style with real-world applications. Builds strong conceptual foundation before introducing formulas.',
    status: 'approved',
    recommendedDate: '2 days ago',
    source: 'YouTube - Eddie Woo'
  }
];

export const mockClassrooms: Classroom[] = [
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
    studentCount: 3,
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