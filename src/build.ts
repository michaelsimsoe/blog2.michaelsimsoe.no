import * as fs from 'fs-extra';
import * as path from 'path';
import { extractor, FrontMatterResult } from 'ts-frontmatter';
import { marked } from 'marked';

// Define paths
const CONTENT_DIR = path.join(__dirname, '../content/blog');
const OUTPUT_DIR = path.join(__dirname, '../dist');
const TEMPLATE_PATH = path.join(__dirname, '../templates/post.html');
const STATIC_DIR = path.join(__dirname, '../static');

// Read and compile the template
const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

// Function to copy images
async function copyImages(markdownContent: string, outputDir: string, markdownDir: string) {
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  let match;

  while ((match = imageRegex.exec(markdownContent)) !== null) {
    const imagePath = match[1];
    const fullImagePath = path.resolve(markdownDir, imagePath);
    const outputImagePath = path.resolve(outputDir, imagePath);

    await fs.copy(fullImagePath, outputImagePath);
  }
}

// Function to process Markdown files
async function processMarkdown(filePath: string, outputPath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const content: FrontMatterResult = extractor(fileContent);
  const htmlContent = marked.parse(content.body);

  // Replace placeholders in the template
  const finalContent = template
    .replace('{{title}}', content.attributes.title || 'No title')
    .replace('{{content}}', await htmlContent);

  await fs.outputFile(outputPath, finalContent);

  // Copy images referenced in the Markdown file
  const markdownDir = path.dirname(filePath);
  const outputDir = path.dirname(outputPath);
  await copyImages(content.body, outputDir, markdownDir);
}

// Function to recursively process the blog content directory
async function processDirectory(dirPath: string, outputDir: string) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const outputPath = path.join(outputDir, path.relative(CONTENT_DIR, fullPath));

    if (entry.isDirectory()) {
      await processDirectory(fullPath, outputDir);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const htmlOutputPath = outputPath.replace(/\.md$/, '.html');
      await processMarkdown(fullPath, htmlOutputPath);
    }
  }
}

// Copy static assets
async function copyStaticAssets() {
  await fs.copy(STATIC_DIR, OUTPUT_DIR);
}

// Build the site
async function build() {
  await fs.ensureDir(OUTPUT_DIR);
  await processDirectory(CONTENT_DIR, OUTPUT_DIR);
  await copyStaticAssets();
  console.log('Build complete!');
}

build().catch(err => console.error(err));
