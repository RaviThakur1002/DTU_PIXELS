import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MessagePopup = ({ message, setMessage }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-md z-50"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessagePopup;
