import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { saveToken, getToken, deleteToken } from '@/lib/auth';
import { User } from '@food-delivery/types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
}

interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkExistingSession();
    }, []);

    async function checkExistingSession() {
        try {
            const token = await getToken();
            if (token) {
                const res = await api.get('/auth/me');
                setUser(res.data);
            }
        } catch (error) {
            await deleteToken();
        } finally {
            setIsLoading(false);
        }
    }

    async function login(email: string, password: string) {
        const res = await api.post('/auth/login', { email, password });
        console.log('res', res);

        await saveToken(res.data.token);
        setUser(res.data.user);
    }

    // async function register(data: RegisterData) {
    //     const res = await api.post('/auth/register', data);
    //     console.log('res', res);

    //     await saveToken(res.data.token);
    //     setUser(res.data.user);
    // }
    async function register(data) {
        try {
            console.log('REGISTER URL:', api.defaults.baseURL + '/auth/register');
            console.log('REGISTER DATA:', data);

            const res = await api.post('/auth/register', data);

            console.log('REGISTER RESPONSE:', res.data);

            return res.data;
        } catch (error: any) {
            console.log('REGISTER ERROR MESSAGE:', error.message);
            console.log('REGISTER ERROR STATUS:', error.response?.status);
            console.log('REGISTER ERROR DATA:', error.response?.data);

            throw error;
        }
    }

    async function logout() {
        await deleteToken();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
};