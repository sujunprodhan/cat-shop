'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { LogOut, UserPlus, LogIn } from 'lucide-react';

const AuthButton = () => {
  const session = useSession();
  
  return (
    <div className="flex items-center gap-3">
      {session.status === 'authenticated' ? (
        <button
          onClick={() => signOut()}
          className="group flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-emerald-200 cursor-pointer active:scale-95"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Logout</span>
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <Link 
            href="/login" 
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-100 hover:shadow-emerald-200 active:scale-95"
          >
            <LogIn size={18} />
            <span >Login</span>
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-100 hover:shadow-emerald-200 active:scale-95"
          >
            <UserPlus size={18} />
            <span className="hidden xs:inline">Join Free</span>
            <span className="xs:hidden">Register</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthButton;

