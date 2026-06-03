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
        <div className="dash-container">
            {/* Header Content Group */}
            <header className="dash-header">
                <div className="dash-header-title">
                    <h2>Your Dashboard</h2>
                    <p>View, search, and manage your private journal entries.</p>
                </div>
                <Link to="/journals/new" className="btn btn--primary dash-new-btn">
                    <span>+</span> New Entry
                </Link>
            </header>

            {/* Filter Controls Row */}
            <div className="dash-controls-card">
                <SearchBar onSearch={onSearch} loading={loading} />
            </div>

            {/* Notifications & System Counters */}
            {error && (
                <div className="dash-message-wrapper error-box">
                    <p className="message message--error">{error}</p>
                </div>
            )}
            
            {meta && !error && (
                <div className="dash-meta-bar">
                    <p className="dash-meta-text">
                        Showing page <strong>{meta.page + 1}</strong> of {Math.max(meta.totalPages, 1)} 
                        <span className="dash-meta-divider">|</span> 
                        <strong>{meta.totalElements}</strong> total entries
                    </p>
                </div>
            )}

            {/* Feed Listing Component Wrapper */}
            <main className="dash-main-feed">
                <JournalList entries={entries} loading={loading} onDelete={onDelete} />
            </main>
        </div>
    );
}