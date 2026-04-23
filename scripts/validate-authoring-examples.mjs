/**
 * Runtime structural checks for example JSON under `examples/`.
 * Complements `as const satisfies BagelGame` (TypeScript) with Zod at the JSON boundary.
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const examplesDir = join(repoRoot, "examples");

/** Loose schema for authoring-time `BagelGame` JSON (examples + external files). */
export const authoringBagelGameSchema = z
  .object({
    entities: z.array(z.record(z.unknown())).min(1),
    sharedBoard: z.array(z.unknown()).optional(),
    personalBoard: z.array(z.unknown()).optional(),
    initialPlacements: z.array(z.unknown()).optional(),
    numPlayers: z.number().optional(),
    minPlayers: z.number().optional(),
    maxPlayers: z.number().optional(),
    turn: z.record(z.unknown()).optional(),
    moves: z.record(z.unknown()).optional(),
    initialMoves: z.array(z.unknown()).optional(),
    phases: z.record(z.unknown()).optional(),
    endIf: z.array(z.unknown()).optional(),
    DEBUG_DISABLE_SECRET_STATE: z.boolean().optional(),
  })
  .passthrough();

async function main () {
  const files = (await readdir(examplesDir, { withFileTypes: true }))
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".json"))
    .map((e) => e.name)
    .sort();

  if (!files.length) {
    console.warn("validate-authoring-examples: no JSON files in examples/");
    return;
  }

  for (const name of files) {
    const raw = await readFile(join(examplesDir, name), "utf8");
    const json = JSON.parse(raw);
    authoringBagelGameSchema.parse(json);
  }

  console.log(`validate-authoring-examples: ${files.length} file(s) OK`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
