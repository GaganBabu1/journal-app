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
        <div className="fb-layout-container">
            {/* Left Column: Brand Message */}
            <div className="fb-brand-section">
                <h1 className="fb-logo">Journal.</h1>
                <p className="fb-subtitle">
                    Log in to continue writing your journal, track your thoughts, and capture your daily memories.
                </p>
            </div>

            {/* Right Column: Form Card */}
            <div className="fb-form-container">
                <section className="card fb-card">
                    <form className="fb-form" onSubmit={onSubmit}>
                        <div className="input-wrapper">
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={onChange}
                                placeholder="Email address"
                                aria-label="Email address"
                            />
                        </div>

                        <div className="input-wrapper">
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={onChange}
                                placeholder="Password"
                                aria-label="Password"
                            />
                        </div>

                        {error && <p className="message message--error fb-error">{error}</p>}

                        <button className="btn btn--primary fb-login-btn" type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>

                    <div className="fb-divider"></div>

                    <div className="fb-register-action">
                        <Link to="/register" className="btn fb-register-btn">
                            Create new account
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}