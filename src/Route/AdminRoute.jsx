import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

export function AdminRoute({children}) {
    const { user, isAuthenticated, loading} = useAuth()

    if(loading) return null

    if(!isAuthenticated){
        return <Navigate to="/signin" replace />
    }

    if(user?.role !== "admin"){
        return <Navigate to="/" replace />
    }

    return children
}