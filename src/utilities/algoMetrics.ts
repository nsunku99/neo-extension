/* the argument has to be an object type for TS */

export function algoMetrics(metrics: any) {
  const metricsObj: { [key: string]: string | number } = {};

  // GENERAL METRIC SCORE CALCULATOR
  const scoreEquation = (score: number) => 100 - (score / 51);
  // const scoreEquation = (score: number) => 100 - Math.log10(score + 1) * 10; // LOG VERSION

  // HYDRATION SCORE CALCULATOR
  const hydrationEquation = (score: number) => {
    if (isNaN(score)) {
      return NaN;
    }
    return 100 - (2 * score);
  };

  // const hydrationEquation = (score: number) => 100 - Math.log10(score + 1) * 20;

  // FIRST CONTENTFUL PAINT
  metricsObj.FCPNum = Math.round(metrics.fCP * 100) / 100;
  metricsObj.FCPScore = scoreEquation(Math.round(metrics.fCP / 100) * 100);

  if (metrics.fCP <= 1800) {
    metricsObj.FCP = 'First contentful paint: ' + metrics.fCP + ' rating: good';
    metricsObj.FCPColor = 'green';
  }
  else if (metrics.fCP <= 3000) {
    metricsObj.FCP = 'First contentful paint: ' + metrics.fCP + ' rating: average';
    metricsObj.FCPColor = 'yellow';
  } else {
    metricsObj.FCP = 'First contentful paint: ' + metrics.fCP + ' rating: bad';
    metricsObj.FCPColor = 'red';
  }


  // REQUEST TIME
  metricsObj.RequestNum = Math.round(metrics.requestTime * 100) / 100;
  metricsObj.RequestScore = scoreEquation(Math.round(metrics.requestTime / 100) * 100);

  if (metrics.requestTime <= 1800) {
    metricsObj.RequestTime = 'Total Request Time' + metrics.requestTime + ' rating: good';
    metricsObj.RequestColor = 'green';
  } else if (metrics.requestTime <= 3000) {
    metricsObj.RequestTime = 'Total Request Time' + metrics.requestTime + ' rating: average';
    metricsObj.RequestColor = 'yellow';
  } else {
    metricsObj.RequestTime = 'Total Request Time' + metrics.requestTime + ' rating: average';
    metricsObj.RequestColor = 'red';
  }


  // DOM Score metrics
  metricsObj.domCompleteNum = Math.round(metrics.domCompletion * 100) / 100;
  let roundDom = Math.round(metrics.domCompletion / 100) * 100;
  roundDom < 300 ? roundDom = 300 : null;
  metricsObj.domScore = scoreEquation(roundDom);


  if (metrics.domCompletion <= 1800) {
    metricsObj.domComplete = 'DOM Completion time: ' + metrics.domCompletion + ' rating: good';
    metricsObj.domColor = 'green';
  } else if (metrics.domCompletion <= 3000) {
    metricsObj.domComplete = 'DOM Completion time: ' + metrics.domCompletion + ' rating: average';
    metricsObj.domColor = 'yellow';
  } else {
    metricsObj.domComplete = 'DOM Completion time: ' + metrics.domCompletion + ' rating: bad';
    metricsObj.domColor = 'red';
  }


  //Hydration Metrics

  console.log('hydration: ', metricsObj.hydrationTime, Math.round(metricsObj.hydrationTime as number));

  if (metrics.hydrationTime) {
    console.log('first conditional');
    metricsObj.HydrationNum = Math.round(metrics.hydrationTime * 100) / 100;
    metricsObj.HydrationScore = hydrationEquation(metrics.hydrationTime);

    if (metrics.hydrationTime <= 10) {
      metricsObj.Hydration = 'Hydration Time: ' + metrics.hydrationTime + ' rating: good';
      metricsObj.HydrationColor = 'green';
    }
    else if (metrics.hydrationTime <= 24) {
      metricsObj.Hydration = 'Hydration Time: ' + metrics.hydrationTime + ' rating: average';
      metricsObj.HydrationColor = 'yellow';
    } else {
      metricsObj.Hydration = 'Hydration Time: ' + metrics.hydrationTime + ' rating: bad';
      metricsObj.HydrationColor = 'red';
    }
  } else {
    console.log('second conditional');
    metricsObj.HydrationNum = NaN;
    metricsObj.HydrationScore = NaN;
    metricsObj.Hydration = 'Hydration Time: ' + metrics.hydrationTime + ' rating: bad';
    metricsObj.HydrationColor = 'red';
  }

  console.log('hydration score: ', metricsObj.HydrationScore);
  console.log('Hydration Color: ', metricsObj.HydrationColor);

  return metricsObj;
}