import { ipcRenderer, contextBridge } from 'electron';
import { ControlChartFileData, FileTypesU, ParetoChartFileData } from './types';

declare global {
  interface Window {
    Main: typeof api;
    ipcRenderer: typeof ipcRenderer;
  }
}

const api = {
  handleFileSaveLocation: () => ipcRenderer.sendSync('file-save-location'),
  getFiles: () => ipcRenderer.sendSync('get-files'),
  writeRecentFile: <T>(data: T) => ipcRenderer.send('write-recent-data', data),
  handleSaveFile: (fileData: ControlChartFileData) => ipcRenderer.send('save-file', fileData),
  handleCreateFile: (fileName: string, folderLocation: string) =>
    ipcRenderer.send('create-file', { fileName, folderLocation }),
  handleOpenFile: () => ipcRenderer.sendSync('open-file'),
  handleOpenFileFromRecent: (folderLocation: string, fileName: string) =>
    ipcRenderer.sendSync('open-file-from-recent', { folderLocation, fileName }),
  Minimize: () => {
    ipcRenderer.send('minimize');
  },
  Maximize: () => {
    ipcRenderer.send('maximize');
  },
  Close: () => {
    ipcRenderer.send('close');
  },

  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  }
};
contextBridge.exposeInMainWorld('Main', api);

contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);
