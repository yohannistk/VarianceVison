import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Column, DataSheetGrid, keyColumn, floatColumn, textColumn } from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';
import { DataSheetGridRef } from 'react-datasheet-grid/dist/types';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '../../components/AppBar';
import Button from '../../components/ui/Button';
import { ParetoChartFileData } from '../../types';
type Row = {
  [key: string]: null | string | any;
};

interface Props {}
const ParetoChartDataInput: React.FC<Props> = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef<DataSheetGridRef>(null);
  const [data, setData] = useState<Row[]>([]);
  const [columns, setColumns] = useState<Column<Row>[]>([]);
  const [loading, setLoading] = useState(true);
  const fileName = location.state.fileName;
  const numberOfRows = location.state.numberOfRows;
  const folderLocation = location.state.folderLocation;
  useEffect(() => {
    window.Main.handleCreateFile(fileName, folderLocation);
  }, []);
  // saving File
  useEffect(() => {
    window.Main.handleSaveFile({
      data,
      folderLocation,
      numberOfRows,
      fileName,
      fileType: 'ParetoChart'
    } as any);
  }, [data]);
  useEffect(() => {
    const columns: Column<Row>[] = [
      { ...keyColumn<Row, string>('Defect', textColumn), title: 'Defect' },
      { ...keyColumn<Row, string>('Frequency', floatColumn), title: 'Frequency' }
    ];
    setColumns(columns);
    const gridData = [];

    for (let x = 0; x < numberOfRows; x++) {
      let obj: Row = {};
      for (let y = 0; y < 2; y++) {
        if (y == 1) {
          let key = `Frequency`;
          obj[key] = null;
        }
      }
      gridData.push(obj);
    }
    setData(gridData);

    setLoading(false);
  }, []);
  useEffect(() => {
    window.Main.writeRecentFile<ParetoChartFileData>({
      data,
      folderLocation,
      fileName,
      fileType: 'ParetoChart',
      numberOfRows
    });
    setLoading(false);
  }, []);
  const handleNavigate = () => {
    navigate(`/paretoChartDisplay`, {
      state: {
        data
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
          <Button bg="seconday" onClick={handleNavigate}>
            Create Chart
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ParetoChartDataInput;
