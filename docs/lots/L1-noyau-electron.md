# L1 — Noyau Electron

**Phase** : 0 · **Dépend de** : L0 (fusionné dans `main`) · **Branche** : `feat/lot-01-noyau-electron`

## Objectif

Établir le noyau sécurisé de l'application : trois processus (main, preload, renderer) correctement isolés, un système IPC typé et validé par Zod, une journalisation sûre. Livrer un canal de démonstration qui prouve la chaîne complète de bout en bout. Tous les modules futurs reposent sur ce lot : il doit être irréprochable plutôt que riche.

## Périmètre

**Inclus** : fenêtre principale sécurisée, politique de navigation, IPC typé et validé, preload minimal, logger, écran de démonstration, tests unitaires.

**Exclu** : bulle, panneau et icône de barre système (L3), registre de modules (L4), Tailwind et design système (L2), réglages persistants et i18n (L5), tests Playwright, empaquetage (L14).

## Tâches

1. **Fenêtre sécurisée** (`src/main/core/window.ts`).
   - `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, `webSecurity: true`.
   - CSP stricte en production (pas de `unsafe-eval`, `default-src 'self'`) ; version assouplie uniquement pour le serveur de dev (rechargement à chaud).
   - Navigation interne bloquée (`will-navigate`) et ouverture de fenêtres refusée (`setWindowOpenHandler`).
   - Liens externes : fonction pure `isAllowedExternalUrl(url)` qui n'accepte que `https:`, puis `shell.openExternal`.
   - Prépare la configuration des fuses Electron (RunAsNode désactivé, EnableNodeCliInspectArguments désactivé, OnlyLoadAppFromAsar activé, EnableCookieEncryption activé) dans la configuration d'electron-builder. Elle ne s'applique qu'aux versions empaquetées, vérifiées au lot L14. N'ajoute pas de dépendance : si electron-builder ne le permet pas, signale-le dans le compte rendu.
2. **Contrat IPC** (`src/shared/ipc/`). À titre indicatif, à adapter si tu trouves mieux en restant simple :

   ```ts
   export const defineChannel = <I extends z.ZodTypeAny, O extends z.ZodTypeAny>(
     name: `${string}:${string}`,
     input: I,
     output: O
   ) => ({ name, input, output })

   export type Result<T> =
     | { ok: true; data: T }
     | { ok: false; error: { code: 'INVALID_INPUT' | 'FORBIDDEN_SENDER' | 'INTERNAL'; message: string } }
   ```

3. **Enregistrement des handlers** (`src/main/ipc/register.ts`). `registerHandler(channel, handler)` :
   - vérifie l'expéditeur avec une fonction pure `isTrustedSender(url, context)` (origine du serveur de dev en développement, fichier de l'application en production) et répond `FORBIDDEN_SENDER` sinon ;
   - valide l'entrée avec le schéma Zod du canal et répond `INVALID_INPUT` sans appeler le handler si elle est invalide ;
   - exécute le handler, valide la sortie, répond `{ ok: true, data }` ;
   - transforme toute exception en `INTERNAL` avec un message générique (jamais de stack ni de chemin) et journalise le détail.
4. **Preload** (`src/preload/index.ts`). Expose `window.couronne.app.ping(...)` et `window.couronne.app.info()` via `contextBridge`, construits à partir des définitions de canaux. Jamais `ipcRenderer` en entier. Déclare le type de `window.couronne` pour le renderer.
5. **Canaux de démonstration** (module `app`).
   - `app:ping` : entrée `{ message: string (1 à 100 caractères) }`, sortie `{ reply: string, receivedAt: string (ISO 8601) }`.
   - `app:info` : entrée `{}`, sortie `{ name, version, platform: 'win32' | 'darwin' | 'linux', electronVersion }`.
6. **Écran de démonstration** (renderer). Une page minimale avec : les informations de l'application, un bouton « Ping » qui affiche la réponse, un bouton « Envoyer une donnée invalide » qui affiche le code d'erreur reçu. Texte provisoire en dur autorisé ici (exception à la règle i18n, l'écran sera remplacé aux lots L2 à L4).
7. **Logger** (`src/main/core/logger.ts`). Niveaux debug, info, warn, error ; écrit dans `app.getPath('logs')` avec rotation par taille (1 Mo, 3 fichiers) ; sortie console en développement uniquement. Une fonction `redact` masque tout ce qui ressemble à un secret (clés nommées token, secret, password, authorization, key ; valeurs `Bearer …`). Le chemin des logs est injecté pour pouvoir tester sans Electron. Aucune nouvelle dépendance.
8. **Tests (Vitest).**
   - `register` avec un `ipcMain` simulé : entrée valide → `ok: true` ; entrée invalide → `INVALID_INPUT` et handler non appelé ; handler qui lève une exception → `INTERNAL` sans stack ; expéditeur non fiable → `FORBIDDEN_SENDER`.
   - `isTrustedSender` et `isAllowedExternalUrl` : cas valides et invalides (`http:`, `javascript:`, `file:`, URL mal formée).
   - `redact` et rotation du logger.
   - Test de fumée du renderer (Testing Library) avec `window.couronne` simulé. Tu peux ajouter `jsdom` et `@testing-library/react` : dépendances de test autorisées, à signaler dans ton plan.

## Critères d'acceptation

- `app:ping` avec un message valide renvoie la réponse attendue dans l'écran de démonstration.
- `app:ping` avec une donnée invalide est rejeté avec `INVALID_INPUT`, sans que le handler soit appelé.
- Le renderer n'a accès ni à `require`, ni à `process`, ni à `ipcRenderer` : `window.couronne` ne contient que `app.ping` et `app.info`.
- Un lien `http:` ou une navigation interne est bloqué ; un lien `https:` s'ouvre dans le navigateur.
- Le fichier journal est créé et ne contient aucun secret.
- `lint`, `typecheck`, `test` et `build` passent ; la CI est verte sur Windows, macOS et Linux.

## Vérification par Carlos (Windows)

- [ ] `npm run dev` : la fenêtre s'ouvre, « Ping » affiche une réponse, « donnée invalide » affiche `INVALID_INPUT`.
- [ ] Dans les outils de développement du renderer : `typeof require` et `typeof process` renvoient `'undefined'`, `window.ipcRenderer` est `undefined`, `window.couronne` ne contient que `app`.
- [ ] Le fichier journal existe dans le dossier des logs et ne contient aucun jeton.
- [ ] La CI est verte sur les trois systèmes avant la fusion.
