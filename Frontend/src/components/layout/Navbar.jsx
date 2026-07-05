import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../../features/auth/hooks/useAuth"
import "../../style/navbar.scss"

const Navbar = ({ variant = "public" }) => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const isAuthenticated = variant === "app" && user

    const onLogout = async () => {
        await handleLogout()
        navigate("/")
    }

    return (
        <header className="navbar">
            <div className="navbar__inner">
                <Link to={isAuthenticated ? "/dashboard" : "/"} className="navbar__logo">
                    PrepGuide <span className="highlight">AI</span>
                </Link>

                <nav className="navbar__links">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/">Home</Link>
                            <a href="/#features">Features</a>
                            <Link to="/login">Login</Link>
                            <Link to="/register" className="navbar__cta">Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/profile">Profile</Link>
                            <div className="navbar__avatar-wrap">
                                <button
                                    type="button"
                                    className="navbar__avatar"
                                    onClick={() => setDropdownOpen((o) => !o)}
                                    aria-label="User menu"
                                >
                                    {(user?.username?.[0] || "U").toUpperCase()}
                                </button>
                                {dropdownOpen && (
                                    <div className="navbar__dropdown">
                                        <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                                        <Link to="/profile" onClick={() => setDropdownOpen(false)}>Profile</Link>
                                        <button type="button" onClick={onLogout}>Logout</button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </nav>

                <button
                    type="button"
                    className="navbar__menu-btn"
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    ☰
                </button>
            </div>

            {menuOpen && (
                <div className="navbar__mobile">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                            <a href="/#features" onClick={() => setMenuOpen(false)}>Features</a>
                            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                            <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                            <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                            <button type="button" onClick={() => { setMenuOpen(false); onLogout() }}>Logout</button>
                        </>
                    )}
                </div>
            )}
        </header>
    )
}

export default Navbar
