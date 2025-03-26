import React from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import './AuthForms.css';

const Login = () => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" replace />;
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