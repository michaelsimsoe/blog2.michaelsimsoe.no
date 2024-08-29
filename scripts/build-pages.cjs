const fs = require("fs-extra");
const path = require("path");

// Paths (Modify these paths as necessary for your project structure)
const PAGES_DIR = path.join(__dirname, "../pages");
const OUTPUT_DIR = path.join(__dirname, "../dist");
const JSON_FILE = path.join(__dirname, "../data/posts.json");
const STATIC_DIRECTORIES = [
  "app",
  "data",
  "components",
  "scripts",
  "build",
  "static",
];

// Function to copy a page file or directory
async function copyPage(filePath) {
  const relativePath = path.relative(PAGES_DIR, filePath);
  const outputPath = path.join(OUTPUT_DIR, relativePath);

  try {
    await fs.copy(filePath, outputPath);
    console.log(`Copied page: ${filePath} to ${outputPath}`);
  } catch (err) {
    console.error(`Error copying page: ${filePath} - ${err.message}`);
  }
}

// Function to remove page where slug is not present in posts.json based on directory name
// Does not remove the pages from /pages directory
async function removeRedundantPages() {
  const posts = JSON.parse(fs.readFileSync(JSON_FILE, "utf-8"));
  const pageDirs = await fs.readdir(OUTPUT_DIR);

  for (const pageDir of pageDirs) {
    const pagePath = path.join(OUTPUT_DIR, pageDir);
    const pageStat = await fs.stat(pagePath);

    if (
      pageStat.isDirectory() &&
      !STATIC_DIRECTORIES.some((dir) => pageDir.includes(dir))
    ) {
      const slug = pageDir;
      const postExists = posts.some((post) => post.slug === slug);
      const pageExistsInPagesDir = await fs.pathExists(
        path.join(PAGES_DIR, slug)
      );

      if (!postExists && !pageExistsInPagesDir) {
        console.log(`Post not found for page: ${pageDir}. Removing...`);
        await fs.remove(pagePath);
      }

      if (!postExists && !pageExistsInPagesDir) {
        console.log(`Post not found for page: ${pageDir}. Removing...`);
        await fs.remove(pagePath);
      }
    }
  }
}

// Function to copy all pages from the PAGES_DIR to the OUTPUT_DIR
async function copyAllPages() {
  try {
    await fs.copy(PAGES_DIR, OUTPUT_DIR, {
      overwrite: true,
      filter: (src) => {
        const relativePath = path.relative(PAGES_DIR, src);
        return !relativePath.startsWith(".");
      },
    });
    console.log(`All pages copied from ${PAGES_DIR} to ${OUTPUT_DIR}`);
  } catch (err) {
    console.error(`Error copying all pages: ${err.message}`);
  }
}

// Main function to process pages
async function processPages(action, filePath) {
  if (action === "copy" && filePath) {
    await copyPage(filePath);
  } else if (action === "delete") {
    await removeRedundantPages();
  } else if (action === "build-all") {
    await copyAllPages();
  } else {
    console.error(
      "Invalid action or file path. Usage: node build-pages.js <copy|delete|build-all> [filePath]"
    );
  }
}

// Process pages based on command-line arguments
const action = process.argv[2]; // `copy`, `delete`, or `build-all`
const filePath = process.argv[3]; // path of the page to process, if applicable

processPages(action, filePath);
