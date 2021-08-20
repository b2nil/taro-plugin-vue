import type { NodeTransform } from '@vue/compiler-core'

const nativeComponents = new Set<string>([
  "view", "icon", "progress", "rich-text", "text", "button", "checkbox", "checkbox-group",
  "form", "input", "label", "picker", "picker-view", "picker-view-column", "radio", "radio-group",
  "slider", "switch", "cover-image", "textarea", "cover-view", "movable-area", "movable-view",
  "scroll-view", "swiper", "swiper-item", "navigator", "audio", "camera", "image", "live-player",
  "video", "canvas", "ad", "web-view", "block", "map", "open-data", "custom-wrapper", "canvas",
  "editor", 'navigation-bar', 'official-account', 'functional-page-navigator'
])

/**
 * Transform mini-app asset urls.
 * From: https://github.com/NervJS/taro/blob/next/packages/taro-mini-runner/src/webpack/vue3.ts#L43-L50
 */
export const transformMiniappAssetUrls = {
  video: ['src', 'poster'],
  'live-player': ['src'],
  audio: ['src'],
  source: ['src'],
  image: ['src'],
  'cover-image': ['src']
}

/**
 * Transform H5 asset urls.
 * From: https://github.com/NervJS/taro/blob/next/packages/taro-webpack-runner/src/config/vue3.ts#L49-L62
 */
export const transformH5AssetUrls = {
  video: ['src', 'poster'],
  'live-player': ['src'],
  audio: ['src'],
  source: ['src'],
  image: ['src'],
  'cover-image': ['src'],
  'taro-video': ['src', 'poster'],
  'taro-live-player': ['src'],
  'taro-audio': ['src'],
  'taro-source': ['src'],
  'taro-image': ['src'],
  'taro-cover-image': ['src']
}

function isTaroInternalComponents (tag: string) {
  return nativeComponents.has(tag)
}

/**
 * Declare native mini-app tags,
 * so that miniapp native components 
 * such as `picker`, `swiper`, `scroll-view` and etc. 
 * can be resolved.
 */
export function isMiniappNativeTag (tag: string) {
  return isTaroInternalComponents(tag)
}

/**
 * Transform tags for h5 components.
 * For example, `<view />` will be transformed to `<taro-view />`,
 * so that it will be compiled to `resolveComponent('taro-view')`
 */
export function transformH5Tags (): NodeTransform {
  return (node, ctx) => {
    if (
      node.type === 1 /* NodeTypes.ELEMENT */ &&
      isTaroInternalComponents(node.tag) /* is built-in tag*/
    ) {
      node.tag = `taro-${node.tag}`
      node.tagType = 1 /* ElementTypes.COMPONENT */
    }
  }
}