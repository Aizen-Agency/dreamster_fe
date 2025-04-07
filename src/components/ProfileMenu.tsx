'use client';

import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLogout } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/store/authStore';

interface ProfileMenuProps {
    showIcon?: boolean;
}

export default function ProfileMenu({ showIcon = true }: ProfileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const logoutMutation = useLogout();
    const router = useRouter();

    // Get user data from auth store
    const { user } = useAuthStore();
    const profileImage = user?.avatar;

    // Get user role from cookies
    const role = Cookies.get('role') || 'user';

    // Determine profile link based on role
    const profileLink = role === 'musician'
        ? '/user/musician/profile'
        : role === 'fan'
            ? '/user/profile'
            : '/dashboard/admin/profile';

    useEffect(() => {
        // Handle clicks outside the menu to close it
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        // Add event listener when menu is open
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Clean up event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 p-0.5 shadow-[0_0_15px_rgba(255,44,201,0.5)]"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <div className="h-full w-full rounded-full overflow-hidden bg-indigo-950 flex items-center justify-center">
                    {profileImage ? (
                        <Image
                            src={profileImage}
                            alt="Profile"
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                        />
                    ) : showIcon ? (
                        <User className="h-5 w-5 text-cyan-300" />
                    ) : (
                        <div className="h-full w-full bg-indigo-950" />
                    )}
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-indigo-950 ring-1 ring-black ring-opacity-5 z-50 animate-fadeIn">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        <Link
                            href={profileLink}
                            className="block px-4 py-2 text-sm text-cyan-300 hover:bg-indigo-900 transition-colors"
                            role="menuitem"
                            onClick={() => setIsOpen(false)}
                        >
                            Your Profile
                        </Link>
                        {/* <Link
                            href="/settings"
                            className="block px-4 py-2 text-sm text-cyan-300 hover:bg-indigo-900 transition-colors"
                            role="menuitem"
                            onClick={() => setIsOpen(false)}
                        >
                            Settings
                        </Link> */}
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-indigo-900 transition-colors"
                            role="menuitem"
                            onClick={handleLogout}
                            disabled={logoutMutation.isPending}
                        >
                            {logoutMutation.isPending ? "Logging out..." : "Sign out"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 