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
      case 'info': return 'text-primary-600 bg-primary-100 border border-primary-200';
      case 'warning': return 'text-amber-600 bg-amber-100 border border-amber-200';
      case 'error': return 'text-red-600 bg-red-100 border border-red-200';
      case 'critical': return 'text-red-700 bg-red-200 border border-red-300';
      default: return 'text-slate-500 bg-slate-100 border border-slate-200';
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
    <div className="min-h-screen bg-cream-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white/90 backdrop-blur-xl border-r border-primary-100 text-slate-800 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-primary-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-500 rounded-xl blur opacity-50"></div>
              <div className="relative bg-gradient-to-br from-primary-500 to-accent-600 p-2 rounded-xl shadow-md">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gradient">MathPulse AI</h1>
              <p className="text-xs text-slate-500">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20'
                  : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Admin Profile */}
        <div className="p-4 border-t border-primary-100">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-50 transition-colors cursor-pointer"
          >
            <img
              src={adminAvatar}
              alt={adminName}
              className="w-10 h-10 rounded-full border-2 border-primary-500"
            />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-slate-800">{adminName}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-slate-500 hover:bg-accent-50 hover:text-accent-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-primary-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
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
                  className="pl-10 pr-4 py-2 bg-white border border-primary-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                />
              </div>
              {/* Notifications */}
              <button className="relative p-2 text-slate-500 hover:bg-primary-50 rounded-xl transition-colors cursor-pointer">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full"></span>
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
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary-100 p-3 rounded-xl border border-primary-200">
                      <Users className="w-6 h-6 text-primary-600" />
                    </div>
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      +12%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{mockSystemStats.totalUsers}</p>
                  <p className="text-sm text-slate-500">Total Users</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-100 p-3 rounded-xl border border-green-200">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      +8%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{mockSystemStats.activeUsers24h}</p>
                  <p className="text-sm text-slate-500">Active (24h)</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-secondary-100 p-3 rounded-xl border border-secondary-200">
                      <MessageSquare className="w-6 h-6 text-secondary-600" />
                    </div>
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      +24%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{mockSystemStats.chatMessagesToday}</p>
                  <p className="text-sm text-slate-500">AI Chats Today</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-accent-100 p-3 rounded-xl border border-accent-200">
                      <AlertCircle className="w-6 h-6 text-accent-600" />
                    </div>
                    <span className="text-accent-600 text-sm font-medium">
                      Needs attention
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{mockSystemStats.studentsAtRisk}</p>
                  <p className="text-sm text-slate-500">Students at Risk</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Distribution */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-100">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">User Distribution</h3>
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
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-3">
                      {userDistribution.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm text-slate-600">{item.name}</span>
                          </div>
                          <span className="font-medium text-slate-800">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Weekly Activity */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-100">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Weekly Activity</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b' }} />
                      <Area type="monotone" dataKey="users" stroke="#0259DD" fill="#0259DD" fillOpacity={0.2} name="Active Users" />
                      <Area type="monotone" dataKey="chats" stroke="#84AFFB" fill="#84AFFB" fillOpacity={0.2} name="AI Chats" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* System Status & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* System Status */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-100">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">System Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-xl border border-green-200">
                          <Server className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm text-slate-600">System Uptime</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">{mockSystemStats.systemUptime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary-100 p-2 rounded-xl border border-primary-200">
                          <Database className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="text-sm text-slate-600">Last Backup</span>
                      </div>
                      <span className="text-sm font-medium text-slate-800">
                        {formatTimestamp(mockSystemStats.lastBackup)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-secondary-100 p-2 rounded-xl border border-secondary-200">
                          <Zap className="w-4 h-4 text-secondary-600" />
                        </div>
                        <span className="text-sm text-slate-600">AI Tutor</span>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                        <CheckCircle className="w-4 h-4" /> Online
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-accent-100 p-2 rounded-xl border border-accent-200">
                          <BookOpen className="w-4 h-4 text-accent-600" />
                        </div>
                        <span className="text-sm text-slate-600">Modules</span>
                      </div>
                      <span className="text-sm font-medium text-slate-800">{mockSystemStats.totalModules}</span>
                    </div>
                  </div>
                </div>

                {/* Risk Overview */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-100">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Student Risk Overview</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={riskDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" stroke="#64748b" fontSize={12} />
                      <YAxis dataKey="level" type="category" stroke="#64748b" fontSize={11} width={80} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b' }} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
                    <button 
                      onClick={() => setActiveTab('audit')}
                      className="text-sm text-primary-600 hover:text-primary-500 cursor-pointer"
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
                          <p className="text-sm text-slate-700 truncate">{log.action}</p>
                          <p className="text-xs text-slate-500">{formatTimestamp(log.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-primary-100 hover:border-primary-400 hover:bg-primary-50 transition-all cursor-pointer"
                  >
                    <div className="bg-primary-100 p-3 rounded-xl border border-primary-200">
                      <UserCog className="w-6 h-6 text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">Add User</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('content')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-primary-100 hover:border-secondary-400 hover:bg-secondary-50 transition-all cursor-pointer"
                  >
                    <div className="bg-secondary-100 p-3 rounded-xl border border-secondary-200">
                      <BookOpen className="w-6 h-6 text-secondary-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">New Module</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-primary-100 hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer"
                  >
                    <div className="bg-green-100 p-3 rounded-xl border border-green-200">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">View Reports</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-primary-100 hover:border-accent-400 hover:bg-accent-50 transition-all cursor-pointer"
                  >
                    <div className="bg-accent-100 p-3 rounded-xl border border-accent-200">
                      <Settings className="w-6 h-6 text-accent-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">Settings</span>
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
