# Couronne — Brief de projet

Nov 10, 2026 · @Carlos ADJAÏ

## Vision et périmètre

Couronne est un tableau de bord de développeur, local et gratuit, qui réunit dans une bulle flottante les outils du quotidien : lancer ses projets, savoir qui occupe un port, suivre GitHub et Docker, utiliser les petits utilitaires (JWT, JSON, Base64, UUID, regex). Un clic, tout est là, sans compte ni serveur extérieur.

**Public** : d'abord Carlos, utilisateur zéro, puis les développeurs francophones et internationaux qui jonglent entre éditeur, terminal, navigateur et serveurs de dev.

**Objectifs**

1. Remplacer dix fenêtres et vingt commandes retrouvées à la main par un seul point d'entrée.
2. Livrer une application de qualité professionnelle : sûre, rapide, accessible, mise à jour en un clic.
3. Rester modulaire : ajouter un outil ne doit jamais toucher aux autres.

**Inclus dans la v1.0**

- Bulle flottante, panneau, icône de barre système, raccourci global, palette Ctrl + K
- Projets (VS Code, terminal, serveurs de dev), ports et processus
- Utilitaires développeur, historique du presse-papiers, commandes favorites, chrono et Pomodoro
- GitHub, Docker, testeur d'API, clés SSH, alerte thermique et de charge (Windows d'abord)
- Thèmes clair et sombre, français et anglais
- Installeurs Windows, macOS et Linux avec mises à jour automatiques

**Exclu de la v1.0** : mails, agenda, notes, coffre de mots de passe, synchronisation cloud, comptes utilisateurs, extensions tierces. Décidé : mails, agenda et notes viennent après la v1.0 ; le coffre de mots de passe est exclu (voir la dernière section).

**Critères de succès (objectifs proposés)**

- Panneau ouvert en moins de 300 ms après le raccourci.
- Moins de 250 Mo de mémoire au repos.
- Installation en un seul fichier, aucune configuration, aucun compte.
- Build et tests verts sur Windows, macOS et Linux à chaque version.

## Principes directeurs

Cinq règles tranchent tous les arbitrages techniques et de design.

1. **Local d'abord.** Les données restent sur la machine. Aucun compte, aucune télémétrie. Les seuls appels réseau sont ceux que l'utilisateur déclenche (GitHub, vérification des mises à jour).
2. **Sécurité par construction.** Le code de l'interface n'a aucun accès direct au système. Tout passe par un canal typé, validé et limité à ce qui est nécessaire.
3. **Un outil = un module.** Chaque outil vit dans son dossier, avec son contrat, son service et son écran. On l'ajoute ou on le retire sans toucher au reste.
4. **Multiplateforme dès la première ligne.** Tout ce qui dépend du système passe par un adaptateur. Windows est la cible de test principale, macOS et Linux restent compilables et testés en CI.
5. **Clavier d'abord, rapidité ensuite.** Toute action est accessible par la palette Ctrl + K. L'interface s'ouvre instantanément et ne bloque jamais sur une tâche longue.

## Design système

Le design système repose sur des variables CSS (tokens) partagées par tous les composants. Le thème sombre est le thème de référence, le thème clair en est le miroir.

### Identité

Sobre, dense et lisible, comme un outil d'atelier. La couronne sert de symbole : un monogramme simple, lisible à 16 px dans la barre système et à 56 px dans la bulle. Le doré est la seule couleur de marque, il signale l'action principale et l'état actif. Le logo reste à dessiner (livrable du lot L2) ; il peut rappeler la marque *La Couronne du Roi*.

### Couleurs

Valeurs de départ, à valider au contraste WCAG AA (4,5:1 pour le texte) avant figement.

| Token | Sombre | Clair |
| --- | --- | --- |
| `--bg` (fond) | #0F1115 | #FAFAF7 |
| `--surface` (cartes, panneau) | #171A21 | #FFFFFF |
| `--border` | #262B36 | #E4E4DE |
| `--text` | #E6E8EE | #1B1E24 |
| `--text-muted` | #9AA3B2 | #5B6472 |
| `--accent` (or) | #E3B341 | #B8860B |
| `--success` | #3FB950 | #1A7F37 |
| `--warning` | #D29922 | #9A6700 |
| `--danger` | #F85149 | #CF222E |
| `--info` | #58A6FF | #0969DA |

