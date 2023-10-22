
export function Footer() {
  return (
    <footer className="footer flex justify-between items-center h-[15vh]">
      <div>
        <img
          src="https://github.com/oslabs-beta/Neo/blob/main/public/Neo-White.png?raw=true"
          alt="Neo Logo"
          width={100} />
      </div>
      <div className="font-thin">
        © 2023 NEO, All rights reserved.
      </div>
      <div className="flex justify-center items-center flex-col font-thin">
        <p>NEO is an open-source project.</p>
        <p>Help us Improve!</p>
        <a href="https://github.com/nsunku99/neo-extension">
          <img
            src="https://github.com/oslabs-beta/Neo/blob/main/public/github-logo.png?raw=true"
            alt="GitHub Logo with a link"
            width={20} />
        </a>
      </div>
    </footer>
  )
}