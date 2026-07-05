import Navbar from "./Navbar"

const AppLayout = ({ children }) => (
    <div className="app-layout">
        <Navbar variant="app" />
        <main className="app-layout__main">{children}</main>
    </div>
)

export default AppLayout
