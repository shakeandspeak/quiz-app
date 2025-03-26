import React from 'react';
import { useAuth } from './AuthContext';

const Dashboard = () => {
    const { user, role, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Please log in.</div>;
    }

    return (
        <div className="dashboard">
            <h1>Welcome, {user.email}!</h1>
            <p>Your role: {role}</p>

            {role === 'teacher' && (
                <div className="teacher-section">
                    <button>Create Quiz</button>
                    <button>My Quizzes</button>
                </div>
            )}

            {role === 'student' && (
                <div className="student-section">
                    <h2>Assigned Quizzes</h2>
                    {/* Placeholder for assigned quizzes */}
                </div>
            )}
        </div>
    );
};

export default Dashboard;