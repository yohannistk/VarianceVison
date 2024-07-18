import React, { useEffect, useState } from 'react';

const SearchBar = () => {
  const [value, setValue] = useState('');
  const [showClose, setShowClose] = useState(false);
  const [foucused, setFocused] = useState(false);
  const [mouseEntered, setMouseEntered] = useState(false);
  useEffect(() => {
    if (value.length > 0) {
      setShowClose(true);
    } else {
      setShowClose(false);
    }
  }, [value]);
  return (
    <div
      className={`flex w-60 relative transition-colors items-center text-gray-900 gap-2 rounded ${
        foucused || mouseEntered ? 'bg-gray-200' : 'bg-transparent'
      } border focus:ring-2  border-gray-200 p-2`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={3}
        stroke="currentColor"
        className="w-4 h-4 text-gray-300"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>

      <input
        className="flex-1 text-gray-800 font-medium bg-transparent text-sm outline-none border-none"
        placeholder="Search..."
        type="text"
        value={value}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        onMouseEnter={() => {
          setMouseEntered(true);
        }}
        onMouseLeave={() => {
          setMouseEntered(false);
        }}
        onChange={(e) => setValue(e.target.value)}
      />
      {showClose && (
        <button
          className="absolute text-gray-700 p-[2px] rounded-full bg-gray-400 flex justify-center items-center right-2"
          onClick={() => {
            setValue('');
            setShowClose(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
