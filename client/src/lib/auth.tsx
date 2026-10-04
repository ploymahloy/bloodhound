import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ReactNode
} from 'react';

export type AuthUser = {
	id: string;
	email: string;
	username: string;
	firstName: string | null;
	lastName: string | null;
};

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

type AuthContextValue = {
	user: AuthUser | null;
	status: AuthStatus;
	refresh: () => Promise<void>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [status, setStatus] = useState<AuthStatus>('loading');

	const refresh = useCallback(async () => {
		try {
			const response = await fetch('/api/me', { credentials: 'include' });
			if (!response.ok) {
				setUser(null);
				setStatus('anonymous');
				return;
			}
			const data = (await response.json()) as { user: AuthUser };
			setUser(data.user);
			setStatus('authenticated');
		} catch {
			setUser(null);
			setStatus('anonymous');
		}
	}, []);

	const logout = useCallback(async () => {
		try {
			await fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include'
			});
		} catch {
			// Clear local auth state even if the request fails.
		}
		setUser(null);
		setStatus('anonymous');
	}, []);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	return (
		<AuthContext.Provider value={{ user, status, refresh, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const value = useContext(AuthContext);
	if (!value) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return value;
};
