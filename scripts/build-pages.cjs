const fs = require("fs-extra");
const path = require("path");

// Paths (Modify these paths as necessary for your project structure)
const PAGES_DIR = path.join(__dirname, "../pages");
const OUTPUT_DIR = path.join(__dirname, "../dist");

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

// Function to handle deleted pages
async function removeDeletedPage(filePath) {
  const relativePath = path.relative(PAGES_DIR, filePath);
  const outputPath = path.join(OUTPUT_DIR, relativePath);

  try {
    await fs.remove(outputPath);
    console.log(`Removed page: ${outputPath}`);
  } catch (err) {
    console.error(`Error removing page: ${outputPath} - ${err.message}`);
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
  } else if (action === "delete" && filePath) {
    await removeDeletedPage(filePath);
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
