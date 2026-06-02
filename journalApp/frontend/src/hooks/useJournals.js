import { useCallback, useState } from 'react';
import { getErrorMessage } from '../services/api';
import journalService from '../services/journalService';

export default function useJournals() {
	const [entries, setEntries] = useState([]);
	const [meta, setMeta] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const loadEntries = useCallback(async (params = {}) => {
		try {
			setLoading(true);
			setError('');
			const response = await journalService.getAll(params);
			setEntries(response.items ?? []);
			setMeta(response.meta ?? null);
			return response;
		} catch (err) {
			setError(getErrorMessage(err, 'Failed to load journal entries'));
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const createEntry = useCallback(async (payload) => {
		const created = await journalService.create(payload);
		setEntries((prev) => [created, ...prev]);
		return created;
	}, []);

	const updateEntry = useCallback(async (id, payload) => {
		const updated = await journalService.update(id, payload);
		setEntries((prev) => prev.map((entry) => (entry.id === id ? updated : entry)));
		return updated;
	}, []);

	const deleteEntry = useCallback(async (id) => {
		await journalService.remove(id);
		setEntries((prev) => prev.filter((entry) => entry.id !== id));
	}, []);

	return {
		entries,
		meta,
		loading,
		error,
		loadEntries,
		createEntry,
		updateEntry,
		deleteEntry,
	};
}
