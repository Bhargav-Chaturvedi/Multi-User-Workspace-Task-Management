import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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

    return (
        <nav className="glass-card mb-6">
            <div className="max-w-7xl mx-auto px-5 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo & Brand */}
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                />
                            </svg>
                        </div>
                        <span className="text-lg font-bold text-white">
                            TaskFlow
                        </span>
                    </Link>

                    {/* User Info & Actions */}
                    <div className="flex items-center gap-5">
                        {/* User Info */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white font-semibold text-sm">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-white leading-tight">{user?.username}</p>
                                <span className={`badge ${getRoleBadgeClass(user?.role)} text-xs py-0.5 px-2`}>
                                    {user?.role}
                                </span>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="btn-secondary btn-sm flex items-center gap-2 py-2 px-3"
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
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            <span className="hidden sm:inline text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
