import type { NodeTransform, TemplateChildNode } from '@vue/compiler-core'

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

/**
 * Transform `taro-env` or `taroEnv` prop,
 * and remove node that is not for the specified platform
 * @param platform `'mini' | 'h5'`
 */
export function transformEnv (platform: 'mini' | 'h5' = 'mini'): NodeTransform {

  const findEnv = (source: string) => {
    const envReg = /(?<=(taro-env|taroEnv)=")([a-z0-9]+)(?=")/g
    const found = source.match(envReg)
    return found !== null ? found[0] : found
  }

  const isTaroEnv = (propName: string) => {
    return (propName === 'taro-env' || propName === 'taroEnv')
  }

  return (node, ctx) => {
    if (node.type >= 9 && node.type <= 11 /*if, if-branch, v-for*/) {
      const source = node.type === 11
        ? node.codegenNode!.loc.source
        : node.loc.source

      const targetEnv = findEnv(source)

      if (targetEnv && targetEnv !== platform)
        ctx.removeNode(node as TemplateChildNode)

    } else if (node.type === 1 /* Element */) {
      node.props.forEach((prop, index) => {
        if (prop.type === 6 && isTaroEnv(prop.name)) {
          platform !== prop.value?.content
            ? ctx.removeNode(node)
            : node.props.splice(index, 1)
        }
      })
    }
  }
}