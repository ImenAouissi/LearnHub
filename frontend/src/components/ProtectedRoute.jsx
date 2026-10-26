import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Protège un groupe de pages : il faut être connecté (et avoir le bon rôle si "roles" est donné).
// Attention : c'est du confort d'affichage. La vraie sécurité est dans le backend.
export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
