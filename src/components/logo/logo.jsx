import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import piggy from './piggy.png';
import Taglines from './tagline.jsx'

const strokeOffset = keyframes`
  100% {stroke-dashoffset: -35%;}
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  align-items: center;
  justify-content: center;
  background: #030321;
  padding: 0 5%;

`;

const AnimatedContainer = styled(Container)`
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  &.visible {
    animation: ${fadeInUp} 0.6s ease-out forwards;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
`;

const Svg = styled.svg`
  display: block;
  font: 10em 'Montserrat', sans-serif;
  width: 100%;
  height: auto;
`;

const TextCopy = styled.use`
  fill: none;
  stroke: white;
  stroke-dasharray: 6% 29%;
  stroke-width: 5px;
  stroke-dashoffset: 0%;
  animation: ${strokeOffset} 5.5s infinite linear;
  &:nth-child(1) {
    stroke: #4D163D;
    animation-delay: -1s;
  }
  &:nth-child(2) {
    stroke: #840037;
    animation-delay: -2s;
  }
  &:nth-child(3) {
    stroke: #BD0034;
    animation-delay: -3s;
  }
  &:nth-child(4) {
    stroke: #BD0034;
    animation-delay: -4s;
  }
  &:nth-child(5) {
    stroke: #FDB731;
    animation-delay: -5s;
  }
`;

const DTUPixelLogo = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <AnimatedContainer ref={containerRef}>
      <ContentWrapper>
        <LogoContainer display="flex" flexDirection="column" justifyContent="center">
          <Svg viewBox="0 0 800 200">
            <symbol id="s-text">
              <text textAnchor="middle" x="50%" y="60%">DTU Pixels</text>
            </symbol>
            <g className="g-ants">
              <TextCopy xlinkHref="#s-text" />
              <TextCopy xlinkHref="#s-text" />
              <TextCopy xlinkHref="#s-text" />
              <TextCopy xlinkHref="#s-text" />
              <TextCopy xlinkHref="#s-text" />
            </g>
          </Svg>
          <p><Taglines /></p>
        </LogoContainer>
        <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={piggy} alt="Landing Page Image" style={{ width: '70%', height: 'auto' }} />
        </div>
      </ContentWrapper>
    </AnimatedContainer>
  );
};

export default DTUPixelLogo;
