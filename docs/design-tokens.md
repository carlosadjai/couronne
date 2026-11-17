# Tokens de Design — Couronne

Ce document formalise les jetons graphiques (tokens CSS) de Couronne, validés selon les critères d'accessibilité WCAG 2.1 AA (contraste texte $\ge 4{,}5:1$, contrastes composants/bordures/focus $\ge 3{,}0:1$).

---

## 1. Palette de référence et calibrage des contrastes

Le thème **sombre** est le thème de référence ; le thème **clair** est son miroir.

| Token CSS | Rôle | Sombre (Référence) | Clair (Miroir) | Ratio Sombre | Ratio Clair |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--bg` | Fond principal de l'application | `#0F1115` | `#FAFAF7` | — | — |
| `--surface` | Cartes, panneaux, survols | `#171A21` | `#FFFFFF` | — | — |
| `--border` | Bordures de cartes, séparateurs | `#616D86` | `#858C98` | $\ge 3{,}3:1$ sur `--surface` | $\ge 3{,}2:1$ sur `--surface` |
| `--text` | Texte principal | `#E6E8ED` | `#1A1D23` | $\ge 14{,}6:1$ sur `--bg` | $\ge 15{,}8:1$ sur `--bg` |
| `--text-muted` | Texte secondaire, métadonnées | `#9AA2B2` | `#5A6272` | $\ge 6{,}9:1$ sur `--bg` | $\ge 6{,}3:1$ sur `--bg` |
| `--accent` | Fond des éléments dorés (boutons, pastilles) | `#D4AF37` | `#C69214` | — | — |
| `--accent-fg` | Texte posé sur fond doré | `#0F1115` | `#0F1115` | $\ge 9{,}7:1$ sur `--accent` | $\ge 7{,}6:1$ sur `--accent` |
| `--accent-text` | Doré utilisé comme texte ou icône sur fond | `#D4AF37` | `#7A5200` | $\ge 8{,}9:1$ sur `--bg` | $\ge 5{,}7:1$ sur `--bg` |
| `--focus-ring` | Anneau de focus visible (clavier) | `#D4AF37` | `#946600` | $\ge 8{,}9:1$ sur `--bg` | $\ge 4{,}1:1$ sur `--bg` |
| `--danger` | Erreur, destruction, échec | `#EF4444` | `#B91C1C` | $\ge 4{,}5:1$ sur `--bg` | $\ge 6{,}6:1$ sur `--bg` |
| `--danger-surface`| Fond d'alerte erreur | `#2A1517` | `#FEE2E2` | — | — |
| `--warning` | Avertissement, surveillance | `#F59E0B` | `#7F5200` | $\ge 8{,}6:1$ sur `--bg` | $\ge 5{,}4:1$ sur `--bg` |
| `--warning-surface`| Fond d'alerte avertissement | `#2A2010` | `#FEF3C7` | — | — |
| `--success` | Succès, validation, actif | `#10B981` | `#047857` | $\ge 6{,}8:1$ sur `--bg` | $\ge 5{,}0:1$ sur `--bg` |
| `--success-surface`| Fond d'alerte succès | `#0E231B` | `#D1FAE5` | — | — |
| `--info` | Information, synchronisation | `#3B82F6` | `#1D4ED8` | $\ge 4{,}7:1$ sur `--bg` | $\ge 6{,}4:1$ sur `--bg` |
| `--info-surface` | Fond d'alerte information | `#101D33` | `#DBEAFE` | — | — |

---

## 2. Règles d'usage des trois dorés

L'or de Couronne ne peut pas être un jeton unique sous peine de violer les règles d'accessibilité WCAG AA (un doré clair sur fond blanc offre un ratio insuffisant d'environ $3{,}3:1$). Le système décline donc le doré en trois rôles distincts :

1. **`--accent` (Fond)**
   - Utilisé exclusivement comme couleur de fond d'un élément interactif ou décoratif (ex. fond du `Button` en variante `primary`).
   - Ne doit jamais recevoir de texte clair : seul `--accent-fg` est autorisé par-dessus.

2. **`--accent-fg` (Texte sur fond doré)**
   - Utilisé exclusivement pour le texte et les icônes posés sur un fond `--accent`.
   - Sa valeur est un sombre profond (`#0F1115`) dans les **deux thèmes**, garantissant un contraste supérieur à $7{,}6:1$.

3. **`--accent-text` (Texte ou icône dorée sur fond normal)**
   - Utilisé lorsque le doré doit être lisible comme texte, lien ou icône sur le fond normal (`--bg` ou `--surface`).
   - En thème clair, cette valeur est calibrée à `#7A5200` (un doré bronze plus profond) afin de dépasser le seuil minimal de $4{,}5:1$ ($5{,}7:1$ mesuré).

---

## 3. Typographie et Rayons

- **Polices embarquées (zéro CDN, zéro requête externe)** :
  - Interface : `Inter Variable` (`@fontsource-variable/inter`)
  - Code & Monospace : `JetBrains Mono Variable` (`@fontsource-variable/jetbrains-mono`)
- **Échelle typographique** :
  - `xs` : 12 px (badges, Kbd, métadonnées secondaires)
  - `sm` : 13-14 px (corps de texte par défaut, listes denses, boutons)
  - `base` : 16 px (titres de cartes, modales)
  - `lg` : 18-20 px (sous-titres)
  - `xl` : 24 px (titres principaux)
- **Rayons (`border-radius`)** :
  - `--radius-sm` : 6 px (boutons, inputs, badges, kbd)
  - `--radius-md` : 10 px (cartes, dialogues, popovers)
  - `--radius-full` : 9999 px (indicateurs circulaires, pilules)

---

## 4. Guide de contribution : Ajouter un composant

Tout nouveau composant ajouté dans `src/renderer/src/ui/` doit respecter les règles suivantes :

1. **Accessibilité Radix UI** :
   - Si une primitive Radix UI existe pour le type de composant (`Dialog`, `Select`, `Switch`, `Tooltip`, etc.), s'appuyer systématiquement dessus.
2. **Gestion des variantes (CVA & Tailwind)** :
   - Définir les classes et variantes à l'aide de `class-variance-authority` (cva) et de l'utilitaire `cn()`.
   - Utiliser systématiquement les variables CSS via `var(--...)` pour garantir la compatibilité instantanée avec les thèmes sombre et clair.
3. **Navigation Clavier et Focus** :
   - Tout élément interactif doit avoir un état de focus visible (`focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]`). Ne jamais désactiver l'anneau de focus sans fournir un remplacement accessible.
   - Les raccourcis clavier standards (Tab, Entrée, Espace, Échap, Flèches) doivent être supportés.
4. **Pas de couleur seule pour un état** :
   - Toujours associer une icône Lucide ou un libellé textuel explicite aux états de succès, danger, alerte ou info.
5. **Labels obligatoires** :
   - Pour les boutons d'icônes seuls (`IconButton`), une propriété `label` obligatoire doit alimenter à la fois `aria-label` et l'infobulle `Tooltip`.
6. **Tests Vitest + Testing Library** :
   - Écrire un test unitaire validant le rendu, les variantes principales, le comportement clavier et l'état désactivé.
