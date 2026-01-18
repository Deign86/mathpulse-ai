import { X, ExternalLink as ExternalLinkIcon, CheckCircle, XCircle, AlertCircle, Youtube, BookOpen, Globe, Monitor } from 'lucide-react';
import { useState } from 'react';
import { ExternalLink } from '../types';
import { mockStudents } from '../utils/mockData';

interface ExternalLinkValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: ExternalLink[];
  onApprove: (linkId: string) => void;
  onReject: (linkId: string) => void;
}

export function ExternalLinkValidationModal({ 
  isOpen, 
  onClose, 
  links, 
  onApprove, 
  onReject 
}: ExternalLinkValidationModalProps) {
  const [selectedLink, setSelectedLink] = useState<ExternalLink | null>(null);

  if (!isOpen) return null;

  const pendingLinks = links.filter(link => link.status === 'pending');
  const approvedLinks = links.filter(link => link.status === 'approved');
  const rejectedLinks = links.filter(link => link.status === 'rejected');

  const getTypeIcon = (type: ExternalLink['type']) => {
    switch (type) {
      case 'video': return Youtube;
      case 'article': return BookOpen;
      case 'interactive': return Monitor;
      case 'tutorial': return Globe;
    }
  };

  const getTypeColor = (type: ExternalLink['type']) => {
    switch (type) {
      case 'video': return 'text-red-600 bg-red-100';
      case 'article': return 'text-blue-600 bg-blue-100';
      case 'interactive': return 'text-green-600 bg-green-100';
      case 'tutorial': return 'text-purple-600 bg-purple-100';
    }
  };

  const getStudentNames = (studentIds: string[]) => {
    return studentIds.map(id => {
      const student = mockStudents.find(s => s.id === id);
      return student?.name || 'Unknown';
    }).join(', ');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-white">AI Link Recommendations - Validation Required</h2>
                <p className="text-white/90 text-sm">Review and approve external resources before students can access them</p>
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

        {/* Stats Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl text-amber-600">{pendingLinks.length}</p>
              <p className="text-sm text-slate-600">Pending Review</p>
            </div>
            <div className="text-center">
              <p className="text-2xl text-green-600">{approvedLinks.length}</p>
              <p className="text-sm text-slate-600">Approved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl text-red-600">{rejectedLinks.length}</p>
              <p className="text-sm text-slate-600">Rejected</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Links List */}
          <div className="w-1/2 border-r border-slate-200 overflow-y-auto p-6">
            <h3 className="text-slate-900 mb-4">Pending Validation ({pendingLinks.length})</h3>
            
            {pendingLinks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-slate-600">All links have been reviewed!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingLinks.map((link) => {
                  const Icon = getTypeIcon(link.type);
                  return (
                    <button
                      key={link.id}
                      onClick={() => setSelectedLink(link)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedLink?.id === link.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(link.type)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 truncate mb-1">{link.title}</p>
                          <p className="text-xs text-slate-500 mb-2">{link.source}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded capitalize">
                              {link.type}
                            </span>
                            <span className="text-xs text-slate-500">{link.recommendedDate}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {approvedLinks.length > 0 && (
              <>
                <h3 className="text-slate-900 mt-8 mb-4">Approved Links ({approvedLinks.length})</h3>
                <div className="space-y-2">
                  {approvedLinks.map((link) => {
                    const Icon = getTypeIcon(link.type);
                    return (
                      <div key={link.id} className="p-3 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900 truncate">{link.title}</p>
                            <p className="text-xs text-slate-500">{link.source}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Details Panel */}
          <div className="w-1/2 overflow-y-auto p-6">
            {selectedLink ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-slate-900 mb-4">Link Details</h3>
                  
                  {/* Title & Source */}
                  <div className="mb-4">
                    <label className="text-sm text-slate-600 mb-1 block">Title</label>
                    <p className="text-slate-900">{selectedLink.title}</p>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm text-slate-600 mb-1 block">Source</label>
                    <p className="text-slate-900">{selectedLink.source}</p>
                  </div>

                  {/* URL */}
                  <div className="mb-4">
                    <label className="text-sm text-slate-600 mb-1 block">URL</label>
                    <a 
                      href={selectedLink.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 text-sm break-all flex items-center gap-1"
                    >
                      <ExternalLinkIcon className="w-3 h-3 flex-shrink-0" />
                      {selectedLink.url}
                    </a>
                  </div>

                  {/* Type & Topic */}
                  <div className="mb-4">
                    <label className="text-sm text-slate-600 mb-1 block">Type</label>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getTypeColor(selectedLink.type)}`}>
                      {selectedLink.type}
                    </span>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm text-slate-600 mb-1 block">Topic</label>
                    <p className="text-slate-900">{selectedLink.topic}</p>
                  </div>

                  {/* Recommended For */}
                  <div className="mb-4">
                    <label className="text-sm text-slate-600 mb-1 block">Recommended For</label>
                    <p className="text-slate-900">{getStudentNames(selectedLink.recommendedFor)}</p>
                  </div>

                  {/* AI Reasoning */}
                  <div className="mb-6">
                    <label className="text-sm text-slate-600 mb-2 block">AI Recommendation Reason</label>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <p className="text-sm text-slate-900">{selectedLink.aiReason}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        onApprove(selectedLink.id);
                        setSelectedLink(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve Link
                    </button>
                    <button
                      onClick={() => {
                        onReject(selectedLink.id);
                        setSelectedLink(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Link
                    </button>
                  </div>
                </div>

                {/* Safety Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="text-amber-900 mb-2 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Validation Guidelines
                  </h4>
                  <ul className="space-y-1 text-sm text-amber-800">
                    <li>• Verify the content is age-appropriate and educationally sound</li>
                    <li>• Check that the source is reputable and trustworthy</li>
                    <li>• Ensure the link is relevant to the identified learning gaps</li>
                    <li>• Test the link to confirm it's accessible and working</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <ExternalLinkIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Select a link to review details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
