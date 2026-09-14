export type Concept = {
  name: string;
  symbol: string;
  oneLiner?: string;
  description: string;
  twitter?: string;
  x?: string;
  telegram?: string;
  website?: string;
};

export type Lang = "fr" | "en";
export type ThemeName = "lime" | "cyan" | "magenta" | "orange" | "violet";

export type Theme = {
  name: ThemeName;
  accent: string;
  accent2: string;
  accentRgb: string;
  accent2Rgb: string;
  onAccent: string;
};

export type RenderInput = {
  concept: Concept;
  slug: string;
  contract: string | null;
  lang: Lang;
  theme: Theme;
  logoHref: string; // relative path e.g. ./logo.svg
  logoKind: "generated" | "provided";
  logoMime?: string;
};

const THEMES: Record<ThemeName, Theme> = {
  lime: {
    name: "lime",
    accent: "#c8ff3a",
    accent2: "#5ce1ff",
    accentRgb: "200, 255, 58",
    accent2Rgb: "92, 225, 255",
    onAccent: "#081000",
  },
  cyan: {
    name: "cyan",
    accent: "#3ef0ff",
    accent2: "#a78bfa",
    accentRgb: "62, 240, 255",
    accent2Rgb: "167, 139, 250",
    onAccent: "#021018",
  },
  magenta: {
    name: "magenta",
    accent: "#ff4fd8",
    accent2: "#ffe066",
    accentRgb: "255, 79, 216",
    accent2Rgb: "255, 224, 102",
    onAccent: "#180010",
  },
  orange: {
    name: "orange",
    accent: "#ff9a3c",
    accent2: "#5ce1ff",
    accentRgb: "255, 154, 60",
    accent2Rgb: "92, 225, 255",
    onAccent: "#140800",
  },
  violet: {
    name: "violet",
    accent: "#b794ff",
    accent2: "#5ce1ff",
    accentRgb: "183, 148, 255",
    accent2Rgb: "92, 225, 255",
    onAccent: "#0c0618",
  },
};

const THEME_ORDER: ThemeName[] = ["lime", "cyan", "magenta", "orange", "violet"];

