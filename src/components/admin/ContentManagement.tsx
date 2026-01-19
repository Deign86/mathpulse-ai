import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  FileVideo, 
  FileQuestion, 
  FileText,
  Edit2,
  Trash2,
  Eye,
  Copy,
  MoreVertical,
  Calendar,
  Clock,
  Users,
  BookOpen,
  Archive,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { mockModuleTemplates, mockSystemUsers, getUsersByRole } from '../../utils/adminMockData';
import { mockClassrooms } from '../../utils/mockData';
import { ModuleTemplate, Classroom } from '../../types';
import { classroomService } from '../../services/firebase';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export function ContentManagement() {
  const [modules, setModules] = useState<ModuleTemplate[]>(mockModuleTemplates);
  const [classrooms, setClassrooms] = useState<Classroom[]>(mockClassrooms);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'quiz' | 'exercise'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleTemplate | null>(null);
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  const teachers = getUsersByRole('teacher');

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

  // Filter modules
  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          module.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || module.type === filterType;
    const matchesStatus = filterStatus === 'all' || module.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: ModuleTemplate['type']) => {
    switch (type) {
      case 'video': return FileVideo;
      case 'quiz': return FileQuestion;
      case 'exercise': return FileText;
    }
  };

  const getTypeColor = (type: ModuleTemplate['type']) => {
    switch (type) {
      case 'video': return 'bg-purple-100 text-purple-600';
      case 'quiz': return 'bg-green-100 text-green-600';
      case 'exercise': return 'bg-blue-100 text-blue-600';
    }
  };

  const getStatusColor = (status: ModuleTemplate['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-amber-100 text-amber-700';
      case 'archived': return 'bg-slate-100 text-slate-600';
    }
  };

  const getDifficultyColor = (difficulty: ModuleTemplate['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-100 text-emerald-700';
      case 'intermediate': return 'bg-blue-100 text-blue-700';
      case 'advanced': return 'bg-purple-100 text-purple-700';
    }
  };

  const handlePublish = (moduleId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, status: 'published' as const, updatedAt: new Date().toISOString() } : m
    ));
  };

  const handleArchive = (moduleId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, status: 'archived' as const, updatedAt: new Date().toISOString() } : m
    ));
  };

  const handleDelete = (moduleId: string) => {
    setModuleToDelete(moduleId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (moduleToDelete) {
      setModules(modules.filter(m => m.id !== moduleToDelete));
      setModuleToDelete(null);
    }
  };

  const handleDuplicate = (module: ModuleTemplate) => {
    const newModule: ModuleTemplate = {
      ...module,
      id: `module-${Date.now()}`,
      title: `${module.title} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: undefined
    };
    setModules([newModule, ...modules]);
  };

  const handleBulkAction = (action: 'publish' | 'archive' | 'delete') => {
    if (selectedModules.size === 0) return;
    
    if (action === 'delete') {
      setBulkDeleteConfirmOpen(true);
      return;
    }
    
    setModules(modules.map(m => 
      selectedModules.has(m.id) 
        ? { ...m, status: action === 'publish' ? 'published' as const : 'archived' as const }
        : m
    ));
    setSelectedModules(new Set());
  };

  const confirmBulkDelete = () => {
    setModules(modules.filter(m => !selectedModules.has(m.id)));
    setSelectedModules(new Set());
  };

  const toggleSelectAll = () => {
    if (selectedModules.size === filteredModules.length) {
      setSelectedModules(new Set());
    } else {
      setSelectedModules(new Set(filteredModules.map(m => m.id)));
    }
  };

  const toggleSelect = (moduleId: string) => {
    const newSelected = new Set(selectedModules);
    if (newSelected.has(moduleId)) {
      newSelected.delete(moduleId);
    } else {
      newSelected.add(moduleId);
    }
    setSelectedModules(newSelected);
  };

  // Stats
  const stats = {
    total: modules.length,
    published: modules.filter(m => m.status === 'published').length,
    draft: modules.filter(m => m.status === 'draft').length,
    archived: modules.filter(m => m.status === 'archived').length
  };

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Module"
        description="Are you sure you want to delete this module? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        open={bulkDeleteConfirmOpen}
        onOpenChange={setBulkDeleteConfirmOpen}
        title="Delete Multiple Modules"
        description={`Are you sure you want to delete ${selectedModules.size} modules? This action cannot be undone.`}
        confirmText="Delete All"
        variant="destructive"
        onConfirm={confirmBulkDelete}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Content Management</h3>
          <p className="text-sm text-slate-500">Manage learning modules, templates, and educational content</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            onClick={() => {
              setEditingModule(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Module
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Total Modules</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <p className="text-sm text-slate-500">Published</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-amber-500" />
            <p className="text-sm text-slate-500">Drafts</p>
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats.draft}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2">
            <Archive className="w-4 h-4 text-slate-500" />
            <p className="text-sm text-slate-500">Archived</p>
          </div>
          <p className="text-2xl font-bold text-slate-600">{stats.archived}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search modules by title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Types</option>
              <option value="video">Videos</option>
              <option value="quiz">Quizzes</option>
              <option value="exercise">Exercises</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedModules.size > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm text-slate-600">{selectedModules.size} module(s) selected</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('publish')}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkAction('archive')}
                className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Archive
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modules Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedModules.size === filteredModules.length && filteredModules.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-brand-500 rounded focus:ring-brand-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Module</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Difficulty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredModules.map((module) => {
                const TypeIcon = getTypeIcon(module.type);
                return (
                  <tr key={module.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedModules.has(module.id)}
                        onChange={() => toggleSelect(module.id)}
                        className="w-4 h-4 text-brand-500 rounded focus:ring-brand-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(module.type)}`}>
                          <TypeIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{module.title}</p>
                          <p className="text-xs text-slate-500">{module.topic}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${getTypeColor(module.type)}`}>
                        {module.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${getDifficultyColor(module.difficulty)}`}>
                        {module.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(module.status)}`}>
                        {module.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{module.assignedClassrooms.length}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-slate-600">
                        {new Date(module.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingModule(module);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(module)}
                          className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {module.status === 'draft' && (
                          <button
                            onClick={() => handlePublish(module.id)}
                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Publish"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {module.status === 'published' && (
                          <button
                            onClick={() => handleArchive(module.id)}
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Archive"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(module.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
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

        {filteredModules.length === 0 && (
          <div className="py-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No modules found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Module Modal */}
      {isModalOpen && (
        <ModuleModal
          module={editingModule}
          classrooms={classrooms}
          teachers={teachers}
          onClose={() => {
            setIsModalOpen(false);
            setEditingModule(null);
          }}
          onSave={(moduleData) => {
            if (editingModule) {
              setModules(modules.map(m => m.id === editingModule.id ? { ...m, ...moduleData, updatedAt: new Date().toISOString() } : m));
            } else {
              const newModule: ModuleTemplate = {
                ...moduleData as ModuleTemplate,
                id: `module-${Date.now()}`,
                createdAt: new Date().toISOString(),
                status: 'draft'
              };
              setModules([newModule, ...modules]);
            }
            setIsModalOpen(false);
            setEditingModule(null);
          }}
        />
      )}
    </div>
  );
}

// Module Modal Component
interface ModuleModalProps {
  module: ModuleTemplate | null;
  classrooms: Classroom[];
  teachers: ReturnType<typeof getUsersByRole>;
  onClose: () => void;
  onSave: (data: Partial<ModuleTemplate>) => void;
}

function ModuleModal({ module, classrooms, teachers, onClose, onSave }: ModuleModalProps) {
  const [formData, setFormData] = useState({
    title: module?.title || '',
    description: module?.description || '',
    type: module?.type || 'video' as ModuleTemplate['type'],
    topic: module?.topic || '',
    difficulty: module?.difficulty || 'beginner' as ModuleTemplate['difficulty'],
    duration: module?.duration || '15 min',
    assignedClassrooms: module?.assignedClassrooms || [] as string[],
    createdBy: module?.createdBy || teachers[0]?.name || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleClassroom = (classroomId: string) => {
    setFormData({
      ...formData,
      assignedClassrooms: formData.assignedClassrooms.includes(classroomId)
        ? formData.assignedClassrooms.filter(id => id !== classroomId)
        : [...formData.assignedClassrooms, classroomId]
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            {module ? 'Edit Module' : 'Create New Module'}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {module ? 'Update module details and assignments' : 'Add a new learning module to the platform'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="e.g., Introduction to Derivatives"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                rows={3}
                placeholder="Brief description of the module content..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ModuleTemplate['type'] })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="video">Video</option>
                  <option value="quiz">Quiz</option>
                  <option value="exercise">Exercise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g., Calculus"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as ModuleTemplate['difficulty'] })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g., 15 min"
                />
              </div>
            </div>
          </div>

          {/* Classroom Assignment */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Assign to Classrooms</label>
            <div className="border border-slate-200 rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto">
              {classrooms.map((classroom) => (
                <label key={classroom.id} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.assignedClassrooms.includes(classroom.id)}
                    onChange={() => toggleClassroom(classroom.id)}
                    className="w-4 h-4 text-brand-500 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm text-slate-700">{classroom.name} - {classroom.section}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all"
            >
              {module ? 'Save Changes' : 'Create Module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
