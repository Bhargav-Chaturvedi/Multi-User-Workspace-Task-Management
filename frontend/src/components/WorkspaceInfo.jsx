import { useState, useEffect } from 'react';
import { workspaceAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const WorkspaceInfo = ({ onTransferOwnership, onDeleteWorkspace }) => {
    const { user, isOwner } = useAuth();
    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchWorkspace();
    }, []);

    const fetchWorkspace = async () => {
        try {
            setLoading(true);
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const workspaceId = storedUser?.workspaceId || user?.workspaceId;

            if (!workspaceId) {
                setError('Workspace ID not found');
                setLoading(false);
                return;
            }

            const response = await workspaceAPI.getWorkspace(workspaceId);
            setWorkspace(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch workspace');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="glass-card p-10">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="glass-card fade-in">
            {/* Header Section */}
            <div className="p-6 pb-5 border-b border-white/10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Workspace</h2>
                        <p className="text-slate-400 text-sm mt-1">Manage your team workspace</p>
                    </div>
                </div>
            </div>

            <ErrorMessage message={error} onDismiss={() => setError('')} />

            {workspace && (
                <div className="p-6 pt-6">
                    {/* Workspace Name - Large & Prominent */}
                    <div className="mb-8">
                        <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
                            Workspace Name
                        </p>
                        <h3 className="text-2xl font-bold text-white">
                            {workspace.name}
                        </h3>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        {/* Owner */}
                        <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                            <p className="text-sm font-medium text-slate-400 mb-3">Owner</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    {workspace.owner?.username?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <span className="text-lg font-semibold text-white">
                                    {workspace.owner?.username || 'N/A'}
                                </span>
                            </div>
                        </div>

                        {/* Created At */}
                        <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                            <p className="text-sm font-medium text-slate-400 mb-3">Created</p>
                            <p className="text-lg font-semibold text-white">
                                {new Date(workspace.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>

                        {/* Workspace ID */}
                        <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                            <p className="text-sm font-medium text-slate-400 mb-3">Workspace ID</p>
                            <div className="flex items-center gap-2">
                                <code className="text-sm font-mono text-slate-300 truncate">
                                    {(workspace.id || workspace._id)?.slice(0, 12)}...
                                </code>
                                <button
                                    onClick={() => navigator.clipboard.writeText(workspace.id || workspace._id)}
                                    className="p-1.5 rounded-md hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                                    title="Copy full ID"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Owner-only Actions */}
                    {isOwner && (
                        <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-700/50">
                            <button
                                onClick={onTransferOwnership}
                                className="px-5 py-3 rounded-xl bg-slate-700/60 hover:bg-slate-600/60 border border-slate-600/50 text-white text-sm font-medium transition-all flex items-center gap-2.5"
                            >
                                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                Transfer Ownership
                            </button>
                            <button
                                onClick={onDeleteWorkspace}
                                className="px-5 py-3 rounded-xl bg-red-900/40 hover:bg-red-800/50 border border-red-700/50 text-red-200 text-sm font-medium transition-all flex items-center gap-2.5"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Workspace
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default WorkspaceInfo;
