import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom";
import Login from "../components/authentication/Login";

export const LoggedInRoutes = () => {
    const { user } = useSelector((state) => ({...state }));
    console.log(user)
    return user ? < Outlet / > : < Login / >
}