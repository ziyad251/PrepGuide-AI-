import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router"
import "../style/home.scss"
import { useInterview } from "../hooks/useInterview"
import GenerationProgress from "../../../components/GenerationProgress"

const GeneratePlan = () => {
    const { generating, generateReport } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const resumeInputRef = useRef()
    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current?.files?.[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        if (data?._id) {
            navigate(`/interview/${data._id}`)
        }
    }

    if (generating) {
        return <GenerationProgress />
    }

    return (
        <div className="home-page">
            <header className="page-header">
                <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
                <h1>Create Your Custom <span className="highlight">Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            <div className="interview-card">
                <div className="interview-card__body">
                    <div className="panel panel--left">
                        <div className="panel__header">
                            <span className="panel__icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className="badge badge--required">Required</span>
                        </div>
                        <textarea
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="panel__textarea"
                            placeholder="Paste the full job description here..."
                            maxLength={5000}
                            value={jobDescription}
                        />
                    </div>

                    <div className="panel-divider" />

                    <div className="panel panel--right">
                        <div className="panel__header">
                            <span className="panel__icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        <div className="upload-section">
                            <label className="section-label">
                                Upload Resume
                                <span className="badge badge--best">Best Results</span>
                            </label>
                            <label className="dropzone" htmlFor="resume">
                                <span className="dropzone__icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                </span>
                                <p className="dropzone__title">Click to upload or drag &amp; drop</p>
                                <p className="dropzone__subtitle">PDF or DOCX (Max 5MB)</p>
                                <input ref={resumeInputRef} hidden type="file" id="resume" name="resume" accept=".pdf,.docx" />
                            </label>
                        </div>

                        <div className="or-divider"><span>OR</span></div>

                        <div className="self-description">
                            <label className="section-label" htmlFor="selfDescription">Quick Self-Description</label>
                            <textarea
                                onChange={(e) => setSelfDescription(e.target.value)}
                                id="selfDescription"
                                className="panel__textarea panel__textarea--short"
                                placeholder="Briefly describe your experience, key skills, and years of experience..."
                                value={selfDescription}
                            />
                        </div>

                        <div className="info-box">
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required.</p>
                        </div>
                    </div>
                </div>

                <div className="interview-card__footer">
                    <span className="footer-info">AI-Powered Strategy Generation &bull; Approx 30s</span>
                    <button type="button" onClick={handleGenerateReport} className="generate-btn">
                        Generate My Interview Strategy
                    </button>
                </div>
            </div>
        </div>
    )
}

export default GeneratePlan
