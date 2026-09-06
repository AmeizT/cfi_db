import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(filePath);
    return /\.(?:ts|tsx|css)$/.test(entry.name) ? [filePath] : [];
  }));
  return nested.flat();
}

test("Create Home topbar omits yearly progress while the report card retains its count", async () => {
  const [topbar, dashboard] = await Promise.all([
    readFile("src/features/create/CreateTopbar.tsx", "utf8"),
    readFile("src/features/create/CreateDashboard.tsx", "utf8"),
  ]);

  assert.doesNotMatch(topbar, /year.*progress|submitted.*total|percentage/i);
  assert.match(dashboard, /\{submitted\}\/\{total\}/);
  assert.match(dashboard, /title=\{`\$\{submitted\} of \$\{total\} submitted this year`\}/);
});

test("Create Home uses semantic theme surfaces and a shared five-band inverse cone", async () => {
  const [hub, dashboard] = await Promise.all([
    readFile("src/features/create/CreateHub.tsx", "utf8"),
    readFile("src/features/create/CreateDashboard.tsx", "utf8"),
  ]);

  assert.match(hub, /min-h-screen bg-background/);
  assert.match(dashboard, /bg-primary p-6 text-left text-primary-foreground/);
  assert.match(dashboard, /<GradientCone variant="inverse" \/>/);
  assert.match(dashboard, /pointer-events-none absolute bottom-0 right-0/);

  const inverseCone = dashboard.match(/const inverseConeStyles = \{([\s\S]*?)\n\}/)?.[1] ?? "";
  assert.equal((inverseCone.match(/bg-primary-foreground/g) ?? []).length, 5);
  assert.equal((dashboard.match(/<span\n\s+className=\{cn\(\n\s+"absolute -bottom/g) ?? []).length, 5);
});

test("all reporting RowCards share GradientCone and the resume rail has no fake entries", async () => {
  const dashboard = await readFile("src/features/create/CreateDashboard.tsx", "utf8");

  for (const title of ["Templates", "Manual entry", "Uploads"]) {
    assert.match(dashboard, new RegExp(`title: "${title}"[\\s\\S]*?accent:`));
  }
  assert.match(dashboard, /function RowCard[\s\S]*<GradientCone accent=\{accent\} \/>/);
  assert.match(dashboard, /reportExists && !reportCompleted/);
  assert.match(dashboard, /No unfinished items yet\./);
  assert.doesNotMatch(dashboard, /Finance template|Attendance upload|View all drafts/);
});

test("features/create contains no prototype application colors or deprecated route literals", async () => {
  const files = await sourceFiles("src/features/create");
  const sources = await Promise.all(files.map((file) => readFile(file, "utf8")));
  const combined = sources.join("\n");

  assert.doesNotMatch(combined, /#(?:fbf3de|f4ead1|26215c|1b1846|6c5ce7|5b4bd6)/i);
  assert.doesNotMatch(combined, /["'`]\/forms\//);
});
