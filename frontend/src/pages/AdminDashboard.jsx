import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, taskAPI } from '../api/axios';
import Navbar from '../components/Navbar';
import WorkspaceInfo from '../components/WorkspaceInfo';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import ErrorMessage from '../components/ErrorMessage';

const AdminDashboard = () => {
    const { user } = useAuth();

    // State
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]); // For task assignment (includes self)
    const [tasks, setTasks] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal states
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showUserForm, setShowUserForm] = useState(false);

    // Active tab
    const [activeTab, setActiveTab] = useState('tasks');

    useEffect(() => {
        fetchUsers();
        fetchTasks();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            const response = await userAPI.getProfile();
            // Admin gets only members, but we need to include self for task assignment
            const membersData = response.data;
            setUsers(membersData);

            // For task assignment, include current admin
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const usersForAssignment = Array.isArray(membersData)
                ? [{ _id: currentUser.id, username: currentUser.username, role: 'admin' }, ...membersData]
                : [{ _id: currentUser.id, username: currentUser.username, role: 'admin' }];
            setAllUsers(usersForAssignment);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchTasks = async () => {
        try {
            setLoadingTasks(true);
            const response = await taskAPI.getTasks();
            setTasks(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch tasks');
        } finally {
            setLoadingTasks(false);
        }
    };

    // Task handlers
    const handleCreateTask = async (taskData) => {
        await taskAPI.createTask(taskData);
        setShowTaskForm(false);
        setSuccess('Task created successfully!');
        fetchTasks();
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleUpdateTaskStatus = async (taskId, status) => {
        try {
            await taskAPI.updateTaskStatus(taskId, status);
            setSuccess('Task status updated!');
            fetchTasks();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await taskAPI.deleteTask(taskId);
            setSuccess('Task deleted successfully!');
            fetchTasks();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete task');
        }
    };

    // User handlers
    const handleCreateUser = async (userData) => {
        // Admin can only create members
        await userAPI.createUser({ ...userData, role: 'member' });
        setShowUserForm(false);
        setSuccess('Member created successfully!');
        fetchUsers();
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await userAPI.deleteUser(userId);
            setSuccess('User deleted successfully!');
            fetchUsers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
        }
    };

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
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-400">
                        Manage team members and tasks
                    </p>
                </div>

                {/* Workspace Info - No owner actions */}
                <div className="mb-8">
                    <WorkspaceInfo />
                </div>

                {/* Info Banner */}
                <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-blue-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>As an admin, you can manage members and all tasks, but cannot modify workspace settings or the owner.</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('tasks')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'tasks'
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                    >
                        Tasks ({tasks.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'users'
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                    >
                        Members ({Array.isArray(users) ? users.length : 0})
                    </button>
                </div>

                {/* Tasks Tab */}
                {activeTab === 'tasks' && (
                    <div className="fade-in">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">All Tasks</h2>
                            <button
                                onClick={() => setShowTaskForm(true)}
                                className="btn-primary btn-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Task
                            </button>
                        </div>
                        <TaskList
                            tasks={tasks}
                            loading={loadingTasks}
                            onUpdateStatus={handleUpdateTaskStatus}
                            onDeleteTask={handleDeleteTask}
                            users={allUsers}
                        />
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="fade-in">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">Team Members</h2>
                            <button
                                onClick={() => setShowUserForm(true)}
                                className="btn-primary btn-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Member
                            </button>
                        </div>
                        <UserList
                            users={users}
                            loading={loadingUsers}
                            onDeleteUser={handleDeleteUser}
                            showRoleChange={false}
                        />
                    </div>
                )}

                {/* Task Form Modal */}
                {showTaskForm && (
                    <TaskForm
                        users={allUsers}
                        onSubmit={handleCreateTask}
                        onCancel={() => setShowTaskForm(false)}
                    />
                )}

                {/* User Form Modal */}
                {showUserForm && (
                    <UserForm
                        onSubmit={handleCreateUser}
                        onCancel={() => setShowUserForm(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
