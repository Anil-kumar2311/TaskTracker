import { create } from 'zustand';
import api from '../lib/api';

const useStore = create((set, get) => ({
  user: null,
  dashboard: null,
  tasks: [],
  notes: [],
  reminders: [],
  loading: false,
  authLoading: false,

  setLoading: (value) => set({ loading: value }),
  setAuthLoading: (value) => set({ authLoading: value }),
  setTheme: (theme) => {
    if (!['light', 'dark'].includes(theme)) {
      throw new Error('Unsupported theme.');
    }

    localStorage.setItem('tasktracker-theme', theme);
    document.documentElement.dataset.theme = theme;
    set((state) => ({
      user: state.user ? { ...state.user, theme } : state.user,
    }));
  },

  fetchCurrentUser: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user });
      get().setTheme(data.user.theme || localStorage.getItem('tasktracker-theme') || 'light');
      return data.user;
    } catch (error) {
      set({ user: null });
      return null;
    }
  },

  register: async (payload) => {
    set({ authLoading: true });
    try {
      const { data } = await api.post('/auth/register', payload);
      set({ user: data.user });
      return data;
    } finally {
      set({ authLoading: false });
    }
  },

  login: async (payload) => {
    set({ authLoading: true });
    try {
      const { data } = await api.post('/auth/login', payload);
      set({ user: data.user });
      return data;
    } finally {
      set({ authLoading: false });
    }
  },

  loginWithGoogle: async () => {
    set({ authLoading: true });
    try {
      const { data } = await api.post('/auth/google', { credential: 'demo-google-token' });
      set({ user: data.user });
      return data;
    } finally {
      set({ authLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error(error);
    } finally {
      set({ user: null, dashboard: null, tasks: [], notes: [], reminders: [] });
    }
  },

  fetchDashboard: async () => {
    try {
      const { data } = await api.get('/dashboard');
      set({ dashboard: data, tasks: data.tasks || [], reminders: data.reminders || [], notes: data.notes || [] });
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  fetchTasks: async () => {
    try {
      const { data } = await api.get('/tasks');
      set({ tasks: data.tasks || [] });
      return data.tasks || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  createTask: async (payload) => {
    const { data } = await api.post('/tasks', payload);
    set((state) => ({ tasks: [data.task, ...state.tasks] }));
    return data.task;
  },

  updateTask: async (id, payload) => {
    const { data } = await api.put(`/tasks/${id}`, payload);
    set((state) => ({ tasks: state.tasks.map((task) => (task.id === id ? data.task : task)) }));
    return data.task;
  },

  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
  },

  fetchNotes: async () => {
    try {
      const { data } = await api.get('/notes');
      set({ notes: data.notes || [] });
      return data.notes || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  createNote: async (payload) => {
    const { data } = await api.post('/notes', payload);
    set((state) => ({ notes: [data.note, ...state.notes] }));
    return data.note;
  },

  updateNote: async (id, payload) => {
    const { data } = await api.put(`/notes/${id}`, payload);
    set((state) => ({ notes: state.notes.map((note) => (note.id === id ? data.note : note)) }));
    return data.note;
  },

  deleteNote: async (id) => {
    await api.delete(`/notes/${id}`);
    set((state) => ({ notes: state.notes.filter((note) => note.id !== id) }));
  },

  fetchReminders: async () => {
    try {
      const { data } = await api.get('/reminders');
      set({ reminders: data.reminders || [] });
      return data.reminders || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  createReminder: async (payload) => {
    const { data } = await api.post('/reminders', payload);
    set((state) => ({ reminders: [data.reminder, ...state.reminders] }));
    return data.reminder;
  },

  updateReminder: async (id, payload) => {
    const { data } = await api.put(`/reminders/${id}`, payload);
    set((state) => ({ reminders: state.reminders.map((reminder) => (reminder.id === id ? data.reminder : reminder)) }));
    return data.reminder;
  },

  deleteReminder: async (id) => {
    await api.delete(`/reminders/${id}`);
    set((state) => ({ reminders: state.reminders.filter((reminder) => reminder.id !== id) }));
  },

  saveUserProfile: async (payload) => {
    const { data } = await api.put('/user/profile', payload);
    set({ user: data.user });
    return data.user;
  },

  saveSettings: async (payload) => {
    const { data } = await api.put('/user/settings', payload);
    set((state) => ({
      user: state.user
        ? { ...state.user, theme: data.settings.theme, timezone: data.settings.timezone }
        : state.user,
    }));
    get().setTheme(data.settings.theme);
    return data.settings;
  },
}));

export default useStore;
