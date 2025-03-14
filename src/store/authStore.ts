import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'

interface User {
    username: string;
    email?: string;
    isSubaccount?: boolean;
}

interface AuthState {
    isLoggedIn: boolean;
    user: User | null;
    token: string | null;

    // Actions
    login: (username: string, isSubaccount: boolean, token?: string) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,
            token: null,

            login: (username, isSubaccount, token) => {
                // Set cookies for backward compatibility
                Cookies.set("isLoggedIn", "true", {
                    secure: true,
                    sameSite: 'strict',
                    expires: 7
                });

                Cookies.set("username", username, {
                    secure: true,
                    sameSite: 'strict',
                    expires: 7
                });

                Cookies.set("isSubaccount", isSubaccount.toString(), {
                    secure: true,
                    sameSite: 'strict',
                    expires: 7
                });

                if (token) {
                    Cookies.set("token", token, {
                        secure: true,
                        sameSite: 'strict',
                        expires: 7
                    });
                }

                set({
                    isLoggedIn: true,
                    user: { username, isSubaccount },
                    token: token || null
                });
            },

            logout: () => {
                // Clear cookies
                Cookies.remove("isLoggedIn");
                Cookies.remove("username");
                Cookies.remove("isSubaccount");
                Cookies.remove("token");

                set({
                    isLoggedIn: false,
                    user: null,
                    token: null
                });
            },

            updateUser: (userData) => set((state) => ({
                user: state.user ? { ...state.user, ...userData } : null
            }))
        }),
        {
            name: 'auth-storage',
            // Only store in localStorage what we need
            partialize: (state) => ({
                isLoggedIn: state.isLoggedIn,
                user: state.user,
                token: state.token
            }),
        }
    )
) 