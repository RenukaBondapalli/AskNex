import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentDepartments.css'; // We'll create this CSS file

const StudentDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('http://localhost:5000/api/departments');
        setDepartments(res.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
        setError('Failed to load departments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div className="student-dept-page">
      <h2 className="page-title">Departments</h2>
      
      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="dept-grid">
          {departments.map((dept) => (
            <div className="dept-card" key={dept.id}>
              <div className="dept-card-content">
                <h3>{dept.name}</h3>
                <p className="dept-description">Ask questions related to {dept.name} department</p>
              </div>
              <button 
                className="btn-ask" 
                onClick={() => window.location.href = `/ask/${dept.id}`}>
                Ask a Question
                <span className="arrow-icon">→</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDepartments;