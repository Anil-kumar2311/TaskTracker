import { useEffect, useState } from 'react';
import { Plus, Trash2, BellRing } from 'lucide-react';
import useStore from '../store/useStore';

const initialForm = {
  title: '',
  message: '',
  reminderAt: '',
  timezone: 'UTC',
  browserNotification: true,
  emailNotification: false,
};

export default function RemindersPage() {
  const reminders = useStore((state) => state.reminders);
  const fetchReminders = useStore((state) => state.fetchReminders);
  const createReminder = useStore((state) => state.createReminder);
  const deleteReminder = useStore((state) => state.deleteReminder);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title || !form.reminderAt) return;
    await createReminder(form);
    setForm(initialForm);
    fetchReminders();
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Stay on time</p>
        <h1 className="text-3xl font-bold text-slate-800">Reminders</h1>
      </div>

      <div className="card p-5">
        <div className="mb-4 flex items-center gap-3">
          <BellRing className="text-primary" size={18} />
          <h2 className="text-xl font-bold text-slate-800">Create reminder</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <input className="input md:col-span-2" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Reminder title" />
          <textarea className="input md:col-span-2" rows={3} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Reminder notes" />
          <input className="input" type="datetime-local" value={form.reminderAt} onChange={(event) => setForm({ ...form, reminderAt: event.target.value })} />
          <select className="input" value={form.timezone} onChange={(event) => setForm({ ...form, timezone: event.target.value })}>
            <option value="UTC">UTC</option>
            <option value="America/New_York">New York</option>
            <option value="Europe/London">London</option>
            <option value="Asia/Kolkata">India</option>
          </select>
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
            <input type="checkbox" checked={form.browserNotification} onChange={(event) => setForm({ ...form, browserNotification: event.target.checked })} />
            Browser notification
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
            <input type="checkbox" checked={form.emailNotification} onChange={(event) => setForm({ ...form, emailNotification: event.target.checked })} />
            Email alerts
          </label>
          <button type="submit" className="button-primary md:col-span-2">Add reminder</button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="card p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-lg font-bold text-slate-800">{reminder.title}</p>
                <p className="text-sm text-slate-500">{new Date(reminder.reminderAt).toLocaleString()}</p>
              </div>
              <button onClick={() => deleteReminder(reminder.id)} className="text-slate-400 hover:text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
            <p className="mt-3 text-sm text-slate-600">{reminder.message || 'No additional notes.'}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="badge bg-violet-100 text-violet-700">{reminder.timezone}</span>
              <span className="badge bg-emerald-100 text-emerald-700">{reminder.browserNotification ? 'Browser' : 'No browser alert'}</span>
              <span className="badge bg-amber-100 text-amber-700">{reminder.emailNotification ? 'Email' : 'No email'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
