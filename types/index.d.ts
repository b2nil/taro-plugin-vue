import type { Plugin } from 'vite';
import type { Options } from '@vitejs/plugin-vue';
export { parseVueRequest, VueQuery, Options, ResolvedOptions } from '@vitejs/plugin-vue';
export interface TaroOptions extends Options {
    h5?: boolean;
}
export default function vuePlugin(rawOptions?: TaroOptions): Plugin;
export { transformH5Tags, isMiniappNativeTag, transformH5AssetUrls, transformMiniappAssetUrls } from './transforms';
