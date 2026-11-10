import { LayoutDashboard, CheckSquare, StickyNote, BellRing, CalendarDays, User, Settings, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Tasks', to: '/tasks', icon: CheckSquare },
  { label: 'Notes', to: '/notes', icon: StickyNote },
  { label: 'Reminders', to: '/reminders', icon: BellRing },
  { label: 'Calendar', to: '/calendar', icon: CalendarDays },
  { label: 'AI Assistant', to: '/dashboard', icon: Sparkles },
  { label: 'Profile', to: '/profile', icon: User },
  { label: 'Settings', to: '/settings', icon: Settings },
];

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
      isActive ? 'bg-primary text-white shadow-soft' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white p-5 lg:flex lg:flex-col">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white shadow-soft">T</div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Productivity</p>
          <h1 className="text-xl font-bold text-slate-800">TaskTracker</h1>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink key={label} to={to} className={linkClass}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl bg-gradient-to-br from-primary to-violet-500 p-4 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.25em] text-violet-100">Focus mode</p>
        <h3 className="mt-2 text-lg font-semibold">Stay on your best streak.</h3>
      </div>
    </aside>
  );
}
