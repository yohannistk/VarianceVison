import { useEffect, useRef, useState } from 'react';
import { Column, DataSheetGrid, keyColumn, floatColumn } from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';
import { DataSheetGridRef, Operation } from 'react-datasheet-grid/dist/types';
import { useLocation } from 'react-router-dom';
import React from 'react';
import AppBar from '../../components/AppBar';
import ControlChart from '../../components/ControlChart';
import { round } from 'mathjs';
import LoadingPage from '../../components/LoadingPage';

type Row = {
  [key: string]: number | null;
};

enum ActiveTab {
  DATA,
  CONTROL_CHART
}

type CChartGraphData = {
  c: number[];
  ucl: number[];
  lcl: number[];
  cl: number[];
};
interface Props {}
const CChart: React.FC<Props> = () => {
  const location = useLocation();
  const { sampleNumber, date, folderLocation, chartType, unit, fileName } = location.state;

  const ref = useRef<DataSheetGridRef>(null);
  const [cchartdata, setcchartdata] = useState<CChartGraphData>();
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.DATA);
  const [data, setData] = useState<Row[]>([...location.state.data]);
  const [loading, setLoading] = useState(true);
  const colonekey = 'Sample Size';
  const coltwokey = 'Number of defect in the sample';

  const columns: Column<Row>[] = [
    {
      ...keyColumn<Row, string>(colonekey, floatColumn),
      title: colonekey
    },
    {
      ...keyColumn<Row, string>(coltwokey, floatColumn),
      title: coltwokey
    }
  ];

  const getSum = (data: Row[], key: 'Number of defect in the sample') => {
    let sum = 0;
    for (let row of data) {
      sum += row[key]!;
    }
    return sum;
  };

  const checkNullValue = (data: Row[]): boolean => {
    let nullValue = false;
    for (let row of data) {
      for (let key in row) {
        if (typeof row[key] != 'number') {
          nullValue = true;
        }
      }
    }
    return nullValue;
  };
  const setGraphData = () => {
    if (checkNullValue(data)) {
      return;
    }

    const sumOfDefecte = getSum(data, 'Number of defect in the sample');

    const cBar: number = round(sumOfDefecte / data.length, 4);

    let cchart: CChartGraphData = { lcl: [], c: [], ucl: [], cl: [] };
    for (let i = 0; i < data.length; i++) {
      cchart.c.push(data[i]['Number of defect in the sample']!);
      cchart.ucl.push(cBar + 3 * Math.sqrt(cBar));
      cchart.lcl.push(cBar - 3 * Math.sqrt(cBar) < 0 ? 0 : cBar - 3 * Math.sqrt(cBar));
      cchart.cl.push(cBar);
    }
    setcchartdata(cchart);

    setLoading(false);
  };

  useEffect(() => {
    setGraphData();
  }, []);

  useEffect(() => {
    window.Main.handleSaveFile({
      data,
      date,
      sampleNumber,
      chartType,
      folderLocation,
      unit,
      fileName,
      fileType: 'ControlChart'
    } as any);
    setGraphData();
  }, [data]);

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
                Control Charts
              </button>
            </li>
          </ul>
          {activeTab == ActiveTab.DATA ? (
            <div className="max-w-4xl mx-auto">
              <DataSheetGrid
                ref={ref}
                className=""
                value={data}
                onChange={(value: Row[], _: Operation[]) => {
                  setData((_: Row[]) => value);
                }}
                columns={columns}
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto m-8 w-full h-[300px]">
              <div className="my-10">
                <ControlChart
                  chartType="C Chart"
                  cl={cchartdata?.cl!}
                  ucl={cchartdata?.ucl!}
                  lcl={cchartdata?.lcl!}
                  data={cchartdata?.c!}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CChart;
