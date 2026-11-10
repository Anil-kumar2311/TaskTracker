export const memoryStore = {
  users: [],
  tasks: [],
  notes: [],
  reminders: [],
};

export const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export function getUserByEmail(email) {
  return memoryStore.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id) {
  return memoryStore.users.find((user) => user.id === id || user._id === id);
}

export function getTaskById(id) {
  return memoryStore.tasks.find((task) => task.id === id || task._id === id);
}

export function getNoteById(id) {
  return memoryStore.notes.find((note) => note.id === id || note._id === id);
}

export function getReminderById(id) {
  return memoryStore.reminders.find((reminder) => reminder.id === id || reminder._id === id);
}
