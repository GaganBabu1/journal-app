import { Link } from 'react-router-dom';

function formatDate(value) {
	if (!value) {
		return 'No date';
	}
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
}

function previewText(text, max = 180) {
	if (!text) {
		return 'No content yet.';
	}
	return text.length <= max ? text : `${text.slice(0, max)}...`;
}

export default function JournalList({ entries, loading, onDelete }) {
	if (loading) {
		return <p className="message">Loading entries...</p>;
	}

	if (!entries.length) {
		return <p className="message">No entries found. Start with your first journal entry.</p>;
	}

	return (
		<div className="journal-grid">
			{entries.map((entry) => (
				<article className="card journal-card" key={entry.id}>
					<h3>{entry.title || 'Untitled entry'}</h3>
					<p className="journal-date">{formatDate(entry.updatedAt || entry.createdAt)}</p>
					<p>{previewText(entry.content)}</p>
					<div className="card-actions">
						<Link className="btn btn--ghost" to={`/journals/${entry.id}`}>
							View
						</Link>
						<Link className="btn btn--secondary" to={`/journals/${entry.id}/edit`}>
							Edit
						</Link>
						<button
							type="button"
							className="btn btn--danger"
							onClick={() => onDelete(entry.id)}
						>
							Delete
						</button>
					</div>
				</article>
			))}
		</div>
	);
}
