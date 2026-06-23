import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { adminLogin, selectAuth } from '../store/authSlice';
import { adminLoginApi } from '../lib/api';
import Logo from '../components/ui/Logo';

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useSelector(selectAuth);
  const [email, setEmail] = useState('admin@sitaravastram.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = (location.state as { from?: string } | null)?.from ?? '/admin/dashboard';

  if (isAdmin) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { token } = await adminLoginApi(email, password);
      dispatch(adminLogin(token));
      navigate(from, { replace: true });
    } catch {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100svh-var(--navbar-h))] bg-cream-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="xl" className="mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold text-navy-700">Admin Login</h1>
          <p className="font-body text-sm text-gray-500 mt-2">
            Sign in to manage products, orders, and store settings.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-sm shadow-luxury border border-rosegold-100/80 p-6 sm:p-8 space-y-5"
        >
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-sm px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold tracking-wide uppercase text-gray-500 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="admin@sitaravastram.com"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide uppercase text-gray-500 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            Sign In
            <ArrowRight size={16} />
          </button>

          <p className="text-center text-xs text-gray-400 pt-2">
            Demo: admin@sitaravastram.com / sitara2026
          </p>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          <Link to="/" className="text-rosegold-600 hover:text-navy-700 font-medium transition-colors">
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}
