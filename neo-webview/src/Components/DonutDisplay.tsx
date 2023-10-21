// DONUT DISPLAY PAGE

import { useState, useEffect } from 'react';
import Donut from './Donut';
import type { metrics } from '../Utilities/useMetrics';
import type { pageObj } from '../Containers/Body';

export function DonutDisplay({ metrics, pageObj }:
  { metrics: { [key: string]: metrics }, pageObj: pageObj }) {

  const { overall } = metrics;
  const { pageName } = pageObj

  const [chartVision, setChartVision] = useState(false);
  const [donutArr, setDonutArr] = useState([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const donuts: any = [];

  useEffect(() => {

    // RECEIVED DATA -> CHARTS ACTIVE VIEW
    if (overall.data[0] !== 0) {
      setChartVision(true);

      for (const key in metrics) {

        if (key !== 'overall') {

          const { name, data, score, color, number } = metrics[key];

          if (score) {
            donuts.push(
              <div className='flex flex-col gap-2 justify-center items-center p-3'>
                <Donut
                  donutData={data}
                  donutName={name}
                  csize={150}
                  overallScore={+score.toFixed(2)}
                  color={color}
                />
                <div className='text-white'>
                  {`${name}: ${number.toFixed(2)} ms`}
                </div>
              </div>
            )
          }
        }
      }
    }

    setDonutArr(donuts);
    console.log({ donuts })

  }, [overall]);


  return (
    <div id="content" className="rounded-3xl">
      <div id="app-header_line" className="bg-black rounded-xl"></div>
      <div id="app-body" className="flex">
        <div
          id="app-main"
          className="flex flex-col justify-center items-center text-black mx-8 my-5 grow"
        >
          {chartVision ? <div id="all-charts">
            <div
              id="overall-donut"
              className="flex flex-col justify-center items-center"
            >
              <h1 className='text-white text-2xl'>
                Page <span>"{pageName[0].toUpperCase()}{pageName.slice(1).toLowerCase()}"</span> Overall Score
              </h1>
              <Donut
                donutData={overall.data}
                donutName={overall.name}
                csize={250}
                overallScore={+overall.score.toFixed(2)}
                color={overall.color}
              />
            </div>
            <div id="technical-donuts" className="flex flex-wrap min-w-fit justify-around items-center my-10">
              {donutArr}
            </div>
          </div> : null}

        </div>
      </div>
    </div >
  );
}