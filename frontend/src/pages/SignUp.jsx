import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SignUp.css'; // for custom styling

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    departmentId: ''
  });

  const [departments, setDepartments] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    // Fetch departments for dept_admins
    axios.get('http://localhost:5000/api/departments')
      .then(res => setDepartments(res.data))
      .catch(err => console.error('Error fetching departments', err));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return setMsg("Passwords don't match");
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', form);
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Your AskNex Account</h2>
        {msg && <p className="message">{msg}</p>}

        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="dept_admin">Department Admin</option>
          <option value="admin">Admin</option>
        </select>

        {form.role === 'dept_admin' && (
          <select name="departmentId" value={form.departmentId} onChange={handleChange} required>
            <option value="">Select Department</option>
            {departments.map(dep => (
              <option key={dep.id} value={dep.id}>{dep.name}</option>
            ))}
          </select>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default SignUp;
