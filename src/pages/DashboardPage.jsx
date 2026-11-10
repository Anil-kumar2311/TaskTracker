import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarClock, CheckCheck, ClipboardList, NotebookPen, Sparkles, Star } from 'lucide-react';
import useStore from '../store/useStore';

const cardClass = 'card p-5';

export default function DashboardPage() {
  const user = useStore((state) => state.user);
  const dashboard = useStore((state) => state.dashboard);
  const fetchDashboard = useStore((state) => state.fetchDashboard);
  const tasks = useStore((state) => state.tasks);
  const notes = useStore((state) => state.notes);
  const reminders = useStore((state) => state.reminders);
  const [aiInput, setAiInput] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const summaryText = useMemo(() => {
    if (!tasks.length) {
      return 'Your productivity dashboard is ready. Add your first task and start building momentum.';
    }

    const completed = tasks.filter((task) => task.status === 'completed').length;
    const pending = tasks.filter((task) => task.status !== 'completed').length;
    const topPriority = [...tasks].sort((a, b) => Number(b.priority === 'high') - Number(a.priority === 'high'))[0];

    return `${completed} tasks completed and ${pending} still in motion. Today’s focus should be ${topPriority?.title || 'your priority task'} to keep momentum high.`;
  }, [tasks]);

  const stats = dashboard?.stats || {
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    pinnedNotes: 0,
    upcomingReminders: 0,
    todayTasks: 0,
    productivityScore: 0,
  };

  const handleAiGenerate = () => {
    const prompt = aiInput.trim() || 'Create a concise productivity plan for today.';
    const firstLine = `AI summary: ${prompt}`;
    const secondLine = `Current focus: ${summaryText}`;
    setAiInput(`${firstLine}\n\n${secondLine}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Good morning</p>
          <h1 className="text-3xl font-bold text-slate-800">Welcome back, {user?.name || 'there'}.</h1>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-primary">
          Productivity score: {stats.productivityScore}%
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Total tasks</span>
            <ClipboardList className="text-primary" size={18} />
          </div>
          <p className="mt-4 text-3xl font-bold">{stats.totalTasks}</p>
          <p className="mt-2 text-sm text-slate-500">All tracked work</p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Pending</span>
            <CalendarClock className="text-amber-500" size={18} />
          </div>
          <p className="mt-4 text-3xl font-bold">{stats.pendingTasks}</p>
          <p className="mt-2 text-sm text-slate-500">Currently active</p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Completed</span>
            <CheckCheck className="text-emerald-500" size={18} />
          </div>
          <p className="mt-4 text-3xl font-bold">{stats.completedTasks}</p>
          <p className="mt-2 text-sm text-slate-500">Finished successfully</p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Pinned notes</span>
            <NotebookPen className="text-violet-500" size={18} />
          </div>
          <p className="mt-4 text-3xl font-bold">{stats.pinnedNotes}</p>
          <p className="mt-2 text-sm text-slate-500">Important ideas</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">AI productivity summary</p>
              <h2 className="text-xl font-bold text-slate-800">Daily focus plan</h2>
            </div>
            <Sparkles className="text-primary" size={20} />
          </div>

          <textarea
            className="input min-h-[110px] resize-none"
            value={aiInput}
            onChange={(event) => setAiInput(event.target.value)}
            placeholder="Describe your priorities for today..."
          />

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">{summaryText}</p>
            <button className="button-primary" onClick={handleAiGenerate}>
              Generate <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Upcoming reminders</h2>
            <Star className="text-amber-500" size={18} />
          </div>
          <div className="space-y-3">
            {reminders.length ? reminders.map((reminder) => (
              <div key={reminder.id} className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-800">{reminder.title}</p>
                  <span className="badge bg-amber-100 text-amber-700">{new Date(reminder.reminderAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{reminder.message || 'No additional details provided.'}</p>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No upcoming reminders yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 text-xl font-bold text-slate-800">Today's tasks</h2>
          <div className="space-y-3">
            {tasks.length ? tasks.slice(0, 4).map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div>
                  <p className="font-semibold text-slate-800">{task.title}</p>
                  <p className="text-sm text-slate-500">{task.category || 'General'} • {task.priority}</p>
                </div>
                <span className={`badge ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700'}`}>
                  {task.status}
                </span>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No task activity yet.</p>
            )}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 text-xl font-bold text-slate-800">Pinned notes</h2>
          <div className="space-y-3">
            {notes.length ? notes.slice(0, 4).map((note) => (
              <div key={note.id} className="rounded-xl p-3" style={{ background: note.color || '#FFF3B0' }}>
                <p className="font-semibold text-slate-800">{note.title}</p>
                <p className="mt-2 text-sm text-slate-700">{note.content || 'Add more details here.'}</p>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No pinned notes saved yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
