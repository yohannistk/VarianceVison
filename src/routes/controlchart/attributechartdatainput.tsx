import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Column, DataSheetGrid, keyColumn, floatColumn } from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';
import { DataSheetGridRef } from 'react-datasheet-grid/dist/types';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '../../components/AppBar';
import Button from '../../components/ui/Button';
type Row = {
  [key: string]: number | null;
};

interface Props {}
const AttributeDataInput: React.FC<Props> = ({}) => {
  const navigate = useNavigate();

  const ref = useRef<DataSheetGridRef>(null);
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const sampleNumber = location.state.sampleNumber;
  const chartType = location.state.chartType;
  const fileName = location.state.fileName;
  const unit = location.state.unit;
  const date = location.state.date;
  const folderLocation = location.state.folderLocation;

  const colonekey = 'Sample Size';
  const coltwokey =
    chartType == 'uchart' || chartType == 'cchart'
      ? `Number of defect in the sample`
      : `Number of defective in the sample`;

  const [columns, setColumns] = useState<Column<Row>[]>([
    {
      ...keyColumn<Row, string>(colonekey, floatColumn),
      title: colonekey
    },
    {
      ...keyColumn<Row, string>(coltwokey, floatColumn),
      title: coltwokey
    }
  ]);
  const Keys = [colonekey, coltwokey];

  // creating file
  useEffect(() => {
    window.Main.handleCreateFile(fileName, folderLocation);
  }, []);
  // saving File
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
  }, [data]);

  useEffect(() => {
    const gridData = [];
    const colkeys = [colonekey, coltwokey];
    for (let x = 0; x < sampleNumber; x++) {
      let obj: Row = {};
      for (let y = 0; y < 2; y++) {
        let key = colkeys[y];
        obj[key] = 0;
      }
      gridData.push(obj);
    }
    setData(gridData);
  }, []);

  useEffect(() => {
    window.Main.writeRecentFile({
      data,
      date,
      sampleNumber,
      chartType,
      folderLocation,
      unit,
      fileName,
      fileType: 'ControlChart'
    });
    setLoading(false);
  }, []);

  const handleChangeValue = (row: number, col: number, newData: any) => {
    const newState = data.map((item: Row, index: number): Row => {
      if (index == row) {
        ref.current?.setActiveCell({ row, col });
        let copy = item;
        let key = `Sample ${col}` as keyof Row;
        copy[key] = newData;
        return copy;
      }
      return item;
    });
    // setData(newState);
  };
  const handleActive = (row: number, col: number) => {
    ref.current?.setActiveCell({ row, col });
    // const newData = data.map((item, index) => {});
  };
  const handleNavigate = () => {
    navigate(`/${chartType}`, {
      state: {
        folderLocation,
        fileName,
        fileType: 'ControlChart',
        sampleNumber,
        data,
        date,
        unit,
        chartType
      }
    });
  };

  return (
    <div className="flex flex-col h-screen">
      {window.Main && (
        <div className="flex-none">
          <AppBar />
        </div>
      )}
      <div className="flex-1 overflow-y-auto ">
        <div className="mx-auto max-w-5xl mt-5">
          {!loading && (
            <DataSheetGrid className="max-w-full" ref={ref} value={data} onChange={setData} columns={columns} />
          )}
        </div>
      </div>
      <div className="h-14 p-3 flex items-center border justify-end">
        <div className="flex gap-2">
          <Button onClick={handleNavigate}>Create Chart</Button>
        </div>
      </div>
    </div>
  );
};
export default AttributeDataInput;
