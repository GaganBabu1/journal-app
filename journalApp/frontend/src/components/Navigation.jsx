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
				<Link to="/" className="brand">
					JournalFlow
				</Link>

				<nav className="top-nav__links">
					{isAuthenticated ? (
						<>
							<Link to="/dashboard">Dashboard</Link>
							<Link to="/journals/new">New Entry</Link>
							<span className="user-pill">{user?.name || user?.email || 'User'}</span>
							<button type="button" className="link-button" onClick={handleLogout}>
								Logout
							</button>
						</>
					) : (
						<>
							<Link to="/login">Login</Link>
							<Link to="/register">Register</Link>
						</>
					)}
				</nav>
			</div>
		</header>
	);
}
