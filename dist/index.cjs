"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => openapi
});
module.exports = __toCommonJS(src_exports);
var import_swagger_parser = __toESM(require("@apidevtools/swagger-parser"), 1);
var import_pluginutils = require("@rollup/pluginutils");
var ext = /\.(ya?ml)|(json)$/;
function openapi(opts = {}) {
  const options = Object.assign({}, opts);
  const filter = (0, import_pluginutils.createFilter)(options.include, options.exclude);
  const rootIds = /* @__PURE__ */ new Set();
  return {
    name: "openapi",
    async transform(_, id) {
      if (!ext.test(id)) return null;
      if (!filter(id)) return null;
      const refs = await import_swagger_parser.default.resolve(id);
      const filteredRefs = refs.paths("file").filter((path) => path !== id);
      for (const ref of filteredRefs) {
        this.addWatchFile(ref);
      }
      rootIds.add(id);
      const content = await import_swagger_parser.default.bundle(id);
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
//# sourceMappingURL=index.cjs.map