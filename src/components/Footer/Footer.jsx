import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-8" style={{ backgroundColor: '#031320' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">About Us</h4>
            <p className="text-gray-400">
              We are a college society that hosts various photography competitions. Join us and showcase your photography skills!
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Quick Links</h4>
            <ul>
              <li className="mb-2"><NavLink to={"/"} className="text-gray-400 hover:text-white">Home</NavLink></li>
              <li className="mb-2"><NavLink to={"/contest"} className="text-gray-400 hover:text-white">Contest</NavLink></li>
              <li className="mb-2"><NavLink to={"/gallery"} className="text-gray-400 hover:text-white">Gallery</NavLink></li>
              <li className="mb-2"><NavLink to={"/"} className="text-gray-400 hover:text-white">Contact Us</NavLink></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Contact Us</h4>
            <p className="text-gray-400 mb-2">Email: ab@gmail.com</p>
            <p className="text-gray-400 mb-2">Phone: +123 456 7890</p>
            <p className="text-gray-400">Address: Bawana Rd, Shahbad Daulatpur Village, Rohini</p>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500">
          &copy; 2024 DTU Pixels. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
