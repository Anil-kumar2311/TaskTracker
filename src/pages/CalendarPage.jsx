import { useMemo } from 'react';
import useStore from '../store/useStore';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const tasks = useStore((state) => state.tasks);
  const reminders = useStore((state) => state.reminders);

  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthDays = useMemo(() => {
    const startDay = monthStart.getDay();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < startDay; i += 1) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(day);
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }, [today]);

  const eventMap = useMemo(() => {
    const map = {};

    tasks.forEach((task) => {
      if (!task.dueDate) return;
      const key = new Date(task.dueDate).toDateString();
      map[key] = [...(map[key] || []), { type: 'task', title: task.title }];
    });

    reminders.forEach((reminder) => {
      const key = new Date(reminder.reminderAt).toDateString();
      map[key] = [...(map[key] || []), { type: 'reminder', title: reminder.title }];
    });

    return map;
  }, [tasks, reminders]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Overview</p>
        <h1 className="text-3xl font-bold text-slate-800">Calendar</h1>
      </div>

      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">{today.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-violet-500" />Tasks</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />Reminders</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
          {weekDays.map((day) => (
            <div key={day} className="py-2">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((day, index) => {
            const cellDate = day ? new Date(today.getFullYear(), today.getMonth(), day) : null;
            const key = day ? cellDate.toDateString() : null;
            const items = key ? eventMap[key] || [] : [];

            return (
              <div key={`${day}-${index}`} className={`min-h-[110px] rounded-2xl border p-2 ${day ? 'border-slate-200 bg-slate-50' : 'border-dashed border-slate-200 bg-white'}`}>
                {day && (
                  <>
                    <div className={`mb-2 text-right text-sm font-semibold ${cellDate.toDateString() === new Date().toDateString() ? 'text-primary' : 'text-slate-700'}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {items.slice(0, 3).map((item, idx) => (
                        <div key={`${item.title}-${idx}`} className={`rounded-lg px-2 py-1 text-[10px] font-medium ${item.type === 'task' ? 'bg-violet-100 text-violet-700' : 'bg-amber-100 text-amber-700'}`}>
                          {item.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
