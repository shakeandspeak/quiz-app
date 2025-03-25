import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const QuizCreator = () => {
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    questionType: 'multiple-choice',
    options: ['', ''],
    correctAnswer: '',
  });
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

  // Add a new question to the quiz
  const handleAddQuestion = () => {
    // Validate question
    if (!currentQuestion.questionText) {
      alert('Please enter a question');
      return;
    }

    if (currentQuestion.questionType === 'multiple-choice' || currentQuestion.questionType === 'true-false') {
      if (!currentQuestion.correctAnswer) {
        alert('Please select a correct answer');
        return;
      }
      
      // Check if all options have content for multiple choice
      if (currentQuestion.questionType === 'multiple-choice' && 
          currentQuestion.options.some(option => !option.trim())) {
        alert('All options must have content');
        return;
      }
    } else if (currentQuestion.questionType === 'text') {
      if (!currentQuestion.correctAnswer) {
        alert('Please enter a correct answer');
        return;
      }
    }

    if (editingQuestionIndex !== null) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = { ...currentQuestion };
      setQuestions(updatedQuestions);
      setEditingQuestionIndex(null);
    } else {
      // Add new question
      setQuestions([...questions, { ...currentQuestion, id: Date.now() }]);
    }

    // Reset current question
    setCurrentQuestion({
      questionText: '',
      questionType: 'multiple-choice',
      options: ['', ''],
      correctAnswer: '',
    });
  };

  // Edit an existing question
  const handleEditQuestion = (index) => {
    setCurrentQuestion({ ...questions[index] });
    setEditingQuestionIndex(index);
  };

  // Handle question type change
  const handleQuestionTypeChange = (e) => {
    const type = e.target.value;
    
    let options = [];
    if (type === 'multiple-choice') {
      options = ['', ''];
    } else if (type === 'true-false') {
      options = ['True', 'False'];
    }
    
    setCurrentQuestion({
      ...currentQuestion,
      questionType: type,
      options,
      correctAnswer: '',
    });
  };

  // Handle option change for multiple choice questions
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    
    // If the changed option was the correct answer, update the correctAnswer
    const updatedCorrectAnswer = currentQuestion.correctAnswer === currentQuestion.options[index] 
      ? value 
      : currentQuestion.correctAnswer;
    
    setCurrentQuestion({
      ...currentQuestion,
      options: updatedOptions,
      correctAnswer: updatedCorrectAnswer
    });
  };

  // Add a new option for multiple choice
  const handleAddOption = () => {
    if (currentQuestion.options.length < 6) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...currentQuestion.options, ''],
      });
    } else {
      alert('Maximum 6 options allowed');
    }
  };

  // Remove an option
  const handleRemoveOption = (index) => {
    if (currentQuestion.options.length > 2) {
      const filteredOptions = currentQuestion.options.filter((_, i) => i !== index);
      const updatedCorrectAnswer = currentQuestion.correctAnswer === currentQuestion.options[index] 
        ? '' 
        : currentQuestion.correctAnswer;
      
      setCurrentQuestion({
        ...currentQuestion,
        options: filteredOptions,
        correctAnswer: updatedCorrectAnswer,
      });
    } else {
      alert('Minimum 2 options required');
    }
  };

  // Remove a question from the quiz
  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
    
    // If we're editing this question, reset the editor
    if (editingQuestionIndex === index) {
      setEditingQuestionIndex(null);
      setCurrentQuestion({
        questionText: '',
        questionType: 'multiple-choice',
        options: ['', ''],
        correctAnswer: '',
      });
    } else if (editingQuestionIndex !== null && index < editingQuestionIndex) {
      // Adjust the editing index if we removed a question that comes before it
      setEditingQuestionIndex(editingQuestionIndex - 1);
    }
  };

  // Cancel editing a question
  const handleCancelEdit = () => {
    setEditingQuestionIndex(null);
    setCurrentQuestion({
      questionText: '',
      questionType: 'multiple-choice',
      options: ['', ''],
      correctAnswer: '',
    });
  };

  // Save the entire quiz
  const handleSaveQuiz = () => {
    if (!quizTitle) {
      alert('Please enter a quiz title');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    const quiz = {
      id: Date.now().toString(),
      title: quizTitle,
      questions: questions,
      createdAt: new Date().toISOString(),
    };

    console.log('Saved Quiz:', quiz);

    // Save quiz to localStorage for now (can be replaced with API call later)
    const savedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    savedQuizzes.push(quiz);
    localStorage.setItem('quizzes', JSON.stringify(savedQuizzes));
    
    alert('Quiz saved successfully!');
    navigate('/');
  };

  const getQuestionTypeName = (type) => {
    switch (type) {
      case 'multiple-choice': return 'Multiple Choice';
      case 'true-false': return 'True/False';
      case 'text': return 'Text Answer';
      default: return type;
    }
  };

  return (
    <div className="quiz-creator animate-fade-in">
      <div className="form-header">
        <h1>Create a New Quiz</h1>
        <p>Build your quiz by adding questions, setting correct answers, and publishing</p>
      </div>
      
      <div className="quiz-form">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="quiz-title">Quiz Title</label>
            <input
              type="text"
              id="quiz-title"
              className="form-control"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter a title for your quiz"
              required
            />
          </div>
        </div>

        {questions.length > 0 && (
          <div className="form-section">
            <div className="section-title">
              <h2>Questions</h2>
              <span className="question-count">({questions.length})</span>
            </div>
            
            <div className="question-cards">
              {questions.map((question, index) => (
                <div key={question.id} className="question-card">
                  <div className="question-card-header">
                    <div className="question-number">{index + 1}</div>
                    <div className="question-type-badge">{getQuestionTypeName(question.questionType)}</div>
                  </div>
                  
                  <div className="question-card-body">
                    <h3>{question.questionText}</h3>
                    
                    {(question.questionType === 'multiple-choice' || question.questionType === 'true-false') && (
                      <ul className="option-list">
                        {question.options.map((option, i) => (
                          <li 
                            key={i} 
                            className={`option-item ${option === question.correctAnswer ? 'correct' : ''}`}
                          >
                            {option}
                            {option === question.correctAnswer && <span className="correct-badge">Correct</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {question.questionType === 'text' && (
                      <div className="correct-answer-display">
                        <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="question-actions">
                    <button 
                      onClick={() => handleEditQuestion(index)}
                      className="btn btn-outline"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleRemoveQuestion(index)}
                      className="btn btn-danger"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-section">
          <div className="section-title">
            <h2>{editingQuestionIndex !== null ? 'Edit Question' : 'Add Question'}</h2>
          </div>
          
          <div className="add-question-form">
            <div className="form-group">
              <label>Question Type</label>
              <select
                className="form-control"
                value={currentQuestion.questionType}
                onChange={handleQuestionTypeChange}
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="text">Text Answer</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Question Text</label>
              <textarea
                className="form-control"
                value={currentQuestion.questionText}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                placeholder="Enter your question"
                rows={3}
              ></textarea>
            </div>

            {(currentQuestion.questionType === 'multiple-choice' || currentQuestion.questionType === 'true-false') && (
              <div className="form-group">
                <label>Options</label>
                <div className="options-form">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="option-row">
                      <input
                        type="text"
                        className="form-control option-input"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        disabled={currentQuestion.questionType === 'true-false'}
                      />
                      
                      <div className="radio-group">
                        <input
                          type="radio"
                          id={`correct-${index}`}
                          name="correctAnswer"
                          checked={currentQuestion.correctAnswer === option}
                          onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: option })}
                          disabled={!option}
                        />
                        <label htmlFor={`correct-${index}`}>Correct</label>
                      </div>
                      
                      {currentQuestion.questionType === 'multiple-choice' && (
                        <button 
                          onClick={() => handleRemoveOption(index)} 
                          className="btn btn-danger"
                          disabled={currentQuestion.options.length <= 2}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {currentQuestion.questionType === 'multiple-choice' && (
                    <button 
                      onClick={handleAddOption} 
                      className="btn btn-outline"
                      disabled={currentQuestion.options.length >= 6}
                    >
                      Add Option
                    </button>
                  )}
                </div>
              </div>
            )}

            {currentQuestion.questionType === 'text' && (
              <div className="form-group">
                <label>Correct Answer</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                  placeholder="Enter correct answer"
                />
              </div>
            )}

            <div className="form-actions">
              {editingQuestionIndex !== null && (
                <button onClick={handleCancelEdit} className="btn btn-outline">
                  Cancel
                </button>
              )}
              <button 
                onClick={handleAddQuestion} 
                className="btn btn-primary"
              >
                {editingQuestionIndex !== null ? 'Update Question' : 'Add Question'}
              </button>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button onClick={() => navigate('/')} className="btn btn-outline">
            Cancel
          </button>
          <button 
            onClick={handleSaveQuiz} 
            className="btn btn-primary"
            disabled={questions.length === 0 || !quizTitle}
          >
            Save Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCreator;