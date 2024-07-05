import React from 'react';
import UploadComponent from '../contests/functions/UploadComponent.jsx';
import ImageSlider from './ImageSlider/ImageSlider.jsx'
import Contact from '../Footer/Contact.jsx';
import Hero from './Hero.jsx'
import Footer from '../Footer/Footer.jsx';

const Home = () => {
  return (
    <>
      <Hero />

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to our Photo App</h1>
        <p className="mb-4">Upload your images and view them in the gallery!</p>
        <UploadComponent onUploadComplete={() => {
          // You can add logic here to refresh the gallery or show a message
          console.log('Upload completed');
        }} />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Featured Images</h2>
          <ImageSlider />
        </div>
      </div>

      <Contact />
      <Footer />
    </>
  );
};

export default Home;
