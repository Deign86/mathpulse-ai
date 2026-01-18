import { useState } from 'react';
import { 
  BrainCircuit, 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3, 
  FileText, 
  Shield, 
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Activity,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Clock,
  Database,
  Server,
  Zap,
  BookOpen,
  GraduationCap,
  UserCog,
  MessageSquare
} from 'lucide-react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { UserAccount } from '../utils/demoAccounts';
import { mockSystemStats, mockAuditLog, mockSystemUsers, mockModuleTemplates } from '../utils/adminMockData';
import { ProfileEditModal } from './ProfileEditModal';
import { UserManagement } from './admin/UserManagement';
import { SystemSettingsPanel } from './admin/SystemSettings';
import { ContentManagement } from './admin/ContentManagement';
import { AuditLogPanel } from './admin/AuditLog';
import { SystemAnalytics } from './admin/SystemAnalytics';

interface AdminPanelProps {
  onLogout: () => void;
  currentUser: UserAccount;
}

type AdminTab = 'overview' | 'users' | 'analytics' | 'content' | 'settings' | 'audit';

export function AdminPanel({ onLogout, currentUser }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [adminAvatar, setAdminAvatar] = useState(currentUser.avatar);
  const [adminName, setAdminName] = useState(currentUser.name);

  const handleProfileSave = (newAvatar: string, newName: string) => {
    setAdminAvatar(newAvatar);
    setAdminName(newName);
  };

  // Data for charts
  const userDistribution = [
    { name: 'Students', value: mockSystemStats.totalStudents, color: '#0ea5e9' },
    { name: 'Teachers', value: mockSystemStats.totalTeachers, color: '#8b5cf6' },
    { name: 'Admins', value: mockSystemStats.totalAdmins, color: '#f59e0b' }
  ];

  const weeklyActivity = [
    { day: 'Mon', users: 65, chats: 120 },
    { day: 'Tue', users: 72, chats: 145 },
    { day: 'Wed', users: 78, chats: 160 },
    { day: 'Thu', users: 81, chats: 155 },
    { day: 'Fri', users: 87, chats: 234 },
    { day: 'Sat', users: 45, chats: 80 },
    { day: 'Sun', users: 38, chats: 65 }
  ];

  const riskDistribution = [
    { level: 'High Risk', count: 12, color: '#ef4444' },
    { level: 'Medium Risk', count: 34, color: '#f59e0b' },
    { level: 'Low Risk', count: 102, color: '#10b981' }
  ];

  const recentLogs = mockAuditLog.slice(0, 5);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'users' as const, label: 'User Management', icon: Users },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'content' as const, label: 'Content', icon: BookOpen },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
    { id: 'audit' as const, label: 'Audit Log', icon: Shield }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-amber-600 bg-amber-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'critical': return 'text-red-800 bg-red-100';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">MathPulse AI</h1>
              <p className="text-xs text-slate-400">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                activeTab === tab.id
                  ? 'bg-brand-500 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Admin Profile */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <img
              src={adminAvatar}
              alt={adminName}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white">{adminName}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-slate-500">
                Manage and monitor your MathPulse AI system
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
                />
              </div>
              {/* Notifications */}
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      +12%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{mockSystemStats.totalUsers}</p>
                  <p className="text-sm text-slate-500">Total Users</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      +8%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{mockSystemStats.activeUsers24h}</p>
                  <p className="text-sm text-slate-500">Active (24h)</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      +24%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{mockSystemStats.chatMessagesToday}</p>
                  <p className="text-sm text-slate-500">AI Chats Today</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <span className="text-red-600 text-sm font-medium">
                      Needs attention
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{mockSystemStats.studentsAtRisk}</p>
                  <p className="text-sm text-slate-500">Students at Risk</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Distribution */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">User Distribution</h3>
                  <div className="flex items-center">
                    <ResponsiveContainer width="50%" height={200}>
                      <PieChart>
                        <Pie
                          data={userDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {userDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-3">
                      {userDistribution.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm text-slate-600">{item.name}</span>
                          </div>
                          <span className="font-medium text-slate-900">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Weekly Activity */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Weekly Activity</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip />
                      <Area type="monotone" dataKey="users" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} name="Active Users" />
                      <Area type="monotone" dataKey="chats" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="AI Chats" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* System Status & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* System Status */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">System Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Server className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm text-slate-600">System Uptime</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">{mockSystemStats.systemUptime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Database className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm text-slate-600">Last Backup</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        {formatTimestamp(mockSystemStats.lastBackup)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Zap className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-sm text-slate-600">AI Tutor</span>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                        <CheckCircle className="w-4 h-4" /> Online
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-lg">
                          <BookOpen className="w-4 h-4 text-amber-600" />
                        </div>
                        <span className="text-sm text-slate-600">Modules</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900">{mockSystemStats.totalModules}</span>
                    </div>
                  </div>
                </div>

                {/* Risk Overview */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Student Risk Overview</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={riskDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" stroke="#64748b" fontSize={12} />
                      <YAxis dataKey="level" type="category" stroke="#64748b" fontSize={11} width={80} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                    <button 
                      onClick={() => setActiveTab('audit')}
                      className="text-sm text-brand-600 hover:text-brand-700"
                    >
                      View all
                    </button>
                  </div>
                  <div className="space-y-3">
                    {recentLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-full ${getSeverityColor(log.severity)}`}>
                          <Activity className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900 truncate">{log.action}</p>
                          <p className="text-xs text-slate-500">{formatTimestamp(log.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-200 hover:border-brand-500 hover:bg-brand-50 transition-all"
                  >
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <UserCog className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Add User</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('content')}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-200 hover:border-brand-500 hover:bg-brand-50 transition-all"
                  >
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">New Module</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-200 hover:border-brand-500 hover:bg-brand-50 transition-all"
                  >
                    <div className="bg-green-100 p-3 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">View Reports</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-200 hover:border-brand-500 hover:bg-brand-50 transition-all"
                  >
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <Settings className="w-6 h-6 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Settings</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'analytics' && <SystemAnalytics />}
          {activeTab === 'content' && <ContentManagement />}
          {activeTab === 'settings' && <SystemSettingsPanel />}
          {activeTab === 'audit' && <AuditLogPanel />}
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentAvatar={adminAvatar}
        name={adminName}
        role="admin"
        email={currentUser.email}
        onSave={handleProfileSave}
      />
    </div>
  );
}
