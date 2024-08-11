import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useGallery } from "../contexts/GalleryContext";

const SliderSection = styled.section`
  background-color: #171717;
  padding: 40px 0;
`;

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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  perspective: 1500px;
  transform-style: preserve-3d;
  background: #2c2c2e;
  &:hover {
    transform: scale(1.05) rotateY(10deg) rotateX(5deg) translateZ(30px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translateZ(10px);
  transition: transform 0.3s ease;
`;

const Heading = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
`;

const SubHeading = styled.p`
  font-size: 1.2rem;
  color: #5b3dcc;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 30px;
`;

const Gallery = () => {
  const { allGalleryData } = useGallery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const sliderRef = useRef(null);

  const startAutoplay = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (allGalleryData.length * 3));
    }, 2000);
  };

  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (allGalleryData && allGalleryData.length > 0) {
      startAutoplay();
    }
    return () => stopAutoplay();
  }, [allGalleryData]);

  useEffect(() => {
    if (currentIndex >= allGalleryData.length * 2) {
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.style.transition = "none";
          setCurrentIndex(allGalleryData.length);
          setTimeout(() => {
            if (sliderRef.current) {
              sliderRef.current.style.transition = "transform 0.5s ease";
            }
          }, 50);
        }
      }, 500);
    }
  }, [currentIndex, allGalleryData]);

  if (!allGalleryData || allGalleryData.length === 0) {
    return null;
  }

  const extendedImages = [...allGalleryData, ...allGalleryData, ...allGalleryData];

  return (
    <SliderSection>
      <SubHeading>Gallery</SubHeading>
      <Heading>See what our community has clicked!</Heading>
      <SliderContainer>
        <SliderTrack
          ref={sliderRef}
          style={{ transform: `translateX(-${currentIndex * 270}px)` }}
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
        >
          {extendedImages.map((image, index) => (
            <Card key={index}>
              <Image src={image.photoUrl} alt={`Contest entry by ${image.userName}`} />
            </Card>
          ))}
        </SliderTrack>
      </SliderContainer>
    </SliderSection>
  );
};

export default Gallery;
