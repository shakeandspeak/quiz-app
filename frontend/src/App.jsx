import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import QuizHome from './components/QuizHome';
import QuizCreator from './components/QuizCreator';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="nav-container">
            <div className="app-logo">QuizMaster</div>
            <nav className="nav-links">
              <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''}>
                Home
              </NavLink>
              <NavLink to="/create" className={({ isActive }) => isActive ? 'active-link' : ''}>
                Create Quiz
              </NavLink>
            </nav>
          </div>
        </header>
        
        <div className="container">
          <Routes>
            <Route path="/create" element={<QuizCreator />} />
            <Route path="/quiz/:id" element={<QuizHome showSingleQuiz={true} />} />
            <Route path="/" element={<QuizHome />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;