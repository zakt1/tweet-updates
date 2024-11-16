import { Link } from "react-router-dom";


export function HomePage(){

    return (
        <div>

            <h1>Tweets homepage</h1>

            <nav>
                <ul>
                    <li><Link to="/login">Login</Link></li>
                </ul>
            </nav>
        </div>

    )
}