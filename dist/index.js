// src/index.ts
import SwaggerParser from "@apidevtools/swagger-parser";
import { createFilter } from "@rollup/pluginutils";
var ext = /\.(ya?ml)|(json)$/;
function openapi(opts = {}) {
  const options = Object.assign({}, opts);
  const filter = createFilter(options.include, options.exclude);
  const rootIds = /* @__PURE__ */ new Set();
  return {
    name: "openapi",
    async transform(_, id) {
      if (!ext.test(id)) return null;
      if (!filter(id)) return null;
      const refs = await SwaggerParser.resolve(id);
      const filteredRefs = refs.paths("file").filter((path) => path !== id);
      for (const ref of filteredRefs) {
        this.addWatchFile(ref);
      }
      rootIds.add(id);
      const content = await SwaggerParser.bundle(id);
      return {
        code: `var data = ${JSON.stringify(
          content,
          null,
          2
        )};

export default data;
`,
        map: null
        // Swagger CLI doesn't provide a source map
      };
    },
    /**
     * Handle HMR in Vite
     *
     * This is a Vite specific workaround to [issue #7024](https://github.com/vitejs/vite/issues/7024)
     */
    handleHotUpdate(ctx) {
      if (ext.test(ctx.file) && !rootIds.has(ctx.file) && !ctx.modules.length) {
        if (process?.env?.DEBUG) {
          console.log("[openapi] reload referenced file", ctx.file);
        }
        for (const rootId of rootIds) {
          const root = ctx.server.moduleGraph.getModuleById(rootId);
          if (root) {
            ctx.server.moduleGraph.invalidateModule(root);
          }
        }
        ctx.server.ws.send({
          type: "full-reload",
          path: "*"
        });
      }
      return ctx.modules;
    }
  };
}
export {
  openapi as default
};
//# sourceMappingURL=index.js.map