const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Directory to watch
const directoryToWatch = path.join(__dirname, "../");

// Command to run when a change is detected
// const commandToRun = 'echo "File change detected!"';
const commandToRun = "npm run dev";

// Directories to exclude from watching
const excludeDirectories = [path.join(directoryToWatch, "../dist")];

// File extensions to watch
const fileExtensionsToWatch = [".js", ".ts", ".json", ".css", ".html", ".md"];

// Helper function to check if a path is in an excluded directory
const isExcluded = (filePath) => {
  return excludeDirectories.some((excludeDir) =>
    filePath.startsWith(excludeDir)
  );
};

// Helper function to check if a file has an allowed extension
const hasAllowedExtension = (filePath) => {
  return fileExtensionsToWatch.includes(path.extname(filePath));
};

// Recursively watch a directory, excluding specified directories
const watchDirectory = (dir) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      if (!isExcluded(fullPath)) {
        watchDirectory(fullPath); // Recursively watch the directory
      }
    } else {
      watchFile(fullPath);
    }
  });
};

// Watch a single file
const watchFile = (filePath) => {
  if (!isExcluded(filePath) && hasAllowedExtension(filePath)) {
    fs.watch(filePath, (eventType, filename) => {
      if (eventType === "change") {
        console.log(`Change detected on file: ${filename}`);

        // Run the CLI command
        exec(commandToRun, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing command: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`Command stderr: ${stderr}`);
            return;
          }
          console.log(`Command stdout: ${stdout}`);
        });
      }
    });
  }
};

// Start watching the directory
watchDirectory(directoryToWatch);

console.log(
  `Watching for changes in ${directoryToWatch}, excluding specified directories, and monitoring specific file types...`
);
