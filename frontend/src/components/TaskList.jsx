import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const TaskList = ({ tasks, loading, onUpdateStatus, onDeleteTask, users = [] }) => {
    const { isAdminOrOwner } = useAuth();

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

    // Get user info by ID
    const getUserInfo = (userId) => {
        if (!userId) return { username: 'Unknown', initial: '?' };

        // Check if userId is already an object (populated from backend)
        if (typeof userId === 'object' && userId.username) {
            return { username: userId.username, initial: userId.username.charAt(0).toUpperCase() };
        }

        // Find user in users array
        const user = users.find(u => u._id === userId || u.id === userId);
        if (user) {
            return { username: user.username, initial: user.username.charAt(0).toUpperCase() };
        }

        // Return ID if user not found
        return { username: userId.toString().slice(-6), initial: '?' };
    };

    const statusOptions = ['todo', 'in-progress', 'done'];

    if (loading) {
        return (
            <div className="glass-card p-6">
                <LoadingSpinner />
            </div>
        );
    }

    if (!tasks || tasks.length === 0) {
        return (
            <div className="glass-card p-8 text-center">
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
                <p className="text-slate-400 text-lg">No tasks found</p>
                <p className="text-slate-500 text-sm mt-1">
                    {isAdminOrOwner ? 'Create your first task to get started!' : 'No tasks assigned to you yet.'}
                </p>
            </div>
        );
    }

    return (
        <div className="glass-card overflow-hidden fade-in">
            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Assigned To</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => {
                            const assignee = getUserInfo(task.assignedTo);
                            return (
                                <tr key={task._id} className="fade-in">
                                    <td>
                                        <p className="font-medium text-white">{task.title}</p>
                                    </td>
                                    <td>
                                        <p className="text-slate-300 text-sm max-w-xs truncate">
                                            {task.description}
                                        </p>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                                                {assignee.initial}
                                            </div>
                                            <span className="text-slate-300 text-sm">{assignee.username}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            {/* Status Update Dropdown */}
                                            <select
                                                value={task.status}
                                                onChange={(e) => onUpdateStatus(task._id, e.target.value)}
                                                className="select-field py-2 px-3 text-sm w-auto"
                                            >
                                                {statusOptions.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Delete Button - Only for Admin/Owner */}
                                            {isAdminOrOwner && onDeleteTask && (
                                                <button
                                                    onClick={() => onDeleteTask(task._id)}
                                                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                                    title="Delete Task"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskList;
