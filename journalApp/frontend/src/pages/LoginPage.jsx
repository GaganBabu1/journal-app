import { Navigate } from 'react-router-dom';
import Login from '../components/Auth/Login';
import useAuth from '../hooks/useAuth';

export default function LoginPage() {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}

	return <Login />;
}
