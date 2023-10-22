// import { useContext } from "react"
// import { VsCodeApiContext } from "../Contexts/vsCodeContext";
import { useEffect, useState } from "react"
import { vscode } from "../App"
import type { metrics, SetMetrics } from "../Utilities/useMetrics";
import type { pageObj } from "../Containers/Body";


export function Input({ vsConnect, metrics, funcs, pageObj }:
  {
    vsConnect: vscode,
    metrics: { [key: string]: metrics },
    funcs: { [key: string]: SetMetrics },
    pageObj: pageObj
  }) {

  const [notReceived, setReceived] = useState(true);
  const [link, setLink] = useState('');

  function onClick() {
    if (link !== '' && link.includes('http://localhost:')) {
      vsConnect.postMessage({ command: 'live server link', text: link })
      setLink('');
      setReceived(false);
    }
  }

  const { setOverall, setFcp, setDom, setReqNum, setLCP, setTBT, setTTFB } = funcs;
  const { overall, fcp, dom, reqNum, lcp, tbt, ttfb } = metrics;
  const { setPageName } = pageObj;

  useEffect(() => {

    console.log('useEffect cycle run')

    window.addEventListener('message', (e) => {
      console.log('data: ', e.data.data);

      console.log('window listener count')

      console.log('Page Name: ', e.data.data.pageName);
      setPageName(e.data.data.pageName);

      const pupData = e.data.data.metrics; // PUPPETEER DATA;
      const { tTFB, fCP, lCP, requestTime, domCompletion, tBT } = pupData;

      console.log(pupData);

      // const overallScore: number = pupData.reduce((acc: number, entry: { [key: string]: number }) => acc + entry.value, 0)
      let overallScore = 0;
      for (const metric in pupData) {
        overallScore += pupData[metric].score;
      }
      overallScore /= 6;

      const overallColor: string = overallScore > 80 ? 'green' : (overallScore > 60 ? 'yellow' : 'red');


      switch (e.data.command) {
        case "performance metrics":
          setTTFB({
            ...ttfb,
            name: 'Time to First Byte',
            data: [tTFB.score, 100 - tTFB.score],
            score: tTFB.score,
            color: tTFB.color,
            number: tTFB.value,
          })
          setFcp({
            ...fcp,
            name: 'First Contentful Paint',
            data: [fCP.score, 100 - fCP.score],
            score: fCP.score,
            color: fCP.color,
            number: fCP.value,
          })
          setLCP({
            ...lcp,
            name: 'Largest Contentful Paint',
            data: [lCP.score, 100 - lCP.score],
            score: lCP.score,
            color: lCP.color,
            number: lCP.value,
            url: lCP.url
          })
          setDom({
            ...dom,
            name: 'DOM Completion',
            data: [domCompletion.score, 100 - domCompletion.score],
            score: domCompletion.score,
            color: domCompletion.color,
            number: domCompletion.value,
          })
          setReqNum({
            ...reqNum,
            name: 'Request Time',
            data: [requestTime.score, 100 - requestTime.score],
            score: requestTime.score,
            color: requestTime.color,
            number: requestTime.value,
          })
          setTBT({
            ...tbt,
            name: 'Total Blocking Time',
            data: [tBT.score, 100 - tBT.score],
            score: tBT.score,
            color: tBT.color,
            number: tBT.value,
          })
          setOverall({
            ...overall,
            name: 'Overall',
            data: [overallScore, 100 - overallScore],
            score: overallScore,
            color: overallColor
          })
      }
    })

  }, [fcp])

  return (
    <>
      {notReceived ?
        <div className="mx-auto flex flex-col w-[30vw] justify-around items-center my-4">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            type="text"
            className="my-2" />
          <button onClick={onClick}>Submit LocalHost Link</button>
        </div> :
        null
      }
      <div className="flex justify-around">
        <button
          className="m-4"
          onClick={() => vsConnect.postMessage({ command: 'alert', text: 'nice' })}>
          Test
        </button >
        <button
          className="m-4"
          onClick={() => vsConnect.postMessage({ command: 'error', text: 'it is an error' })}>
          Error
        </button >
      </div>
    </>
  )

}