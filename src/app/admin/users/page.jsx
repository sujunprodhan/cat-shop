import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { getAllUsers } from '@/actions/server/admin';
import UserManagement from './UserManagement';
import { Users } from 'lucide-react';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  
  // Protect route - Only allow admins
  if (!session || session.role !== 'admin') {
    redirect('/dashboard');
  }

  const result = await getAllUsers();
  const users = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
              <Users size={40} className="text-blue-500" />
              User <span className="text-blue-500">Management</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium">Control user permissions and manage roles across the platform.</p>
          </div>
          <div className="px-6 py-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold rounded-2xl text-sm backdrop-blur-md">
            Total Members: {users.length}
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-2 sm:p-4 shadow-2xl overflow-hidden">
          <UserManagement initialUsers={users} currentAdminEmail={session.user.email} />
        </div>
      </div>
    </div>
  );
}
