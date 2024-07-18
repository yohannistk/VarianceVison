import React, { useRef } from 'react';
import { Chart as ChartJS } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Button from './ui/Button';
import { ArrowDownIcon } from '@heroicons/react/24/solid';

ChartJS.register(CategoryScale);

interface Props {
  ucl: number[];
  lcl: number[];
  cl: number[];
  data: number[];
  chartType: string;
}
const ControlChart: React.FC<Props> = (props) => {
  const chartRef = useRef<ChartJS>(null);
  const saveChartImage = () => {
    const dataURL = chartRef.current!.toBase64Image();
    const link = document.createElement('a');
    link.download = `${props.chartType}-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };
  const plugin: any = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart: any, args: any, options: any) => {
      const { ctx } = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = options.color || '#fff';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  };

  return (
    <div className="relative border my-5">
      <button className="absolute top-2 right-2 " onClick={saveChartImage}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path
            fillRule="evenodd"
            d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <Chart
        ref={chartRef}
        data={{
          labels: new Array(props.ucl.length).fill('').map((v, i) => `Sample ${i + 1}`),
          datasets: [
            {
              label: `UCL=${props.ucl[0]}`,
              type: 'line',
              pointRadius: 0,
              borderColor: '#4de377',
              backgroundColor: '#4de377',
              borderWidth: 1,
              data: props?.ucl
            },
            {
              label: props.chartType == 'xchart' ? 'mean' : 'range',
              type: 'line',
              borderColor: 'rgba(100,99,132,1)',
              backgroundColor: 'rgba(100,99,132,1)',
              borderWidth: 1,
              data: props?.data
            },
            {
              label: `LCL=${props.lcl[0]}`,
              type: 'line',
              borderColor: '#4d7fe3',
              backgroundColor: '#4d7fe3',
              borderWidth: 1,
              data: props?.lcl,
              pointRadius: 0
            },
            {
              label: `CL=${props.cl[0]}`,
              type: 'line',
              borderColor: '#e34d4d',
              backgroundColor: '#e34d4d',
              borderWidth: 1,
              data: props?.cl,
              pointRadius: 0
            }
          ]
        }}
        options={{
          plugins: {
            customCanvasBackgroundColor: {
              color: '#fff'
            },
            title: {
              display: true,
              text: props.chartType
            }
          } as any
        }}
        plugins={[plugin]}
        className="w-full my-8e p-2"
        type="bar"
      />
    </div>
  );
};

export default ControlChart;
