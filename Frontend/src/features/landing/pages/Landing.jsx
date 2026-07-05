import { Link } from "react-router"
import Navbar from "../../../components/layout/Navbar"
import "../style/landing.scss"

const FEATURES = [
    { title: "Resume Analysis", desc: "AI parses your resume to understand strengths and gaps." },
    { title: "ATS Match Scoring", desc: "See how well you align with the job description." },
    { title: "Technical Questions", desc: "Role-specific technical questions with model answers." },
    { title: "Behavioral Questions", desc: "STAR-style prompts tailored to your profile." },
    { title: "Personalized Roadmap", desc: "Day-by-day preparation plan to close skill gaps." },
    { title: "PDF Export", desc: "Download an optimized resume PDF anytime." },
]

const STEPS = [
    { n: 1, title: "Upload Resume", desc: "PDF or a quick self-description." },
    { n: 2, title: "Paste Job Description", desc: "Target the exact role you're applying for." },
    { n: 3, title: "AI Generates Strategy", desc: "Questions, scores, and roadmap in seconds." },
    { n: 4, title: "Practice & Improve", desc: "Review, download, and track your plans." },
]

const Landing = () => (
    <div className="landing-page">
        <Navbar variant="public" />

        <section className="landing-hero">
            <h1>PrepGuide <span className="highlight">AI</span></h1>
            <p className="landing-hero__subtitle">AI-Powered Interview Preparation Platform</p>
            <p className="landing-hero__desc">
                Upload your resume, paste a job description, and receive personalized interview questions,
                ATS insights, match scoring, and a custom preparation roadmap.
            </p>
            <div className="landing-hero__actions">
                <Link to="/register" className="button primary-button">Get Started</Link>
                <Link to="/login" className="button landing-hero__secondary">Login</Link>
            </div>
        </section>

        <section id="features" className="landing-section">
            <h2>Everything you need to prepare</h2>
            <div className="landing-features">
                {FEATURES.map((f) => (
                    <article key={f.title} className="landing-feature-card">
                        <h3>{f.title}</h3>
                        <p>{f.desc}</p>
                    </article>
                ))}
            </div>
        </section>

        <section className="landing-section landing-how">
            <h2>How It Works</h2>
            <ol className="landing-steps">
                {STEPS.map((s) => (
                    <li key={s.n}>
                        <span className="landing-steps__num">{s.n}</span>
                        <div>
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </section>

        <section className="landing-section landing-stats">
            <h2>Trusted by ambitious candidates</h2>
            <div className="landing-stats__grid">
                <div>
                    <strong>1,200+</strong>
                    <span>Interview Plans Generated</span>
                </div>
                <div>
                    <strong>3,500+</strong>
                    <span>Match Scores Calculated</span>
                </div>
                <div>
                    <strong>8,000+</strong>
                    <span>AI Questions Generated</span>
                </div>
            </div>
        </section>

        <footer className="landing-footer">
            <p>PrepGuide AI</p>
            <p className="landing-footer__muted">Powered by Gemini AI</p>
            <div className="landing-footer__links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
            </div>
        </footer>
    </div>
)

export default Landing
