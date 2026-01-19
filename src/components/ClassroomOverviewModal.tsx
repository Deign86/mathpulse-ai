import { X, Users, Calendar, MapPin, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';
import { Classroom, Student } from '../types';
import { RiskLevel } from '../types';

interface ClassroomOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  classrooms: Classroom[];
  onSelectClassroom: (classroomId: string) => void;
  currentClassroomId: string;
  students: Student[];
}

export function ClassroomOverviewModal({ 
  isOpen, 
  onClose, 
  classrooms, 
  onSelectClassroom,
  currentClassroomId,
  students
}: ClassroomOverviewModalProps) {
  if (!isOpen) return null;

  const getClassroomStats = (classroomId: string) => {
    const classroomStudents = students.filter(s => s.classroomId === classroomId);
    const highRisk = classroomStudents.filter(s => s.riskLevel === RiskLevel.HIGH).length;
    const mediumRisk = classroomStudents.filter(s => s.riskLevel === RiskLevel.MEDIUM).length;
    const lowRisk = classroomStudents.filter(s => s.riskLevel === RiskLevel.LOW).length;
    const avgScore = classroomStudents.length > 0 
      ? Math.round(classroomStudents.reduce((acc, s) => acc + s.avgQuizScore, 0) / classroomStudents.length)
      : 0;
    
    return { highRisk, mediumRisk, lowRisk, avgScore, totalStudents: classroomStudents.length };
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-white">My Classrooms</h2>
                <p className="text-white/90 text-sm">
                  Teaching {classrooms.length} classes this semester
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6">
            {classrooms.map((classroom) => {
              const stats = getClassroomStats(classroom.id);
              const isCurrentClassroom = classroom.id === currentClassroomId;
              
              return (
                <div
                  key={classroom.id}
                  className={`bg-white rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer ${
                    isCurrentClassroom
                      ? 'border-brand-500 shadow-md'
                      : 'border-slate-200 hover:border-brand-300'
                  }`}
                  onClick={() => {
                    onSelectClassroom(classroom.id);
                    onClose();
                  }}
                >
                  <div className="p-6">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-slate-900">{classroom.name}</h3>
                          {isCurrentClassroom && (
                            <span className="px-2 py-1 bg-brand-100 text-brand-700 text-xs rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600">{classroom.section}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl text-brand-600">{stats.totalStudents}</p>
                        <p className="text-sm text-slate-500">Students</p>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <BookOpen className="w-4 h-4 text-brand-500" />
                        <span>{classroom.gradeLevel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4 text-brand-500" />
                        <span>{classroom.schedule.split(' ')[0]}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-brand-500" />
                        <span>{classroom.room}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <TrendingUp className="w-4 h-4 text-brand-500" />
                        <span>{stats.avgScore}% Avg</span>
                      </div>
                    </div>

                    {/* Risk Distribution */}
                    <div className="space-y-3">
                      <p className="text-sm text-slate-700">Risk Distribution</p>
                      
                      {/* Visual Risk Bar */}
                      <div className="h-8 bg-slate-100 rounded-lg overflow-hidden flex">
                        {stats.highRisk > 0 && (
                          <div
                            className="bg-red-500 flex items-center justify-center text-white text-xs"
                            style={{ width: `${(stats.highRisk / stats.totalStudents) * 100}%` }}
                          >
                            {stats.highRisk > 0 && stats.highRisk}
                          </div>
                        )}
                        {stats.mediumRisk > 0 && (
                          <div
                            className="bg-amber-500 flex items-center justify-center text-white text-xs"
                            style={{ width: `${(stats.mediumRisk / stats.totalStudents) * 100}%` }}
                          >
                            {stats.mediumRisk > 0 && stats.mediumRisk}
                          </div>
                        )}
                        {stats.lowRisk > 0 && (
                          <div
                            className="bg-green-500 flex items-center justify-center text-white text-xs"
                            style={{ width: `${(stats.lowRisk / stats.totalStudents) * 100}%` }}
                          >
                            {stats.lowRisk > 0 && stats.lowRisk}
                          </div>
                        )}
                      </div>

                      {/* Legend */}
                      <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span className="text-slate-600">High Risk ({stats.highRisk})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-amber-500 rounded"></div>
                          <span className="text-slate-600">Medium ({stats.mediumRisk})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span className="text-slate-600">Low Risk ({stats.lowRisk})</span>
                        </div>
                      </div>

                      {/* Alert for high-risk students */}
                      {stats.highRisk > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-800">
                            {stats.highRisk} student{stats.highRisk !== 1 ? 's' : ''} need immediate attention
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">
                        {classroom.semester} • {classroom.academicYear}
                      </span>
                      <span className="text-brand-600 hover:text-brand-700">
                        {isCurrentClassroom ? 'Currently viewing' : 'Click to view →'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Card */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <h4 className="text-slate-900 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-600" />
              Overall Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-2xl text-brand-600">
                  {classrooms.reduce((acc, c) => acc + getClassroomStats(c.id).totalStudents, 0)}
                </p>
                <p className="text-sm text-slate-600">Total Students</p>
              </div>
              <div>
                <p className="text-2xl text-red-600">
                  {classrooms.reduce((acc, c) => acc + getClassroomStats(c.id).highRisk, 0)}
                </p>
                <p className="text-sm text-slate-600">High Risk Students</p>
              </div>
              <div>
                <p className="text-2xl text-brand-600">
                  {Math.round(
                    classrooms.reduce((acc, c) => acc + getClassroomStats(c.id).avgScore, 0) / 
                    classrooms.length
                  )}%
                </p>
                <p className="text-sm text-slate-600">Average Performance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
