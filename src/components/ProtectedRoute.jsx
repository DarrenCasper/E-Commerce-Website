import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function ProtectedRoute({children}) {
    const{ isAuthenticated } = useAuth()

    if(!isAuthenticated){
        return <Navigate to="/signin" replace/>
    }

    return children
}