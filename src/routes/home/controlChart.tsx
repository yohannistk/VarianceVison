import React, { useEffect, useState } from 'react';
import { ControlChartFileData, RecentFilesData } from '../../types';
import { useNavigate, useOutletContext } from 'react-router-dom';
import FileList from '../../components/FileList';
import ErrorModal from '../../components/modal/ErrorModal';

const ControlChart = () => {
  const navigate = useNavigate();
  const allRecent: RecentFilesData = useOutletContext();
  const [recentControlCharts, setRecentControlCharts] = useState<any[]>(allRecent.recentControlCharts);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  recentControlCharts.sort((f1, f2) => Date.parse(f1.lastModified) - Date.parse(f2.lastModified));

  useEffect(() => {
    const clone = recentControlCharts.slice();
    clone.sort((a, b) => Date.parse(a.lastModified) - Date.parse(b.lastModified));
    setRecentControlCharts(recentControlCharts);
  }, []);
  const handleOpenFile = async () => {
    const fileData: ControlChartFileData = await window.Main.handleOpenFile();
    if (Object.keys(fileData).length != 0) {
      if (fileData.fileType == 'ControlChart') {
        navigate(`${fileData.chartType}`, {
          state: { ...fileData }
        });
      } else {
        setShowErrorMessage(true);
      }
    }
  };

  return (
    <div className=" flex-1 bg-white flex flex-col relative">
      <ErrorModal
        isOpen={showErrorMessage}
        setIsOpen={setShowErrorMessage}
        message="The selected file is not control chart"
      />
      <div className="flex flex-col pb-5 fixed top-9 right-0 left-64 bg-white">
        <div className="flex px-6 pt-5 justify-between">
          <h1 className="text-gray-800 font-medium text-3xl">Control Charts</h1>
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
              className="px-4 inline-block py-2 hover:bg-blue-400 transition-colors bg-blue-500 rounded text-white font-medium border-0 outline-none "
            >
              New Project
            </button>
          </div>
        </div>
        <div className="mt-7 px-6">
          <h2 className="text-black">Recent Files</h2>
        </div>
      </div>

      {recentControlCharts.length == 0 ? (
        <div className="mt-40 text-center">
          <h3>No Projects Yet</h3>
        </div>
      ) : (
        <FileList recentFileData={recentControlCharts} />
      )}
    </div>
  );
};

export default ControlChart;
