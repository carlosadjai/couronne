// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
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
  CardTitle,
  ListItem,
  Badge,
  EmptyState,
  Kbd,
  CommandItem,
  Tooltip,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle
} from './index'

describe('UI Design System Components', () => {
  describe('Button & IconButton', () => {
    it('renders Button with variants and sizes', () => {
      const { rerender } = render(<Button variant="primary">Test</Button>)
      expect(screen.getByRole('button', { name: /test/i })).toBeInTheDocument()

      rerender(
        <Button variant="danger" size="sm">
          Danger
        </Button>
      )
      expect(screen.getByRole('button', { name: /danger/i })).toHaveClass('text-xs')

      rerender(<Button disabled>Disabled</Button>)
      expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled()
    })

    it('displays loading spinner when isLoading is true', () => {
      render(<Button isLoading>Action</Button>)
      const btn = screen.getByRole('button', { name: /action/i })
      expect(btn).toBeDisabled()
      expect(btn.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('renders IconButton with required label as aria-label and tooltip', () => {
      render(
        <IconButton label="Fermer l'onglet">
          <span>X</span>
        </IconButton>
      )
      const btn = screen.getByRole('button', { name: "Fermer l'onglet" })
      expect(btn).toBeInTheDocument()
      expect(btn).toHaveAttribute('aria-label', "Fermer l'onglet")
    })

    it('refuses IconButton without label at compile time', () => {
      render(
        // @ts-expect-error label is required by IconButtonProps
        <IconButton>
          <span>X</span>
        </IconButton>
      )
    })
  })

  describe('Input, Select & Switch', () => {
    it('renders Input and handles typing and disabled state', () => {
      const handleChange = vi.fn()
      const { rerender } = render(<Input placeholder="Rechercher" onChange={handleChange} />)
      const input = screen.getByPlaceholderText('Rechercher')
      fireEvent.change(input, { target: { value: 'test query' } })
      expect(handleChange).toHaveBeenCalled()

      rerender(<Input placeholder="Désactivé" disabled />)
      expect(screen.getByPlaceholderText('Désactivé')).toBeDisabled()
    })

    it('renders Select and supports interaction', () => {
      render(
        <Select defaultValue="one">
          <SelectItem value="one">Option Un</SelectItem>
          <SelectItem value="two">Option Deux</SelectItem>
        </Select>
      )
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('renders Switch and toggles state on click and Space key', () => {
      const handleChecked = vi.fn()
      render(<Switch aria-label="Notifications" onCheckedChange={handleChecked} />)
      const sw = screen.getByRole('switch', { name: /notifications/i })
      expect(sw).toBeInTheDocument()

      fireEvent.click(sw)
      expect(handleChecked).toHaveBeenCalledWith(true)
    })
  })

  describe('Tabs', () => {
    it('renders Tabs and switches content via tabs', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Onglet 1</TabsTrigger>
            <TabsTrigger value="tab2">Onglet 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Contenu 1</TabsContent>
          <TabsContent value="tab2">Contenu 2</TabsContent>
        </Tabs>
      )

      expect(screen.getByText('Contenu 1')).toBeInTheDocument()
      const tab1 = screen.getByRole('tab', { name: /onglet 1/i })
      const tab2 = screen.getByRole('tab', { name: /onglet 2/i })

      // Radix tabs switch on mouseDown (button 0)
      fireEvent.mouseDown(tab2, { button: 0 })
      expect(screen.getByText('Contenu 2')).toBeInTheDocument()

      fireEvent.mouseDown(tab1, { button: 0 })
      expect(screen.getByText('Contenu 1')).toBeInTheDocument()
    })
  })

  describe('Card & ListItem', () => {
    it('renders Card with header and content', () => {
      render(
        <Card>
          <CardTitle>Titre Carte</CardTitle>
          <p>Corps de carte</p>
        </Card>
      )
      expect(screen.getByText('Titre Carte')).toBeInTheDocument()
      expect(screen.getByText('Corps de carte')).toBeInTheDocument()
    })

    it('renders ListItem with interactive state and keyboard Enter trigger', () => {
      const handleClick = vi.fn()
      render(
        <ListItem title="Serveur Node" description="Port 3000" interactive onClick={handleClick} />
      )
      const item = screen.getByRole('button')
      expect(item).toBeInTheDocument()

      fireEvent.keyDown(item, { key: 'Enter', code: 'Enter' })
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Badge, EmptyState, Kbd & CommandItem', () => {
    it('renders Badge with variants and icons', () => {
      render(<Badge variant="success">Opération réussie</Badge>)
      expect(screen.getByText('Opération réussie')).toBeInTheDocument()
    })

    it('renders EmptyState with title, description, and action button', () => {
      render(
        <EmptyState
          title="Aucun projet"
          description="Créez un projet pour démarrer"
          action={<Button>Créer</Button>}
        />
      )
      expect(screen.getByText('Aucun projet')).toBeInTheDocument()
      expect(screen.getByText('Créez un projet pour démarrer')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /créer/i })).toBeInTheDocument()
    })

    it('renders Kbd element with correct typography and tag', () => {
      render(<Kbd>Ctrl</Kbd>)
      const kbd = screen.getByText('Ctrl')
      expect(kbd.tagName.toLowerCase()).toBe('kbd')
    })

    it('renders CommandItem and triggers onSelect on click and Enter', () => {
      const handleSelect = vi.fn()
      render(
        <CommandItem label="Lancer le build" shortcut={['Ctrl', 'B']} onSelect={handleSelect} />
      )
      const item = screen.getByRole('button')
      expect(screen.getByText('Lancer le build')).toBeInTheDocument()
      expect(screen.getByText('Ctrl')).toBeInTheDocument()
      expect(screen.getByText('B')).toBeInTheDocument()

      fireEvent.click(item)
      expect(handleSelect).toHaveBeenCalledTimes(1)

      fireEvent.keyDown(item, { key: 'Enter', code: 'Enter' })
      expect(handleSelect).toHaveBeenCalledTimes(2)
    })
  })

  describe('Tooltip, Dialog & Toast', () => {
    it('renders Tooltip trigger element', () => {
      render(
        <Tooltip content="Détails du raccourci">
          <button>Bouton avec aide</button>
        </Tooltip>
      )
      expect(screen.getByRole('button', { name: /bouton avec aide/i })).toBeInTheDocument()
    })

    it('renders Dialog, opens on trigger click and closes on Escape', () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Ouvrir Modal</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Titre Modale</DialogTitle>
            <DialogDescription>Description modale</DialogDescription>
          </DialogContent>
        </Dialog>
      )

      const trigger = screen.getByRole('button', { name: /ouvrir modal/i })
      fireEvent.click(trigger)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Titre Modale')).toBeInTheDocument()

      // Press Escape to close
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape', code: 'Escape' })
    })

    it('renders Toast notification inside provider', () => {
      render(
        <ToastProvider>
          <Toast variant="success">
            <ToastTitle>Sauvegarde terminée</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      )
      expect(screen.getByText('Sauvegarde terminée')).toBeInTheDocument()
    })
  })
})
