'use client';

import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                            Threat Intelligence Dashboard
                        </h1>
                        <h1 className="text-xl font-bold text-gray-900 sm:hidden">
                            TID
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/"
                            className={`px-3 py-2 ${pathname === '/' ? 'text-indigo-600 font-medium' : 'text-gray-700 hover:text-indigo-600'}`}
                        >
                            Home
                        </Link>

                        {user && (
                            <Link
                                href="/threats"
                                className={`px-3 py-2 ${pathname === '/threats' ? 'text-indigo-600 font-medium' : 'text-gray-700 hover:text-indigo-600'}`}
                            >
                                Threats
                            </Link>
                        )}

                        {user ? (
                            <button
                                onClick={logout}
                                className="px-3 py-2 text-gray-700 hover:text-indigo-600"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className={`px-3 py-2 ${pathname === '/login' ? 'text-indigo-600 font-medium' : 'text-gray-700 hover:text-indigo-600'}`}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}