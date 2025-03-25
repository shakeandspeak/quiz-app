import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../App.css';

const QuizHome = ({ showSingleQuiz = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswerDetails, setShowAnswerDetails] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  // Reset states when location changes
  useEffect(() => {
    if (location.pathname === '/') {
      setSelectedQuiz(null);
      setQuizStarted(false);
      setCurrentQuestion(0);
      setScore(0);
      setShowResults(false);
      setUserAnswer('');
      setUserAnswers([]);
    }
  }, [location]);

  // Load available quizzes from Supabase
  useEffect(() => {
    const fetchQuizzes = async () => {
      const { data: quizzes, error } = await supabase.from('quizzes').select('*');

      if (error) {
        console.error('Error fetching quizzes:', error);
        alert('Failed to load quizzes. Please try again later.');
      } else {
        setAvailableQuizzes(quizzes);
      }
    };

    fetchQuizzes();
  }, []);

  // If showSingleQuiz and id are provided, find and set the specific quiz
  useEffect(() => {
    if (showSingleQuiz && id) {
      const fetchSingleQuiz = async () => {
        // First try to find it in already loaded quizzes
        const quiz = availableQuizzes.find(q => q.id === id);
        if (quiz) {
          setSelectedQuiz(quiz);
        } else {
          // If not found, fetch it directly from Supabase
          const { data, error } = await supabase
            .from('quizzes')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) {
            console.error('Error fetching quiz:', error);
            alert('Failed to load quiz. Please try again later.');
            navigate('/');
          } else if (data) {
            setSelectedQuiz(data);
          } else {
            // If quiz not found, navigate back to home
            navigate('/');
          }
        }
      };
      
      fetchSingleQuiz();
    }
  }, [id, showSingleQuiz, navigate, availableQuizzes]);

  const handleQuizSelect = (quiz) => {
    console.log('Quiz selected:', quiz);
    setSelectedQuiz(quiz);
    navigate(`/quiz/${quiz.id}`);
  };
  
  const handleStartQuiz = () => {
    console.log('Starting quiz with selectedQuiz:', selectedQuiz);
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setUserAnswer('');
  };
  
  const handleAnswerSubmit = () => {
    const currentQ = selectedQuiz.questions[currentQuestion];

    // Check if answer is correct based on question type
    let isCorrect = false;

    if (currentQ.questionType === 'text') {
      // Case insensitive comparison for text answers
      isCorrect = userAnswer.trim().toLowerCase() === currentQ.correctAnswer.toLowerCase();
    } else {
      // For multiple choice and true/false
      isCorrect = userAnswer === currentQ.correctAnswer;
    }

    if (isCorrect) {
      setScore(score + 1);
    }

    // Save the user's answer
    setUserAnswers([...userAnswers, { question: currentQ.questionText, userAnswer, isCorrect }]);

    if (currentQuestion + 1 < selectedQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer(''); // Reset answer for next question
    } else {
      setShowResults(true);
    }
  };
  
  const handleRetry = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setUserAnswer('');
  };

  const handleGoToHome = () => {
    // Ensure navigation works correctly by resetting states and navigating to home
    setSelectedQuiz(null);
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setUserAnswer('');
    setUserAnswers([]); // Clear user answers
    navigate('/');
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      if (!quizId) {
        console.error('Quiz ID is undefined or null');
        alert('Cannot delete quiz: Invalid quiz ID');
        return;
      }

      console.log('Attempting to delete quiz with ID:', quizId);
      
      // Confirm deletion with user
      if (!window.confirm('Are you sure you want to delete this quiz?')) {
        return;
      }

      // Delete the quiz from Supabase
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId);
      
      if (error) {
        console.error('Error deleting quiz:', error);
        alert(`Failed to delete quiz: ${error.message}`);
        return;
      }
      
      console.log('Quiz deleted successfully from Supabase.');
      
      // Update local state
      const updatedQuizzes = availableQuizzes.filter((quiz) => quiz.id !== quizId);
      setAvailableQuizzes(updatedQuizzes);
      
      alert('Quiz deleted successfully!');
    } catch (err) {
      console.error('Unexpected error deleting quiz:', err);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleCopyLink = (quizId) => {
    const quizLink = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard.writeText(quizLink).then(() => {
      alert('Quiz link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy the link. Please try again.');
    });
  };

  const renderQuestion = () => {
    const question = selectedQuiz.questions[currentQuestion];
    
    return (
      <div className="quiz-interface animate-fade-in">
        <div className="progress-container">
          <div className="quiz-progress-bar">
            <div 
              className="quiz-progress" 
              style={{ width: `${((currentQuestion) / selectedQuiz.questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Question {currentQuestion + 1} of {selectedQuiz.questions.length}
          </div>
        </div>
        
        <div className="question-display">
          <h2 className="question-text">{question.questionText}</h2>
          
          {/* Different UI based on question type */}
          {question.questionType === 'multiple-choice' || question.questionType === 'true-false' ? (
            <div className="options-grid">
              {question.options.map((option, index) => (
                <button 
                  key={index} 
                  className={`option-button ${userAnswer === option ? 'selected' : ''}`}
                  onClick={() => setUserAnswer(option)}
                >
                  <span className="option-marker">{String.fromCharCode(65 + index)}</span>
                  <span>{option}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-answer-container">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here"
                className="form-control"
              />
            </div>
          )}
          
          <button 
            onClick={handleAnswerSubmit}
            disabled={!userAnswer}
            className="btn btn-primary btn-lg"
          >
            Submit Answer
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    
    return (
      <div className="quiz-results animate-fade-in">
        <h2>Quiz Results</h2>
        
        <div className="score-circle">
          <div className="score-percentage">{percentage}%</div>
        </div>
        
        <div className="score-detail">
          You scored {score} out of {selectedQuiz.questions.length} questions
        </div>
        
        <div className="results-actions">
          <button onClick={handleRetry} className="btn btn-primary">Try Again</button>
          <button onClick={handleGoToHome} className="btn btn-outline">Back to Quizzes</button>
          <button onClick={() => setShowAnswerDetails(!showAnswerDetails)} className="btn btn-outline">
            {showAnswerDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {showAnswerDetails && (
          <div className="answer-details" style={{ marginTop: '1rem' }}>
            {renderAnswerDetails()}
          </div>
        )}
      </div>
    );
  };

  const renderAnswerDetails = () => {
    return (
      <div className="answer-details">
        {userAnswers.map((answer, index) => (
          <div key={index} className="answer-detail">
            <p><strong>Question {index + 1}:</strong> {answer.question}</p>
            <p>
              Your Answer: {answer.userAnswer} - {answer.isCorrect ? <span className="correct">Correct</span> : <span className="incorrect">Incorrect</span>}
            </p>
          </div>
        ))}
      </div>
    );
  };

  // If showing quiz list (home page)
  if (!selectedQuiz) {
    return (
      <div className="quiz-home animate-fade-in">
        <div className="welcome-banner">
          <h1>Welcome to QuizMaster</h1>
          <div className="welcome-icon">📚</div>
          <p>Create and take quizzes on any topic you want. Test your knowledge or challenge your friends!</p>
          <Link to="/create" className="btn btn-primary btn-lg">Create New Quiz</Link>
        </div>
        
        <div className="quiz-list-container">
          <h2>Available Quizzes</h2>
          {availableQuizzes.length > 0 ? (
            <div className="quiz-list">
              {availableQuizzes.map((quiz) => (
                <div key={quiz.id} className="quiz-list-item">
                  <div className="quiz-item-content">
                    <h3 className="quiz-item-title">{quiz.title}</h3>
                    <div className="quiz-item-meta">
                      <span className="quiz-item-count">{quiz.questions.length} questions</span>
                      <span className="quiz-item-date">Created: {new Date(quiz.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="quiz-item-actions">
                    <button 
                      onClick={() => handleCopyLink(quiz.id)} 
                      className="btn btn-icon"
                      title="Copy Link"
                    >
                      🔗
                    </button>
                    <button 
                      onClick={() => handleQuizSelect(quiz)} 
                      className="btn btn-primary"
                    >
                      Start
                    </button>
                    <button 
                      onClick={() => handleDeleteQuiz(quiz.id)} 
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No Quizzes Yet</h3>
              <p className="empty-state-text">You haven't created any quizzes yet. Create your first quiz to get started!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If quiz is selected but not started
  if (!quizStarted && !showResults) {
    return (
      <div className="quiz-interface animate-fade-in">
        <div className="card">
          <div className="quiz-intro">
            <h1>{selectedQuiz.title}</h1>
            <p>This quiz has {selectedQuiz.questions.length} questions</p>
            <div className="action-buttons">
              <button 
                className="btn btn-primary btn-lg"
                onClick={handleStartQuiz}
              >
                Start Quiz
              </button>
              <button 
                className="btn btn-outline"
                onClick={handleGoToHome}
              >
                Back to Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Show results or current question
  console.log('Rendering QuizHome:', { selectedQuiz, quizStarted, showResults });
  return showResults ? renderResults() : renderQuestion();
};

export default QuizHome;