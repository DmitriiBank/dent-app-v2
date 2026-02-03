const fs = require("node:fs");
const path = require("node:path");

const sourcePath = path.resolve(
    __dirname,
    "..",
    "src",
    "config",
    "app-config",
    "app-config.json"
);
const destinationPath = path.resolve(
    __dirname,
    "..",
    "build",
    "config",
    "app-config",
    "app-config.json"
);

fs.mkdirSync(path.dirname(destinationPath), {recursive: true});
fs.copyFileSync(sourcePath, destinationPath);

console.log(`Copied app config to ${destinationPath}`);
