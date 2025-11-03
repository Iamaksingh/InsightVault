import React, { useEffect, useMemo, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Plus, Moon, Sun, Trash2, PencilLine, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog } from '../components/ui/dialog';
import { AlertDialog } from '../components/ui/alert-dialog';
import { apiFetch, clearAuthToken, setAuthToken } from '../lib/api';
import { useToast } from '../components/ui/toast';
import { Skeleton } from '../components/ui/skeleton';

type Entry = {
  _id?: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  link?: string;
  createdAt?: string;
  updatedAt?: string;
};

type Preference = { userId: string; theme: 'light' | 'dark' | 'system'; accentColor: string };

const API_BASE = 'https://insightvault.onrender.com';

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => (localStorage.getItem('theme') as any) || 'system');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'system' ? prefersDark : theme === 'dark';
    root.classList.remove('dark');
    if (isDark) root.classList.add('dark');
  }, [theme]);

  return { theme, setTheme };
}

function Auth({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch(`${API_BASE}/api/auth/${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Failed');
      return;
    }
    const data = await res.json();
    setAuthToken(data.token);
    onAuthed();
  };
  return (
    <div className="mx-auto mt-24 max-w-sm rounded-lg border p-6 dark:border-neutral-800">
      <h2 className="mb-4 text-xl font-semibold">{mode === 'login' ? 'Login' : 'Create account'}</h2>
      <form className="space-y-3" onSubmit={submit}>
        <div className="grid gap-1.5">
          <label className="text-sm">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm">Password</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="auth-toggle rounded-md border px-3 py-2 text-sm text-black hover:text-white hover:bg-black dark:text-white dark:hover:text-white dark:hover:bg-neutral-800"
          >
            {mode === 'login' ? 'Create account' : 'Have an account? Login'}
          </button>
          <Button type="submit">{mode === 'login' ? 'Login' : 'Register'}</Button>
        </div>
      </form>
    </div>
  );
}

export function App() {
  const { theme, setTheme } = useTheme();
  const [accent, setAccent] = useState<string>(() => localStorage.getItem('accentColor') || '#7c3aed');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [editing, setEditing] = useState<Entry | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const pickerHideTimer = React.useRef<number | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => set.add(e.category));
    return ['all', ...Array.from(set).sort()];
  }, [entries]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accent);
  }, [accent]);

  // load preferences
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return; // not logged in
    apiFetch(`${API_BASE}/api/preferences`)
      .then((r) => (r.ok ? r.json() : null))
      .then((p: Preference | null) => {
        if (!p) return;
        if (p?.accentColor) {
          setAccent(p.accentColor);
          localStorage.setItem('accentColor', p.accentColor);
        }
        if (p?.theme) setTheme(p.theme);
      })
      .catch(() => {});
  }, []);

  // save preferences when changed
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return; // do not persist without auth
    localStorage.setItem('accentColor', accent);
    apiFetch(`${API_BASE}/api/preferences`, {
      method: 'PUT',
      body: JSON.stringify({ theme, accentColor: accent }),
    }).catch(() => {});
  }, [theme, accent]);

  const load = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setEntries([]);
      return;
    }
    setIsLoading(true);
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (query) params.set('q', query);
    const res = await apiFetch(`${API_BASE}/api/entries?${params.toString()}`);
    if (!res.ok) {
      setEntries([]);
      setIsLoading(false);
      return;
    }
    const data = await res.json();
    if (Array.isArray(data)) setEntries(data);
    else setEntries([]);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const { add } = useToast();
  const normalizeUrl = (value: string): string => {
    const v = value.trim();
    if (!v) return '';
    if (/^https?:\/\//i.test(v)) return v;
    return `https://${v}`;
  };
  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = new FormData(ev.currentTarget);
    const payload: Entry = {
      title: String(form.get('title') || ''),
      description: String(form.get('description') || ''),
      category: String(form.get('category') || 'General'),
      link: normalizeUrl(String(form.get('link') || '')) || undefined,
      tags: String(form.get('tags') || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (editing?._id) {
      const res = await apiFetch(`${API_BASE}/api/entries/${editing._id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (res.ok) add({ title: 'Entry updated' }); else add({ title: 'Failed to update entry' });
    } else {
      const res = await apiFetch(`${API_BASE}/api/entries`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.ok) add({ title: 'Entry added' }); else add({ title: 'Failed to add entry' });
    }
    setShowDialog(false);
    setEditing(null);
    await load();
  };

  const filtered = useMemo(() => {
    if (!query) return entries;
    const q = query.toLowerCase();
    return entries.filter((e) =>
      [e.title, e.description, e.category, e.tags.join(' ')].some((v) => (v || '').toLowerCase().includes(q))
    );
  }, [entries, query]);

  const token = localStorage.getItem('token');
  if (!token) {
    return (
      <Auth onAuthed={() => load()} />
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <header className="sticky top-0 z-40 mb-6 flex items-center justify-between border-b border-neutral-200/70 bg-transparent py-3 dark:border-neutral-800">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--accent-color)' }}>
          InsightVault
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              size="icon"
              variant="outline"
              className="text-neutral-900 dark:text-neutral-100"
            >
              {theme === 'dark' ? <Sun size={16} color="#ffffff" /> : <Moon size={16} color="#000000" />}
            </Button>
          </div>
          <div
            className="relative inline-flex items-center align-middle"
            onMouseEnter={() => {
              if (pickerHideTimer.current) window.clearTimeout(pickerHideTimer.current);
              setShowPicker(true);
            }}
            onMouseLeave={() => {
              if (pickerHideTimer.current) window.clearTimeout(pickerHideTimer.current);
              // small delay to allow moving cursor towards popover without closing instantly
              pickerHideTimer.current = window.setTimeout(() => setShowPicker(false), 400);
            }}
          >
            <Button
              variant="outline"
              size="icon"
              aria-label="Accent color"
              title="Accent color"
              className="shrink-0"
            >
              <span className="block h-4 w-4 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }} />
            </Button>
            {showPicker && (
              <div className="absolute right-0 top-full z-50 mt-2" onMouseEnter={() => {
                if (pickerHideTimer.current) window.clearTimeout(pickerHideTimer.current);
                setShowPicker(true);
              }} onMouseLeave={() => {
                if (pickerHideTimer.current) window.clearTimeout(pickerHideTimer.current);
                pickerHideTimer.current = window.setTimeout(() => setShowPicker(false), 400);
              }}>
                <div className="rounded-md border bg-white p-2 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
                  <HexColorPicker color={accent} onChange={setAccent} />
                </div>
              </div>
            )}
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setShowDialog(true);
            }}
            className="inline-flex items-center gap-2"
          >
            <Plus size={16} /> Add Entry
          </Button>
          <Button variant="outline" size="icon" className="text-neutral-900 dark:text-neutral-100" onClick={() => { clearAuthToken(); window.location.reload(); }} title="Logout">
            <LogOut size={16} color={theme === 'dark' ? '#ffffff' : '#000000'} />
          </Button>
        </div>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1 text-sm ${
                category === c ? 'bg-[var(--accent-color)] text-white border-transparent' : 'dark:border-neutral-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-xs">
          <svg className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="8"/></svg>
          <Input
            className="w-full pl-8 pr-8"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button aria-label="Clear" className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700" onClick={() => setQuery('')}>×</button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4 dark:border-neutral-800">
              <Skeleton className="mb-2 h-5 w-1/2" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border p-10 text-center dark:border-neutral-800">
          <p className="mb-2 text-sm text-neutral-600 dark:text-neutral-300">No entries found</p>
          <Button onClick={() => { setEditing(null); setShowDialog(true); }}>Add your first entry</Button>
        </div>
      ) : (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => (
          <article key={e._id} className="va-card rounded-lg border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-lg font-semibold">{e.title}</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="text-black hover:text-black hover:bg-neutral-100 dark:text-white dark:hover:text-white dark:hover:bg-neutral-800 opacity-100"
                  onClick={() => {
                    setEditing(e);
                    setShowDialog(true);
                  }}
                >
                  <PencilLine size={16} color={theme === 'dark' ? '#ffffff' : '#000000'} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-black hover:text-black hover:bg-white dark:text-white dark:hover:text-white dark:hover:bg-neutral-800 opacity-100"
                  onClick={() => setDeleteId(e._id!)}
                >
                  <Trash2 size={16} color={theme === 'dark' ? '#ffffff' : '#000000'} />
                </Button>
              </div>
            </div>
            <p className="text-sm text-neutral-900 dark:text-neutral-300">{e.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--accent-color)]/10 px-2 py-0.5 text-xs text-[var(--accent-color)]">{e.category}</span>
              {e.tags?.map((t, i) => (
                <span key={i} className="rounded-full border px-2 py-0.5 text-xs dark:border-neutral-800">
                  {t}
                </span>
              ))}
              {e.link ? (
                <a className="text-xs underline" href={/^https?:\/\//i.test(e.link) ? e.link : `https://${e.link}`} target="_blank" rel="noopener noreferrer">
                  Open link
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <h2 className="mb-4 text-xl font-semibold">{editing?._id ? 'Edit Entry' : 'Add Entry'}</h2>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div className="grid gap-1.5">
            <label className="text-sm">Title</label>
            <Input name="title" required defaultValue={editing?.title} />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm">Description</label>
            <Textarea name="description" rows={4} defaultValue={editing?.description} />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm">Category</label>
            <Input name="category" defaultValue={editing?.category || 'General'} />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm">Tags (comma separated)</label>
            <Input name="tags" defaultValue={editing?.tags?.join(', ')} />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm">Link (optional)</label>
            <Input name="link" defaultValue={editing?.link} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editing?._id ? 'Save' : 'Create'}
            </Button>
          </div>
        </form>
      </Dialog>

      <AlertDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await apiFetch(`${API_BASE}/api/entries/${deleteId}`, { method: 'DELETE' });
            setDeleteId(null);
            await load();
          }
        }}
        title="Delete this entry?"
        description="This action cannot be undone."
      />
    </div>
  );
}


