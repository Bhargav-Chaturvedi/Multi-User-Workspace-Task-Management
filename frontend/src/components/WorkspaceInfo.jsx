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
            // Get workspaceId from localStorage since it might not be in user object from login
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
            <div className="glass-card p-6">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="glass-card p-6 fade-in">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Workspace
                </h2>
            </div>

            <ErrorMessage message={error} onDismiss={() => setError('')} />

            {workspace && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-lg">
                            <p className="text-sm text-slate-400 mb-1">Workspace Name</p>
                            <p className="text-lg font-semibold text-white">{workspace.name}</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                            <p className="text-sm text-slate-400 mb-1">Owner</p>
                            <p className="text-lg font-semibold text-white">
                                {workspace.owner?.username || 'N/A'}
                            </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                            <p className="text-sm text-slate-400 mb-1">Created At</p>
                            <p className="text-lg font-semibold text-white">
                                {new Date(workspace.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                            <p className="text-sm text-slate-400 mb-1">Workspace ID</p>
                            <p className="text-sm font-mono text-slate-300 truncate">{workspace.id}</p>
                        </div>
                    </div>

                    {/* Owner-only Actions */}
                    {isOwner && (
                        <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
                            <button
                                onClick={onTransferOwnership}
                                className="btn-secondary btn-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                Transfer Ownership
                            </button>
                            <button
                                onClick={onDeleteWorkspace}
                                className="btn-danger btn-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
