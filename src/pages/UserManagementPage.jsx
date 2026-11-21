import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Edit,
  Key,
} from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Label, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { toast } from 'sonner';

export default function UserManagementPage() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER',
    password: '',
    title: 'Real Estate Appraiser',
    phone: '+91 ',
    location: 'Noida, Sector 62',
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await authService.getUsers();
      setUsers(data);
    } catch (err) {
      toast.error('Failed to load user roster', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'USER',
      password: 'password123',
      title: 'Surveyor Field Analyst',
      phone: '+91 98765 43210',
      location: 'Cyber City, Gurugram',
    });
    setShowModal(true);
  };

  const openEditModal = (u) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      role: u.role,
      password: '',
      title: u.title || '',
      phone: u.phone || '',
      location: u.location || '',
    });
    setShowModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingUser) {
        await authService.updateUser(editingUser.id, formData);
        toast.success('User updated successfully');
      } else {
        await authService.createUser(formData);
        toast.success('New user account registered');
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error('Operation failed', { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (targetUser) => {
    const newStatus = targetUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await authService.updateUser(targetUser.id, { status: newStatus });
      toast.success(`User marked as ${newStatus}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to change status', { description: err.message });
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    setIsDeleting(true);
    try {
      await authService.deleteUser(deleteUserId);
      toast.success('User account removed');
      setDeleteUserId(null);
      fetchUsers();
    } catch (err) {
      toast.error('Delete failed', { description: err.message });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.location && u.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" /> Administrative Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-500" /> User & Role Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage appraiser personnel, surveyor access, roles (Admin / User), and account suspensions.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          variant="default"
          className="gap-2 shadow-lg shadow-blue-600/30"
        >
          <UserPlus className="w-4 h-4" /> Add Personnel
        </Button>
      </div>

      {/* Search Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0e1626]/90 border border-slate-800/80 shadow-md backdrop-blur-sm flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search team member by name, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#090f1d] text-sm text-slate-200 placeholder:text-slate-500 rounded-lg pl-9 pr-3 py-2 border border-slate-700/80 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <span className="text-xs text-slate-400">Total Users: <strong className="text-white">{filteredUsers.length}</strong></span>
      </div>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/40">
                <th className="py-3.5 px-4">Personnel Member</th>
                <th className="py-3.5 px-4">Role & Permissions</th>
                <th className="py-3.5 px-4">Contact & Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Surveys Logged</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading user accounts...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No team members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <span className="font-semibold text-white block">{u.name}</span>
                          <span className="text-xs text-slate-400">{u.title || 'Surveyor'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {u.role === 'ADMIN' ? (
                        <Badge variant="warning" className="gap-1 font-mono">
                          <ShieldCheck className="w-3 h-3 text-amber-400" /> ADMIN
                        </Badge>
                      ) : (
                        <Badge variant="default" className="font-mono">
                          SURVEYOR USER
                        </Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs space-y-0.5">
                        <span className="text-slate-300 flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-500" /> {u.email}</span>
                        <span className="text-slate-400 flex items-center gap-1.5"><MapPin className="w-3 h-3 text-slate-500" /> {u.location}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={u.id === currentAdmin?.id}
                        className={`text-xs px-2.5 py-1 rounded-full border font-medium transition ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25'
                        }`}
                      >
                        {u.status}
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-sm font-bold text-white">{u.valuationsConducted || 0}</span>
                      <span className="text-[11px] text-slate-500 block">Assessments</span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {u.id !== currentAdmin?.id && (
                          <button
                            onClick={() => setDeleteUserId(u.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg bg-[#0e1626] border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingUser ? 'Edit Personnel Account' : 'Register New Team Member'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 mt-4">
              <div>
                <Label required>Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ananya Roy"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label required>Email Address</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@propval.in"
                    required
                  />
                </div>
                <div>
                  <Label required>System Role</Label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-[#090f1d] text-sm text-slate-200 rounded-lg px-3 py-2 border border-slate-700/80 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USER">Surveyor User</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
              </div>

              {!editingUser && (
                <div>
                  <Label required>Initial Password</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Job Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Valuation Surveyor"
                  />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98101 23456"
                  />
                </div>
              </div>

              <div>
                <Label>Operational Sector / Base Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Sector 62, Noida"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  isLoading={submitting}
                >
                  {editingUser ? 'Save Updates' : 'Create User'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteUserId}
        title="Delete Personnel Account"
        message="Are you sure you want to permanently remove this user account? Access credentials will be immediately revoked."
        confirmText="Confirm Removal"
        isLoading={isDeleting}
        onConfirm={handleDeleteUser}
        onClose={() => setDeleteUserId(null)}
      />
    </div>
  );
}
