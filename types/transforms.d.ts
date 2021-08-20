import type { NodeTransform } from '@vue/compiler-core';
/**
 * Transform mini-app asset urls.
 * From: https://github.com/NervJS/taro/blob/next/packages/taro-mini-runner/src/webpack/vue3.ts#L43-L50
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
 * From: https://github.com/NervJS/taro/blob/next/packages/taro-webpack-runner/src/config/vue3.ts#L49-L62
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
 * Declare native mini-app tags,
 * so that miniapp native components
 * such as `picker`, `swiper`, `scroll-view` and etc.
 * can be resolved.
 */
export declare function isMiniappNativeTag(tag: string): boolean;
/**
 * Transform tags for h5 components.
 * For example, `<view />` will be transformed to `<taro-view />`,
 * so that it will be compiled to `resolveComponent('taro-view')`
 */
export declare function transformH5Tags(): NodeTransform;
