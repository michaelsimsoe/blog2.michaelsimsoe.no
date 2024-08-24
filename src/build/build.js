"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var url_1 = require("url");
var ts_frontmatter_1 = require("ts-frontmatter");
var marked_1 = require("marked");
// Get the current directory name in an ES module context
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
// Define paths
var CONTENT_DIR = path_1.default.join(__dirname, "../../content/blog");
var OUTPUT_DIR = path_1.default.join(__dirname, "../../dist");
var TEMPLATE_PATH = path_1.default.join(__dirname, "../../templates/post.html");
var STATIC_DIR = path_1.default.join(__dirname, "../../static");
var ABOUT_DIR = path_1.default.join(__dirname, "../../meg");
var POSTS_JSON = path_1.default.join(OUTPUT_DIR, "posts.json");
// Read and compile the template
var template = fs_extra_1.default.readFileSync(TEMPLATE_PATH, "utf-8");
// Function to copy images
function copyImages(markdownContent, outputDir, markdownDir) {
    return __awaiter(this, void 0, void 0, function () {
        var imageRegex, match, imagePath, fullImagePath, outputImagePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    imageRegex = /!\[.*?\]\((.*?)\)/g;
                    _a.label = 1;
                case 1:
                    if (!((match = imageRegex.exec(markdownContent)) !== null)) return [3 /*break*/, 3];
                    imagePath = match[1];
                    fullImagePath = path_1.default.resolve(markdownDir, imagePath);
                    outputImagePath = path_1.default.resolve(outputDir, imagePath);
                    return [4 /*yield*/, fs_extra_1.default.copy(fullImagePath, outputImagePath)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to calculate reading duration
function calculateReadingDuration(content) {
    var wordsPerMinute = 200; // Average reading speed
    var words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}
// Function to process Markdown files and collect post data
function processMarkdown(filePath, outputPath, posts) {
    return __awaiter(this, void 0, void 0, function () {
        var fileContent, content, title, date, updated, tags, slug, heroImageUrl, readingDuration, htmlContent, norwegianDate, norwegianUpdated, finalContent, _a, _b, _c, markdownDir, outputDir, heroImageDir, outputHeroImageDir;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    fileContent = fs_extra_1.default.readFileSync(filePath, "utf-8");
                    content = (0, ts_frontmatter_1.extractor)(fileContent);
                    title = content.attributes.title || "No title";
                    date = content.attributes.date || "No date";
                    updated = content.attributes.updated;
                    tags = content.attributes.tags || [];
                    slug = content.attributes.slug;
                    heroImageUrl = content.attributes.heroimage
                        ? "".concat(slug, "/images/").concat(content.attributes.heroimage)
                        : null;
                    readingDuration = calculateReadingDuration(content.body);
                    if (!content.attributes.published) {
                        return [2 /*return*/];
                    }
                    marked_1.marked.use({
                        extensions: [
                            {
                                name: "image",
                                renderer: function (token) {
                                    var cleanHref = token.href.replace(/^\./, "");
                                    var fullPath = "".concat(slug).concat(cleanHref);
                                    return "<div class=\"post-content__image-wrapper\"><img src=\"/".concat(fullPath, "\" alt=\"").concat(token.text, "\" class=\"article-image\" /></div>");
                                },
                            },
                        ],
                    });
                    htmlContent = marked_1.marked.parse(content.body);
                    norwegianDate = new Date(date).toLocaleString("no-NO", {
                        timeZone: "Europe/Oslo",
                    });
                    norwegianUpdated = new Date(updated).toLocaleString("no-NO", {
                        timeZone: "Europe/Oslo",
                    });
                    _b = (_a = template
                        .replaceAll("{{title}}", title)
                        .replaceAll("{{date}}", norwegianDate)
                        .replaceAll("{{updated}}", updated != date ? " <em>(".concat(norwegianUpdated, ")</em>") : "")
                        .replaceAll("{{readingDuration}}", readingDuration.toString()))
                        .replace;
                    _c = ["{{content}}"];
                    return [4 /*yield*/, htmlContent];
                case 1:
                    finalContent = _b.apply(_a, _c.concat([_d.sent()]))
                        .replaceAll("{{TAGS}}", tags
                        .map(function (tag) { return " <tag-component name=\"".concat(tag, "\"></tag-component>"); })
                        .join(""))
                        .replace("{{HERO_URL}}", heroImageUrl
                        ? " <div class=\"post__hero-img__wrapper\">\n              <img src=\"/".concat(heroImageUrl, "\" alt=\"hero image\" />\n            </div>")
                        : "");
                    return [4 /*yield*/, fs_extra_1.default.outputFile(outputPath, finalContent)];
                case 2:
                    _d.sent();
                    markdownDir = path_1.default.dirname(filePath);
                    outputDir = path_1.default.dirname(outputPath);
                    return [4 /*yield*/, copyImages(content.body, outputDir, markdownDir)];
                case 3:
                    _d.sent();
                    if (!heroImageUrl) return [3 /*break*/, 5];
                    heroImageDir = path_1.default.dirname(markdownDir) + "/" + heroImageUrl;
                    outputHeroImageDir = path_1.default.dirname(outputDir) + "/" + heroImageUrl;
                    return [4 /*yield*/, fs_extra_1.default.copy(heroImageDir, outputHeroImageDir)];
                case 4:
                    _d.sent();
                    _d.label = 5;
                case 5:
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
                    return [2 /*return*/];
            }
        });
    });
}
// Function to recursively process the blog content directory
function processDirectory(dirPath, outputDir, posts) {
    return __awaiter(this, void 0, void 0, function () {
        var entries, _i, entries_1, entry, fullPath, outputPath, htmlOutputPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    entries = fs_extra_1.default.readdirSync(dirPath, { withFileTypes: true });
                    _i = 0, entries_1 = entries;
                    _a.label = 1;
                case 1:
                    if (!(_i < entries_1.length)) return [3 /*break*/, 6];
                    entry = entries_1[_i];
                    fullPath = path_1.default.join(dirPath, entry.name);
                    outputPath = path_1.default.join(outputDir, path_1.default.relative(CONTENT_DIR, fullPath));
                    if (!entry.isDirectory()) return [3 /*break*/, 3];
                    return [4 /*yield*/, processDirectory(fullPath, outputDir, posts)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    if (!(entry.isFile() && entry.name.endsWith(".md"))) return [3 /*break*/, 5];
                    htmlOutputPath = outputPath.replace(/\.md$/, ".html");
                    return [4 /*yield*/, processMarkdown(fullPath, htmlOutputPath, posts)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Copy static assets
function copyStaticAssets() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_extra_1.default.copy(STATIC_DIR, OUTPUT_DIR + "/static")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs_extra_1.default.copy(ABOUT_DIR, OUTPUT_DIR + "/meg")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Generate JSON file with posts metadata
function generatePostsJson(posts) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    posts.sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
                    return [4 /*yield*/, fs_extra_1.default.writeFile(POSTS_JSON, JSON.stringify(posts, null, 2))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Build the site
function build() {
    return __awaiter(this, void 0, void 0, function () {
        var posts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_extra_1.default.ensureDir(OUTPUT_DIR)];
                case 1:
                    _a.sent();
                    posts = [];
                    return [4 /*yield*/, processDirectory(CONTENT_DIR, OUTPUT_DIR, posts)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, copyStaticAssets()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, generatePostsJson(posts)];
                case 4:
                    _a.sent();
                    console.log("Build complete!");
                    return [2 /*return*/];
            }
        });
    });
}
build().catch(function (err) { return console.error(err); });
