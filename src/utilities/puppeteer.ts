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

export default async function puppeteerAnalyzer(link: string): Promise<{
  [key: string]: string | number;
}> {

  // endpoint: string, port: number, host: string, protocol: string

  try {

    console.log('Entered Puppeteer Analyzer');
    const browser: Browser = await puppeteer.launch({
      headless: 'new',
      defaultViewport: null,
      ignoreDefaultArgs: ['--enable-automation']
    }); // { headless: 'new' } <- input for headless
    const page: Page = await browser.newPage();

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

    const largestContentfulPaint: any = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((l) => {
          const entries = l.getEntries();
          // the last entry is the largest contentful paint
          const largestPaintEntry = entries.at(-1);

          resolve({
            lcp: largestPaintEntry?.startTime, obj: largestPaintEntry?.toJSON(),
            entries: JSON.stringify(entries)
          });
        }).observe({
          type: 'largest-contentful-paint',
          buffered: true
        });
      });
    });

    console.log('Largest Contentful Paint: ', (largestContentfulPaint), JSON.parse(largestContentfulPaint.entries));

    // OBTAIN ENTRIES WITH PERFORMANCE API GET ENTRIES METHOD
    const perfEntries = await page.evaluate(function (): any {

      const total = JSON.stringify(window.performance.getEntries());
      const paint = JSON.stringify(window.performance.getEntriesByType('paint'));
      const nav = JSON.stringify(window.performance.getEntriesByType("navigation"));
      // return JSON.stringify(window.performance.getEntries());
      return { total, paint, nav };
    });

    const getEntries = perfEntries.total;
    const { total, paint, nav } = perfEntries;
    console.log({ total: JSON.parse(total) }, { paint: JSON.parse(paint) }, { nav: JSON.parse(nav) });

    // Capture and log the console output from the browser context
    page.on('console', (message) => {
      console.log(`[Browser Console]: ${message.text()}`);
    });

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
