import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth"
import { useInterview } from "../../interview/hooks/useInterview"
import "../style/profile.scss"

const Profile = () => {
    const { user, handleLogout } = useAuth()
    const { reports, getReports, loading } = useInterview()
    const navigate = useNavigate()

    useEffect(() => {
        getReports()
    }, [])

    const avgScore =
        reports.length > 0
            ? Math.round(reports.reduce((s, r) => s + (r.matchScore || 0), 0) / reports.length)
            : null

    const onLogout = async () => {
        await handleLogout()
        navigate("/")
    }

    return (
        <div className="profile-page">
            <header className="profile-header">
                <div className="profile-avatar" aria-hidden="true">
                    {(user?.username?.[0] || "U").toUpperCase()}
                </div>
                <div>
                    <h1>{user?.username}</h1>
                    <p>{user?.email}</p>
                </div>
            </header>

            <section className="profile-section">
                <h2>Account Information</h2>
                <dl className="profile-info">
                    <div>
                        <dt>Total Interview Plans</dt>
                        <dd>{loading ? "…" : reports.length}</dd>
                    </div>
                    <div>
                        <dt>Average Match Score</dt>
                        <dd>{avgScore != null ? `${avgScore}%` : "—"}</dd>
                    </div>
                    <div>
                        <dt>Member Since</dt>
                        <dd>—</dd>
                    </div>
                </dl>
            </section>

            <div className="profile-actions">
                <button type="button" className="button primary-button" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Profile
