'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-blue-600">
          Marketplace
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-500">
                {user.username}
                {user.role === 'admin' && (
                  <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">admin</span>
                )}
              </span>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Admin
                </Link>
              )}
              <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
