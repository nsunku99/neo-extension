import { vscode } from "../App"
import { Input } from "../Components/Input"
import { DonutDisplay } from "../Components/DonutDisplay";
import { useMetrics } from "../Utilities/useMetrics";

export function Body({ vsConnect }: { vsConnect: vscode }) {

  const [overall, setOverall] = useMetrics();
  const [fcp, setFcp] = useMetrics();
  const [domScore, setDomScore] = useMetrics();
  const [reqNum, setReqNum] = useMetrics();
  const [hydration, setHydration] = useMetrics();

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
      <Input vsConnect={vsConnect} metrics={metricsObj} funcs={metricsFunctions} />
      <DonutDisplay metrics={metricsObj} />
    </div>

  )
}