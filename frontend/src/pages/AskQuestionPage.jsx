import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './AskQuestionPage.css'; // We'll update this CSS file

const AskQuestionPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const token = localStorage.getItem('token');

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:5000/api/questions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setQuestions(data);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch questions');
      }
    } catch (error) {
      setError('Error fetching questions. Please try again.');
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:5000/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ departmentId: id, question }),
      });

      const data = await res.json();
      if (res.ok) {
        setQuestion('');
        setShowSuccess(true);
        fetchQuestions();
      } else {
        setError(data.message || 'Failed to post question');
      }
    } catch (err) {
      setError('Error posting question. Please try again.');
      console.error('Error posting question:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ask-question-container">
      {/* Success Notification */}
      {showSuccess && (
        <div className="success-notification">
          <div className="notification-content">
            <span className="notification-icon">✓</span>
            Question posted successfully!
          </div>
        </div>
      )}

      <div className="ask-question-header">
        <h2>Ask a Question</h2>
        <p className="department-id">Department ID: {id}</p>
      </div>

      {/* Rest of your component remains the same */}
      <form onSubmit={handleSubmit} className="question-form">
        <div className="form-group">
          <textarea
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="question-textarea"
            rows="5"
          />
        </div>
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Submit Question'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="questions-section">
        <h3>Previous Questions</h3>
        
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : questions.length === 0 ? (
          <div className="no-questions">No questions yet. Be the first to ask!</div>
        ) : (
          <ul className="questions-list">
            {questions.map((q) => (
              <li key={q.id} className="question-item">
                <div className="question-content">
                  <span className="question-label">Q:</span> {q.content}
                </div>

                <div className="answers-section">
                  {q.answers && q.answers.length > 0 ? (
                    <ul className="answers-list">
                      {q.answers.map((a) => (
                        <li key={a.id} className="answer-item">
                          <div className="answer-text">
                            <span className="answer-label">Answer:</span> {a.answerText}
                          </div>
                          <div className="answer-meta">— {a.answeredBy}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="no-answers">No answers yet.</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AskQuestionPage;