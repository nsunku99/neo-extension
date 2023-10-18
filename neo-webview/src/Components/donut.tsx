/* Styling component for donut charts */

import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

type donutProps = {
  donutData: number[];
  donutName: string;
  csize: number;
  overallScore: number;
  color: string;
};

export default function Donut({ donutData, donutName, csize, overallScore, color }: donutProps) {
  const [myChartState, setMyChartState] = useState<Chart | null>(null);

  useEffect(() => {

    const chartRefZero = document.getElementById(`0`) as HTMLCanvasElement;
    if (chartRefZero) {
      if (myChartState) {
        myChartState.destroy();
      }
    }

    const chartRef = document.getElementById(`pie-chart-${donutName}`) as HTMLCanvasElement;

    if (chartRef) {
      if (myChartState) {
        myChartState.destroy();
      }

      const donutLabel = {
        id: 'doughnutLabel',
        beforeDatasetsDraw(chart: Chart) {
          const { ctx } = chart;
          ctx.save();
          const xCoor = chart.getDatasetMeta(0).data[0].x
          const yCoor = chart.getDatasetMeta(0).data[0].y
          // plug in score number here
          ctx.fillText((overallScore).toString(), xCoor, yCoor)
          ctx.textAlign = 'center'
          ctx.font = '20px sans-serif'
        }
      }

      const myChart = new Chart(chartRef, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [70, 30],
              backgroundColor: [color, 'white'],
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: donutName,
              font: { size: donutName === 'Overall' ? 24 : 16 },
            },
          },
        },
        plugins: [donutLabel],
      });

      const datasets = myChart.data.datasets;
      datasets[0].data = donutData;

      if (myChart) {
        myChart.update();
        setMyChartState(myChart as Chart);
      }
    }


  }, [donutData]);

  return (
    <div
      style={
        {
          height: `${csize}px`,
          width: `${csize}px`
        }}>
      <canvas
        id={`pie-chart-${donutName}`}
      ></canvas>
    </div>
  );
}
