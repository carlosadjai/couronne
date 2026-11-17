import type { ReactElement } from 'react'

interface VersionsProps {
  electronVersion?: string
  platform?: string
  version?: string
}

function Versions({ electronVersion, platform, version }: VersionsProps): ReactElement {
  return (
    <ul className="versions" aria-label="Informations système">
      {version && <li className="app-version">Couronne v{version}</li>}
      {electronVersion && <li className="electron-version">Electron v{electronVersion}</li>}
      {platform && <li className="platform-version">Plateforme : {platform}</li>}
    </ul>
  )
}

export default Versions
