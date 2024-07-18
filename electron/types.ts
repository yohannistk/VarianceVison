export type ControlChartFileData = {
  chartType: string;
  date: string;
  fileName: string;
  unit: string;
  folderLocation: string;
  sampleNumber: number;
  sampleSize: number;
  data: any;
  fileType: string;
};
export type ParetoChartFileData = {
  date: string;
  fileName: string;
  folderLocation: string;
  data: any;
  fileType: string;
};
export type Key = 'controlChart' | 'paretoChart';
export type FileTypesU = ControlChartFileData | ParetoChartFileData;
