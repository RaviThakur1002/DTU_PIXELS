import React, { useState, useEffect } from 'react';
import imageOps from '../../../firebase/imageOps/imageOps';

const UploadComponent = ({ onUploadComplete }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (uploadFile) {
      setIsUploading(true);
      setUploadProgress(0);
      try {
        await imageOps.uploadImage(uploadFile, (progress) => {
          setUploadProgress(progress);
        });
        setPreviewImage(null);
        setUploadFile(null);
        setMessage('Your photo has been successfully uploaded!');
        setMessageType('success');
        if (onUploadComplete) onUploadComplete();
      } catch (error) {
        console.error("Error uploading image:", error);
        setMessage('There was an error uploading your photo. Please try again.');
        setMessageType('error');
      } finally {
        setIsUploading(false);
        setTimeout(() => {
          setMessage('');
          setMessageType('');
          setUploadProgress(0);
        }, 3000);
      }
    } else {
      setMessage('Please select a file.');
      setMessageType('error');
    }
  };

  return (
    <div className="mb-4 flex flex-col items-center">
      {message && (
        <div className={`mb-4 p-3 rounded-lg w-64 ${
          messageType === 'success' 
            ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' 
            : 'bg-gradient-to-r from-red-400 to-red-600 text-white'
        } border border-solid ${
          messageType === 'success' ? 'border-green-300' : 'border-red-300'
        } text-center transition-all duration-300 animate-fade-in-down shadow-md`}>
          <p className="font-semibold">{message}</p>
        </div>
      )}
      <label className="w-64 mb-4 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 text-center font-semibold border-2 border-blue-400">
        Choose File
        <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
      </label>
      {previewImage && (
        <div className="mt-2 flex flex-col items-center">
          <img src={previewImage} alt="Preview" className="max-w-sm w-full rounded-lg shadow-lg mb-4" />
          {!isUploading && (
            <button 
              onClick={handleUpload}
              className="bg-gradient-to-r from-green-400 to-green-600 text-white py-3 px-8 rounded-full hover:from-green-500 hover:to-green-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl font-bold text-lg"
            >
              Upload Image
            </button>
          )}
        </div>
      )}
      {isUploading && (
        <div className="w-64 mt-4">
          <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-center mt-2 font-semibold text-blue-600">{Math.round(uploadProgress)}% Uploaded</p>
        </div>
      )}
    </div>
  );
};

export default UploadComponent;
