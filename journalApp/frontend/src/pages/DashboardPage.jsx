import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import JournalList from '../components/Journal/JournalList';
import SearchBar from '../components/Journal/SearchBar';
import useJournals from '../hooks/useJournals';

export default function DashboardPage() {
	const { entries, meta, loading, error, loadEntries, deleteEntry } = useJournals();
	const [query, setQuery] = useState('');

	useEffect(() => {
		loadEntries(query ? { q: query } : {});
	}, [loadEntries, query]);

	const onSearch = (value) => {
		setQuery(value);
	};

	const onDelete = async (id) => {
		const confirmed = window.confirm('Delete this journal entry?');
		if (!confirmed) {
			return;
		}

		await deleteEntry(id);
	};

	return (
		<section className="page">
			<div className="section-head">
				<div>
					<h2>Your Dashboard</h2>
					<p>View, search, and manage your journal entries.</p>
				</div>
				<Link to="/journals/new" className="btn btn--primary">
					New Entry
				</Link>
			</div>

			<SearchBar onSearch={onSearch} loading={loading} />

			{error && <p className="message message--error">{error}</p>}
			{meta && (
				<p className="message">
					Showing page {meta.page + 1} of {Math.max(meta.totalPages, 1)} ({meta.totalElements}{' '}
					total entries)
				</p>
			)}

			<JournalList entries={entries} loading={loading} onDelete={onDelete} />
		</section>
	);
}
