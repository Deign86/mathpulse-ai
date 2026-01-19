import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, AlertCircle, CheckCircle, Edit2 } from 'lucide-react';
import { Student, RiskLevel } from '../types';
import { ConfirmDialog } from './ui/ConfirmDialog';

interface EditClassRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onSaveChanges: (updatedStudents: Student[]) => void;
}

export function EditClassRecordsModal({ isOpen, onClose, students, onSaveChanges }: EditClassRecordsModalProps) {
  const [editedStudents, setEditedStudents] = useState<Student[]>(students);
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  // Sync editedStudents when students prop changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setEditedStudents(students);
      setHasChanges(false);
    }
  }, [students, isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = (studentId: string, field: keyof Student, value: any) => {
    setEditedStudents(prev => 
      prev.map(student => 
        student.id === studentId ? { ...student, [field]: value } : student
      )
    );
    setHasChanges(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudentToDelete(studentId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteStudent = () => {
    if (studentToDelete) {
      setEditedStudents(prev => prev.filter(s => s.id !== studentToDelete));
      setHasChanges(true);
      setStudentToDelete(null);
    }
  };

  const handleAddStudent = () => {
    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: 'New Student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=New',
      riskLevel: RiskLevel.LOW,
      avgQuizScore: 0,
      engagementScore: 0,
      weakestTopic: 'Not analyzed',
      classroomId: 'class-1'
    };
    setEditedStudents(prev => [...prev, newStudent]);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSaveChanges(editedStudents);
    setShowConfirmation(true);
    setHasChanges(false);
    setTimeout(() => {
      setShowConfirmation(false);
      onClose();
    }, 2000);
  };

  const handleCancel = () => {
    if (hasChanges) {
      setCloseConfirmOpen(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setEditedStudents(students);
    setHasChanges(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Remove Student"
        description="Are you sure you want to remove this student from the records? This action can be undone by canceling without saving."
        confirmText="Remove"
        variant="destructive"
        onConfirm={confirmDeleteStudent}
      />

      {/* Close Confirmation Dialog */}
      <ConfirmDialog
        open={closeConfirmOpen}
        onOpenChange={setCloseConfirmOpen}
        title="Unsaved Changes"
        description="You have unsaved changes. Are you sure you want to close? Your changes will be lost."
        confirmText="Discard Changes"
        variant="destructive"
        onConfirm={confirmClose}
      />

      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-900 p-6 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-white mb-1">Edit Class Records</h2>
            <p className="text-brand-100 text-sm">Review and correct AI-analyzed data • {editedStudents.length} students</p>
          </div>
          <button
            onClick={handleCancel}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Alert Banner */}
        {hasChanges && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-900">You have unsaved changes</p>
              <p className="text-sm text-amber-700 mt-1">Don't forget to save your changes before closing.</p>
            </div>
          </div>
        )}

        {/* Success Confirmation */}
        {showConfirmation && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-900">Changes saved successfully!</p>
              <p className="text-sm text-green-700 mt-1">AI will re-analyze the updated data.</p>
            </div>
          </div>
        )}

        {/* Table Container */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200">
            <div className="flex items-start gap-3">
              <Edit2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-900 mb-1">How to edit records</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Click on any cell to edit student information directly</li>
                  <li>• Use the dropdown menus to change risk levels and classroom assignments</li>
                  <li>• Add new students manually if they're missing from the import</li>
                  <li>• Remove incorrect entries using the delete button</li>
                  <li>• Changes will trigger AI re-analysis automatically after saving</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Student Name</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Risk Level</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Quiz Average (%)</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Engagement (%)</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Weakest Topic</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {editedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) => handleFieldChange(student.id, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={student.riskLevel}
                        onChange={(e) => handleFieldChange(student.id, 'riskLevel', e.target.value as RiskLevel)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                      >
                        <option value={RiskLevel.HIGH}>High</option>
                        <option value={RiskLevel.MEDIUM}>Medium</option>
                        <option value={RiskLevel.LOW}>Low</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={student.avgQuizScore}
                        onChange={(e) => handleFieldChange(student.id, 'avgQuizScore', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={student.engagementScore}
                        onChange={(e) => handleFieldChange(student.id, 'engagementScore', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={student.weakestTopic}
                        onChange={(e) => handleFieldChange(student.id, 'weakestTopic', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Student Button */}
          <button
            onClick={handleAddStudent}
            className="mt-4 w-full py-3 border-2 border-dashed border-brand-300 text-brand-600 rounded-lg hover:bg-brand-50 hover:border-brand-500 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Student
          </button>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 rounded-b-2xl flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {editedStudents.length} student{editedStudents.length !== 1 ? 's' : ''} in records
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2 ${
                hasChanges
                  ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-md hover:shadow-lg'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
