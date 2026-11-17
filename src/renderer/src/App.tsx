import { useState, useEffect } from 'react'
import type { ReactElement } from 'react'
import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import type { InfoOutput } from '../../shared/ipc/channels'

interface FeedbackState {
  type: 'success' | 'error'
  code?: string
  message: string
  timestamp?: string
}

function App(): ReactElement {
  const [appInfo, setAppInfo] = useState<InfoOutput | null>(null)
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    let isMounted = true
    const loadInfo = async (): Promise<void> => {
      try {
        if (window.couronne?.app?.info) {
          const res = await window.couronne.app.info()
          if (isMounted && res.ok) {
            setAppInfo(res.data)
          }
        }
      } catch (err) {
        console.error('Failed to load application info:', err)
      }
    }

    void loadInfo()
    return (): void => {
      isMounted = false
    }
  }, [])

  const handleValidPing = async (): Promise<void> => {
    setIsLoading(true)
    try {
      const res = await window.couronne.app.ping({ message: 'Ping Couronne' })
      if (res.ok) {
        setFeedback({
          type: 'success',
          message: res.data.reply,
          timestamp: res.data.receivedAt
        })
      } else {
        setFeedback({
          type: 'error',
          code: res.error.code,
          message: res.error.message
        })
      }
    } catch {
      setFeedback({
        type: 'error',
        code: 'INTERNAL',
        message: 'Erreur inattendue'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInvalidPing = async (): Promise<void> => {
    setIsLoading(true)
    try {
      // Intentionally sending invalid payload: empty string (min length 1 expected)
      const res = await window.couronne.app.ping({ message: '' } as unknown as { message: string })
      if (res.ok) {
        setFeedback({
          type: 'success',
          message: res.data.reply,
          timestamp: res.data.receivedAt
        })
      } else {
        setFeedback({
          type: 'error',
          code: res.error.code,
          message: res.error.message
        })
      }
    } catch {
      setFeedback({
        type: 'error',
        code: 'INTERNAL',
        message: 'Erreur inattendue'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <img alt="Couronne Logo" className="logo" src={electronLogo} draggable={false} />
      <div className="creator">Couronne — Noyau Sécurisé (Lot L1)</div>
      <div className="text" data-testid="app-info">
        {appInfo ? (
          <span>
            {appInfo.name} <span className="react">v{appInfo.version}</span>
          </span>
        ) : (
          <span>Initialisation du noyau...</span>
        )}
      </div>

      <p className="tip">Démonstration de la chaîne IPC typée et validée par Zod</p>

      <div className="actions">
        <div className="action">
          <button
            type="button"
            data-testid="ping-button"
            onClick={(): Promise<void> => handleValidPing()}
            disabled={isLoading}
          >
            Ping
          </button>
        </div>
        <div className="action">
          <button
            type="button"
            data-testid="invalid-button"
            onClick={(): Promise<void> => handleInvalidPing()}
            disabled={isLoading}
          >
            Envoyer une donnée invalide
          </button>
        </div>
        <div className="action">
          <a
            href="https://github.com/carlosadjai/couronne"
            target="_blank"
            rel="noreferrer"
            data-testid="external-link"
          >
            Dépôt GitHub
          </a>
        </div>
      </div>

      {feedback && (
        <div
          data-testid="feedback-container"
          className={`feedback-box ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}
          role="status"
        >
          {feedback.type === 'success' ? (
            <div>
              <strong>Réponse reçue :</strong> {feedback.message}
              {feedback.timestamp && (
                <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>
                  Heure : {feedback.timestamp}
                </div>
              )}
            </div>
          ) : (
            <div>
              <strong>Code d&apos;erreur : {feedback.code}</strong>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>{feedback.message}</div>
            </div>
          )}
        </div>
      )}

      <Versions
        version={appInfo?.version}
        electronVersion={appInfo?.electronVersion}
        platform={appInfo?.platform}
      />
    </>
  )
}

export default App
