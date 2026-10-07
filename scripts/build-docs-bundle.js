import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, "docs");
const OUTPUT = path.join(ROOT, "worker", "src", "docsBundle.json");

function getMarkdownFiles(dir) {
  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

const files = getMarkdownFiles(DOCS_DIR);
const bundle = {};

for (const file of files) {
  const relativePath = path
    .relative(ROOT, file)
    .replaceAll(path.sep, "/");

  bundle[relativePath] = fs.readFileSync(file, "utf8");
}

fs.writeFileSync(
  OUTPUT,
  JSON.stringify(bundle, null, 2),
  "utf8"
);

console.log(`✅ Đã bundle ${files.length} file Markdown`);
console.log(`📦 Output: ${OUTPUT}`);