import fs from "fs";
import path from "path";

export default class EmitRegistryPlugin {
  constructor(options = {}) {
    this.outputFile = options.outputFile || "src/registry.js";
  }

  apply(compiler) {
    compiler.hooks.done.tap("EmitRegistryPlugin", () => {
      const allClasses = Array.from(globalThis.__SERIALIZABLE_CLASSES__ || []);

      if (!allClasses.length) {
        console.warn("⚠️ No Serializable classes found");
        return;
      }

      const imports = allClasses
        .map(cls => {
          if (!cls.filePath) {
            console.warn(`⚠️ No filePath for class ${cls.name}`);
            return "";
          }
          let relPath = path.relative(path.dirname(this.outputFile), cls.filePath);
          if (!relPath.startsWith(".")) relPath = "./" + relPath;
          relPath = relPath.replace(/\\/g, "/"); // Windows compatibility
          return `import ${cls.name} from '${relPath}';`;
        })
        .filter(Boolean)
        .join("\n");

      const registry = "export const registry = new Map([\n" +
        allClasses.map(cls => `  ['${cls.name}', ${cls.name}],`).join("\n") +
        "\n]);\n";

      const content = `// This file is generated, so don't change it.\n${imports}\n\n${registry}`;

      const outPath = path.resolve(this.outputFile);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, content, "utf8");

      console.log(`✅ registry.js generated with ${allClasses.length} Serializable classes`);
    });
  }
}
