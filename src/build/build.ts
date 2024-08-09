import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { extractor, FrontMatterResult } from "ts-frontmatter";
import { marked } from "marked";

// Get the current directory name in an ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const CONTENT_DIR = path.join(__dirname, "../../content/blog");
const OUTPUT_DIR = path.join(__dirname, "../../dist");
const TEMPLATE_PATH = path.join(__dirname, "../../templates/post.html");
const STATIC_DIR = path.join(__dirname, "../../static");
const ABOUT_DIR = path.join(__dirname, "../../about");
const POSTS_JSON = path.join(OUTPUT_DIR, "posts.json");

// Read and compile the template
const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");

// Function to copy images
async function copyImages(
  markdownContent: string,
  outputDir: string,
  markdownDir: string
) {
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  let match;

  while ((match = imageRegex.exec(markdownContent)) !== null) {
    const imagePath = match[1];
    const fullImagePath = path.resolve(markdownDir, imagePath);
    const outputImagePath = path.resolve(outputDir, imagePath);

    await fs.copy(fullImagePath, outputImagePath);
  }
}

// Function to calculate reading duration
function calculateReadingDuration(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Function to process Markdown files and collect post data
async function processMarkdown(
  filePath: string,
  outputPath: string,
  posts: any[]
) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const content: FrontMatterResult = extractor(fileContent);
  const title = content.attributes.title || "No title";
  const date = content.attributes.date || "No date";
  const updated = content.attributes.updated;
  const tags = content.attributes.tags || [];
  const slug = content.attributes.slug;
  const heroImageUrl = content.attributes.heroimage
    ? `${slug}/images/${content.attributes.heroimage}`
    : null;
  const readingDuration = calculateReadingDuration(content.body);

  if (!content.attributes.published) {
    return;
  }

  marked.use({
    extensions: [
      {
        name: "image",
        renderer(token) {
          const cleanHref = token.href.replace(/^\./, "");
          const fullPath = `${slug}${cleanHref}`;
          return `<div class="post-content__image-wrapper"><img src="/${fullPath}" alt="${token.text}" class="article-image" /></div>`;
        },
      },
    ],
  });

  const htmlContent = marked.parse(content.body);

  // Replace placeholders in the template
  const finalContent = template
    .replaceAll("{{title}}", title)
    .replaceAll("{{date}}", date)
    .replaceAll("{{updated}}", ` <em>(${updated})</em>` || "")
    .replaceAll("{{readingDuration}}", readingDuration.toString())
    .replace("{{content}}", await htmlContent)
    .replace("{{HERO_URL}}", heroImageUrl || "");

  await fs.outputFile(outputPath, finalContent);

  // Copy images referenced in the Markdown file
  const markdownDir = path.dirname(filePath);
  const outputDir = path.dirname(outputPath);
  await copyImages(content.body, outputDir, markdownDir);

  // Copy hero image into outputDir
  if (heroImageUrl) {
    const heroImageDir = path.dirname(markdownDir) + "/" + heroImageUrl;
    const outputHeroImageDir = path.dirname(outputDir) + "/" + heroImageUrl;
    await fs.copy(heroImageDir, outputHeroImageDir);
  }

  // Collect post data
  posts.push({
    title: content.attributes.title,
    date: content.attributes.date,
    updated: content.attributes.updated,
    description: content.attributes.description,
    tags: content.attributes.tags,
    heroimage: content.attributes.heroimage,
    readingDuration: readingDuration,
    slug: content.attributes.slug,
  });
}

// Function to recursively process the blog content directory
async function processDirectory(
  dirPath: string,
  outputDir: string,
  posts: any[]
) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const outputPath = path.join(
      outputDir,
      path.relative(CONTENT_DIR, fullPath)
    );

    if (entry.isDirectory()) {
      await processDirectory(fullPath, outputDir, posts);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const htmlOutputPath = outputPath.replace(/\.md$/, ".html");
      await processMarkdown(fullPath, htmlOutputPath, posts);
    }
  }
}

// Copy static assets
async function copyStaticAssets() {
  await fs.copy(STATIC_DIR, OUTPUT_DIR + "/static");
  await fs.copy(ABOUT_DIR, OUTPUT_DIR + "/about");
}

// Generate JSON file with posts metadata
async function generatePostsJson(posts: any[]) {
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  await fs.writeFile(POSTS_JSON, JSON.stringify(posts, null, 2));
}

// Build the site
async function build() {
  await fs.ensureDir(OUTPUT_DIR);
  const posts: any[] = [];
  await processDirectory(CONTENT_DIR, OUTPUT_DIR, posts);
  await copyStaticAssets();
  await generatePostsJson(posts);
  console.log("Build complete!");
}

build().catch((err) => console.error(err));
