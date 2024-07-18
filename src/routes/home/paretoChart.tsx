import React, { useState } from 'react';
import SearchBar from '../../components/ui/SearchBar';
import { ControlChartFileData, ParetoChartFileData, RecentFilesData } from '../../types';
import { useNavigate, useOutletContext } from 'react-router-dom';
import FileList from '../../components/FileList';
import NewParetoChartModal from '../../components/modal/NewParetoChartModal';
import ErrorModal from '../../components/modal/ErrorModal';

const ParetoChart = () => {
  const navigate = useNavigate();
  const recentFilesData: RecentFilesData = useOutletContext();
  const [isOpen, setIsOpen] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  recentFilesData.recentParetoChart.sort((f1, f2) => Date.parse(f1.lastModified) - Date.parse(f2.lastModified));

  const handleOpenFile = async () => {
    const fileData: ParetoChartFileData = await window.Main.handleOpenFile();
    if (Object.keys(fileData).length != 0) {
      if (fileData.fileType == 'ParetoChart') {
        navigate(`/paretoChartDisplay`, {
          state: {
            ...fileData
          }
        });
      } else {
        setShowErrorMessage(true);
      }
    }
  };
  return (
    <>
      <NewParetoChartModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <ErrorModal
        isOpen={showErrorMessage}
        setIsOpen={setShowErrorMessage}
        message="The selected file is not pareto chart"
      />
      <div className="flex-1 bg-white flex flex-col relative">
        <div className="flex flex-col pb-5 fixed top-9 right-0 left-64 bg-white">
          <div className="flex px-6 pt-5 justify-between">
            <h1 className="text-gray-800 font-medium text-3xl">Pareto Charts</h1>
            <div>
              <button
                onClick={handleOpenFile}
                className="px-4 mr-3 inline-block py-2 bg-gray-500 rounded text-white font-medium border-0 outline-none "
              >
                Open
              </button>
              <button
                onClick={() => {
                  setIsOpen(true);
                }}
                className="px-4 inline-block py-2 hover:bg-blue-600 transition-colors bg-blue-500 rounded text-white font-medium border-0 outline-none "
              >
                New Project
              </button>
            </div>
          </div>
          <div className="mt-7 px-6">
            <h2 className="text-black">Recent Files</h2>
          </div>
        </div>
        {recentFilesData.recentParetoChart.length == 0 ? (
          <div className="mt-40 text-center">
            <h3>No Projects Yet</h3>
          </div>
        ) : (
          <FileList recentFileData={recentFilesData.recentParetoChart} />
        )}
      </div>
    </>
  );
};

export default ParetoChart;
