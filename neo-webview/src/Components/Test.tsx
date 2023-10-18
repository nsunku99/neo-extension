// import { useContext } from "react"
// import { VsCodeApiContext } from "../Contexts/vsCodeContext";
import { useEffect, useState } from "react"
import { vscode } from "../App"

export function Test({ vsConnect }: { vsConnect: vscode }) {

  const [notReceived, setReceived] = useState(true);
  const [link, setLink] = useState('');

  function onClick() {
    if (link !== '' && link.includes('http://localhost:')) {
      vsConnect.postMessage({ command: 'live server link', text: link })
      setLink('');
      setReceived(false);
    }
  }

  useEffect(() => {

    window.addEventListener('message', (e) => {
      console.log('e: ', e);

    })

  })

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