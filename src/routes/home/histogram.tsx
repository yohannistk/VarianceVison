import React from 'react';
import SearchBar from '../../components/ui/SearchBar';
import { ControlChartFileData } from '../../types';
import { useNavigate } from 'react-router-dom';
import FileList from '../../components/FileList';

const Histogram = () => {
  const navigate = useNavigate();
  const handleOpenFile = async () => {
    const fileData: ControlChartFileData = await window.Main.handleOpenFile();
    navigate(`${fileData.chartType}`, {
      state: { ...fileData }
    });
  };
  return (
    <div className="max-w-6xl flex-1 flex flex-col relative">
      <div className="flex flex-col fixed top-9 right-0 left-64 bg-white">
        <div className="flex px-6 pt-5 justify-between">
          <h1 className="text-gray-800 font-medium text-3xl">Histogram</h1>
          <div>
            <button
              onClick={handleOpenFile}
              className="px-4 mr-3 inline-block py-2 bg-gray-500 rounded text-white font-medium border-0 outline-none "
            >
              Open
            </button>
            <button
              onClick={() => {
                navigate('/newproject');
              }}
              className="px-4 inline-block py-2 hover:bg-blue-600 transition-colors bg-blue-500 rounded text-white font-medium border-0 outline-none "
            >
              New Project
            </button>
          </div>
        </div>
        <div className="mt-6 px-6 flex justify-end">
          <SearchBar />
        </div>
      </div>
      <FileList />
    </div>
  );
};

export default Histogram;
