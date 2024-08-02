import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  
  @media (max-width: 1200px) {
    font-size: 20px;
  }
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const Text = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const CaptureText = styled.span`
  color: #F5DEB3;
  margin-right: 10px;
  
  @media (max-width: 480px) {
    margin-right: 5px;
  }
`;

const WordWrapper = styled.div`
  position: relative;
  display: inline-block;
  height: 1.5em;
  width: 200px;
  
  @media (max-width: 768px) {
    width: 180px;
  }
  
  @media (max-width: 480px) {
    width: 150px;
  }
`;

const Word = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
`;

const Letter = styled.span`
  display: inline-block;
  position: relative;
  float: left;
  transform: translateZ(26px);
  transform-origin: 50% 50% 26px;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  @media (max-width: 768px) {
    transform: translateZ(20px);
    transform-origin: 50% 50% 20px;
  }
  
  @media (max-width: 480px) {
    transform: translateZ(13px);
    transform-origin: 50% 50% 13px;
  }
`;

const Taglines = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['moment.', 'beauty.', 'essence.', 'magic.', 'wonder.'];
  const colors = ['#8e44ad', '#2980b9', '#c0392b', '#16a085', '#f08f4f'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev === words.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <Text>
        <CaptureText>Capture the</CaptureText>
        <WordWrapper>
          {words.map((word, index) => (
            <Word
              key={word}
              style={{
                opacity: currentWord === index ? 1 : 0,
                color: colors[index],
              }}
            >
              {word.split('').map((letter, i) => (
                <Letter
                  key={i}
                  style={{
                    transitionDelay: `${i * 80}ms`,
                    transform:
                      currentWord === index
                        ? 'rotateX(0deg)'
                        : index === (currentWord - 1 + words.length) % words.length
                        ? 'rotateX(90deg)'
                        : 'rotateX(-90deg)',
                  }}
                >
                  {letter}
                </Letter>
              ))}
            </Word>
          ))}
        </WordWrapper>
      </Text>
    </Container>
  );
};

export default Taglines;
