import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROLE_DASHBOARDS = {
  vendor:   '/vendor/dashboard',
  delivery: '/delivery/dashboard',
  admin:    '/admin/dashboard',
  customer: '/',
};

export const Login = () => {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [formData,     setFormData]     = useState({ email: '', password: '' });
  const [error,        setError]        = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Pass credentials only — role comes back from the API, not from a dropdown
      const user = await login({ email: formData.email, password: formData.password });

      if (!user) throw new Error('Unable to sign in. Please try again.');

      // Navigate based on the role the server confirmed, not what the user typed
      const from     = location.state?.from?.pathname;
      const roleHome = ROLE_DASHBOARDS[user.role] || '/';
      navigate(from || roleHome, { replace: true });

    } catch (err) {
      // Show the real backend message (e.g. "Invalid email or password.")
      setError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="auth-panel w-full max-w-md rounded-3xl p-8 md:p-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="auth-mark mb-6 mx-auto w-fit">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to continue your BiteExpress experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <label className="block text-sm font-semibold text-gray-700">
            Email address
            <input
              required
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl font-normal focus:outline-none focus:border-orange-500"
            />
          </label>

          {/* Password */}
          <label className="block text-sm font-semibold text-gray-700">
            Password
            <span className="relative block mt-1">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full p-3 pr-11 border border-gray-200 rounded-xl font-normal focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </span>
          </label>

          {/* Forgot password */}
          <div className="text-right -mt-1">
            <Link to="/forgot-password" className="text-xs font-bold text-orange-500 hover:text-orange-600">
              Forgot password?
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 transition"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Info note about admin */}
        <p className="text-xs text-center text-gray-400 mt-4">
          Your role is determined by your account — no need to select it here.
        </p>

        <p className="text-sm text-center text-gray-500 mt-4">
          New to BiteExpress?{' '}
          <Link to="/register" className="font-bold text-orange-500 hover:text-orange-600">
            Create an account
          </Link>
        </p>
        <p className="text-xs text-center text-gray-400 mt-4"><Link to="/admin/login" className="hover:text-orange-500">Admin Login</Link></p>
      </div>
    </div>
  );
};
