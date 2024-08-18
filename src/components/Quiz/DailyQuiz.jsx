import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';
import app from '../../config/conf.js';
import { quizData } from './quizData';
import LoadingSpinner from '../Utilities/LoadingSpinner.jsx';


const Container = styled.div`
  background: linear-gradient(135deg, #ff61d2 0%, #fe9090 100%);
  color: white;
  padding: 2rem;
  border-radius: 20px;
  max-width: 600px;
  margin: 2rem auto;
  font-family: 'Arial', sans-serif;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    padding: 1rem;
    margin: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const QuizCard = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2rem;
  border-radius: 15px;
  margin-top: 1rem;
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Button = styled.button`
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  margin: 0.5rem 0;
  transition: all 0.3s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 1rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const OptionButton = styled(Button)`
  background-color: ${props => (props.selected ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)')};
  border: 2px solid white;
  color: white;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const SubmitButton = styled(Button)`
  background-color: #2ecc71;
  justify-content: center;
  font-weight: bold;
  &:hover {
    background-color: #27ae60;
  }
`;

const StreakDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  font-size: 1.2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const TimeDisplay = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1rem;
`;

const Question = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const Result = styled.div`
  margin-top: 1rem;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled(Container)`
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
`;

const QuizButtonStyled = styled(Button)`
  background-color: #3498db;
  &:hover {
    background-color: #2980b9;
  }
`;

const QuizButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const OptionIcon = ({ number }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" style={{ marginRight: '1rem', flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" fill="rgba(255, 255, 255, 0.3)" />
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12">{number}</text>
  </svg>
);

const StreakIcon = ({ streak }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" style={{ marginRight: '0.5rem' }}>
    <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" 
          fill={streak > 0 ? "#e74c3c" : "#95a5a6"} />
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10">{streak}</text>
  </svg>
);

export const QuizButton = ({ onClick}) => (
  <QuizButtonContainer>
    <QuizButtonStyled onClick={onClick}>
      Today's Quiz
     
    </QuizButtonStyled>
  </QuizButtonContainer>
);

const DailyQuiz = ({ onClose }) => {
  const [quiz, setQuiz] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizAttempted, setQuizAttempted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);
  const db = getDatabase(app);

  useEffect(() => {
    const checkQuizStatus = async () => {
      setLoading(true);
      await fetchTodayQuiz();
      if (auth.currentUser) {
        const attempted = await checkQuizAttempted();
        if (attempted) {
          setQuizAttempted(true);
        } else {
          setTimeLeft(30);
        }
        await fetchUserData();
      }
      setLoading(false);
    };
    checkQuizStatus();
  }, [auth.currentUser]);

  useEffect(() => {
    let timer;
    if (!quizAttempted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [quizAttempted, timeLeft, quiz]);

  const getCurrentDateKey = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  const fetchTodayQuiz = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const quizIndex = dayOfYear % quizData.length;
    setQuiz(quizData[quizIndex]);
  };

  const checkQuizAttempted = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.lastQuizDate === getCurrentDateKey()) {
          setQuizResult(userData.lastQuizResult);
          return true;
        }
      }
    }
    return false;
  };

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setStreak(userData.streak || 0);
        setLongestStreak(userData.longestStreak || 0);
      }
    }
  };

  const handleAnswerSelect = (answer) => {
    setUserAnswer(answer);
  };

  const handleTimeUp = () => {
    setQuizResult(`Oops! Time's up. The correct answer is: ${quiz.correctAnswer}`);
    setQuizAttempted(true);
    updateUserData(false);
  };

  const updateUserData = async (isCorrect) => {
    const user = auth.currentUser;
    if (user && quiz) {
      const userRef = ref(db, `users/${user.uid}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val() || {};
      
      let newStreak = isCorrect ? (userData.streak || 0) + 1 : 0;
      let newLongestStreak = Math.max(userData.longestStreak || 0, newStreak);
      
      await set(userRef, { 
        ...userData,
        streak: newStreak, 
        longestStreak: newLongestStreak,
        lastQuizDate: getCurrentDateKey(),
        lastQuizResult: isCorrect ? "Correct!" : `Wrong. The correct answer is: ${quiz.correctAnswer}`
      });
      
      setStreak(newStreak);
      setLongestStreak(newLongestStreak);
    }
  };

  const handleQuizSubmit = async () => {
    const isCorrect = userAnswer === quiz.correctAnswer;
    await updateUserData(isCorrect);
    
    setQuizResult(isCorrect ? "Correct!" : `Wrong. The correct answer is: ${quiz.correctAnswer}`);
    setQuizAttempted(true);
    setUserAnswer(null);
  };

  if (!quiz) {
    return (
      <PopupContent>
        <p>Loading...</p>
      </PopupContent>
    );
  }

  if (loading) {
    return (
      <PopupContent>
        <p>Loading...</p>
      </PopupContent>
    );
  }

   return (
    <PopupOverlay>
      <PopupContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>Daily Frontend Quiz</Title>


        <QuizCard>
          {quizAttempted ? (
            <div>
              <h2>Today's Quiz (Attempted)</h2>
              <Question>{quiz.question}</Question>
              <p>Correct Answer: {quiz.correctAnswer}</p>
              {quizResult && <Result>{quizResult}</Result>}
            </div>
          ) : (
            <>
              <TimeDisplay>{timeLeft}</TimeDisplay>
              <Question>{quiz.question}</Question>
              {quiz.options.map((option, index) => (
                <OptionButton 
                  key={index} 
                  onClick={() => handleAnswerSelect(option)}
                  disabled={timeLeft === 0}
                  selected={userAnswer === option}
                >
                  <OptionIcon number={index + 1} />
                  {option}
                </OptionButton>
              ))}
              <SubmitButton onClick={handleQuizSubmit} disabled={!userAnswer || timeLeft === 0}>
                Submit Answer
              </SubmitButton>
            </>
          )}
        </QuizCard>
        <StreakDisplay>
          <StreakIcon streak={streak} />
          <span>Current Streak: {streak} | Longest Streak: {longestStreak}</span>
        </StreakDisplay>
      </PopupContent>
    </PopupOverlay>
  );
};

export default DailyQuiz;
