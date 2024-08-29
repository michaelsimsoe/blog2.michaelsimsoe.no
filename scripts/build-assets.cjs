const fs = require("fs-extra");
const path = require("path");

// Paths (Modify these paths as necessary for your project structure)
const STATIC_DIR = path.join(__dirname, "../static");
const OUTPUT_DIR = path.join(__dirname, "../dist/static");

// Function to copy an asset file
async function copyAsset(filePath) {
  const relativePath = path.relative(STATIC_DIR, filePath);
  const outputPath = path.join(OUTPUT_DIR, relativePath);

  try {
    await fs.copy(filePath, outputPath);
    console.log(`Copied asset: ${filePath} to ${outputPath}`);
  } catch (err) {
    console.error(`Error copying asset: ${filePath} - ${err.message}`);
  }
}

// Function to handle deleted assets
async function removeDeletedAssets(filePath) {
  const relativePath = path.relative(STATIC_DIR, filePath);
  const outputPath = path.join(OUTPUT_DIR, relativePath);

  try {
    await fs.remove(outputPath);
    console.log(`Removed asset: ${outputPath}`);
  } catch (err) {
    console.error(`Error removing asset: ${outputPath} - ${err.message}`);
  }
}

// Main function to process all assets
async function processAssets() {
  try {
    const assets = await fs.readdir(STATIC_DIR, { withFileTypes: true });

    for (const asset of assets) {
      const assetPath = path.join(STATIC_DIR, asset.name);

      if (asset.isDirectory()) {
        // Recursively copy directory assets
        await fs.copy(assetPath, path.join(OUTPUT_DIR, asset.name));
        console.log(
          `Copied directory: ${assetPath} to ${path.join(
            OUTPUT_DIR,
            asset.name
          )}`
        );
      } else if (asset.isFile()) {
        // Copy individual files
        await copyAsset(assetPath);
      }
    }
  } catch (err) {
    console.error(`Error processing assets: ${err.message}`);
  }
}

// Process assets based on command-line arguments (optional for deletions)
const action = process.argv[2]; // `copy` or `delete`
const filePath = process.argv[3]; // path of the asset to process

if (action === "copy" && filePath) {
  copyAsset(filePath);
} else if (action === "delete" && filePath) {
  removeDeletedAssets(filePath);
} else {
  processAssets(); // Run full processing if no specific action is provided
}
