import axios from 'axios';

// Use environment variable in production, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;

            // Unauthorized - token expired or invalid
            if (status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/api/auth/register', data),
    login: (data) => api.post('/api/auth/login', data),
};

// User APIs
export const userAPI = {
    getProfile: () => api.get('/api/users/profile'),
    createUser: (data) => api.post('/api/users/create', data),
    updateUser: (id, data) => api.patch(`/api/users/${id}`, data),
    updateUserRole: (id, data) => api.patch(`/api/users/${id}`, data),
    deleteUser: (id) => api.delete(`/api/users/${id}`),
};

// Workspace APIs
export const workspaceAPI = {
    getWorkspace: (id) => api.get(`/api/workspaces/${id}`),
    deleteWorkspace: (id) => api.delete(`/api/workspaces/${id}`),
    transferOwnership: (id, newOwnerId) =>
        api.patch(`/api/workspaces/${id}/transfer-ownership`, { newOwnerId }),
};

// Task APIs
export const taskAPI = {
    createTask: (data) => api.post('/api/tasks', data),
    getTasks: () => api.get('/api/tasks'),
    getTask: (id) => api.get(`/api/tasks/${id}`),
    updateTaskStatus: (id, status) => api.patch(`/api/tasks/${id}/status`, { status }),
    deleteTask: (id) => api.delete(`/api/tasks/${id}`),
};

export default api;
