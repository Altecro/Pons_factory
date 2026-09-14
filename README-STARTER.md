# Pons Factory — Starter (scripts)

Kit de démarrage pour une usine à memecoins personnelle (scripts CLI seulement). À copier dans le dépôt [Altecro/Pons_factory](https://github.com/Altecro/Pons_factory).

## Installation

```bash
npm i
cp .env.example .env
# Remplir PRIVATE_KEY / X_BEARER_TOKEN / OPENAI_API_KEY si besoin
```

## Démo rapide

```bash
npm run trends   # écrit launches/_demo/trends.json (mock si pas de X token)
npm run ideate   # écrit launches/_demo/concepts.json
npm run site     # one-pager FR du 1er concept → launches/<slug>/site/
# ou d'un coup :
npm run demo
```

CLI Commander : `npm run factory -- trends` / `ideate` / `site`.

## Site generator

Génère une landing mobile-friendly (HTML + CSS + logo SVG) à partir d'un concept.
Thème d'accent déterministe depuis le ticker (lime / cyan / magenta / orange / violet).
Langue UI par défaut : **français**.

### Exemples

```bash
# Défaut : 1er concept, FR, thème dérivé du symbole, logo SVG généré
npm run site

# Par ticker
npm run factory -- site --symbol FROGAI --lang fr

# Version anglaise
npm run factory -- site --symbol FROGAI --lang en

# Contrat + réseaux sociaux + thème forcé
npm run factory -- site --symbol FROGAI \
  --contract 0x1234567890abcdef1234567890abcdef12345678 \
  --twitter https://x.com/example \
  --telegram https://t.me/example \
  --website https://example.com \
  --theme magenta

# Logo custom (png / svg / jpg)
npm run factory -- site --symbol FROGAI --logo ./assets/frog.png

# Autre index / fichier concepts
npm run factory -- site --from launches/_demo/concepts.json --pick 1 --lang fr
```

### Options

| Flag | Description |
|------|-------------|
| `--from <path>` | JSON des concepts |
| `--pick <index>` | Index 0-based (défaut `0`) |
| `--symbol TICKER` | Sélection par ticker |
| `--contract 0x…` | Adresse contrat (sinon « Bientôt disponible ») |
| `--theme lime\|cyan\|magenta\|orange\|violet` | Override du thème (sinon hash du ticker) |
| `--logo /chemin.png\|svg\|jpg` | Copié vers `site/logo.<ext>` |
| `--twitter URL` | Override X / Twitter |
| `--telegram URL` | Override Telegram |
| `--website URL` | Override site web |
| `--lang fr\|en` | UI localisée (défaut `fr`) |

Les chips nav vides / `#` sont **masqués**. Avec un contrat : adresse monospace, bouton Copier, lien Blockscout Robinhood Chain, lien « Trader sur Pons ».

### Fichiers écrits

- `launches/<slug>/site/index.html`
- `launches/<slug>/site/styles.css`
- `launches/<slug>/site/logo.svg` (ou `logo.png` si `--logo`)
- `launches/<slug>/meta.json` (thème, langue, note og:image)

Ouvrir la page (slug démo = `frogai` si le 1er concept est $FROGAI) :

```bash
# macOS
open launches/frogai/site/index.html
# Linux
xdg-open launches/frogai/site/index.html
# ou simplement ouvrir le fichier HTML dans un navigateur
```

Pas de graphiques de prix, pas de broadcast on-chain. Open Graph : titre + description (pas d'image absolue offline — voir `meta.json`).

## Suite prévue

- Dry-run Pons (pas encore inclus ici)
- Client X réel + idéation LLM optionnelle

## Sécurité

Ne jamais committer `.env` ni de clés privées. Les memecoins sont très risqués : vous pouvez tout perdre ; DYOR, pas un conseil financier. Ce starter n'est pas affilié à Pons ni à Robinhood.
