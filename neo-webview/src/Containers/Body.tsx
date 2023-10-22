import { vscode } from "../App"
import { Input } from "../Components/Input"
import { DonutDisplay } from "../Components/DonutDisplay";
import { useMetrics } from "../Utilities/useMetrics";
import { useState } from "react";

export type pageObj = {
  pageName: string,
  setPageName: React.Dispatch<React.SetStateAction<string>>
}

export function Body({ vsConnect }: { vsConnect: vscode }) {

  const [overall, setOverall] = useMetrics();
  const [fcp, setFcp] = useMetrics();
  const [dom, setDom] = useMetrics();
  const [reqNum, setReqNum] = useMetrics();
  const [ttfb, setTTFB] = useMetrics();
  const [tbt, setTBT] = useMetrics();
  const [lcp, setLCP] = useMetrics();

  const [pageName, setPageName] = useState('');

  const pageObj = {
    pageName,
    setPageName
  };

  const metricsFunctions = {
    setOverall,
    setFcp,
    setDom,
    setReqNum,
    setLCP,
    setTBT,
    setTTFB
  };

  const metricsObj = {
    overall,
    fcp,
    dom,
    reqNum,
    lcp,
    tbt,
    ttfb
  };


  return (
    <div className="min-h-[70vh]">
      <Input vsConnect={vsConnect} metrics={metricsObj} funcs={metricsFunctions} pageObj={pageObj} />
      <DonutDisplay metrics={metricsObj} pageObj={pageObj} />
    </div>

  )
}