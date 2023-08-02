import { Outlet, Navigate } from "react-router-dom"

const ProtectedRoutes = () => {
    let auth = req.params.authentication
    return (
        auth.token ? < Outlet / > : < Navigate to = "/login" / >
    )
}

export default ProtectedRoutes