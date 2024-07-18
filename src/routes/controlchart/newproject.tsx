import React, { useRef, useState } from 'react';

import { set, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import AppBar from '../../components/AppBar';
import ErrorModal from '../../components/modal/ErrorModal';

interface Props {}

interface FormType {
  sampleNumber: string;
  sampleSize: string;
  fileName: string;
  unit: string;
  date: string;
  chartType: string;
}

type Chart = 'Variable' | 'Attribute';

const NewProject: React.FC<Props> = () => {
  const form = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const [chartChooice, setChartChooice] = useState<Chart>('Variable');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { register, handleSubmit, setValue } = useForm<FormType>();
  const [folderLocation, setFolderLocation] = useState<string>('');
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const handleFileSaveLocation = () => {
    const directoryData = window.Main.handleFileSaveLocation();
    setFolderLocation(directoryData.directoryPath);
    setExistingFiles(directoryData.jsonFiles);
  };
  const handleClear = () => {
    setValue('unit', '');
    setValue('chartType', '');
    setValue('fileName', '');
    setValue('sampleNumber', '');
    setValue('sampleSize', '');
    setValue('date', '');
    setFolderLocation('');
  };
  const onSubmit = (data: FormType) => {
    setShowErrorMessage(false);
    const isFileAlredyExists = existingFiles.find((fileName) => fileName == `${data.fileName}.json`);
    if (!folderLocation) {
      setShowErrorMessage(true);
      return;
    }
    if (isFileAlredyExists) {
      setShowErrorMessage(true);
      return;
    }
    const { chartType, date, fileName, sampleNumber, sampleSize, unit } = data;
    if (chartChooice == 'Variable') {
      navigate('/variablechartdatainput', {
        state: {
          chartType,
          date,
          fileName,
          unit,
          folderLocation: `${folderLocation}`,
          sampleNumber: parseInt(sampleNumber),
          sampleSize: parseInt(sampleSize)
        }
      });
    } else {
      navigate('/attributechartdatainput', {
        state: {
          chartType,
          date,
          fileName,
          unit,
          folderLocation: `${folderLocation}`,
          sampleNumber: parseInt(sampleNumber)
        }
      });
    }
  };
  return (
    <div className="flex flex-col h-screen">
      {window.Main && (
        <div className="flex-none">
          <AppBar />
        </div>
      )}
      <ErrorModal message={`File Alredy Exists`} isOpen={showErrorMessage} setIsOpen={setShowErrorMessage} />
      <div className="flex-1 relative">
        <div className="h-full">
          <div className="z-50 w-full h-full px-6 py-3 overflow-hidden text-left align-middle transition-all transform shadow-2xl rounded-lg">
            <div className="h-full  flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium leading-6 ">New Project</h3>
              </div>
              <div className="flex-1 self-center  max-w-3xl flex">
                <div className="flex-1">
                  <form onSubmit={handleSubmit(onSubmit)} ref={form}>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="filename" className=" block mb-2 text-sm font-medium ">
                          File Name
                        </label>
                        <input
                          {...register('fileName', { required: true })}
                          type="text"
                          id="filename"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        />
                      </div>
                      <div className="relative max-w-sm">
                        <label htmlFor="date" className=" block mb-2 text-sm font-medium ">
                          Date
                        </label>
                        <input
                          {...register('date', { required: true })}
                          type="datetime-local"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Select date"
                        />
                      </div>
                      <div>
                        <label htmlFor="chart" className=" block mb-2 text-sm font-medium dark:text-white">
                          Chart
                        </label>
                        <select
                          id="chart"
                          onChange={(e) => setChartChooice(e.target.value as Chart)}
                          defaultValue={'Variable'}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                          <option value="Attribute">Attribute</option>
                          <option value="Variable">Variable</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="charttype" className=" block mb-2 text-sm font-medium dark:text-white">
                          ChartType
                        </label>
                        <select
                          {...register('chartType', { required: true })}
                          id="charttype"
                          defaultValue={'Select Chart'}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                          <option value="rxchart">Select Chart</option>
                          {chartChooice == 'Variable' ? (
                            <>
                              <option value="rxchart">X-Bar R CHART</option>
                              <option value="xschart">X-Bar S CHART</option>
                            </>
                          ) : (
                            <>
                              <option value="uchart">U-CHART</option>
                              <option value="pchart">P-CHART</option>
                              <option value="npchart">NP-CHART</option>
                              <option value="cchart">C-CHART</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="samplenumber" className=" block mb-2 text-sm font-medium ">
                          Sample Number
                        </label>
                        <input
                          {...register('sampleNumber', { required: true })}
                          type="number"
                          id="samplenumber"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder=""
                        />
                      </div>
                      {chartChooice == 'Variable' && (
                        <div>
                          <label htmlFor="samplesize" className=" block mb-2 text-sm font-medium ">
                            Sample Size
                          </label>
                          <input
                            {...register('sampleSize', { required: true })}
                            type="number"
                            id="samplesize"
                            className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder=""
                          />
                        </div>
                      )}

                      <div>
                        <label htmlFor="unit" className="block mb-2 text-sm font-medium dark:text-white">
                          Measurment Unit
                        </label>
                        <input
                          type="text"
                          {...register('unit', { required: true })}
                          id="unit"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder=""
                        />
                      </div>
                      <div>
                        <label htmlFor="fileLocation" className="text-white block mb-2 text-sm font-medium ">
                          File Location
                        </label>
                        <div
                          role="button"
                          onClick={handleFileSaveLocation}
                          className="bg-gray-50 max-w-sm overflow-hidden hover:bg-gray-300 cursor-pointer border flex justify-between items-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                          <p className="w-[220px]  truncate">{folderLocation}</p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      handleClear();
                      navigate(-1);
                    }}
                  >
                    Calcel
                  </Button>
                  <Button onClick={() => form.current?.requestSubmit()} bg="primary">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
