import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Moon, Sun } from 'lucide-react';
import { setAuthToken } from '../../../services/api';
import { useTheme } from '../../../hooks/useTheme';

const API_BASE = 'https://insightvault.onrender.com';

export function AuthForm({ onAuthed }: { onAuthed?: () => void }) {
	const [mode, setMode] = useState<'login' | 'register'>('login');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const { theme, setTheme } = useTheme();

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
		onAuthed?.();
	};

	return (
		<div className="mx-auto mt-24 max-w-sm rounded-lg border p-6 dark:border-neutral-800">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-xl font-semibold">{mode === 'login' ? 'Login' : 'Create account'}</h2>
				<Button aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} size="icon" variant="outline" className="icon-btn bg-transparent text-neutral-900 hover:text-white hover:bg-black dark:text-neutral-100 dark:hover:bg-neutral-800">
					{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
				</Button>
			</div>
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
					<button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="auth-toggle rounded-md border px-3 py-2 text-sm text-black hover:text-white hover:bg-black dark:text-white dark:hover:text-white dark:hover:bg-neutral-800">
						{mode === 'login' ? 'Create account' : 'Have an account? Login'}
					</button>
					<Button type="submit">{mode === 'login' ? 'Login' : 'Register'}</Button>
				</div>
			</form>
		</div>
	);
}



