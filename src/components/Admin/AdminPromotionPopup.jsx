import React, { useState } from 'react';
import roleService from "../../firebase/roleAssigning/RoleService";
import MessagePopup from '../contests/voting/MessagePopup.jsx';

function AdminPromotionPopup({ isOpen, onClose }) {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    if (!userId.trim()) {
      setError("Error: User ID cannot be empty");
      return;
    }

    try {
      await roleService.setRole(userId, "admin");
      setMessage("User promoted to admin successfully");
      setTimeout(() => {
        onClose();
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center px-4">
      <div className="relative mx-auto p-8 border w-full max-w-md shadow-lg rounded-lg bg-white">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Promote User to Admin</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 mb-2 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-150 ease-in-out"
            placeholder="Enter User ID"
          />
          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-150 ease-in-out"
            >
              Promote
            </button>
          </div>
        </form>
      </div>
      <MessagePopup message={message} setMessage={setMessage} />
    </div>
  );
}

export default AdminPromotionPopup;
