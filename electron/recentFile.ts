import { ControlChartFileData, FileTypesU, Key, ParetoChartFileData } from './types';
import fs from 'fs';
import path from 'path';
const Store = require('electron-store');
const schema = {
  ControlChart: {
    type: 'array',
    default: []
  },
  Histograms: {
    type: 'array',
    default: []
  },
  ParetoChart: {
    type: 'array',
    default: []
  }
};

const store = new Store({ schema });

export function writeRecentFiles(key: Key, value: FileTypesU) {
  const previous: any[] = store.get(key);
  if (previous.length >= 5) {
    const updated = previous.filter((file, index) => index != 0);
    store.set(key, [...updated, value]);
  } else {
    store.set(key, [...previous, value]);
  }
}

const checkFilesExists = (list: any[], fileType: string): any[] => {
  let existed = [];
  const previous: any[] = store.get(fileType);

  for (let file of list) {
    const isFileExists = fs.existsSync(path.resolve(file.folderLocation, `${file.fileName}.json`));
    if (isFileExists) {
      existed.push(file);
    } else {
      store.set(
        file.fileType,
        previous.filter((f) => f.fileName != file.fileName)
      );
    }
  }
  return existed;
};
export function readFiles() {
  let recentControlCharts: ControlChartFileData[] = store.get('ControlChart');
  let recentHistograms: any[] = store.get('Histograms');
  let recentParetoChart: ParetoChartFileData[] = store.get('ParetoChart');

  return {
    recentControlCharts: checkFilesExists(recentControlCharts, 'ControlChart'),
    recentHistograms: checkFilesExists(recentHistograms, 'Histograms'),
    recentParetoChart: checkFilesExists(recentParetoChart, 'ParetoChart')
  };
}

console.log(readFiles());
