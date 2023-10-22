/*
Puppeteer Handler:
  - Puppeteer Analyzer: Function that loads the port of the docker container to gain desired Metrics
    - Puppeteer opens a headless browser and goes to desired link
    - Gain metriscs on that page
    - Close the puppeteer headless browser and send the metrics 
*/

import puppeteer, { Browser, Page } from 'puppeteer';
import { algoMetrics } from './algoMetrics';


export default async function puppeteerAnalyzer(link: string): Promise<{
  [key: string]: string | number;
}> {

  try {

    console.log('Entered Puppeteer Analyzer');
    const browser: Browser = await puppeteer.launch({ headless: 'new' }); // { headless: 'new' } <- headless
    const page: Page = await browser.newPage();


    // ENTER DESIRED PAGE: WHILE LOOP W/ TRY CATCH ACCOUNTS FOR PAGES THAT FAIL TO LOAD
    let bool: boolean = true;
    while (bool) {
      try {
        await Promise.all([
          page.goto(link),
          page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        ]);
        bool = false;
      } catch (error) {
        if (error) {
          await page.reload();
        }
      }
    }


    // PAINT AND NAVIGATION ENTRIES WITH PERFORMANCE API
    const perfEntries = await page.evaluate(function (): any {
      const paint = JSON.stringify(window.performance.getEntriesByType('paint'));
      const nav = JSON.stringify(window.performance.getEntriesByType("navigation"));
      return { paint, nav };
    });

    const paint = JSON.parse(perfEntries.paint);
    const nav = JSON.parse(perfEntries.nav);
    console.log('\n', { nav }, '\n');


    // LARGEST CONTENTFUL PAINT METRIC
    const largestContentfulPaint: any = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((l) => {
          const entries = l.getEntries();
          const largestPaintEntry = entries.at(-1); // LAST ENTRY IS LCP
          resolve(largestPaintEntry?.toJSON());
        }).observe({
          type: 'largest-contentful-paint',
          buffered: true
        });
      });
    });


    // TOTAL BLOCKING TIME METRIC
    const totalBlockingTime: any = await page.evaluate(() => {
      return new Promise((resolve) => {
        let totalBlockingTime: number = 0;
        new PerformanceObserver(function (list) {
          const perfEntries = list.getEntries();
          for (const perfEntry of perfEntries) {
            totalBlockingTime += perfEntry.duration - 50;
          }
          resolve(totalBlockingTime);
        }).observe({ type: 'longtask', buffered: true });

        // RESOLVE IF THERE'S NO LONG TASKS
        setTimeout(() => resolve(totalBlockingTime), 5000);
      });
    });

    const { activationStart, requestStart, responseStart, responseEnd, domComplete }: { [key: string]: number } = nav[0];
    const { startTime: fCP }: { [key: string]: number } = paint[1];
    const { startTime: lCP, url: lCPurl }: { [key: string]: number | string } = largestContentfulPaint;

    console.log('Time to First Byte: ', responseStart - requestStart, '\n');
    console.log('First Contentful Paint: ', fCP - activationStart, '\n');
    console.log('Largest Contentful Paint: ', lCP, '\n');
    console.log('LCP Source URL: ', lCPurl, '\n');
    console.log('Request Time: ', responseEnd - requestStart, '\n');
    console.log('DOM Completion: ', domComplete - activationStart, '\n');
    console.log('Total Blocking Time: ', parseFloat(totalBlockingTime), '\n');



    const algoMetricsResult = algoMetrics({
      tTFB: responseStart - requestStart,
      fCP: fCP - activationStart,
      lCP: lCP as number,
      requestTime: responseEnd - requestStart,
      domCompletion: domComplete - activationStart,
      tBT: parseFloat(totalBlockingTime)
    });

    algoMetricsResult.lCP.url = lCPurl; // add URL IMG SRC for LCP
    console.log('\n', { algoMetricsResult }, '\n');

    await browser.close();

    return algoMetricsResult;

  } catch (error) {

    console.error('Error in Puppeteer Handler');
    console.error(error);
    throw error;

  }
};


////////////////////////////////////////////////////////////////////////////////////////////////


// CUMULATIVE LAYOUT SHIFT: FAILS AND STOPS CODE ON PAGES THAT REDIRECT
// let clsEntries: any;
// let cummulativeLayoutShift: any;

// console.log('redirect count: ', nav[0].redirectCount);
// if (nav[0].redirectCount === 0) {
//   console.log('entered bool');
//   cummulativeLayoutShift = await page.evaluate(() => {
//     return new Promise((resolve) => {
//       new PerformanceObserver((l) => {
//         const entries = JSON.stringify(l.getEntries());
//         resolve(entries);
//       }).observe({
//         type: 'layout-shift',
//         buffered: true
//       });
//     });
//   });
// }

// clsEntries = JSON.parse(cummulativeLayoutShift);
// let cls = 0;

// if (clsEntries.length > 1) {
//   clsEntries.forEach((entry: any) => cls += entry.value);
// } else {
//   cls = clsEntries[0].value;
// }

// // console.log(parseFloat(cummulativeLayoutShift));
// console.log('CLS Object: ', clsEntries);
// console.log('CLS Value: ', cls);


////////////////////////////////////////////////////////////////////////////////////////////////

// NEXT HYDRATION: STILL DOES NOT WORK
// console.log('\n==== localStorage hydration entry ====\n');
// const hydrationData = await page.evaluate(() => {
//   const data = {
//     preHydrate: localStorage.getItem('beforeRender'),
//     postHydrate: Number(localStorage.getItem('beforeRender')) + Number(localStorage.getItem('Next.js-hydration')),
//     hydrationTime: localStorage.getItem('Next.js-hydration'),
//   };
//   return data;
// });
// console.log(hydrationData);