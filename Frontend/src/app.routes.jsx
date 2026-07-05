import { createBrowserRouter } from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Protected from "./features/auth/components/Protected"
import GuestOnly from "./features/auth/components/GuestOnly"
import AppLayout from "./components/layout/AppLayout"
import Landing from "./features/landing/pages/Landing"
import Dashboard from "./features/interview/pages/Dashboard"
import GeneratePlan from "./features/interview/pages/GeneratePlan"
import Profile from "./features/profile/pages/Profile"
import Interview from "./features/interview/pages/Interview"

const withApp = (element) => (
    <Protected>
        <AppLayout>{element}</AppLayout>
    </Protected>
)

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />,
    },
    {
        path: "/login",
        element: (
            <GuestOnly>
                <Login />
            </GuestOnly>
        ),
    },
    {
        path: "/register",
        element: (
            <GuestOnly>
                <Register />
            </GuestOnly>
        ),
    },
    {
        path: "/dashboard",
        element: withApp(<Dashboard />),
    },
    {
        path: "/generate",
        element: withApp(<GeneratePlan />),
    },
    {
        path: "/profile",
        element: withApp(<Profile />),
    },
    {
        path: "/interview/:interviewId",
        element: withApp(<Interview />),
    },
])
