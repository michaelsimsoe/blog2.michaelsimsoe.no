import { exec } from "child_process";
import * as path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, "../pages");
const OUTPUT_DIR = path.join(__dirname, "../dist");
const JSON_FILE = path.join(__dirname, "../data/posts.json");

// If no OUTPUT_DIR exists, create it
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

const buildAllPagesCommand = `node scripts/build-pages.cjs build-all`;
exec(buildAllPagesCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error building all pages: ${error.message}`);
    return;
  }
  console.log("All pages built successfully.");
  console.log(stdout);
});

const copyAllAssetsCommand = `node scripts/build-assets.cjs`;
exec(copyAllAssetsCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error copying all assets: ${error.message}`);
    return;
  }
  console.log("All assets copied successfully.");
  console.log(stdout);
});

const buildTypescriptCommand = "tsc --outDir dist --project tsconfig.json;";
exec(buildTypescriptCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error building TypeScript: ${error.message}`);
    return;
  }
  console.log("TypeScript built successfully.");
  console.log(stdout);
});

const buildPagesCommand = "node scripts/build-pages.cjs";
exec(buildPagesCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error building pages: ${error.message}`);
    return;
  }
  console.log("Pages built successfully.");
  console.log(stdout);
});

const buildMarkdownCommand =
  "node scripts/convert-markdown-to-html.cjs build-all";
exec(buildMarkdownCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error building markdown: ${error.message}`);
    return;
  }
  console.log("Markdown built successfully.");
  console.log(stdout);
});

// Copy data directory to output
// Function to copy a data file over to OUTPUT_DIR/data
async function copyDataFile() {
  const outputFilePath = path.join(
    OUTPUT_DIR,
    "data",
    path.basename(JSON_FILE)
  );

  try {
    await fs.copy(JSON_FILE, outputFilePath);
    console.log(`Copied data file: ${JSON_FILE} to ${outputFilePath}`);
  } catch (err) {
    console.error(`Error copying data file: ${JSON_FILE} - ${err.message}`);
  }
}

copyDataFile();
