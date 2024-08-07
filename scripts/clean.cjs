const fs = require('fs-extra');
const path = require('path');
const rimraf = require('rimraf');

const outputDir = path.join(__dirname, '../dist');
const indexPath = path.join(outputDir, 'index.html');

// Clean the output directory except index.html
fs.readdir(outputDir, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    const filePath = path.join(outputDir, file);
    if (filePath !== indexPath) {
      rimraf.sync(filePath);
    }
  });
});
