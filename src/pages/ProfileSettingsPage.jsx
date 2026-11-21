import React, { useState } from 'react';
import {
  User,
  Settings,
  ShieldCheck,
  Bell,
  Database,
  Lock,
  Save,
  CheckCircle,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '../components/ui';
import { toast } from 'sonner';

export default function ProfileSettingsPage() {
  const { user, updateUserSession } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: user?.title || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // System Configuration preferences
  const [valuationCurrency, setValuationCurrency] = useState('INR');
  const [areaMetric, setAreaMetric] = useState('SQFT');
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const updated = await authService.updateUser(user.id, profileData);
      updateUserSession(updated);
      toast.success('Profile details updated successfully');
    } catch (err) {
      toast.error('Update failed', { description: err.message });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password too short', { description: 'Must be at least 6 characters' });
      return;
    }
    setIsUpdatingPassword(true);
    try {
      await authService.updateUser(user.id, { password: newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error('Password update failed', { description: err.message });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-blue-500" /> Profile & System Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your personal appraiser identity, notification preferences, and Spring Boot backend connectivity specs.
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">{user?.name}</CardTitle>
                <Badge variant={user?.role === 'ADMIN' ? 'warning' : 'default'}>
                  {user?.role}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{user?.title} • {user?.location}</p>
              <p className="text-[11px] text-blue-400 font-mono mt-0.5">{user?.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label required>Full Legal Name</Label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label required>Email (Login Username)</Label>
                <Input
                  value={profileData.email}
                  disabled
                  className="opacity-70 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Professional Title</Label>
                <Input
                  value={profileData.title}
                  onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Contact Phone</Label>
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>NCR Operating Base</Label>
                <Input
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="default"
                isLoading={isSavingProfile}
                className="gap-2 shadow-md shadow-blue-600/30"
              >
                <Save className="w-4 h-4" /> Save Profile Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security & Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-400" /> Security & Password
          </CardTitle>
          <CardDescription>Update your credentials for JWT session generation</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Current Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <Label>New Password (min 6 characters)</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="outline"
                isLoading={isUpdatingPassword}
                disabled={!newPassword}
              >
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Future Backend Integration Telemetry Card */}
      <Card className="border-blue-500/30 bg-gradient-to-br from-[#0b1120] to-[#0d1627]">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-white">
            <Database className="w-4 h-4 text-emerald-400" /> Backend Integration Contracts (Spring Boot 3.x)
          </CardTitle>
          <CardDescription>
            Architectural readiness documentation for Spring Security, REST APIs and MySQL 8 persistence.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="font-semibold text-white block mb-1">Central Axios Client</span>
              <p className="text-slate-400">
                Located at <code className="text-blue-400 font-mono">src/services/apiClient.js</code> with JWT request bearer injector & auto-redirect on 401.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="font-semibold text-white block mb-1">Target Endpoints</span>
              <p className="text-slate-400">
                Annotated in each service: <code className="text-blue-400 font-mono">/api/properties</code>, <code className="text-blue-400 font-mono">/api/valuations</code>, <code className="text-blue-400 font-mono">/api/users</code>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
