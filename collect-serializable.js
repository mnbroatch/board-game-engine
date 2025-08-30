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
        const className = node.id?.name;
        const filePath = state.file.opts.filename;

        if (className && filePath) {
          collected.push({ className, filePath });
        }
      },
    },
  };
}
