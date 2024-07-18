import React, { useState } from 'react';
import Icon from './assets/icons/Icon-Electron.png';
import { useNavigate } from 'react-router-dom';
function AppBar() {
  const [isMaximize, setMaximize] = useState(false);

  const handleToggle = () => {
    if (isMaximize) {
      setMaximize(false);
    } else {
      setMaximize(true);
    }
    window.Main.Maximize();
  };
  const navigate = useNavigate();
  return (
    <>
      <div className="h-9 flex justify-between draggable bg-gray-50">
        <div className="inline-flex self-center">
          <h2 className="px-4 undraggable cursor-pointer" onClick={() => navigate('/')}>
            VarianceVision
          </h2>
        </div>
        <div className="inline-flex ">
          <button
            onClick={window.Main.Minimize}
            className="undraggable md:px-4 w-10 grid lg:px-3 pt-1 text-[#585858]  transition-colors hover:bg-slate-200"
          >
            <span>&#8211;</span>
          </button>
          <button
            onClick={handleToggle}
            className="undraggable w-10 flex items-center justify-center text-[#585858] px-6 lg:px-5 pt-1 transition-colors hover:bg-slate-200"
          >
            <span>{isMaximize ? '\u2752' : '⃞'}</span>
          </button>
          <button
            onClick={window.Main.Close}
            className="undraggable flex items-center justify-center text-[#585858] px-4 pt-1 w-10 transition-colors hover:bg-red-600 hover:text-white"
          >
            <span>&#10005;</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default AppBar;
