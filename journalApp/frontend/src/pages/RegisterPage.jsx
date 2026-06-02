import { Navigate } from 'react-router-dom';
import Register from '../components/Auth/Register';
import useAuth from '../hooks/useAuth';

export default function RegisterPage() {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}

	return <Register />;
}
