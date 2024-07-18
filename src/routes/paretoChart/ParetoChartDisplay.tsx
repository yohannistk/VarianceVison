import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppBar from '../../components/AppBar';
import { DataSheetGrid, keyColumn, floatColumn, DataSheetGridRef, Column, textColumn } from 'react-datasheet-grid';
import { Operation } from 'react-datasheet-grid/dist/types';
import { Chart } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import { Chart as ChartJS } from 'chart.js';

import LoadingPage from '../../components/LoadingPage';
const plugin: any = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart: any, args: any, options: any) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#99ffff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};
enum ActiveTab {
  DATA,
  CONTROL_CHART
}
ChartJS.register(CategoryScale);
type Row = {
  [key: string]: null | string | any;
};
type ParetoData = {
  frequency: number[];
  defect: string[];
  totalPersent: number[];
  cumulative: number[];
};
const ParetoChartDisplay = () => {
  const location = useLocation();
  const [data, setData] = useState<any[]>(location.state.data);
  const [updateddata, setUpdatedData] = useState<any[]>([]);
  const [paretoData, setParetoData] = useState<ParetoData>();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.DATA);
  const ref = useRef<DataSheetGridRef>(null);
  const chartRef = useRef<ChartJS>(null);

  const saveChartImage = () => {
    const dataURL = chartRef.current!.toBase64Image();
    const link = document.createElement('a');
    link.download = `pareto-${Date.now()}`;
    link.href = dataURL;
    link.click();
  };
  const columns: Column<Row>[] = [
    { ...keyColumn<any, string>('Defect', textColumn), title: 'Defect' },
    { ...keyColumn<Row, string>('Frequency', floatColumn), title: 'Frequency' },
    {
      ...keyColumn<any, string>('% Of Total', floatColumn),
      title: '% Of Total',
      disabled: true
    },
    {
      ...keyColumn<any, string>('Cumulative %', floatColumn),
      title: 'Cumulative %',
      disabled: true
    }
  ];
  const calculateSum = (): number => {
    let sum = 0;
    for (let row of data) {
      let value = row['Frequency'];
      if (typeof value == 'number') {
        sum += value;
      }
    }
    return sum;
  };
  const updatePersentSum = () => {
    const sum = calculateSum();
    const clone = data.slice();
    for (let row of clone) {
      row['% Of Total'] = (row['Frequency'] * 100) / sum;
    }
    setUpdatedData((prev) => clone);
  };
  const updateCumulativeSum = () => {
    const clone = data.slice();

    for (let i = 0; i < clone.length; i++) {
      if (i === 0) {
        clone[i]['Cumulative %'] = clone[i]['% Of Total'];
      } else {
        clone[i]['Cumulative %'] = clone[i]['% Of Total'] + clone[i - 1]['Cumulative %'];
      }
    }

    setUpdatedData((prev) => clone);
  };
  const checkNullValue = (data: Row[]): boolean => {
    let nullValue = false;
    for (let row of data) {
      for (let key in row) {
        if (typeof row['Defect'] != 'string' || typeof row['Frequency'] != 'number') {
          nullValue = true;
        }
      }
    }
    return nullValue;
  };
  const updDateParetoChartInfo = () => {
    if (checkNullValue(data)) {
      return;
    }
    updatePersentSum();
    updateCumulativeSum();
  };

  useEffect(() => {
    updDateParetoChartInfo();
  }, [data]);

  useEffect(() => {
    setParetoData({
      cumulative: updateddata.map((v, i) => v['Cumulative %']),
      defect: updateddata.map((v, i) => v['Defect']),
      frequency: updateddata.map((v, i) => v['Frequency']),
      totalPersent: updateddata.map((v, i) => v['% Of Total'])
    });
    setLoading(false);
  }, [updateddata]);

  return loading ? (
    <LoadingPage />
  ) : (
    <div className="flex flex-col h-screen">
      {window.Main && (
        <div className="flex-none">
          <AppBar />
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 ">
          <ul className="hidden mb-4 max-w-xl mx-auto text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
            <li className="w-full">
              <button
                onClick={() => setActiveTab(ActiveTab.DATA)}
                className={`inline-block w-full p-4 text-gray-900 ${
                  activeTab == ActiveTab.DATA ? 'bg-gray-100' : ''
                } rounded-l-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white`}
                aria-current="page"
              >
                Data
              </button>
            </li>
            <li className="w-full">
              <button
                onClick={() => setActiveTab(ActiveTab.CONTROL_CHART)}
                className={`inline-block w-full p-4 ${
                  activeTab == ActiveTab.CONTROL_CHART ? 'bg-gray-100' : ''
                }  hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
              >
                Pareto Chart
              </button>
            </li>
          </ul>
          {activeTab == ActiveTab.DATA ? (
            <div className="max-w-4xl mx-auto">
              <DataSheetGrid
                ref={ref}
                className=""
                value={data}
                onChange={(value: any[], operations: Operation[]) => {
                  setData((rows: any[]) => value);
                }}
                columns={columns}
              />
            </div>
          ) : (
            <div className="max-w-4xl border mx-auto m-8 w-full h-[300px]">
              <div className="relative">
                <button className="absolute top-1 right-1 " onClick={saveChartImage}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path
                      fillRule="evenodd"
                      d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <Chart
                  ref={chartRef}
                  plugins={[plugin]}
                  className="w-full bg-white p-2 "
                  type="bar"
                  data={{
                    labels: paretoData?.defect,
                    datasets: [
                      {
                        label: 'Cumulative Persent',
                        type: 'line',
                        backgroundColor: 'rgba(100,99,132,0.2)',
                        borderColor: 'rgba(100,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(100,99,132,0.4)',
                        hoverBorderColor: 'rgba(100,99,132,1)',
                        data: paretoData?.cumulative,
                        yAxisID: 'percentageAxis'
                      },
                      {
                        label: 'Frequency',
                        type: 'bar',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: paretoData?.frequency
                      }
                    ]
                  }}
                  options={{
                    backgroundColor: '#fff',
                    plugins: {
                      customCanvasBackgroundColor: {
                        color: '#fff'
                      }
                    } as any,
                    responsive: true,
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Defects'
                        }
                      },
                      y: {
                        beginAtZero: true,
                        grid: {
                          display: false
                        },
                        title: {
                          display: true,
                          text: 'Persent'
                        }
                      },
                      percentageAxis: {
                        type: 'linear',
                        position: 'right',
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        ticks: {
                          callback(tickValue, index, ticks) {
                            return tickValue + '%';
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParetoChartDisplay;
