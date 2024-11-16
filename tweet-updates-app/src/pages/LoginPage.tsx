import { useState } from "react"
import { useLogin } from "../hooks/useAuth"


export function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const login = useLogin()

    const handleLoginSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        login.mutate({email, password})
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLoginSubmit}>
                <div>
                    <label htmlFor="user-email">
                        Email:
                    </label>
                    <input 
                        id="user-email"
                        type="email"
                        value={email}
                        onChange={(event) =>setEmail(event.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>
                        Password:
                    </label>

                    <input 
                    id="user-password"
                    value={password}
                    type="password"
                    onChange={(event)=>setPassword(event.target.value)}
                    required
                    />
                </div>
                <button type="submit" disabled={login.isPending}>
                    {login.isPending ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}