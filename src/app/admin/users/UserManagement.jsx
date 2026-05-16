'use client';

import React, { useState } from 'react';
import { Search, Shield, ShieldAlert, User, Mail, Calendar, MoreVertical, Check, X } from 'lucide-react';
import { updateUserRole } from '@/actions/server/admin';
import Swal from 'sweetalert2';
import Image from 'next/image';

export default function UserManagement({ initialUsers, currentAdminEmail }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = async (userId, newRole) => {
    // Confirmation
    const result = await Swal.fire({
      title: 'Update User Role?',
      text: `Are you sure you want to make this user an ${newRole}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, update it!',
      background: '#0f172a',
      color: '#fff',
    });

    if (result.isConfirmed) {
      setUpdatingId(userId);
      try {
        const res = await updateUserRole(userId, newRole);
        if (res.success) {
          setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
          Swal.fire({
            title: 'Success!',
            text: res.message,
            icon: 'success',
            background: '#0f172a',
            color: '#fff',
            confirmButtonColor: '#10b981'
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: res.message,
            icon: 'error',
            background: '#0f172a',
            color: '#fff',
            confirmButtonColor: '#ef4444'
          });
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong', 'error');
      }
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative group w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all backdrop-blur-md group-hover:border-white/20 shadow-inner"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-blue-400 transition-colors" size={20} />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Active System</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">User Information</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Account Role</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Joined Date</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-800 border border-white/10 group-hover:border-blue-500/30 transition-all">
                      {user.image ? (
                        <Image src={user.image} alt={user.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-900">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-bold text-base group-hover:text-blue-400 transition-colors">{user.name}</p>
                      <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                        <Mail size={12} />
                        <span>{user.email}</span>
                        {user.email === currentAdminEmail && (
                          <span className="ml-2 bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-blue-500/20">You</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-8 py-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                    user.role === 'admin' 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {user.role === 'admin' ? <ShieldAlert size={14} /> : <User size={14} />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{user.role || 'user'}</span>
                  </div>
                </td>

                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar size={14} />
                    <span className="text-xs font-medium">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                </td>

                <td className="px-8 py-6 text-right">
                  {user.email !== currentAdminEmail ? (
                    <div className="flex items-center justify-end gap-2">
                      {user.role === 'admin' ? (
                        <button
                          onClick={() => handleRoleChange(user._id, 'user')}
                          disabled={updatingId === user._id}
                          className="px-4 py-2 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                          {updatingId === user._id ? 'Processing...' : 'Demote to User'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(user._id, 'admin')}
                          disabled={updatingId === user._id}
                          className="px-4 py-2 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                          {updatingId === user._id ? 'Processing...' : 'Make Admin'}
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic pr-4">Self account</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
              <Search size={40} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No users found</h3>
            <p className="text-slate-500 text-sm">Try searching for a different name or email address.</p>
          </div>
        )}
      </div>
    </div>
  );
}
