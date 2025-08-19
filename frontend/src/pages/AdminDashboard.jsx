import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // We'll create this CSS file

const AdminDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [questions, setQuestions] = useState({});
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(prev => ({ ...prev, departments: true }));
        const res = await axios.get('http://localhost:5000/api/departments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch departments');
        console.error('Failed to fetch departments:', err);
      } finally {
        setLoading(prev => ({ ...prev, departments: false }));
      }
    };
    fetchDepartments();
  }, [token]);

  // Fetch questions per department
  const fetchQuestions = async (departmentId) => {
    try {
      setLoading(prev => ({ ...prev, [departmentId]: true }));
      const res = await axios.get(`http://localhost:5000/api/questions/${departmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Normalize answers to always be an array
      const questionsWithAnswers = res.data.map(q => ({
        ...q,
        answers: q.answers || []
      }));
      
      setQuestions(prev => ({ ...prev, [departmentId]: questionsWithAnswers }));
      setError(null);
    } catch (err) {
      setError(`Failed to fetch questions for ${departments.find(d => d.id === departmentId)?.name || ''} department`);
      console.error(`Failed to fetch questions for dept ${departmentId}:`, err);
    } finally {
      setLoading(prev => ({ ...prev, [departmentId]: false }));
    }
  };

  // Handle typing an answer
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Submit answer
  const handlePostAnswer = async (questionId, departmentId) => {
    const answerText = answers[questionId];
    if (!answerText || !answerText.trim()) {
      setError('Answer cannot be empty');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, [`posting-${questionId}`]: true }));
      const { data } = await axios.post(
        'http://localhost:5000/api/answers',
        {
          questionId,
          answerText,
          answeredBy: 'Admin',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess('Answer posted successfully');
      
      // Update the question with the new answer
      setQuestions(prev => ({
        ...prev,
        [departmentId]: prev[departmentId].map(q =>
          q.id === questionId
            ? { 
                ...q, 
                answers: [
                  ...q.answers, 
                  {
                    id: data.id || Date.now(),
                    answerText: data.answerText || answerText,
                    answeredBy: data.answeredBy || 'Admin'
                  }
                ]
              }
            : q
        ),
      }));

      setAnswers(prev => ({ ...prev, [questionId]: '' }));
      setError(null);
    } catch (err) {
      setError('Failed to post answer');
      console.error('Error posting answer:', err);
    } finally {
      setLoading(prev => ({ ...prev, [`posting-${questionId}`]: false }));
    }
  };

  // Auto-dismiss notifications
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="admin-dashboard-container">
      {/* Notifications */}
      {success && (
        <div className="notification success">
          <span>✓</span> {success}
        </div>
      )}
      {error && (
        <div className="notification error">
          <span>!</span> {error}
        </div>
      )}

      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>

      {loading.departments ? (
        <div className="loading-spinner"></div>
      ) : departments.length === 0 ? (
        <div className="empty-state">
          <p>No departments available</p>
        </div>
      ) : (
        <div className="departments-list">
          {departments.map((dept) => (
            <section key={dept.id} className="department-section">
              <div className="department-header">
                <h2>{dept.name} Department</h2>
                <button
                  onClick={() => fetchQuestions(dept.id)}
                  className="load-questions-btn"
                  disabled={loading[dept.id]}
                >
                  {loading[dept.id] ? 'Loading...' : 'Load Questions'}
                </button>
              </div>

              {loading[dept.id] ? (
                <div className="loading-spinner small"></div>
              ) : questions[dept.id] ? (
                questions[dept.id].length > 0 ? (
                  <div className="questions-list">
                    {questions[dept.id].map((q) => (
                      <article key={q.id} className="question-card">
                        <div className="question-content">
                          <div className="question-meta">
                            <span className="user-id">User ID: {q.userId}</span>
                          </div>
                          <p className="question-text">{q.content}</p>
                          
                          <div className="answers-section">
                            <h4>Answers ({q.answers.length})</h4>
                            {q.answers.length > 0 ? (
                              <ul className="answers-list">
                                {q.answers.map((ans) => (
                                  <li key={ans.id} className="answer-item">
                                    <p className="answer-text">{ans.answerText}</p>
                                    <p className="answer-meta">— {ans.answeredBy}</p>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="no-answers">No answers yet</p>
                            )}
                          </div>
                          
                          <div className="answer-form">
                            <textarea
                              placeholder="Type your answer..."
                              value={answers[q.id] || ''}
                              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                              className="answer-textarea"
                              rows="3"
                            />
                            <button
                              onClick={() => handlePostAnswer(q.id, dept.id)}
                              className="submit-answer-btn"
                              disabled={loading[`posting-${q.id}`]}
                            >
                              {loading[`posting-${q.id}`] ? 'Posting...' : 'Post Answer'}
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No questions found for this department</p>
                  </div>
                )
              ) : (
                <div className="empty-state">
                  <p>Click "Load Questions" to view questions</p>
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;