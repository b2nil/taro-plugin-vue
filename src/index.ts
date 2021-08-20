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
  h5?: boolean
}

/**
 * Generate options for `@vitejs/plugin-vue`. 
 * The generated options is for mini-app by default. 
 * Set `h5` of the `rawOptions` to `true` 
 * if the generated options is targeting h5.
 */
export const genVueOptions = (rawOptions: TaroOptions = {}): Options => {
  const options: Options = {
    template: {
      compilerOptions: {
        mode: "module",
        optimizeImports: true
      }
    }
  }

  const userCompilerOptions = rawOptions.template?.compilerOptions || {}
  const userNodeTransforms = userCompilerOptions.nodeTransforms || []
  const usertransformAssetUrls = rawOptions.template?.transformAssetUrls || {}

  if (rawOptions.h5) {
    options.template!.transformAssetUrls = {
      ...transformH5AssetUrls,
      ...(usertransformAssetUrls as Record<string, string[]>)
    }

    options.template!.compilerOptions = {
      ...options.template!.compilerOptions,
      ...userCompilerOptions,
      nodeTransforms: [
        transformH5Tags(),
        ...userNodeTransforms
      ]
    }

  } else {
    options.template!.transformAssetUrls = {
      ...transformMiniappAssetUrls,
      ...(usertransformAssetUrls as Record<string, string[]>)
    }

    options.template!.compilerOptions = {
      ...options.template!.compilerOptions,
      ...userCompilerOptions,
      isNativeTag: isMiniappNativeTag
    }
  }

  return {
    ...(rawOptions as Options),
    template: options.template
  }
}

export default function vuePlugin (rawOptions: TaroOptions = {}): Plugin {
  const vueOptions = genVueOptions(rawOptions)

  return viteVuePlugin(vueOptions)
}

export * from './transforms'

// overwrite for cjs require('...')() usage
export { vuePlugin }
vuePlugin['default'] = vuePlugin