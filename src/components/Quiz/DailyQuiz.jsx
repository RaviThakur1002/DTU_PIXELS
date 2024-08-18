import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';
import app from '../../config/conf.js';
import { quizData } from './quizData';
import LoadingSpinner from '../Utilities/LoadingSpinner.jsx';

const Container = styled.div`
  background: linear-gradient(135deg, #6528d7 0%, #b00bef 100%);
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
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #f0e68c;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const QuizCard = styled.div`
  background-color: rgba(23, 23, 23, 0.8);
  padding: 2rem;
  border-radius: 15px;
  margin-top: 1rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Button = styled.button`
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 25px;
  cursor: pointer;
  margin: 0.75rem 0;
  transition: all 0.3s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 1.1rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const OptionButton = styled(Button)`
  background-color: ${props => (props.selected ? 'rgba(101, 40, 215, 0.5)' : 'rgba(255, 255, 255, 0.1)')};
  border: 2px solid ${props => (props.selected ? '#f0e68c' : 'transparent')};
  color: white;
  font-weight: bold;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => (props.selected ? 'rgba(101, 40, 215, 0.7)' : 'rgba(255, 255, 255, 0.3)')};
  }
`;

const SubmitButton = styled(Button)`
  background-color: #4caf50;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 1.5rem;
  &:hover {
    background-color: #45a049;
  }
`;

const StreakDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
  font-size: 1.3rem;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
  border-radius: 15px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const TimeDisplay = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

const Question = styled.p`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #f0e68c;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Result = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => (props.correct ? '#4caf50' : '#ff6b6b')};

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
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
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(90deg);
  }
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
  margin-bottom: 1.5rem;
`;

const OptionIcon = ({ number }) => (
  <svg width="30" height="30" viewBox="0 0 30 30" style={{ marginRight: '1rem', flexShrink: 0 }}>
    <circle cx="15" cy="15" r="14" fill="rgba(255, 255, 255, 0.2)" stroke="#f0e68c" strokeWidth="2" />
    <text x="15" y="20" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{number}</text>
  </svg>
);

const StreakIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" style={{ marginRight: '0.75rem' }}>
    <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" 
          fill="#ff6b6b" />
  </svg>
);

const AttemptedBadge = styled.div`
  background-color: #ff6b6b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
`;

export const QuizButton = ({ onClick }) => (
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
  const startDate = new Date('2024-08-18'); // Set a fixed start date
  const today = new Date();
  const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const quizIndex = daysSinceStart % quizData.length;
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
        <Title>Snap & Learn</Title>

        <QuizCard>
          {quizAttempted ? (
            <div>
              <AttemptedBadge>Attempted</AttemptedBadge>
              <Question>{quiz.question}</Question>
              <p style={{ textAlign: 'center', marginBottom: '1rem' }}>Correct Answer: <span style={{ color: '#4caf50', fontWeight: 'bold' }}>{quiz.correctAnswer}</span></p>
              {quizResult && <Result correct={quizResult === "Correct!"}>{quizResult}</Result>}
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
          <StreakIcon />
          <span>Current Streak: {streak} | Longest Streak: {longestStreak}</span>
        </StreakDisplay>
      </PopupContent>
    </PopupOverlay>
  );
};

export default DailyQuiz;
