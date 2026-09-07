import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROLE_DASHBOARDS = {
  vendor:   '/vendor/dashboard',
  delivery: '/delivery/dashboard',
  admin:    '/admin/dashboard',
  customer: '/',
};

const ROLE_OPTIONS = [
  {
    value:       'customer',
    label:       'Customer',
    description: 'Browse restaurants and order food',
  },
  {
    value:       'vendor',
    label:       'Food Vendor',
    description: 'List your restaurant and manage orders',
  },
  {
    value:       'delivery',
    label:       'Delivery Partner',
    description: 'Deliver orders and earn money',
  },
];

export const Register = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [formData, setFormData] = useState({
    name:            '',
    email:           '',
    password:        '',
    confirmPassword: '',
    phone:           '',
    role:            'customer',
  });
  const [error,        setError]        = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (field) => (e) => setFormData((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Client-side password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await register({
        name:     formData.name.trim(),
        email:    formData.email.trim(),
        password: formData.password,
        role:     formData.role,
        phone:    formData.phone.trim(),
      });

      if (!user) throw new Error('Unable to create account. Please try again.');

      // Navigate using the role confirmed by the server.
      const destination = ROLE_DASHBOARDS[user.role] || '/';
      navigate(destination, { replace: true });

    } catch (err) {
      // Display the real backend error (e.g. "An account with this email already exists.")
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Registration form ─────────────────────────── */
  return (
    <div className="auth-shell min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="auth-panel w-full max-w-md rounded-3xl p-8 md:p-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="auth-mark mb-6 mx-auto w-fit">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h1 className="auth-title">Create your account</h1>
          <p className="text-sm text-gray-500 mt-3">
            Join BiteExpress — order food, run a restaurant, or deliver.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector — visual cards */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">I am joining as</p>
            <div className="grid grid-cols-1 gap-2">
              {ROLE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.role === opt.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={opt.value}
                    checked={formData.role === opt.value}
                    onChange={set('role')}
                    className="mt-0.5 accent-orange-500"
                  />
                  <span>
                    <span className={`font-semibold text-sm block ${formData.role === opt.value ? 'text-orange-700' : 'text-gray-800'}`}>
                      {opt.label}
                    </span>
                    <span className="text-xs text-gray-500">{opt.description}</span>
                  </span>
                </label>
              ))}
            </div>
            {formData.role === 'vendor' && (
              <p className="text-xs text-orange-600 mt-2 bg-orange-50 rounded-lg px-3 py-2">
                Vendor accounts can start operating immediately after registration.
              </p>
            )}
          </div>

          {/* Full name */}
          <label className="block text-sm font-semibold text-gray-700">
            Full name
            <input
              required
              autoComplete="name"
              value={formData.name}
              onChange={set('name')}
              placeholder="Your full name"
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl font-normal focus:outline-none focus:border-orange-500"
            />
          </label>

          {/* Email */}
          <label className="block text-sm font-semibold text-gray-700">
            Email address
            <input
              required
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={set('email')}
              placeholder="you@example.com"
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl font-normal focus:outline-none focus:border-orange-500"
            />
          </label>

          {/* Phone (optional) */}
          <label className="block text-sm font-semibold text-gray-700">
            Phone number <span className="font-normal text-gray-400">(optional)</span>
            <input
              type="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={set('phone')}
              placeholder="+1 (555) 000-0000"
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl font-normal focus:outline-none focus:border-orange-500"
            />
          </label>

          {/* Password */}
          <label className="block text-sm font-semibold text-gray-700">
            Password
            <input
              required
              type="password"
              autoComplete="new-password"
              minLength={6}
              value={formData.password}
              onChange={set('password')}
              placeholder="At least 6 characters"
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl font-normal focus:outline-none focus:border-orange-500"
            />
          </label>

          {/* Confirm password */}
          <label className="block text-sm font-semibold text-gray-700">
            Confirm password
            <input
              required
              type="password"
              autoComplete="new-password"
              minLength={6}
              value={formData.confirmPassword}
              onChange={set('confirmPassword')}
              placeholder="Repeat your password"
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl font-normal focus:outline-none focus:border-orange-500"
            />
          </label>

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
            {isSubmitting ? 'Creating account…' : 'Create account'}
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-orange-500 hover:text-orange-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