Les états (succès, échec de test, alerte de port) utilisent toujours une icône en plus de la couleur.

### Typographie, espacement, forme

- **Polices** : Inter pour l'interface, JetBrains Mono pour le code, embarquées dans l'application (pas de CDN, cohérent avec le local d'abord).
- **Échelle** : 12, 13, 14, 16, 20, 24 px. Corps de texte à 13 ou 14 px, panneau dense.
- **Espacement** : base de 4 px (4, 8, 12, 16, 24, 32).
- **Rayons** : 6 px (champs, boutons), 10 px (cartes), cercle complet (bulle).
- **Mouvement** : transitions de 120 à 180 ms ; désactivées si l'utilisateur demande moins d'animations.

### Composants

Base : Radix UI (accessibilité et comportement au clavier) habillé avec Tailwind, selon le modèle de shadcn/ui, et icônes lucide-react. Composants du lot L2 : Button, IconButton, Input, Select, Switch, Tabs, Card, ListItem, Badge, Tooltip, Dialog, Toast, EmptyState, Kbd (affichage des raccourcis), CommandItem.

### La bulle et le panneau

- **Bulle** : cercle de 56 px, toujours au premier plan, déplaçable, aimantée aux bords de l'écran, position mémorisée. États : repos, survol, alerte (pastille : test en échec, PR à relire), occupé.
- **Panneau** : fenêtre sans bordure d'environ 420 × 640 px, ancrée à la bulle, se ferme avec Échap ou au clic à l'extérieur. Navigation par modules en rail latéral.
- **Palette** : Ctrl + K (Cmd + K sur macOS) à l'intérieur du panneau ; raccourci global configurable pour afficher ou masquer Couronne.

### Langues et accessibilité

- Français par défaut, anglais complet. Aucun texte en dur : tout passe par des clés i18next.
- Navigation complète au clavier, focus toujours visible, contraste AA, tailles de police réglables, respect des préférences système (thème, animations).

## Architecture

&#91;embedded content: architecture · 3 couches, 1 pont typé\]

L’application suit le découpage standard d’Electron, avec une règle stricte : l’interface n’a aucun accès au système. Elle appelle des fonctions nommées exposées par le preload ; le processus principal valide chaque appel, l’exécute dans un module, et passe par l’adaptateur de plateforme pour tout ce qui touche au système.

### Un module = un dossier

```text
couronne-skills/                    # racine du dépôt : D:\couronne-skills
├─ src/
│  ├─ main/               # processus principal
│  │  ├─ core/            # fenêtres, barre système, raccourcis, réglages, journal, mises à jour
│  │  ├─ platform/        # interface PlatformAdapter + win32.ts, darwin.ts, linux.ts
│  │  └─ ipc/             # enregistrement des canaux et validation
│  ├─ preload/            # contextBridge : API typée exposée à l’interface
│  ├─ renderer/           # React
│  │  ├─ ui/              # composants du design système
│  │  └─ shell/           # bulle, panneau, palette, rail de navigation
│  ├─ modules/            # un dossier par outil
│  │  └─ ports/
│  │     ├─ manifest.ts   # id, nom, icône, commandes de la palette
│  │     ├─ contract.ts   # canaux IPC + schémas Zod (partagé)
│  │     ├─ service.ts    # logique côté principal, testable sans interface
│  │     ├─ View.tsx      # écran React
│  │     └─ ports.test.ts
│  └─ shared/             # types et constantes communs
├─ resources/             # icônes, ressources d’installeur
├─ e2e/                   # tests Playwright
├─ docs/lots/             # fiches de lot
└─ .github/workflows/     # CI et release
```

### Contrat IPC

- Un canal par action, nommé `module:action` (`ports:list`, `projects:launch`). Entrées, sorties et erreurs sont décrites par des schémas Zod partagés : les types TypeScript en sont déduits des deux côtés.
- Les événements poussés par le principal (journaux d’un serveur de dev, changement d’état d’un port) passent par des abonnements explicites, désinscrits à la fermeture de l’écran.
- Une erreur est toujours un objet typé (`code`, `message`), jamais une exception brute transmise à l’interface.

### Données et cycle de vie

- **Réglages** : electron-store avec schéma et migrations de version, dans le dossier de données de l’utilisateur.
- **Données volumineuses** (historique du presse-papiers) : SQLite à partir du lot L10.
- **Secrets** : chiffrés avec `safeStorage`, jamais dans les réglages.
- **Services** : démarrés à l’activation d’un module, arrêtés proprement à la fermeture de Couronne. Tout processus enfant (serveur de dev, journal Docker) est suivi et terminé : aucun processus orphelin.

## Sécurité

Couronne lance des processus, lit des dossiers et manipule des jetons : la sécurité fait partie du socle, pas d'une phase finale.

- **Isolation de l'interface** : `contextIsolation` activé, `nodeIntegration` désactivé, `sandbox` activé. Le preload expose uniquement des fonctions nommées, jamais `ipcRenderer` en entier.
- **Fuses Electron** : désactiver `RunAsNode` et l'inspection par variable d'environnement, charger l'application uniquement depuis l'archive ASAR.
- **Canaux IPC** : liste blanche, un nom par action (`ports:list`, `projects:launch`). Chaque message entrant est validé avec Zod côté principal, et l'origine de l'émetteur est vérifiée.
- **Exécution de commandes** : toujours `spawn` ou `execFile` avec un tableau d'arguments, jamais une chaîne passée à un shell. Les actions destructrices (arrêter un processus, supprimer un conteneur) demandent une confirmation explicite.
- **Commandes favorites** : exécutées uniquement sur action de l'utilisateur, jamais automatiquement, et affichées en clair avant lancement.
- **Navigation** : toute navigation et toute ouverture de fenêtre inattendues sont bloquées ; les liens externes s'ouvrent dans le navigateur après contrôle (https uniquement). CSP stricte dans l'interface.
- **Secrets** : jetons GitHub et autres identifiants chiffrés avec `safeStorage` (stockage du système : DPAPI, Keychain, libsecret), jamais en clair dans un fichier JSON. Connexion GitHub par le flux appareil (device flow), sans secret embarqué dans l'application.
- **Réseau** : aucune télémétrie. Appels sortants limités à GitHub, aux mises à jour et aux actions que l'utilisateur lance.
- **Mises à jour** : publiées via GitHub Releases, vérifiées par electron-updater (empreintes). Dépendances surveillées (Dependabot, `npm audit` en CI), versions d'Electron suivies de près pour les correctifs de sécurité.
- **Journaux** : jamais de jeton ni de contenu de presse-papiers dans les logs.

## Pile technique

Tout est en TypeScript, avec les technologies que Carlos maîtrise déjà (React, Node.js). Les versions exactes sont figées à l'initialisation du dépôt (dernières versions stables), puis mises à jour régulièrement.

| Domaine | Choix | Raison |
| --- | --- | --- |
| Application bureau | Electron | Même code sur Windows, macOS et Linux ; React et Node sans nouvel apprentissage |
| Outil de build | electron-vite | Rechargement à chaud, séparation claire main / preload / renderer |
| Langage | TypeScript en mode strict | Contrats IPC typés de bout en bout |
| Interface | React | Déjà maîtrisé |
| Styles et composants | Tailwind CSS, Radix UI, lucide-react | Tokens partagés, accessibilité native, icônes cohérentes |
| État de l'interface | Zustand | Léger, sans surcharge |
| Validation | Zod | Schémas partagés entre preload, main et renderer |
| Traductions | i18next | Standard, extraction des clés |
| Paramètres | electron-store, avec schéma | Simple, fichier JSON par utilisateur |
| Données volumineuses (presse-papiers, notes) | SQLite via better-sqlite3, introduit au lot L10 | Recherche rapide ; module natif à recompiler par plateforme, d'où son introduction tardive |
| Tests | Vitest, Testing Library, Playwright pour Electron | Unitaires, composants, bout en bout |
| Qualité | ESLint, Prettier, TypeScript strict, Husky + lint-staged | Rien de cassé ne part en commit |
| Packaging | electron-builder | Installeurs pour les trois systèmes |
| Mises à jour | electron-updater avec GitHub Releases | Gratuit, intégré à electron-builder |
| CI/CD | GitHub Actions (Windows, macOS, Linux) | Build et tests sur les trois systèmes sans posséder les machines |

## Roadmap

&#91;embedded content: roadmap · 5 phases, 5 portes\]

Cinq phases sur environ quatorze semaines, en supposant 10 heures de travail par semaine : durée indicative, à recalibrer après le lot L3. Une phase ne démarre qu'une fois sa porte franchie. Le contenu de chaque lot est détaillé dans la section suivante.

## Découpage en lots

Dix-sept lots, chacun livrable et testable seul. Un lot ne démarre que lorsque ses dépendances sont fusionnées.

| Lot | Phase | Objectif et livrables | Dépend de | Critère d'acceptation |
| --- | --- | --- | --- | --- |
| L0 Initialisation | 0 | Dépôt Git créé dans le répertoire vierge D:\\couronne-skills, electron-vite, TypeScript strict, ESLint, Prettier, Vitest, hooks, CI minimale | — | `npm run dev`, `lint`, `test` et `build` passent sur les trois systèmes en CI |
| L1 Noyau Electron | 0 | Processus main, preload, renderer, IPC typé avec Zod, réglages de sécurité, journalisation | L0 | Appel IPC de test validé de bout en bout ; une donnée invalide est rejetée |
| L2 Design système | 1 | Tokens, thèmes clair et sombre, composants de base, logo, page de démonstration des composants | L1 | Tous les composants listés rendus dans les deux thèmes, contraste AA vérifié |
| L3 Bulle et panneau | 1 | Bulle flottante aimantée, panneau ancré, icône de barre système, raccourci global, position mémorisée | L1, L2 | Raccourci affiche et masque le panneau ; position retrouvée après redémarrage |
| L4 Palette et modules | 1 | Registre de modules, manifestes, rail de navigation, palette Ctrl + K | L2, L3 | Un module factice apparaît dans la palette et le rail sans modifier le noyau |
| L5 Réglages et langues | 1 | Réglages (thème, raccourci, démarrage avec le système), i18n FR/EN, stockage avec schéma | L4 | Changement de langue et de thème instantané et persistant |
| L6 Couche système | 2 | Interface `PlatformAdapter` et implémentations Windows, macOS, Linux : lancer un processus, terminal, éditeur, ports | L1 | Tests unitaires de chaque adaptateur avec processus simulés ; test réel sur Windows |
| L7 Module Projets | 2 | Liste de projets, ouvrir VS Code ou le terminal, démarrer et arrêter les serveurs de dev, statut et logs | L4, L6 | Projet lancé en un clic, serveur visible et arrêtable, aucun processus orphelin à la fermeture |
| L8 Module Ports et processus | 2 | Qui occupe le port, arrêt du processus avec confirmation, liste des ports ouverts | L6 | Port 3000 occupé détecté en moins d'une seconde ; arrêt confirmé puis effectif |
| L9 Module Utilitaires | 2 | JWT, JSON, Base64, UUID, expressions régulières, horodatages | L4 | Chaque outil fonctionne hors ligne ; JWT décodé sans envoi réseau |
| L10 Productivité | 2 | Historique du presse-papiers (SQLite), commandes favorites, chrono et Pomodoro | L4, L6 | Historique recherchable ; favoris lancés avec confirmation ; notification de fin de minuteur |
| L16 Alerte thermique et garde-fou d'arrêt | 2 | Surveillance de la température et de la charge du processeur avec alertes avant la coupure thermique, rapport de la cause du dernier arrêt (journal Windows), journal de l'état avant arrêt, mode « charge lourde » qui propose de mettre en pause les serveurs de dev (voir la section dédiée) | L4, L6 | Alerte affichée avant le seuil critique quand la température est lisible, sinon alerte sur la charge soutenue ; le rapport du dernier arrêt distingue arrêt thermique, coupure et arrêt demandé ; les arrêts thermiques sont signalés comme non bloquables |
| L11 GitHub | 3 | Connexion par flux appareil, dépôts, pull requests, état des tests, pastille d'alerte sur la bulle | L4, L5 | Jeton chiffré avec safeStorage ; test en échec visible sur la bulle |
| L12 Docker | 3 | Conteneurs, images, démarrer, arrêter, journaux | L6 | Liste et actions fonctionnelles ; message clair si Docker est absent |
| L13 Testeur d'API et clés SSH | 3 | Requêtes HTTP enregistrables, environnements ; liste et copie des clés SSH publiques | L4 | Requête envoyée et réponse affichée ; aucune clé privée lue ou affichée |
| L14 Distribution | 4 | electron-builder, installeurs trois systèmes, electron-updater, workflow de release par tag | L0 à L13 | Une version taguée produit trois installeurs en brouillon sur GitHub Releases ; mise à jour testée de la version N à N+1 |
| L15 Documentation et v1.0 | 4 | README, guide illustré FR/EN, page de présentation dédiée hébergée sur Netlify, tests manuels macOS et Linux, correctifs, publication | L14 | Checklist de recette entièrement cochée ; v1.0 publiée |

## Module Alerte thermique et garde-fou d'arrêt

Les arrêts inopinés du PC de développement sont des arrêts thermiques critiques : le module prévient avant la coupure et en garde la trace, car il ne peut pas l'empêcher.

### Diagnostic établi le 16 novembre 2026

Le journal Windows enregistre 11 arrêts thermiques critiques (événement Kernel-Power 86) entre le 17 octobre et le 16 novembre : 1 le 17 octobre, 1 le 26, 1 le 28, 1 le 31, 2 le 1er novembre, 1 le 4 novembre, 2 le 11 novembre et 2 le 16 novembre. La fréquence augmente. Trois ont eu lieu de nuit (1h43, 2h00, 4h17).

Chaque arrêt est exécuté par la commande `shutdown /s /f /t 0` (arrêt immédiat et forcé), lancée par `WUDFHost.exe`, l'hôte des pilotes de périphériques de Windows, sous le compte SERVICE LOCAL. Aucun service ni aucune tâche planifiée tiers n'est en cause. Les deux arrêts du 16 novembre suivent un pic de charge : une compilation native environ une minute avant le premier, l'ouverture d'Antigravity 23 secondes avant le second. La charge révèle le problème, elle n'en est pas la cause.

Actions en cours, côté Carlos :

- [ ] Plafonner le processeur à 85 % sur secteur (`powercfg`) et nettoyer la ventilation
- [ ] Mesurer la température à vide et en charge (HWiNFO), noter le modèle et l'âge du portable
- [ ] Préciser ce que faisait le PC lors des arrêts de nuit (veille dans un sac, tâche en arrière-plan)
- [ ] Si les arrêts persistent : nettoyage et pâte thermique par un technicien

### Ce qui est possible, et ce qui ne l'est pas

| Situation | Détectable | Empêchéable |
| --- | --- | --- |
| Arrêt thermique critique (`shutdown /s /f /t 0`) | Après coup (événement 86), et avant si la température est lisible | Non : protection matérielle immédiate, sans délai d'annulation |
| Température ou charge élevée et soutenue | Charge processeur : oui. Température : seulement si le matériel l'expose à Windows | Oui, en réduisant la charge avant le seuil |
| Arrêt ou redémarrage demandé normalement (mise à jour, programme) | Oui, en direct | Oui, retardé ou annulé quand un délai existe (`shutdown /a`) |
| Coupure d'alimentation, batterie vide, écran bleu | Après coup | Non |

### Ce que fait le module

1. **Rapport du dernier arrêt** : au démarrage, lecture du journal Système (événements 86, 41, 6008, 1074 et 109) pour afficher la cause : thermique, coupure ou arrêt demandé par tel processus.
2. **Surveillance** : charge du processeur et, quand c'est possible, température, relevées à intervalle régulier. Seuils d'avertissement et de danger configurables, à calibrer sur le PC de Carlos après les mesures.
3. **Alerte en direct** : notification et pastille sur la bulle quand la charge ou la température reste élevée, avec les processus les plus gourmands (node, electron, Antigravity).
4. **Mode « charge lourde »** : au seuil de danger, propose de mettre en pause les serveurs de dev lancés par Couronne et rappelle d'enregistrer et de faire un commit.
5. **Journal local** : relevé périodique (charge, température si lisible, processus principaux, secteur ou batterie) conservé dans le dossier de données, pour comprendre après coup ce qui précédait un arrêt.
6. **Arrêts normaux** : motif de blocage déclaré à Windows (`ShutdownBlockReasonCreate`) et annulation par `shutdown /a` quand un compte à rebours existe. Ne s'applique pas aux arrêts thermiques.

### Mise en œuvre technique

- **Charge** : API Node (`os`). **Température** : lecture par l'adaptateur de plateforme (WMI ou PowerShell sous Windows). Windows n'expose pas toujours les capteurs d'un portable : un prototype sur le PC de Carlos doit confirmer ce qui est lisible avant d'engager le lot. Sans température, le module se rabat sur la charge soutenue.
- **Journal d'événements** : lecture par PowerShell (`Get-WinEvent`) depuis l'adaptateur de plateforme, sans droits administrateur pour le journal Système.
- **Linux** : `/sys/class/thermal` et verrou d'inhibition de systemd-logind. **macOS** : support limité.
- Tout reste local : le journal est un fichier dans le dossier de données de l'utilisateur.

## Processus d'implémentation

La règle de travail : Antigravity, l'agent de développement, conçoit et écrit le code, les tests et la documentation de chaque lot, sur le poste de Carlos. Carlos cadre chaque lot, relit ce que l'agent produit, teste sur Windows et décide. L'agent peut lancer l'application, les tests et le build lui-même, donc les allers-retours sont courts ; en contrepartie il agit sur le poste de Carlos et doit travailler avec des permissions limitées. Claude reste disponible pour rédiger les fiches de lot et le fichier de règles, et pour relire le code produit.

### Cycle d'un lot

1. **Cadrer** : fiche du lot (objectif, contrat IPC avec entrées, sorties et erreurs, maquette si nécessaire, critères d'acceptation) rédigée avec Carlos et enregistrée dans `docs/lots/`.
2. **Confier** : Carlos donne la fiche du lot à l'agent, qui lit d'abord le fichier de règles du projet (pile, conventions, sécurité, définition de fini).
3. **Produire** : l'agent crée la branche `feat/lot-xx-nom`, écrit le service, le contrat, l'écran et les tests, puis lance lint, typecheck et tests jusqu'à ce qu'ils passent.
4. **Vérifier** : Carlos relit le diff, lance l'application sur Windows et passe la checklist du lot.
5. **Corriger** : erreurs, logs et captures sont renvoyés à l'agent jusqu'aux critères d'acceptation.
6. **Fusionner** : pull request, CI verte sur les trois systèmes, fusion dans `main`.

### Cadre de travail avec l'agent

- **Fichier de règles du projet** à la racine du dépôt : pile, structure d'un module, conventions, règles de la section Sécurité, définition de fini. Antigravity lit AGENTS.md à la racine du projet. Une limite d'environ 12 000 caractères par fichier est signalée : le fichier reste court et renvoie vers les fiches de lot (docs/lots) et le brief (docs/BRIEF.md).
- **Un lot à la fois**, une branche par lot, aucune modification hors du périmètre de la fiche. L'agent pousse uniquement sa branche de lot, jamais sur main, et Carlos fusionne par pull request.
- **Permissions limitées** : l'agent travaille uniquement dans le répertoire vierge D:\\couronne-skills, racine du dépôt Couronne, et n'écrit nulle part ailleurs ; validation demandée avant toute commande sensible (suppression, arrêt ou redémarrage du système, installation globale, accès réseau inhabituel).
- **Tests d'abord** pour la logique métier : l'agent écrit le test, puis le code.
- **Relecture humaine obligatoire** du diff avant fusion, surtout pour le code qui lance des processus, lit des fichiers ou manipule des secrets.
- **Aucun secret** dans le dépôt ni dans les échanges avec l'agent. Le dépôt étant public, rien de personnel ni de secret ne doit être commité.
- **Charge modérée** : le PC de développement est un portable qui s'éteint par surchauffe. L'agent lance une seule tâche lourde à la fois, limite le parallélisme, arrête ses processus après usage et fait des commits locaux fréquents (section « Ressources et chaleur » d'AGENTS.md).

### Git et conventions

- Branche principale `main` toujours livrable ; branches courtes par lot ; fusion par pull request, même en travaillant seul.
- Commits au format Conventional Commits (`feat:`, `fix:`, `chore:`), versions semver, fichier CHANGELOG généré.
- Code et commentaires en anglais ; interface en français et en anglais via les clés de traduction.
- TypeScript strict, pas de `any`, un module par dossier, aucune dépendance entre modules (ils communiquent via le noyau).
- Toute fonction qui touche au système passe par un adaptateur de plateforme.

### Définition de fini (par lot)

- [ ] Critères d'acceptation du lot satisfaits
- [ ] Tests unitaires du service, couverture visée au moins 80 % sur la logique métier
- [ ] Contrat IPC typé et validé par Zod
- [ ] Textes traduits en français et en anglais, rendu correct en thème clair et sombre
- [ ] Utilisable entièrement au clavier
- [ ] Aucune erreur ni avertissement en console ; aucun secret dans les logs
- [ ] CI verte sur Windows, macOS et Linux
- [ ] Essai manuel sur Windows effectué
- [ ] Documentation du module et entrée de CHANGELOG ajoutées

## Tests et qualité

La majorité des tests portent sur la logique sans interface, car c'est ce que l'agent peut exécuter vite et ce que la CI peut rejouer sur les trois systèmes. L'interface réelle est validée par des essais manuels sur Windows.

| Niveau | Outil | Ce qu'on couvre | Où ça tourne |
| --- | --- | --- | --- |
| Unitaire | Vitest | Services, adaptateurs de plateforme (processus simulés), schémas Zod, utilitaires | Poste de Carlos et de l'agent, CI |
| Composants | Vitest + Testing Library | Écrans des modules, états vides et erreurs, i18n | Poste, CI |
| Intégration IPC | Vitest | Chaîne preload, validation, service, réponse ; rejet des messages invalides | Poste, CI |
| Bout en bout | Playwright pour Electron | Lancement, bulle, raccourci, palette, un parcours par module | CI (Windows, macOS, Linux) |
| Manuel | Checklist de recette | Bulle réelle, multi-écrans, DPI élevé, mise à jour N vers N+1, installation propre | Windows (Carlos), macOS et Linux (testeurs bénévoles) |

Règles de qualité :

- Un bug corrigé reçoit un test qui l'aurait détecté.
- Les parties dépendantes du système (ports, processus, terminal) ont un test réel sur chaque système avant la v1.0 ; les systèmes non testés en direct sont annoncés comme tels dans la documentation.
- Mesure de performance à chaque version : temps d'ouverture du panneau et mémoire au repos, comparés aux objectifs de la section Vision.

## Build, signature et distribution

Un tag de version (`v1.0.0`) déclenche GitHub Actions, qui construit les trois installeurs sur des machines Windows, macOS et Linux, puis les dépose en brouillon sur GitHub Releases. Carlos vérifie, puis publie.

| Système | Format | Mise à jour automatique | Signature |
| --- | --- | --- | --- |
| Windows 10/11 | Installeur `.exe` (NSIS) | Oui, via electron-updater | Non signé en v1.0 : l'écran SmartScreen s'affiche. Certificat de signature de code à étudier ensuite |
| macOS | `.dmg` et `.zip` | Dépend de la signature : une application non signée ne peut pas se mettre à jour seule | Compte Apple Developer requis pour signer et notariser ; sans lui, avertissement Gatekeeper documenté |
| Linux | `.AppImage` et `.deb` | Oui pour l'AppImage | Sans objet |

À prévoir autour de l'installeur :

- Mode portable Windows (un seul fichier, sans installation) à évaluer pour le lot L14.
- Page d'explication de l'avertissement SmartScreen et de Gatekeeper, avec lien vers le code source pour rassurer.
- Empreintes SHA-256 publiées avec chaque version.
- Canal de mise à jour « stable » uniquement en v1.0 ; un canal « bêta » plus tard si besoin.
- Dépôt GitHub avec README, guide illustré FR/EN, licence et modèle de signalement de bugs.

## Risques et décisions ouvertes

### Risques

| Risque | Impact | Parade |
| --- | --- | --- |
| Le périmètre enfle (mails, agenda, notes, coffre) | La v1.0 n'arrive jamais | Périmètre figé par la liste « Exclu de la v1.0 » ; toute demande passe par la feuille de route post-v1 |
| Modules natifs (SQLite) difficiles à compiler par plateforme | Build cassé sur macOS ou Linux | Introduction tardive (lot L10), recompilation testée en CI, repli sur un stockage fichier |
| Bulle flottante instable sur Linux (Wayland) | Fonction principale dégradée | Linux déclaré « support communautaire » ; repli en fenêtre classique avec icône de barre système |
| Avertissements SmartScreen et Gatekeeper | Freine l'adoption | Documentation claire, code source ouvert, empreintes publiées, signature étudiée après la v1.0 |
| Exécution de commandes mal contrôlée | Faille de sécurité | Aucun shell, arguments en tableau, confirmation des actions destructrices, tests dédiés |
| L'agent de développement agit sur le poste sans contrôle suffisant | Régression ou action système non voulue (suppression, arrêt, installation) | Validation demandée pour les commandes sensibles, relecture du diff à chaque lot, CI obligatoire, essai manuel sur Windows après chaque lot |
| Disponibilité de Carlos (projets clients en parallèle) | Retards sur la feuille de route | Lots petits (2 à 4 sessions de travail), durées recalibrées après les lots L1 à L3 |
| Limites et authentification de l'API GitHub | Module GitHub fragile | Flux appareil, cache local, gestion claire des erreurs de quota |
| Le module ne peut pas empêcher un arrêt thermique critique (protection matérielle immédiate) ni une coupure | Fausse impression de protection, perte de travail | Alerte avant le seuil, repli sur la charge si la température n'est pas lisible, commits fréquents, limites annoncées dans l'interface ; la vraie solution reste le refroidissement du portable |

### Décisions

- Licence et dépôt : décidé, dépôt GitHub public. Licence MIT, titulaire ADJAÏ Adétoyé Carlos (un dépôt public sans licence n'autorise pas la réutilisation). Les mises à jour automatiques via GitHub Releases fonctionnent sans jeton.
- Page de présentation : décidé, une page dédiée hébergée sur Netlify, à l'adresse gratuite en netlify.app (pas de nom de domaine payant pour l'instant). Dépôt GitHub : github.com/carlosadjai/couronne ; dossier local : D:\\couronne-skills.
- Mails, agenda et notes : décidé, après la v1.0.
- Coffre de mots de passe : décidé, exclu.
- Compte Apple Developer et certificat de signature Windows : décidé, après la v1.0. L'application doit fonctionner sans signature.
- Logo : décidé, généré puis retravaillé par Carlos.
- Temps disponible : confirmé suffisant, les durées de la roadmap restent inchangées.
