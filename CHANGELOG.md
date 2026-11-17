# Journal des modifications

Toutes les modifications notables de ce projet seront consignées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/).

## [Non publié]

### Corrigé

- Correction de l'isolation du script preload : extraction des noms de canaux IPC (`names.ts`) sans dépendance vers le runtime Zod, garantissant l'absence de `require` externe dans l'environnement sandboxé.
- Ajout d'un test automatisé vérifiant l'absence de `require` tiers dans le bundle du preload.
- Correction d'une coquille orthographique dans `docs/BRIEF.md`.

### Ajouté

- Design System Couronne (Lot L2) :
  - Intégration de Tailwind CSS v4 via `@tailwindcss/vite` et jetons de design CSS variables.
  - Système de thèmes sombre (référence) et clair (miroir) via l'attribut `data-theme` sur `<html>`.
  - Hook `useTheme` gérant le mode système avec détection automatique des préférences OS, et sélection manuelle sombre/clair.
  - Validation et calibrage stricts des contrastes WCAG AA (texte $\ge 4{,}5:1$, bordures/focus $\ge 3{,}0:1$) documentés dans `docs/design-tokens.md`.
  - Polices embarquées sans dépendance CDN : Inter Variable et JetBrains Mono Variable.
  - Bibliothèque de 15 composants accessibles dans `src/renderer/src/ui/` (`Button`, `IconButton`, `Input`, `Select`, `Switch`, `Tabs`, `Card`, `ListItem`, `Badge`, `EmptyState`, `Kbd`, `CommandItem`, `Tooltip`, `Dialog`, `Toast`).
  - Monogramme de couronne vectoriel en 3 variantes (`docs/design/logo-options/`) avec variante A intégrée dans `resources/logo.svg`.
  - Page de démonstration complète intégrant la carte « Diagnostic du noyau » (preuve IPC de bout en bout).
- Noyau sécurisé Electron (Lot L1) : isolation des contextes (`contextIsolation`, `sandbox`, `webSecurity`), CSP stricte et blocage des navigations non autorisées.
- Contrats IPC typés et validés par Zod (`app:ping` et `app:info`) avec vérification des expéditeurs fiables (`isTrustedSender`) et assainissement des erreurs (`INTERNAL`, `INVALID_INPUT`, `FORBIDDEN_SENDER`).
- Preload minimal avec exposition restreinte à `window.couronne.app.*`.
- Journalisation tournante avec masquage automatique des secrets et jetons sensibles.
- Écran de démonstration React pour tester de bout en bout la chaîne IPC sécurisée.
- Configuration des fuses de sécurité pour electron-builder.
- Initialisation du dépôt et architecture de base (Lot L0).
- Configuration electron-vite avec React et TypeScript strict.
- Configuration des outils de qualité de code : ESLint, Prettier, Vitest, Husky et lint-staged.
- Intégration continue GitHub Actions multiplateforme (Windows, macOS, Ubuntu).
