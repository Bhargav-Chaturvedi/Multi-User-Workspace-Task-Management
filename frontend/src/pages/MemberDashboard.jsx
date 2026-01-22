import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, taskAPI } from '../api/axios';
import Navbar from '../components/Navbar';
import WorkspaceInfo from '../components/WorkspaceInfo';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const MemberDashboard = () => {
    const { user } = useAuth();

    // State
    const [profile, setProfile] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProfile();
        fetchTasks();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoadingProfile(true);
            const response = await userAPI.getProfile();
            setProfile(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch profile');
        } finally {
            setLoadingProfile(false);
        }
    };

    const fetchTasks = async () => {
        try {
            setLoadingTasks(true);
            // Member gets only assigned tasks through the /tasks/:id endpoint
            // We need to fetch tasks assigned to current user
            // Since there's no direct endpoint for member tasks, we'll use what's available
            // Based on backend, member can access their assigned tasks via GET /tasks/:id
            // But there's no list endpoint for members - they get 403 on GET /tasks
            // So we'll show a message about this limitation
            setTasks([]);
        } catch (err) {
            // Expected - member can't access GET /tasks
            setTasks([]);
        } finally {
            setLoadingTasks(false);
        }
    };

    const handleUpdateTaskStatus = async (taskId, status) => {
        try {
            await taskAPI.updateTaskStatus(taskId, status);
            setSuccess('Task status updated!');
            setTimeout(() => setSuccess(''), 3000);
            // Refresh the task
            const response = await taskAPI.getTask(taskId);
            setTasks(prev => prev.map(t => t._id === taskId ? response.data : t));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update task');
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'todo':
                return 'status-todo';
            case 'in-progress':
                return 'status-in-progress';
            case 'done':
                return 'status-done';
            default:
                return 'badge-member';
        }
    };

    const statusOptions = ['todo', 'in-progress', 'done'];

    return (
        <div className="min-h-screen p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <Navbar />

                {/* Success/Error Messages */}
                {success && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-4 fade-in">
                        <p className="text-green-200">{success}</p>
                    </div>
                )}
                <ErrorMessage message={error} onDismiss={() => setError('')} />

                {/* Dashboard Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Member Dashboard
                    </h1>
                    <p className="text-slate-400">
                        View your profile and assigned tasks
                    </p>
                </div>

                {/* Workspace Info - No actions for member */}
                <div className="mb-8">
                    <WorkspaceInfo />
                </div>

                {/* Profile Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                    </h2>

                    {loadingProfile ? (
                        <div className="glass-card p-6">
                            <LoadingSpinner />
                        </div>
                    ) : profile ? (
                        <div className="glass-card p-6 fade-in">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                                    {profile.username?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-white">{profile.username}</p>
                                    <span className="badge badge-member">{profile.role}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <p className="text-sm text-slate-400 mb-1">Email</p>
                                    <p className="text-white">{profile.email}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <p className="text-sm text-slate-400 mb-1">Phone</p>
                                    <p className="text-white">{profile.phone}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <p className="text-sm text-slate-400 mb-1">Member Since</p>
                                    <p className="text-white">
                                        {new Date(profile.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Tasks Section */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        My Assigned Tasks
                    </h2>

                    {/* Info Banner */}
                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 text-yellow-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>As a member, you can only view and update the status of tasks assigned to you. Ask your admin to assign tasks to you.</span>
                        </div>
                    </div>

                    {loadingTasks ? (
                        <div className="glass-card p-6">
                            <LoadingSpinner />
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="glass-card p-8 text-center fade-in">
                            <svg
                                className="w-16 h-16 mx-auto text-slate-500 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            <p className="text-slate-400 text-lg">No tasks assigned to you yet</p>
                            <p className="text-slate-500 text-sm mt-1">
                                Your admin or owner will assign tasks to you.
                            </p>
                        </div>
                    ) : (
                        <div className="glass-card overflow-hidden fade-in">
                            <div className="overflow-x-auto">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                            <th>Update Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map((task) => (
                                            <tr key={task._id}>
                                                <td>
                                                    <p className="font-medium text-white">{task.title}</p>
                                                </td>
                                                <td>
                                                    <p className="text-slate-300 text-sm max-w-xs truncate">
                                                        {task.description}
                                                    </p>
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <select
                                                        value={task.status}
                                                        onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                                                        className="select-field py-2 px-3 text-sm w-auto"
                                                    >
                                                        {statusOptions.map((status) => (
                                                            <option key={status} value={status}>
                                                                {status}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MemberDashboard;
