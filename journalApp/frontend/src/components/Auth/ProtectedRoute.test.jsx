import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import ProtectedRoute from './ProtectedRoute';

const mockUseAuth = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
	default: () => mockUseAuth(),
}));

function renderWithRouter(initialPath = '/private') {
	return render(
		<MemoryRouter initialEntries={[initialPath]}>
			<Routes>
				<Route
					path="/private"
					element={
						<ProtectedRoute>
							<p>Private content</p>
						</ProtectedRoute>
					}
				/>
				<Route path="/login" element={<p>Login page</p>} />
			</Routes>
		</MemoryRouter>
	);
}

describe('ProtectedRoute', () => {
	it('renders children when authenticated', () => {
		mockUseAuth.mockReturnValue({ isAuthenticated: true });

		renderWithRouter();
		expect(screen.getByText('Private content')).toBeInTheDocument();
	});

	it('redirects to login when unauthenticated', () => {
		mockUseAuth.mockReturnValue({ isAuthenticated: false });

		renderWithRouter();
		expect(screen.getByText('Login page')).toBeInTheDocument();
	});
});
