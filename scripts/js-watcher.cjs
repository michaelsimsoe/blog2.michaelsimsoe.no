const chokidar = require("chokidar");
const { exec } = require("child_process");
const path = require("path");

const directoryToWatch = path.join(__dirname, "../");
const buildCommands = {
  markdown: "npm run build:markdown",
  typescript: "npm run build:ts",
  assets: "node scripts/build-assets.cjs",
  pages: "node scripts/build-pages.cjs",
};

// Initialize watcher
const watcher = chokidar.watch(directoryToWatch, {
  ignored: ["**/dist/**", "**/node_modules/**"],
  persistent: true,
});

watcher.on("change", (filePath) => {
  console.log(`File ${filePath} has changed. Processing...`);

  if (filePath.endsWith(".md")) {
    const command = buildCommands.markdown + " " + filePath;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error processing markdown: ${error.message}`);
        return;
      }
      console.log(stdout);
    });
  } else if (filePath.endsWith(".ts")) {
    exec(buildCommands.typescript, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error processing TypeScript: ${error.message}`);
        return;
      }
      console.log(stdout);
    });
  } else if (filePath.match(/\.(css|svg|png|jpg|jpeg|gif)$/)) {
    // Use build-assets.js for copying the changed file
    const command = `${buildCommands.assets} copy "${filePath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error processing assets: ${error.message}`);
        return;
      }
      console.log(stdout);
    });
  } else if (filePath.endsWith(".html") && filePath.includes("/pages/")) {
    const command = `${buildCommands.pages} copy "${filePath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error processing page: ${error.message}`);
        return;
      }
      console.log(stdout);
    });
  }
});

watcher.on("unlink", (filePath) => {
  if (filePath.match(/\.(css|svg|png|jpg|jpeg|gif)$/)) {
    // Use build-assets.js for deleting the removed file
    const command = `${buildCommands.assets} delete "${filePath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error deleting assets: ${error.message}`);
        return;
      }
      console.log(stdout);
    });
  }
});

// Add a command for building all pages
const buildAllPagesCommand = `${buildCommands.pages} build-all`;

exec(buildAllPagesCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error building all pages: ${error.message}`);
    return;
  }
  console.log("All pages built successfully.");
  console.log(stdout);
});

console.log("Watching for file changes...");
