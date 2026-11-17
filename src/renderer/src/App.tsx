import { useState, useEffect, type ReactElement } from 'react'
import {
  useTheme,
  Logo,
  Button,
  IconButton,
  Input,
  Select,
  SelectItem,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  ListItem,
  Badge,
  EmptyState,
  Kbd,
  CommandItem,
  Tooltip,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose
} from './ui'
import {
  Sun,
  Moon,
  Laptop,
  Activity,
  Terminal,
  FolderGit2,
  Trash2,
  Plus,
  Search,
  Settings,
  Sparkles,
  Inbox,
  AlertCircle,
  Play
} from 'lucide-react'
import type { InfoOutput } from '../../shared/ipc/channels'

interface FeedbackState {
  type: 'success' | 'error'
  code?: string
  message: string
  timestamp?: string
}

interface ToastState {
  id: string
  title: string
  description?: string
  variant: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
}

export default function App(): ReactElement {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [appInfo, setAppInfo] = useState<InfoOutput | null>(null)
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Demo interactive states
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState('dev')
  const [switchState, setSwitchState] = useState(true)
  const [toasts, setToasts] = useState<ToastState[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const showToast = (
    title: string,
    description: string,
    variant: 'neutral' | 'success' | 'warning' | 'danger' | 'info' = 'neutral'
  ): void => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, title, description, variant }])
  }

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
        showToast('Ping réussi', res.data.reply, 'success')
      } else {
        setFeedback({
          type: 'error',
          code: res.error.code,
          message: res.error.message
        })
        showToast("Erreur d'appel", `${res.error.code} : ${res.error.message}`, 'danger')
      }
    } catch {
      setFeedback({
        type: 'error',
        code: 'INTERNAL',
        message: 'Erreur inattendue'
      })
      showToast('Erreur', 'INTERNAL : Erreur inattendue', 'danger')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInvalidPing = async (): Promise<void> => {
    setIsLoading(true)
    try {
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
        showToast('Validation IPC', `Code: ${res.error.code}`, 'danger')
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

  const tokensList = [
    { name: '--bg', label: 'Fond principal' },
    { name: '--surface', label: 'Surface cartes' },
    { name: '--border', label: 'Bordure neutre' },
    { name: '--text', label: 'Texte principal' },
    { name: '--text-muted', label: 'Texte atténué' },
    { name: '--accent', label: 'Doré accent fond' },
    { name: '--accent-fg', label: 'Texte sur doré' },
    { name: '--accent-text', label: 'Doré accent texte' },
    { name: '--focus-ring', label: 'Anneau de focus' },
    { name: '--danger', label: 'Danger / Erreur' },
    { name: '--warning', label: 'Avertissement' },
    { name: '--success', label: 'Succès' },
    { name: '--info', label: 'Information' }
  ]

  return (
    <ToastProvider swipeDirection="right">
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors p-6 pb-24 max-w-6xl mx-auto space-y-10">
        {/* Header with Title and Theme Switcher */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <Logo size={40} className="text-[var(--accent-text)]" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">Couronne</h1>
                <Badge variant="neutral" size="sm">
                  Design System — Lot L2
                </Badge>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Tableau de bord de développeur pour le bureau • Thème {resolvedTheme} ({theme})
              </p>
            </div>
          </div>

          {/* Theme switcher */}
          <div className="flex items-center bg-[var(--surface)] p-1 rounded-[var(--radius-md)] border border-[var(--border)]">
            <Button
              variant={theme === 'system' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTheme('system')}
              className="text-xs"
              leftIcon={<Laptop size={14} />}
            >
              Système
            </Button>
            <Button
              variant={theme === 'dark' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTheme('dark')}
              className="text-xs"
              leftIcon={<Moon size={14} />}
            >
              Sombre
            </Button>
            <Button
              variant={theme === 'light' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTheme('light')}
              className="text-xs"
              leftIcon={<Sun size={14} />}
            >
              Clair
            </Button>
          </div>
        </header>

        {/* Diagnostic du noyau card (Proof of L1 IPC) */}
        <Card className="border-[var(--accent)]/40 bg-[var(--surface)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-[var(--accent-text)]" />
                <CardTitle>Diagnostic du noyau (Preuve IPC L1)</CardTitle>
              </div>
              <Badge variant="success">IPC Valide</Badge>
            </div>
            <CardDescription>
              Vérification de la chaîne de communication contextBridge et validation Zod.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              data-testid="app-info"
              className="p-3 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--border)] font-mono text-xs flex flex-wrap gap-4 items-center"
            >
              <div>
                <span className="text-[var(--text-muted)]">Application: </span>
                <span className="font-semibold">
                  {appInfo ? appInfo.name : 'Initialisation du noyau…'}
                </span>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Version: </span>
                <span className="font-semibold">{appInfo ? `v${appInfo.version}` : '…'}</span>
              </div>
              {appInfo && (
                <>
                  <div>
                    <span className="text-[var(--text-muted)]">Plateforme: </span>
                    <span className="font-semibold">{appInfo.platform}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">Electron: </span>
                    <span className="font-semibold">v{appInfo.electronVersion}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                data-testid="ping-button"
                variant="primary"
                onClick={handleValidPing}
                isLoading={isLoading}
                leftIcon={<Play size={14} />}
              >
                Ping
              </Button>
              <Button
                data-testid="invalid-button"
                variant="danger"
                onClick={handleInvalidPing}
                isLoading={isLoading}
                leftIcon={<AlertCircle size={14} />}
              >
                Envoyer une donnée invalide
              </Button>
            </div>

            {feedback && (
              <div
                data-testid="feedback-container"
                className={`p-3 rounded-[var(--radius-sm)] border text-xs font-mono ${
                  feedback.type === 'success'
                    ? 'feedback-success bg-[var(--success-surface)] text-[var(--success)] border-[var(--success)]/40'
                    : 'feedback-error bg-[var(--danger-surface)] text-[var(--danger)] border-[var(--danger)]/40'
                }`}
              >
                {feedback.type === 'success' ? (
                  <div>
                    <div>Réponse reçue : {feedback.message}</div>
                    {feedback.timestamp && (
                      <div className="opacity-80 text-[10px] mt-1">
                        Horodatage : {feedback.timestamp}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div>Code d&apos;erreur : {feedback.code}</div>
                    <div className="opacity-80 mt-0.5">{feedback.message}</div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section: Logo Couronne */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-[var(--text-muted)]">
            Logo Monogramme (Variante A — 16, 32, 56 px)
          </h2>
          <Card>
            <CardContent className="flex flex-wrap items-end gap-12 py-6">
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center">
                  <Logo size={16} />
                </div>
                <span className="text-xs text-[var(--text-muted)] font-mono">16 px (système)</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center">
                  <Logo size={32} />
                </div>
                <span className="text-xs text-[var(--text-muted)] font-mono">32 px (en-tête)</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center">
                  <Logo size={56} />
                </div>
                <span className="text-xs text-[var(--text-muted)] font-mono">56 px (bulle)</span>
              </div>

              <div className="flex-1 min-w-[260px] p-4 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--border)] space-y-1 text-xs">
                <p className="font-semibold text-[var(--text)]">Variantes disponibles</p>
                <p className="text-[var(--text-muted)]">
                  Trois options vectorielles créées dans{' '}
                  <code className="font-mono text-[var(--accent-text)]">
                    docs/design/logo-options/
                  </code>{' '}
                  (a.svg, b.svg, c.svg). Variante A retenue par défaut dans{' '}
                  <code className="font-mono text-[var(--accent-text)]">resources/logo.svg</code>.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section: Design Tokens & Palette */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-[var(--text-muted)]">
            Palette & Tokens Validés (Contraste WCAG AA)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {tokensList.map((tok) => (
              <div
                key={tok.name}
                className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between h-20"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-4 h-4 rounded-full border border-black/10"
                    style={{ backgroundColor: `var(${tok.name})` }}
                  />
                  <span className="text-[10px] text-[var(--text-muted)] truncate">{tok.label}</span>
                </div>
                <div className="font-mono text-[11px] font-medium truncate">{tok.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: 15 UI Components Demonstration */}
        <section className="space-y-6">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-[var(--text-muted)]">
            Composants de l&apos;Interface (15 composants)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1 & 2: Button & IconButton */}
            <Card>
              <CardHeader>
                <CardTitle>1 & 2. Button & IconButton</CardTitle>
                <CardDescription>
                  Variantes primaire, secondaire, discrète (ghost), danger, tailles et états.
                  IconButton exige la propriété label pour l&apos;accessibilité.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <Button variant="primary" size="sm">
                    Primaire
                  </Button>
                  <Button variant="secondary" size="sm">
                    Secondaire
                  </Button>
                  <Button variant="ghost" size="sm">
                    Ghost
                  </Button>
                  <Button variant="danger" size="sm">
                    Danger
                  </Button>
                  <Button variant="primary" size="sm" isLoading>
                    Chargement
                  </Button>
                  <Button variant="secondary" size="sm" disabled>
                    Désactivé
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-[var(--border)]">
                  <IconButton label="Rechercher des projets" variant="ghost">
                    <Search size={16} />
                  </IconButton>
                  <IconButton label="Créer un nouveau port ou raccourci" variant="primary">
                    <Plus size={16} />
                  </IconButton>
                  <IconButton label="Paramètres de l'application" variant="secondary">
                    <Settings size={16} />
                  </IconButton>
                  <IconButton label="Supprimer l'élément" variant="danger">
                    <Trash2 size={16} />
                  </IconButton>
                  <IconButton label="Bouton désactivé" variant="secondary" disabled>
                    <Sparkles size={16} />
                  </IconButton>
                </div>
              </CardContent>
            </Card>

            {/* 3, 4, 5: Input, Select & Switch */}
            <Card>
              <CardHeader>
                <CardTitle>3, 4, 5. Input, Select & Switch</CardTitle>
                <CardDescription>
                  Champs de saisie, sélection Radix et commutateur accessible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Filtrer les processus ou commandes…"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  leftIcon={<Search size={15} />}
                />

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-[160px]">
                    <Select value={selectValue} onValueChange={setSelectValue}>
                      <SelectItem value="dev">Environnement Dev</SelectItem>
                      <SelectItem value="staging">Préproduction</SelectItem>
                      <SelectItem value="prod">Production</SelectItem>
                    </Select>
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch
                      id="demo-switch"
                      checked={switchState}
                      onCheckedChange={setSwitchState}
                    />
                    <label htmlFor="demo-switch" className="text-xs cursor-pointer select-none">
                      Surveillance active
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 6 & 7: Tabs & Card */}
            <Card>
              <CardHeader>
                <CardTitle>6 & 7. Tabs & Card</CardTitle>
                <CardDescription>
                  Navigation par onglets au clavier et conteneurs d&apos;informations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="ports">
                  <TabsList>
                    <TabsTrigger value="ports">Ports (3)</TabsTrigger>
                    <TabsTrigger value="docker">Docker (2)</TabsTrigger>
                    <TabsTrigger value="git">Dépôts Git</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="ports"
                    className="p-3 bg-[var(--bg)] rounded-[var(--radius-sm)] border border-[var(--border)] text-xs space-y-1"
                  >
                    <div className="font-medium text-[var(--accent-text)]">
                      3000 • Vite Dev Server (Couronne)
                    </div>
                    <div className="text-[var(--text-muted)]">5432 • PostgreSQL Local</div>
                  </TabsContent>
                  <TabsContent
                    value="docker"
                    className="p-3 bg-[var(--bg)] rounded-[var(--radius-sm)] border border-[var(--border)] text-xs"
                  >
                    <div className="text-[var(--text-muted)]">
                      Conteneurs actifs : redis, postgres
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="git"
                    className="p-3 bg-[var(--bg)] rounded-[var(--radius-sm)] border border-[var(--border)] text-xs"
                  >
                    <div className="text-[var(--text-muted)]">
                      Branche courante : feat/lot-02-design-systeme
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="text-xs text-[var(--text-muted)]">
                Navigation accessible au clavier (Flèches gauche/droite, Tab)
              </CardFooter>
            </Card>

            {/* 8, 9 & 11: ListItem, Badge & Kbd */}
            <Card>
              <CardHeader>
                <CardTitle>8, 9 & 11. ListItem, Badge & Kbd</CardTitle>
                <CardDescription>
                  Lignes denses de tableau de bord avec statuts visuels et raccourcis clavier.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1.5">
                <ListItem
                  icon={<Terminal size={16} />}
                  title="Couronne Renderer"
                  description="Port 5173 • En cours d'exécution"
                  trailing={<Badge variant="success">Actif</Badge>}
                  interactive
                  onClick={() => showToast('Élément cliqué', 'Couronne Renderer sélectionné')}
                />
                <ListItem
                  icon={<FolderGit2 size={16} />}
                  title="couronne-skills"
                  description="D:\couronne-skills • main"
                  trailing={<Badge variant="info">Synchronisé</Badge>}
                  interactive
                  onClick={() => showToast('Élément cliqué', 'Dépôt Git sélectionné')}
                />
                <ListItem
                  icon={<AlertCircle size={16} />}
                  title="Vérification thermique"
                  description="Charge CPU modérée • Protection active"
                  trailing={<Badge variant="warning">Surveillance</Badge>}
                />

                <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)] items-center">
                  <span className="text-xs text-[var(--text-muted)]">Badges :</span>
                  <Badge variant="neutral">Neutre</Badge>
                  <Badge variant="success">Succès</Badge>
                  <Badge variant="warning">Alerte</Badge>
                  <Badge variant="danger">Erreur</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </CardContent>
            </Card>

            {/* 10 & 12: EmptyState & CommandItem */}
            <Card>
              <CardHeader>
                <CardTitle>10 & 12. EmptyState & CommandItem</CardTitle>
                <CardDescription>
                  État vide accessible et lignes visuelles de la palette de commandes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CommandItem
                  icon={<Terminal size={16} />}
                  label="Ouvrir le terminal du projet"
                  description="PowerShell"
                  shortcut={['Ctrl', '`']}
                  onSelect={() => showToast('Action', 'Commande terminal exécutée')}
                />
                <CommandItem
                  icon={<Settings size={16} />}
                  label="Ouvrir les réglages"
                  shortcut={['Ctrl', ',']}
                  selected
                  onSelect={() => showToast('Action', 'Réglages ouverts')}
                />

                <EmptyState
                  icon={<Inbox size={24} />}
                  title="Aucun processus orphelin"
                  description="Tous les processus enfants sont correctement surveillés par le noyau."
                  action={
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        showToast('Actualisation', 'Recherche terminée : aucun orphelin')
                      }
                    >
                      Actualiser
                    </Button>
                  }
                />
              </CardContent>
            </Card>

            {/* 13, 14 & 15: Tooltip, Dialog & Toast */}
            <Card>
              <CardHeader>
                <CardTitle>13, 14 & 15. Tooltip, Dialog & Toast</CardTitle>
                <CardDescription>
                  Infobulles au survol / focus, boîte modale et notifications système.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3 items-center">
                  <Tooltip content="Infobulle accessible avec raccourci clavier">
                    <Button variant="secondary" size="sm">
                      Survoler ou cibler avec Tab
                    </Button>
                  </Tooltip>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="primary" size="sm">
                        Ouvrir le Dialog
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmation d&apos;arrêt de service</DialogTitle>
                        <DialogDescription>
                          Voulez-vous vraiment libérer le port 3000 ? Le processus associé sera
                          arrêté.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-2 text-xs text-[var(--text-muted)]">
                        Cette boîte modale se ferme avec la touche <Kbd>Échap</Kbd> ou le bouton
                        Fermer. Le focus est automatiquement restitué au déclencheur.
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="ghost" size="sm">
                            Annuler
                          </Button>
                        </DialogClose>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setIsDialogOpen(false)
                            showToast(
                              'Port libéré',
                              'Le service a été arrêté avec succès',
                              'success'
                            )
                          }}
                        >
                          Confirmer l&apos;arrêt
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="pt-2 border-t border-[var(--border)] space-y-2">
                  <p className="text-xs text-[var(--text-muted)] font-medium">
                    Déclencher une notification Toast :
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        showToast('Information', 'Mise à jour disponible en local', 'info')
                      }
                    >
                      Toast Info
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => showToast('Alerte', 'Charge thermique détectée', 'warning')}
                    >
                      Toast Alerte
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        showToast('Succès', 'Conteneur démarré sur le port 5432', 'success')
                      }
                    >
                      Toast Succès
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Toast Viewport and Root render */}
        {toasts.map((t) => (
          <Toast
            key={t.id}
            variant={t.variant}
            onOpenChange={(open) => {
              if (!open) {
                setToasts((prev) => prev.filter((item) => item.id !== t.id))
              }
            }}
          >
            <ToastTitle>{t.title}</ToastTitle>
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </div>
    </ToastProvider>
  )
}
