import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function HomePage() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="page home-page">
            <section className="hero card">
                <div>
                    <p className="hero-badge">Private journal writing with no extra noise.</p>
                    <h1>Write and find your notes in one clear place.</h1>
                    <p>
                        Keep your daily journal in a simple app. Add entries, search them fast, and return to your notes later without unnecessary features.
                    </p>
                </div>

                <div className="hero-actions">
                    {isAuthenticated ? (
                        <Link className="btn btn--primary" to="/dashboard">
                            Open dashboard
                        </Link>
                    ) : (
                        <>
                            <Link className="btn btn--primary" to="/register">
                                Create account
                            </Link>
                            <Link className="btn btn--secondary" to="/login">
                                Sign in
                            </Link>
                        </>
                    )}
                </div>
            </section>

            <section className="page-section">
                <div className="section-head">
                    <div>
                        <h2>How it works</h2>
                        <p>
                            You can type a journal entry, save it, and search across your notes any time. The design is meant to stay quiet so you can focus.
                        </p>
                    </div>
                </div>

                <div className="screenshot-card card">
                    <div className="screenshot-header">
                        <span>Journal entries</span>
                        <span className="screenshot-search">Search: mood</span>
                    </div>
                    <div className="screenshot-list">
                        <article className="screenshot-entry">
                            <strong>Weekly check-in</strong>
                            <p>Update on the work progress and the next items to finish.</p>
                            <time>June 4, 2026</time>
                        </article>
                        <article className="screenshot-entry">
                            <strong>Notes from today</strong>
                            <p>Captured the important details from the meeting and ideas for the feature.</p>
                            <time>June 3, 2026</time>
                        </article>
                        <article className="screenshot-entry screenshot-entry--highlighted">
                            <strong>Journal draft</strong>
                            <p>Logged how the day went and what steps to take tomorrow.</p>
                            <time>June 2, 2026</time>
                        </article>
                    </div>
                </div>
            </section>

            <section className="page-section stats-grid">
                <div className="stat-card card">
                    <p className="stat-number">120+</p>
                    <p>Notes saved during the first month of using the app.</p>
                </div>
                <div className="stat-card card">
                    <p className="stat-number">1</p>
                    <p>Simple place for your journal writing without extra menus.</p>
                </div>
                <div className="stat-card card">
                    <p className="stat-number">0</p>
                    <p>No ads or tracking, just your writing.</p>
                </div>
            </section>
        </div>
    );
}
