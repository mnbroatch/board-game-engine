import fs from "fs";
import path from "path";

export default function CollectAndEmitSerializablePlugin() {
  let classes = [];

  return {
    pre() {
      // Reset once at the start of each build
      classes = [];
    },

    visitor: {
      ClassDeclaration(classPath, state) {
        const node = classPath.node;
        if (!node.superClass) return;

        function extendsSerializable(p) {
          let superPath = p.get("superClass");
          while (superPath && superPath.node) {
            const name = superPath.node.name;
            if (name === "Serializable") return true;

            const binding = p.scope.getBinding(name);
            if (binding && binding.path.isClassDeclaration()) {
              p = binding.path;
              superPath = p.get("superClass");
            } else {
              break;
            }
          }
          return false;
        }

        if (extendsSerializable(classPath)) {
          const filePath = state.file.opts.filename;
          const className = node.id?.name;
          if (filePath && className) {
            classes.push({ className, filePath });
          }
        }
      }
    },

    post() {
      const unique = new Map();
      for (const entry of classes) {
        unique.set(`${entry.className}@${entry.filePath}`, entry);
      }

      const imports = [];
      const exports = [];

      let i = 0;
      for (const { className, filePath } of unique.values()) {
        const relPath = "./" + path.relative("./src", filePath).replace(/\.[tj]sx?$/, "");
        const importName = `Cls${i++}`;
        imports.push(`import { ${className} as ${importName} } from "${relPath}";`);
        exports.push(`  "${className}": ${importName}`);
      }

      const content = `${imports.join("\n")}

export const registry = {
${exports.join(",\n")}
};
`;

      const outPath = path.resolve("./src/registry.js");
      fs.writeFileSync(outPath, content, "utf-8");
      console.log(`✅ registry.js generated with ${unique.size} Serializable classes`);
    }
  };
}
