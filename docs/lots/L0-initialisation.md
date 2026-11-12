# L0 — Initialisation du dépôt

**Phase** : 0 · **Dépend de** : aucun lot · **Branche** : `feat/lot-00-initialisation`

## Objectif

Poser les fondations techniques de Couronne dans `D:\couronne-skills` : un projet Electron + React + TypeScript qui démarre, une qualité automatisée (lint, types, tests, hooks) et une intégration continue sur Windows, macOS et Linux. Ce lot ne contient aucune fonctionnalité produit.

## Préparation par Carlos (avant de lancer l'agent)

- [ ] `D:\couronne-skills` existe avec `AGENTS.md` à la racine et les fiches dans `docs/lots/` (idéalement aussi `docs/BRIEF.md`, export Markdown du brief).
- [ ] Node.js (version LTS), npm et Git sont installés.
- [ ] Un dépôt GitHub **public et vide** est créé (sans README, sans licence, sans .gitignore). Son URL est donnée à l'agent.
- [ ] Git est connecté à GitHub sur ce PC (`gh auth login` avec GitHub CLI, ou Git Credential Manager qui ouvre la connexion au premier push). `user.name` et `user.email` sont renseignés. L'adresse e-mail des commits sera publique : utilise l'adresse « noreply » de GitHub si tu ne veux pas exposer la tienne.
- [ ] Le nom à inscrire comme titulaire de la licence est communiqué à l'agent.

## Périmètre

**Inclus** : dépôt Git, scaffold electron-vite (React + TypeScript), TypeScript strict, ESLint, Prettier, Vitest, hooks de commit, arborescence de dossiers, fichiers du dépôt, intégration continue.

**Exclu** : IPC et sécurité de la fenêtre (L1), Tailwind et design système (L2), bulle et panneau (L3), electron-builder et installeurs (L14).

## Tâches

1. **Prérequis.** Exécute `node -v`, `npm -v`, `git --version`, `git config user.name` et `git config user.email`, puis rapporte les résultats. S'il manque quelque chose, arrête-toi et préviens Carlos.
2. **Dépôt.** `git init` si nécessaire, branche principale `main`, remote `origin` vers l'URL fournie.
3. **Premier commit sur `main`** (seule exception à la règle « jamais sur main ») : uniquement `AGENTS.md`, `docs/`, un `README.md` minimal, `LICENSE` et `.gitignore`. Pousse `main`, puis crée la branche `feat/lot-00-initialisation` : tout le reste se fait sur cette branche.
4. **Scaffold.** Projet electron-vite, template React + TypeScript (`npm create @quick-start/electron@latest`). Génère-le dans un dossier temporaire, puis déplace son contenu à la racine sans écraser `AGENTS.md` ni `docs/`. Nom du paquet : `couronne`.
5. **Qualité.** TypeScript strict pour main, preload et renderer. ESLint (TypeScript + React), Prettier, Vitest avec un test d'exemple qui passe, Husky + lint-staged (lint et format des fichiers modifiés avant chaque commit). Scripts npm : `dev`, `build`, `lint`, `typecheck`, `test`, `format`.
6. **Arborescence** conforme à `AGENTS.md`. Les dossiers vides (`src/modules`, `src/shared`, `e2e`, `resources`) contiennent un `.gitkeep`.
7. **Fichiers du dépôt.**
   - `README.md` en français : présentation en 5 lignes, prérequis, commandes.
   - `LICENSE` : MIT (choix proposé dans le brief, à confirmer par Carlos avant le commit), titulaire communiqué par Carlos.
   - `.gitignore` : `node_modules`, `dist`, `out`, `release`, `coverage`, `*.log`, `.env*`, `.DS_Store`.
   - `.editorconfig` et `.gitattributes` (`* text=auto eol=lf`).
   - `CHANGELOG.md` au format Keep a Changelog.
   - `.github/pull_request_template.md` : la définition de fini d'`AGENTS.md` sous forme de cases à cocher.
   - `.github/dependabot.yml` : npm et github-actions, mise à jour hebdomadaire.
   - `.nvmrc` et champ `engines` de `package.json` : version de Node supportée.
8. **Intégration continue.** `.github/workflows/ci.yml`, déclenché sur les push de branches et sur les pull requests vers `main`. Matrice `windows-latest`, `macos-latest`, `ubuntu-latest`. Étapes : checkout, setup-node (version du `.nvmrc`, cache npm), `npm ci`, lint, typecheck, test, build. Le build ne doit pas dépendre d'un écran.
9. **Livraison.** Pousse la branche `feat/lot-00-initialisation`. Ne la fusionne pas.

## Critères d'acceptation

- `npm run dev` ouvre la fenêtre Electron du modèle sur Windows.
- `npm run lint`, `npm run typecheck`, `npm run test` et `npm run build` passent en local (Windows) et en CI sur les trois systèmes.
- Un commit contenant une erreur de lint est refusé par le hook.
- `npm ci` fonctionne depuis un clone propre (le lockfile est commité).
- `git ls-files` ne contient aucun secret, aucun `.env` et aucun chemin personnel.
- La version de Node supportée est déclarée (`.nvmrc` et `engines`).

## Actions de Carlos après le lot

- [ ] Relire le diff, ouvrir la pull request, vérifier que la CI est verte, fusionner.
- [ ] GitHub → Settings → Branches : protéger `main` (pull request obligatoire, CI requise).
- [ ] GitHub → Settings → Code security : activer l'analyse des secrets et la protection au push (dépôt public).
- [ ] Mettre à jour la roadmap du brief.
