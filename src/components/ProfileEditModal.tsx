import { useState } from 'react';
import { X, Upload, Camera } from 'lucide-react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  email?: string;
  onSave: (newAvatar: string, newName: string) => void;
}

const avatarPresets = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie'
];

export function ProfileEditModal({ isOpen, onClose, currentAvatar, name, role, email, onSave }: ProfileEditModalProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [editedName, setEditedName] = useState(name);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedAvatar, editedName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-slate-200 p-6 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h2 className="text-slate-900">Edit Profile</h2>
            <p className="text-sm text-slate-500 mt-1">Update your avatar and information</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Avatar Preview */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedAvatar}
                alt="Avatar"
                className="w-32 h-32 rounded-full bg-slate-200 border-4 border-brand-500"
              />
              <div className="absolute bottom-0 right-0 bg-brand-500 p-2 rounded-full border-4 border-white">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-sm text-slate-600">Choose an avatar below</p>
          </div>

          {/* Avatar Selection Grid */}
          <div>
            <h3 className="text-slate-900 mb-4">Select Avatar</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {avatarPresets.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`relative rounded-full overflow-hidden transition-all hover:scale-110 ${
                    selectedAvatar === avatar
                      ? 'ring-4 ring-brand-500 scale-105'
                      : 'ring-2 ring-slate-200 hover:ring-brand-300'
                  }`}
                >
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full bg-slate-100"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-slate-700 mb-2">
              Display Name
            </label>
            <input
              id="name"
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {/* Email (Read-only) */}
          {email && (
            <div>
              <label className="block text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
              />
            </div>
          )}

          {/* Role Display */}
          <div>
            <label className="block text-slate-700 mb-2">Role</label>
            <div className="px-4 py-3 border border-slate-300 rounded-lg bg-slate-50">
              <span className="capitalize text-slate-700">{role}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 flex gap-3 justify-end sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all shadow-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
