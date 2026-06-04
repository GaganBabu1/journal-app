import { Navigate, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import JournalDetail from './components/Journal/JournalDetail';
import JournalForm from './components/Journal/JournalForm';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
	return (
		<div className="app-shell">
			<Navigation />
			<main className="app-main">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />

					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<DashboardPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/journals/new"
						element={
							<ProtectedRoute>
								<JournalForm />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/journals/:id"
						element={
							<ProtectedRoute>
								<JournalDetail />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/journals/:id/edit"
						element={
							<ProtectedRoute>
								<JournalForm />
							</ProtectedRoute>
						}
					/>
					{/* Fallback redirect */}
					<Route path="*" element={<Navigate to="/dashboard" replace />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;