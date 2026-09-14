# Changelog — Site generator

## Améliorations (2026-09)

- **Thème déterministe** : hash du ticker → accent lime / cyan / magenta / orange / violet. Override CLI `--theme`.
- **Logo** : `--logo` copie l'image dans `site/logo.<ext>` ; sinon SVG géométrique unique (marque meme, pas une lettre dans un carré) utilisé en header, hero et favicon.
- **Socials CLI** : `--twitter` / `--telegram` / `--website` fusionnés sur le concept ; chips morts (`#` / vide) masqués.
- **i18n FR/EN** : `--lang fr|en` (défaut `fr`). Toutes les chaînes UI + meta description localisées.
- **UX contrat** : adresse monospace, bouton Copier (JS inline), lien explorateur Blockscout, lien « Trader sur Pons ».
- **Open Graph / Twitter cards** : og:title, og:description, og:type=website, twitter:card=summary ; note og:image dans `meta.json` (pas d'URL absolue offline).
- **Sections** : hero + logo large, marquee `$SYMBOL` (CSS), about, fiches token (chaîne 4663, supply 1B, paire WETH), contrat, disclaimer renforcé.
- **Design** : grain doux, espacements, barre CTA sticky mobile (Contrat / X), `prefers-reduced-motion`.
