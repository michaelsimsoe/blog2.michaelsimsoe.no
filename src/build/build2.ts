import * as fs from "fs";
import * as path from "path";
import { extractor, FrontMatterResult } from "ts-frontmatter";
import { marked } from "marked";
import { copySync } from "fs-extra";

const postsDir = path.join(__dirname, "content", "blog"); // Directory with blog post folders
const outputDir = path.join(__dirname, "dist"); // Output directory for generated HTML files

// Read all blog post directories from the posts directory
const postFolders = fs.readdirSync(postsDir);

postFolders.forEach(async (folder) => {
  const folderPath = path.join(postsDir, folder);
  const markdownFilePath = path.join(folderPath, "index.md");

  if (fs.existsSync(markdownFilePath)) {
    const markdownContent = fs.readFileSync(markdownFilePath, "utf-8");

    // Use your custom extractor function to parse the front matter and content
    const result: FrontMatterResult = extractor(markdownContent);
    const { attributes, body } = result;

    // Convert Markdown content to HTML
    const htmlContent = marked.parse(body);

    // Load HTML template and replace placeholders with parsed content
    let template = fs.readFileSync(
      path.join(__dirname, "templates", "post.html"),
      "utf-8"
    );
    template = template
      .replace("{{title}}", attributes.title || "")
      .replace("{{HERO_URL}}", attributes.heroUrl || "")
      .replace("{{TAGS}}", (attributes.tags || []).join(", "))
      .replace("{{date}}", attributes.date || "")
      .replace("{{content}}", await htmlContent)
      .replace("{{readingDuration}}", attributes.readingDuration || "5");

    // Write the generated HTML to the output directory
    const outputFilePath = path.join(outputDir, `${folder}.html`);
    fs.writeFileSync(outputFilePath, template);

    // Copy images to output directory
    const imagesDir = path.join(folderPath, "images");
    if (fs.existsSync(imagesDir)) {
      const outputImagesDir = path.join(outputDir, "images", folder);
      copySync(imagesDir, outputImagesDir); // Copy all images to the dist/images/post-folder directory
    }
  }
});

console.log("Blog posts generated successfully.");
