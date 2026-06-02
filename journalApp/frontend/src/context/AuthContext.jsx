import { createContext, useEffect, useMemo, useState } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(authService.getUser());
	const [token, setToken] = useState(authService.getToken());

	async function login(email, password) {
		const response = await authService.login(email, password);
		setUser(response?.user ?? null);
		setToken(response?.token ?? null);
		return response;
	}

	async function register(name, email, password) {
		return authService.register(name, email, password);
	}

	function logout() {
		authService.logout();
		setUser(null);
		setToken(null);
	}

	useEffect(() => {
		const onUnauthorized = () => logout();
		const clearSessionOnUnload = () => {
			authService.logout();
		};
		window.addEventListener('auth:unauthorized', onUnauthorized);
		window.addEventListener('beforeunload', clearSessionOnUnload);
		return () => {
			window.removeEventListener('auth:unauthorized', onUnauthorized);
			window.removeEventListener('beforeunload', clearSessionOnUnload);
		};
	}, []);

	const value = useMemo(
		() => ({
			user,
			token,
			isAuthenticated: Boolean(token),
			login,
			register,
			logout,
		}),
		[user, token]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
