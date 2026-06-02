import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../services/api';
import journalService from '../../services/journalService';

export default function JournalForm() {
	const navigate = useNavigate();
	const { id } = useParams();
	const isEditMode = Boolean(id);

	const [form, setForm] = useState({ title: '', content: '' });
	const [loading, setLoading] = useState(isEditMode);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!isEditMode) {
			return;
		}

		(async () => {
			try {
				setLoading(true);
				const entry = await journalService.getById(id);
				setForm({
					title: entry?.title ?? '',
					content: entry?.content ?? '',
				});
			} catch (err) {
				setError(getErrorMessage(err, 'Failed to load entry'));
			} finally {
				setLoading(false);
			}
		})();
	}, [id, isEditMode]);

	const onChange = (event) => {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setError('');

		if (!form.title.trim() || !form.content.trim()) {
			setError('Title and content are required.');
			return;
		}

		try {
			setSubmitting(true);
			const payload = {
				title: form.title.trim(),
				content: form.content.trim(),
			};

			if (isEditMode) {
				await journalService.update(id, payload);
				navigate(`/journals/${id}`);
			} else {
				await journalService.create(payload);
				navigate('/dashboard');
			}
		} catch (err) {
			setError(getErrorMessage(err, 'Failed to save entry'));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<section className="card form-card">
			<div className="section-head">
				<h2>{isEditMode ? 'Edit Entry' : 'New Entry'}</h2>
				<Link to={isEditMode ? `/journals/${id}` : '/dashboard'} className="btn btn--ghost">
					Cancel
				</Link>
			</div>

			{loading ? (
				<p className="message">Loading entry...</p>
			) : (
				<form className="form-grid" onSubmit={onSubmit}>
					<label>
						Title
						<input
							name="title"
							type="text"
							value={form.title}
							onChange={onChange}
							placeholder="Entry title"
						/>
					</label>

					<label>
						Content
						<textarea
							name="content"
							value={form.content}
							onChange={onChange}
							rows={10}
							placeholder="Write your thoughts..."
						/>
					</label>

					{error && <p className="message message--error">{error}</p>}

					<button className="btn btn--primary" type="submit" disabled={submitting}>
						{submitting ? 'Saving...' : 'Save Entry'}
					</button>
				</form>
			)}
		</section>
	);
}
