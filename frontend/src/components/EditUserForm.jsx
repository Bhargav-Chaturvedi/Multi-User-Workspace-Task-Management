import { useState } from 'react';
import ErrorMessage from './ErrorMessage';

const EditUserForm = ({ user, onSubmit, onCancel, isOwner = false }) => {

    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        password: '',
        role: user?.role || 'member',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Only include password if it was changed
            const dataToSubmit = {
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
            };

            if (formData.password && formData.password.trim() !== '') {
                dataToSubmit.password = formData.password;
            }

            await onSubmit(dataToSubmit);
        } catch (err) {
            setError(err.message || 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    // Can only change role if owner
    const canChangeRole = isOwner && user?.role !== 'owner';

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content fade-in" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-white mb-4">Edit User</h2>
                <p className="text-slate-400 text-sm mb-6">
                    Update user information for <span className="text-white font-medium">{user?.username}</span>
                </p>

                <ErrorMessage message={error} onDismiss={() => setError('')} />

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="johndoe"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="user@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="+1234567890"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            New Password <span className="text-slate-500">(leave blank to keep current)</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="••••••••"
                        />
                    </div>

                    {canChangeRole && (
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Role
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="select-field"
                            >
                                <option value="admin">Admin</option>
                                <option value="member">Member</option>
                            </select>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1"
                        >
                            {loading ? 'Updating...' : 'Update User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserForm;
