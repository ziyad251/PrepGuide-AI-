import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth"
import { useInterview } from "../hooks/useInterview"
import DeleteConfirmModal from "../../../components/DeleteConfirmModal"
import "../style/dashboard.scss"

const scoreClass = (score) =>
    score >= 80 ? "score--high" : score >= 60 ? "score--mid" : "score--low"

const Dashboard = () => {
    const { user } = useAuth()
    const { loading, reports, getReports, getResumePdf, deleteReport } = useInterview()
    const navigate = useNavigate()
    const [deleteId, setDeleteId] = useState(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        getReports()
    }, [])

    const handleDelete = async () => {
        if (!deleteId) return
        setDeleting(true)
        try {
            await deleteReport(deleteId)
            setDeleteId(null)
        } finally {
            setDeleting(false)
        }
    }

    if (loading && reports.length === 0) {
        return (
            <div className="dashboard-page">
                <p className="dashboard-page__loading">Loading dashboard...</p>
            </div>
        )
    }

    const totalQuestions = reports.length * 12

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <div>
                    <h1>Welcome back, <span className="highlight">{user?.username}</span></h1>
                    <p>Manage your interview plans and generate new strategies.</p>
                </div>
                <Link to="/generate" className="button primary-button">
                    Generate Interview Plan
                </Link>
            </header>

            <section className="dashboard-stats">
                <div>
                    <strong>{reports.length}</strong>
                    <span>Interview Plans</span>
                </div>
                <div>
                    <strong>
                        {reports.length
                            ? Math.round(
                                  reports.reduce((s, r) => s + (r.matchScore || 0), 0) / reports.length
                              )
                            : "—"}
                        {reports.length ? "%" : ""}
                    </strong>
                    <span>Avg Match Score</span>
                </div>
                <div>
                    <strong>{totalQuestions || "—"}</strong>
                    <span>Est. AI Questions</span>
                </div>
            </section>

            <section className="dashboard-plans">
                <h2>Recent Plans</h2>

                {reports.length === 0 ? (
                    <div className="dashboard-empty">
                        <p>No interview plans generated yet.</p>
                        <Link to="/generate" className="button primary-button">
                            Generate First Plan
                        </Link>
                    </div>
                ) : (
                    <ul className="dashboard-plans__list">
                        {reports.map((report) => (
                            <li key={report._id} className="dashboard-plan-card">
                                <div className="dashboard-plan-card__main">
                                    <h3>{report.title || "Untitled Position"}</h3>
                                    <p className={`match-score ${scoreClass(report.matchScore)}`}>
                                        Match Score: {report.matchScore}%
                                    </p>
                                    <p className="dashboard-plan-card__date">
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="dashboard-plan-card__actions">
                                    <button
                                        type="button"
                                        className="button"
                                        onClick={() => navigate(`/interview/${report._id}`)}
                                    >
                                        View
                                    </button>
                                    <button
                                        type="button"
                                        className="button"
                                        onClick={() => getResumePdf(report._id)}
                                    >
                                        Download
                                    </button>
                                    <button
                                        type="button"
                                        className="button dashboard-plan-card__delete"
                                        onClick={() => setDeleteId(report._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <DeleteConfirmModal
                open={Boolean(deleteId)}
                title="Delete interview plan?"
                message="Delete this interview plan? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
                busy={deleting}
            />
        </div>
    )
}

export default Dashboard
