export type FileType = 'ControlChart' | 'ParetoChart';
export type ChartType = 'RX' | 'XS' | 'P';
export type ControlChartFileData = {
  chartType: string;
  date?: string;
  fileName: string;
  unit: string;
  folderLocation: string;
  sampleNumber: number;
  sampleSize: number;
  fileType: FileType;
};
export type RecentFilesData = {
  recentControlCharts: any[];
  recentHistograms: any[];
  recentParetoChart: any[];
};

export type ParetoChartFileData = {
  fileName: string;
  folderLocation: string;
  data: any;
  fileType: FileType;
  numberOfRows: number;
};
export type FileTypesU = ControlChartFileData | ParetoChartFileData;
