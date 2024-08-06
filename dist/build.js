"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var fs = __importStar(require("fs-extra"));
var path = __importStar(require("path"));
var ts_frontmatter_1 = require("ts-frontmatter");
var marked_1 = require("marked");
// Define paths
var CONTENT_DIR = path.join(__dirname, '../content/blog');
var OUTPUT_DIR = path.join(__dirname, '../dist');
var TEMPLATE_PATH = path.join(__dirname, '../templates/post.html');
var STATIC_DIR = path.join(__dirname, '../static');
// Read and compile the template
var template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
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
                    fullImagePath = path.resolve(markdownDir, imagePath);
                    outputImagePath = path.resolve(outputDir, imagePath);
                    return [4 /*yield*/, fs.copy(fullImagePath, outputImagePath)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to process Markdown files
function processMarkdown(filePath, outputPath) {
    return __awaiter(this, void 0, void 0, function () {
        var fileContent, content, htmlContent, finalContent, _a, _b, _c, markdownDir, outputDir;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    fileContent = fs.readFileSync(filePath, 'utf-8');
                    content = (0, ts_frontmatter_1.extractor)(fileContent);
                    htmlContent = marked_1.marked.parse(content.body);
                    _b = (_a = template
                        .replace('{{title}}', content.attributes.title || 'No title'))
                        .replace;
                    _c = ['{{content}}'];
                    return [4 /*yield*/, htmlContent];
                case 1:
                    finalContent = _b.apply(_a, _c.concat([_d.sent()]));
                    return [4 /*yield*/, fs.outputFile(outputPath, finalContent)];
                case 2:
                    _d.sent();
                    markdownDir = path.dirname(filePath);
                    outputDir = path.dirname(outputPath);
                    return [4 /*yield*/, copyImages(content.body, outputDir, markdownDir)];
                case 3:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Function to recursively process the blog content directory
function processDirectory(dirPath, outputDir) {
    return __awaiter(this, void 0, void 0, function () {
        var entries, _i, entries_1, entry, fullPath, outputPath, htmlOutputPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    entries = fs.readdirSync(dirPath, { withFileTypes: true });
                    _i = 0, entries_1 = entries;
                    _a.label = 1;
                case 1:
                    if (!(_i < entries_1.length)) return [3 /*break*/, 6];
                    entry = entries_1[_i];
                    fullPath = path.join(dirPath, entry.name);
                    outputPath = path.join(outputDir, path.relative(CONTENT_DIR, fullPath));
                    if (!entry.isDirectory()) return [3 /*break*/, 3];
                    return [4 /*yield*/, processDirectory(fullPath, outputDir)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    if (!(entry.isFile() && entry.name.endsWith('.md'))) return [3 /*break*/, 5];
                    htmlOutputPath = outputPath.replace(/\.md$/, '.html');
                    return [4 /*yield*/, processMarkdown(fullPath, htmlOutputPath)];
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
                case 0: return [4 /*yield*/, fs.copy(STATIC_DIR, OUTPUT_DIR)];
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
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.ensureDir(OUTPUT_DIR)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processDirectory(CONTENT_DIR, OUTPUT_DIR)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, copyStaticAssets()];
                case 3:
                    _a.sent();
                    console.log('Build complete!');
                    return [2 /*return*/];
            }
        });
    });
}
build().catch(function (err) { return console.error(err); });