/** Deterministic 32-bit hash of a string (FNV-1a-ish). */
export function hashSymbol(symbol: string): number {
  const s = symbol.replace(/^\$/, "").toUpperCase();
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function themeFromSymbol(symbol: string): Theme {
  const idx = hashSymbol(symbol) % THEME_ORDER.length;
  return THEMES[THEME_ORDER[idx]];
}

export function resolveTheme(symbol: string, override?: string | null): Theme {
  if (override) {
    const key = override.trim().toLowerCase() as ThemeName;
    if (THEMES[key]) return THEMES[key];
    throw new Error(
      `Unknown theme "${override}". Use: ${THEME_ORDER.join("|")}`
    );
  }
  return themeFromSymbol(symbol);
}

export function isThemeName(s: string): s is ThemeName {
  return THEME_ORDER.includes(s as ThemeName);
}

type Strings = {
  kicker: string;
  ctaContract: string;
  ctaRisk: string;
  navTwitter: string;
  navTelegram: string;
  navWebsite: string;
  aboutTitle: string;
  factsTitle: string;
  factsChain: string;
  factsChainValue: string;
  factsSupply: string;
  factsSupplyValue: string;
  factsPair: string;
  factsPairValue: string;
  contractTitle: string;
  contractIntro: (sym: string) => string;
  comingSoon: string;
  copy: string;
  copied: string;
  viewExplorer: string;
  tradePons: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  footer: (sym: string) => string;
  stickyContract: string;
  stickyX: string;
  metaDescFallback: (name: string, sym: string) => string;
};

const STRINGS: Record<Lang, Strings> = {
  fr: {
    kicker: "Memecoin communautaire",
    ctaContract: "Contrat",
    ctaRisk: "Lire les risques",
    navTwitter: "Twitter / X",
    navTelegram: "Telegram",
    navWebsite: "Site web",
    aboutTitle: "Le pitch",
    factsTitle: "Fiches token",
    factsChain: "Chaîne",
    factsChainValue: "Robinhood Chain (4663)",
    factsSupply: "Supply",
    factsSupplyValue: "1B fixe (standard Pons)",
    factsPair: "Paire",
    factsPairValue: "WETH",
    contractTitle: "Contrat",
    contractIntro: (sym) => `Adresse on-chain pour <strong>$${sym}</strong>.`,
    comingSoon: "Bientôt disponible",
    copy: "Copier",
    copied: "Copié !",
    viewExplorer: "Voir sur l'explorateur",
    tradePons: "Trader sur Pons",
    disclaimerTitle: "Avertissement risque",
    disclaimerBody:
      "Les memecoins sont extrêmement risqués et finissent souvent à zéro. Cette page est purement divertissante — pas un conseil financier, pas une offre, pas une sollicitation. Vous pouvez perdre la totalité de votre mise. Faites vos propres recherches (DYOR). Ce projet <strong>n'est pas affilié à Pons, Robinhood, ni Robinhood Chain</strong>.",
    footer: (sym) =>
      `Page de lancement pour <strong>$${sym}</strong> · one-pager statique · pas de prix en direct`,
    stickyContract: "Contrat",
    stickyX: "X",
    metaDescFallback: (name, sym) =>
      `${name} ($${sym}) — memecoin communautaire sur Robinhood Chain. Divertissement uniquement ; DYOR.`,
  },
  en: {
    kicker: "Community memecoin",
    ctaContract: "Contract",
    ctaRisk: "Read the risk",
    navTwitter: "Twitter / X",
    navTelegram: "Telegram",
    navWebsite: "Website",
    aboutTitle: "The bit",
    factsTitle: "Token facts",
    factsChain: "Chain",
    factsChainValue: "Robinhood Chain (4663)",
    factsSupply: "Supply",
    factsSupplyValue: "1B fixed (Pons standard)",
    factsPair: "Pair",
    factsPairValue: "WETH",
    contractTitle: "Contract",
    contractIntro: (sym) => `On-chain address for <strong>$${sym}</strong>.`,
    comingSoon: "Coming soon",
    copy: "Copy",
    copied: "Copied!",
    viewExplorer: "View on explorer",
    tradePons: "Trade on Pons",
    disclaimerTitle: "Risk disclaimer",
    disclaimerBody:
      "Memecoins are extremely risky and often go to zero. This page is entertainment only — not financial advice, not an offer, and not a solicitation. You can lose all money you put in. Do your own research. This project is <strong>not affiliated with Pons, Robinhood, or Robinhood Chain</strong>.",
    footer: (sym) =>
      `Launch page for <strong>$${sym}</strong> · static one-pager · no live prices`,
    stickyContract: "Contract",
    stickyX: "X",
    metaDescFallback: (name, sym) =>
      `${name} ($${sym}) — community memecoin on Robinhood Chain. Entertainment only; DYOR.`,
  },
};

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Return a safe http(s) href, or empty string if missing/invalid (for hiding chips). */
export function safeHrefOrEmpty(raw: string | undefined | null): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "#") return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return "";
}

/**
 * Generate a distinctive geometric meme mark SVG (not a letter-in-square).
 * Uses accent colors; shape variant derived from symbol hash.
 */
