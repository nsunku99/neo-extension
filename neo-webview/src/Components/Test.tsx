// import { useContext } from "react"
// import { VsCodeApiContext } from "../Contexts/vsCodeContext";
import { vscode } from "../App"

export function Test({ vsConnect }: { vsConnect: vscode }) {

  // const useVsCodeApi = useContext(VsCodeApiContext);

  return (
    <>
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