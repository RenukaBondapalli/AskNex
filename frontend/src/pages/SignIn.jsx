import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignIn.css'; // Make sure this file exists for styling

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      const { token, user, msg } = res.data;

      // Store token in localStorage
      localStorage.setItem('token', token); // Used for API authentication
      localStorage.setItem('asknex_token', token); // Optional alias

      // Store user information
      localStorage.setItem('asknex_user', JSON.stringify(user));

      // Store departmentId if available
      if (user.departmentId) {
        localStorage.setItem('departmentId', user.departmentId);
      }

      setMsg(msg);

      // Redirect based on user role
      if (user.role === 'student') {
        navigate('/departments');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'dept_admin') {
        navigate(`/department/${user.departmentId}`);
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2 className="signin-title">Sign In to AskNex</h2>
        {msg && <p className="signin-message">{msg}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="signin-button">Login</button>

        <p className="signin-footer">
          Don't have an account?{' '}
          <span className="signup-link" onClick={() => navigate('/signup')}>
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
