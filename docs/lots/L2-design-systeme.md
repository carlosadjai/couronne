# L2 — Design système

**Phase** : 1 · **Dépend de** : L1 (fusionné dans `main`) · **Branche** : `feat/lot-02-design-systeme`

## Objectif

Poser le langage visuel de Couronne : tokens CSS partagés, thèmes sombre et clair, composants de base accessibles, logo, polices embarquées, et une page de démonstration qui montre tout cela. Tous les écrans futurs (bulle, panneau, modules) seront assemblés avec ces briques et rien d'autre. Ce lot ne contient aucune fonctionnalité produit.

## Préparation par Carlos (avant de lancer l'agent)

- [ ] `main` est à jour sur le PC (`git checkout main`, `git pull`). L1 est fusionné.
- [ ] Le brief (`docs/BRIEF.md`, section « Design système ») est présent.
- [ ] Les pull requests Dependabot restent hors du lot.

## Périmètre

**Inclus** : Tailwind CSS, tokens, thèmes sombre et clair, polices embarquées, 15 composants, logo, page de démonstration, tests de composants, vérification automatique du contraste.

**Exclu** : bulle, panneau, icône de barre système (L3), registre de modules et palette Ctrl + K (L4), i18next et réglages persistants (L5), Zustand, `cmdk`, tests Playwright, empaquetage et icônes d'installeur (L14).

## Dépendances autorisées (à justifier en une ligne dans ton plan)

Pas besoin de redemander l'accord pour celles-ci, mais aucune autre sans l'accord de Carlos. Versions stables actuelles, figées par le lockfile.

- Styles : `tailwindcss` et son intégration Vite officielle (`@tailwindcss/vite` pour Tailwind 4), `clsx`, `tailwind-merge`, `class-variance-authority`.
- Composants : les paquets Radix nécessaires uniquement (`@radix-ui/react-dialog`, `-select`, `-switch`, `-tabs`, `-toast`, `-tooltip`, `-slot`), `lucide-react`.
- Polices : `@fontsource-variable/inter` et `@fontsource-variable/jetbrains-mono` (licence OFL, fichiers embarqués, aucun CDN).

## Tâches

1. **Prérequis.** Vérifie que tu pars de `main` à jour, crée la branche, annonce un plan court qui liste les paquets ajoutés. Ne touche pas aux PR Dependabot, ne mets aucune dépendance existante à jour.

