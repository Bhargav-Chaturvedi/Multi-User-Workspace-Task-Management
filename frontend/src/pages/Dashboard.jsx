import { useAuth } from '../context/AuthContext';
import OwnerDashboard from './OwnerDashboard';
import AdminDashboard from './AdminDashboard';
import MemberDashboard from './MemberDashboard';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Route to appropriate dashboard based on role
    switch (user?.role) {
        case 'owner':
            return <OwnerDashboard />;
        case 'admin':
            return <AdminDashboard />;
        case 'member':
            return <MemberDashboard />;
        default:
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="glass-card p-8 text-center">
                        <p className="text-red-400">Unknown role. Please contact support.</p>
                    </div>
                </div>
            );
    }
};

export default Dashboard;
