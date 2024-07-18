import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Error from './components/Error';
import ControlChart from './routes/home/controlChart';
import ParetoChart from './routes/home/paretoChart';
import CheckSheet from './routes/home/checkSheet';
import Histogram from './routes/home/histogram';
import CauseAndEffect from './routes/home/causeAndEffect';
import ScatterPlot from './routes/home/scatterDiagram';
import RxChart from './routes/controlchart/RXChart';
import VariableChartDataInput from './routes/controlchart/variablechartdatainput';
import AttributeChartDataInput from './routes/controlchart/attributechartdatainput';
import NewProject from './routes/controlchart/newproject';
import XSChart from './routes/controlchart/XSChart';
import ParetoChartDataInput from './routes/paretoChart/paretoChartDataInput';
import ParetoChartDisplay from './routes/paretoChart/ParetoChartDisplay';
import UChart from './routes/controlchart/UChart';
import CChart from './routes/controlchart/CChart';
import NPChart from './routes/controlchart/NPChart';

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,

    children: [
      { path: '', element: <ControlChart /> },
      { path: 'paretoChart', element: <ParetoChart /> },
      { path: 'checkCheet', element: <CheckSheet /> },
      { path: 'histogram', element: <Histogram /> },
      { path: 'scatterPlot', element: <ScatterPlot /> },
      { path: 'causeAndEffect', element: <CauseAndEffect /> }
    ]
  },
  {
    path: 'rxchart',
    element: <RxChart />,
    errorElement: <Error />
  },
  {
    path: 'uchart',
    element: <UChart />,
    errorElement: <Error />
  },
  {
    path: 'npchart',
    element: <NPChart />,
    errorElement: <Error />
  },
  {
    path: 'pchart',
    element: <UChart />,
    errorElement: <Error />
  },
  {
    path: 'cchart',
    element: <CChart />,
    errorElement: <Error />
  },
  {
    path: 'xschart',
    element: <XSChart />,
    errorElement: <Error />
  },
  {
    path: 'paretoChartDisplay',
    element: <ParetoChartDisplay />,
    errorElement: <Error />
  },
  {
    path: 'variablechartdatainput',
    element: <VariableChartDataInput />,
    errorElement: <Error />
  },
  {
    path: 'attributechartdatainput',
    element: <AttributeChartDataInput />,
    errorElement: <Error />
  },
  {
    path: 'paretochartdatainput',
    element: <ParetoChartDataInput />,
    errorElement: <Error />
  },
  {
    path: 'newproject',
    element: <NewProject />,
    errorElement: <Error />
  }
]);

ReactDOM.render(<RouterProvider router={router} />, document.getElementById('root'));
