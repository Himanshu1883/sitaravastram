import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../../store/authSlice';

export default function AdminProtected({ children }: { children: React.ReactNode }) {
  const isAdmin = useSelector(selectIsAdmin);
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
