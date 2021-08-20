try {
  require.resolve('@vue/compiler-sfc')
  require.resolve('@vitejs/plugin-vue')
} catch (e) {
  throw new Error(
    'taro-plugin-vue requires @vue/compiler-sfc and @vitejs/plugin-vue ' +
    'to be present in the dependency tree.'
  )
}

import viteVuePlugin from '@vitejs/plugin-vue'
import {
  transformH5Tags,
  isMiniappNativeTag,
  transformH5AssetUrls,
  transformMiniappAssetUrls
} from './transforms'
import type { Plugin } from 'vite'
import type { Options } from '@vitejs/plugin-vue'

export {
  parseVueRequest,
  VueQuery,
  Options,
  ResolvedOptions
} from '@vitejs/plugin-vue'

export interface TaroOptions extends Options {
  h5?: boolean
}

const genVueOptions = (h5?: boolean): Options => {
  const options: Options = {
    template: {
      ssr: false,
      compilerOptions: {
        mode: "module",
        optimizeImports: true
      }
    }
  }

  if (h5) {
    options.template!.transformAssetUrls = transformH5AssetUrls
    options.template!.compilerOptions!.nodeTransforms = [transformH5Tags()]
  } else {
    options.template!.transformAssetUrls = transformMiniappAssetUrls
    options.template!.compilerOptions!.isNativeTag = isMiniappNativeTag
  }

  return options
}

export default function vuePlugin (rawOptions: TaroOptions = {}): Plugin {
  const defaultOptions = genVueOptions(rawOptions.h5)

  return viteVuePlugin({
    ...defaultOptions,
    ...(rawOptions as Options)
  })
}

export {
  transformH5Tags,
  isMiniappNativeTag,
  transformH5AssetUrls,
  transformMiniappAssetUrls
} from './transforms'

// overwrite for cjs require('...')() usage
module.exports = vuePlugin
vuePlugin['default'] = vuePlugin