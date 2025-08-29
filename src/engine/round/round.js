import fs from "fs";
import path from "path";
import { getCollected, resetCollected } from "./collect-serializable.js";

export default class EmitRegistryPlugin {
  constructor(options = {}) {
    this.outputFile = options.outputFile || "./src/registry.ts";
  }

  apply(compiler) {
    compiler.hooks.done.tap("EmitRegistryPlugin", () => {
      const collected = getCollected();
      resetCollected();

      const unique = new Map();
      for (const entry of collected) {
        // key includes className + filePath to avoid duplicates
        if (!entry.filePath || !entry.className) continue;
        unique.set(`${entry.className}@${entry.filePath}`, entry);
      }

      const imports = [];
      const exports = [];
      let i = 0;

      for (const { className, filePath } of unique.values()) {
        if (!filePath) continue;

        // relative path from src, normalized
        const relPath =
          "./" +
          path
            .relative("./src", filePath)
            .replace(/\\/g, "/")
            .replace(/\.[tj]sx?$/, "") +
          ".ts";

        const importName = `Cls${i++}`;
        const fileContent = fs.readFileSync(filePath, "utf-8");

        // Detect if the class is exported as default
        const defaultClassRegex = new RegExp(
          `export\\s+default\\s+class\\s+${className}(\\s+extends\\s+\\w+)?\\b`,
          "m"
        );

        const isDefaultExport =
          defaultClassRegex.test(fileContent) ||
          new RegExp(`export\\s+default\\s+${className}\\b`).test(fileContent);

        if (isDefaultExport) {
          imports.push(`import ${importName} from "${relPath}";`);
        } else {
          imports.push(`import { ${className} as ${importName} } from "${relPath}";`);
        }

        exports.push(`  "${className}": ${importName}`);
      }

      const content = `${imports.join("\n")}

export const registry: Record<string, any> = {
${exports.join(",\n")}
};
`;

      const outPath = path.resolve(this.outputFile);
      const oldContent = fs.existsSync(outPath) ? fs.readFileSync(outPath, "utf-8") : null;

      if (oldContent !== content) {
        fs.writeFileSync(outPath, content, "utf-8");
        console.log(`✅ registry.ts generated with ${unique.size} Serializable classes`);
      } else {
        console.log(`ℹ️ registry.ts unchanged (${unique.size} Serializable classes)`);
      }
    });
  }
}
