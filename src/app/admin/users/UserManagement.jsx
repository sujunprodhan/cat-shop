'use client';

import React, { useState } from 'react';
import { Search, ShieldAlert, User, Mail, Calendar } from 'lucide-react';
import { updateUserRole } from '@/actions/server/admin';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { useTheme } from '@/provider/ThemeProvider';

export default function UserManagement({ initialUsers, currentAdminEmail }) {
  const [users, setUsers]       = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === 'night';

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = async (userId, newRole) => {
    const result = await Swal.fire({
      title: 'Update User Role?',
      text: `Are you sure you want to make this user an ${newRole}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, update it!',
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#fff' : '#0f172a',
    });

    if (result.isConfirmed) {
      setUpdatingId(userId);
      try {
        const res = await updateUserRole(userId, newRole);
        if (res.success) {
          setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
          Swal.fire({ title: 'Success!', text: res.message, icon: 'success', background: isDark ? '#0f172a' : '#ffffff', color: isDark ? '#fff' : '#0f172a', confirmButtonColor: '#10b981' });
        } else {
          Swal.fire({ title: 'Error', text: res.message, icon: 'error', background: isDark ? '#0f172a' : '#ffffff', color: isDark ? '#fff' : '#0f172a', confirmButtonColor: '#ef4444' });
        }
      } catch { Swal.fire('Error', 'Something went wrong', 'error'); }
      setUpdatingId(null);
    }
  };

  /* ── Theme tokens ── */
  const heading    = isDark ? 'text-white'    : 'text-slate-900';
  const subText    = isDark ? 'text-slate-400' : 'text-slate-600';
  const muted      = isDark ? 'text-slate-500' : 'text-slate-400';
  const borderSec  = isDark ? 'border-white/5' : 'border-slate-200';
  const searchCls  = isDark
    ? 'bg-slate-950/50 border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400 shadow-sm';
  const theadBg    = isDark ? 'bg-white/5'     : 'bg-slate-50';
  const theadTxt   = isDark ? 'text-slate-500' : 'text-slate-500';
  const rowHover   = isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50';
  const rowDivide  = isDark ? 'divide-white/5' : 'divide-slate-100';
  const avatarBg   = isDark ? 'bg-slate-800 border-white/10 group-hover:border-blue-500/30' : 'bg-slate-100 border-slate-200 group-hover:border-blue-400/50';
  const avatarIcon = isDark ? 'bg-slate-900 text-slate-500'  : 'bg-slate-200 text-slate-400';
  const nameTxt    = isDark ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600';
  const emailCls   = isDark ? 'text-slate-500' : 'text-slate-500';
  const dateCls    = isDark ? 'text-slate-400' : 'text-slate-600';
  const actionBtn1 = isDark ? 'bg-slate-800 text-slate-300 hover:bg-emerald-600 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white';
  const actionBtn2 = isDark ? 'bg-slate-800 text-slate-300 hover:bg-rose-600 hover:text-white'    : 'bg-slate-100 text-slate-600 hover:bg-rose-600 hover:text-white';
  const selfTxt    = isDark ? 'text-slate-600' : 'text-slate-400';
  const emptyIco   = isDark ? 'bg-white/5 text-slate-600' : 'bg-slate-100 text-slate-400';

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className={`p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-6 ${borderSec}`}>
        <div className="relative group w-full md:w-96">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border rounded-2xl py-4 pl-12 pr-6 text-sm outline-none transition-all backdrop-blur-md shadow-inner ${searchCls}`}
          />
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-blue-400 transition-colors ${muted}`} size={20} />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Active System</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={theadBg}>
              {['User Information', 'Account Role', 'Joined Date', 'Quick Actions'].map((col, i) => (
                <th key={col} className={`px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] ${theadTxt} ${i === 3 ? 'text-right' : ''}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${rowDivide}`}>
            {filteredUsers.map((user) => (
              <tr key={user._id} className={`transition-colors group ${rowHover}`}>
                {/* User Info */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className={`relative w-12 h-12 rounded-2xl overflow-hidden border transition-all ${avatarBg}`}>
                      {user.image ? (
                        <Image src={user.image} alt={user.name} fill className="object-cover" />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${avatarIcon}`}>
                          <User size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className={`font-bold text-base transition-colors ${nameTxt}`}>{user.name}</p>
                      <div className={`flex items-center gap-2 text-xs mt-1 ${emailCls}`}>
                        <Mail size={12} />
                        <span>{user.email}</span>
                        {user.email === currentAdminEmail && (
                          <span className="ml-2 bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-blue-500/20">You</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Role Badge */}
                <td className="px-8 py-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                    user.role === 'admin'
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}>
                    {user.role === 'admin' ? <ShieldAlert size={14} /> : <User size={14} />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{user.role || 'user'}</span>
                  </div>
                </td>

                {/* Joined Date */}
                <td className="px-8 py-6">
                  <div className={`flex items-center gap-2 ${dateCls}`}>
                    <Calendar size={14} />
                    <span className="text-xs font-medium">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-8 py-6 text-right">
                  {user.email !== currentAdminEmail ? (
                    <div className="flex items-center justify-end gap-2">
                      {user.role === 'admin' ? (
                        <button
                          onClick={() => handleRoleChange(user._id, 'user')}
                          disabled={updatingId === user._id}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 ${actionBtn1}`}
                        >
                          {updatingId === user._id ? 'Processing...' : 'Demote to User'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(user._id, 'admin')}
                          disabled={updatingId === user._id}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 ${actionBtn2}`}
                        >
                          {updatingId === user._id ? 'Processing...' : 'Make Admin'}
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className={`text-[10px] font-black uppercase tracking-widest italic pr-4 ${selfTxt}`}>Self account</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="py-20 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${emptyIco}`}>
              <Search size={40} />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${heading}`}>No users found</h3>
            <p className={`text-sm ${subText}`}>Try searching for a different name or email address.</p>
          </div>
        )}
      </div>
    </div>
  );
}
