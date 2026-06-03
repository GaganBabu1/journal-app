import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function HomePage() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="landing-wrapper">
            {/* Core Hero Section */}
            <header className="landing-hero">
                <div className="landing-hero-content">
                    <div className="landing-badge">🔒 100% Private & Encrypted</div>
                    <h1 className="landing-title">Your private daily journal</h1>
                    <p className="landing-subtitle">
                        Capture thoughts, track personal milestones, and reflect on your days in one elegant, secure space built for clarity.
                    </p>

                    <div className="landing-actions">
                        {isAuthenticated ? (
                            <Link className="landing-btn landing-btn-primary" to="/dashboard">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link className="landing-btn landing-btn-primary" to="/register">
                                    Start Writing for Free
                                </Link>
                                <Link className="landing-btn landing-btn-secondary" to="/login">
                                    Sign In to Account
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Minimalist Interactive UI Preview Box */}
                <div className="landing-preview-card">
                    <div className="preview-header">
                        <div className="preview-dots">
                            <span></span><span></span><span></span>
                        </div>
                        <div className="preview-title">My Personal Journal</div>
                    </div>
                    <div className="preview-body">
                        <div className="preview-date">June 3, 2026</div>
                        <div className="preview-text-line high">Today was an incredibly productive day...</div>
                        <div className="preview-text-line">Started building out the new user dashboard structure.</div>
                        <div className="preview-tags"><span className="tag-pill">#progress</span><span className="tag-pill">#coding</span></div>
                    </div>
                </div>
            </header>

            {/* Features Feature Grid Section */}
            <section className="landing-features">
                <div className="feature-card">
                    <div className="feature-icon">🔍</div>
                    <h3>Smart Search</h3>
                    <p>Instantly find past entries, ideas, or mood changes with our lightning-fast search filters.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">📱</div>
                    <h3>Pure Responsive</h3>
                    <p>Designed to adapt perfectly from desktop down to your mobile screen for seamless writing anywhere.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🌱</div>
                    <h3>Clutter Free</h3>
                    <p>No ads, no algorithmic noise. Just a clean, open space intended exclusively for your thoughts.</p>
                </div>
            </section>

            {/* Bottom Final Value CTA */}
            <footer className="landing-footer-cta">
                <h2>Ready to document your story?</h2>
                <p>Join thousands of developers and creatives capturing their day-to-day progress.</p>
                <Link className="landing-btn landing-btn-primary green-glow" to={isAuthenticated ? "/dashboard" : "/register"}>
                    {isAuthenticated ? "Go to My Dashboard" : "Create Your Free Account"}
                </Link>
            </footer>
        </div>
    );
}