2. **Tailwind et structure.**
   - Intègre Tailwind au renderer (config electron-vite).
   - Arborescence : `src/renderer/src/styles/` (`tokens.css`, `index.css`), `src/renderer/src/ui/` (un fichier par composant, `index.ts` qui les exporte, `cn.ts` pour la fonction de fusion de classes).
   - Supprime les restes du modèle Electron : `base.css`, `main.css`, `electron.svg`, `wavy-lines.svg`, le composant `Versions` s'il n'est plus utilisé. Mets `<title>Couronne</title>` dans `index.html` (la barre de titre affiche « Electron » aujourd'hui).

3. **Tokens** (`tokens.css`).
   - Toutes les couleurs, tailles et espacements du brief (section « Design système ») deviennent des variables CSS, exposées à Tailwind (`@theme` en Tailwind 4) : couleurs `--bg`, `--surface`, `--border`, `--text`, `--text-muted`, `--accent`, `--success`, `--warning`, `--danger`, `--info`.
   - Échelle de texte 12, 13, 14, 16, 20, 24 px ; espacement par pas de 4 px ; rayons 6 px, 10 px, cercle complet ; transitions 120 à 180 ms.
   - Ajoute ces trois tokens, sinon le doré clair ne passe pas le contraste :
     - `--accent` : le fond des éléments dorés (bouton principal, pastille) ;
     - `--accent-fg` : le texte posé sur un fond doré (sombre dans les deux thèmes) ;
     - `--accent-text` : le doré utilisé comme texte ou icône sur le fond normal (plus foncé en thème clair).
   - Thème sombre = référence, thème clair = miroir, via l'attribut `data-theme` sur `<html>`.
   - `prefers-reduced-motion: reduce` désactive les transitions et animations.

4. **Contraste AA.** Les valeurs du brief sont des valeurs de départ. Écris une fonction pure `contrastRatio(hexA, hexB)` et un test Vitest qui lit les tokens et échoue sous 4,5:1 pour tout texte et 3:1 pour les bordures de composants, les icônes et l'anneau de focus, dans les deux thèmes. Le doré clair du brief (`#B8860B`) donne environ 3,3:1 sur fond blanc : il ne passe pas comme texte. Si une valeur échoue, assombris-la ou éclaircis-la au minimum, puis note la valeur finale dans le compte rendu. Fige les valeurs validées dans `docs/design-tokens.md` (tableau des tokens, les deux thèmes).

5. **Polices.** Inter pour l'interface, JetBrains Mono pour le code, importées depuis les paquets `@fontsource-variable/*` (aucune requête réseau, aucune police système en dépendance). Corps de texte à 13 ou 14 px.

6. **Thème.** Un petit hook `useTheme` : choix `système` (défaut), `sombre` ou `clair`, qui applique `data-theme` sur `<html>` et suit les changements de préférence du système tant que le choix est `système`. État en mémoire seulement (la persistance arrive au lot L5). Pas de `localStorage`.

7. **Composants** (`ui/`), habillés avec Tailwind et les tokens, accessibilité Radix quand elle existe :
   - **Button** (variantes primaire dorée, secondaire, discrète, danger ; tailles ; état chargement), **IconButton** (la propriété `label` est obligatoire : elle devient `aria-label` et l'infobulle).
   - **Input**, **Select**, **Switch**, **Tabs**.
   - **Card**, **ListItem**, **Badge** (neutre, succès, alerte, danger, info), **EmptyState**, **Kbd**, **CommandItem** (ligne visuelle de palette : icône, libellé, raccourci ; la palette elle-même arrive en L4).
   - **Tooltip**, **Dialog**, **Toast**.
   - Règles communes : focus visible (anneau doré, jamais supprimé), utilisable au clavier, états désactivé et chargement, jamais la couleur seule pour porter un état (icône lucide en plus : succès, échec, alerte).
   - Pas de texte en dur dans les composants : les libellés viennent des propriétés. (Les textes de la page de démonstration sont l'exception, voir tâche 9.)

8. **Logo.** Monogramme de couronne original, simple, lisible à 16 px (barre système) et à 56 px (bulle), en or sur fond sombre ou clair.
   - Livre 3 variantes en SVG dans `docs/design/logo-options/` (`a.svg`, `b.svg`, `c.svg`), faites à la main, sans reprendre le logo d'une marque existante.
   - Retiens la variante A par défaut : `resources/logo.svg`, utilisée dans la page de démonstration. Carlos choisira et retravaillera ensuite ; le remplacement se fera dans un petit commit.
   - Le PNG d'icône et les icônes d'installeur ne sont pas dans ce lot (L14). Si tu peux produire `resources/icon.png` sans ajouter de dépendance, fais-le, sinon signale-le.

9. **Page de démonstration** (remplace l'écran de L1 dans `App.tsx`).
   - Sélecteur de thème (système, sombre, clair).
   - Une section par composant avec toutes ses variantes et états, le logo en 16, 32 et 56 px, la palette de couleurs avec le nom des tokens.
   - Une carte « Diagnostic du noyau » qui garde la preuve que la chaîne IPC marche : nom et version de l'application, boutons « Ping » et « Envoyer une donnée invalide » avec leur résultat affiché dans un Toast ou un Badge. Aucun test unitaire ne remplace cette preuve de bout en bout : L1 a montré pourquoi.
   - Texte provisoire en dur autorisé ici (exception à la règle i18n). Il sera remplacé lors des lots L3 à L5.

10. **Tests (Vitest + Testing Library).**
    - Chaque composant : rendu, variantes principales, état désactivé.
    - Clavier : Tabs (flèches), Switch (Espace), Dialog (Échap ferme, focus rendu au déclencheur), Select (flèches et Entrée), Tooltip au focus.
    - `IconButton` sans `label` : refus au typage (test de type ou test d'exécution).
    - `useTheme` : défaut `système`, bascule, suivi de la préférence système simulée.
    - Contraste (tâche 4).
    - Les tests existants de L1 passent toujours ; adapte celui de `App` à la nouvelle page sans réduire sa couverture de la chaîne IPC.

11. **Sécurité, ne rien casser.**
    - Les polices et styles passent sous la CSP de production existante sans l'assouplir. Radix pose des styles en ligne : `style-src 'unsafe-inline'` existe déjà. Tu n'ajoutes ni `unsafe-eval`, ni domaine externe, ni `connect-src` externe.
    - `sandbox: true` et le preload de L1 ne changent pas. Le preload ne doit toujours charger aucun module externe (le test de L1 le vérifie).
    - Aucune requête réseau pour les polices ou les icônes.

12. **Fin de lot.** Entrée dans `CHANGELOG.md`, documentation courte dans `docs/design-tokens.md` (tokens, règles d'usage des trois doré, comment ajouter un composant). Pousse la branche, ne la fusionne pas.

## Critères d'acceptation

- Les 15 composants listés sont rendus sur la page de démonstration, dans les deux thèmes, avec leurs variantes et états.
- Le test de contraste passe : texte ≥ 4,5:1, bordures, icônes et focus ≥ 3:1, dans les deux thèmes. Les valeurs finales sont écrites dans `docs/design-tokens.md`.
- Tout se fait au clavier : Tab parcourt les éléments, le focus est toujours visible, Échap ferme un Dialog, les flèches changent d'onglet.
- Aucun CDN, aucune requête réseau pour les polices ; les polices sont dans le build.
- `npm run build` puis `npx electron-vite preview` (CSP de production) : la page s'affiche correctement, aucune erreur de CSP dans la console.
- La carte « Diagnostic du noyau » affiche nom, version, Pong et INVALID_INPUT dans l'application réellement lancée (`npm run dev`), et `window.couronne` ne contient toujours que `app`.
- Le logo est lisible à 16, 32 et 56 px sur fond sombre et fond clair.
- `lint`, `typecheck`, `test`, `build` passent ; la CI est verte sur Windows, macOS et Linux.

## Vérification par Carlos (Windows)

- [ ] `npm run dev` : la page de démonstration s'ouvre, le titre de la fenêtre est « Couronne ».
- [ ] Le sélecteur de thème bascule entre sombre, clair et système ; les deux thèmes sont lisibles.
- [ ] Au clavier seulement (Tab, flèches, Entrée, Espace, Échap) : tout est atteignable et le focus est visible.
- [ ] « Ping » affiche un Pong, « donnée invalide » affiche INVALID_INPUT.
- [ ] Windows : Paramètres → Accessibilité → Effets visuels → Effets d'animation désactivés : l'application n'anime plus.
- [ ] Capture d'écran de la page en thème sombre et en thème clair, à m'envoyer pour relecture.
- [ ] `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` lancés une fois chacun, sans lancer de commande en parallèle.
- [ ] CI verte sur les trois systèmes avant la fusion.
- [ ] Choisir la variante de logo parmi A, B et C (ou demander une retouche).

## Actions de Carlos après le lot

- [ ] Relire le diff, ouvrir la pull request, vérifier la CI, fusionner.
- [ ] Mettre à jour la roadmap du brief (L2 terminé).
- [ ] Traiter les PR Dependabot restantes (une à la fois, avec Claude).
