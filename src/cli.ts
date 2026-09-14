#!/usr/bin/env node
import { Command } from "commander";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function runScript(rel: string, extraArgs: string[] = []): Promise<number> {
  const script = path.join(__dirname, rel);
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ["--import", "tsx", script, ...extraArgs],
      { stdio: "inherit", env: process.env }
    );
    child.on("error", reject);
    child.on("close", (code) => resolve(code ?? 1));
  });
}

const program = new Command();
program
  .name("factory")
  .description("Pons memecoin factory starter CLI")
  .version("0.1.0");

program
  .command("trends")
  .description("Fetch (or mock) viral trends into launches/_demo/trends.json")
  .action(async () => {
    const code = await runScript("trends/run.ts");
    process.exit(code);
  });

program
  .command("ideate")
  .description("Turn trends into launch concepts (launches/_demo/concepts.json)")
  .option("--from <path>", "Path to trends JSON")
  .action(async (opts: { from?: string }) => {
    const extra = opts.from ? ["--from", opts.from] : [];
    const code = await runScript("ideate/run.ts", extra);
    process.exit(code);
  });

program
  .command("site")
  .description("Generate a static one-pager from a concept (launches/<slug>/site/)")
  .option("--from <path>", "Path to concepts JSON")
  .option("--pick <index>", "0-based concept index (default: 0)")
  .option("--symbol <ticker>", "Select concept by ticker")
  .option("--contract <address>", "Contract address (default: Coming soon / Bientôt)")
  .option(
    "--theme <name>",
    "Accent theme override: lime|cyan|magenta|orange|violet (default: hash of ticker)"
  )
  .option("--logo <path>", "Logo image (png|svg|jpg) — copied to site/logo.<ext>")
  .option("--twitter <url>", "Override Twitter / X URL")
  .option("--telegram <url>", "Override Telegram URL")
  .option("--website <url>", "Override website URL")
  .option("--lang <code>", "UI language: fr|en (default: fr)", "fr")
  .action(
    async (opts: {
      from?: string;
      pick?: string;
      symbol?: string;
      contract?: string;
      theme?: string;
      logo?: string;
      twitter?: string;
      telegram?: string;
      website?: string;
      lang?: string;
    }) => {
      const extra: string[] = [];
      if (opts.from) extra.push("--from", opts.from);
      if (opts.pick !== undefined) extra.push("--pick", String(opts.pick));
      if (opts.symbol) extra.push("--symbol", opts.symbol);
      if (opts.contract) extra.push("--contract", opts.contract);
      if (opts.theme) extra.push("--theme", opts.theme);
      if (opts.logo) extra.push("--logo", opts.logo);
      if (opts.twitter) extra.push("--twitter", opts.twitter);
      if (opts.telegram) extra.push("--telegram", opts.telegram);
      if (opts.website) extra.push("--website", opts.website);
      if (opts.lang) extra.push("--lang", opts.lang);
      const code = await runScript("site/run.ts", extra);
      process.exit(code);
    }
  );

program.parseAsync(process.argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
