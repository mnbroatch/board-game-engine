// collect-serializable.js
globalThis.__SERIALIZABLE_CLASSES__ = globalThis.__SERIALIZABLE_CLASSES__ || new Set();

export default function ({ types: t }) {
  const classMap = {}; // className -> superClassName

  return {
    visitor: {
      ClassDeclaration(path, state) {
        const className = path.node.id?.name;
        const superClass = path.node.superClass;

        if (!className) return;

        if (superClass && t.isIdentifier(superClass)) {
          classMap[className] = superClass.name;
        }

        // helper: check if this class ultimately extends Serializable
        function extendsSerializable(cls) {
          if (!cls) return false;
          if (cls === "Serializable") return true;
          return extendsSerializable(classMap[cls]);
        }

        if (extendsSerializable(className)) {
          // add class name + absolute file path to global set
          globalThis.__SERIALIZABLE_CLASSES__.add({
            name: className,
            filePath: state.file.opts.filename,
          });
        }
      },
    },
  };
};
