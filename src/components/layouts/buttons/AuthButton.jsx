'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

const AuthButton = () => {
  const session = useSession();
  return (
    <div className="flex gap-3">
      {session.status == 'authenticated' ? (
        <button
          onClick={() => signOut()}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
        >
          Log out
        </button>
      ) : (
        <>
          <Link href="/login" className="px-4 py-1 border rounded-lg hover:bg-gray-100">
            Login
          </Link>
          <Link
            href="/register"
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Register
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButton;
