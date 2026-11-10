import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, UserCircle2, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';

export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate();
  const register = useStore((state) => state.register);
  const login = useStore((state) => state.login);
  const loginWithGoogle = useStore((state) => state.loginWithGoogle);
  const authLoading = useStore((state) => state.authLoading);

  const isRegister = mode === 'register';
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (isRegister) {
        await register(form);
      } else {
        await login(form);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-violet-100 bg-white shadow-soft lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-primary via-violet-500 to-indigo-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-violet-100">Plan smarter</p>
            <h1 className="mt-6 text-4xl font-bold">TaskTracker</h1>
            <p className="mt-4 max-w-sm text-violet-100">Manage tasks, notes, reminders, and focus time with a calmer workspace for your day.</p>
          </div>

          <div className="space-y-5 text-sm text-violet-50">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="font-semibold">AI daily summary</p>
              <p className="mt-1">Turn busy work into a clear plan powered by your actual tasks and deadlines.</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="font-semibold">Smart reminders</p>
              <p className="mt-1">Stay ahead of deadlines with reminder flows that keep you in rhythm.</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10">
          <div className="mx-auto max-w-md">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">Welcome</p>
                <h2 className="text-3xl font-bold text-slate-800">{isRegister ? 'Create account' : 'Sign in'}</h2>
              </div>
              <div className="rounded-full bg-violet-50 p-3 text-primary">
                <UserCircle2 size={28} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-600">Full name</span>
                  <div className="relative">
                    <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input className="input pl-10" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" required />
                  </div>
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Email</span>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input className="input pl-10" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Password</span>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input className="input pl-10" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" required />
                </div>
              </label>

              <button type="submit" className="button-primary w-full" disabled={authLoading}>
                {authLoading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
                <ArrowRight className="ml-2" size={16} />
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">or continue with</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <button type="button" onClick={handleGoogleLogin} className="button-secondary w-full" disabled={authLoading}>
              Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
              {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
              <Link to={isRegister ? '/login' : '/register'} className="font-semibold text-primary">
                {isRegister ? 'Sign in' : 'Create one'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
