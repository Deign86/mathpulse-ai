import { useState, useEffect } from 'react';
import { 
  Save, 
  RefreshCw, 
  Bell, 
  Shield, 
  Database, 
  Zap,
  Globe,
  Clock,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Settings,
  Calendar,
  Lock,
  Mail,
  Server,
  Loader2
} from 'lucide-react';
import { SystemSettings } from '../../types';
import { mockSystemSettings } from '../../utils/adminMockData';
import { settingsService } from '../../services/firebase';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useToast } from '../ui/Toast';

export function SystemSettingsPanel() {
  const [settings, setSettings] = useState<SystemSettings>(mockSystemSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  
  const toast = useToast();

  // Load settings from Firebase on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const firebaseSettings = await settingsService.getSettings();
        setSettings(firebaseSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
        // Fall back to mock data
        setSettings(mockSystemSettings);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await settingsService.saveSettings(settings);
      setHasChanges(false);
      setShowSaveSuccess(true);
      toast.success('Settings Saved', 'Your settings have been saved successfully.');
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Save Failed', 'Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setResetConfirmOpen(true);
  };

  const confirmReset = async () => {
    try {
      await settingsService.saveSettings(mockSystemSettings);
      setSettings(mockSystemSettings);
      setHasChanges(false);
      toast.success('Settings Reset', 'All settings have been restored to defaults.');
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Reset Failed', 'Failed to reset settings. Please try again.');
    }
  };

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'ai', label: 'AI Features', icon: Zap },
    { id: 'academic', label: 'Academic', icon: BookOpen },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'backup', label: 'Backup & Data', icon: Database }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        open={resetConfirmOpen}
        onOpenChange={setResetConfirmOpen}
        title="Reset Settings"
        description="Are you sure you want to reset all settings to default values? This cannot be undone."
        confirmText="Reset All"
        variant="destructive"
        onConfirm={confirmReset}
      />

      {/* Alert Banners */}
      {hasChanges && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <p className="text-amber-300">You have unsaved changes</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="px-3 py-1.5 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors text-sm disabled:opacity-50 cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {showSaveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <p className="text-emerald-300">Settings saved successfully to Firebase</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="glass-card p-4">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-primary-100 to-primary-50 text-primary-600 border-l-4 border-primary-500'
                      : 'text-slate-500 hover:bg-primary-50 hover:text-slate-800'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Settings */}
          {activeSection === 'general' && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                  <Settings className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">General Settings</h3>
                  <p className="text-sm text-slate-500">Basic system configuration</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-primary-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Site Description</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-white border border-primary-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Default Language</label>
                  <select
                    value={settings.defaultLanguage}
                    onChange={(e) => handleChange('defaultLanguage', e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-primary-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium text-slate-800">Maintenance Mode</p>
                      <p className="text-sm text-slate-500">Temporarily disable access for non-admins</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary-100 border border-primary-200">
                  <Shield className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Security Settings</h3>
                  <p className="text-sm text-slate-500">Access control and authentication</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-800">Allow New Registration</p>
                      <p className="text-sm text-slate-500">Let new users sign up on their own</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowRegistration}
                      onChange={(e) => handleChange('allowRegistration', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Session Timeout (minutes)
                    </div>
                  </label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value) || 60)}
                    min={5}
                    max={480}
                    className="w-full px-4 py-2 bg-white border border-primary-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Auto logout after inactivity (5-480 minutes)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Max Students Per Class
                    </div>
                  </label>
                  <input
                    type="number"
                    value={settings.maxStudentsPerClass}
                    onChange={(e) => handleChange('maxStudentsPerClass', parseInt(e.target.value) || 40)}
                    min={10}
                    max={100}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* AI Features Settings */}
          {activeSection === 'ai' && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Features</h3>
                  <p className="text-sm text-slate-400">Configure AI-powered functionality</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="font-medium text-white">AI Math Tutor</p>
                      <p className="text-sm text-slate-400">Enable conversational AI tutoring for students</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.aiTutorEnabled}
                      onChange={(e) => handleChange('aiTutorEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="font-medium text-white">Risk Prediction</p>
                      <p className="text-sm text-slate-400">AI-powered student risk level prediction</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.riskPredictionEnabled}
                      onChange={(e) => handleChange('riskPredictionEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-cyan-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-cyan-300">AI Features Info</p>
                      <p className="text-sm text-cyan-400/80 mt-1">
                        AI features use the backend ML services to provide personalized learning experiences.
                        Ensure the Python backend is running for full functionality.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Academic Settings */}
          {activeSection === 'academic' && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Academic Settings</h3>
                  <p className="text-sm text-slate-400">School year and semester configuration</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Academic Year
                    </div>
                  </label>
                  <select
                    value={settings.academicYear}
                    onChange={(e) => handleChange('academicYear', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="2023-2024">2023-2024</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Current Semester</label>
                  <select
                    value={settings.semester}
                    onChange={(e) => handleChange('semester', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="Summer">Summer Term</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeSection === 'notifications' && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
                  <Bell className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Notification Settings</h3>
                  <p className="text-sm text-slate-400">Email and alert preferences</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-white">Email Notifications</p>
                      <p className="text-sm text-slate-400">Send email alerts for important events</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotificationsEnabled}
                      onChange={(e) => handleChange('emailNotificationsEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Backup Settings */}
          {activeSection === 'backup' && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                  <Database className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Backup & Data</h3>
                  <p className="text-sm text-slate-400">Data backup configuration</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="font-medium text-white">Automatic Backups</p>
                      <p className="text-sm text-slate-400">Daily automatic database backup at 3:00 AM</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoBackupEnabled}
                      onChange={(e) => handleChange('autoBackupEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 transition-colors cursor-pointer">
                    <Database className="w-4 h-4" />
                    Create Manual Backup
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 transition-colors cursor-pointer">
                    <RefreshCw className="w-4 h-4" />
                    Restore from Backup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
