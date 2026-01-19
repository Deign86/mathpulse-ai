import { useState, useRef, useEffect } from 'react';
import { BrainCircuit, LayoutDashboard, BarChart3, Upload, User, Search, Sparkles, Activity, Printer, Megaphone, Trophy, Users, Bell, FileVideo, FileQuestion, FileText, ChevronRight, LogOut, Download, Shield, BookOpen, ChevronDown, Calendar, Edit2, CheckCircle, AlertCircle, Loader2, X, FileSpreadsheet, Send } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Student, RiskLevel, Activity as ActivityType, InterventionPlan, Classroom } from '../types';
import { mockStudents, mockActivities, mockClassrooms, mockExternalLinks } from '../utils/mockData';
import { UserAccount } from '../utils/demoAccounts';
import { ProfileEditModal } from './ProfileEditModal';
import { ExportPrintedMaterialsModal } from './ExportPrintedMaterialsModal';
import { ExternalLinkValidationModal } from './ExternalLinkValidationModal';
import { ClassroomOverviewModal } from './ClassroomOverviewModal';
import { EditClassRecordsModal } from './EditClassRecordsModal';
import { apiService } from '../services/api';
import { studentService, activityService, announcementService, classroomService, Announcement } from '../services/firebase';
import { useToast } from './ui/Toast';

const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case RiskLevel.HIGH: return '#ef4444';
    case RiskLevel.MEDIUM: return '#f59e0b';
    case RiskLevel.LOW: return '#10b981';
  }
};

interface TeacherDashboardProps {
  onLogout: () => void;
  currentUser: UserAccount;
}

