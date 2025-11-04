import { useEffect, useState } from 'react';

export function useTheme() {
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


