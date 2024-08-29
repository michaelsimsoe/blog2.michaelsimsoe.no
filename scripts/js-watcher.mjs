// Import necessary modules using ES module syntax
import * as chokidar from "chokidar";
import { exec } from "child_process";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory to watch
const directoryToWatch = path.join(__dirname, "../");

// Build commands
const buildCommands = {
  markdown: "npm run build:markdown",
  json: "npm run build:json",
  jsonDelete: "npm run build:json:delete",
  typescript: "npm run build:ts",
  assets: "node scripts/build-assets.cjs",
  pages: "node scripts/build-pages.cjs",
  data: "node scripts/handle-data.cjs",
};

// Initialize the file watcher
const watcher = chokidar.watch(directoryToWatch, {
  ignored: ["**/dist/**", "**/node_modules/**", "**/.git/**", "**/scripts/**"],
  persistent: true,
});

// Handle file changes
watcher.on("change", (filePath) => {
  console.log(`File ${filePath} has changed. Processing...`);

  if (filePath.endsWith(".md")) {
    console.log("Processing Markdown...", filePath);

    const command = `${buildCommands.markdown} ${filePath} && ${buildCommands.json} update ${filePath}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error processing markdown: ${error.message}`);
        return;
      }
      console.log(stdout);
    });
  } else if (filePath.endsWith(".ts")) {
    console.log("Processing TypeScript...", filePath);

    exec(buildCommands.typescript, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error processing TypeScript: ${error.message}`);
        return;
      }
      console.log(stdout);
    });
  } else if (filePath.match(/\.(css|svg|png|jpg|jpeg|gif)$/)) {
    console.log("Processing assets...", filePath);

    const command = `${buildCommands.assets} copy "${filePath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error processing assets: ${error.message}`);
        return;
      }
      console.log(stdout);
    });
  } else if (filePath.endsWith(".html") && filePath.includes("/pages/")) {
    console.log("Processing page...", filePath);

    const command = `${buildCommands.pages} copy "${filePath}"`;
    console.log("command", command);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error processing page: ${error.message}`);
        return;
      }
      console.log(stdout);
    });
  } else if (filePath.endsWith(".json") && filePath.includes("/data/")) {
    console.log("Processing data...", filePath);

    const command = `${buildCommands.data} ${filePath}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error processing data: ${error.message}`);
        return;
      }
      console.log(stdout);
    });
  }
});

// Handle file deletion
watcher.on("unlink", (filePath) => {
  if (filePath.match(/\.(css|svg|png|jpg|jpeg|gif)$/)) {
    console.log("Asset deletion observed", filePath);

    const command = `${buildCommands.assets} delete "${filePath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error deleting assets: ${error.message}`);
        return;
      }
      console.log(stdout);
    });
  }

  if (filePath.endsWith(".md")) {
    console.log("Markdown deletion observed", filePath);
    console.log("Deleting relevant JSON and HTML...");

    const command = `${buildCommands.jsonDelete} && ${buildCommands.pages} delete`;
    console.log("command", command);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error deleting post: ${error.message}`);
        return;
      }
      console.log(stdout);
    });
  }

  if (filePath.endsWith(".html") && filePath.includes("/pages/")) {
    console.log("Page deletion observed", filePath);

    const command = `${buildCommands.pages} delete "${filePath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error deleting page: ${error.message}`);
        return;
      }
      console.log(stdout);
    });
  }
});

// Build all pages initially
const buildAllPagesCommand = `${buildCommands.pages} build-all`;

exec(buildAllPagesCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error building all pages: ${error.message}`);
    return;
  }
  console.log("All pages built successfully.");
  console.log(stdout);
});

const copyAllAssetsCommand = `${buildCommands.assets}`;
exec(copyAllAssetsCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error copying all assets: ${error.message}`);
    return;
  }
  console.log("All assets copied successfully.");
  console.log(stdout);
});

console.log("Watching for file changes...");
