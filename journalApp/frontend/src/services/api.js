import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
	timeout: 15000,
});

api.interceptors.request.use((config) => {
	const token = sessionStorage.getItem('journal_token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			sessionStorage.removeItem('journal_token');
			sessionStorage.removeItem('journal_user');
			window.dispatchEvent(new Event('auth:unauthorized'));
		}
		return Promise.reject(error);
	}
);

export function getErrorMessage(error, fallback = 'Something went wrong') {
	return (
		error?.response?.data?.error ||
		error?.response?.data?.message ||
		error?.message ||
		fallback
	);
}

export default api;
