/**
 * Build Documentation Bundle
 *
 * Summary:
 * Collects all Markdown files from the `docs/` directory and bundles
 * their contents into `worker/src/docsBundle.json`.
 *
 * Purpose:
 * - Keep the Cloudflare Worker local documentation fallback up to date.
 * - Avoid manually editing `docsBundle.json`.
 * - Regenerate the bundle whenever documentation changes.
 *
 * Usage:
 *   node ./scripts/build-docs-bundle.js
 *
 * Input:
 *   docs/**//*.md
 *
 * Output:
 *   worker/src/docsBundle.json
 */

import fs from "node:fs";
import path from "node:path";

// ============================================================
// Configuration
// ============================================================

// Project root directory.
const ROOT = process.cwd();

// Directory containing all project documentation.
const DOCS_DIR = path.join(ROOT, "docs");

// Generated JSON file consumed by the Cloudflare Worker.
const OUTPUT = path.join(ROOT, "worker", "src", "docsBundle.json");

// ============================================================
// Helper Functions
// ============================================================

/**
 * Recursively finds all Markdown files inside a directory.
 *
 * @param {string} dir - Directory to search.
 * @returns {string[]} Absolute paths of all `.md` files.
 */
function getMarkdownFiles(dir) {
  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Search nested directories recursively.
      files.push(...getMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      // Add Markdown files to the bundle source list.
      files.push(fullPath);
    }
  }

  return files;
}

// ============================================================
// Build Bundle
// ============================================================

// Find every Markdown document inside `docs/`.
const markdownFiles = getMarkdownFiles(DOCS_DIR);

// Object structure:
//
// {
//   "docs/example.md": "Markdown content...",
//   "docs/projects/example.md": "Markdown content..."
// }
const bundle = {};

for (const file of markdownFiles) {
  // Convert the absolute file path into a project-relative path.
  // Example:
  // E:\Project\docs\projects\demo.md
  // becomes:
  // docs/projects/demo.md
  const relativePath = path
    .relative(ROOT, file)
    .replaceAll(path.sep, "/");

  // Read the Markdown file as UTF-8 text.
  const content = fs.readFileSync(file, "utf8");

  // Store the document using its relative path as the JSON key.
  bundle[relativePath] = content;
}

// ============================================================
// Write Output
// ============================================================

// Convert the bundle object into readable JSON.
const output = JSON.stringify(bundle, null, 2);

// Write the generated bundle to the Worker source directory.
fs.writeFileSync(OUTPUT, output, "utf8");

// ============================================================
// Result
// ============================================================

console.log(`✅ Đã bundle ${markdownFiles.length} file Markdown.`);
console.log(`📦 Output: ${OUTPUT}`);