import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const sideBarData = [
  {
    title: 'Control Chart',
    path: '',
    svg: (
      <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Interface / Chart_Line">
          <path
            id="Vector"
            d="M3 15.0002V16.8C3 17.9201 3 18.4798 3.21799 18.9076C3.40973 19.2839 3.71547 19.5905 4.0918 19.7822C4.5192 20 5.07899 20 6.19691 20H21.0002M3 15.0002V5M3 15.0002L6.8534 11.7891L6.85658 11.7865C7.55366 11.2056 7.90288 10.9146 8.28154 10.7964C8.72887 10.6567 9.21071 10.6788 9.64355 10.8584C10.0105 11.0106 10.3323 11.3324 10.9758 11.9759L10.9822 11.9823C11.6357 12.6358 11.9633 12.9635 12.3362 13.1153C12.7774 13.2951 13.2685 13.3106 13.7207 13.1606C14.1041 13.0334 14.4542 12.7275 15.1543 12.115L21 7"
            stroke="#FFFFFF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </svg>
    )
  },
  {
    title: 'Pareto Chart',
    path: 'paretoChart',
    svg: (
      <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Interface / Chart_Bar_Vertical_01">
          <path
            id="Vector"
            d="M9 11V20M9 11H4.59961C4.03956 11 3.75981 11 3.5459 11.109C3.35774 11.2049 3.20487 11.3577 3.10899 11.5459C3 11.7598 3 12.04 3 12.6001V20H9M9 11V5.6001C9 5.04004 9 4.75981 9.10899 4.5459C9.20487 4.35774 9.35774 4.20487 9.5459 4.10899C9.75981 4 10.0396 4 10.5996 4H13.3996C13.9597 4 14.2403 4 14.4542 4.10899C14.6423 4.20487 14.7948 4.35774 14.8906 4.5459C14.9996 4.75981 15 5.04005 15 5.6001V8M9 20H15M15 20L21 20.0001V9.6001C21 9.04005 20.9996 8.75981 20.8906 8.5459C20.7948 8.35774 20.6429 8.20487 20.4548 8.10899C20.2409 8 19.9601 8 19.4 8H15M15 20V8"
            stroke="#FFFFFF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </svg>
    )
  }
  // {
  //   title: 'Histogram',
  //   path: 'histogram',
  //   svg: (
  //     <svg
  //       aria-hidden="true"
  //       className="flex-shrink-0 w-6 h-6 text-gray-100 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
  //       fill="currentColor"
  //       viewBox="0 0 20 20"
  //       xmlns="http://www.w3.org/2000/svg"
  //     >
  //       <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
  //       <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
  //     </svg>
  //   )
  // },
  // {
  //   title: 'CauseAndEffect',
  //   path: 'causeAndEffect',
  //   svg: (
  //     <svg
  //       aria-hidden="true"
  //       className="flex-shrink-0 w-6 h-6 text-gray-100 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
  //       fill="currentColor"
  //       viewBox="0 0 20 20"
  //       xmlns="http://www.w3.org/2000/svg"
  //     >
  //       <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
  //     </svg>
  //   )
  // },
  // {
  //   title: 'CheckSheet',
  //   path: 'checkCheet',
  //   svg: (
  //     <svg
  //       aria-hidden="true"
  //       className="flex-shrink-0 w-6 h-6 text-gray-200 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
  //       fill="currentColor"
  //       viewBox="0 0 20 20"
  //       xmlns="http://www.w3.org/2000/svg"
  //     >
  //       <path
  //         fillRule="evenodd"
  //         d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
  //         clipRule="evenodd"
  //       ></path>
  //     </svg>
  //   )
  // },
  // {
  //   title: 'FlowChart',
  //   path: 'flowchart',
  //   svg: (
  //     <svg
  //       aria-hidden="true"
  //       className="flex-shrink-0 w-6 h-6 text-gray-200 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
  //       fill="currentColor"
  //       viewBox="0 0 20 20"
  //       xmlns="http://www.w3.org/2000/svg"
  //     >
  //       <path
  //         fillRule="evenodd"
  //         d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
  //         clipRule="evenodd"
  //       ></path>
  //     </svg>
  //   )
  // }
];

const SideBar = () => {
  const [active, setActive] = useState(0);
  return (
    <aside
      id="cta-button-sidebar"
      className="fixed top-0 left-0 z-30 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-blue-500 dark:bg-gray-800">
        <ul className="space-y-2 mt-20 font-medium">
          {sideBarData.map((item, index) => {
            return (
              <li key={index}>
                <Link
                  onClick={(_) => {
                    setActive(index);
                  }}
                  to={item.path}
                  className={`flex items-center p-2 transition-colors text-white ${
                    index == active ? 'bg-blue-300' : ''
                  } rounded-lg hover:bg-blue-300 `}
                >
                  {item.svg}
                  <span className="flex-1 ml-3 whitespace-nowrap">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default SideBar;
