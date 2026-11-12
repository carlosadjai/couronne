# Couronne — règles du projet

Ces règles s'appliquent à tout travail dans ce dépôt. La fiche du lot en cours prime sur le brief ; ce fichier prime sur tes habitudes par défaut.

## Contexte

Couronne est un tableau de bord de développeur pour le bureau : une bulle flottante qui ouvre un panneau avec les outils du quotidien (projets, ports, utilitaires, GitHub, Docker…). Application Electron + React + TypeScript, locale (aucun compte, aucune télémétrie), multiplateforme. Windows 11 est la cible de test principale ; macOS et Linux doivent rester compilables et testés en CI. Dépôt public, développé d'abord pour son auteur (Carlos).

- Racine du dépôt : `D:\couronne-skills`. Tu n'écris nulle part ailleurs.
- Brief complet (référence) : `docs/BRIEF.md`, s'il est présent.
- Travail en cours : la fiche `docs/lots/Lxx-*.md` que Carlos te désigne. Un seul lot à la fois, rien hors du périmètre de la fiche. Si la fiche est ambiguë ou contredit ces règles, pose la question avant de coder.

## Méthode de travail

1. Lis la fiche du lot et ce fichier. Annonce un plan court (5 à 10 lignes), puis continue sauf si une question bloque.
2. Écris les tests de la logique métier avant le code ou avec lui.
3. Lance `npm run lint`, `npm run typecheck` et `npm run test` jusqu'à ce qu'ils passent. Lance `npm run build` quand la fiche le demande.
4. Termine par le compte rendu (format plus bas). N'affirme jamais qu'un test passe sans l'avoir lancé.

## Pile (figée)

Electron + electron-vite, TypeScript strict, React, Tailwind CSS, Radix UI, lucide-react, Zustand, Zod, i18next, electron-store, Vitest + Testing Library, Playwright, ESLint + Prettier + Husky/lint-staged, electron-builder + electron-updater. SQLite (better-sqlite3) n'arrive qu'au lot L10.

N'ajoute aucune autre dépendance sans la justifier en une phrase dans ton plan et sans l'accord de Carlos. Versions figées par le lockfile ; `npm ci` en CI.

## Architecture

```text
src/
  main/       processus principal : core/ (fenêtres, tray, raccourcis, réglages, journal), platform/ (adaptateurs), ipc/
  preload/    contextBridge : API typée, rien d'autre
  renderer/   React : ui/ (design système), shell/ (bulle, panneau, palette)
  modules/    un dossier par outil : manifest.ts, contract.ts, service.ts, View.tsx, tests
  shared/     types, schémas Zod, constantes
e2e/  resources/  docs/  .github/workflows/
```

Règles :

- Le renderer n'a aucun accès au système : pas de Node, pas de `require`, pas d'`ipcRenderer` brut.
- Un module ne dépend jamais d'un autre module : il passe par le noyau.
- Tout ce qui dépend du système d'exploitation (processus, ports, terminal, éditeur, notifications) passe par l'interface `PlatformAdapter`, avec une implémentation par système (win32, darwin, linux). Pas de `process.platform` dispersé dans le code.
- La logique métier vit dans `service.ts`, testable sans interface.
- Un canal IPC par action, nommé `module:action`. Entrées, sorties et erreurs sont décrites par des schémas Zod dans `contract.ts`, les types en sont déduits. Les erreurs sont des objets `{ code, message }`, jamais des exceptions brutes.
- Tout processus enfant lancé par l'application est suivi et terminé à la fermeture. Aucun processus orphelin.

## Sécurité (non négociable)

- BrowserWindow : `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, `webSecurity: true`. CSP stricte. Navigation et ouverture de fenêtres bloquées ; liens externes en https uniquement, via `shell.openExternal` après contrôle.
- Chaque message IPC est validé (Zod) côté principal, et l'origine de l'émetteur est vérifiée.
- Commandes système : `spawn` ou `execFile` avec un tableau d'arguments, `shell: false`. Jamais de chaîne concaténée. Confirmation de l'utilisateur pour toute action destructrice (arrêter un processus, supprimer un conteneur).
- Secrets (jetons) : `safeStorage`, jamais en clair, jamais dans les logs.
- Aucun appel réseau hors GitHub et mises à jour. Aucune télémétrie.
- Le dépôt est PUBLIC : ne commite jamais de secret, de jeton, de fichier `.env`, de chemin ou de nom personnel, ni de donnée personnelle. Vérifie `git status` et le diff avant chaque commit.

## Conventions de code

- TypeScript strict, pas de `any`, pas de `@ts-ignore` sans commentaire justificatif.
- Code, commentaires, noms et messages de commit en anglais. Textes de l'interface via clés i18next (français par défaut, anglais complet), aucun texte en dur, sauf exception écrite dans la fiche du lot.
- Fichiers en kebab-case, composants React en PascalCase.
- Pas de `console.log` laissé : utilise le logger du noyau (sans secret).
- Composants accessibles : clavier, focus visible, contraste AA.
- Design : tokens CSS partagés ; thème sombre de référence, thème clair en miroir.

## Git

- Une branche par lot : `feat/lot-xx-nom-court`. Commits petits, au format Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`).
- Tu pousses uniquement ta branche de lot. Jamais sur `main`, jamais de `--force`, jamais de réécriture d'historique publié. Tu ne fusionnes pas : Carlos relit le diff et fusionne par pull request.
- Seule exception : le tout premier commit de `main`, décrit dans la fiche L0.

## Commandes et permissions

Demande l'accord explicite de Carlos AVANT :

- tout `shutdown`, redémarrage, mise en veille, ou arrêt d'un processus que tu n'as pas toi-même lancé ;
- toute suppression en dehors de `node_modules`, `dist`, `out` et des fichiers que tu as créés dans ce lot ;
- toute installation globale (`npm -g`, `winget`, `choco`), toute modification du registre, des variables d'environnement système ou des paramètres Windows ;
- toute commande réseau inhabituelle ou tout téléchargement d'exécutable ;
- toute action sur un dossier situé en dehors de `D:\couronne-skills`.

Les serveurs de dev et les tests que tu lances doivent être arrêtés à la fin de ta tâche.

## Définition de fini d'un lot

- Critères d'acceptation de la fiche satisfaits, un par un.
- Tests unitaires de la logique ajoutée ; couverture visée : 80 % minimum sur la logique métier.
- `lint`, `typecheck` et `test` passent. CI verte sur Windows, macOS et Linux quand la fiche le demande.
- Textes traduits (français et anglais), rendu correct en thème clair et sombre, utilisable au clavier.
- Aucun avertissement en console, aucun secret dans le code ni dans les logs.
- Documentation du module et entrée dans le CHANGELOG.

## Compte rendu de fin de lot

Réponds avec : (1) ce qui est fait, critère par critère ; (2) la liste des fichiers créés ou modifiés ; (3) les commandes exactes pour que Carlos teste sur Windows ; (4) ce que tu n'as pas pu vérifier ; (5) les questions ouvertes et les écarts par rapport à la fiche. Sois factuel : indique clairement ce qui est testé et ce qui ne l'est pas.
