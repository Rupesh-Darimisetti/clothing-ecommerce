import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

interface User {
    id?: string;
    email?: string;
    name?: string;
    password?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void,
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    loading: false,
    setLoading: () => { },
    login: async () => { },
    signup: async () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Try to fetch current user (optional endpoint)
    useEffect(() => {
        const check = async () => {
            try {
                const res = await api.get("/auth/me"); // optional; backend may provide
                setUser(res.data.user);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        check();
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        setLoading(true);
        // backend returns token or sets cookie; optionally fetch user profile
        try {
            const res = await api.post("/auth/login", { email, password });
            // const res = await api.get("/auth/me");
            setUser(res.data.user);
        } finally {
            setLoading(false)
        }
    };

    const signup = async (username: string, email: string, password: string): Promise<void> => {
        setLoading(true)
        try {
            const res = await api.post("/auth/signup", { username, email, password });

            // const me = await api.get("/auth/me");
            setUser(res.data.user);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await api.post("/auth/logout");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, signup, logout, setUser, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside <AuthProvider>");
    }

    return context;
};