let collected = [];

export function getCollected() {
  return collected;
}

export function resetCollected() {
  collected = [];
}

export default function CollectSerializablePlugin() {
  return {
    visitor: {
      ClassDeclaration(path, state) {
        const node = path.node;
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

        if (extendsSerializable(path)) {
          const filePath = state.file.opts.filename;
          const className = node.id?.name;
          if (filePath && className) {
            collected.push({ className, filePath });
          }
        }
      },
    },
  };
}
