// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth info
    localStorage.removeItem('token');
    localStorage.removeItem('departmentId');
    // Redirect to landing page
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">AskNex</Link>
        <div className="nav-links">
          <button
            onClick={handleLogout}
            style={{
              background: '#ff4d4f',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;