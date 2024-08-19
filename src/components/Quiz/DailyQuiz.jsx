import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database";
import app from "../../config/conf.js";
import { quizData } from "./quizData";
import LoadingSpinner from "../Utilities/LoadingSpinner.jsx";

const Container = styled.div`
  background: linear-gradient(135deg, #1f2937 0%, #000000 100%);
  color: white;
  padding: 2rem;
  border-radius: 20px;
  max-width: 600px;
  margin: 2rem auto;
  font-family: "Arial", sans-serif;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    padding: 1rem;
    margin: 1rem;
  }
`;

const Title = styled.h1`
  font-family: "Jersey 10", sans-serif;
  font-size: 3.6rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #c4a0ef;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const QuizCard = styled.div`
  background-color: #1f2937;
  padding: 2rem;
  border-radius: 15px;
  margin-top: 1rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px; // Adjust this value as needed

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const TickSVG = () => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="25" cy="25" r="23" stroke="#4CAF50" strokeWidth="4" />
    <path
      d="M15 25L22 32L35 19"
      stroke="#4CAF50"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CrossSVG = () => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="25" cy="25" r="23" stroke="#FF6B6B" strokeWidth="4" />
    <path
      d="M17 17L33 33M33 17L17 33"
      stroke="#FF6B6B"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StopwatchSVG = () => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="25" cy="25" r="23" stroke="#FFA500" strokeWidth="4" />
    <circle cx="25" cy="25" r="18" stroke="#FFA500" strokeWidth="2" />
    <path
      d="M25 15V25L32 32"
      stroke="#FFA500"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
  background-color: ${(props) =>
    props.selected ? "rgba(101, 40, 215, 0.5)" : "rgba(255, 255, 255, 0.1)"};
  border: 2px solid ${(props) => (props.selected ? "#f0e68c" : "transparent")};
  color: white;
  font-weight: bold;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) =>
    props.selected ? "rgba(101, 40, 215, 0.7)" : "rgba(255, 255, 255, 0.3)"};
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
  justify-content: space-between;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
const StreakItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  text-align: center;

  &:first-child {
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const StreakLabel = styled.span`
  font-size: 0.9rem;
  color: #9ca3af;
  margin-bottom: 0.25rem;
`;

const StreakValue = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #c4a0ef;
  display: block;
  width: 100%;
  text-align: center;
`;
const StreakIcon = styled.div`
  margin-right: 0.75rem;
  flex-shrink: 0;
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
  font-family: "Inter", sans-serif;
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #d1d1d1;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Result = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => (props.correct ? "#4caf50" : "#ff6b6b")};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  svg {
    margin-bottom: 1rem;
  }

  p {
    margin: 0.5rem 0;
  }

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
  padding: 20px;
`;

const PopupContent = styled(Container)`
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  width: 90%;
  max-width: 600px;
  margin: 0;

  @media (max-height: 700px) {
    max-height: 95vh;
  }

  @media (max-width: 480px) {
    width: 95%;
    padding: 1rem;
  }
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
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    style={{ marginRight: "1rem", flexShrink: 0 }}
  >
    <circle
      cx="15"
      cy="15"
      r="14"
      fill="rgba(255, 255, 255, 0.2)"
      stroke="#f0e68c"
      strokeWidth="2"
    />
    <text
      x="15"
      y="20"
      textAnchor="middle"
      fill="white"
      fontSize="14"
      fontWeight="bold"
    >
      {number}
    </text>
  </svg>
);

const AttemptedBadge = styled.div`
  background-color: #1e40af;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
`;

