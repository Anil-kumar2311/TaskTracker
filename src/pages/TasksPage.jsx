import { useEffect, useState } from 'react';
import { Plus, Trash2, Circle, CheckCircle2 } from 'lucide-react';
import useStore from '../store/useStore';

const initialForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  category: 'General',
  dueDate: '',
  tags: '',
};

export default function TasksPage() {
  const tasks = useStore((state) => state.tasks);
  const fetchTasks = useStore((state) => state.fetchTasks);
  const createTask = useStore((state) => state.createTask);
  const updateTask = useStore((state) => state.updateTask);
  const deleteTask = useStore((state) => state.deleteTask);
  const [form, setForm] = useState(initialForm);
  const [filter, setFilter] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter((task) => {
    if (!showCompleted && task.status === 'completed') return false;
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    await createTask({
      ...form,
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    });

    setForm(initialForm);
    fetchTasks();
  };

  const handleStatusUpdate = async (taskId, nextStatus) => {
    await updateTask(taskId, { status: nextStatus });
    fetchTasks();
  };

  const handleDelete = async (taskId) => {
    await deleteTask(taskId);
    fetchTasks();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Focus queue</p>
          <h1 className="text-3xl font-bold text-slate-800">Tasks</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(event) => setShowCompleted(event.target.checked)}
            />
            Show completed tasks
          </label>
          <select className="input w-40" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">All tasks</option>
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-4 flex items-center gap-3">
          <Plus className="text-primary" size={18} />
          <h2 className="text-xl font-bold text-slate-800">New task</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <input className="input md:col-span-2" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Task title" />
          <textarea className="input md:col-span-2" rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Task description" />
          <select className="input" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
          <select className="input" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input className="input" type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
          <input className="input" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Category" />
          <input className="input md:col-span-2" value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="Tags, separated by commas" />
          <button type="submit" className="button-primary md:col-span-2">Add task</button>
        </form>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {['todo', 'in_progress', 'completed'].map((status) => {
          const columnTasks = filteredTasks.filter((task) => task.status === status);

          return (
            <div key={status} className="card p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold capitalize text-slate-800">{status.replace('_', ' ')}</h3>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{columnTasks.length}</span>
              </div>

              <div className="space-y-3">
                {columnTasks.length ? columnTasks.map((task) => (
                  <div key={task.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`font-semibold text-slate-800 ${task.status === 'completed' ? 'line-through opacity-70' : ''}`}>{task.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{task.category || 'General'}</p>
                      </div>
                      <button onClick={() => handleDelete(task.id)} className="text-slate-400 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">{task.description || 'No description added yet.'}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className={`badge ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && <span className="badge bg-slate-200 text-slate-700">{new Date(task.dueDate).toLocaleDateString()}</span>}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <select className="input py-2 text-xs" value={task.status} onChange={(event) => handleStatusUpdate(task.id, event.target.value)}>
                        <option value="todo">To do</option>
                        <option value="in_progress">In progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(task.id, task.status === 'completed' ? 'todo' : 'completed')}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-white ${task.status === 'completed' ? 'bg-slate-500' : 'bg-primary'}`}
                        aria-label={task.status === 'completed' ? `Reopen ${task.title}` : `Mark ${task.title} as completed`}
                      >
                        {task.status === 'completed' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                        {task.status === 'completed' ? 'Completed' : 'Mark complete'}
                      </button>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-slate-500">No tasks in this lane.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
