import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "../config.js";
import { mockTrends } from "./mock.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const outDir = path.join(root, "launches", "_demo");
const outPath = path.join(outDir, "trends.json");

async function main() {
  if (!config.xBearerToken) {
    console.log("X_BEARER_TOKEN missing — using mock trends.");
  } else {
    // TODO: real X (Twitter) client comes next — still using mock for now
    console.log(
      "X_BEARER_TOKEN present — TODO: wire real X client; using mock for now."
    );
  }

  const trends = mockTrends();
  await mkdir(outDir, { recursive: true });
  await writeFile(outPath, JSON.stringify(trends, null, 2) + "\n", "utf8");
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
