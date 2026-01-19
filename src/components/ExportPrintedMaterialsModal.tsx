import { X, Printer, Download, FileText, CheckSquare, BookOpen, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Student } from '../types';
import { pdfGenerator } from '../services/pdfGenerator';
import { useToast } from './ui/Toast';

interface ExportPrintedMaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students?: Student[];
  selectedStudent?: Student | null;
}

export function ExportPrintedMaterialsModal({ isOpen, onClose, students = [], selectedStudent }: ExportPrintedMaterialsModalProps) {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [format, setFormat] = useState<'pdf' | 'docx'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  // Use selected student if provided, otherwise use all students
  const targetStudents = selectedStudent ? [selectedStudent] : students;

  const materials = [
    {
      id: 'student-progress',
      title: 'Student Progress Reports',
      description: selectedStudent 
        ? `Performance summary for ${selectedStudent.name}` 
        : 'Individual performance summaries for each student',
      icon: BookOpen
    },
    {
      id: 'remedial-worksheets',
      title: 'Remedial Worksheets',
      description: 'Practice problems based on AI-identified weak topics',
      icon: FileText
    },
    {
      id: 'class-summary',
      title: 'Class Performance Summary',
      description: 'Overall analytics and risk distribution charts',
      icon: CheckSquare,
      disabled: !!selectedStudent // Disable for single student
    },
    {
      id: 'study-guides',
      title: 'Topic Study Guides',
      description: selectedStudent 
        ? `Study guide for ${selectedStudent.weakestTopic}` 
        : 'Comprehensive guides for challenging topics',
      icon: BookOpen
    }
  ];

  const toggleMaterial = (id: string) => {
    const material = materials.find(m => m.id === id);
    if (material?.disabled) return;
    
    setSelectedMaterials(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleExport = async () => {
    if (selectedMaterials.length === 0 || targetStudents.length === 0) return;
    
    setIsExporting(true);
    
    try {
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      for (const materialId of selectedMaterials) {
        let html = '';
        let filename = '';
        
        switch (materialId) {
          case 'student-progress':
            html = pdfGenerator.generateStudentProgressReport(targetStudents);
            filename = selectedStudent 
              ? `Progress_Report_${selectedStudent.name.replace(/\s+/g, '_')}` 
              : 'Student_Progress_Report';
            break;
            
          case 'remedial-worksheets':
            html = pdfGenerator.generateRemedialWorksheets(targetStudents);
            filename = selectedStudent 
              ? `Worksheets_${selectedStudent.name.replace(/\s+/g, '_')}` 
              : 'Remedial_Worksheets';
            break;
            
          case 'class-summary':
            html = pdfGenerator.generateClassSummary(targetStudents);
            filename = 'Class_Performance_Summary';
            break;
            
          case 'study-guides':
            const topics = selectedStudent 
              ? [selectedStudent.weakestTopic]
              : [...new Set(targetStudents.map(s => s.weakestTopic))];
            html = pdfGenerator.generateStudyGuides(topics);
            filename = selectedStudent 
              ? `Study_Guide_${selectedStudent.weakestTopic.replace(/\s+/g, '_')}` 
              : 'Topic_Study_Guides';
            break;
        }
        
        if (html) {
          pdfGenerator.downloadAsFile(html, filename, format);
          // Small delay between documents
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export Failed', 'Failed to export materials. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Printer className="w-6 h-6" />
              </div>
              <h2 className="text-white">Export Printed Materials</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-white/90 text-sm">
            Generate offline study materials for students without internet access
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-slate-700 mb-3">Export Format</label>
            <div className="flex gap-3">
              <button
                onClick={() => setFormat('pdf')}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  format === 'pdf'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-2 justify-center">
                  <FileText className="w-5 h-5" />
                  <span className="text-slate-900">PDF</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Best for printing</p>
              </button>
              <button
                onClick={() => setFormat('docx')}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  format === 'docx'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-2 justify-center">
                  <FileText className="w-5 h-5" />
                  <span className="text-slate-900">DOCX</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Editable format</p>
              </button>
            </div>
          </div>

          {/* Materials Selection */}
          <div>
            <label className="block text-slate-700 mb-3">
              Select Materials to Export
              {selectedStudent && (
                <span className="text-purple-600 ml-2">(for {selectedStudent.name})</span>
              )}
            </label>
            <div className="space-y-3">
              {materials.map((material) => {
                const Icon = material.icon;
                const isSelected = selectedMaterials.includes(material.id);
                const isDisabled = material.disabled;
                
                return (
                  <button
                    key={material.id}
                    onClick={() => toggleMaterial(material.id)}
                    disabled={isDisabled}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      isDisabled
                        ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                        : isSelected
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        isDisabled ? 'bg-slate-200 text-slate-400' :
                        isSelected ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className={`mb-1 ${isDisabled ? 'text-slate-400' : 'text-slate-900'}`}>{material.title}</p>
                        <p className={`text-sm ${isDisabled ? 'text-slate-300' : 'text-slate-500'}`}>{material.description}</p>
                      </div>
                      {isSelected && !isDisabled && (
                        <div className="bg-purple-500 text-white p-1 rounded">
                          <CheckSquare className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-blue-900 mb-2 text-sm">Offline Learning Support</h4>
            <p className="text-sm text-blue-800">
              These materials are designed for students who may have limited or no internet access. 
              All AI recommendations and personalized content will be included in an easy-to-print format.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {selectedMaterials.length} material{selectedMaterials.length !== 1 ? 's' : ''} selected
              {targetStudents.length > 0 && ` • ${targetStudents.length} student${targetStudents.length !== 1 ? 's' : ''}`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isExporting}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={selectedMaterials.length === 0 || isExporting}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${
                  selectedMaterials.length === 0 || isExporting
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-md hover:shadow-lg'
                }`}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export {format.toUpperCase()}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
