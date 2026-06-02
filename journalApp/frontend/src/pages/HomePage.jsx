import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function HomePage() {
	const { isAuthenticated } = useAuth();

	return (
		<section className="hero card">
			<h1>Your private daily journal</h1>
			<p>
				Capture thoughts, ideas, and progress in one secure place. Search and manage your entries
				anytime.
			</p>

			<div className="hero-actions">
				{isAuthenticated ? (
					<Link className="btn btn--primary" to="/dashboard">
						Go to Dashboard
					</Link>
				) : (
					<>
						<Link className="btn btn--primary" to="/login">
							Login
						</Link>
						<Link className="btn btn--secondary" to="/register">
							Register
						</Link>
					</>
				)}
			</div>
		</section>
	);
}
