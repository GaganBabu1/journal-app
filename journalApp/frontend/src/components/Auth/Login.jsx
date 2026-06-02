import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getErrorMessage } from '../../services/api';

export default function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [form, setForm] = useState({ email: '', password: '' });
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const onChange = (event) => {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setError('');

		if (!form.email || !form.password) {
			setError('Email and password are required.');
			return;
		}

		try {
			setLoading(true);
			await login(form.email.trim(), form.password);
			navigate('/dashboard');
		} catch (err) {
			setError(getErrorMessage(err, 'Login failed'));
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="card auth-card">
			<h2>Welcome back</h2>
			<p>Log in to continue writing your journal.</p>

			<form className="form-grid" onSubmit={onSubmit}>
				<label>
					Email
					<input
						type="email"
						name="email"
						value={form.email}
						onChange={onChange}
						placeholder="you@example.com"
					/>
				</label>

				<label>
					Password
					<input
						type="password"
						name="password"
						value={form.password}
						onChange={onChange}
						placeholder="Your password"
					/>
				</label>

				{error && <p className="message message--error">{error}</p>}

				<button className="btn btn--primary" type="submit" disabled={loading}>
					{loading ? 'Logging in...' : 'Login'}
				</button>
			</form>

			<p className="auth-switch">
				No account? <Link to="/register">Create one</Link>
			</p>
		</section>
	);
}
