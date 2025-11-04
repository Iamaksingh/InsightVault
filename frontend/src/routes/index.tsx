import React, { useEffect, useState } from 'react';
import { DashboardPage } from '../pages/Dashboard';
import { AuthPage } from '../features/auth/pages/AuthPage';

export function AppRoutes() {
	const [token, setToken] = useState<string | null>(() => (typeof window !== 'undefined' ? localStorage.getItem('token') : null));

	useEffect(() => {
		function onStorage(e: StorageEvent) {
			if (e.key === 'token') setToken(e.newValue);
		}
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	}, []);

	if (!token) return <AuthPage onAuthed={() => setToken(localStorage.getItem('token'))} />;
	return <DashboardPage />;
}


