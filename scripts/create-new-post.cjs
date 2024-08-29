const path = require("path");
const fs = require("fs-extra");
const { randomUUID } = require("crypto");
// Create a new post in content/blog/${postNameToSlug}/index.md
// and adds an image folder in content/blog/${postNameToSlug}/
// with the following frontmatter:
// ---
// title: ${postName} || No title
// date: ${dateToday } ||''
// updated: ''
// description: 'description'
// tags:
//   - text
// heroimage:
// published: false
// slug: ${postNameToSlug} || ''
// id: ${generateUUID}
// ---
function createNewPost(postName, postNameToSlug) {
  const dateToday = new Date().toISOString().split("T")[0];
  const postTemplate = `---
title: ${postName}
date: ${dateToday}
updated: ''
description: 'description'
tags:
  - text
heroimage:
published: false
slug: ${postNameToSlug}
id: ${generateUUID()}
---`;

  const postPath = path.join(__dirname, `../content/blog/${postNameToSlug}`);
  const postFilePath = path.join(postPath, "index.md");
  const postImageFolder = path.join(postPath, "images");

  try {
    fs.ensureDirSync(postPath);
    fs.ensureDirSync(postImageFolder);
    fs.writeFileSync(postFilePath, postTemplate);
    console.log(`Created new post: ${postFilePath}`);
  } catch (err) {
    console.error(`Error creating new post: ${err.message}`);
  }
}

function postNameToSlug(postName) {
  return postName.toLowerCase().replace(/\s/g, "-");
}

function generateUUID() {
  return randomUUID();
}

function main() {
  const postName = process.argv[2];
  if (!postName) {
    console.error("Please provide a post name");
    process.exit(1);
  }

  const postNameSlug = postNameToSlug(postName);
  createNewPost(postName, postNameSlug);
}

main();
