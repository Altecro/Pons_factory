import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { MockTrend } from "../trends/mock.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const defaultFrom = path.join(root, "launches", "_demo", "trends.json");
const defaultOut = path.join(root, "launches", "_demo", "concepts.json");

export type Concept = {
  name: string;
  symbol: string;
  oneLiner: string;
  description: string;
};

function parseArgs(argv: string[]): { from: string; out: string } {
  let from = defaultFrom;
  let out = defaultOut;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--from" && argv[i + 1]) {
      from = path.resolve(argv[++i]);
    } else if (argv[i] === "--out" && argv[i + 1]) {
      out = path.resolve(argv[++i]);
    }
  }
  return { from, out };
}

function titleCase(words: string[]): string {
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function conceptFromTrend(trend: MockTrend, index: number): Concept {
  const ticker =
    trend.tickerSuggestions[0]?.replace(/^\$/, "") ??
    `MEME${index + 1}`;
  const words = trend.topic
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3);
  const name =
    words.length > 0 ? titleCase(words) : `Trend Coin ${index + 1}`;

  return {
    name,
    symbol: ticker.toUpperCase().slice(0, 10),
    oneLiner: `${name} — riding "${trend.topic}" vibes.`,
    description: `Community memecoin inspired by viral topic "${trend.topic}" (engagement ~${trend.engagement}). Suggested tickers: ${trend.tickerSuggestions.join(", ")}. Pure entertainment; DYOR.`,
  };
}

async function main() {
  const { from, out } = parseArgs(process.argv.slice(2));
  const raw = await readFile(from, "utf8");
  const trends = JSON.parse(raw) as MockTrend[];
  if (!Array.isArray(trends) || trends.length === 0) {
    throw new Error(`No trends found in ${from}`);
  }

  const concepts = trends.slice(0, 3).map(conceptFromTrend);
  // Pad to 3 if fewer trends
  while (concepts.length < 3 && trends.length > 0) {
    const t = trends[concepts.length % trends.length];
    concepts.push(conceptFromTrend(t, concepts.length));
  }

  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, JSON.stringify(concepts, null, 2) + "\n", "utf8");
  console.log(`Wrote ${out} (${concepts.length} concepts)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
