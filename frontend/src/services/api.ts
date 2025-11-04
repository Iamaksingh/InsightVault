export const API_BASE = 'https://insightvault.onrender.com';

export function getAuthToken(): string | null {
	return localStorage.getItem('token');
}

export function setAuthToken(token: string) {
	localStorage.setItem('token', token);
}

export function clearAuthToken() {
	localStorage.removeItem('token');
}

export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
	const token = getAuthToken();
	const headers = new Headers(init.headers || {});
	headers.set('Content-Type', 'application/json');
	if (token) headers.set('Authorization', `Bearer ${token}`);
	return fetch(input, { ...init, headers });
}


