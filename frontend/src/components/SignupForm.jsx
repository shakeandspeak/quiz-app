import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import './AuthForms.css';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const passwordsMatch = formData.password && confirmPassword && formData.password === confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            // Sign up the user with Supabase Auth
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        role: formData.role,
                        name: formData.name
                    }
                }
            });

            if (signUpError) {
                setIsError(true);
                setMessage(signUpError.message);
                return;
            }

            // Show a friendly message to the user
            setIsError(false);
            setMessage('Account created! 🎉 Please check your email to confirm.');
            setFormData({ name: '', email: '', password: '', role: '' });
        } catch (error) {
            setIsError(true);
            setMessage('An unexpected error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Remove the insertProfileAfterLogin effect
        // Profile creation is now handled in AuthContext
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' }}>
            <img src="/logo.png" alt="Quiz logo" style={{ height: "80px", marginBottom: "1rem" }} />
            <div className="auth-form-container">
                <h2>Create an Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your name"
                            style={{ backgroundImage: formData.name ? 'url(/checkmark.svg)' : 'none', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 35px center' }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            style={{ backgroundImage: formData.email ? 'url(/checkmark.svg)' : 'none', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 35px center' }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                            placeholder="Create a password (6+ characters)"
                            style={{ 
                                backgroundImage: formData.password && confirmPassword ? 
                                    (passwordsMatch ? 'url(/checkmark.svg)' : 'url(/xmark.svg)') : 
                                    'none',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 35px center'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                            placeholder="Confirm your password"
                            style={{ 
                                backgroundImage: confirmPassword ? 
                                    (passwordsMatch ? 'url(/checkmark.svg)' : 'url(/xmark.svg)') : 
                                    'none',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 35px center'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role || ''}
                            onChange={handleChange}
                            required
                            style={{ backgroundImage: formData.role ? 'url(/checkmark.svg)' : 'none', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 35px center' }}
                        >
                            <option value="">Select a role</option>
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading || !passwordsMatch}
                        className="submit-button"
                    >
                        {isLoading ? 'Signing up...' : 'Sign Up'}
                    </button>

                    {message && (
                        <div className={`message ${isError ? 'error' : 'success'}`}>
                            {message}
                        </div>
                    )}

                    <div className="auth-links">
                        Already have an account? <Link to="/login">Log in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;