/* Content for /neo landing page */

'use client';
import { useState, useEffect } from 'react';
import Donut from './donut';

export default function App() {
  const [data, setData] = useState([[], [50, 50]]);
  const [scores, setScores] = useState(['0']);
  const [donutColor, setDonutColor] = useState(['white']);
  const [donutMetrics, setDonutMetrics] = useState([0, 0, 0, 0]);
  // const [chartVision, setChartVision] = useState(false);


  // const handleGen = async () => {
  //   setChartVision(true);
  // };

  // useEffect(() => {

  //   const allCharts: HTMLElement | null = document.getElementById('all-charts');
  //   if (chartVision === true) {
  //     (allCharts as HTMLElement).removeAttribute('hidden');
  //   } else {
  //     allCharts?.setAttribute('hidden', 'true');
  //   }
  // }, [chartVision]);



  const res = await axios.post('/api/puppeteerHandler', body);
  // following the axios post, we now have our metrics object client side through the response
  const fcpScore = parseInt(res.data.metrics.FCPScore); // data[1]
  const domScore = parseInt(res.data.metrics.domScore); // data[2]
  const reqScore = parseInt(res.data.metrics.RequestScore); // data[3]
  const hydScore = parseInt(res.data.metrics.HydrationScore); // data[4]

  console.log('metrics: ', res.data.metrics);

  // CALCULATING OVERALL SCORE BASED ON RECEIVED METRICS
  let overall = 0;
  let count = 0;

  if (hydScore) {
    count++;
    overall += hydScore;
  }
  if (fcpScore) {
    count++;
    overall += fcpScore;
  }
  if (domScore) {
    count++;
    overall += domScore;
  }
  if (reqScore) {
    count++;
    overall += reqScore;
  }
  const overallScore = overall / count;

  // setter functions to apply all of the prepared scores
  setData([
    [overallScore, 100 - overallScore],
    [fcpScore, 100 - fcpScore],
    [domScore, 100 - domScore],
    [reqScore, 100 - reqScore],
    [hydScore, 100 - hydScore],
  ]);
  setScores([
    +overallScore.toFixed(2),
    res.data.metrics.FCPScore,
    res.data.metrics.domScore,
    res.data.metrics.RequestScore,
    res.data.metrics.HydrationScore,
  ]);
  // preparing the color for the overall donut, because it is not accounted for in algometrics
  let overallColor = 'green';
  if (overallScore < 70 && overallScore > 50) {
    overallColor = 'yellow';
  } else if (overallScore <= 50) {
    overallColor = 'red';
  }
  setDonutColor([
    overallColor,
    res.data.metrics.FCPColor,
    res.data.metrics.domColor,
    res.data.metrics.RequestColor,
    res.data.metrics.HydrationColor,
  ]);
  setDonutMetrics([
    res.data.metrics.FCPNum,
    res.data.metrics.domCompleteNum,
    res.data.metrics.RequestNum,
    res.data.metrics.HydrationNum,
  ]);




  return (
    <div id="content" className="bg-gray-300 rounded-3xl">
      <div id="app-header_line" className="bg-black rounded-xl"></div>
      <div id="app-body" className="flex">
        <div
          id="app-main"
          className="flex flex-col justify-center items-center text-black mx-8 my-5 grow"
        >
          <div id="all-charts" hidden>
            <div
              id="overall-donut"
              className="flex justify-center items-center"
            >
              <Donut
                donutData={data[0]}
                idx={1}
                donutName={'Overall Score'}
                csize={250}
                overallScore={scores[0]}
                color={donutColor[0]}
              />
            </div>
            <div id="technical-donuts" className="flex flex-wrap min-w-fit justify-around items-center my-10">
              {scores[1] !== undefined ?
                (<div className='flex flex-col gap-2 justify-center items-center'>
                  <Donut
                    donutData={data[1]}
                    idx={2}
                    donutName={'First Contentful Paint'}
                    csize={150}
                    overallScore={scores[1]}
                    color={donutColor[1]}
                  />
                  <div>
                    {'FCP: ' + donutMetrics[0] + ' ms'}
                  </div>
                </div>) : null
              }
              {scores[2] !== undefined ?
                (<div className='flex flex-col gap-2 justify-center items-center'>
                  <Donut
                    donutData={data[2]}
                    idx={3}
                    donutName={'DOM Completion'}
                    csize={150}
                    overallScore={scores[2]}
                    color={donutColor[2]}
                  />

                  <div>{'DC: ' + donutMetrics[1] + ' ms'}</div>
                </div>) : null
              }
              {scores[3] !== undefined ?
                (<div className='flex flex-col gap-2 justify-center items-center'>
                  <Donut
                    donutData={data[3]}
                    idx={4}
                    donutName={'Request Time'}
                    csize={150}
                    overallScore={scores[3]}
                    color={donutColor[3]}
                  />

                  <div>{'RT: ' + donutMetrics[2] + ' ms'}</div>
                </div>) : null
              }
              {scores[4] !== undefined ?
                (<div className='flex flex-col gap-2 justify-center items-center'>
                  <Donut
                    donutData={data[4]}
                    idx={5}
                    donutName={'Hydration Time'}
                    csize={150}
                    overallScore={scores[4]}
                    color={donutColor[4]}
                  />
                  <div>{'HT: ' + donutMetrics[3] + ' ms'}</div>
                </div>) : null
              }
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}