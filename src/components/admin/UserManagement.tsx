import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  MoreVertical,
  User,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  GraduationCap,
  BookOpen,
  X,
  Save,
  Eye,
  EyeOff,
  Filter,
  Download,
  Upload,
  Loader2
} from 'lucide-react';
import { SystemUser, UserRole, UserStatus, Classroom } from '../../types';
import { mockSystemUsers } from '../../utils/adminMockData';
import { mockClassrooms } from '../../utils/mockData';
import { adminUserService, classroomService, UserProfile } from '../../services/firebase';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useToast } from '../ui/Toast';

export function UserManagement() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>(mockClassrooms);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  const toast = useToast();

  // Load classrooms from Firebase
  useEffect(() => {
    const loadClassrooms = async () => {
      try {
        const firebaseClassrooms = await classroomService.getAll();
        if (firebaseClassrooms.length > 0) {
          setClassrooms(firebaseClassrooms);
        }
      } catch (error) {
        console.error('Error loading classrooms:', error);
      }
    };
    loadClassrooms();
  }, []);

  // Load users from Firebase on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const firebaseUsers = await adminUserService.getAllUsers();
        if (firebaseUsers.length > 0) {
          // Convert UserProfile to SystemUser format
          const systemUsers: SystemUser[] = firebaseUsers.map(u => ({
            id: u.uid,
            email: u.email,
            name: u.name,
            avatar: u.avatar,
            role: u.role,
            status: (u as any).status || 'active',
            department: u.department,
            gradeLevel: u.gradeLevel,
            classroomId: u.classroomId,
            lastLogin: (u as any).lastLogin ? ((u as any).lastLogin instanceof Date ? (u as any).lastLogin.toISOString() : String((u as any).lastLogin)) : undefined,
            createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt)
          }));
          setUsers(systemUsers);
        } else {
          // Fall back to mock data
          setUsers(mockSystemUsers);
        }
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers(mockSystemUsers);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as UserRole,
    status: 'active' as UserStatus,
    department: '',
    gradeLevel: '',
    classroomId: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return Shield;
      case 'teacher': return BookOpen;
      case 'student': return GraduationCap;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'text-accent-600 bg-accent-100 border border-accent-200';
      case 'teacher': return 'text-primary-600 bg-primary-100 border border-primary-200';
      case 'student': return 'text-green-600 bg-green-100 border border-green-200';
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 border border-green-200';
      case 'inactive': return 'text-slate-500 bg-slate-100 border border-slate-200';
      case 'suspended': return 'text-red-600 bg-red-100 border border-red-200';
    }
  };

  const getStatusIcon = (status: UserStatus) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'inactive': return XCircle;
      case 'suspended': return AlertCircle;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleCreateUser = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'student',
      status: 'active',
      department: '',
      gradeLevel: '',
      classroomId: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleEditUser = (user: SystemUser) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
      department: user.department || '',
      gradeLevel: user.gradeLevel || '',
      classroomId: user.classroomId || ''
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    setUserToDelete(userId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await adminUserService.deleteUser(userToDelete);
      setUsers(prev => prev.filter(u => u.id !== userToDelete));
      toast.success('User Deleted', 'The user has been removed successfully.');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Delete Failed', 'Failed to delete user. Please try again.');
    }
    setUserToDelete(null);
  };

  const handleToggleStatus = async (userId: string, currentStatus: UserStatus) => {
    const newStatus: UserStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await adminUserService.updateUserStatus(userId, newStatus);
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: newStatus, updatedAt: new Date().toISOString() } : u
      ));
      toast.success('Status Updated', `User has been ${newStatus === 'active' ? 'activated' : 'suspended'}.`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Update Failed', 'Failed to update user status. Please try again.');
    }
  };

  const handleSaveUser = async () => {
    try {
      setIsSaving(true);
      if (isEditModalOpen && selectedUser) {
        // Update existing user
        await adminUserService.updateUser(selectedUser.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department || undefined,
          gradeLevel: formData.gradeLevel || undefined,
          classroomId: formData.classroomId || undefined
        });
        setUsers(prev => prev.map(u => 
          u.id === selectedUser.id 
            ? { 
                ...u, 
                ...formData,
                updatedAt: new Date().toISOString()
              } 
            : u
        ));
        setIsEditModalOpen(false);
      } else {
        // Create new user
        const userId = await adminUserService.createUser(formData.email, formData.password, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name)}`,
          department: formData.department || undefined,
          gradeLevel: formData.gradeLevel || undefined,
          classroomId: formData.classroomId || undefined
        });
        const newUser: SystemUser = {
          id: userId,
          ...formData,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setUsers(prev => [...prev, newUser]);
        setIsCreateModalOpen(false);
      }
      setSelectedUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Save Failed', 'Failed to save user. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    students: users.filter(u => u.role === 'student').length
  };

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDeleteUser}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-100">
          <p className="text-2xl font-bold text-slate-800">{userStats.total}</p>
          <p className="text-sm text-slate-500">Total Users</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-100">
          <p className="text-2xl font-bold text-green-600">{userStats.active}</p>
          <p className="text-sm text-slate-500">Active</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-100">
          <p className="text-2xl font-bold text-accent-600">{userStats.admins}</p>
          <p className="text-sm text-slate-500">Admins</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-100">
          <p className="text-2xl font-bold text-primary-600">{userStats.teachers}</p>
          <p className="text-sm text-slate-500">Teachers</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-100">
          <p className="text-2xl font-bold text-green-600">{userStats.students}</p>
          <p className="text-sm text-slate-500">Students</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-primary-50 border border-primary-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
              className="px-3 py-2 bg-primary-50 border border-primary-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
              className="px-3 py-2 bg-primary-50 border border-primary-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-primary-200 rounded-xl text-sm text-slate-600 hover:bg-primary-50 transition-colors cursor-pointer">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handleCreateUser}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm hover:from-primary-400 hover:to-primary-500 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-primary-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50 border-b border-primary-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Department/Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                const StatusIcon = getStatusIcon(user.status);
                return (
                  <tr key={user.id} className="hover:bg-primary-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full bg-primary-100 border border-primary-200"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-800">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        <RoleIcon className="w-3 h-3" />
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.department || user.gradeLevel || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit user"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            user.status === 'active' 
                              ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-100' 
                              : 'text-green-500 hover:text-green-600 hover:bg-green-100'
                          }`}
                          title={user.status === 'active' ? 'Suspend user' : 'Activate user'}
                        >
                          {user.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No users found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col border border-primary-100 shadow-2xl">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {isEditModalOpen ? 'Edit User' : 'Create New User'}
                  </h3>
                  <p className="text-sm text-white/80">
                    {isEditModalOpen ? 'Update user information' : 'Add a new user to the system'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="text-white/70 hover:text-white transition-colors hover:bg-white/10 p-2 rounded-lg cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-cream-50">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-primary-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-primary-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter email address"
                />
              </div>

              {/* Password */}
              {!isEditModalOpen && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 pr-10 bg-white border border-primary-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Must include uppercase, lowercase, number, and special character</p>
                </div>
              )}

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 bg-white border border-primary-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                  className="w-full px-3 py-2 bg-white border border-primary-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {/* Conditional Fields */}
              {formData.role === 'teacher' || formData.role === 'admin' ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-primary-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter department"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Grade Level</label>
                    <select
                      value={formData.gradeLevel}
                      onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-primary-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select grade level</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11">Grade 11</option>
                      <option value="Grade 12">Grade 12</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Classroom</label>
                    <select
                      value={formData.classroomId}
                      onChange={(e) => setFormData({ ...formData, classroomId: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-primary-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select classroom</option>
                      {classrooms.map(classroom => (
                        <option key={classroom.id} value={classroom.id}>
                          {classroom.name} - {classroom.section}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-primary-100 p-4 flex justify-end gap-3 bg-white">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-primary-200 rounded-xl text-slate-600 hover:bg-primary-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-400 hover:to-primary-500 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {isEditModalOpen ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
