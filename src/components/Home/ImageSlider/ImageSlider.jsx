import React, { useState, useEffect, useRef } from "react";

import styled from "styled-components";

import img1 from "./img1.png";
import img2 from "./img2.png";
import img3 from "./img3.jpg";
import img4 from "./img4.png";
import img6 from "./img6.jpg";
import img7 from "./img7.jpg";

const images = [img1, img2, img3, img4, img6, img7];
const SliderContainer = styled.div`
  width: 100%;
  overflow: hidden;
  padding: 20px 0;
`;

const SliderTrack = styled.div`
  display: flex;
  transition: transform 0.5s ease;
`;

const Card = styled.div`
  flex: 0 0 250px;
  height: 350px;
  margin: 0 10px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  perspective: 1500px; /* Increased perspective */
  transform-style: preserve-3d;
  background: #fff;

  &:hover {
    transform: scale(1.05) rotateY(10deg) rotateX(5deg) translateZ(30px); /* Enhanced 3D transformation */
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translateZ(10px);
  transition: transform 0.3s ease;
`;

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const sliderRef = useRef(null);

  const startAutoplay = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (images.length * 3));
    }, 2000);
  };

  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, []);

  useEffect(() => {
    if (currentIndex >= images.length * 2) {
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.style.transition = "none";
          setCurrentIndex(images.length);
          setTimeout(() => {
            if (sliderRef.current) {
              sliderRef.current.style.transition = "transform 0.5s ease";
            }
          }, 50);
        }
      }, 500);
    }
  }, [currentIndex]);

  const extendedImages = [...images, ...images, ...images];

  return (
    <SliderContainer>
      <SliderTrack
        ref={sliderRef}
        style={{ transform: `translateX(-${currentIndex * 270}px)` }}
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
      >
        {extendedImages.map((image, index) => (
          <Card key={index}>
            <Image src={image} alt={`Slide ${index + 1}`} />
          </Card>
        ))}
      </SliderTrack>
    </SliderContainer>
  );
};

export default ImageSlider;
