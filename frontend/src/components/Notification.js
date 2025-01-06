import React from "react";

const Notification = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-5 right-5 z-50">
      <div className="bg-green-500 text-white p-4 rounded shadow-lg">
        <div className="flex justify-between items-center">
          <span>{message}</span>
          <button onClick={onClose} className="text-white ml-2">
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
