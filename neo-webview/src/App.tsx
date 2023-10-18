import { Body } from "./Containers/Body";
import { Navbar } from "./Containers/NavBar";
import { Footer } from "./Containers/Footer";

export interface vscode {
  postMessage(message: unknown): void;
}

declare const vscode: vscode;
// const vscode = window.vscode; // lets react load on dev server


function App() {

  return (
    <>
      <Navbar />
      <Body vsConnect={vscode} />
      <Footer />
    </>
  )
}

export default App
