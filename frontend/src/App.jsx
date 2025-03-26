import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import QuizCreator from './components/QuizCreator';
import QuizHome from './components/QuizHome';
import Navbar from './components/Navbar';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/create" element={<QuizCreator />} />
                <Route path="/quiz/:id" element={<QuizHome showSingleQuiz={true} />} />
            </Routes>
        </Router>
    );
};

export default App;