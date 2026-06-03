import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Navigation() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="top-nav">
            <div className="top-nav__inner">
                {/* Brand Name matching the custom blue layout aesthetic */}
                <Link to="/" className="brand">
                    JournalFlow<span className="brand-dot">.</span>
                </Link>

                <nav className="top-nav__links">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            <Link to="/journals/new" className="nav-link">New Entry</Link>
                            <span className="user-pill">{user?.name || user?.email || 'User'}</span>
                            <button type="button" className="nav-logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link nav-link--login">Login</Link>
                            <Link to="/register" className="nav-register-btn">Get Started</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}