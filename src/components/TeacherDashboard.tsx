import { useState } from 'react';
import { BrainCircuit, LayoutDashboard, BarChart3, Upload, User, Search, Sparkles, Activity, Printer, Megaphone, Trophy, Users, Bell, FileVideo, FileQuestion, FileText, ChevronRight, LogOut, Download, Shield, BookOpen, ChevronDown, Calendar, Edit2 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Student, RiskLevel } from '../types';
import { mockStudents, mockActivities, mockInterventionPlan, mockClassrooms, mockExternalLinks } from '../utils/mockData';
import { ProfileEditModal } from './ProfileEditModal';
import { ExportPrintedMaterialsModal } from './ExportPrintedMaterialsModal';
import { ExternalLinkValidationModal } from './ExternalLinkValidationModal';
import { ClassroomOverviewModal } from './ClassroomOverviewModal';
import { EditClassRecordsModal } from './EditClassRecordsModal';

const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case RiskLevel.HIGH: return '#ef4444';
    case RiskLevel.MEDIUM: return '#f59e0b';
    case RiskLevel.LOW: return '#10b981';
  }
};

interface TeacherDashboardProps {
  onLogout: () => void;
}

export function TeacherDashboard({ onLogout }: TeacherDashboardProps) {
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
  const [teacherAvatar, setTeacherAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Anderson');
  const [teacherName, setTeacherName] = useState('Prof. Anderson');

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

  // Filter students by current classroom
  const currentClassroom = mockClassrooms.find(c => c.id === currentClassroomId);
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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Sidebar - Student List */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-brand-500 to-brand-900 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-sky-900">MathPulse AI</span>
          </div>

          {/* Classroom Selector */}
          <button
            onClick={() => setIsClassroomOverviewModalOpen(true)}
            className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all shadow-md hover:shadow-lg group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <div className="text-left">
                  <p className="text-sm text-white/90">Current Classroom</p>
                  <p className="text-white">{currentClassroom?.section}</p>
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
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
        
        {/* Student List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`border-l-4 bg-white rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                selectedStudent?.id === student.id ? 'shadow-lg ring-2 ring-brand-500' : 'shadow-sm'
              }`}
              style={{ borderLeftColor: getRiskColor(student.riskLevel) }}
            >
              <div className="flex items-start gap-3">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-10 h-10 rounded-full bg-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 truncate">{student.name}</p>
                  <p className="text-xs text-slate-500 mt-1">Avg Score: {student.avgQuizScore}%</p>
                  
                  {/* Mini Progress Bar */}
                  <div className="mt-2 bg-slate-100 rounded-full h-1.5 overflow-hidden">
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
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Navigation Tabs */}
            <nav className="flex gap-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-brand-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-brand-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'import'
                    ? 'bg-brand-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Upload className="w-4 h-4" />
                Import Data
              </button>
            </nav>
            
            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-slate-900">{teacherName}</p>
                <p className="text-xs text-slate-500">Mathematics Teacher</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-900 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
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
              <div className="bg-gradient-to-r from-brand-500 via-sky-500 to-brand-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-white mb-2">Daily AI Insight</h2>
                    <p className="text-white/90">
                      <span className="inline-block animate-pulse">Analyzing class trends...</span>
                      <br />
                      2 students showing improved engagement this week. Sarah Chen may need immediate intervention on derivatives.
                    </p>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live Classroom Pulse */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-brand-500" />
                    <h3 className="text-slate-900">Live Classroom Pulse</h3>
                  </div>
                  <div className="space-y-3">
                    {mockActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                          <Activity className="w-4 h-4 text-brand-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900">
                            <span className="text-brand-600">{activity.studentName}</span> {activity.action}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Grid */}
                <div className="space-y-4">
                  <button 
                    onClick={() => setIsExternalLinkModalOpen(true)}
                    className="w-full bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all text-left group relative"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-100 p-3 rounded-lg group-hover:bg-indigo-500 transition-colors">
                        <Shield className="w-6 h-6 text-indigo-600 group-hover:text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-slate-900 mb-1">Validate AI Links</h3>
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

                  <button className="w-full bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all text-left group">
                    <div className="flex items-center gap-4">
                      <div className="bg-amber-100 p-3 rounded-lg group-hover:bg-amber-500 transition-colors">
                        <Megaphone className="w-6 h-6 text-amber-600 group-hover:text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-slate-900 mb-1">Announcements</h3>
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
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="w-16 h-16 rounded-full bg-slate-200"
                  />
                  <div className="flex-1">
                    <h2 className="text-slate-900">{selectedStudent.name}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm text-white`} style={{ backgroundColor: getRiskColor(selectedStudent.riskLevel) }}>
                        {selectedStudent.riskLevel} Risk
                      </span>
                      <span className="text-sm text-slate-600">Weakest: {selectedStudent.weakestTopic}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Back to Overview
                  </button>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-slate-900 mb-4">AI Analysis</h3>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-slate-900 mb-3">{mockInterventionPlan.analysis.core_issue}</p>
                  <div className="space-y-1">
                    {mockInterventionPlan.analysis.gaps.map((gap, index) => (
                      <p key={index} className="text-sm text-slate-600">• {gap}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Remedial Path - Timeline Visualization */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-slate-900 mb-6">AI-Generated Remedial Path</h3>
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-500 to-brand-900"></div>
                  
                  <div className="space-y-6">
                    {mockInterventionPlan.remedial_path.map((step) => {
                      const Icon = step.activityType === 'video' ? FileVideo : step.activityType === 'quiz' ? FileQuestion : FileText;
                      return (
                        <div key={step.step} className="relative flex items-start gap-4 pl-14">
                          {/* Timeline Node */}
                          <div className="absolute left-0 w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center text-white shadow-lg">
                            {step.step}
                          </div>
                          
                          {/* Content Card */}
                          <div className="flex-1 bg-slate-50 rounded-lg p-4 border-2 border-slate-200 hover:border-brand-500 transition-colors">
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 text-brand-600" />
                              <div>
                                <p className="text-slate-900">{step.topic}</p>
                                <p className="text-xs text-slate-500 mt-1 capitalize">{step.activityType}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recommended Strategies */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-slate-900 mb-4">Recommended Teaching Strategies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockInterventionPlan.strategies.map((strategy, index) => {
                    const Icon = strategy.icon === 'calendar' ? Calendar : strategy.icon === 'users' ? Users : strategy.icon === 'trophy' ? Trophy : Bell;
                    return (
                      <div key={index} className="bg-slate-50 rounded-lg p-4 border-2 border-slate-200 hover:border-brand-500 transition-colors cursor-pointer group">
                        <div className="flex items-start gap-3">
                          <div className="bg-white p-2 rounded-lg group-hover:bg-brand-500 transition-colors">
                            <Icon className="w-5 h-5 text-brand-600 group-hover:text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-900 mb-1">{strategy.title}</p>
                            <p className="text-sm text-slate-600">{strategy.action}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Export Printed Materials - Student Specific */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-slate-900 mb-4">Student Resources</h3>
                <button 
                  onClick={() => setIsExportModalOpen(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:from-purple-600 hover:to-purple-700 transition-all text-left group shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Printer className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white mb-1">Export Printed Materials</h4>
                      <p className="text-sm text-white/90">Generate personalized worksheets and study guides for {selectedStudent.name}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <p className="text-slate-600 mb-2">Class Average</p>
                  <p className="text-slate-900">{classAverage}%</p>
                  <div className="mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-brand-500 h-full rounded-full" style={{ width: `${classAverage}%` }}></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <p className="text-slate-600 mb-2">Avg Engagement</p>
                  <p className="text-slate-900">{avgEngagement}%</p>
                  <div className="mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: `${avgEngagement}%` }}></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <p className="text-slate-600 mb-2">Students at Risk</p>
                  <p className="text-risk-high">{studentsAtRisk}</p>
                  <p className="text-sm text-slate-500 mt-2">Require immediate attention</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart - Risk Distribution */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-slate-900 mb-4">Risk Distribution</h3>
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
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart - Weak Topics */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-slate-900 mb-4">Most Challenging Topics</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weakTopicsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="topic" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="students" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detailed Student Table */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-slate-900">Detailed Student Performance</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Risk Level</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Quiz Avg</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Engagement</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Weakest Topic</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {students.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => { setActiveTab('dashboard'); setSelectedStudent(student); }}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full" />
                              <span className="text-sm text-slate-900">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs text-white rounded-full" style={{ backgroundColor: getRiskColor(student.riskLevel) }}>
                              {student.riskLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{student.avgQuizScore}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{student.engagementScore}%</td>
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
                <h2 className="text-slate-900 mb-2">Import Data</h2>
                <p className="text-slate-600">Upload class records and course materials to enhance AI predictions</p>
              </div>

              {/* Drag and Drop Zones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Class Records CSV */}
                <div className="bg-white rounded-xl p-8 shadow-sm border-2 border-dashed border-slate-300 hover:border-brand-500 transition-colors cursor-pointer">
                  <input type="file" id="csv-upload" className="hidden" accept=".csv" />
                  <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="bg-brand-100 p-4 rounded-full mb-4">
                      <Upload className="w-8 h-8 text-brand-600" />
                    </div>
                    <h3 className="text-slate-900 mb-2">Class Records (CSV)</h3>
                    <p className="text-sm text-slate-500 text-center mb-4">
                      Upload student grades, attendance, and quiz scores
                    </p>
                    <p className="text-xs text-slate-400">Click to browse or drag & drop</p>
                  </label>
                </div>

                {/* Course Materials */}
                <div className="bg-white rounded-xl p-8 shadow-sm border-2 border-dashed border-slate-300 hover:border-brand-500 transition-colors cursor-pointer">
                  <input type="file" id="syllabus-upload" className="hidden" accept=".pdf,.doc,.docx" />
                  <label htmlFor="syllabus-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="bg-amber-100 p-4 rounded-full mb-4">
                      <FileText className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-slate-900 mb-2">Course Materials</h3>
                    <p className="text-sm text-slate-500 text-center mb-4">
                      Upload syllabus, lesson plans, and curriculum documents
                    </p>
                    <p className="text-xs text-slate-400">Click to browse or drag & drop</p>
                  </label>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="text-blue-900 mb-2">How AI Uses Your Data</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Analyzes historical performance patterns to predict at-risk students</li>
                  <li>• Maps curriculum topics to student knowledge gaps</li>
                  <li>• Generates personalized remedial learning paths</li>
                  <li>• All data is processed securely and never shared</li>
                </ul>
              </div>

              {/* Edit Class Records Button */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-slate-900 mb-4">Manage Imported Data</h3>
                <button 
                  onClick={() => setIsEditClassRecordsModalOpen(true)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl p-6 hover:from-emerald-600 hover:to-emerald-700 transition-all text-left group shadow-md hover:shadow-lg"
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
      />

      {/* External Link Validation Modal */}
      <ExternalLinkValidationModal
        isOpen={isExternalLinkModalOpen}
        onClose={() => setIsExternalLinkModalOpen(false)}
        links={externalLinks}
        onApprove={handleApproveLinkClick}
        onReject={handleRejectLink}
      />

      {/* Classroom Overview Modal */}
      <ClassroomOverviewModal
        isOpen={isClassroomOverviewModalOpen}
        onClose={() => setIsClassroomOverviewModalOpen(false)}
        classrooms={mockClassrooms}
        onSelectClassroom={setCurrentClassroomId}
        currentClassroomId={currentClassroomId}
      />

      {/* Edit Class Records Modal */}
      <EditClassRecordsModal
        isOpen={isEditClassRecordsModalOpen}
        onClose={() => setIsEditClassRecordsModalOpen(false)}
        students={students}
        onSaveChanges={setStudents}
      />
    </div>
  );
}