import { useEffect, useMemo, useState } from 'react';
import { Plus, Pin, Save, Trash2, Circle, CheckCircle2 } from 'lucide-react';
import useStore from '../store/useStore';

const palette = ['#FFF3B0', '#FFD6E0', '#D6E8FF', '#D9F7E8', '#E9DDFF'];

export default function NotesPage() {
  const notes = useStore((state) => state.notes);
  const fetchNotes = useStore((state) => state.fetchNotes);
  const createNote = useStore((state) => state.createNote);
  const updateNote = useStore((state) => state.updateNote);
  const deleteNote = useStore((state) => state.deleteNote);
  const [draft, setDraft] = useState({ title: '', content: '', color: palette[0], pinned: false });
  const [saving, setSaving] = useState('idle');
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreate = async () => {
    if (!draft.title.trim() && !draft.content.trim()) return;
    await createNote({
      title: draft.title || 'Untitled note',
      content: draft.content,
      color: draft.color,
      pinned: draft.pinned,
    });
    setDraft({ title: '', content: '', color: palette[0], pinned: false });
    fetchNotes();
  };

  useEffect(() => {
    if (!draft.title && !draft.content) return;
    setSaving('saving');
    const timer = setTimeout(() => {
      setSaving('saved');
    }, 600);
    return () => clearTimeout(timer);
  }, [draft.title, draft.content, draft.color, draft.pinned]);

  const handleUpdate = async (noteId, changes) => {
    setSaving('saving');
    await updateNote(noteId, changes);
    setSaving('saved');
    fetchNotes();
  };

  const sortedNotes = useMemo(
    () => notes
      .filter((note) => showCompleted || !note.completed)
      .sort((a, b) => Number(b.pinned) - Number(a.pinned)),
    [notes, showCompleted]
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Capture ideas</p>
        <h1 className="text-3xl font-bold text-slate-800">Sticky notes</h1>
      </div>

      <label className="flex w-fit items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={(event) => setShowCompleted(event.target.checked)}
        />
        Show completed notes
      </label>

      <div className="card p-5">
        <div className="mb-4 flex items-center gap-3">
          <Plus className="text-primary" size={18} />
          <h2 className="text-xl font-bold text-slate-800">Create note</h2>
        </div>

        <div className="space-y-4">
          <input className="input" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Note title" />
          <textarea className="input min-h-[120px] resize-none" value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} placeholder="Write something useful..." />

          <div className="flex flex-wrap items-center gap-2">
            {palette.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setDraft({ ...draft, color })}
                className={`h-8 w-8 rounded-full border-2 ${draft.color === color ? 'border-slate-800' : 'border-white'}`}
                style={{ background: color }}
              />
            ))}
            <button type="button" onClick={() => setDraft({ ...draft, pinned: !draft.pinned })} className="ml-auto flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
              <Pin size={15} /> {draft.pinned ? 'Pinned' : 'Pin note'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{saving === 'saving' ? 'Saving...' : saving === 'saved' ? 'Saved' : 'Draft'}</span>
            <button type="button" className="button-primary" onClick={handleCreate}>Save note</button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sortedNotes.map((note) => (
          <div key={note.id} className={`sticky-note-card rounded-3xl border border-slate-200 p-4 shadow-soft ${note.completed ? 'opacity-70' : ''}`} style={{ background: note.color || '#FFF3B0' }}>
            <div className="flex items-center justify-between gap-2">
              <input
                className={`bg-transparent text-lg font-bold text-slate-800 outline-none ${note.completed ? 'line-through' : ''}`}
                value={note.title}
                onChange={(event) => handleUpdate(note.id, { title: event.target.value })}
              />
              <button onClick={() => deleteNote(note.id)} className="rounded-lg bg-white/60 p-2 text-slate-600">
                <Trash2 size={15} />
              </button>
            </div>

            <textarea
              className="mt-3 w-full resize-none border-none bg-transparent text-sm text-slate-700 outline-none"
              rows={6}
              value={note.content}
              onChange={(event) => handleUpdate(note.id, { content: event.target.value })}
            />

            <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-4">
                <button onClick={() => handleUpdate(note.id, { pinned: !note.pinned })} className="flex items-center gap-1">
                  <Pin size={14} /> {note.pinned ? 'Pinned' : 'Pin'}
                </button>
                <button
                  onClick={() => handleUpdate(note.id, { completed: !note.completed })}
                  className="flex items-center gap-1"
                  aria-label={note.completed ? 'Mark note as active' : 'Mark note as completed'}
                >
                  {note.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                  {note.completed ? 'Completed' : 'Mark complete'}
                </button>
              </div>
              <span className="flex items-center gap-1"><Save size={14} />{saving}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
