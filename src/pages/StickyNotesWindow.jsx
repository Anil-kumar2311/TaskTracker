import { useEffect, useRef, useState } from 'react';
import { Plus, Pin, Trash2, X, Circle, CheckCircle2 } from 'lucide-react';
import useStore from '../store/useStore';

const colors = ['#FFF3B0', '#FFD6E0', '#D6E8FF', '#D9F7E8', '#E9DDFF'];

function StickyNoteCard({ note, onUpdate, onDelete }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [saveState, setSaveState] = useState('Saved');
  const saveQueue = useRef(Promise.resolve());

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.title, note.content]);

  useEffect(() => {
    if (title === note.title && content === note.content) return undefined;

    setSaveState('Saving…');
    const timer = window.setTimeout(() => {
      saveQueue.current = saveQueue.current
        .then(() => onUpdate(note.id, { title, content }))
        .then(() => setSaveState('Saved'))
        .catch(() => setSaveState('Could not save'));
    }, 500);

    return () => window.clearTimeout(timer);
  }, [content, note.content, note.id, onUpdate, title, note.title]);

  return (
    <article className="sticky-note-card rounded-2xl border border-black/10 p-4 shadow-sm" style={{ backgroundColor: note.color }}>
      <div className="flex items-center gap-2">
        <input
          aria-label="Note title"
          className="min-w-0 flex-1 bg-transparent text-base font-bold text-slate-800 outline-none"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button
          type="button"
          className="rounded-lg bg-white/60 p-2 text-slate-700"
          aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
          onClick={() => onUpdate(note.id, { pinned: !note.pinned })}
        >
          <Pin size={15} fill={note.pinned ? 'currentColor' : 'none'} />
        </button>
        <button
          type="button"
          className="rounded-lg bg-white/60 p-2 text-slate-700"
          aria-label="Delete note"
          onClick={() => onDelete(note.id)}
        >
          <Trash2 size={15} />
        </button>
      </div>
      <textarea
        aria-label="Note content"
        className="mt-3 min-h-32 w-full resize-y bg-transparent text-sm text-slate-700 outline-none"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <p className="mt-2 text-right text-xs text-slate-600" role="status">{saveState}</p>
      <button
        type="button"
        className="mt-1 flex items-center gap-1 text-xs text-slate-700"
        aria-label={note.completed ? 'Mark note as active' : 'Mark note as completed'}
        onClick={() => onUpdate(note.id, { completed: !note.completed })}
      >
        {note.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
        {note.completed ? 'Completed' : 'Mark complete'}
      </button>
    </article>
  );
}

export default function StickyNotesWindow() {
  const notes = useStore((state) => state.notes);
  const fetchCurrentUser = useStore((state) => state.fetchCurrentUser);
  const fetchNotes = useStore((state) => state.fetchNotes);
  const createNote = useStore((state) => state.createNote);
  const updateNote = useStore((state) => state.updateNote);
  const deleteNote = useStore((state) => state.deleteNote);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(colors[0]);
  const [error, setError] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    fetchCurrentUser()
      .then((user) => {
        if (!user) {
          setError('Please sign in to TaskTracker before opening your notes.');
          return;
        }

        return fetchNotes();
      })
      .catch(() => setError('Could not load notes. Please sign in to TaskTracker first.'));
  }, [fetchCurrentUser, fetchNotes]);

  const handleUpdate = async (id, changes) => {
    setError('');
    await updateNote(id, changes);
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete the note.');
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!title.trim() && !content.trim()) return;

    try {
      await createNote({ title: title.trim() || 'Untitled note', content, color });
      setTitle('');
      setContent('');
      setColor(colors[0]);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not create the note.');
    }
  };

  return (
    <main className="min-h-screen bg-background p-4 text-slate-800">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">TaskTracker</p>
          <h1 className="text-xl font-bold">Sticky notes</h1>
        </div>
        <button
          type="button"
          onClick={() => window.close()}
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600"
          aria-label="Close sticky notes window"
          title="Close window"
        >
          <X size={18} />
        </button>
      </header>

      <form onSubmit={handleCreate} className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          className="input"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="New note title"
          aria-label="New note title"
        />
        <textarea
          className="input mt-2 min-h-24 resize-y"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write a quick note…"
          aria-label="New note content"
        />
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex gap-2" aria-label="Note color">
            {colors.map((noteColor) => (
              <button
                key={noteColor}
                type="button"
                aria-label={`Select ${noteColor} note color`}
                aria-pressed={color === noteColor}
                onClick={() => setColor(noteColor)}
                className={`h-6 w-6 rounded-full border-2 ${color === noteColor ? 'border-slate-800' : 'border-white'}`}
                style={{ backgroundColor: noteColor }}
              />
            ))}
          </div>
          <button type="submit" className="button-primary">
            <Plus size={16} className="mr-1" /> Add
          </button>
        </div>
      </form>

      {error && <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

      <section className="space-y-3">
        <label className="mb-3 flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(event) => setShowCompleted(event.target.checked)}
          />
          Show completed notes
        </label>
        {notes.filter((note) => showCompleted || !note.completed).length ? (
          notes
            .filter((note) => showCompleted || !note.completed)
            .map((note) => (
              <StickyNoteCard key={note.id} note={note} onUpdate={handleUpdate} onDelete={handleDelete} />
            ))
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
            No notes yet. Add one above to keep it handy.
          </p>
        )}
      </section>
    </main>
  );
}
