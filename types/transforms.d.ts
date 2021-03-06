import type { NodeTransform } from '@vue/compiler-core';
/**
 * Transform mini-app asset urls.
 * @see https://github.com/NervJS/taro/blob/next/packages/taro-mini-runner/src/webpack/vue3.ts#L43-L50
 */
export declare const transformMiniappAssetUrls: {
    video: string[];
    'live-player': string[];
    audio: string[];
    source: string[];
    image: string[];
    'cover-image': string[];
};
/**
 * Transform H5 asset urls.
 * @see https://github.com/NervJS/taro/blob/next/packages/taro-webpack-runner/src/config/vue3.ts#L49-L62
 */
export declare const transformH5AssetUrls: {
    video: string[];
    'live-player': string[];
    audio: string[];
    source: string[];
    image: string[];
    'cover-image': string[];
    'taro-video': string[];
    'taro-live-player': string[];
    'taro-audio': string[];
    'taro-source': string[];
    'taro-image': string[];
    'taro-cover-image': string[];
};
/**
 * Declare native mini-app tags, so that miniapp native components
 * such as `picker`, `swiper`, `scroll-view` and etc.
 * will be treated as native tags, thus not to be resolved as components.
 */
export declare function isMiniappNativeTag(tag: string): boolean;
/**
 * Transform tags for h5 components.
 * For example, tag `view` will be transformed to `taro-view`,
 * so that it will be compiled to `resolveComponent('taro-view')`.
 */
export declare function transformH5Tags(): NodeTransform;
/**
 * Transform `taro-env` or `taroEnv` prop,
 * and remove node that is not for the specified platform
 * @param platform `'mini' | 'h5'`
 */
export declare function transformEnv(platform?: 'mini' | 'h5'): NodeTransform;
/**
 * Transform `onClick` to `onTap` on native tags.
 */
export declare const transformClick: NodeTransform;
