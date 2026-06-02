import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getErrorMessage } from '../../services/api';

export default function Register() {
	const navigate = useNavigate();
	const { register } = useAuth();

	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const onChange = (event) => {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setError('');

		if (!form.name || !form.email || !form.password || !form.confirmPassword) {
			setError('All fields are required.');
			return;
		}

		if (form.password !== form.confirmPassword) {
			setError('Passwords do not match.');
			return;
		}

		try {
			setLoading(true);
			await register(form.name.trim(), form.email.trim(), form.password);
			navigate('/login');
		} catch (err) {
			setError(getErrorMessage(err, 'Registration failed'));
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="card auth-card">
			<h2>Create account</h2>
			<p>Start tracking your days with your private journal.</p>

			<form className="form-grid" onSubmit={onSubmit}>
				<label>
					Name
					<input
						type="text"
						name="name"
						value={form.name}
						onChange={onChange}
						placeholder="Your name"
					/>
				</label>

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
						placeholder="At least 6 characters"
					/>
				</label>

				<label>
					Confirm Password
					<input
						type="password"
						name="confirmPassword"
						value={form.confirmPassword}
						onChange={onChange}
						placeholder="Re-enter password"
					/>
				</label>

				{error && <p className="message message--error">{error}</p>}

				<button className="btn btn--primary" type="submit" disabled={loading}>
					{loading ? 'Creating account...' : 'Register'}
				</button>
			</form>

			<p className="auth-switch">
				Already have an account? <Link to="/login">Login</Link>
			</p>
		</section>
	);
}
