import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from './Login';

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
	default: () => ({ login: mockLogin }),
}));

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

describe('Login', () => {
	beforeEach(() => {
		mockLogin.mockReset();
		mockNavigate.mockReset();
	});

	it('shows validation message for empty form', async () => {
		render(
			<MemoryRouter>
				<Login />
			</MemoryRouter>
		);

		await userEvent.click(screen.getByRole('button', { name: 'Log In' }));

		expect(screen.getByText('Email and password are required.')).toBeInTheDocument();
		expect(mockLogin).not.toHaveBeenCalled();
	});

	it('submits credentials and navigates to dashboard', async () => {
		mockLogin.mockResolvedValue({});
		render(
			<MemoryRouter>
				<Login />
			</MemoryRouter>
		);

		await userEvent.type(screen.getByPlaceholderText('Email address'), 'a@b.com');
		await userEvent.type(screen.getByPlaceholderText('Password'), 'secret123');
		await userEvent.click(screen.getByRole('button', { name: 'Log In' }));

		expect(mockLogin).toHaveBeenCalledWith('a@b.com', 'secret123');
		expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
	});
});
