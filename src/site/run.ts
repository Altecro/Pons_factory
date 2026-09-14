import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateLogoSvg,
  isThemeName,
  renderCss,
  renderHtml,
  resolveTheme,
  safeHrefOrEmpty,
  type Concept,
  type Lang,
  type ThemeName,
} from "./render.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const defaultFrom = path.join(root, "launches", "_demo", "concepts.json");

type Args = {
  from: string;
  pick: number;
  symbol?: string;
  contract?: string;
  theme?: string;
  logo?: string;
  twitter?: string;
  telegram?: string;
  website?: string;
  lang: Lang;
};

function parseArgs(argv: string[]): Args {
  let from = defaultFrom;
  let pick = 0;
  let symbol: string | undefined;
  let contract: string | undefined;
  let theme: string | undefined;
  let logo: string | undefined;
  let twitter: string | undefined;
  let telegram: string | undefined;
  let website: string | undefined;
  let lang: Lang = "fr";

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--from" && argv[i + 1]) {
      from = path.resolve(argv[++i]);
    } else if (a === "--pick" && argv[i + 1]) {
      pick = Number(argv[++i]);
    } else if (a === "--symbol" && argv[i + 1]) {
      symbol = argv[++i];
    } else if (a === "--contract" && argv[i + 1]) {
      contract = argv[++i];
    } else if (a === "--theme" && argv[i + 1]) {
      theme = argv[++i];
    } else if (a === "--logo" && argv[i + 1]) {
      logo = path.resolve(argv[++i]);
    } else if (a === "--twitter" && argv[i + 1]) {
      twitter = argv[++i];
    } else if (a === "--telegram" && argv[i + 1]) {
      telegram = argv[++i];
    } else if (a === "--website" && argv[i + 1]) {
      website = argv[++i];
    } else if (a === "--lang" && argv[i + 1]) {
      const v = argv[++i].toLowerCase();
      if (v !== "fr" && v !== "en") {
        throw new Error(`Invalid --lang "${v}" (expected fr|en)`);
      }
      lang = v;
    }
  }
  if (!Number.isInteger(pick) || pick < 0) {
    throw new Error(`Invalid --pick value (expected 0-based integer)`);
  }
  if (theme && !isThemeName(theme.toLowerCase())) {
    throw new Error(
      `Unknown --theme "${theme}". Use: lime|cyan|magenta|orange|violet`
    );
  }
  return {
    from,
    pick,
    symbol,
    contract,
    theme: theme?.toLowerCase(),
    logo,
    twitter,
    telegram,
    website,
    lang,
  };
}

function slugify(concept: Concept): string {
  const fromSymbol = concept.symbol
    .replace(/^\$/, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
  if (fromSymbol) return fromSymbol;
  const fromName = concept.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return fromName || "memecoin";
}

function pickConcept(concepts: Concept[], args: Args): Concept {
  if (args.symbol) {
    const want = args.symbol.replace(/^\$/, "").toUpperCase();
    const found = concepts.find(
      (c) => c.symbol.replace(/^\$/, "").toUpperCase() === want
    );
    if (!found) {
      throw new Error(`No concept with symbol ${args.symbol} in ${args.from}`);
    }
    return found;
  }
  const chosen = concepts[args.pick];
  if (!chosen) {
    throw new Error(
      `No concept at index ${args.pick} (have ${concepts.length}) in ${args.from}`
    );
  }
  return chosen;
}

function mergeSocial(concept: Concept, args: Args): Concept {
  return {
    ...concept,
    twitter: args.twitter ?? concept.twitter ?? concept.x,
    telegram: args.telegram ?? concept.telegram,
    website: args.website ?? concept.website,
  };
}

function logoExt(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase().replace(/^\./, "");
  if (!["png", "svg", "jpg", "jpeg", "webp", "gif"].includes(ext)) {
    throw new Error(
      `Unsupported --logo extension ".${ext}". Use png|svg|jpg|jpeg|webp|gif`
    );
  }
  return ext === "jpeg" ? "jpg" : ext;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const raw = await readFile(args.from, "utf8");
  const concepts = JSON.parse(raw) as Concept[];
  if (!Array.isArray(concepts) || concepts.length === 0) {
    throw new Error(`No concepts found in ${args.from}`);
  }

  const base = pickConcept(concepts, args);
  const concept = mergeSocial(base, args);
  const slug = slugify(concept);
  const theme = resolveTheme(concept.symbol, args.theme ?? null);
  const launchDir = path.join(root, "launches", slug);
  const siteDir = path.join(launchDir, "site");
  const indexPath = path.join(siteDir, "index.html");
  const cssPath = path.join(siteDir, "styles.css");
  const metaPath = path.join(launchDir, "meta.json");

  await mkdir(siteDir, { recursive: true });

  let logoFile: string;
  let logoKind: "generated" | "provided";
  if (args.logo) {
    const ext = logoExt(args.logo);
    logoFile = `logo.${ext}`;
    await copyFile(args.logo, path.join(siteDir, logoFile));
    logoKind = "provided";
  } else {
    logoFile = "logo.svg";
    const svg = generateLogoSvg(concept.symbol, theme);
    await writeFile(path.join(siteDir, logoFile), svg, "utf8");
    logoKind = "generated";
  }

  const logoHref = `./${logoFile}`;
  const mimeByExt: Record<string, string> = {
    svg: "image/svg+xml",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
  };
  const logoExtName = path.extname(logoFile).slice(1).toLowerCase();
  const logoMime = mimeByExt[logoExtName] ?? "image/svg+xml";

  const html = renderHtml({
    concept,
    slug,
    contract: args.contract ?? null,
    lang: args.lang,
    theme,
    logoHref,
    logoKind,
    logoMime,
  });
  const css = renderCss(theme);

  const rel = (abs: string) => path.relative(root, abs).split(path.sep).join("/");

  const twitter = safeHrefOrEmpty(concept.twitter ?? concept.x);
  const telegram = safeHrefOrEmpty(concept.telegram);
  const website = safeHrefOrEmpty(concept.website);

  const meta = {
    slug,
    name: concept.name,
    symbol: concept.symbol.replace(/^\$/, "").toUpperCase(),
    description: concept.description,
    lang: args.lang,
    theme: theme.name as ThemeName,
    contract: args.contract ?? null,
    logo: rel(path.join(siteDir, logoFile)),
    logoKind,
    social: {
      twitter: twitter || null,
      telegram: telegram || null,
      website: website || null,
    },
    og: {
      title: `${concept.name} · $${concept.symbol.replace(/^\$/, "").toUpperCase()}`,
      description:
        concept.oneLiner?.trim() ||
        concept.description.split(".")[0] ||
        concept.description,
      type: "website",
      // Relative og:image does not work well offline / without a public base URL.
      image: null as string | null,
      imageNote:
        "Set an absolute public URL for og:image if hosting online; local logo is at site/" +
        logoFile,
    },
    generatedAt: new Date().toISOString(),
    paths: {
      launch: rel(launchDir),
      site: rel(siteDir),
      index: rel(indexPath),
      styles: rel(cssPath),
      logo: rel(path.join(siteDir, logoFile)),
      meta: rel(metaPath),
    },
  };

  await writeFile(indexPath, html, "utf8");
  await writeFile(cssPath, css, "utf8");
  await writeFile(metaPath, JSON.stringify(meta, null, 2) + "\n", "utf8");

  console.log(
    `Wrote site for $${meta.symbol} [${meta.lang}/${meta.theme}] → ${rel(siteDir)}/`
  );
  console.log(`Open: ${indexPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
