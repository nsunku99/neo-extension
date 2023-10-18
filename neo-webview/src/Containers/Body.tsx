import { vscode } from "../App"
import { Test } from "../Components/Test"

export function Body({ vsConnect }: { vsConnect: vscode }) {

  return (
    <div className="min-h-[70vh]">
      <Test vsConnect={vsConnect} />
    </div>

  )
}