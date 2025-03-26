import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { supabase } from '../supabaseClient';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Only show navbar for authenticated users
  if (!user) return null;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="app-header">
      <div className="nav-container">
        <div className="app-logo">QuizMaster</div>
        <nav className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active-link' : ''}>
            Home
          </Link>
          <Link to="/create" className={location.pathname === '/create' ? 'active-link' : ''}>
            Create Quiz
          </Link>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;