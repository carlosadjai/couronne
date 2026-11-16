# Couronne

Couronne est un tableau de bord pour développeur sous forme d'application de bureau moderne.
Il propose une bulle flottante discrète et un panneau d'accès rapide aux outils du quotidien :
projets en cours, surveillance des ports locaux, utilitaires système, intégrations GitHub et conteneurs Docker.
L'application repose sur Electron, React et TypeScript, garantissant performance et fluidité.
Entièrement locale, elle fonctionne sans compte utilisateur et sans aucune télémétrie.

## Prérequis

- **Node.js** : version LTS recommandée (voir `.nvmrc`, Node >= 22)
- **npm** : version 10 ou supérieure
- **Git**

## Commandes disponibles

- `npm run dev` : Lance l'application en mode développement avec rechargement à chaud (HMR).
- `npm run build` : Vérifie les types TypeScript et compile les bundles de production (main, preload, renderer).
- `npm run lint` : Analyse le code avec ESLint.
- `npm run typecheck` : Vérifie les types TypeScript pour le main process et le renderer.
- `npm run test` : Exécute les tests unitaires avec Vitest.
- `npm run format` : Formate l'ensemble des fichiers avec Prettier.

## Architecture & Documentation

Pour plus de détails sur la conception, l'architecture et les règles du projet :

- [Brief du projet](docs/BRIEF.md)
- [Règles du projet pour les agents](AGENTS.md)
- [Journal des modifications](CHANGELOG.md)

## Licence

Ce projet est sous licence MIT — voir le fichier [LICENSE](LICENSE) pour plus de détails.
