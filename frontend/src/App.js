// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import StudentDepartments from './pages/StudentDepartments';
import AdminDashboard from './pages/AdminDashboard';
import DeptDashboard from './pages/DeptAdminDashboard';
import AskQuestionPage from './pages/AskQuestionPage';
import Navbar from './components/Navbar'; // Navbar for internal pages
import './App.css';

function LandingPage() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-container">
          <a href="/" className="logo">AskNex</a>
          <div className="nav-links">
            <a href="/signup" className="btn-signup">Sign Up</a>
            <a href="/signin" className="btn-signin">Sign In</a>
          </div>
        </div>
      </nav>

      <main>
        <div className="hero-section">
          <div className="hero-content">
            <h2 className="hero-title">Welcome to <span className="brand">AskNex</span></h2>
            <p className="hero-subtitle">A platform to connect with your college before you even step in.</p>
            <div className="cta-buttons">
              <a href="/signup" className="btn-primary">Get Started</a>
              <a href="/signin" className="btn-secondary">Sign In</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Wrapper to show Navbar on all pages except landing, signin, signup
const AppWrapper = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ['/', '/signin', '/signup'];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/departments" element={<StudentDepartments />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/department/:id" element={<DeptDashboard />} />
          <Route path="/ask/:id" element={<AskQuestionPage />} />
        </Routes>
      </AppWrapper>
    </Router>
  );
}

export default App;
