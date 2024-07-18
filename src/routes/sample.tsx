import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '../components/AppBar';

function About() {
  console.log(window.ipcRenderer);

  return (
    <div className="flex flex-col h-screen">
      {window.Main && (
        <div className="flex-none">
          <AppBar />
        </div>
      )}
      <div className="flex-auto">
        <div className=" flex flex-col justify-center items-center h-full bg-gray-800 space-y-4">
          <Link className="p-3 text-white bg-teal-700" to={'/'}>
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;
