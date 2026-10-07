import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { session, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-white/70">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-bg text-center px-6">
        <ShieldAlert size={48} className="text-red-400" />
        <h1 className="text-2xl font-display font-bold text-white">ACCESS DENIED</h1>
        <p className="text-white/50 max-w-sm">
          Your account is authenticated but does not have admin privileges on this portfolio.
        </p>
      </div>
    );
  }

  return children;
}
