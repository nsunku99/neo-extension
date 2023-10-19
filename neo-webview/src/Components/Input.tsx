// import { useContext } from "react"
// import { VsCodeApiContext } from "../Contexts/vsCodeContext";
import { useEffect, useState } from "react"
import { vscode } from "../App"
import { calculateOverall } from "../Utilities/calcOverall";
import type { metrics, SetMetrics } from "../Utilities/useMetrics";


export function Input({ vsConnect, metrics, funcs }:
  { vsConnect: vscode, metrics: { [key: string]: metrics }, funcs: { [key: string]: SetMetrics } }) {

  const [notReceived, setReceived] = useState(true);
  const [link, setLink] = useState('');

  function onClick() {
    if (link !== '' && link.includes('http://localhost:')) {
      vsConnect.postMessage({ command: 'live server link', text: link })
      setLink('');
      setReceived(false);
    }
  }

  const { setOverall, setFcp, setDomScore, setReqNum, setHydration } = funcs;
  const { overall, fcp, domScore, reqNum, hydration } = metrics;

  useEffect(() => {

    console.log('useEffect cycle run')

    window.addEventListener('message', (e) => {
      console.log('data: ', e.data.data);

      console.log('window listener count')

      const pupData = e.data.data; // PUPPETEER DATA;
      const {
        FCPNum, FCPScore, FCPColor,
        domCompleteNum, domScore: DOMScore, domColor,
        RequestNum, RequestScore, RequestColor,
        HydrationNum, HydrationScore, HydrationColor
      } = pupData;

      console.log(pupData);

      const { overallScore, overallColor } = calculateOverall(HydrationScore, RequestScore, DOMScore, FCPScore);

      switch (e.data.command) {
        case "performance metrics":
          setOverall({
            ...overall,
            name: 'Overall',
            data: [overallScore, 100 - overallScore],
            score: overallScore,
            color: overallColor
          })
          setFcp({
            ...fcp,
            name: 'First Contentful Paint',
            data: [FCPScore, 100 - FCPScore],
            score: FCPScore,
            color: FCPColor,
            number: FCPNum,
          })
          setDomScore({
            ...domScore,
            name: 'DOM Completion',
            data: [DOMScore, 100 - DOMScore],
            score: DOMScore,
            color: domColor,
            number: domCompleteNum,
          })
          setReqNum({
            ...reqNum,
            name: 'Request Time',
            data: [RequestScore, 100 - RequestScore],
            score: RequestScore,
            color: RequestColor,
            number: RequestNum,
          })
          setHydration({
            ...hydration,
            name: 'Hydration Time',
            data: [HydrationScore, 100 - HydrationScore],
            score: HydrationScore,
            color: HydrationColor,
            number: HydrationNum,
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