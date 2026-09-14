import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { supabase } from '../supabase' 

function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) {
            setMessage(error.message)
        } else {
            setMessage("สมัครสมาชิกสำเร็จ! กำลังพาไปหน้า Login...")

            setTimeout(() => {
                navigate("/login")
            }, 2000)
        }
    }

    return (
        <div className="bg-dark text-white min-vh-100 d-flex align-items-center">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card text-dark">
                            <div className="card-body">
                                <h2 className="card-title text-center mb-4">Register 📝</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password </label>
                                        <input
                                            type="password"
                                            id="password"
                                            className="form-control"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Register</button>
                                </form>
                                {message && (
                                    <p className={`mt-3 text-center ${message.includes("สำเร็จ") ? "text-success" : "text-danger"}`}>
                                        {message}
                                    </p>
                                )}
                                <p className="mt-3 text-center">
                                    Already have an account? <Link to="/login">Login here</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register