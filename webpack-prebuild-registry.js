import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve("./src");
const REGISTRY_FILE = path.resolve(SRC_DIR, "registry.ts");
const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

function getAllFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath));
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

// so incredibly broken lol, breaks if even a comment says "class" anywhere
function parseClasses(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const classes = [];
  const classRegex = /class\s+(\w+)/g;
  let match;
  while ((match = classRegex.exec(content)) !== null) {
    classes.push({
      className: match[1],
      filePath,
      default: true, // assume default export
    });
  }
  return classes;
}

export default class PrebuildRegistryPlugin {
  apply(compiler) {
    compiler.hooks.beforeCompile.tap("PrebuildRegistryPlugin", () => {
      let collected = [];
      getAllFiles(SRC_DIR).forEach(file => {
        collected = collected.concat(parseClasses(file));
      });

      let imports = [];
      let exportsArr = [];
      let i = 0;

      collected.forEach(({ className, filePath }) => {
        const relPath =
          "./" +
          path
            .relative(SRC_DIR, filePath)
            .replace(/\\/g, "/"); // keep extension

        const importName = `Cls${i++}`;
        imports.push(`import ${importName} from "${relPath}";`);
        exportsArr.push(`  "${className}": ${importName}`);
      });

      const registryContent = `${imports.join("\n")}

export const registry = {
${exportsArr.join(",\n")}
};
`;

      const existing = fs.existsSync(REGISTRY_FILE)
        ? fs.readFileSync(REGISTRY_FILE, "utf-8")
        : "";

      if (existing !== registryContent) {
        fs.writeFileSync(REGISTRY_FILE, registryContent, "utf-8");
        console.log(`Registry generated with ${collected.length} classes.`);
      } else {
        console.log("Registry unchanged, skipping write.");
      }
    });
  }
}
