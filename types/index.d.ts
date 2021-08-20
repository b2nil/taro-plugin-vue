import type { Plugin } from 'vite';
import type { Options } from '@vitejs/plugin-vue';
export { parseVueRequest, VueQuery, Options, ResolvedOptions } from '@vitejs/plugin-vue';
/**
 * An extension to `@vitejs/plugin-vue`'s `Options`
 * with an extra `h5` option.
 */
export interface TaroOptions extends Options {
    /**
     * Specify whether the target platform is h5 or mini-app.
     * Set to `true` if the build is targeting h5.
     * @default undefined
     */
    h5?: boolean;
}
/**
 * Generate options for `@vitejs/plugin-vue`.
 * The generated options is for mini-app by default.
 * Set `h5` of the `rawOptions` to `true`
 * if the generated options is targeting h5.
 */
export declare const genVueOptions: (rawOptions: TaroOptions) => Options;
export default function vuePlugin(rawOptions?: TaroOptions): Plugin;
export * from './transforms';
export { vuePlugin };