export function TeacherDashboard({ onLogout, currentUser }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'import'>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExternalLinkModalOpen, setIsExternalLinkModalOpen] = useState(false);
  const [isClassroomOverviewModalOpen, setIsClassroomOverviewModalOpen] = useState(false);
  const [isEditClassRecordsModalOpen, setIsEditClassRecordsModalOpen] = useState(false);
  const [currentClassroomId, setCurrentClassroomId] = useState('class-1');
  const [externalLinks, setExternalLinks] = useState(mockExternalLinks);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [classrooms, setClassrooms] = useState<Classroom[]>(mockClassrooms);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [isLoadingClassrooms, setIsLoadingClassrooms] = useState(true);
  const [teacherAvatar, setTeacherAvatar] = useState(currentUser.avatar);
  const [teacherName, setTeacherName] = useState(currentUser.name);
  
  // Real-time activities and announcements
  const [activities, setActivities] = useState<ActivityType[]>(mockActivities);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementType, setAnnouncementType] = useState<'info' | 'warning' | 'success' | 'urgent'>('info');
  const [announcementTarget, setAnnouncementTarget] = useState<'all' | 'classroom'>('classroom');
  const [isSendingAnnouncement, setIsSendingAnnouncement] = useState(false);
  
  const toast = useToast();

  // Load students from Firebase on mount
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setIsLoadingStudents(true);
        const firebaseStudents = await studentService.getAll();
        if (firebaseStudents.length > 0) {
          // Use Firebase data if available
          setStudents(firebaseStudents);
        } else {
          // Fall back to mock data and seed Firebase
          setStudents(mockStudents);
          // Optionally seed Firebase with mock data for first-time setup
          for (const student of mockStudents) {
            await studentService.save(student);
          }
        }
      } catch (error) {
        console.error('Error loading students from Firebase:', error);
        // Fall back to mock data on error
        setStudents(mockStudents);
      } finally {
        setIsLoadingStudents(false);
      }
    };
    loadStudents();
  }, []);

  // Load classrooms from Firebase on mount
  useEffect(() => {
    const loadClassrooms = async () => {
      try {
        setIsLoadingClassrooms(true);
        const firebaseClassrooms = await classroomService.getAll();
        if (firebaseClassrooms.length > 0) {
          setClassrooms(firebaseClassrooms);
        } else {
          // Fall back to mock data and seed Firebase
          setClassrooms(mockClassrooms);
          await classroomService.seedFromMockData(mockClassrooms);
        }
      } catch (error) {
        console.error('Error loading classrooms from Firebase:', error);
        setClassrooms(mockClassrooms);
      } finally {
        setIsLoadingClassrooms(false);
      }
    };
    loadClassrooms();
  }, []);

  // Subscribe to real-time activities
  useEffect(() => {
    const unsubscribe = activityService.subscribeToActivities(currentClassroomId, (newActivities) => {
      if (newActivities.length > 0) {
        setActivities(newActivities);
      }
    });
    return () => unsubscribe();
  }, [currentClassroomId]);

  // Load Daily AI Insight from backend
  useEffect(() => {
    const loadDailyInsight = async () => {
      if (students.length === 0) return;
      
      setIsLoadingInsight(true);
      try {
        const studentData = students.map(s => ({
          id: s.id,
          name: s.name,
          engagementScore: s.engagementScore,
          avgQuizScore: s.avgQuizScore,
          weakestTopic: s.weakestTopic,
          riskLevel: s.riskLevel
        }));
        
        const insight = await apiService.getDailyInsight(studentData);
        setDailyInsight(insight);
      } catch (error) {
        console.error('Error loading daily insight:', error);
        // Fallback insight will be set by the API service
      } finally {
        setIsLoadingInsight(false);
      }
    };
    
    loadDailyInsight();
  }, [students]);

  // Handle sending announcement
  const handleSendAnnouncement = async () => {
    if (!announcementTitle.trim() || !announcementMessage.trim()) return;
    
    try {
      setIsSendingAnnouncement(true);
      await announcementService.create({
        title: announcementTitle,
        message: announcementMessage,
        type: announcementType,
        targetType: announcementTarget,
        targetId: announcementTarget === 'classroom' ? currentClassroomId : undefined,
        authorId: currentUser.id,
        authorName: currentUser.name
      });
      
      // Reset form
      setAnnouncementTitle('');
      setAnnouncementMessage('');
      setAnnouncementType('info');
      setIsAnnouncementModalOpen(false);
      
      toast.success('Announcement Sent', 'Your announcement has been delivered successfully.');
    } catch (error) {
      console.error('Error sending announcement:', error);
      toast.error('Failed to Send', 'Could not send announcement. Please try again.');
    } finally {
      setIsSendingAnnouncement(false);
    }
  };

  // File upload states
  const [isUploadingRecords, setIsUploadingRecords] = useState(false);
  const [isUploadingMaterials, setIsUploadingMaterials] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
    details?: string[];
  } | null>(null);
  const [lastUploadedFile, setLastUploadedFile] = useState<string | null>(null);
  const [parsedStudentsPreview, setParsedStudentsPreview] = useState<Array<{
    name: string;
    avgQuizScore: number;
    engagementScore: number;
  }> | null>(null);
  const [courseMaterialInfo, setCourseMaterialInfo] = useState<{
    filename: string;
    topics: string[];
    hasAssessments: boolean;
  } | null>(null);

  // Analytics date filter state
  const [analyticsDateRange, setAnalyticsDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('all');

  // Daily AI Insight state
  const [dailyInsight, setDailyInsight] = useState<{
    insight: string;
    trends: Array<{ metric: string; value: string; trend: 'up' | 'down' }>;
    focusTopic: string;
    recommendations: Array<{ priority: string; action: string; impact: string }>;
  } | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(true);

  // Dynamic Intervention Plan state (per-student)
  const [interventionPlan, setInterventionPlan] = useState<InterventionPlan | null>(null);
  const [isLoadingInterventionPlan, setIsLoadingInterventionPlan] = useState(false);

  const classRecordsInputRef = useRef<HTMLInputElement>(null);
  const courseMaterialsInputRef = useRef<HTMLInputElement>(null);

  // Handle saving edited students to Firebase
  const handleStudentsSave = async (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
    // Persist all changes to Firebase
    try {
      for (const student of updatedStudents) {
        await studentService.save(student);
      }
      console.log('All student changes persisted to Firebase');
    } catch (error) {
      console.error('Error persisting students to Firebase:', error);
    }
  };

  const handleProfileSave = (newAvatar: string, newName: string) => {
    setTeacherAvatar(newAvatar);
    setTeacherName(newName);
  };

  const handleApproveLinkClick = (linkId: string) => {
    setExternalLinks(links => 
      links.map(link => 
        link.id === linkId ? { ...link, status: 'approved' as const } : link
      )
    );
  };

  const handleRejectLink = (linkId: string) => {
    setExternalLinks(links => 
      links.map(link => 
        link.id === linkId ? { ...link, status: 'rejected' as const } : link
      )
    );
  };

  const pendingLinksCount = externalLinks.filter(link => link.status === 'pending').length;

  // File upload handlers
  const handleClassRecordsUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingRecords(true);
    setUploadResult(null);
    setParsedStudentsPreview(null);
    setLastUploadedFile(file.name);

    try {
      const result = await apiService.uploadClassRecords(file);

      if (result.success && result.students.length > 0) {
        // Convert parsed students to our Student format
        const newStudents: Student[] = result.students.map((parsed, index) => {
          // Determine risk level based on scores
          const avgScore = (parsed.avgQuizScore + parsed.engagementScore) / 2;
          let riskLevel: RiskLevel;
          if (avgScore < 55) riskLevel = RiskLevel.HIGH;
          else if (avgScore < 75) riskLevel = RiskLevel.MEDIUM;
          else riskLevel = RiskLevel.LOW;

          return {
            id: `imported-${Date.now()}-${index}`,
            name: parsed.name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(parsed.name)}`,
            riskLevel,
            engagementScore: Math.round(parsed.engagementScore),
            avgQuizScore: Math.round(parsed.avgQuizScore),
            weakestTopic: parsed.weakestTopic || 'General Mathematics',
            classroomId: currentClassroomId
          };
        });

        // Merge with existing students (avoid duplicates by name)
        const existingNames = new Set(students.map(s => s.name.toLowerCase()));
        const uniqueNewStudents = newStudents.filter(s => !existingNames.has(s.name.toLowerCase()));
        
        if (uniqueNewStudents.length > 0) {
          // Save new students to Firebase for persistence
          for (const student of uniqueNewStudents) {
            try {
              await studentService.save(student);
            } catch (error) {
              console.error('Error saving student to Firebase:', error);
            }
          }
          setStudents(prev => [...prev, ...uniqueNewStudents]);
        }

        setParsedStudentsPreview(result.students.slice(0, 5).map(s => ({
          name: s.name,
          avgQuizScore: s.avgQuizScore,
          engagementScore: s.engagementScore
        })));

        setUploadResult({
          type: result.warnings.length > 0 ? 'warning' : 'success',
          message: `Successfully imported ${result.studentCount} students from ${file.name}`,
          details: [
            `File type: ${result.fileType.toUpperCase()}`,
            `Confidence: ${Math.round(result.mappingConfidence * 100)}%`,
            `Columns detected: ${result.columnsDetected.slice(0, 5).join(', ')}${result.columnsDetected.length > 5 ? '...' : ''}`,
            ...(result.warnings || [])
          ]
        });
      } else {
        setUploadResult({
          type: 'error',
          message: 'Could not extract student data from file',
          details: result.warnings || ['Please check the file format and try again']
        });
      }
    } catch (error) {
      setUploadResult({
        type: 'error',
        message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: ['Make sure the backend server is running', 'Check if the file format is supported']
      });
    } finally {
      setIsUploadingRecords(false);
      // Reset input so same file can be uploaded again
      if (classRecordsInputRef.current) {
        classRecordsInputRef.current.value = '';
      }
    }
  };

  const handleCourseMaterialsUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingMaterials(true);
    setUploadResult(null);
    setCourseMaterialInfo(null);

    try {
      const result = await apiService.uploadCourseMaterials(file);

      if (result.success && result.courseInfo) {
        setCourseMaterialInfo({
          filename: result.filename,
          topics: result.courseInfo.detectedTopics || [],
          hasAssessments: result.courseInfo.hasAssessments || false
        });

        setUploadResult({
          type: 'success',
          message: `Successfully analyzed ${file.name}`,
          details: [
            `Word count: ${result.courseInfo.wordCount || 0}`,
            `Math topics detected: ${(result.courseInfo.detectedTopics || []).join(', ') || 'None'}`,
            result.courseInfo.hasAssessments ? '✓ Contains assessment information' : '',
            result.courseInfo.hasObjectives ? '✓ Contains learning objectives' : ''
          ].filter(Boolean)
        });
      } else {
        setUploadResult({
          type: 'error',
          message: result.error || 'Could not analyze course material',
          details: ['Please check the file format and try again']
        });
      }
    } catch (error) {
      setUploadResult({
        type: 'error',
        message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: ['Make sure the backend server is running']
      });
    } finally {
      setIsUploadingMaterials(false);
      if (courseMaterialsInputRef.current) {
        courseMaterialsInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDropRecords = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      // Create a synthetic event
      const syntheticEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      await handleClassRecordsUpload(syntheticEvent);
    }
  };

  const handleDropMaterials = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const syntheticEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      await handleCourseMaterialsUpload(syntheticEvent);
    }
  };

  // Generate intervention plan when a student is selected
  const generateInterventionPlan = async (student: Student) => {
    setIsLoadingInterventionPlan(true);
    
    try {
      // Call the learning path API
      const learningPath = await apiService.generateLearningPath({
        studentId: student.id,
        weakestTopic: student.weakestTopic,
        avgQuizScore: student.avgQuizScore,
        engagementScore: student.engagementScore
      });

      // Generate AI analysis based on student data
      const analysis = generateAIAnalysis(student);

      // Convert API response to InterventionPlan format
      const plan: InterventionPlan = {
        analysis,
        remedial_path: learningPath.steps.map(step => ({
          step: step.step,
          topic: step.topic,
          activityType: step.type
        })),
        strategies: generateStrategies(student)
      };

      setInterventionPlan(plan);
    } catch (error) {
      console.error('Error generating intervention plan:', error);
      // Use a basic fallback
      setInterventionPlan({
        analysis: generateAIAnalysis(student),
        remedial_path: [
          { step: 1, topic: `Introduction to ${student.weakestTopic}`, activityType: 'video' },
          { step: 2, topic: `${student.weakestTopic} Fundamentals Quiz`, activityType: 'quiz' },
          { step: 3, topic: 'Guided Practice Problems', activityType: 'exercise' },
          { step: 4, topic: `Advanced ${student.weakestTopic}`, activityType: 'video' },
          { step: 5, topic: 'Comprehensive Review Quiz', activityType: 'quiz' }
        ],
        strategies: generateStrategies(student)
      });
    } finally {
      setIsLoadingInterventionPlan(false);
    }
  };

  // Generate AI analysis based on student's performance data
  const generateAIAnalysis = (student: Student): { core_issue: string; gaps: string[] } => {
    const topic = student.weakestTopic;
    const isLowEngagement = student.engagementScore < 60;
    const isLowQuizScore = student.avgQuizScore < 60;
    const riskLevel = student.riskLevel;

    // Generate core issue based on student's specific struggles
    let coreIssue = '';
    if (riskLevel === RiskLevel.HIGH) {
      if (isLowEngagement && isLowQuizScore) {
        coreIssue = `Student shows critical gaps in understanding ${topic} fundamentals, combined with low classroom engagement that may indicate learning barriers.`;
      } else if (isLowQuizScore) {
        coreIssue = `Student struggles with the fundamental concepts of ${topic}, despite reasonable engagement levels.`;
      } else {
        coreIssue = `Student has disengaged from learning activities despite having some foundational knowledge in ${topic}.`;
      }
    } else if (riskLevel === RiskLevel.MEDIUM) {
      coreIssue = `Student demonstrates inconsistent understanding of ${topic}, with performance varying across different problem types.`;
    } else {
      coreIssue = `Student shows solid progress in ${topic} but could benefit from enrichment activities to master advanced concepts.`;
    }

    // Generate specific gaps based on topic and scores
    const gaps: string[] = [];
    
    if (topic.toLowerCase().includes('derivative') || topic.toLowerCase().includes('calculus')) {
      if (student.avgQuizScore < 70) gaps.push('Weak foundation in algebraic manipulation');
      if (student.avgQuizScore < 60) gaps.push('Limited visual understanding of slope concepts');
      gaps.push('Difficulty applying derivative rules in context');
    } else if (topic.toLowerCase().includes('quadratic')) {
      if (student.avgQuizScore < 70) gaps.push('Struggles with factoring techniques');
      if (student.avgQuizScore < 60) gaps.push('Limited understanding of parabola properties');
      gaps.push('Difficulty connecting equations to graphs');
    } else if (topic.toLowerCase().includes('trigonometry') || topic.toLowerCase().includes('trig')) {
      if (student.avgQuizScore < 70) gaps.push('Incomplete memorization of unit circle values');
      if (student.avgQuizScore < 60) gaps.push('Confusion with trig identities');
      gaps.push('Difficulty with real-world applications');
    } else if (topic.toLowerCase().includes('logarithm')) {
      if (student.avgQuizScore < 70) gaps.push('Weak understanding of exponential relationships');
      if (student.avgQuizScore < 60) gaps.push('Struggles with logarithm properties');
      gaps.push('Difficulty solving logarithmic equations');
    } else {
      // Generic gaps based on performance
      if (student.avgQuizScore < 70) gaps.push(`Gaps in foundational ${topic} concepts`);
      if (isLowEngagement) gaps.push('Decreased participation in practice activities');
      gaps.push(`Needs more practice applying ${topic} to problems`);
    }

    // Add engagement-related gaps
    if (isLowEngagement) {
      gaps.push('Low engagement with assigned practice materials');
    }

    return { core_issue: coreIssue, gaps: gaps.slice(0, 4) };
  };

  // Generate teaching strategies based on student profile
  const generateStrategies = (student: Student): InterventionPlan['strategies'] => {
    const strategies: InterventionPlan['strategies'] = [];
    
    if (student.riskLevel === RiskLevel.HIGH) {
      strategies.push({
        title: 'One-on-One Session',
        action: `Schedule focused tutoring on ${student.weakestTopic} fundamentals`,
        icon: 'users'
      });
      strategies.push({
        title: 'Parent Notification',
        action: 'Send progress update and recommended home practice activities',
        icon: 'bell'
      });
    }
    
    if (student.avgQuizScore < 70) {
      strategies.push({
        title: 'Additional Practice',
        action: 'Assign targeted exercises to reinforce weak areas',
        icon: 'trophy'
      });
    }
    
    if (student.engagementScore < 60) {
      strategies.push({
        title: 'Engagement Boost',
        action: 'Incorporate interactive activities and peer learning',
        icon: 'users'
      });
    }
    
    strategies.push({
      title: 'Progress Monitoring',
      action: 'Set up weekly check-ins to track improvement',
      icon: 'calendar'
    });

    // Ensure we always have at least 4 strategies
    if (strategies.length < 4) {
      strategies.push({
        title: 'Printed Materials',
        action: 'Generate offline worksheets for additional practice',
        icon: 'users'
      });
    }

    return strategies.slice(0, 4);
  };

  // Load intervention plan when student is selected
  useEffect(() => {
    if (selectedStudent) {
      setInterventionPlan(null);
      generateInterventionPlan(selectedStudent);
    }
  }, [selectedStudent?.id]);

  // Filter students by current classroom
  const currentClassroom = classrooms.find(c => c.id === currentClassroomId);
  const classroomStudents = students.filter(s => s.classroomId === currentClassroomId);
  const filteredStudents = classroomStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Analytics Data
  const riskDistribution = [
    { name: 'High Risk', value: students.filter(s => s.riskLevel === RiskLevel.HIGH).length, color: '#ef4444' },
    { name: 'Medium Risk', value: students.filter(s => s.riskLevel === RiskLevel.MEDIUM).length, color: '#f59e0b' },
    { name: 'Low Risk', value: students.filter(s => s.riskLevel === RiskLevel.LOW).length, color: '#10b981' }
  ];

  const weakTopicsData = [
    { topic: 'Derivatives', students: 8 },
    { topic: 'Quadratic Eq.', students: 5 },
    { topic: 'Trigonometry', students: 7 },
    { topic: 'Logarithms', students: 4 },
    { topic: 'Statistics', students: 3 }
  ];

  const classAverage = Math.round(students.reduce((acc, s) => acc + s.avgQuizScore, 0) / students.length);
  const avgEngagement = Math.round(students.reduce((acc, s) => acc + s.engagementScore, 0) / students.length);
  const studentsAtRisk = students.filter(s => s.riskLevel === RiskLevel.HIGH).length;

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar - Student List */}
      <div className="w-80 bg-white/90 backdrop-blur-xl border-r border-primary-100 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg blur opacity-50"></div>
              <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-lg shadow-md">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-gradient font-bold text-lg">MathPulse AI</span>
          </div>

          {/* Classroom Selector */}
          <button
            onClick={() => setIsClassroomOverviewModalOpen(true)}
            className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-500 hover:to-primary-600 transition-all shadow-lg hover:shadow-primary-500/25 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <div className="text-left">
                  <p className="text-sm text-white/70">Current Classroom</p>
                  <p className="text-white font-medium">{currentClassroom?.section}</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </div>
          </button>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-primary-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        {/* Student List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`border-l-4 bg-white backdrop-blur-sm rounded-xl p-3 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                selectedStudent?.id === student.id ? 'ring-2 ring-primary-500 shadow-lg' : 'border border-primary-100'
              }`}
              style={{ borderLeftColor: getRiskColor(student.riskLevel) }}
            >
              <div className="flex items-start gap-3">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-10 h-10 rounded-full bg-slate-200 ring-2 ring-primary-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-medium truncate">{student.name}</p>
                  <p className="text-xs text-slate-500 mt-1">Avg Score: {student.avgQuizScore}%</p>
                  
                  {/* Mini Progress Bar */}
                  <div className="mt-2 bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${student.avgQuizScore}%`,
                        backgroundColor: getRiskColor(student.riskLevel)
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-primary-100 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Navigation Tabs */}
            <nav className="flex gap-1 p-1 bg-primary-50 rounded-xl border border-primary-100">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-white hover:text-primary-600'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-white hover:text-primary-600'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'import'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-white hover:text-primary-600'
                }`}
              >
                <Upload className="w-4 h-4" />
                Import Data
              </button>
            </nav>
            
            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-slate-800 font-medium">{teacherName}</p>
                <p className="text-xs text-slate-500">Mathematics Teacher</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center ring-2 ring-primary-200">
                <User className="w-5 h-5 text-white" />
              </div>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
              >
                <User className="w-5 h-5" />
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && !selectedStudent && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Daily AI Insight Banner */}
              <div className="relative overflow-hidden bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="relative flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-white font-semibold text-lg mb-2">Daily AI Insight</h2>
                    {isLoadingInsight ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-white/80" />
                        <span className="text-white/80">Analyzing class trends...</span>
                      </div>
                    ) : dailyInsight ? (
                      <div className="space-y-3">
                        <p className="text-white/90">{dailyInsight.insight}</p>
                        
                        {dailyInsight.trends.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {dailyInsight.trends.map((trend, idx) => (
                              <span key={idx} className={`px-3 py-1 rounded-lg text-xs font-medium ${
                                trend.trend === 'up' ? 'bg-emerald-400/20 text-emerald-100' : 'bg-amber-400/20 text-amber-100'
                              }`}>
                                {trend.metric}: {trend.value} {trend.trend === 'up' ? '↑' : '↓'}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {dailyInsight.focusTopic && (
                          <p className="text-white/80 text-sm">
                            <strong className="text-white">Focus Topic:</strong> {dailyInsight.focusTopic}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-white/80">
                        No insights available. Add student data to enable AI analysis.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live Classroom Pulse */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-accent-100 rounded-lg">
                      <Activity className="w-5 h-5 text-accent-500" />
                    </div>
                    <h3 className="text-slate-800 font-semibold">Live Classroom Pulse</h3>
                  </div>
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-primary-50/50 rounded-xl border border-primary-100 hover:border-primary-300 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <Activity className="w-4 h-4 text-primary-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700">
                            <span className="text-primary-600 font-medium">{activity.studentName}</span> {activity.action}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Grid */}
                <div className="space-y-4">
                  <button 
                    onClick={() => setIsExternalLinkModalOpen(true)}
                    className="w-full glass-card p-6 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group relative cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-100 p-3 rounded-xl group-hover:bg-indigo-500 transition-colors">
                        <Shield className="w-6 h-6 text-indigo-500 group-hover:text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-slate-800 font-semibold mb-1">Validate AI Links</h3>
                        <p className="text-sm text-slate-500">Review external resources before students access them</p>
                      </div>
                      {pendingLinksCount > 0 && (
                        <div className="absolute top-4 right-4 bg-amber-500 text-white px-2 py-1 rounded-full text-xs animate-pulse">
                          {pendingLinksCount} pending
                        </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </button>

                  <button 
                    onClick={() => setIsAnnouncementModalOpen(true)}
                    className="w-full glass-card p-6 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-accent-100 p-3 rounded-xl group-hover:bg-accent-500 transition-colors">
                        <Megaphone className="w-6 h-6 text-accent-500 group-hover:text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-slate-800 font-semibold mb-1">Announcements</h3>
                        <p className="text-sm text-slate-500">Send updates to class or individual students</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && selectedStudent && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Student Header */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="w-16 h-16 rounded-full bg-slate-200 ring-4 ring-primary-200"
                  />
                  <div className="flex-1">
                    <h2 className="text-slate-800 font-semibold text-xl">{selectedStudent.name}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="px-3 py-1 rounded-full text-sm text-white font-medium" style={{ backgroundColor: getRiskColor(selectedStudent.riskLevel) }}>
                        {selectedStudent.riskLevel} Risk
                      </span>
                      <span className="text-sm text-slate-400">Weakest: <span className="text-primary-400">{selectedStudent.weakestTopic}</span></span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="px-4 py-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-xl transition-colors cursor-pointer font-medium"
                  >
                    Back to Overview
                  </button>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-primary-500/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-primary-500" />
                  </div>
                  <h3 className="text-slate-800 font-semibold">AI Analysis</h3>
                </div>
                {isLoadingInterventionPlan ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-400 mr-2" />
                    <span className="text-slate-400">Analyzing student performance...</span>
                  </div>
                ) : interventionPlan ? (
                  <div className={`border-l-4 p-4 rounded-xl ${
                    selectedStudent.riskLevel === RiskLevel.HIGH 
                      ? 'bg-red-50 border-red-500' 
                      : selectedStudent.riskLevel === RiskLevel.MEDIUM 
                        ? 'bg-amber-50 border-amber-500' 
                        : 'bg-emerald-50 border-emerald-500'
                  }`}>
                    <p className="text-slate-700 mb-3 font-medium">{interventionPlan.analysis.core_issue}</p>
                    <div className="space-y-1">
                      {interventionPlan.analysis.gaps.map((gap, index) => (
                        <p key={index} className="text-sm text-slate-600">• {gap}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500">Unable to generate analysis. Please try again.</p>
                )}
              </div>

              {/* AI Remedial Path - Timeline Visualization */}
              <div className="glass-card p-6">
                <h3 className="text-slate-800 font-semibold mb-6">AI-Generated Remedial Path</h3>
                {isLoadingInterventionPlan ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-400 mr-2" />
                    <span className="text-slate-400">Generating personalized learning path...</span>
                  </div>
                ) : interventionPlan ? (
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-accent-500"></div>
                    
                    <div className="space-y-6">
                      {interventionPlan.remedial_path.map((step) => {
                        const Icon = step.activityType === 'video' ? FileVideo : step.activityType === 'quiz' ? FileQuestion : FileText;
                        return (
                          <div key={step.step} className="relative flex items-start gap-4 pl-14">
                            {/* Timeline Node */}
                            <div className="absolute left-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-500/30 font-semibold">
                              {step.step}
                            </div>
                            
                            {/* Content Card */}
                            <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-primary-400 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 text-primary-500" />
                                <div>
                                  <p className="text-slate-800 font-medium">{step.topic}</p>
                                  <p className="text-xs text-slate-500 mt-1 capitalize">{step.activityType}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">Unable to generate learning path. Please try again.</p>
                )}
              </div>

              {/* Recommended Strategies */}
              <div className="glass-card p-6">
                <h3 className="text-slate-800 font-semibold mb-4">Recommended Teaching Strategies</h3>
                {isLoadingInterventionPlan ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-4 h-4 animate-spin text-primary-400 mr-2" />
                    <span className="text-slate-400">Generating recommendations...</span>
                  </div>
                ) : interventionPlan ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interventionPlan.strategies.map((strategy, index) => {
                      const Icon = strategy.icon === 'calendar' ? Calendar : strategy.icon === 'users' ? Users : strategy.icon === 'trophy' ? Trophy : Bell;
                      return (
                        <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-primary-400 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary-100 p-2 rounded-lg group-hover:bg-primary-500 transition-colors">
                              <Icon className="w-5 h-5 text-primary-500 group-hover:text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-slate-800 font-medium mb-1">{strategy.title}</p>
                              <p className="text-sm text-slate-600">{strategy.action}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500">Unable to generate strategies.</p>
                )}
              </div>

              {/* Export Printed Materials - Student Specific */}
              <div className="glass-card p-6">
                <h3 className="text-slate-800 font-semibold mb-4">Student Resources</h3>
                <button 
                  onClick={() => setIsExportModalOpen(true)}
                  className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl p-6 hover:from-primary-500 hover:to-accent-500 transition-all text-left group shadow-lg shadow-primary-500/20 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <Printer className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">Export Printed Materials</h4>
                      <p className="text-sm text-white/80">Generate personalized worksheets and study guides for {selectedStudent.name}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Date Range Filter */}
              <div className="glass-card p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-500" />
                    <span className="text-slate-800 font-medium">Time Period:</span>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { value: '7d', label: 'Last 7 Days' },
                      { value: '30d', label: 'Last 30 Days' },
                      { value: '90d', label: 'Last 90 Days' },
                      { value: 'all', label: 'All Time' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setAnalyticsDateRange(option.value as typeof analyticsDateRange)}
                        className={`px-4 py-2 rounded-xl text-sm transition-all cursor-pointer ${
                          analyticsDateRange === option.value
                            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                            : 'bg-white text-slate-600 hover:bg-primary-50 hover:text-primary-700 border border-primary-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                {analyticsDateRange !== 'all' && (
                  <p className="text-xs text-slate-500 mt-2">
                    Showing data from {analyticsDateRange === '7d' ? 'the past week' : analyticsDateRange === '30d' ? 'the past month' : 'the past 3 months'}
                  </p>
                )}
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6">
                  <p className="text-slate-500 mb-2 text-sm">Class Average</p>
                  <p className="text-3xl font-bold text-primary-700">{classAverage}%</p>
                  <div className="mt-4 bg-primary-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-full rounded-full" style={{ width: `${classAverage}%` }}></div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <p className="text-slate-500 mb-2 text-sm">Avg Engagement</p>
                  <p className="text-3xl font-bold text-emerald-600">{avgEngagement}%</p>
                  <div className="mt-4 bg-emerald-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full" style={{ width: `${avgEngagement}%` }}></div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <p className="text-slate-500 mb-2 text-sm">Students at Risk</p>
                  <p className="text-3xl font-bold text-accent-600">{studentsAtRisk}</p>
                  <p className="text-sm text-slate-500 mt-2">Require immediate attention</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart - Risk Distribution */}
                <div className="glass-card p-6">
                  <h3 className="text-slate-800 font-semibold mb-4">Risk Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}n                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(2,89,221,0.15)', borderRadius: '12px', color: '#334155' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart - Weak Topics */}
                <div className="glass-card p-6">
                  <h3 className="text-slate-800 font-semibold mb-4">Most Challenging Topics</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weakTopicsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(2,89,221,0.1)" />
                      <XAxis dataKey="topic" stroke="#64748B" />
                      <YAxis stroke="#64748B" />
                      <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(2,89,221,0.15)', borderRadius: '12px', color: '#334155' }} />
                      <Bar dataKey="students" fill="url(#purpleGradient)" radius={[4, 4, 0, 0]} />
                      <defs>
                        <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#A855F7" />
                          <stop offset="100%" stopColor="#7C3AED" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detailed Student Table */}
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-primary-100">
                  <h3 className="text-slate-800 font-semibold">Detailed Student Performance</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-primary-50/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Risk Level</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Quiz Avg</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Engagement</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Weakest Topic</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-100">
                      {students.map((student) => (
                        <tr key={student.id} className="hover:bg-primary-50/50 cursor-pointer transition-colors" onClick={() => { setActiveTab('dashboard'); setSelectedStudent(student); }}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full ring-2 ring-primary-100" />
                              <span className="text-sm text-slate-800">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs text-white rounded-full font-medium" style={{ backgroundColor: getRiskColor(student.riskLevel) }}>
                              {student.riskLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{student.avgQuizScore}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{student.engagementScore}%</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{student.weakestTopic}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-slate-800 font-semibold text-xl mb-2">Import Data</h2>
                <p className="text-slate-600">Upload class records and course materials to enhance AI predictions</p>
              </div>

              {/* Upload Result Banner */}
              {uploadResult && (
                <div className={`rounded-xl p-4 flex items-start gap-3 border ${
                  uploadResult.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' :
                  uploadResult.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                  'bg-red-500/10 border-red-500/30'
                }`}>
                  {uploadResult.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : uploadResult.type === 'warning' ? (
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${
                      uploadResult.type === 'success' ? 'text-emerald-900' :
                      uploadResult.type === 'warning' ? 'text-amber-900' :
                      'text-red-900'
                    }`}>{uploadResult.message}</p>
                    {uploadResult.details && uploadResult.details.length > 0 && (
                      <ul className={`mt-2 text-sm space-y-1 ${
                        uploadResult.type === 'success' ? 'text-emerald-700' :
                        uploadResult.type === 'warning' ? 'text-amber-700' :
                        'text-red-700'
                      }`}>
                        {uploadResult.details.map((detail, i) => (
                          <li key={i}>• {detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button 
                    onClick={() => setUploadResult(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Drag and Drop Zones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Class Records Upload */}
                <div 
                  className={`glass-card p-8 border-2 border-dashed transition-colors cursor-pointer ${
                    isUploadingRecords ? 'border-primary-400 bg-primary-500/10' : 'border-primary-200 hover:border-primary-500/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDropRecords}
                  onClick={() => classRecordsInputRef.current?.click()}
                >
                  <input 
                    ref={classRecordsInputRef}
                    type="file" 
                    className="hidden" 
                    accept=".csv,.xlsx,.xls,.pdf,.docx"
                    onChange={handleClassRecordsUpload}
                  />
                  <div className="flex flex-col items-center">
                    <div className={`p-4 rounded-full mb-4 ${isUploadingRecords ? 'bg-primary-500/20' : 'bg-primary-500/10'}`}>
                      {isUploadingRecords ? (
                        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
                      ) : (
                        <FileSpreadsheet className="w-8 h-8 text-primary-400" />
                      )}
                    </div>
                    <h3 className="text-slate-800 mb-2">Class Records</h3>
                    <p className="text-sm text-slate-600 text-center mb-4">
                      Upload student grades, attendance, and quiz scores
                    </p>
                    <div className="flex flex-wrap justify-center gap-1 mb-3">
                      {['.csv', '.xlsx', '.pdf'].map(ext => (
                        <span key={ext} className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs">
                          {ext}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">
                      {isUploadingRecords ? 'Processing...' : 'Click or drag & drop'}
                    </p>
                  </div>
                </div>

                {/* Course Materials Upload */}
                <div 
                  className={`glass-card p-8 border-2 border-dashed transition-colors cursor-pointer ${
                    isUploadingMaterials ? 'border-accent-400 bg-accent-500/10' : 'border-accent-200 hover:border-accent-500/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDropMaterials}
                  onClick={() => courseMaterialsInputRef.current?.click()}
                >
                  <input 
                    ref={courseMaterialsInputRef}
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleCourseMaterialsUpload}
                  />
                  <div className="flex flex-col items-center">
                    <div className={`p-4 rounded-full mb-4 ${isUploadingMaterials ? 'bg-accent-500/20' : 'bg-accent-500/10'}`}>
                      {isUploadingMaterials ? (
                        <Loader2 className="w-8 h-8 text-accent-400 animate-spin" />
                      ) : (
                        <FileText className="w-8 h-8 text-accent-400" />
                      )}
                    </div>
                    <h3 className="text-slate-800 mb-2">Course Materials</h3>
                    <p className="text-sm text-slate-600 text-center mb-4">
                      Upload syllabus, lesson plans, and curriculum documents
                    </p>
                    <div className="flex flex-wrap justify-center gap-1 mb-3">
                      {['.pdf', '.docx', '.txt'].map(ext => (
                        <span key={ext} className="px-2 py-0.5 bg-accent-100 text-accent-700 rounded text-xs">
                          {ext}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">
                      {isUploadingMaterials ? 'Analyzing...' : 'Click or drag & drop'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Parsed Students Preview */}
              {parsedStudentsPreview && parsedStudentsPreview.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="text-slate-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    Imported Students Preview
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-primary-50/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-slate-600">Name</th>
                          <th className="px-4 py-2 text-left text-slate-600">Quiz Avg</th>
                          <th className="px-4 py-2 text-left text-slate-600">Engagement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary-100">
                        {parsedStudentsPreview.map((student, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2 text-slate-800">{student.name}</td>
                            <td className="px-4 py-2 text-slate-700">{Math.round(student.avgQuizScore)}%</td>
                            <td className="px-4 py-2 text-slate-700">{Math.round(student.engagementScore)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {parsedStudentsPreview.length === 5 && (
                    <p className="text-xs text-slate-500 mt-2">Showing first 5 students...</p>
                  )}
                </div>
              )}

              {/* Course Material Info */}
              {courseMaterialInfo && (
                <div className="glass-card p-6">
                  <h3 className="text-slate-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent-500" />
                    Course Material Analysis: {courseMaterialInfo.filename}
                  </h3>
                  {courseMaterialInfo.topics.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-slate-600 mb-2">Detected Math Topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {courseMaterialInfo.topics.map((topic, i) => (
                          <span key={i} className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm capitalize">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {courseMaterialInfo.hasAssessments && (
                    <p className="text-sm text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Contains assessment/quiz information
                    </p>
                  )}
                </div>
              )}

              {/* Info Box */}
              <div className="bg-accent-50 border border-accent-200 rounded-xl p-6">
                <h4 className="text-accent-700 mb-2">How AI Uses Your Data</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>• <strong className="text-slate-800">Smart Format Detection:</strong> AI understands various spreadsheet formats and column names</li>
                  <li>• Analyzes historical performance patterns to predict at-risk students</li>
                  <li>• Maps curriculum topics to student knowledge gaps</li>
                  <li>• Generates personalized remedial learning paths</li>
                  <li>• All data is processed securely and never shared</li>
                </ul>
              </div>

              {/* Edit Class Records Button */}
              <div className="glass-card p-6">
                <h3 className="text-slate-800 mb-4">Manage Imported Data</h3>
                <button 
                  onClick={() => setIsEditClassRecordsModalOpen(true)}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-6 hover:from-primary-500 hover:to-primary-600 transition-all text-left group shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Edit2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white mb-1">Edit Class Records</h4>
                      <p className="text-sm text-white/90">Review and correct AI-analyzed student data • {students.length} students</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentAvatar={teacherAvatar}
        name={teacherName}
        role="teacher"
        email="prof.anderson@school.edu"
        onSave={handleProfileSave}
      />

      {/* Export Printed Materials Modal */}
      <ExportPrintedMaterialsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        students={students}
        selectedStudent={selectedStudent}
      />

      {/* External Link Validation Modal */}
      <ExternalLinkValidationModal
        isOpen={isExternalLinkModalOpen}
        onClose={() => setIsExternalLinkModalOpen(false)}
        links={externalLinks}
        onApprove={handleApproveLinkClick}
        onReject={handleRejectLink}
        students={students}
      />

      {/* Classroom Overview Modal */}
      <ClassroomOverviewModal
        isOpen={isClassroomOverviewModalOpen}
        onClose={() => setIsClassroomOverviewModalOpen(false)}
        classrooms={classrooms}
        onSelectClassroom={setCurrentClassroomId}
        currentClassroomId={currentClassroomId}
        students={students}
      />

      {/* Edit Class Records Modal */}
      <EditClassRecordsModal
        isOpen={isEditClassRecordsModalOpen}
        onClose={() => setIsEditClassRecordsModalOpen(false)}
        students={students}
        onSaveChanges={handleStudentsSave}
      />

      {/* Announcement Modal */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Create Announcement</h2>
              <button
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="Announcement title..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea
                  value={announcementMessage}
                  onChange={(e) => setAnnouncementMessage(e.target.value)}
                  placeholder="Write your announcement..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <div className="flex gap-2">
                  {(['info', 'success', 'warning', 'urgent'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setAnnouncementType(type)}
                      className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
                        announcementType === type
                          ? type === 'info' ? 'bg-blue-500 text-white'
                            : type === 'success' ? 'bg-emerald-500 text-white'
                            : type === 'warning' ? 'bg-amber-500 text-white'
                            : 'bg-red-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Send To</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAnnouncementTarget('classroom')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      announcementTarget === 'classroom'
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Current Classroom
                  </button>
                  <button
                    onClick={() => setAnnouncementTarget('all')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      announcementTarget === 'all'
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Students
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendAnnouncement}
                disabled={isSendingAnnouncement || !announcementTitle.trim() || !announcementMessage.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSendingAnnouncement ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Announcement
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}