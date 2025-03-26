import React from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import './AuthForms.css';

const Login = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    // If already logged in, redirect to home page
    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="home-container">
            <div className="welcome-section">
                <h1>Welcome Back</h1>
                <p className="subtitle">Log in to continue to your quizzes</p>
            </div>
            <LoginForm />
        </div>
    );
};

export default Login;