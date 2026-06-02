import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import DashboardPage from './DashboardPage';

const mockLoadEntries = vi.fn();
const mockDeleteEntry = vi.fn();
const mockUseJournals = vi.fn();

vi.mock('../hooks/useJournals', () => ({
	default: () => mockUseJournals(),
}));

describe('DashboardPage', () => {
	beforeEach(() => {
		mockLoadEntries.mockReset();
		mockDeleteEntry.mockReset();
		mockUseJournals.mockReset();
		window.confirm = vi.fn(() => true);
		mockUseJournals.mockReturnValue({
			entries: [
				{
					id: '1',
					title: 'First entry',
					content: 'Today was productive',
					createdAt: '2026-01-01T10:00:00.000Z',
				},
			],
			meta: { page: 0, totalPages: 1, totalElements: 1 },
			loading: false,
			error: '',
			loadEntries: mockLoadEntries,
			deleteEntry: mockDeleteEntry,
		});
	});

	it('loads entries on mount and renders list', () => {
		render(
			<MemoryRouter>
				<DashboardPage />
			</MemoryRouter>
		);

		expect(mockLoadEntries).toHaveBeenCalledWith({});
		expect(screen.getByText('First entry')).toBeInTheDocument();
		expect(screen.getByText(/Showing page 1 of 1/i)).toBeInTheDocument();
	});

	it('deletes an entry after confirmation', async () => {
		render(
			<MemoryRouter>
				<DashboardPage />
			</MemoryRouter>
		);

		await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

		expect(window.confirm).toHaveBeenCalled();
		expect(mockDeleteEntry).toHaveBeenCalledWith('1');
	});
});
