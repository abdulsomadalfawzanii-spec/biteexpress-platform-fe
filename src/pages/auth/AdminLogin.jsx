import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, ShieldCheck, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

export const AdminLogin = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.email.trim() || !form.password) {
      setError('Enter your administrator email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      // login stores the JWT; /auth/me then verifies that JWT server-side.
      const signedInUser = await login({ email: form.email.trim(), password: form.password });
      const verifiedUser = await authService.getProfile();
      const role = verifiedUser?.role || signedInUser?.role;
      if (role !== 'admin') {
        logout();
        throw new Error('This account is not authorized for administrator access.');
      }
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Administrator sign-in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="auth-panel w-full max-w-md rounded-3xl p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="auth-mark mb-5 mx-auto w-fit"><UtensilsCrossed className="w-6 h-6" /></div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 rounded-full px-3 py-1"><ShieldCheck className="w-3.5 h-3.5" /> Restricted access</div>
          <h1 className="auth-title mt-4">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in with your authorized BiteExpress administrator account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">Admin email
            <input required type="email" autoComplete="username" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@example.com" className="w-full mt-1 p-3 border border-gray-200 rounded-xl font-normal focus:outline-none focus:border-orange-500" />
          </label>
          <label className="block text-sm font-semibold text-gray-700">Password
            <span className="relative block mt-1"><input required type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" className="w-full p-3 pr-11 border border-gray-200 rounded-xl font-normal focus:outline-none focus:border-orange-500" />
              <button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
            </span>
          </label>
          <div className="text-right -mt-1"><Link to="/forgot-password" className="text-xs font-bold text-orange-500 hover:text-orange-600">Forgot password?</Link></div>
          {error && <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
          <button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 transition">{isSubmitting ? 'Verifying access…' : 'Log in securely'}{!isSubmitting && <ArrowRight className="w-4 h-4" />}</button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-6"><Link to="/login" className="font-bold text-orange-500 hover:text-orange-600">Return to standard sign in</Link></p>
      </div>
    </div>
  );
};
