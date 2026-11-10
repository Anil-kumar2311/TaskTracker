import { useState } from 'react';
import { User } from 'lucide-react';
import useStore from '../store/useStore';

export default function ProfilePage() {
  const user = useStore((state) => state.user);
  const saveUserProfile = useStore((state) => state.saveUserProfile);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    jobTitle: user?.jobTitle || '',
    timezone: user?.timezone || 'UTC',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await saveUserProfile(form);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Your account</p>
        <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
      </div>

      <div className="card p-5">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white">
            {user?.name?.slice(0, 1)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{user?.name || 'TaskTracker User'}</h2>
            <p className="text-sm text-slate-500">{user?.email || 'user@tasktracker.app'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-600">Full name</span>
            <input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-600">Email</span>
            <input className="input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-600">Job title</span>
            <input className="input" value={form.jobTitle} onChange={(event) => setForm({ ...form, jobTitle: event.target.value })} />
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-600">Timezone</span>
            <select className="input" value={form.timezone} onChange={(event) => setForm({ ...form, timezone: event.target.value })}>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Asia/Kolkata">Asia/Kolkata</option>
            </select>
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-600">Bio</span>
            <textarea className="input min-h-[120px] resize-none" value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
          </label>

          <button type="submit" className="button-primary md:col-span-2">Save profile</button>
        </form>
      </div>
    </div>
  );
}
