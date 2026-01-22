import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { token: newToken, user: userData } = response.data;

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(newToken);
            setUser(userData);

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            return { success: false, error: message };
        }
    };

    const register = async (data) => {
        try {
            const response = await authAPI.register(data);
            const { token: newToken, user: userData, workspace } = response.data;

            // Store workspaceId with user data
            const userWithWorkspace = {
                ...userData,
                workspaceId: workspace.id,
            };

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userWithWorkspace));

            setToken(newToken);
            setUser(userWithWorkspace);

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            return { success: false, error: message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token && !!user;

    const isOwner = user?.role === 'owner';
    const isAdmin = user?.role === 'admin';
    const isMember = user?.role === 'member';
    const isAdminOrOwner = isOwner || isAdmin;

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        isOwner,
        isAdmin,
        isMember,
        isAdminOrOwner,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
