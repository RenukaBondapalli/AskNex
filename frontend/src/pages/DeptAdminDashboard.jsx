import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DeptAdminDashboard.css'; // We'll create this CSS file

// Department map
const departmentMap = {
  1: 'Mess',
  2: 'Hostel',
  3: 'Library',
  4: 'Transport',
};

const DeptAdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentName, setDepartmentName] = useState('');
  const [answers, setAnswers] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const departmentId = localStorage.getItem('departmentId');

        if (!token || !departmentId) {
          setError('Authentication required. Please login again.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/questions/${departmentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const questionsWithAnswers = response.data.map((q) => ({
          ...q,
          answers: q.answers || [],
        }));

        setQuestions(questionsWithAnswers);
        setDepartmentName(departmentMap[departmentId] || 'Department');
        setError(null);
      } catch (error) {
        setError('Failed to load questions. Please try again.');
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handlePostAnswer = async (questionId) => {
    const token = localStorage.getItem('token');
    const answerText = answers[questionId];

    if (!answerText || !answerText.trim()) {
      setError('Answer cannot be empty');
      return;
    }

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/answers',
        {
          questionId,
          answerText,
          answeredBy: departmentName + ' Admin',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowSuccess('Answer posted successfully!');
      setError(null);

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, answers: [...q.answers, data[0]] }
            : q
        )
      );
      setAnswers((prev) => ({ ...prev, [questionId]: '' }));
    } catch (err) {
      setError('Failed to post answer. Please try again.');
      console.error('Error posting answer:', err);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Success Notification */}
      {showSuccess && (
        <div className="success-notification">
          <div className="notification-content">
            <span className="notification-icon">✓</span>
            {showSuccess}
          </div>
        </div>
      )}

      <header className="dashboard-header">
        <h1 className="dashboard-title">
          <span className="department-name">{departmentName}</span> Admin Dashboard
        </h1>
        <div className="header-divider"></div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <main className="dashboard-content">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : questions.length === 0 ? (
          <div className="no-questions">
            <img src="/empty-state.svg" alt="No questions" className="empty-state-img" />
            <h3>No questions found for your department</h3>
            <p>Students haven't asked any questions yet.</p>
          </div>
        ) : (
          <div className="questions-container">
            <h2 className="questions-title">Student Questions</h2>
            <div className="questions-list">
              {questions.map((q) => (
                <div key={q.id} className="question-card">
                  <div className="question-header">
                    <span className="question-id">Question #{q.id}</span>
                    <span className="user-id">User ID: {q.userId}</span>
                  </div>
                  <div className="question-content">{q.content}</div>

                  <div className="answers-section">
                    <h4 className="answers-title">
                      Answers ({q.answers.length})
                    </h4>
                    {q.answers.length > 0 ? (
                      <ul className="answers-list">
                        {q.answers.map((ans) => (
                          <li key={ans.id} className="answer-item">
                            <div className="answer-text">{ans.answerText}</div>
                            <div className="answer-meta">
                              — {ans.answeredBy}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="no-answers">No answers yet</div>
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
                      onClick={() => handlePostAnswer(q.id)}
                      className="submit-answer-btn"
                    >
                      Post Answer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DeptAdminDashboard;