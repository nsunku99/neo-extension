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
  const [domScore, setDomScore] = useMetrics();
  const [reqNum, setReqNum] = useMetrics();
  const [hydration, setHydration] = useMetrics();

  const [pageName, setPageName] = useState('');

  const pageObj = {
    pageName,
    setPageName
  };

  const metricsFunctions = {
    setOverall,
    setFcp,
    setDomScore,
    setReqNum,
    setHydration
  };

  const metricsObj = {
    overall,
    fcp,
    domScore,
    reqNum,
    hydration
  };


  return (
    <div className="min-h-[70vh]">
      <Input vsConnect={vsConnect} metrics={metricsObj} funcs={metricsFunctions} pageObj={pageObj} />
      <DonutDisplay metrics={metricsObj} pageObj={pageObj} />
    </div>

  )
}