export function generateLogoSvg(symbol: string, theme: Theme): string {
  const h = hashSymbol(symbol);
  const variant = h % 5;
  const a = theme.accent;
  const b = theme.accent2;
  const on = theme.onAccent;

  // Shared defs: soft glow
  const defs = `
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="100%" stop-color="${b}"/>
    </linearGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;

  let body: string;
  switch (variant) {
    case 0: // overlapping diamonds / chevron stack
      body = `
  <rect width="128" height="128" rx="28" fill="${on}"/>
  <g filter="url(#glow)" transform="translate(64 64)">
    <polygon points="0,-42 36,0 0,42 -36,0" fill="url(#g)" opacity="0.95"/>
    <polygon points="0,-22 18,0 0,22 -18,0" fill="${on}" opacity="0.85"/>
    <circle cx="0" cy="0" r="7" fill="${a}"/>
  </g>`;
      break;
    case 1: // orbit rings + core
      body = `
  <rect width="128" height="128" rx="28" fill="${on}"/>
  <g filter="url(#glow)" transform="translate(64 64)">
    <ellipse cx="0" cy="0" rx="46" ry="18" fill="none" stroke="${b}" stroke-width="3" opacity="0.7" transform="rotate(-25)"/>
    <ellipse cx="0" cy="0" rx="46" ry="18" fill="none" stroke="${a}" stroke-width="3" opacity="0.9" transform="rotate(35)"/>
    <circle cx="0" cy="0" r="16" fill="url(#g)"/>
    <circle cx="28" cy="-18" r="6" fill="${a}"/>
  </g>`;
      break;
    case 2: // hexagon burst
      body = `
  <rect width="128" height="128" rx="28" fill="${on}"/>
  <g filter="url(#glow)" transform="translate(64 64)">
    <polygon points="0,-44 38,-22 38,22 0,44 -38,22 -38,-22" fill="none" stroke="${b}" stroke-width="3" opacity="0.55"/>
    <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15" fill="url(#g)"/>
    <polygon points="0,-12 10,-6 10,6 0,12 -10,6 -10,-6" fill="${on}"/>
  </g>`;
      break;
    case 3: // stacked arcs / smile meme
      body = `
  <rect width="128" height="128" rx="28" fill="${on}"/>
  <g filter="url(#glow)">
    <circle cx="64" cy="64" r="40" fill="url(#g)"/>
    <circle cx="48" cy="54" r="7" fill="${on}"/>
    <circle cx="80" cy="54" r="7" fill="${on}"/>
    <path d="M42 74 Q64 96 86 74" fill="none" stroke="${on}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="98" cy="34" r="10" fill="${b}" opacity="0.9"/>
  </g>`;
      break;
    default: // interlocking triangles
      body = `
  <rect width="128" height="128" rx="28" fill="${on}"/>
  <g filter="url(#glow)" transform="translate(64 70)">
    <polygon points="0,-48 42,28 -42,28" fill="${a}" opacity="0.95"/>
    <polygon points="0,-20 24,24 -24,24" fill="${on}" opacity="0.9"/>
    <polygon points="0,8 28,48 -28,48" fill="${b}" opacity="0.85" transform="translate(0 -8)"/>
    <circle cx="0" cy="-8" r="6" fill="${a}"/>
  </g>`;
      break;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-label="${escapeHtml(
    symbol.replace(/^\$/, "").toUpperCase()
  )} mark">
${defs}
${body}
</svg>
`;
}

export function renderCss(theme: Theme): string {
  const { accent, accent2, accentRgb, accent2Rgb, onAccent } = theme;
  return `/* generated launch one-pager — dark meme, polished */
:root {
  --bg: #07070c;
  --bg-elev: #101018;
  --ink: #f4f1ea;
  --muted: #9a9588;
  --line: rgba(255, 255, 255, 0.08);
  --accent: ${accent};
  --accent-2: ${accent2};
  --accent-rgb: ${accentRgb};
  --accent-2-rgb: ${accent2Rgb};
  --on-accent: ${onAccent};
  --danger: #ff6b4a;
  --radius: 18px;
  --font-display: "Syne", system-ui, sans-serif;
  --font-body: "Outfit", system-ui, sans-serif;
  --pad-sticky: 0px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

body {
  margin: 0;
  min-height: 100vh;
  color: var(--ink);
  font-family: var(--font-body);
  background: var(--bg);
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  padding-bottom: var(--pad-sticky);
}

.bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(900px 500px at 12% -10%, rgba(var(--accent-rgb), 0.16), transparent 55%),
    radial-gradient(700px 420px at 100% 8%, rgba(var(--accent-2-rgb), 0.12), transparent 50%),
    radial-gradient(600px 400px at 50% 110%, rgba(var(--accent-rgb), 0.07), transparent 50%),
    var(--bg);
}

.bg::after {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.055;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='80' height='80' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
  pointer-events: none;
}

.wrap {
  width: min(1080px, calc(100% - 32px));
  margin: 0 auto;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 0 8px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
}

.mark,
.mark-img {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: block;
  object-fit: cover;
  flex-shrink: 0;
}

.brand-sym {
  font-weight: 700;
  letter-spacing: 0.04em;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.chip,
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  border-radius: 999px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}

.chip {
  padding: 8px 14px;
  border: 1px solid var(--line);
  color: var(--ink);
  background: rgba(255, 255, 255, 0.03);
  font-size: 0.9rem;
}

.chip:hover,
.btn:hover {
  transform: translateY(-1px);
}

.chip:hover {
  border-color: rgba(var(--accent-rgb), 0.45);
}

/* Marquee ticker strip */
.marquee {
  overflow: hidden;
  border-block: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.02);
  margin: 8px 0 0;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.marquee-track {
  display: flex;
  gap: 2.5rem;
  width: max-content;
  padding: 10px 0;
  animation: marquee 28s linear infinite;
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgba(var(--accent-rgb), 0.55);
  font-size: 0.85rem;
  text-transform: uppercase;
}

.marquee-track span {
  white-space: nowrap;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
}

.hero {
  padding: 48px 0 32px;
  text-align: center;
}

.hero-logo {
  width: clamp(88px, 18vw, 128px);
  height: clamp(88px, 18vw, 128px);
  border-radius: 28px;
  margin: 0 auto 22px;
  display: block;
  object-fit: cover;
  box-shadow:
    0 0 0 1px rgba(var(--accent-rgb), 0.25),
    0 20px 50px rgba(var(--accent-rgb), 0.18);
}

.kicker {
  display: inline-block;
  margin: 0 0 18px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(var(--accent-rgb), 0.28);
  color: var(--accent);
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
}

h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 8vw, 5.2rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
  font-weight: 800;
}

.ticker {
  margin: 18px 0 0;
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 4vw, 2.2rem);
  color: var(--accent);
  letter-spacing: 0.08em;
  font-weight: 700;
}

.oneliner {
  max-width: 34rem;
  margin: 22px auto 0;
  color: var(--muted);
  font-size: 1.15rem;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

.btn-primary {
  min-height: 48px;
  padding: 12px 22px;
  background: var(--accent);
  color: var(--on-accent);
}

.btn-ghost {
  min-height: 48px;
  padding: 12px 22px;
  border: 1px solid var(--line);
  color: var(--ink);
  background: transparent;
}

.btn-sm {
  min-height: 36px;
  padding: 6px 14px;
  font-size: 0.85rem;
  background: rgba(var(--accent-rgb), 0.15);
  color: var(--accent);
  border: 1px solid rgba(var(--accent-rgb), 0.35);
}

.btn-sm:hover {
  background: rgba(var(--accent-rgb), 0.25);
}

.grid {
  display: grid;
  gap: 16px;
  padding: 12px 0 40px;
}

@media (min-width: 760px) {
  .grid {
    grid-template-columns: 1.2fr 0.8fr;
  }
  .grid .facts {
    grid-column: 2;
    grid-row: 1 / span 2;
  }
}

.card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.018));
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 24px 22px 22px;
}

.card h2 {
  margin: 0 0 12px;
  font-family: var(--font-display);
  font-size: 1.15rem;
  letter-spacing: -0.02em;
}

.card p {
  margin: 0;
  color: var(--muted);
}

.facts dl {
  margin: 0;
  display: grid;
  gap: 14px;
}

.facts dt {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 700;
  margin: 0 0 4px;
}

.facts dd {
  margin: 0;
  font-weight: 600;
  color: var(--ink);
  font-size: 1rem;
}

.ca-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
}

.ca-box {
  flex: 1 1 200px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #0b0b12;
  border: 1px dashed rgba(var(--accent-rgb), 0.3);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.82rem;
  word-break: break-all;
  color: var(--accent-2);
}

.soon {
  color: var(--accent);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 0.82rem;
  font-weight: 700;
}

.ca-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.ca-links a {
  color: var(--accent-2);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid rgba(var(--accent-2-rgb), 0.35);
}

.ca-links a:hover {
  color: var(--accent);
  border-bottom-color: rgba(var(--accent-rgb), 0.5);
}

.disclaimer {
  margin: 0 auto 40px;
  padding: 22px 22px;
  border-radius: var(--radius);
  border: 1px solid rgba(255, 107, 74, 0.32);
  background: rgba(255, 107, 74, 0.07);
}

.disclaimer h2 {
  margin: 0 0 10px;
  color: var(--danger);
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-family: var(--font-display);
}

.disclaimer p {
  margin: 0;
  color: #d7cfc4;
  font-size: 0.94rem;
  line-height: 1.6;
}

footer {
  padding: 0 0 48px;
  color: var(--muted);
  font-size: 0.82rem;
  text-align: center;
}

footer strong {
  color: var(--ink);
  font-weight: 600;
}

/* Mobile sticky CTA bar */
.sticky-cta {
  display: none;
}

@media (max-width: 720px) {
  body.has-sticky {
    --pad-sticky: 72px;
  }
  .sticky-cta {
    display: flex;
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: 12px;
    z-index: 40;
    gap: 8px;
    padding: 10px;
    border-radius: 16px;
    background: rgba(10, 10, 16, 0.92);
    border: 1px solid var(--line);
    backdrop-filter: blur(12px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
  }
  .sticky-cta .btn {
    flex: 1;
    min-height: 44px;
    font-size: 0.92rem;
  }
}
`;
}

export function renderHtml(input: RenderInput): string {
  const { concept, slug, contract, lang, theme, logoHref, logoMime } = input;
  const t = STRINGS[lang];
  const name = escapeHtml(concept.name);
  const symbolRaw = concept.symbol.replace(/^\$/, "").toUpperCase();
  const symbol = escapeHtml(symbolRaw);
  const oneLinerRaw =
    concept.oneLiner?.trim() ||
    concept.description.split(".")[0] ||
    concept.description;
  const oneLiner = escapeHtml(oneLinerRaw);
  const description = escapeHtml(concept.description);
  const metaDesc = escapeHtml(
    oneLinerRaw || t.metaDescFallback(concept.name, symbolRaw)
  );
  const title = `${name} · $${symbol}`;

  const twitter = safeHrefOrEmpty(concept.twitter ?? concept.x);
  const telegram = safeHrefOrEmpty(concept.telegram);
  const website = safeHrefOrEmpty(concept.website);

  const navChips: string[] = [];
  if (twitter) {
    navChips.push(
      `<a class="chip" href="${escapeHtml(twitter)}" rel="noopener noreferrer" target="_blank">${t.navTwitter}</a>`
    );
  }
  if (telegram) {
    navChips.push(
      `<a class="chip" href="${escapeHtml(telegram)}" rel="noopener noreferrer" target="_blank">${t.navTelegram}</a>`
    );
  }
  if (website) {
    navChips.push(
      `<a class="chip" href="${escapeHtml(website)}" rel="noopener noreferrer" target="_blank">${t.navWebsite}</a>`
    );
  }
  const navHtml =
    navChips.length > 0
      ? `<nav aria-label="Social">\n        ${navChips.join("\n        ")}\n      </nav>`
      : "";

  const explorer = contract
    ? `https://robinhoodchain.blockscout.com/address/${encodeURIComponent(contract)}`
    : "";
  const ponsTrade = "https://ponsfamily.com";

  let contractBody: string;
  let copyScript = "";
  if (contract) {
    const caEsc = escapeHtml(contract);
    contractBody = `
          <p>${t.contractIntro(symbol)}</p>
          <div class="ca-row">
            <code class="ca-box" id="ca-addr">${caEsc}</code>
            <button type="button" class="btn btn-sm" id="ca-copy" data-addr="${caEsc}">${t.copy}</button>
          </div>
          <div class="ca-links">
            <a href="${escapeHtml(explorer)}" rel="noopener noreferrer" target="_blank">${t.viewExplorer}</a>
            <a href="${escapeHtml(ponsTrade)}" rel="noopener noreferrer" target="_blank">${t.tradePons}</a>
          </div>`;
    copyScript = `
<script>
(function () {
  var btn = document.getElementById("ca-copy");
  if (!btn) return;
  var label = ${JSON.stringify(t.copy)};
  var done = ${JSON.stringify(t.copied)};
  btn.addEventListener("click", function () {
    var addr = btn.getAttribute("data-addr") || "";
    function ok() {
      btn.textContent = done;
      setTimeout(function () { btn.textContent = label; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(addr).then(ok).catch(function () {
        var ta = document.createElement("textarea");
        ta.value = addr;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); ok(); } catch (e) {}
        document.body.removeChild(ta);
      });
    } else {
      var ta = document.createElement("textarea");
      ta.value = addr;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); ok(); } catch (e) {}
      document.body.removeChild(ta);
    }
  });
})();
</script>`;
  } else {
    contractBody = `
          <p>${t.contractIntro(symbol)}</p>
          <div class="ca-box"><span class="soon">${t.comingSoon}</span></div>`;
  }

  // Marquee: repeat $SYMBOL many times
  const marqueeItem = `<span>$${symbol}</span>`;
  const marqueeInner = Array(12).fill(marqueeItem).join("");

  const showSticky = Boolean(contract || twitter);
  const stickyParts: string[] = [];
  if (contract) {
    stickyParts.push(
      `<a class="btn btn-primary" href="#ca">${t.stickyContract}</a>`
    );
  }
  if (twitter) {
    stickyParts.push(
      `<a class="btn btn-ghost" href="${escapeHtml(twitter)}" rel="noopener noreferrer" target="_blank">${t.stickyX}</a>`
    );
  }
  const stickyHtml = showSticky
    ? `\n  <div class="sticky-cta" aria-label="Quick actions">\n    ${stickyParts.join("\n    ")}\n  </div>`
    : "";

  const logoEsc = escapeHtml(logoHref);

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${metaDesc}" />
  <meta name="robots" content="noindex, nofollow" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${metaDesc}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${metaDesc}" />
  <link rel="icon" href="${logoEsc}"${logoMime ? ` type="${escapeHtml(logoMime)}"` : ""} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./styles.css" />
</head>
<body${showSticky ? ' class="has-sticky"' : ""}>
  <div class="bg" aria-hidden="true"></div>
  <div class="wrap">
    <header>
      <a class="brand" href="#top">
        <img class="mark-img" src="${logoEsc}" width="40" height="40" alt="$${symbol}" />
        <span class="brand-sym">$${symbol}</span>
      </a>
${navHtml ? `
      ${navHtml}` : ""}
    </header>

    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">
        ${marqueeInner}${marqueeInner}
      </div>
    </div>

    <main id="top">
      <section class="hero">
        <img class="hero-logo" src="${logoEsc}" width="128" height="128" alt="$${symbol} logo" />
        <p class="kicker">${t.kicker}</p>
        <h1>${name}</h1>
        <p class="ticker">$${symbol}</p>
        <p class="oneliner">${oneLiner}</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="#ca">${t.ctaContract}</a>
          <a class="btn btn-ghost" href="#risk">${t.ctaRisk}</a>
        </div>
      </section>

      <section class="grid" aria-label="Details">
        <article class="card">
          <h2>${t.aboutTitle}</h2>
          <p>${description}</p>
        </article>
        <article class="card facts">
          <h2>${t.factsTitle}</h2>
          <dl>
            <div>
              <dt>${t.factsChain}</dt>
              <dd>${t.factsChainValue}</dd>
            </div>
            <div>
              <dt>${t.factsSupply}</dt>
              <dd>${t.factsSupplyValue}</dd>
            </div>
            <div>
              <dt>${t.factsPair}</dt>
              <dd>${t.factsPairValue}</dd>
            </div>
          </dl>
        </article>
        <article class="card" id="ca">
          <h2>${t.contractTitle}</h2>
          ${contractBody}
        </article>
      </section>

      <aside class="disclaimer" id="risk">
        <h2>${t.disclaimerTitle}</h2>
        <p>
          ${t.disclaimerBody}
        </p>
      </aside>
    </main>

    <footer>
      <p>${t.footer(symbol)}</p>
    </footer>
  </div>${stickyHtml}
  ${copyScript}
</body>
</html>
`;
}
