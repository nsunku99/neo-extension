// DONUT DISPLAY PAGE

import { useState, useEffect } from 'react';
import Donut from './Donut';
import type { metrics } from '../Utilities/useMetrics';
import type { pageObj } from '../Containers/Body';

export function DonutDisplay({ metrics, pageObj }:
  { metrics: { [key: string]: metrics }, pageObj: pageObj }) {

  const { overall, lcp } = metrics;
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

        if (key !== 'overall' && key !== 'lcp') {

          const { name, data, score, color, number } = metrics[key];

          if (score) {
            donuts.push(
              <div className='flex flex-col gap-2 justify-center w-[250px] items-center m-5'>
                <Donut
                  donutData={data}
                  donutName={name}
                  csize={200}
                  overallScore={+score.toFixed(2)}
                  color={color}
                />
                <div className='text-lg'>
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
      <div id="app-body" className="flex">
        <div
          id="app-main"
          className="flex flex-col justify-center items-center mx-8 my-5 grow"
        >
          {chartVision ? <div id="all-charts">
            <div
              id="overall-donut"
              className="flex flex-col justify-center items-center"
            >
              <h1 className='text-2xl'>
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
            <div id="lCP-Donut" className='flex flex-wrap justify-around items-center m-5'>
              <div className='flex flex-col gap-2 justify-center items-center'>
                <Donut
                  donutData={lcp.data}
                  donutName={lcp.name}
                  csize={200}
                  overallScore={+lcp.score.toFixed(2)}
                  color={lcp.color}
                />
                <div className=' text-lg'>
                  {`${lcp.name}: ${lcp.number.toFixed(2)} ms`}
                </div>
              </div>
              <div>
                <img className='m-5 max-h-[200px] rounded-md' src={lcp.url} alt="Largest Contentful Paint Image" />
              </div>
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