/** Cookie options for cross-origin frontend (Vite) + API on different ports */
const authCookieOptions = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
}

module.exports = { authCookieOptions }
