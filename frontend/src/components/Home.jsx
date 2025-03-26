import React from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';
import SignupForm from './SignupForm';
import './AuthForms.css';

const Home = () => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="home-container">
            <div className="welcome-section">
                <h1>Welcome to the Quiz App</h1>
                <p className="subtitle">Create, share, and take quizzes with ease</p>
            </div>
            <SignupForm />
        </div>
    );
};

export default Home;