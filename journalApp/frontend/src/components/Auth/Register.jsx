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
        <div className="fb-layout-container">
            {/* Left Column: Brand Message */}
            <div className="fb-brand-section">
                <h1 className="fb-logo">JournalFlow</h1>
                <p className="fb-subtitle">
                    Start tracking your days, capture your inner thoughts, and maintain a private digital diary with your own personal layout.
                </p>
            </div>

            {/* Right Column: Form Card */}
            <div className="fb-form-container">
                <section className="card fb-card">
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#1e293b', textAlign: 'center' }}>
                        Create a New Account
                    </h2>
                    
                    <form className="fb-form" onSubmit={onSubmit}>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                placeholder="Full name"
                                aria-label="Full name"
                            />
                        </div>

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
                                placeholder="New password"
                                aria-label="New password"
                            />
                        </div>

                        <div className="input-wrapper">
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={onChange}
                                placeholder="Confirm password"
                                aria-label="Confirm password"
                            />
                        </div>

                        {error && <p className="message message--error fb-error">{error}</p>}

                        <button className="btn btn--primary fb-login-btn" type="submit" disabled={loading}>
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="fb-divider"></div>

                    <div className="fb-register-action">
                        <Link to="/login" className="btn fb-register-btn" style={{ backgroundColor: '#4b5563' }}>
                            Already have an account?
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}