import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { supabase } from '../supabaseClient';

const Navbar = () => {
  const { user, name } = useAuth();
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
        <Link to="/" className="app-logo">
          <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>🎓</span>
          Molchanov Eng
        </Link>
        <nav className="nav-links">
          <span className="user-name">
            👋 {name || 'User'}
          </span>
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