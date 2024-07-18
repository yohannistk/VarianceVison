import { join } from 'path';
import { BrowserWindow, app, ipcMain, IpcMainEvent, dialog } from 'electron';
import isDev from 'electron-is-dev';
import fs from 'fs';
import path from 'path';
import { ControlChartFileData, FileTypesU, Key } from './types';
import { readFiles, writeRecentFiles } from './recentFile';

const height = 600;
const width = 1000;
let window: BrowserWindow;
function createWindow() {
  window = new BrowserWindow({
    width,
    height,
    minHeight: height,
    minWidth: width,
    frame: false,
    show: true,
    resizable: true,
    fullscreenable: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  });
  window.once('ready-to-show', () => {
    window.show();
  });
  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}` : join(__dirname, '../src/out/index.html');

  // and load the index.html of the app.
  if (isDev) {
    window?.loadURL(url);
  } else {
    window?.loadFile(url);
  }

  ipcMain.on('get-files', (event: IpcMainEvent) => {
    event.returnValue = readFiles();
  });
  ipcMain.on('write-recent-data', (event: IpcMainEvent, args: any) => {
    const filePath = path.resolve(args.folderLocation, `${args.fileName}.json`);
    const stats = fs.statSync(filePath);
    writeRecentFiles(args.fileType as Key, { ...args, lastModified: stats.mtime });
  });
  ipcMain.on('file-save-location', async (event: IpcMainEvent, message: any) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (canceled) {
      event.returnValue = {};
      return;
    }
    const directoryPath = filePaths[0];
    const files = fs.readdirSync(directoryPath, { withFileTypes: true });
    const returnedData: { directoryPath: string | null; jsonFiles: string[] } = {
      directoryPath: directoryPath,
      jsonFiles: []
    };
    if (files.length) {
      files.forEach((file) => {
        if (path.extname(file.name) === '.json') {
          returnedData.jsonFiles.push(file.name);
        }
      });
    }

    event.returnValue = returnedData;
  });
  ipcMain.on('create-file', async (event: IpcMainEvent, args: { fileName: string; folderLocation: string }) => {
    const filePath = path.resolve(args.folderLocation, `${args.fileName}.json`);
    fs.appendFile(filePath, '', function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
  });
  ipcMain.on('save-file', async (event: IpcMainEvent, args: ControlChartFileData) => {
    const filePath = path.resolve(args.folderLocation, `${args.fileName}.json`);
    const stats = fs.statSync(filePath);
    fs.writeFile(filePath, JSON.stringify({ ...args, lastModified: stats.mtime }), (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
  ipcMain.on('open-file', async (event: IpcMainEvent, args: ControlChartFileData) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Custom File Type', extensions: ['json', 'xlxs'] }]
    });
    if (canceled) {
      event.returnValue = {};
      return;
    }
    console.log('HERE');
    try {
      const fileContent = fs.readFileSync(filePaths[0]);
      console.log(JSON.parse(fileContent.toString()));
      event.returnValue = JSON.parse(fileContent.toString());
    } catch (e) {
      throw e;
    }
  });
  ipcMain.on(
    'open-file-from-recent',
    async (event: IpcMainEvent, args: { folderLocation: string; fileName: string }) => {
      try {
        const fileData = fs.readFileSync(path.resolve(args.folderLocation, `${args.fileName}.json`)).toString();
        event.returnValue = fileData;
      } catch (e) {
        console.log(e);
        event.returnValue = {};
      }
    }
  );
  ipcMain.on('minimize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMinimized() ? window.restore() : window.minimize();
    // or alternatively: win.isVisible() ? win.hide() : win.show()
  });
  ipcMain.on('maximize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMaximized() ? window.restore() : window.maximize();
  });

  ipcMain.on('close', () => {
    window.close();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
