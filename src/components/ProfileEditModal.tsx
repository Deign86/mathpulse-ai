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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 flex items-center justify-between sticky top-0 rounded-t-2xl">
          <div>
            <h2 className="text-white text-xl font-semibold">Edit Profile</h2>
            <p className="text-sm text-white/90 mt-1">Update your avatar and information</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors hover:bg-white/10 p-2 rounded-lg cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 bg-white">
          {/* Current Avatar Preview */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedAvatar}
                alt="Avatar"
                className="w-32 h-32 rounded-full bg-slate-100 border-4 border-primary-500"
              />
              <div className="absolute bottom-0 right-0 bg-gradient-to-r from-primary-500 to-accent-500 p-2 rounded-full border-4 border-white">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-sm text-slate-500">Choose an avatar below</p>
          </div>

          {/* Avatar Selection Grid */}
          <div>
            <h3 className="text-slate-900 font-medium mb-4">Select Avatar</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {avatarPresets.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`relative rounded-full overflow-hidden transition-all hover:scale-110 cursor-pointer ${
                    selectedAvatar === avatar
                      ? 'ring-4 ring-primary-500 scale-105'
                      : 'ring-2 ring-slate-200 hover:ring-primary-400'
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
            <label htmlFor="name" className="block text-slate-700 text-sm font-medium mb-2">
              Display Name
            </label>
            <input
              id="name"
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Email (Read-only) */}
          {email && (
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500"
              />
            </div>
          )}

          {/* Role Display */}
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-2">Role</label>
            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="capitalize text-slate-700">{role}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-6 flex gap-3 justify-end sticky bottom-0 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-500 hover:to-primary-600 transition-all shadow-md hover:shadow-lg cursor-pointer font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
