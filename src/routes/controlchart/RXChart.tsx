import { useEffect, useRef, useState } from 'react';
import { Column, DataSheetGrid, keyColumn, floatColumn } from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';
import { DataSheetGridRef, Operation } from 'react-datasheet-grid/dist/types';
import { useLocation } from 'react-router-dom';
import { table } from '../../data';
import React from 'react';
import AppBar from '../../components/AppBar';
import { Bar, Line, Chart as ChartJS } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import ControlChart from '../../components/ControlChart';
import LoadingPage from '../../components/LoadingPage';

Chart.register(CategoryScale);
type n = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type Row = {
  [key: string]: number | null;
};

type RangeGraphData = {
  range: number[];
  ucl: number[];
  lcl: number[];
  cl: number[];
};
type MeanGraphData = {
  mean: number[];
  ucl: number[];
  lcl: number[];
  cl: number[];
};

enum ActiveTab {
  DATA,
  CONTROL_CHART,
  MODIFIED
}

interface Props {}
const RxChart: React.FC<Props> = () => {
  const location = useLocation();
  const { sampleSize, sampleNumber, date, folderLocation, chartType, unit, fileName } = location.state;
  const ref = useRef<DataSheetGridRef>(null);
  const [meangraphdata, setmeangraphdata] = useState<MeanGraphData>();
  const [rangegraphdata, setrangegraphdata] = useState<RangeGraphData>();
  const [modifiedmeangraphdata, setmodifiedmeangraphdata] = useState<MeanGraphData>();
  const [modifiedrangegraphdata, setmodifiedrangegraphdata] = useState<RangeGraphData>();
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.DATA);
  const [data, setData] = useState<Row[]>([...location.state.data]);
  const [meanout, setMeanOut] = useState<number[]>([]);
  const [rangeout, setRangeOut] = useState<number[]>([]);
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
  function arrayMax(array: number[]) {
    return array.reduce((a, b) => Math.max(a, b));
  }
  function arrayMin(array: number[]) {
    return array.reduce((a, b) => Math.min(a, b));
  }
  const calculateRange = (rows: Row[]): number[] => {
    const ranges: number[] = [];
    for (let row of rows) {
      let values = [];
      for (let key in row) {
        values.push(row[key]);
      }

      ranges.push(arrayMax(values! as number[]) - arrayMin(values! as number[]));
    }
    return ranges;
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

  const setGraphData = (data: Row[]) => {
    if (checkNullValue(data)) {
      console.log(checkNullValue(data));
      return;
    }
    const meanData: number[] = calculateMean(data);
    const rangeData: number[] = calculateRange(data);

    let xDoubleBar = getSum(meanData) / data.length;
    let rDoubleBar = getSum(rangeData) / data.length;

    let meanUCL = roundToTwoDigitDecimal(xDoubleBar + table['A2'][sampleSize as n] * rDoubleBar);
    let meanLCL = roundToTwoDigitDecimal(xDoubleBar - table['A2'][sampleSize as n] * rDoubleBar);

    let dataMean: MeanGraphData = { lcl: [], mean: [], ucl: [], cl: [] };

    for (let i = 0; i < data.length; i++) {
      dataMean.mean.push(roundToTwoDigitDecimal(meanData[i]));
      dataMean.ucl.push(roundToTwoDigitDecimal(meanUCL));
      dataMean.lcl.push(roundToTwoDigitDecimal(meanLCL));
      dataMean.cl.push(roundToTwoDigitDecimal(xDoubleBar));
    }
    setmeangraphdata(dataMean);

    const rangeULC = roundToTwoDigitDecimal(table['D4'][sampleSize as n] * rDoubleBar);
    const rangeLCL = roundToTwoDigitDecimal(table['D3'][sampleSize as n] * rDoubleBar);

    let dataRange: RangeGraphData = { lcl: [], range: [], ucl: [], cl: [] };
    for (let i = 0; i < data.length; i++) {
      dataRange.range.push(roundToTwoDigitDecimal(rangeData[i]));
      dataRange.ucl.push(roundToTwoDigitDecimal(rangeULC));
      dataRange.lcl.push(roundToTwoDigitDecimal(rangeLCL));
      dataRange.cl.push(roundToTwoDigitDecimal(rDoubleBar));
    }
    setrangegraphdata(dataRange);
    setLoading(false);
  };

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
    setGraphData(data);
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
          ) : activeTab == ActiveTab.CONTROL_CHART ? (
            <div className="max-w-4xl mx-auto m-8 w-full h-[300px]">
              <div className="my-10">
                <ControlChart
                  chartType="Xbar Chart"
                  ucl={meangraphdata?.ucl!}
                  lcl={meangraphdata?.lcl!}
                  cl={meangraphdata?.cl!}
                  data={meangraphdata?.mean!}
                />

                <ControlChart
                  chartType="R Chart"
                  ucl={rangegraphdata?.ucl!}
                  lcl={rangegraphdata?.lcl!}
                  cl={rangegraphdata?.cl!}
                  data={rangegraphdata?.range!}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default RxChart;
