# Journal des modifications

Toutes les modifications notables de ce projet seront consignées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/).

## [Non publié]

### Ajouté

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
