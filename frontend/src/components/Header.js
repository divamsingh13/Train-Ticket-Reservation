import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/train-logo.png'; // Make sure the path is correct

const Header = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); // Update the state to trigger re-render
  };

  if (user) {
    const firstName = user.fullName.split(" ")[0];

    return (
      // Header when logged in
      <div className="flex justify-between items-center space-x-4 mx-4 mt-2 mb-2 bg-gray-800 border-b-4 border-gray-900 py-2 rounded-lg">
        <div className="flex items-center space-x-4 ml-4"> {/* Added margin-left */}
          <Link to="/">
            <img src={logo} alt="Train Logo" className="h-8 ml-4" /> {/* Added margin-left */}
          </Link>
          <Link
            to="/"
            className="text-white hover:text-yellow-300 px-4 py-2 border-2 border-yellow-400 rounded-full transition duration-300 focus:outline-none bg-gray-900"
          >
            Home
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-white hover:text-yellow-300 px-4 py-2 border-2 border-yellow-400 rounded-full transition duration-300 focus:outline-none bg-gray-900 cursor-default max-w-[8rem] truncate">
            {firstName}
          </span>
          <span
            onClick={handleLogout}
            className="text-white hover:text-yellow-300 px-4 py-2 border-2 border-red-500 rounded-full transition duration-300 focus:outline-none bg-red-600 cursor-pointer"
          >
            Log Out
          </span>
        </div>
      </div>
    );
  }

  // Header Buttons when not logged in
  return (
    <div className="flex justify-between items-center space-x-4 mx-4 mt-2 mb-2 bg-gray-800 border-b-4 border-gray-900 py-2 rounded-lg">
      <div className="flex items-center space-x-4 ml-4"> {/* Added margin-left */}
        <Link to="/">
          <img src={logo} alt="Train Logo" className="h-8 ml-4" /> {/* Added margin-left */}
        </Link>
        <Link
          to="/"
          className="text-white hover:text-yellow-300 px-4 py-2 border-2 border-yellow-400 rounded-full transition duration-300 focus:outline-none bg-gray-900"
        >
          Home
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          to="/login"
          className="text-white hover:text-yellow-300 px-4 py-2 border-2 border-yellow-400 rounded-full transition duration-300 focus:outline-none bg-gray-900"
        >
          Log In
        </Link>
        <Link
          to="/signup"
          className="text-white hover:text-yellow-300 px-4 py-2 border-2 border-yellow-400 rounded-full transition duration-300 focus:outline-none bg-gray-900"
        >
          Sign Up
        </Link>
        <Link
          to="/contact-us"
          className="text-white hover:text-yellow-300 px-4 py-2 border-2 border-yellow-400 rounded-full transition duration-300 focus:outline-none bg-gray-900"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default Header;
