const fs = require("fs-extra");
const path = require("path");
const { extractor } = require("ts-frontmatter");

const JSON_FILE = path.join(__dirname, "../data/posts.json");
const CONTENT_DIR = path.join(__dirname, "../content/blog");

function createPostJson(posts) {
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const json = JSON.stringify(posts, null, 2);
  fs.writeFileSync(JSON_FILE, json);
}

function createPost(content) {
  const post = {
    title: content.attributes.title,
    date: content.attributes.date,
    updated: content.attributes.updated,
    description: content.attributes.description,
    tags: content.attributes.tags,
    heroimage: content.attributes.heroimage,
    readingDuration: calculateReadingDuration(content.body),
    slug: content.attributes.slug,
    id: content.attributes.id,
  };

  return post;
}

function addNewPostToJson(content) {
  const postsFile = fs.readFileSync(JSON_FILE, "utf-8");
  const posts = JSON.parse(postsFile);
  const post = createPost(content);
  posts.push(post);
  createPostJson(posts);
}

function updatePostInJson(content) {
  const posts = JSON.parse(fs.readFileSync(JSON_FILE, "utf-8"));
  const post = findPostInJson(content);

  if (!post) {
    addNewPostToJson(content);
    return;
  }

  const updatedPosts = posts.map((p) => {
    if (p.id === post.id) {
      return createPost(content);
    }

    return p;
  });

  createPostJson(updatedPosts);
}

function getContent(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return extractor(fileContent);
}

async function main() {
  console.log("Running blog-post-json script");

  const param = process.argv[2];
  const filePath = process.argv[3];

  if (param === "add" && filePath) {
    const content = getContent(filePath);
    await addNewPostToJson(content);
  } else if (param === "update" && filePath) {
    const content = getContent(filePath);
    console.log("Updating post: ", content.attributes.title);
    if (!content.attributes.published) {
      return;
    }
    await updatePostInJson(content);
  } else if (param === "delete") {
    await deletePostFromJson();
  } else if (param === "build") {
    console.log("Building posts.json");
    const posts = await getPostsContent(CONTENT_DIR);
    createPostJson(posts);
  }
}

function findPostInJson(content) {
  const posts = fs.readFileSync(JSON_FILE, "utf-8");
  const post = JSON.parse(posts).find((p) => p.id === content.attributes.id);
  return post;
}

// Function to calculate reading duration
function calculateReadingDuration(content) {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Function to recursively process the blog content directory
async function getPostsContent(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const posts = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // Recursively get posts from subdirectories
      posts.push(...(await getPostsContent(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      // Correct path construction
      const post = getContent(fullPath); // Use fullPath here
      if (post.attributes.published) {
        posts.push(createPost(post));
      }
    }
  }
  return posts;
}

// Function to delete a post from posts.json
// Checks if there is a post in the json not present in content and removes it
async function deletePostFromJson() {
  console.log("Checking for redundant posts in posts.json");
  const posts = JSON.parse(fs.readFileSync(JSON_FILE, "utf-8"));
  const files = await fs.readdir(CONTENT_DIR);
  console.log("files", files);
  const postIds = files.map((file) => {
    console.log("file", file);

    console.log("path", path.join(CONTENT_DIR, file));
    const filePath = file.includes("index.md")
      ? path.join(CONTENT_DIR, file)
      : path.join(CONTENT_DIR, file, "index.md");
    const content = getContent(filePath);
    return content.attributes.id;
  });
  const updatedPosts = posts.filter((post) => postIds.includes(post.id));

  createPostJson(updatedPosts);
}

main();
