import { Dialog, Transition } from '@headlessui/react';
import React, { useEffect, useRef } from 'react';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ErrorModal from './ErrorModal';

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
interface FormType {
  numberOfRows: string;
  fileName: string;
}
const NewParetoChartModal: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const form = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
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
    setValue('fileName', '');
    setValue('numberOfRows', '');
    setFolderLocation('');
  };
  useEffect(() => {
    return () => handleClear();
  }, []);

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
    const { fileName, numberOfRows } = data;
    navigate('/paretochartdatainput', {
      state: {
        fileName,
        folderLocation: `${folderLocation}`,
        numberOfRows: parseInt(numberOfRows)
      }
    });
  };

  const handleSubmitForm = () => {
    form.current?.requestSubmit();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed top-9 inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <ErrorModal
          isOpen={showErrorMessage}
          setIsOpen={setShowErrorMessage}
          message="File with the given name exist"
        />

        <div className="fixed top-9 inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Create New ParetoChart
                </Dialog.Title>
                <div className="mt-2">
                  <form onSubmit={handleSubmit(onSubmit)} ref={form}>
                    <div className="flex flex-col gap-2">
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

                      <div>
                        <label htmlFor="numberOfRows" className=" block mb-2 text-sm font-medium ">
                          Number Of Rows
                        </label>
                        <input
                          {...register('numberOfRows', { required: true })}
                          type="number"
                          id="numberOfRows"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder=""
                        />
                      </div>

                      <div>
                        <label htmlFor="fileLocation" className="block mb-2 text-sm font-medium ">
                          File Location
                        </label>
                        <div
                          role="button"
                          onClick={handleFileSaveLocation}
                          className="bg-gray-50 hover:bg-gray-300 cursor-pointer border flex justify-between items-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                          <p className="w-[330px] truncate ">{folderLocation}</p>
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

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={handleSubmitForm}
                  >
                    Create Project
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default NewParetoChartModal;
