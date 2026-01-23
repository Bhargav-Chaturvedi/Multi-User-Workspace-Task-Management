import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, taskAPI, workspaceAPI } from '../api/axios';
import Navbar from '../components/Navbar';
import WorkspaceInfo from '../components/WorkspaceInfo';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import EditUserForm from '../components/EditUserForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const OwnerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // State
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal states
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showUserForm, setShowUserForm] = useState(false);
    const [showEditUserForm, setShowEditUserForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showDeleteWorkspaceModal, setShowDeleteWorkspaceModal] = useState(false);
    const [transferUserId, setTransferUserId] = useState('');

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
            setUsers(response.data);
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
        await userAPI.createUser(userData);
        setShowUserForm(false);
        setSuccess('User created successfully!');
        fetchUsers();
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleChangeRole = async (userId, newRole) => {
        try {
            await userAPI.updateUserRole(userId, { role: newRole });
            setSuccess('User role updated!');
            fetchUsers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update role');
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowEditUserForm(true);
    };

    const handleUpdateUser = async (userData) => {
        if (!editingUser) return;
        try {
            await userAPI.updateUser(editingUser._id, userData);
            setShowEditUserForm(false);
            setEditingUser(null);
            setSuccess('User updated successfully!');
            fetchUsers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update user');
        }
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

    // Workspace handlers
    const handleTransferOwnership = async () => {
        if (!transferUserId) {
            setError('Please select a user to transfer ownership to');
            return;
        }
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            await workspaceAPI.transferOwnership(storedUser.workspaceId, transferUserId);
            setSuccess('Ownership transferred! Logging out...');
            setShowTransferModal(false);
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to transfer ownership');
        }
    };

    const handleDeleteWorkspace = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            await workspaceAPI.deleteWorkspace(storedUser.workspaceId);
            setSuccess('Workspace deleted! Logging out...');
            setShowDeleteWorkspaceModal(false);
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete workspace');
        }
    };

    // Get non-owner users for transfer
    const nonOwnerUsers = Array.isArray(users)
        ? users.filter(u => u.role !== 'owner')
        : [];

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
                        Owner Dashboard
                    </h1>
                    <p className="text-slate-400">
                        Manage your workspace, team, and tasks
                    </p>
                </div>

                {/* Workspace Info */}
                <div className="mb-8">
                    <WorkspaceInfo
                        onTransferOwnership={() => setShowTransferModal(true)}
                        onDeleteWorkspace={() => setShowDeleteWorkspaceModal(true)}
                    />
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
                        Users ({Array.isArray(users) ? users.length : 0})
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
                            users={Array.isArray(users) ? users : []}
                        />
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="fade-in">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">All Users</h2>
                            <button
                                onClick={() => setShowUserForm(true)}
                                className="btn-primary btn-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New User
                            </button>
                        </div>
                        <UserList
                            users={users}
                            loading={loadingUsers}
                            onChangeRole={handleChangeRole}
                            onDeleteUser={handleDeleteUser}
                            onEditUser={handleEditUser}
                        />
                    </div>
                )}

                {/* Task Form Modal */}
                {showTaskForm && (
                    <TaskForm
                        users={Array.isArray(users) ? users : []}
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

                {/* Edit User Form Modal */}
                {showEditUserForm && editingUser && (
                    <EditUserForm
                        user={editingUser}
                        onSubmit={handleUpdateUser}
                        onCancel={() => {
                            setShowEditUserForm(false);
                            setEditingUser(null);
                        }}
                        isOwner={true}
                    />
                )}

                {/* Transfer Ownership Modal */}
                {showTransferModal && (
                    <div className="modal-overlay" onClick={() => setShowTransferModal(false)}>
                        <div className="modal-content fade-in" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-xl font-bold text-white mb-4">Transfer Ownership</h2>
                            <p className="text-slate-400 mb-4">
                                Select a user to transfer ownership to. You will be demoted to admin.
                            </p>
                            <select
                                value={transferUserId}
                                onChange={(e) => setTransferUserId(e.target.value)}
                                className="select-field mb-4"
                            >
                                <option value="">Select a user</option>
                                {nonOwnerUsers.map((u) => (
                                    <option key={u._id} value={u._id}>
                                        {u.username} ({u.role})
                                    </option>
                                ))}
                            </select>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowTransferModal(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleTransferOwnership}
                                    className="btn-primary flex-1"
                                >
                                    Transfer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Workspace Modal */}
                {showDeleteWorkspaceModal && (
                    <div className="modal-overlay" onClick={() => setShowDeleteWorkspaceModal(false)}>
                        <div className="modal-content fade-in" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-xl font-bold text-red-400 mb-4">Delete Workspace</h2>
                            <p className="text-slate-400 mb-4">
                                Are you sure you want to delete this workspace? This action cannot be undone.
                                All users and tasks will be permanently deleted.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteWorkspaceModal(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteWorkspace}
                                    className="btn-danger flex-1"
                                >
                                    Delete Workspace
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerDashboard;
