import React, { useState, useEffect } from 'react';
import { Users, Search, User, Crown, RefreshCw, Loader2, Mail, Calendar, MapPin, Briefcase, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAllUsers, updateUserRole, updateUserProfileData, type UserProfileData } from '../../services/profileService';
import { audioService } from '../../services/audioService';
import { Drawer } from '../common/Drawer';
import { UserForm } from './UserForm';

interface UsersTabProps {
  currentUserId?: string;
}

export const UsersTab: React.FC<UsersTabProps> = ({ currentUserId }) => {
  const [users, setUsers] = useState<UserProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);

  // Edit Drawer State
  const [editingUser, setEditingUser] = useState<UserProfileData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const loadUsers = async (showToast = false) => {
    if (showToast) setRefreshing(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
      if (showToast) {
        audioService.playSuccess();
        toast.success('Đã làm mới danh sách người dùng!');
      }
    } catch (err) {
      console.error('Error loading users:', err);
      audioService.playError();
      toast.error('Không thể tải danh sách người dùng!');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (targetUser: UserProfileData, newRole: 'admin' | 'user') => {
    if (targetUser.role === newRole) return;
    audioService.playClick();

    if (targetUser.uid === currentUserId && newRole === 'user') {
      const confirmSelf = window.confirm(
        'CẢNH BÁO: Bạn đang tự giáng quyền Admin của chính mình! Bạn sẽ mất quyền truy cập tab này sau khi thao tác. Bạn có chắc chắn không?'
      );
      if (!confirmSelf) return;
    }

    setUpdatingUid(targetUser.uid);
    try {
      await updateUserRole(targetUser.uid, newRole);
      audioService.playSuccess();
      toast.success(`Đã cập nhật vai trò của ${targetUser.displayName || targetUser.email} thành ${newRole.toUpperCase()}`);
      setUsers(prev =>
        prev.map(u => (u.uid === targetUser.uid ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error('Error updating user role:', err);
      audioService.playError();
      toast.error('Lỗi khi cập nhật vai trò người dùng!');
    } finally {
      setUpdatingUid(null);
    }
  };

  const handleOpenEdit = (targetUser: UserProfileData) => {
    audioService.playClick();
    setEditingUser(targetUser);
    setIsDrawerOpen(true);
  };

  const handleSaveUserData = async (updatedData: Partial<UserProfileData>) => {
    if (!editingUser) return;
    try {
      await updateUserProfileData(editingUser.uid, updatedData);
      audioService.playSuccess();
      toast.success(`Đã cập nhật hồ sơ của "${updatedData.displayName || editingUser.email}" thành công!`);

      setUsers(prev =>
        prev.map(u => (u.uid === editingUser.uid ? { ...u, ...updatedData } : u))
      );
      setIsDrawerOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Error saving user data:', err);
      audioService.playError();
      toast.error('Lỗi khi cập nhật thông tin người dùng!');
    }
  };

  const filteredUsers = users.filter(u => {
    const query = searchQuery.toLowerCase();
    const name = (u.displayName || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const role = (u.role || 'user').toLowerCase();
    return name.includes(query) || email.includes(query) || role.includes(query);
  });

  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const totalMembers = users.filter(u => u.role !== 'admin').length;

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold font-sans text-white flex items-center gap-2">
            <Users size={18} className="text-sky-400" />
            Quản Lý Tất Cả Người Dùng (Admin System)
          </h2>
          <p className="text-xs font-sans text-slate-400">
            Xem danh sách tài khoản Firestore, chỉnh sửa hồ sơ và phân quyền hệ thống.
          </p>
        </div>

        <button
          id="refresh-users-btn"
          onClick={() => { audioService.playClick(); loadUsers(true); }}
          disabled={refreshing}
          className="liquid-glass-accent-btn px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Làm Mới Danh Sách
        </button>
      </div>

      {/* Summary Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="liquid-glass p-4 rounded-2xl border border-white/12 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
            <Users size={18} />
          </div>
          <div>
            <div className="text-xs text-slate-400">Tổng Người Dùng</div>
            <div className="text-lg font-bold text-white">{users.length}</div>
          </div>
        </div>

        <div className="liquid-glass p-4 rounded-2xl border border-white/12 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
            <Crown size={18} />
          </div>
          <div>
            <div className="text-xs text-slate-400">Quản Trị Viên (Admin)</div>
            <div className="text-lg font-bold text-amber-300">{totalAdmins}</div>
          </div>
        </div>

        <div className="liquid-glass p-4 rounded-2xl border border-white/12 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/30">
            <User size={18} />
          </div>
          <div>
            <div className="text-xs text-slate-400">Thành Viên (User)</div>
            <div className="text-lg font-bold text-purple-300">{totalMembers}</div>
          </div>
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          id="user-search-input"
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm theo tên, email hoặc vai trò..."
          className="glass-input w-full pl-11 pr-4 py-3 rounded-2xl text-xs text-white placeholder-slate-400"
        />
      </div>

      {/* Users List Container */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 size={32} className="mx-auto text-sky-400 animate-spin" />
          <p className="text-xs text-slate-400 font-sans">Đang tải danh sách người dùng từ Firestore...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-12 text-center liquid-glass rounded-3xl p-6 border border-white/10 space-y-2">
          <Users size={36} className="mx-auto text-slate-500 opacity-60" />
          <p className="text-sm font-semibold text-slate-300">Không tìm thấy người dùng nào</p>
          <p className="text-xs text-slate-400">Thử tìm kiếm với từ khoá khác hoặc tải lại trang.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map(u => {
            const isUserAdmin = u.role === 'admin';
            const isSelf = u.uid === currentUserId;
            const isUpdating = updatingUid === u.uid;

            return (
              <div
                key={u.uid}
                className="liquid-glass-card rounded-3xl p-5 border border-white/14 space-y-4 transition-all hover:-translate-y-1"
              >
                {/* Header Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatarUrl || u.photoURL || '/images/avatar.webp'}
                      alt={u.displayName || 'Avatar'}
                      className="w-11 h-11 rounded-2xl object-cover border border-white/20 shadow-md shrink-0"
                      onError={e => { (e.target as HTMLImageElement).src = '/images/avatar.webp'; }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-white truncate">
                          {u.displayName || 'Người dùng chưa đặt tên'}
                        </h3>
                        {isSelf && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                            Bạn
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                        <Mail size={11} className="shrink-0 text-slate-400" />
                        {u.email || 'Chưa có email'}
                      </p>
                    </div>
                  </div>

                  {/* Current Role Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border shrink-0 ${
                      isUserAdmin
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-sm'
                        : 'bg-slate-800/60 text-slate-300 border-white/10'
                    }`}
                  >
                    {isUserAdmin ? <Crown size={12} className="text-amber-400" /> : <User size={12} />}
                    {isUserAdmin ? 'Admin' : 'User'}
                  </span>
                </div>

                {/* Sub details */}
                <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  {u.jobTitle && (
                    <div className="flex items-center gap-1 truncate">
                      <Briefcase size={12} className="text-sky-400 shrink-0" />
                      <span className="truncate">{u.jobTitle}</span>
                    </div>
                  )}
                  {u.location && (
                    <div className="flex items-center gap-1 truncate">
                      <MapPin size={12} className="text-emerald-400 shrink-0" />
                      <span className="truncate">{u.location}</span>
                    </div>
                  )}
                  {u.lastLogin && (
                    <div className="col-span-2 flex items-center gap-1 truncate text-slate-400">
                      <Calendar size={12} className="text-indigo-400 shrink-0" />
                      <span>Đăng nhập gần nhất: {new Date(u.lastLogin).toLocaleString('vi-VN')}</span>
                    </div>
                  )}
                </div>

                {/* Action Controls: Edit Profile & Role Switcher */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                  <button
                    onClick={() => handleOpenEdit(u)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-500/15 text-sky-300 border border-sky-400/30 hover:bg-sky-500/25 flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                  >
                    <Edit3 size={13} />
                    Sửa Hồ Sơ
                  </button>

                  <div className="flex items-center bg-slate-900/70 p-1 rounded-2xl border border-white/10 gap-1">
                    <button
                      id={`role-user-btn-${u.uid}`}
                      disabled={isUpdating}
                      onClick={() => handleRoleChange(u, 'user')}
                      className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                        !isUserAdmin
                          ? 'bg-white/15 text-slate-100 font-semibold border border-white/20 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isUpdating && !isUserAdmin ? <Loader2 size={11} className="animate-spin" /> : <User size={11} />}
                      User
                    </button>

                    <button
                      id={`role-admin-btn-${u.uid}`}
                      disabled={isUpdating}
                      onClick={() => handleRoleChange(u, 'admin')}
                      className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                        isUserAdmin
                          ? 'bg-amber-500/25 text-amber-300 font-semibold border border-amber-400/40 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isUpdating && isUserAdmin ? <Loader2 size={11} className="animate-spin" /> : <Crown size={11} />}
                      Admin
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit User Profile Drawer */}
      {editingUser && (
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => { setIsDrawerOpen(false); setEditingUser(null); }}
          title={`Chỉnh Sửa Hồ Sơ: ${editingUser.displayName || editingUser.email}`}
          subtitle="Cập nhật thông tin chi tiết tài khoản người dùng trên Firestore"
        >
          <UserForm
            user={editingUser}
            formId="user-drawer-form"
            onSave={handleSaveUserData}
            onCancel={() => { setIsDrawerOpen(false); setEditingUser(null); }}
          />
        </Drawer>
      )}
    </div>
  );
};
