/* the argument has to be an object type for TS */

/*
Time to First Byte (TTFB):

Good: Under 100 milliseconds
Okay: 100-300 milliseconds
Bad: Over 300 milliseconds

First Contentful Paint (FCP):

Good: Under 1,000 milliseconds (1 second)
Okay: 1,000-2,000 milliseconds (1-2 seconds)
Bad: Over 2,000 milliseconds (2 seconds)

Largest Contentful Paint (LCP):

Good: Under 1,500 milliseconds (1.5 seconds)
Okay: 1,500-3,500 milliseconds (1.5-3.5 seconds)
Bad: Over 3,500 milliseconds (3.5 seconds)

Request Time:

Good: Under 500 milliseconds
Okay: 500-1,000 milliseconds (0.5-1 second)
Bad: Over 1,000 milliseconds (1 second)

DOM Completion:

Good: Under 1,000 milliseconds (1 second)
Okay: 1,000-2,000 milliseconds (1-2 seconds)
Bad: Over 2,000 milliseconds (2 seconds)

Total Blocking Time (TBT):

Good: Under 50 milliseconds
Okay: 50-100 milliseconds
Bad: Over 100 millisecondss

*/

export default function algoMetrics(metrics: { [key: string]: number }) {

  const metricsObj: { [key: string]: any } = {};

  /*
    tTFB: responseStart - requestStart,
    fCP: fCP - activationStart,
    lCP: lCP as number,
    requestTime: responseEnd - requestStart,
    domCompletion: domComplete - activationStart,
    tBT: parseFloat(totalBlockingTime)
  */

  for (const metric in metrics) {

    const value: number = +metrics[metric];

    switch (metric) {
      case 'tTFB':

        const tTFB: { [key: string]: any } = {};

        tTFB.value = value;

        if (value < 100) {  // 80 - 100%

          tTFB.color = 'green';

          if (value <= 50) {
            tTFB.score = 100 - (value / 50) * 2;
          } else {
            tTFB.score = 98 - Math.log10(value - 50) / Math.log10(50) * 18;
          }

        } else if (value < 300) { // 60 - 80%

          tTFB.color = 'yellow';
          tTFB.score = 80 - ((value - 100) / 200) * 20;

        } else {

          tTFB.color = 'red';
          tTFB.score = value < 1000 ? 60 - ((value - 300) / (1000 - 300)) * 60 : 0;

        }

        metricsObj.tTFB = tTFB;
        break;

      case 'fCP':

        const fCP: { [key: string]: any } = {};

        fCP.value = value;

        if (value < 1000) {  // 80 - 100%

          fCP.color = 'green';

          if (value <= 500) {
            fCP.score = 100 - (value / 500) * 5;
          } else {
            fCP.score = 95 + (500 - value) / (1000 - 500) * (95 - 80); // max% + (500 - x) / (maxT - minT)(max% - min%)
          }

        } else if (value < 2000) { // 60 - 80%

          fCP.color = 'yellow';
          fCP.score = 80 - ((value - 1000) / 1000) * 20;

        } else {

          fCP.color = 'red';
          fCP.score = value < 10000 ? 60 - ((value - 2000) / (10000 - 2000)) * 60 : 0;

        }

        metricsObj.fCP = fCP;
        break;

      case 'lCP':

        const lCP: { [key: string]: any } = {};

        lCP.value = value;

        if (value < 1500) {  // 80 - 100%

          lCP.color = 'green';

          if (value <= 750) {
            lCP.score = 100 - (value / 750) * 5;
          } else {
            lCP.score = 95 + (750 - value) / (1500 - 750) * (95 - 80); // max% + (500 - x) / (maxT - minT)(max% - min%)
          }

        } else if (value < 3500) { // 60 - 80%

          lCP.color = 'yellow';
          lCP.score = 80 - ((value - 2000) / 1500) * 20;

        } else {

          lCP.color = 'red';
          lCP.score = value < 10000 ? 60 - ((value - 3500) / (10000 - 3500)) * 60 : 0;

        }

        metricsObj.lCP = lCP;
        break;

      case 'requestTime':

        const requestTime: { [key: string]: any } = {};

        requestTime.value = value;

        if (value < 500) {  // 80 - 100%

          requestTime.color = 'green';

          if (value <= 250) {
            requestTime.score = 100 - (value / 250) * 5;
          } else {
            requestTime.score = 95 + (250 - value) / (1000 - 250) * (95 - 80); // max% + (500 - x) / (maxT - minT)(max% - min%)
          }

        } else if (value < 1000) { // 60 - 80%

          requestTime.color = 'yellow';
          requestTime.score = 80 - ((value - 500) / 500) * 20;

        } else {

          requestTime.color = 'red';
          requestTime.score = value < 5000 ? 60 - ((value - 1000) / (5000 - 1000)) * 60 : 0;

        }

        metricsObj.requestTime = requestTime;
        break;

      case 'domCompletion':

        const domCompletion: { [key: string]: any } = {};

        domCompletion.value = value;

        if (value < 1000) {  // 80 - 100%

          domCompletion.color = 'green';

          if (value <= 500) {
            domCompletion.score = 100 - (value / 500) * 5;
          } else {
            domCompletion.score = 95 + (500 - value) / (1000 - 500) * (95 - 80); // max% + (500 - x) / (maxT - minT)(max% - min%)
          }

        } else if (value < 2000) { // 60 - 80%

          domCompletion.color = 'yellow';
          domCompletion.score = 80 - ((value - 1000) / 1000) * 20;

        } else {

          domCompletion.color = 'red';
          domCompletion.score = value < 10000 ? 60 - ((value - 2000) / (10000 - 2000)) * 60 : 0;

        }

        metricsObj.domCompletion = domCompletion;
        break;

      case 'tBT':

        const tBT: { [key: string]: any } = {};

        tBT.value = value;

        if (value < 50) {  // 80 - 100%

          tBT.color = 'green';

          if (value <= 25) {
            tBT.score = 100 - (value / 25) * 5;
          } else {
            tBT.score = 95 + (25 - value) / (100 - 25) * (95 - 80); // max% + (500 - x) / (maxT - minT)(max% - min%)
          }

        } else if (value < 100) { // 60 - 80%

          tBT.color = 'yellow';
          tBT.score = 80 - ((value - 50) / 50) * 20;

        } else {

          tBT.color = 'red';
          tBT.score = value < 500 ? 60 - ((value - 100) / (500 - 100)) * 60 : 0;

        }

        metricsObj.tBT = tBT;
        break;

    }
  }

  return metricsObj;

}

