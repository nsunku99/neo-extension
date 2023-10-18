/*
Puppeteer Handler:
  - Puppeteer Analyzer: Function that loads the port of the docker container to gain desired Metrics
    - Puppeteer opens a headless browser and goes to desired link
    - Gain metrics on that page
    - Close the puppeteer headless browser and send the metrics 
*/

import puppeteer, { Browser, Page } from 'puppeteer';

export const puppeteerAnalyzer = async (link: string): Promise<void> => {

  // endpoint: string, port: number, host: string, protocol: string

  try {

    console.log('Entered Puppeteer Analyzer');
    const browser: Browser = await puppeteer.launch({ headless: false }); // { headless: 'new' } <- input for headless
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

    console.log(`On google home page`);

    // OBTAIN ENTRIES WITH PERFORMANCE API GET ENTRIES METHOD
    const getEntries = await page.evaluate(function (): string {
      return JSON.stringify(window.performance.getEntries());
    });


    // PARSE OBJECT OF ENTRIES
    const parseEntries: { [key: string]: any } = JSON.parse(getEntries);
    const filteredEntries = parseEntries.filter((e: any) => {
      return e.entryType === 'navigation' || e.entryType === 'paint' || e.entryType === 'measure';
    });

    console.log(filteredEntries);

    // setTimeout(async () => await browser.close(), 1000);
    await browser.close();


  } catch (error) {

    console.error('Error in Puppeteer Handler');
    console.error(error);
    throw error;

  }
};
