import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AppBar from '../components/AppBar';
import Button from './ui/Button';

function Error() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      {window.Main && (
        <div className="flex-none">
          <AppBar />
        </div>
      )}
      <div className="flex-auto">
        <div className=" flex flex-col justify-center items-center h-full bg-gray-800 space-y-4">
          <Button
            onClick={() => {
              navigate(-1);
            }}
          >
            Forward
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Error;
