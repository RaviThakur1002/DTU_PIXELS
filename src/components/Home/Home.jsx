import React from 'react';
import UploadComponent from '../contests/functions/UploadComponent.jsx';

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to our Photo App</h1>
      <p className="mb-4">Upload your images and view them in the gallery!</p>
      <UploadComponent onUploadComplete={() => {
        // You can add logic here to refresh the gallery or show a message
        console.log('Upload completed');
      }} />
    </div>
  );
};

export default Home;
