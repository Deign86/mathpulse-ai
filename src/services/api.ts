/**
 * MathPulse AI - API Service
 * Connects React frontend to Python ML backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://deign86-mathpulse-api.hf.space';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: string;
}

interface ChatResponse {
  message: string;
  timestamp: string;
}

interface StudentData {
  id: string;
  name: string;
  engagementScore: number;
  avgQuizScore: number;
  weakestTopic: string;
  riskLevel?: string;
}

interface RiskPrediction {
  riskLevel: 'High' | 'Medium' | 'Low';
  confidence: number;
  analysis: string;
  factors: Array<{
    factor: string;
    severity: string;
    value: string;
  }>;
}

interface LearningStep {
  step: number;
  topic: string;
  type: 'video' | 'quiz' | 'exercise';
  duration: string;
}

interface LearningPathResponse {
  generatedPath: boolean;
  steps: LearningStep[];
  summary: string;
}

interface DailyInsight {
  insight: string;
  trends: Array<{
    metric: string;
    value: string;
    trend: 'up' | 'down';
  }>;
  focusTopic: string;
  recommendations: Array<{
    priority: string;
    action: string;
    impact: string;
  }>;
}

// File Upload Types
interface ParsedStudent {
  name: string;
  engagementScore: number;
  avgQuizScore: number;
  attendance?: number;
  weakestTopic: string;
  grades?: Record<string, number>;
  rawData?: Record<string, string>;
}

interface FileUploadResponse {
  success: boolean;
  students: ParsedStudent[];
  fileType: string;
  columnsDetected: string[];
  mappingConfidence: number;
  warnings: string[];
  rawPreview?: string;
  courseInfo?: Record<string, unknown>;
  studentCount: number;
}

interface CourseMaterialResponse {
  success: boolean;
  filename: string;
  courseInfo?: {
    detectedTopics: string[];
    outlineTopics: string[];
    dates: string[];
    wordCount: number;
    hasAssessments: boolean;
    hasObjectives: boolean;
  };
  textPreview?: string;
  error?: string;
}

interface SupportedFormatsResponse {
  classRecords: {
    formats: Array<{ extension: string; description: string; supported: boolean }>;
    maxSize: string;
    notes: string[];
  };
  courseMaterials: {
    formats: Array<{ extension: string; description: string; supported: boolean }>;
    maxSize: string;
    notes: string[];
  };
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Check if the backend is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Chat with the AI Math Tutor
   */
  async chat(message: string, conversationHistory?: ChatMessage[]): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: conversationHistory || [],
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Backend unavailable, using fallback response');
      return this.getFallbackChatResponse(message);
    }
  }

  /**
   * Predict risk level for a student
   */
  async predictRisk(student: StudentData): Promise<RiskPrediction> {
    try {
      const response = await fetch(`${this.baseUrl}/api/predict-risk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });

      if (!response.ok) {
        throw new Error(`Risk prediction API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Backend unavailable, using fallback risk prediction');
      return this.getFallbackRiskPrediction(student);
    }
  }

  /**
   * Batch predict risk for multiple students
   */
  async batchPredictRisk(students: StudentData[]): Promise<{ predictions: (RiskPrediction & { studentId: string; studentName: string })[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/predict-risk/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ students }),
      });

      if (!response.ok) {
        throw new Error(`Batch risk prediction API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Backend unavailable, using fallback predictions');
      return {
        predictions: students.map(s => ({
          studentId: s.id,
          studentName: s.name,
          ...this.getFallbackRiskPrediction(s),
        })),
      };
    }
  }

  /**
   * Generate a personalized learning path
   */
  async generateLearningPath(studentData: {
    studentId: string;
    weakestTopic: string;
    avgQuizScore: number;
    engagementScore: number;
  }): Promise<LearningPathResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/learning-path`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error(`Learning path API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Backend unavailable, using fallback learning path');
      return this.getFallbackLearningPath(studentData.weakestTopic);
    }
  }

  /**
   * Get daily AI insight for the class
   */
  async getDailyInsight(students: StudentData[]): Promise<DailyInsight> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analytics/daily-insight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ students }),
      });

      if (!response.ok) {
        throw new Error(`Daily insight API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Backend unavailable, using fallback insight');
      return this.getFallbackDailyInsight(students);
    }
  }

  // ============ Fallback Methods ============

  private getFallbackChatResponse(message: string): ChatResponse {
    const keywords = message.toLowerCase();
    let responseText: string;

    if (keywords.includes('derivative') || keywords.includes('differentiate')) {
      responseText = "The derivative measures how a function changes as its input changes. Think of it as the 'instantaneous rate of change' or the slope of the tangent line at any point. For example, if f(x) = x², then f'(x) = 2x. Would you like me to walk through more examples?";
    } else if (keywords.includes('chain rule')) {
      responseText = "The chain rule is used when you have a function inside another function (composition). If y = f(g(x)), then dy/dx = f'(g(x)) × g'(x). Think of it as 'derivative of the outside × derivative of the inside'. What specific problem are you working on?";
    } else if (keywords.includes('integral') || keywords.includes('integrate')) {
      responseText = "Integration is the reverse of differentiation. While derivatives give us rates of change, integrals help us find areas under curves and accumulate quantities. The basic rule: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. What would you like to integrate?";
    } else if (keywords.includes('limit')) {
      responseText = "Limits describe what value a function approaches as the input gets closer to some value. We write it as lim(x→a) f(x) = L. Limits are the foundation of calculus - they help us define derivatives and integrals precisely. What limit are you trying to solve?";
    } else {
      responseText = "That's a great question! I'm here to help you understand math concepts better. Could you tell me more about what specific part you're finding challenging? Breaking it down into smaller steps often helps.";
    }

    return {
      message: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  private getFallbackRiskPrediction(student: StudentData): RiskPrediction {
    const combinedScore = (student.engagementScore + student.avgQuizScore) / 2;
    
    let riskLevel: 'High' | 'Medium' | 'Low';
    let confidence: number;
    
    if (combinedScore < 55) {
      riskLevel = 'High';
      confidence = 85.0;
    } else if (combinedScore < 75) {
      riskLevel = 'Medium';
      confidence = 75.0;
    } else {
      riskLevel = 'Low';
      confidence = 80.0;
    }

    const factors: RiskPrediction['factors'] = [];
    
    if (student.avgQuizScore < 60) {
      factors.push({ factor: 'Low quiz performance', severity: 'high', value: `${student.avgQuizScore}%` });
    } else if (student.avgQuizScore < 75) {
      factors.push({ factor: 'Below average quiz scores', severity: 'medium', value: `${student.avgQuizScore}%` });
    }
    
    if (student.engagementScore < 50) {
      factors.push({ factor: 'Low engagement', severity: 'high', value: `${student.engagementScore}%` });
    } else if (student.engagementScore < 70) {
      factors.push({ factor: 'Moderate engagement', severity: 'medium', value: `${student.engagementScore}%` });
    }

    return {
      riskLevel,
      confidence,
      analysis: `Based on engagement (${student.engagementScore}%) and quiz performance (${student.avgQuizScore}%), this student shows ${riskLevel.toLowerCase()} risk indicators.`,
      factors,
    };
  }

  private getFallbackLearningPath(topic: string): LearningPathResponse {
    const topicLower = topic.toLowerCase();
    
    let steps: LearningStep[];
    
    if (topicLower.includes('derivative') || topicLower.includes('calculus')) {
      steps = [
        { step: 1, topic: 'Visual Introduction to Derivatives', type: 'video', duration: '12 min' },
        { step: 2, topic: 'Understanding Rate of Change', type: 'video', duration: '10 min' },
        { step: 3, topic: 'Basic Differentiation Rules Quiz', type: 'quiz', duration: '15 min' },
        { step: 4, topic: 'Chain Rule Practice', type: 'exercise', duration: '20 min' },
        { step: 5, topic: 'Comprehensive Derivatives Assessment', type: 'quiz', duration: '25 min' },
      ];
    } else if (topicLower.includes('quadratic') || topicLower.includes('algebra')) {
      steps = [
        { step: 1, topic: 'Quadratic Functions Overview', type: 'video', duration: '10 min' },
        { step: 2, topic: 'Factoring Techniques', type: 'video', duration: '12 min' },
        { step: 3, topic: 'Quadratic Formula Practice', type: 'exercise', duration: '15 min' },
        { step: 4, topic: 'Graphing Parabolas', type: 'exercise', duration: '18 min' },
        { step: 5, topic: 'Quadratic Equations Mastery Quiz', type: 'quiz', duration: '20 min' },
      ];
    } else {
      steps = [
        { step: 1, topic: `Introduction to ${topic}`, type: 'video', duration: '12 min' },
        { step: 2, topic: 'Core Concepts Review', type: 'video', duration: '10 min' },
        { step: 3, topic: 'Fundamentals Check Quiz', type: 'quiz', duration: '15 min' },
        { step: 4, topic: 'Guided Practice Problems', type: 'exercise', duration: '20 min' },
        { step: 5, topic: 'Comprehensive Review', type: 'quiz', duration: '25 min' },
      ];
    }

    return {
      generatedPath: false,
      steps,
      summary: `Remedial learning path for ${topic}`,
    };
  }

  private getFallbackDailyInsight(students: StudentData[]): DailyInsight {
    const totalStudents = students.length || 1;
    const avgEngagement = students.reduce((acc, s) => acc + s.engagementScore, 0) / totalStudents;
    const avgQuiz = students.reduce((acc, s) => acc + s.avgQuizScore, 0) / totalStudents;
    const highRisk = students.filter(s => s.riskLevel === 'High').length;

    let insight: string;
    
    if (highRisk > totalStudents * 0.3) {
      insight = `⚠️ Alert: ${highRisk} students (${Math.round(highRisk / totalStudents * 100)}%) are at high risk. Consider scheduling intervention sessions.`;
    } else if (avgEngagement < 60) {
      insight = `📊 Class engagement is at ${Math.round(avgEngagement)}%. Consider interactive activities to boost participation.`;
    } else {
      insight = `📈 Class is performing steadily with ${Math.round(avgQuiz)}% average. Keep up the good work!`;
    }

    return {
      insight,
      trends: [
        { metric: 'Class Average', value: `${Math.round(avgQuiz)}%`, trend: avgQuiz > 70 ? 'up' : 'down' },
        { metric: 'Engagement', value: `${Math.round(avgEngagement)}%`, trend: avgEngagement > 65 ? 'up' : 'down' },
        { metric: 'At Risk', value: `${highRisk} students`, trend: highRisk < 3 ? 'down' : 'up' },
      ],
      focusTopic: 'Calculus - Derivatives',
      recommendations: [
        { priority: 'medium', action: 'Review foundational concepts as a class', impact: 'Strengthen baseline understanding' },
      ],
    };
  }

  // ============ File Upload Methods ============

  /**
   * Upload and parse class records file (CSV, Excel, PDF)
   */
  async uploadClassRecords(file: File): Promise<FileUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/api/upload/class-records`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
        throw new Error(error.detail || `Upload error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Class records upload error:', error);
      throw error;
    }
  }

  /**
   * Upload and analyze course materials (syllabus, lesson plans)
   */
  async uploadCourseMaterials(file: File): Promise<CourseMaterialResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/api/upload/course-materials`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
        throw new Error(error.detail || `Upload error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Course materials upload error:', error);
      throw error;
    }
  }

  /**
   * Generate quiz questions for a topic
   */
  async generateQuizQuestions(topic: string, difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate', count: number = 4): Promise<{
    questions: Array<{
      id: number;
      question: string;
      options: string[];
      correct: string;
      explanation?: string;
    }>;
    topic: string;
    difficulty: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/quiz/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, difficulty, count }),
      });

      if (!response.ok) {
        throw new Error(`Quiz generation API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Backend unavailable, using fallback quiz questions');
      return this.getFallbackQuizQuestions(topic, difficulty, count);
    }
  }

  private getFallbackQuizQuestions(topic: string, difficulty: string, count: number): {
    questions: Array<{
      id: number;
      question: string;
      options: string[];
      correct: string;
      explanation?: string;
    }>;
    topic: string;
    difficulty: string;
  } {
    // Topic-specific question banks
    const questionBanks: Record<string, Array<{
      question: string;
      options: string[];
      correct: string;
      explanation: string;
      difficulty: string;
    }>> = {
      'derivatives': [
        { question: "What is the derivative of f(x) = x²?", options: ["x", "2x", "x²", "2"], correct: "2x", explanation: "Using the power rule: d/dx[x²] = 2x²⁻¹ = 2x", difficulty: "beginner" },
        { question: "What is the power rule for derivatives?", options: ["d/dx[xⁿ] = nxⁿ⁻¹", "d/dx[xⁿ] = xⁿ⁺¹", "d/dx[xⁿ] = nxⁿ", "d/dx[xⁿ] = xⁿ"], correct: "d/dx[xⁿ] = nxⁿ⁻¹", explanation: "The power rule states: bring down the exponent and reduce it by 1", difficulty: "beginner" },
        { question: "What is the derivative of f(x) = 5x³ + 2x?", options: ["15x² + 2", "5x² + 2", "15x³ + 2x", "5x⁴ + x²"], correct: "15x² + 2", explanation: "Apply the power rule to each term: d/dx[5x³] = 15x², d/dx[2x] = 2", difficulty: "intermediate" },
        { question: "The derivative represents the _____ of change.", options: ["speed", "rate", "average", "total"], correct: "rate", explanation: "The derivative gives us the instantaneous rate of change of a function", difficulty: "beginner" },
        { question: "What is the derivative of f(x) = sin(x)?", options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"], correct: "cos(x)", explanation: "The derivative of sin(x) is cos(x) - a fundamental trigonometric derivative", difficulty: "intermediate" },
        { question: "Using the chain rule, find d/dx[sin(2x)]", options: ["2cos(2x)", "cos(2x)", "-2cos(2x)", "2sin(2x)"], correct: "2cos(2x)", explanation: "Chain rule: derivative of outer × derivative of inner = cos(2x) × 2", difficulty: "advanced" },
        { question: "What is the derivative of e^x?", options: ["e^x", "xe^(x-1)", "e^(x-1)", "xe^x"], correct: "e^x", explanation: "The exponential function e^x is its own derivative!", difficulty: "intermediate" },
        { question: "Find the derivative of f(x) = ln(x)", options: ["1/x", "ln(x)/x", "x", "1/ln(x)"], correct: "1/x", explanation: "The derivative of the natural logarithm is 1/x", difficulty: "intermediate" },
      ],
      'quadratic equations': [
        { question: "What is the standard form of a quadratic equation?", options: ["ax² + bx + c = 0", "ax + b = 0", "a²x + bx = c", "x² = a"], correct: "ax² + bx + c = 0", explanation: "The standard form has the squared term first, then linear, then constant", difficulty: "beginner" },
        { question: "What is the quadratic formula?", options: ["x = (-b ± √(b²-4ac)) / 2a", "x = -b / 2a", "x = √(b² - 4ac)", "x = (-b ± √(b²+4ac)) / 2a"], correct: "x = (-b ± √(b²-4ac)) / 2a", explanation: "The quadratic formula gives both solutions to ax² + bx + c = 0", difficulty: "intermediate" },
        { question: "Solve: x² - 5x + 6 = 0", options: ["x = 2, 3", "x = -2, -3", "x = 1, 6", "x = -1, 6"], correct: "x = 2, 3", explanation: "Factor: (x-2)(x-3) = 0, so x = 2 or x = 3", difficulty: "beginner" },
        { question: "What does the discriminant (b²-4ac) tell us?", options: ["Number of real solutions", "The vertex", "The y-intercept", "The axis of symmetry"], correct: "Number of real solutions", explanation: "If > 0: two real solutions, = 0: one solution, < 0: no real solutions", difficulty: "intermediate" },
        { question: "What is the vertex form of a quadratic?", options: ["a(x-h)² + k", "ax² + bx + c", "(x-a)(x-b)", "a(x+h)² - k"], correct: "a(x-h)² + k", explanation: "Vertex form directly shows the vertex at point (h, k)", difficulty: "intermediate" },
      ],
      'trigonometry': [
        { question: "What is sin(π/2)?", options: ["1", "0", "-1", "undefined"], correct: "1", explanation: "At π/2 (90°), sine reaches its maximum value of 1", difficulty: "beginner" },
        { question: "What is cos(0)?", options: ["1", "0", "-1", "undefined"], correct: "1", explanation: "At 0°, cosine equals 1 (rightmost point on unit circle)", difficulty: "beginner" },
        { question: "What is the Pythagorean identity?", options: ["sin²θ + cos²θ = 1", "sinθ + cosθ = 1", "sin²θ - cos²θ = 1", "tanθ = 1"], correct: "sin²θ + cos²θ = 1", explanation: "This comes from x² + y² = 1 on the unit circle", difficulty: "intermediate" },
        { question: "What is tan(45°)?", options: ["1", "0", "√2", "undefined"], correct: "1", explanation: "tan(45°) = sin(45°)/cos(45°) = (√2/2)/(√2/2) = 1", difficulty: "beginner" },
        { question: "Convert 180° to radians", options: ["π", "2π", "π/2", "π/4"], correct: "π", explanation: "180° = π radians (half circle)", difficulty: "beginner" },
      ],
      'default': [
        { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correct: "4", explanation: "Basic arithmetic: 2 + 2 = 4", difficulty: "beginner" },
        { question: "What is 5 × 7?", options: ["30", "35", "40", "45"], correct: "35", explanation: "5 times 7 equals 35", difficulty: "beginner" },
        { question: "Simplify: 3x + 2x", options: ["5x", "6x", "5x²", "6"], correct: "5x", explanation: "Combine like terms: 3x + 2x = 5x", difficulty: "beginner" },
        { question: "What is 12 ÷ 4?", options: ["2", "3", "4", "8"], correct: "3", explanation: "12 divided by 4 equals 3", difficulty: "beginner" },
      ]
    };

    // Find matching topic
    const topicLower = topic.toLowerCase();
    let questions = questionBanks['default'];
    
    for (const [key, bank] of Object.entries(questionBanks)) {
      if (topicLower.includes(key) || key.includes(topicLower)) {
        questions = bank;
        break;
      }
    }

    // Filter by difficulty and limit count
    const filteredQuestions = questions
      .filter(q => difficulty === 'intermediate' || q.difficulty === difficulty)
      .slice(0, count)
      .map((q, idx) => ({
        id: idx + 1,
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation
      }));

    // If not enough questions, pad with default
    while (filteredQuestions.length < count && filteredQuestions.length < questions.length) {
      const remaining = questions[filteredQuestions.length];
      filteredQuestions.push({
        id: filteredQuestions.length + 1,
        question: remaining.question,
        options: remaining.options,
        correct: remaining.correct,
        explanation: remaining.explanation
      });
    }

    return {
      questions: filteredQuestions,
      topic,
      difficulty
    };
  }

  /**
   * Get supported file formats information
   */
  async getSupportedFormats(): Promise<SupportedFormatsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/upload/supported-formats`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Could not fetch supported formats');
      // Return default formats
      return {
        classRecords: {
          formats: [
            { extension: '.csv', description: 'Comma-separated values', supported: true },
            { extension: '.xlsx', description: 'Excel workbook', supported: true },
            { extension: '.pdf', description: 'PDF with tables', supported: true },
          ],
          maxSize: '10MB',
          notes: ['AI will automatically detect column mappings'],
        },
        courseMaterials: {
          formats: [
            { extension: '.pdf', description: 'PDF documents', supported: true },
            { extension: '.docx', description: 'Word documents', supported: true },
          ],
          maxSize: '10MB',
          notes: ['Extracts curriculum topics and structure'],
        },
      };
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
