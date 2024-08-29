const fs = require("fs-extra");
const path = require("path");
const { extractor, FrontMatterResult } = require("ts-frontmatter");
const { marked } = require("marked");

// Paths (Modify these paths as necessary for your project structure)
const CONTENT_DIR = path.join(__dirname, "../content/blog");
const OUTPUT_DIR = path.join(__dirname, "../dist/blogg");
const TEMPLATE_PATH = path.join(__dirname, "../templates/post.html");

// Read and compile the template
const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");

// Function to copy images
async function copyImages(markdownContent, outputDir, markdownDir) {
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
function calculateReadingDuration(content) {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Function to process a single Markdown file
async function processMarkdownFile(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const content = extractor(fileContent);
  const title = content.attributes.title || "No title";
  const date = content.attributes.date || "No date";
  const updated = content.attributes.updated;
  const tags = content.attributes.tags || [];
  const slug = content.attributes.slug;
  const heroImageUrl = content.attributes.heroimage
    ? `/images/${content.attributes.heroimage}`
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
          return `<div class="post-content__image-wrapper"><img src="/blogg/${fullPath}" alt="${token.text}" class="article-image" /></div>`;
        },
      },
    ],
  });

  const htmlContent = marked.parse(content.body);

  // Replace placeholders in the template
  const norwegianDate = new Date(date).toLocaleString("no-NO", {
    timeZone: "Europe/Oslo",
  });
  const norwegianUpdated = new Date(updated).toLocaleString("no-NO", {
    timeZone: "Europe/Oslo",
  });

  const finalContent = template
    .replaceAll("{{title}}", title)
    .replaceAll("{{date}}", norwegianDate)
    .replaceAll(
      "{{updated}}",
      updated != date ? ` <em>(${norwegianUpdated})</em>` : ""
    )
    .replaceAll("{{readingDuration}}", readingDuration.toString())
    .replace("{{content}}", htmlContent)
    .replaceAll(
      "{{TAGS}}",
      tags
        .map((tag) => ` <tag-component name="${tag}"></tag-component>`)
        .join("")
    )
    .replace(
      "{{HERO_URL}}",
      heroImageUrl
        ? `<div class="post__hero-img__wrapper"><img src="/blogg/${slug}/${heroImageUrl}" alt="hero image" /></div>`
        : ""
    );

  const outputPath = path.join(OUTPUT_DIR, slug, "index.html");
  await fs.outputFile(outputPath, finalContent);

  // Copy images referenced in the Markdown file
  const markdownDir = path.dirname(filePath);
  const outputDir = path.dirname(outputPath);
  await copyImages(content.body, outputDir, markdownDir);

  // Copy hero image into outputDir
  if (heroImageUrl) {
    const heroImageDir = path.join(markdownDir, heroImageUrl);
    const outputHeroImageDir = path.join(outputDir, heroImageUrl);
    await fs.copy(heroImageDir, outputHeroImageDir);
  }
}

// Function to process all Markdown files
async function processAllMarkdownFiles() {
  const files = await fs.readdir(CONTENT_DIR);

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file, "index.md");
    if (fs.existsSync(filePath)) {
      await processMarkdownFile(filePath);
    }
  }
}

// Main function to determine the action
async function main() {
  const changedFilePath = process.argv[2]; // Assume the changed file path is passed as an argument

  if (changedFilePath === "build-all") {
    console.log("Building all Markdown files...");
    await processAllMarkdownFiles();
  } else if (changedFilePath) {
    console.log(`Processing changed Markdown file: ${changedFilePath}`);
    await processMarkdownFile(changedFilePath);
  } else {
    console.error("No file path provided.");
  }
}

// Run the main function
main();
