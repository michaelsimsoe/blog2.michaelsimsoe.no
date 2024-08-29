const fs = require("fs-extra");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "../dist");

// Function to copy a data file over to OUTPUT_DIR/data
async function copyDataFile(filePath) {
  const outputFilePath = path.join(OUTPUT_DIR, "data", path.basename(filePath));

  try {
    await fs.copy(filePath, outputFilePath);
    console.log(`Copied data file: ${filePath} to ${outputFilePath}`);
  } catch (err) {
    console.error(`Error copying data file: ${filePath} - ${err.message}`);
  }
}

async function main() {
  const changedFilePath = process.argv[2];
  console.log("changedFilePath", changedFilePath);

  if (changedFilePath) {
    console.log(`Processing changed data file: ${changedFilePath}`);
    await copyDataFile(changedFilePath);
  } else {
    console.error("No file path provided.");
  }
}

main();