// export function algoMetrics(metrics: { [key: string]: number }) {
//   const metricsObj: { [key: string]: string | number } = {};

//   // GENERAL METRIC SCORE CALCULATOR
//   const scoreEquation = (score: number) => 100 - (score / 51);
//   // const scoreEquation = (score: number) => 100 - Math.log10(score + 1) * 10; // LOG VERSION

//   // HYDRATION SCORE CALCULATOR
//   const hydrationEquation = (score: number) => {
//     if (isNaN(score)) {
//       return NaN;
//     }
//     return 100 - (2 * score);
//   };

//   // const hydrationEquation = (score: number) => 100 - Math.log10(score + 1) * 20;

//   // FIRST CONTENTFUL PAINT
//   metricsObj.FCPNum = metrics.fCP;
//   metricsObj.FCPScore = scoreEquation(metrics.fCP);

//   if (metrics.fCP <= 1800) {
//     metricsObj.FCP = 'First contentful paint: ' + metrics.fCP + ' rating: good';
//     metricsObj.FCPColor = 'green';
//   }
//   else if (metrics.fCP <= 3000) {
//     metricsObj.FCP = 'First contentful paint: ' + metrics.fCP + ' rating: average';
//     metricsObj.FCPColor = 'yellow';
//   } else {
//     metricsObj.FCP = 'First contentful paint: ' + metrics.fCP + ' rating: bad';
//     metricsObj.FCPColor = 'red';
//   }


//   // REQUEST TIME
//   metricsObj.RequestNum = metrics.requestTime;
//   metricsObj.RequestScore = scoreEquation(metrics.requestTime);

//   if (metrics.requestTime <= 1800) {
//     metricsObj.RequestTime = 'Total Request Time' + metrics.requestTime + ' rating: good';
//     metricsObj.RequestColor = 'green';
//   } else if (metrics.requestTime <= 3000) {
//     metricsObj.RequestTime = 'Total Request Time' + metrics.requestTime + ' rating: average';
//     metricsObj.RequestColor = 'yellow';
//   } else {
//     metricsObj.RequestTime = 'Total Request Time' + metrics.requestTime + ' rating: average';
//     metricsObj.RequestColor = 'red';
//   }


//   // DOM Score metrics
//   metricsObj.domCompleteNum = metrics.domCompletion;
//   metricsObj.domScore = scoreEquation(metrics.domCompletion < 300 ? 300 : metrics.domCompletion);

//   if (metrics.domCompletion <= 1800) {
//     metricsObj.domComplete = 'DOM Completion time: ' + metrics.domCompletion + ' rating: good';
//     metricsObj.domColor = 'green';
//   } else if (metrics.domCompletion <= 3000) {
//     metricsObj.domComplete = 'DOM Completion time: ' + metrics.domCompletion + ' rating: average';
//     metricsObj.domColor = 'yellow';
//   } else {
//     metricsObj.domComplete = 'DOM Completion time: ' + metrics.domCompletion + ' rating: bad';
//     metricsObj.domColor = 'red';
//   }


//   //Hydration Metrics

//   console.log('hydration: ', metrics.hydrationTime);

//   if (metrics.hydrationTime) {
//     console.log('first conditional');
//     metricsObj.HydrationNum = metrics.hydrationTime;
//     metricsObj.HydrationScore = hydrationEquation(metrics.hydrationTime);

//     if (metrics.hydrationTime <= 10) {
//       metricsObj.Hydration = 'Hydration Time: ' + metrics.hydrationTime + ' rating: good';
//       metricsObj.HydrationColor = 'green';
//     }
//     else if (metrics.hydrationTime <= 24) {
//       metricsObj.Hydration = 'Hydration Time: ' + metrics.hydrationTime + ' rating: average';
//       metricsObj.HydrationColor = 'yellow';
//     } else {
//       metricsObj.Hydration = 'Hydration Time: ' + metrics.hydrationTime + ' rating: bad';
//       metricsObj.HydrationColor = 'red';
//     }
//   } else {
//     console.log('second conditional');
//     metricsObj.HydrationNum = NaN;
//     metricsObj.HydrationScore = NaN;
//     metricsObj.Hydration = 'Hydration Time: ' + metrics.hydrationTime + ' rating: bad';
//     metricsObj.HydrationColor = 'red';
//   }

//   console.log('hydration score: ', metricsObj.HydrationScore);
//   console.log('Hydration Color: ', metricsObj.HydrationColor);

//   return metricsObj;
// }