import { Navigate, useNavigate } from "react-router";
import { useSession } from "../hooks/useAuth";

interface AuthGuardProps {
    children: React.ReactNode
}

export function AuthGuard({children}: AuthGuardProps){

    const { data: session, isLoading } = useSession()
    
    if(isLoading) {
        return <div>Loading...</div>
    }

    if(!session) {
       return <Navigate to="/login" replace/>
    }

    return(<>{children}</>)

}