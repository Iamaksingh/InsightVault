import { AuthForm } from '../components/AuthForm';

export function AuthPage({ onAuthed }: { onAuthed?: () => void }) {
	return <AuthForm onAuthed={onAuthed} />;
}


