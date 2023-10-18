// DONUT DISPLAY PAGE

import { useState, useEffect } from 'react';
import Donut from './Donut';
import { metrics } from '../Utilities/useMetrics';

export function DonutDisplay({ metrics }:
  { metrics: { [key: string]: metrics } }) {

  const { overall, fcp, domScore, reqNum, hydration } = metrics;

  const [chartVision, setChartVision] = useState(false);

  useEffect(() => {

    // RECEIVED DATA -> CHARTS ACTIVE VIEW
    setChartVision(true);

  }, [overall]);


  return (
    <div id="content" className="bg-gray-300 rounded-3xl">
      <div id="app-header_line" className="bg-black rounded-xl"></div>
      <div id="app-body" className="flex">
        <div
          id="app-main"
          className="flex flex-col justify-center items-center text-black mx-8 my-5 grow"
        >
          {chartVision ?
            <div id="all-charts">
              <div
                id="overall-donut"
                className="flex justify-center items-center"
              >
                <Donut
                  donutData={overall.data as number[]}
                  donutName={overall.name as string}
                  csize={250}
                  overallScore={overall.score as number}
                  color={overall.color as string}
                />
              </div>
              <div id="technical-donuts" className="flex flex-wrap min-w-fit justify-around items-center my-10">
                {fcp.score !== undefined ?
                  (<div className='flex flex-col gap-2 justify-center items-center'>
                    <Donut
                      donutData={fcp.data as number[]}
                      donutName={fcp.name as string}
                      csize={150}
                      overallScore={fcp.score}
                      color={fcp.color as string}
                    />
                    <div>
                      {'FCP: ' + fcp.number + ' ms'}
                    </div>
                  </div>) : null
                }
                {domScore.score !== undefined ?
                  (<div className='flex flex-col gap-2 justify-center items-center'>
                    <Donut
                      donutData={domScore.data as number[]}
                      donutName={domScore.name as string}
                      csize={150}
                      overallScore={domScore.score}
                      color={domScore.color as string}
                    />
                    <div>{'DC: ' + domScore.number + ' ms'}</div>
                  </div>) : null
                }
                {reqNum.score !== undefined ?
                  (<div className='flex flex-col gap-2 justify-center items-center'>
                    <Donut
                      donutData={reqNum.data as number[]}
                      donutName={reqNum.name as string}
                      csize={150}
                      overallScore={reqNum.score}
                      color={reqNum.color as string}
                    />
                    <div>{'RT: ' + reqNum.number + ' ms'}</div>
                  </div>) : null
                }
                {hydration.score !== undefined ?
                  (<div className='flex flex-col gap-2 justify-center items-center'>
                    <Donut
                      donutData={hydration.data as number[]}
                      donutName={hydration.name as string}
                      csize={150}
                      overallScore={hydration.score}
                      color={hydration.color as string}
                    />
                    <div>{'HT: ' + hydration.number + ' ms'}</div>
                  </div>) : null
                }
              </div>
            </div>
            : null}
        </div>
      </div>
    </div >
  );
}