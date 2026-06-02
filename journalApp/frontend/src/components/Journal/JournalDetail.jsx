import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../services/api';
import journalService from '../../services/journalService';

function formatDate(value) {
	if (!value) {
		return '';
	}
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
}

export default function JournalDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [entry, setEntry] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const result = await journalService.getById(id);
				setEntry(result);
			} catch (err) {
				setError(getErrorMessage(err, 'Failed to load journal entry'));
			} finally {
				setLoading(false);
			}
		})();
	}, [id]);

	const onDelete = async () => {
		const confirmed = window.confirm('Delete this journal entry?');
		if (!confirmed) {
			return;
		}

		try {
			await journalService.remove(id);
			navigate('/dashboard');
		} catch (err) {
			setError(getErrorMessage(err, 'Failed to delete entry'));
		}
	};

	if (loading) {
		return <p className="message">Loading entry...</p>;
	}

	if (error) {
		return <p className="message message--error">{error}</p>;
	}

	if (!entry) {
		return <p className="message">Entry not found.</p>;
	}

	return (
		<article className="card">
			<div className="section-head">
				<div>
					<h2>{entry.title || 'Untitled entry'}</h2>
					<p className="journal-date">{formatDate(entry.updatedAt || entry.createdAt)}</p>
				</div>
				<div className="card-actions">
					<Link className="btn btn--secondary" to={`/journals/${id}/edit`}>
						Edit
					</Link>
					<button type="button" className="btn btn--danger" onClick={onDelete}>
						Delete
					</button>
					<Link className="btn btn--ghost" to="/dashboard">
						Back
					</Link>
				</div>
			</div>
			<p className="entry-content">{entry.content}</p>
		</article>
	);
}
