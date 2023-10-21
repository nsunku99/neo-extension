import { exec } from 'child_process';
import { promisify } from 'util';

const promisifiedExec = promisify(exec);

export default async function runLighthouse(link: string) {
  const lighthouseCommand = 'lighthouse';
  const targetUrl = link;
  // const lighthouseOptions = [
  //   targetUrl,
  //   '--output=json',
  //   '--quiet',
  //   '--chrome-flags="--headless"',
  // ];
  const lighthouseOptions = [
    targetUrl,
    '--output=json',
    '--quiet',
    '--chrome-flags="--headless"',
    '--only-categories=performance', // Focus on the "Performance" category
    '--only-audits=largest-contentful-paint,first-contentful-paint,first-meaningful-paint,cumulative-layout-shift', // Specific performance audits
  ];


  try {
    const { stdout, stderr } = await promisifiedExec(`${lighthouseCommand} ${lighthouseOptions.join(' ')}`);

    if (stderr) {
      console.error('Lighthouse process encountered an error:', stderr);
      return { error: stderr };
    } else {
      const lighthouseReport = JSON.parse(stdout);
      console.log('Lighthouse Report:', lighthouseReport);
      return lighthouseReport;
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return { error };
  }
}
