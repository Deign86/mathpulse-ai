import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download,
  Calendar,
  Clock,
  User,
  Shield,
  AlertTriangle,
  Info,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText
} from 'lucide-react';
import { mockAuditLog, getRecentAuditLogs } from '../../utils/adminMockData';
import { AuditLogEntry } from '../../types';

export function AuditLogPanel() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(mockAuditLog);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<AuditLogEntry['category'] | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<AuditLogEntry['severity'] | 'all'>('all');
  const [filterRole, setFilterRole] = useState<AuditLogEntry['userRole'] | 'all'>('all');
  const [dateRange, setDateRange] = useState('7d');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  
  const itemsPerPage = 10;

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    const matchesRole = filterRole === 'all' || log.userRole === filterRole;
    return matchesSearch && matchesCategory && matchesSeverity && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSeverityIcon = (severity: AuditLogEntry['severity']) => {
    switch (severity) {
      case 'info': return Info;
      case 'warning': return AlertTriangle;
      case 'error': return AlertCircle;
      case 'critical': return XCircle;
    }
  };

  const getSeverityColor = (severity: AuditLogEntry['severity']) => {
    switch (severity) {
      case 'info': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30';
      case 'warning': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'error': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'critical': return 'text-red-300 bg-red-600/20 border-red-600/30';
    }
  };

  const getCategoryColor = (category: AuditLogEntry['category']) => {
    switch (category) {
      case 'auth': return 'text-purple-400 bg-purple-500/20 border border-purple-500/30';
      case 'user': return 'text-cyan-400 bg-cyan-500/20 border border-cyan-500/30';
      case 'content': return 'text-emerald-400 bg-emerald-500/20 border border-emerald-500/30';
      case 'system': return 'text-slate-300 bg-slate-500/20 border border-slate-500/30';
      case 'data': return 'text-amber-400 bg-amber-500/20 border border-amber-500/30';
    }
  };

  const getRoleIcon = (role: AuditLogEntry['userRole']) => {
    switch (role) {
      case 'admin': return Shield;
      case 'teacher': return User;
      case 'student': return User;
    }
  };

  const getRoleColor = (role: AuditLogEntry['userRole']) => {
    switch (role) {
      case 'admin': return 'text-purple-400';
      case 'teacher': return 'text-cyan-400';
      case 'student': return 'text-emerald-400';
    }
  };

  // Stats
  const stats = {
    total: logs.length,
    info: logs.filter(l => l.severity === 'info').length,
    warning: logs.filter(l => l.severity === 'warning').length,
    error: logs.filter(l => l.severity === 'error').length,
    critical: logs.filter(l => l.severity === 'critical').length
  };

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Role', 'Action', 'Category', 'Severity', 'Details', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.userName,
        log.userRole,
        `"${log.action}"`,
        log.category,
        log.severity,
        `"${log.details}"`,
        log.ipAddress || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Audit Log</h3>
          <p className="text-sm text-slate-500">System activity monitoring and security events</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-white border border-primary-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-primary-200 rounded-xl text-sm text-slate-600 hover:bg-primary-50 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card p-4">
          <p className="text-sm text-slate-500">Total Events</p>
          <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
        </div>
        <div className="glass-card p-4 border-primary-200">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary-500" />
            <p className="text-sm text-slate-500">Info</p>
          </div>
          <p className="text-2xl font-bold text-primary-600">{stats.info}</p>
        </div>
        <div className="glass-card p-4 border-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <p className="text-sm text-slate-500">Warnings</p>
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats.warning}</p>
        </div>
        <div className="glass-card p-4 border-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-slate-500">Errors</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.error}</p>
        </div>
        <div className="glass-card p-4 border-red-300">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-slate-500">Critical</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by user, action, or details..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-primary-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value as typeof filterCategory); setCurrentPage(1); }}
              className="px-3 py-2 bg-white border border-primary-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              <option value="auth">Authentication</option>
              <option value="user">User</option>
              <option value="content">Content</option>
              <option value="system">System</option>
              <option value="data">Data</option>
            </select>
            <select
              value={filterSeverity}
              onChange={(e) => { setFilterSeverity(e.target.value as typeof filterSeverity); setCurrentPage(1); }}
              className="px-3 py-2 bg-white border border-primary-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Severity</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
            <select
              value={filterRole}
              onChange={(e) => { setFilterRole(e.target.value as typeof filterRole); setCurrentPage(1); }}
              className="px-3 py-2 bg-white border border-primary-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>
      </div>

      {/* Log Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50 border-b border-primary-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Severity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Details</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-50">
              {paginatedLogs.map((log) => {
                const SeverityIcon = getSeverityIcon(log.severity);
                const RoleIcon = getRoleIcon(log.userRole);
                return (
                  <tr key={log.id} className="hover:bg-primary-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getSeverityColor(log.severity)}`}>
                        <SeverityIcon className="w-3 h-3" />
                        <span className="capitalize">{log.severity}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <RoleIcon className={`w-4 h-4 ${getRoleColor(log.userRole)}`} />
                        <div>
                          <p className="text-sm font-medium text-white">{log.userName}</p>
                          <p className="text-xs text-slate-500 capitalize">{log.userRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-white">{log.action}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${getCategoryColor(log.category)}`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-400 truncate max-w-xs" title={log.details}>
                        {log.details}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-2 text-slate-400 hover:text-primary-400 hover:bg-primary-500/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No log entries found matching your criteria</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-slate-400 hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                        : 'text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-slate-400 hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg border border-white/10">
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-primary-600 to-primary-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Log Details</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4 bg-[#1A1425]">
              <div className="flex items-center gap-3">
                {(() => {
                  const SeverityIcon = getSeverityIcon(selectedLog.severity);
                  return (
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border ${getSeverityColor(selectedLog.severity)}`}>
                      <SeverityIcon className="w-4 h-4" />
                      <span className="capitalize font-medium">{selectedLog.severity}</span>
                    </div>
                  );
                })()}
                <span className={`px-3 py-1.5 rounded-full text-sm ${getCategoryColor(selectedLog.category)}`}>
                  {selectedLog.category}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Timestamp</p>
                  <p className="text-sm text-white mt-1">{selectedLog.timestamp}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">User</p>
                  <div className="flex items-center gap-2 mt-1">
                    {(() => {
                      const RoleIcon = getRoleIcon(selectedLog.userRole);
                      return <RoleIcon className={`w-4 h-4 ${getRoleColor(selectedLog.userRole)}`} />;
                    })()}
                    <span className="text-sm text-white">{selectedLog.userName}</span>
                    <span className="text-xs text-slate-500">({selectedLog.userRole})</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Action</p>
                  <p className="text-sm text-white mt-1">{selectedLog.action}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Details</p>
                  <p className="text-sm text-slate-300 mt-1 bg-white/5 p-3 rounded-xl border border-white/10">{selectedLog.details}</p>
                </div>

                {selectedLog.ipAddress && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">IP Address</p>
                    <p className="text-sm text-white mt-1 font-mono">{selectedLog.ipAddress}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Event ID</p>
                  <p className="text-sm text-white mt-1 font-mono">{selectedLog.id}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-white/10 flex justify-end bg-[#1A1425]">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-white/10 text-slate-300 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
