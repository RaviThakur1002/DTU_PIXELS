import React from 'react';
import FameCard from './FameCard';

const hallOfFameData = [
  {
    id: 1,
    heading: "Nature photography",
    subheading: "PRS",
    imageUrl: "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 2,
    heading: "Potrait photography",
    subheading: "Samarth",
    imageUrl: "https://via.placeholder.com/150"
  },
  {
    id: 3,
    heading: "Street photography",
    subheading: "Ravi",
    imageUrl: "https://via.placeholder.com/150"
  }
];

const HallOfFame = () => {
  return (
    <div className="flex flex-wrap justify-center p-4 bg-gray-100">
      <h1 className="w-full text-center text-4xl font-bold mb-8">Hall of Fame</h1>
      {hallOfFameData.map((item) => (
        <div key={item.id} className="m-4">
          <FameCard
            src={item.imageUrl}
            alt={item.heading}
            name={item.heading}
            subtitle={item.subheading}
          />
        </div>
      ))}
    </div>
  );
};

export default HallOfFame;
