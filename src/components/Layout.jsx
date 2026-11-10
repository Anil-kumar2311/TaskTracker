import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, LogOut, Moon, Sun, StickyNote } from 'lucide-react';
import { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import Sidebar from './Sidebar';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const fetchCurrentUser = useStore((state) => state.fetchCurrentUser);
  const setTheme = useStore((state) => state.setTheme);
  const saveSettings = useStore((state) => state.saveSettings);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeError, setThemeError] = useState('');
  const theme = user?.theme || document.documentElement.dataset.theme || 'light';

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleThemeToggle = async () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setThemeError('');

    if (user) {
      try {
        await saveSettings({ theme: nextTheme, timezone: user.timezone || 'UTC' });
      } catch {
        setThemeError('Theme changed on this device, but could not be saved to your account.');
      }
    }
  };

  const openNotesWindow = () => {
    const notesWindow = window.open(
      '/notes/popup',
      'tasktracker-sticky-notes',
      'popup=yes,width=420,height=700,resizable=yes,scrollbars=yes'
    );

    if (!notesWindow) {
      setThemeError('Your browser blocked the sticky-notes window. Allow pop-ups for this site and try again.');
    } else {
      notesWindow.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-800">
      <div className="flex">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-sm md:px-8">
            <div className="flex items-center gap-3">
              <button className="rounded-xl border border-slate-200 p-2 lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu size={18} />
              </button>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  className="w-72 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none ring-0 transition focus:border-primary"
                  placeholder="Search tasks, notes, reminders"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={openNotesWindow}
                className="rounded-xl border border-slate-200 p-2 text-slate-600"
                aria-label="Open sticky notes in a small window"
                title="Open sticky notes in a small window"
              >
                <StickyNote size={18} />
              </button>
              <button
                onClick={handleThemeToggle}
                className="rounded-xl border border-slate-200 p-2 text-slate-600"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="rounded-xl border border-slate-200 p-2 text-slate-600">
                <Bell size={18} />
              </button>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {user?.name?.slice(0, 1)?.toUpperCase() || 'U'}
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-semibold text-slate-800">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500">{user?.email || 'tasktracker@demo'}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="rounded-xl border border-slate-200 p-2 text-slate-600" aria-label="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </header>

          {themeError && (
            <div role="alert" className="mx-4 mt-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 md:mx-8">
              {themeError}
            </div>
          )}

          {sidebarOpen && (
            <div className="border-b border-slate-200 bg-white p-4 lg:hidden">
              <div className="space-y-2">
                {[
                  ['Dashboard', '/dashboard'],
                  ['Tasks', '/tasks'],
                  ['Notes', '/notes'],
                  ['Reminders', '/reminders'],
                  ['Calendar', '/calendar'],
                  ['Profile', '/profile'],
                  ['Settings', '/settings'],
                ].map(([label, path]) => (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className="block w-full rounded-xl bg-slate-100 px-3 py-2 text-left text-sm font-medium text-slate-700"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
