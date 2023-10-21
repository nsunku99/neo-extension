/*
Puppeteer Handler:
  - Puppeteer Analyzer: Function that loads the port of the docker container to gain desired Metrics
    - Puppeteer opens a headless browser and goes to desired link
    - Gain metrics on that page
    - Close the puppeteer headless browser and send the metrics 
*/

import puppeteer, { Browser, Page } from 'puppeteer';
// import { PerformanceObserver } from 'perf_hooks';
import { algoMetrics } from './algoMetrics';
import { calcLCP } from './performanceFuncs';


export default async function puppeteerAnalyzer(link: string): Promise<{
  [key: string]: string | number;
}> {

  // endpoint: string, port: number, host: string, protocol: string

  try {

    console.log('Entered Puppeteer Analyzer');
    const browser: Browser = await puppeteer.launch({ headless: 'new' }); // { headless: 'new' } <- input for headless
    const page: Page = await browser.newPage();


    // ADD LISTENERS BEFORE NAVIGATING

    await page.evaluateOnNewDocument(calcLCP); // LCP LISTENER



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


    // LCP 2 WAYS

    // WAY 1:


    let listenedMetrics = await page.evaluate(() => {
      return ({
        lcp: (window as { [key: string]: any }).largestContentfulPaint
      });
    });

    console.log('LCP V1 w/ calcLCP: ', listenedMetrics.lcp);
    // WAY 2


    const largestContentfulPaint: any = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((l) => {
          const entries = l.getEntries();
          // the last entry is the largest contentful paint
          const largestPaintEntry = entries.at(-1);

          resolve(largestPaintEntry?.toJSON());
        }).observe({
          type: 'largest-contentful-paint',
          buffered: true
        });
      });
    });

    console.log('LCP V2: ', (largestContentfulPaint));








    // TOTAL BLOCKING TIME METRIC
    const totalBlockingTime: any = await page.evaluate(() => {
      return new Promise((resolve) => {
        let totalBlockingTime = 0;
        new PerformanceObserver(function (list) {
          const perfEntries = list.getEntries();
          for (const perfEntry of perfEntries) {
            totalBlockingTime += perfEntry.duration - 50;
          }
          resolve(totalBlockingTime);
        }).observe({ type: 'longtask', buffered: true });

        // Resolve promise if there haven't been long tasks
        setTimeout(() => resolve(totalBlockingTime), 5000);
      });
    });

    console.log('totalBlockingTime: ', parseFloat(totalBlockingTime));






    // OBTAIN ENTRIES WITH PERFORMANCE API GET ENTRIES METHOD
    const perfEntries = await page.evaluate(function (): any {

      const total = JSON.stringify(window.performance.getEntries());
      const paint = JSON.stringify(window.performance.getEntriesByType('paint'));
      const nav = JSON.stringify(window.performance.getEntriesByType("navigation"));
      // return JSON.stringify(window.performance.getEntries());
      return { total, paint, nav };
    });

    const getEntries = perfEntries.total;
    // const { total, paint, nav } = perfEntries;
    let total = JSON.parse(perfEntries.total);
    let paint = JSON.parse(perfEntries.paint);
    let nav = JSON.parse(perfEntries.nav);
    console.log({ total }, { paint }, { nav });




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



    console.log('\n==== localStorage hydration entry ====\n');
    const hydrationData = await page.evaluate(() => {
      const data = {
        preHydrate: localStorage.getItem('beforeRender'),
        postHydrate: Number(localStorage.getItem('beforeRender')) + Number(localStorage.getItem('Next.js-hydration')),
        hydrationTime: localStorage.getItem('Next.js-hydration'),
      };
      return data;
    });

    console.log(hydrationData);




    // PARSE OBJECT OF ENTRIES
    const parseEntries: { [key: string]: any } = JSON.parse(getEntries);
    const filteredEntries = parseEntries.filter((e: any) => {
      return e.entryType === 'navigation' || e.entryType === 'paint' || e.entryType === 'measure';
    });

    console.log('Performance Entries: ', { parseEntries });

    // PRE DEFINE VARIABLES
    let resStartTime: number = 0;
    let FCP: number = 0;
    let reqTotal: number = 0;
    let hydrationTotal: number = 0;
    let domCompleteTime: number = 0;

    // ITERATE THROUGH FILTERED ENTRIES, PERFORM NECESSARY CALCULATIONS, AND STORE IN VARIABLES
    for (let i = 0; i < filteredEntries.length; i++) {
      if (filteredEntries[i].entryType === 'navigation') {
        resStartTime = filteredEntries[i].responseStart;
        reqTotal = filteredEntries[i].responseEnd - filteredEntries[i].requestStart;
        domCompleteTime = filteredEntries[i].domComplete - filteredEntries[i].requestStart;
      }
      if (filteredEntries[i].name === 'first-contentful-paint') {
        FCP = filteredEntries[i].startTime - resStartTime;
      }
      if (filteredEntries[i].name === 'Next.js-hydration') {
        hydrationTotal = filteredEntries[i].duration;
      }
    }

    console.log('Time to First Byte: ', nav[0].responseStart - nav[0].requestStart);
    console.log('First Contentful Paint: ', paint[1].startTime - nav[0].activationStart);
    console.log('Largest Contentful Paint: ', largestContentfulPaint.startTime);
    console.log('LCP Source URL: ', largestContentfulPaint.url);
    console.log('Request Time: ', nav[0].responseEnd - nav[0].requestStart);
    console.log('DOM Completion: ', nav[0].domComplete);


    console.log('hydration: ', hydrationTotal);
    console.log(filteredEntries);

    const algoMetricsResult = algoMetrics({
      fCP: FCP,
      requestTime: reqTotal,
      hydrationTime: hydrationTotal,
      domCompletion: domCompleteTime
    });

    // console.log(algoMetricsResult);

    // setTimeout(async () => await browser.close(), 5000);
    await browser.close();

    return algoMetricsResult;

  } catch (error) {

    console.error('Error in Puppeteer Handler');
    console.error(error);
    throw error;

  }
};
