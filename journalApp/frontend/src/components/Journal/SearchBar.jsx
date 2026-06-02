import { useState } from 'react';

export default function SearchBar({ onSearch, loading = false }) {
	const [query, setQuery] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		onSearch(query.trim());
	};

	const handleClear = () => {
		setQuery('');
		onSearch('');
	};

	return (
		<form className="search-row" onSubmit={handleSubmit}>
			<input
				type="search"
				value={query}
				onChange={(event) => setQuery(event.target.value)}
				placeholder="Search by title or content"
				aria-label="Search journal entries"
			/>
			<button type="submit" className="btn btn--primary" disabled={loading}>
				Search
			</button>
			<button type="button" className="btn btn--ghost" onClick={handleClear} disabled={loading}>
				Clear
			</button>
		</form>
	);
}