export const QuizButton = ({ onClick, className }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 bg-gradient-to-r from-[#6528d7] to-[#b00bef] text-white font-semibold rounded-full hover:from-[#b00bef] hover:to-[#6528d7] transition transform hover:scale-105 ${className}`}
  >
    Today's Quiz
  </button>
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
  const [showInitialResult, setShowInitialResult] = useState(false);

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
    return now.toISOString().split("T")[0];
  };

  const fetchTodayQuiz = () => {
    const startDate = new Date("2024-08-18"); // Set a fixed start date
    const today = new Date();
    const daysSinceStart = Math.floor(
      (today - startDate) / (1000 * 60 * 60 * 24),
    );
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
    setQuizResult("Time's up");
    setQuizAttempted(true);
    setShowInitialResult(true);
    updateUserData(false, true); // Add a parameter to indicate time-up
  };

  const updateUserData = async (isCorrect, isTimeUp = false) => {
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
        lastQuizResult: isCorrect
          ? "Correct!"
          : isTimeUp
            ? "Time's up"
            : `Wrong. The correct answer is: ${quiz.correctAnswer}`,
      });

      setStreak(newStreak);
      setLongestStreak(newLongestStreak);
    }
  };

  const handleQuizSubmit = async () => {
    const isCorrect = userAnswer === quiz.correctAnswer;
    await updateUserData(isCorrect);

    setQuizResult(isCorrect ? "Correct!" : "Wrong");
    setQuizAttempted(true);
    setShowInitialResult(true);
    setUserAnswer(null);
  };

  const renderInitialResult = () => {
    switch (quizResult) {
      case "Correct!":
        return (
          <Result correct={true}>
            <TickSVG />
            <p>Correct!</p>
          </Result>
        );
      case "Wrong":
        return (
          <Result correct={false}>
            <CrossSVG />
            <p>Wrong</p>
            <p>The correct answer is: {quiz.correctAnswer}</p>
          </Result>
        );
      case "Time's up":
        return (
          <Result correct={false}>
            <StopwatchSVG />
            <p>Oops! Time's up</p>
            <p>The correct answer is: {quiz.correctAnswer}</p>
          </Result>
        );
      default:
        return null;
    }
  };

  const renderAttemptedQuiz = () => (
    <div>
      <AttemptedBadge>Attempted</AttemptedBadge>
      <Question>{quiz.question}</Question>
      <p style={{ textAlign: "center", marginBottom: "1rem" }}>
        Correct Answer:{" "}
        <span style={{ color: "#4caf50", fontWeight: "bold" }}>
          {quiz.correctAnswer}
        </span>
      </p>
      <p style={{ textAlign: "center", marginBottom: "1rem" }}>
        Your verdict:{" "}
        <span
          style={{
            fontWeight: "bold",
            color: getVerdictColor(quizResult.split(".")[0]),
          }}
        >
          {quizResult.split(".")[0]}
        </span>
      </p>
    </div>
  );

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case "Correct!":
        return "#4caf50";
      case "Wrong":
        return "#ff6b6b";
      case "Time's up":
        return "#ffa500";
      default:
        return "#ffffff";
    }
  };

  return (
    <PopupOverlay>
      <PopupContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>Pixel Perfect</Title>

        <QuizCard>
          {loading ? (
            <LoadingSpinner quote="Quizzzing" />
          ) : quizAttempted ? (
            showInitialResult ? (
              renderInitialResult()
            ) : (
              renderAttemptedQuiz()
            )
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
              <SubmitButton
                onClick={handleQuizSubmit}
                disabled={!userAnswer || timeLeft === 0}
              >
                Submit Answer
              </SubmitButton>
            </>
          )}
        </QuizCard>
        <StreakDisplay>
          <StreakIcon>
            <svg width="32" height="32" viewBox="0 0 24 24">
              <path
                d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"
                fill="#ff6b6b"
              />
            </svg>
          </StreakIcon>
          <StreakItem>
            <StreakLabel>Current Streak</StreakLabel>
            <StreakValue>{streak}</StreakValue>
          </StreakItem>
          <StreakItem>
            <StreakLabel>Longest Streak</StreakLabel>
            <StreakValue>{longestStreak}</StreakValue>
          </StreakItem>
        </StreakDisplay>
      </PopupContent>
    </PopupOverlay>
  );
};
export default DailyQuiz;
