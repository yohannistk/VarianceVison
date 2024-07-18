import React, { useEffect, useState } from 'react';
import AppBar from './components/AppBar';
import SideBar from './components/SideBar';

import { Outlet } from 'react-router-dom';
import { RecentFilesData } from './types';

function App() {
  const [recentFilesData, setRecentFilesData] = useState<RecentFilesData>();
  const [loading, setLoading] = useState(true);
  async function loader() {
    const recentFilesData = window.Main.getFiles();
    setRecentFilesData(recentFilesData);
  }

  useEffect(() => {
    loader();
    setLoading(false);
  }, []);
  return (
    <>
      {window.Main && (
        <div className="flex-none  fixed left-0 bg-white top-0 right-0  z-40">
          <AppBar />
        </div>
      )}

      <SideBar />
      <div className="p-4 sm:ml-64 ">{loading ? <h2>Loading...</h2> : <Outlet context={recentFilesData} />}</div>
    </>
  );
}

export default App;
