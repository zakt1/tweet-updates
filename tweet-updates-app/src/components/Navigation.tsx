import { Link } from "react-router-dom";
import { useSession } from "../hooks/useAuth";

export function Navigation() {
    const { data: session } = useSession()

    return (
        <nav>
            <ul>
                {session ? 
                (<><li><Link to="/posts/latest">Latest Posts</Link></li></>) 
                : 
                (<>
                <li><Link to="/register">Sign up</Link></li>                 
                <li><Link to='/login'>Go to Login</Link></li></>
                ) }
                
            </ul>
        </nav>
    )

}