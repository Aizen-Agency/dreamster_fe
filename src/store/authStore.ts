import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'

interface User {
    username: string;
    email?: string;
    isSubaccount?: boolean;
    role?: string;
    id?: string;
    avatar?: string;
    phone_number?: string;
}

interface AuthState {
    isLoggedIn: boolean;
    user: User | null;
    token: string | null;

    // Actions
    login: (username: string, isSubaccount: boolean, token?: string, role?: string, id?: string, email?: string) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,
            token: null,

            login: (username, isSubaccount, token, role, id, email) => {
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

                if (role) {
                    Cookies.set("role", role, {
                        secure: true,
                        sameSite: 'strict',
                        expires: 7
                    });
                }

                if (id) {
                    Cookies.set("id", id, {
                        secure: true,
                        sameSite: 'strict',
                        expires: 7
                    });
                }

                if (email) {
                    Cookies.set("email", email, {
                        secure: true,
                        sameSite: 'strict',
                        expires: 7
                    });
                }

                if (token) {
                    Cookies.set("token", token, {
                        secure: true,
                        sameSite: 'strict',
                        expires: 7
                    });
                }

                set({
                    isLoggedIn: true,
                    user: { username, isSubaccount, role, id, email },
                    token: token || null
                });
            },

            logout: () => {
                // Clear cookies
                Cookies.remove("isLoggedIn");
                Cookies.remove("username");
                Cookies.remove("isSubaccount");
                Cookies.remove("role");
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