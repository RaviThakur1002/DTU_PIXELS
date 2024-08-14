import React, { useState, useEffect } from "react";
import UploadService from "../../../firebase/services/UplaodService.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../../config/conf.js";

const styles = `
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  @keyframes slideOut {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
  }
`;

const UploadComponent = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [quote, setQuote] = useState("");
  const [user, setUser] = useState(null);
  const [fileError, setFileError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, []);

  const setMessageWithTimer = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleFileChange = (event) => {
    if (!user) {
      setMessageWithTimer("Please log in to upload a photo.", "error");
      return;
    }

    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setMessageWithTimer(
          "Only JPEG, JPG, and PNG files are allowed.",
          "error",
        );
        setFileError("Only JPEG, JPG, and PNG files are allowed.");
        return;
      }

      const maxSize = 20 * 1024 * 1024;
      if (file.size > maxSize) {
        setMessageWithTimer("File size should not exceed 20MB.", "error");
        setFileError("File size should not exceed 20MB.");
        return;
      }

      setFileError("");
      setUploadFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleQuoteChange = (event) => {
    const newQuote = event.target.value.slice(0, 150);
    setQuote(newQuote);
  };

  const handleUpload = async () => {
    if (!user) {
      setMessageWithTimer("Please log in to upload a photo.", "error");
      return;
    }

    if (uploadFile && quote) {
      setIsUploading(true);
      setUploadProgress(0);
      try {
        const result = await UploadService.uploadContestImage(
          uploadFile,
          quote,
          (progress) => {
            setUploadProgress(progress);
          },
        );
        setPreviewImage(null);
        setUploadFile(null);
        setQuote("");
        setMessageWithTimer(
          "Your photo and quote have been successfully uploaded!",
          "success",
        );
        setHasSubmitted(true);
      } catch (error) {
        console.error("Error uploading image:", error);
        if (error.message.includes("already submitted")) {
          setMessageWithTimer(
            "You have already uploaded a photo for this contest.",
            "error",
          );
        } else {
          setMessageWithTimer(
            error.message ||
              "There was an error uploading your submission. Please try again.",
            "error",
          );
        }
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    } else {
      setMessageWithTimer("Please select a file and enter a quote.", "error");
    }
  };

  const handleCancel = () => {
    setPreviewImage(null);
    setUploadFile(null);
    setQuote("");
    setMessageWithTimer("Upload cancelled.", "info");
  };

  return (
    <div className="mb-4 flex flex-col items-center w-full max-w-2xl mx-auto px-4 text-white">
      <style>{styles}</style>

      {message && (
        <div
          className={`fixed top-4 right-0 mb-4 p-3 rounded-l-lg w-64 ${
            messageType === "success"
              ? "bg-gradient-to-r from-[#6528d7] to-[#b00bef]"
              : messageType === "error"
                ? "bg-gradient-to-r from-red-600 to-red-800"
                : "bg-gradient-to-r from-[#6528d7] to-[#b00bef]"
          } text-white border border-solid ${
            messageType === "success"
              ? "border-[#b00bef]"
              : messageType === "error"
                ? "border-red-500"
                : "border-[#b00bef]"
          } text-center transition-all duration-300 ease-in-out transform translate-x-0 shadow-md z-50`}
          style={{
            animation: `${message ? "slideIn" : "slideOut"} 0.3s ease-in-out forwards`,
          }}
        >
          <p className="font-semibold">{message}</p>
        </div>
      )}

      {hasSubmitted ? (
        <div>
          <p>You have submitted successfully.</p>
        </div>
      ) : (
        <label className="inline-block mb-6 cursor-pointer bg-[#171717] border-2 border-[#6528d7] text-white py-2 px-3 rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 text-center font-semibold text-sm flex items-center justify-center space-x-2 min-w-[180px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Upload Photo</span>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
          />
        </label>
      )}

      {fileError && <p className="text-red-500 mt-2">{fileError}</p>}

      {previewImage && (
        <div className="w-full mt-4 flex flex-col items-center">
          <div className="w-full max-w-md mb-6">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>

          <div className="w-full mb-6 relative">
            <textarea
              value={quote}
              onChange={handleQuoteChange}
              placeholder="Enter your inspiring quote here..."
              className="w-full p-4 border-2 border-[#6528d7] rounded-lg focus:border-[#b00bef] focus:ring focus:ring-[#b00bef] focus:ring-opacity-50 transition duration-300 ease-in-out resize-none text-gray-200 text-lg bg-[#171717]"
              rows="4"
              maxLength={150}
            />
            <div className="absolute bottom-3 right-3 text-gray-400 text-sm">
              {quote.length}/150
            </div>
          </div>

          {!isUploading && (
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full justify-center">
              <button
                onClick={handleUpload}
                className="bg-gradient-to-r from-[#6528d7] to-[#b00bef] text-white py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#b00bef] focus:ring-opacity-50 shadow-lg hover:shadow-xl font-bold text-base w-full sm:w-auto"
              >
                Submit Entry
              </button>
              <button
                onClick={handleCancel}
                className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl font-bold text-base w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {isUploading && (
        <div className="w-full mt-6">
          <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#6528d7] to-[#b00bef] h-4 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-center mt-2 font-semibold text-gray-300 text-lg">
            {Math.round(uploadProgress)}% Uploaded
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadComponent;
