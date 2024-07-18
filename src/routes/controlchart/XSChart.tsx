import { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { std } from 'mathjs';
import { Column, DataSheetGrid, keyColumn, floatColumn } from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';
import { DataSheetGridRef, Operation } from 'react-datasheet-grid/dist/types';
import { useLocation } from 'react-router-dom';
import { table } from '../../data';
import React from 'react';
import AppBar from '../../components/AppBar';
import ControlChart from '../../components/ControlChart';
import LoadingPage from '../../components/LoadingPage';
type n = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type Row = {
  [key: string]: number | null;
};

enum ActiveTab {
  DATA,
  CONTROL_CHART
}
type StdGraphData = {
  std: number[];
  ucl: number[];
  lcl: number[];
  cl: number[];
};
type XBarGraphData = {
  mean: number[];
  ucl: number[];
  lcl: number[];
  cl: number[];
};
interface Props {}
const XSChart: React.FC<Props> = () => {
  const location = useLocation();
  const { sampleSize, sampleNumber, date, folderLocation, chartType, unit, fileName } = location.state;

  const ref = useRef<DataSheetGridRef>(null);
  const [xbargraphdata, setxbargraphdata] = useState<XBarGraphData>();
  const [stdgraphdata, setstdgraphdata] = useState<StdGraphData>();
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.DATA);
  const [data, setData] = useState<Row[]>([...location.state.data]);
  const [loading, setLoading] = useState(true);
  const Keys = new Array(sampleSize).fill('').map((val, index) => {
    return `M${index}`;
  });

  const columns: Column<Row>[] = new Array(sampleSize).fill('').map((col, index) => {
    return {
      ...keyColumn<Row, string>(Keys[index], floatColumn),
      title: `M${index}`
    };
  });
  const calculateMean = (rows: Row[]): number[] => {
    const means = [];
    for (let row of rows) {
      let sum = 0;
      for (let key in row) {
        sum += row[key]! as number;
      }
      means.push(sum / sampleSize);
    }
    return means;
  };

  const calculateStd = (rows: Row[]): number[] => {
    const stds: number[] = [];
    for (let row of rows) {
      let values: number[] = [];
      for (let key in row) {
        values.push(row[key]!);
      }
      stds.push(std([...values], 'unbiased'));
    }
    return stds;
  };
  const getSum = (arr: number[]) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }

    return sum;
  };
  const roundToTwoDigitDecimal = (num: number): number => {
    return Math.round(num * 100) / 100;
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
    const meanData: number[] = calculateMean(data);
    const stdData: number[] = calculateStd(data);

    let xDoubleBar = getSum(meanData) / data.length;
    let sBar = getSum(stdData) / data.length;

    let xBarUCL = roundToTwoDigitDecimal(xDoubleBar + table['A3'][sampleSize as n] * sBar);
    let xBarLCL = roundToTwoDigitDecimal(xDoubleBar - table['A3'][sampleSize as n] * sBar);
    let xBarData: XBarGraphData = { lcl: [], mean: [], ucl: [], cl: [] };
    for (let i = 0; i < data.length; i++) {
      xBarData.mean.push(roundToTwoDigitDecimal(meanData[i]));
      xBarData.ucl.push(roundToTwoDigitDecimal(xBarUCL));
      xBarData.lcl.push(roundToTwoDigitDecimal(xBarLCL));
      xBarData.cl.push(roundToTwoDigitDecimal(xDoubleBar));
    }
    setxbargraphdata(xBarData);

    let stdUCL = roundToTwoDigitDecimal(table['D4'][sampleSize as n] * sBar);
    let stdLCL = roundToTwoDigitDecimal(table['D3'][sampleSize as n] * sBar);
    let stdGraphData: StdGraphData = { lcl: [], std: [], ucl: [], cl: [] };

    for (let i = 0; i < data.length; i++) {
      stdGraphData.std.push(roundToTwoDigitDecimal(stdData[i]));
      stdGraphData.ucl.push(roundToTwoDigitDecimal(stdUCL));
      stdGraphData.lcl.push(roundToTwoDigitDecimal(stdLCL));
      stdGraphData.cl.push(roundToTwoDigitDecimal(sBar));
    }
    setstdgraphdata(stdGraphData);

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
      sampleSize,
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
                onChange={(value: Row[], operations: Operation[]) => {
                  setData((rows: Row[]) => value);
                }}
                columns={columns}
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto m-8 w-full h-[300px]">
              <div className="my-10">
                <ControlChart
                  chartType="Xbar Chart"
                  cl={xbargraphdata?.cl!}
                  ucl={xbargraphdata?.ucl!}
                  lcl={xbargraphdata?.lcl!}
                  data={xbargraphdata?.mean!}
                />
                <ControlChart
                  chartType="S Chart"
                  cl={stdgraphdata?.cl!}
                  ucl={stdgraphdata?.ucl!}
                  lcl={stdgraphdata?.lcl!}
                  data={stdgraphdata?.std!}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default XSChart;
