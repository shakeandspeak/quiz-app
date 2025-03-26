import React from 'react';
import { useAuth } from './AuthContext';
import SignupForm from './SignupForm';
import QuizHome from './QuizHome';
import './AuthForms.css';

const Home = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    // If user is logged in, show QuizHome
    if (user) {
        return <QuizHome />;
    }

    // If user is not logged in, show signup form
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