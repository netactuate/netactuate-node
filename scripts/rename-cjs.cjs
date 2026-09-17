const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "dist", "cjs");

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".js")) {
      const source = fs.readFileSync(full, "utf8").replace(/require\("(\.\/[^"]+)\.js"\)/g, 'require("$1.cjs")');
      fs.writeFileSync(full, source);
      fs.renameSync(full, full.slice(0, -3) + ".cjs");
    }
  }
}

if (fs.existsSync(root)) {
  walk(root);
}
