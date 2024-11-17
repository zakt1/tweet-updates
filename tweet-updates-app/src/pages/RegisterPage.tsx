import { useState } from "react"
import { useRegister } from "../hooks/useAuth"


export function RegisterPage() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const register = useRegister()

    const handleRegister= async (event) => {
        event.preventDefault()
        register.mutate({email, password})
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                {register.error && (
                    <div style={{color: 'red'}}>{register.error.message}</div>
                )}

                        <label htmlFor="register-email-input">Email</label>
                        <input 
                        id="register-email-input"
                        value={email}
                        onChange={(event)=>setEmail(event.target.value)}
                        required
                        type="email"
                        
                        />

                        <label htmlFor="register-password-input">Create a password</label>
                        <input
                        id="register-password-input" 
                        value={password}
                        onChange={(event)=>setPassword(event.target.value)}
                        type="password"
                        required
                        />

                        <button 
                        type="submit"
                        disabled={register.isPending}                       
                        >
                            {register.isPending ? 'Creating account...' : 'Sign up'}
                        </button>

            </form>
        </div>
    )
}