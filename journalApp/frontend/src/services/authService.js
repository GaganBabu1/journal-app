import api from './api';

const TOKEN_KEY = 'journal_token';
const USER_KEY = 'journal_user';
const storage = window.sessionStorage;

function persistSession(token, user) {
	if (token) {
		storage.setItem(TOKEN_KEY, token);
	}
	if (user) {
		storage.setItem(USER_KEY, JSON.stringify(user));
	}
}

const authService = {
	async login(email, password) {
		const { data } = await api.post('/auth/login', { email, password });
		persistSession(data?.token, data?.user);
		return data;
	},

	async register(name, email, password) {
		const { data } = await api.post('/auth/register', { name, email, password });
		return data;
	},

	logout() {
		storage.removeItem(TOKEN_KEY);
		storage.removeItem(USER_KEY);
	},

	getToken() {
		return storage.getItem(TOKEN_KEY);
	},

	getUser() {
		const raw = storage.getItem(USER_KEY);
		if (!raw) {
			return null;
		}

		try {
			return JSON.parse(raw);
		} catch {
			return null;
		}
	},

	isAuthenticated() {
		return Boolean(storage.getItem(TOKEN_KEY));
	},
};

export default authService;
