import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  BookOpen, 
  MessageSquare,
  AlertCircle,
  Clock,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  Award
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { mockSystemStats, mockSystemUsers, mockModuleTemplates } from '../../utils/adminMockData';
import { mockStudents } from '../../utils/mockData';
import { RiskLevel, Student } from '../../types';
import { studentService } from '../../services/firebase';

export function SystemAnalytics() {
  const [dateRange, setDateRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState<'engagement' | 'chat' | 'modules'>('engagement');
  const [students, setStudents] = useState<Student[]>(mockStudents);

  // Load students from Firebase
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const firebaseStudents = await studentService.getAll();
        if (firebaseStudents.length > 0) {
          setStudents(firebaseStudents);
        }
      } catch (error) {
        console.error('Error loading students:', error);
      }
    };
    loadStudents();
  }, []);

  // Generate mock time-series data
  const engagementData = [
    { date: 'Jan 12', activeUsers: 65, engagement: 68, chatMessages: 120 },
    { date: 'Jan 13', activeUsers: 72, engagement: 71, chatMessages: 145 },
    { date: 'Jan 14', activeUsers: 78, engagement: 75, chatMessages: 160 },
    { date: 'Jan 15', activeUsers: 81, engagement: 73, chatMessages: 155 },
    { date: 'Jan 16', activeUsers: 76, engagement: 70, chatMessages: 140 },
    { date: 'Jan 17', activeUsers: 85, engagement: 74, chatMessages: 180 },
    { date: 'Jan 18', activeUsers: 87, engagement: 72, chatMessages: 234 }
  ];

  const moduleCompletionData = [
    { name: 'Videos', completed: 156, total: 200, color: '#8b5cf6' },
    { name: 'Quizzes', completed: 89, total: 120, color: '#0ea5e9' },
    { name: 'Exercises', completed: 234, total: 280, color: '#10b981' }
  ];

  const topicPerformance = [
    { topic: 'Calculus', avgScore: 72, students: 45 },
    { topic: 'Algebra', avgScore: 78, students: 52 },
    { topic: 'Trigonometry', avgScore: 65, students: 38 },
    { topic: 'Statistics', avgScore: 81, students: 28 },
    { topic: 'Geometry', avgScore: 75, students: 33 }
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: students.filter(s => s.riskLevel === RiskLevel.LOW).length, color: '#10b981' },
    { name: 'Medium Risk', value: students.filter(s => s.riskLevel === RiskLevel.MEDIUM).length, color: '#f59e0b' },
    { name: 'High Risk', value: students.filter(s => s.riskLevel === RiskLevel.HIGH).length, color: '#ef4444' }
  ];

  const hourlyActivity = [
    { hour: '6am', users: 12 },
    { hour: '8am', users: 45 },
    { hour: '10am', users: 78 },
    { hour: '12pm', users: 65 },
    { hour: '2pm', users: 82 },
    { hour: '4pm', users: 95 },
    { hour: '6pm', users: 68 },
    { hour: '8pm', users: 42 },
    { hour: '10pm', users: 18 }
  ];

  const teacherActivity = [
    { name: 'Prof. Anderson', studentsManaged: 45, modulesCreated: 12, linksApproved: 8 },
    { name: 'Ms. Johnson', studentsManaged: 38, modulesCreated: 8, linksApproved: 15 },
    { name: 'Mr. Garcia', studentsManaged: 32, modulesCreated: 5, linksApproved: 3 }
  ];

  const stats = [
    {
      title: 'Total Students',
      value: mockSystemStats.totalStudents,
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Avg Engagement',
      value: `${mockSystemStats.averageEngagement}%`,
      change: '+5%',
      trend: 'up',
      icon: Activity,
      color: 'green'
    },
    {
      title: 'AI Chat Sessions',
      value: mockSystemStats.chatMessagesToday,
      change: '+24%',
      trend: 'up',
      icon: MessageSquare,
      color: 'purple'
    },
    {
      title: 'At-Risk Students',
      value: mockSystemStats.studentsAtRisk,
      change: '-2',
      trend: 'down',
      icon: AlertCircle,
      color: 'red'
    }
  ];

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-primary-100 text-primary-600 border border-primary-200',
      green: 'bg-emerald-100 text-emerald-600 border border-emerald-200',
      purple: 'bg-secondary-100 text-secondary-600 border border-secondary-200',
      red: 'bg-red-100 text-red-600 border border-red-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">System Analytics</h3>
          <p className="text-sm text-slate-500">Comprehensive learning platform insights</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-white border border-primary-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-primary-200 rounded-xl text-sm text-slate-600 hover:bg-primary-50 transition-colors cursor-pointer">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${getColorClass(stat.color)}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trend */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-slate-800">Engagement Trend</h4>
              <p className="text-sm text-slate-500">Daily active users and engagement rate</p>
            </div>
            <div className="flex gap-2">
              {(['engagement', 'chat', 'modules'] as const).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors cursor-pointer ${
                    selectedMetric === metric
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                      : 'bg-primary-100 text-slate-600 hover:bg-primary-200'
                  }`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(2,89,221,0.1)" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(2,89,221,0.15)', borderRadius: '12px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area 
                type="monotone" 
                dataKey="activeUsers" 
                stroke="#0259DD" 
                fill="#0259DD" 
                fillOpacity={0.2}
                name="Active Users" 
              />
              <Area 
                type="monotone" 
                dataKey="engagement" 
                stroke="#FF6648" 
                fill="#FF6648" 
                fillOpacity={0.2}
                name="Engagement %" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="glass-card p-6">
          <div className="mb-4">
            <h4 className="font-semibold text-slate-800">Student Risk Distribution</h4>
            <p className="text-sm text-slate-500">AI-predicted risk levels across all students</p>
          </div>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={240}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(2,89,221,0.15)', borderRadius: '12px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-4">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{item.value}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-primary-100">
                <p className="text-sm text-slate-500">Total Students</p>
                <p className="text-xl font-bold text-slate-800">{students.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Performance */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="mb-4">
            <h4 className="font-semibold text-slate-800">Topic Performance</h4>
            <p className="text-sm text-slate-500">Average quiz scores by math topic</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topicPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(2,89,221,0.1)" />
              <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={12} />
              <YAxis dataKey="topic" type="category" stroke="#64748b" fontSize={12} width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(2,89,221,0.15)', borderRadius: '12px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="avgScore" fill="#0259DD" radius={[0, 4, 4, 0]} name="Avg Score %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Activity */}
        <div className="glass-card p-6">
          <div className="mb-4">
            <h4 className="font-semibold text-slate-800">Hourly Activity</h4>
            <p className="text-sm text-slate-500">Peak usage times today</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={hourlyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(2,89,221,0.1)" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(2,89,221,0.15)', borderRadius: '12px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="users" fill="#FF6648" radius={[4, 4, 0, 0]} name="Active Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Module Completion & Teacher Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Completion */}
        <div className="glass-card p-6">
          <div className="mb-4">
            <h4 className="font-semibold text-slate-800">Module Completion</h4>
            <p className="text-sm text-slate-500">Completion rates by module type</p>
          </div>
          <div className="space-y-4">
            {moduleCompletionData.map((module) => {
              const percentage = Math.round((module.completed / module.total) * 100);
              return (
                <div key={module.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{module.name}</span>
                    <span className="text-sm text-slate-500">{module.completed}/{module.total} ({percentage}%)</span>
                  </div>
                  <div className="h-3 bg-primary-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ width: `${percentage}%`, backgroundColor: module.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-primary-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Total Modules</span>
              <span className="font-semibold text-slate-800">{mockModuleTemplates.length}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-slate-500">Published</span>
              <span className="font-semibold text-emerald-600">
                {mockModuleTemplates.filter(m => m.status === 'published').length}
              </span>
            </div>
          </div>
        </div>

        {/* Teacher Activity */}
        <div className="glass-card p-6">
          <div className="mb-4">
            <h4 className="font-semibold text-slate-800">Teacher Activity</h4>
            <p className="text-sm text-slate-500">Content creation and student management</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-100">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase pb-3">Teacher</th>
                  <th className="text-center text-xs font-medium text-slate-500 uppercase pb-3">Students</th>
                  <th className="text-center text-xs font-medium text-slate-500 uppercase pb-3">Modules</th>
                  <th className="text-center text-xs font-medium text-slate-500 uppercase pb-3">Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-50">
                {teacherActivity.map((teacher) => (
                  <tr key={teacher.name}>
                    <td className="py-3">
                      <span className="text-sm font-medium text-slate-800">{teacher.name}</span>
                    </td>
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 text-sm font-medium border border-primary-200">
                        {teacher.studentsManaged}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary-100 text-secondary-600 text-sm font-medium border border-secondary-200">
                        {teacher.modulesCreated}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 text-sm font-medium border border-emerald-200">
                        {teacher.linksApproved}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 rounded-xl p-6 text-white border border-primary-500/30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="relative flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Target className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold mb-2">AI Analytics Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-white/70 text-sm">Key Insight</p>
                <p className="font-medium mt-1">Students struggling with Trigonometry show 25% lower engagement</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-white/70 text-sm">Recommendation</p>
                <p className="font-medium mt-1">Add more visual content for Unit Circle topics</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-white/70 text-sm">Prediction</p>
                <p className="font-medium mt-1">3 students likely to improve risk level this week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
