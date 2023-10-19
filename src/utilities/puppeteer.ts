/*
Puppeteer Handler:
  - Puppeteer Analyzer: Function that loads the port of the docker container to gain desired Metrics
    - Puppeteer opens a headless browser and goes to desired link
    - Gain metrics on that page
    - Close the puppeteer headless browser and send the metrics 
*/

import puppeteer, { Browser, Page } from 'puppeteer';
import { algoMetrics } from './algoMetrics';

export const puppeteerAnalyzer = async (link: string): Promise<{
  [key: string]: string | number;
}> => {

  // endpoint: string, port: number, host: string, protocol: string

  try {

    console.log('Entered Puppeteer Analyzer');
    const browser: Browser = await puppeteer.launch({ headless: 'new' }); // { headless: 'new' } <- input for headless
    const page: Page = await browser.newPage();

    // ENABLE PUPPETEER TRACING
    await page.tracing.start();

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

    // STOP TRACING
    const traceData = await page.tracing.stop();
    console.log('Puppeteer Tracing: ', traceData);



    // OBTAIN ENTRIES WITH PERFORMANCE API GET ENTRIES METHOD
    const getEntries = await page.evaluate(function (): string {
      return JSON.stringify(window.performance.getEntries());
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

    const algoMetricsResult = await algoMetrics({
      fCP: FCP,
      requestTime: reqTotal,
      hydrationTime: hydrationTotal,
      domCompletion: domCompleteTime
    });

    // console.log(algoMetricsResult);

    // setTimeout(async () => await browser.close(), 1000);
    await browser.close();

    return algoMetricsResult;

  } catch (error) {

    console.error('Error in Puppeteer Handler');
    console.error(error);
    throw error;

  }
};
