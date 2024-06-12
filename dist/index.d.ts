import { FilterPattern } from '@rollup/pluginutils';
import { Plugin } from 'vite';

interface RollupOpenApiOptions {
    /**
     * A minimatch pattern, or array of patterns, which specifies the files in the build the plugin
     * should operate on.
     * By default all files are targeted.
     */
    include?: FilterPattern;
    /**
     * A minimatch pattern, or array of patterns, which specifies the files in the build the plugin
     * should _ignore_.
     * By default no files are ignored.
     */
    exclude?: FilterPattern;
}
/**
 * A Rollup and Vite plugin which converts OpenAPI YAML files to ES6 modules.
 */
declare function openapi(opts?: RollupOpenApiOptions): Plugin;

export { openapi as default };
