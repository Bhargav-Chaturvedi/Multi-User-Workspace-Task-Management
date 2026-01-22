import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const UserList = ({ users, loading, onChangeRole, onDeleteUser, showRoleChange = true }) => {
    const { isOwner, user: currentUser } = useAuth();

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'owner':
                return 'badge-owner';
            case 'admin':
                return 'badge-admin';
            default:
                return 'badge-member';
        }
    };

    if (loading) {
        return (
            <div className="glass-card p-6">
                <LoadingSpinner />
            </div>
        );
    }

    // Handle both array and single user response
    const userList = Array.isArray(users) ? users : users ? [users] : [];

    if (userList.length === 0) {
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
                <p className="text-slate-400 text-lg">No users found</p>
            </div>
        );
    }

    return (
        <div className="glass-card overflow-hidden fade-in">
            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            {showRoleChange && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map((user) => (
                            <tr key={user._id} className="fade-in">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                            {user.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <p className="font-medium text-white">{user.username}</p>
                                    </div>
                                </td>
                                <td>
                                    <p className="text-slate-300">{user.email}</p>
                                </td>
                                <td>
                                    <p className="text-slate-300">{user.phone}</p>
                                </td>
                                <td>
                                    <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                {showRoleChange && (
                                    <td>
                                        <div className="flex items-center gap-2">
                                            {/* Role Change - Not for owner role users, or current user */}
                                            {user.role !== 'owner' && currentUser && user._id !== currentUser.id && (
                                                <>
                                                    {/* Change Role Button */}
                                                    {isOwner && (
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => onChangeRole(user._id, e.target.value)}
                                                            className="select-field py-2 px-3 text-sm w-auto"
                                                        >
                                                            <option value="admin">Admin</option>
                                                            <option value="member">Member</option>
                                                        </select>
                                                    )}

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => onDeleteUser(user._id)}
                                                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                                        title="Delete User"
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
                                                </>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
