import {
  isMiniappNativeTag,
  transformEnv,
  transformH5Tags,
  transformH5AssetUrls,
  transformMiniappAssetUrls
} from '../transforms'

import {
  parse,
  // SFCTemplateBlock,
  compileTemplate,
  SFCTemplateCompileOptions
} from '@vue/compiler-sfc'
import { trackSlotScopes } from '@vue/compiler-core'

function compile (opts: Omit<SFCTemplateCompileOptions, 'id' | 'filename'>) {
  return compileTemplate({
    ...opts,
    filename: 'example.vue',
    id: 'whatever'
  })
}

function parseTemplate (source: string) {
  return parse(source, {
    filename: 'example.vue',
    sourceMap: true
  }).descriptor.template
}

const nativeTags = [
  "view", "icon", "progress", "rich-text", "text", "button", "checkbox", "checkbox-group",
  "form", "input", "label", "picker", "picker-view", "picker-view-column", "radio", "radio-group",
  "slider", "switch", "cover-image", "textarea", "cover-view", "movable-area", "movable-view",
  "scroll-view", "swiper", "swiper-item", "navigator", "audio", "camera", "image", "live-player",
  "video", "canvas", "ad", "web-view", "block", "map", "open-data", "custom-wrapper", "canvas",
  "editor", 'navigation-bar', 'official-account', 'functional-page-navigator'
]

describe('transformH5Tags', () => {
  test.concurrent.each(nativeTags)(`should resolve component 'taro-%s' `, async (tag: string) => {
    const result = compile({
      source: `<${tag} />`,
      compilerOptions: {
        nodeTransforms: [transformH5Tags()]
      }
    })
    expect(result.code).not.toMatch(`createElementBlock("${tag}")`)
    expect(result.code).toMatch(`createBlock(_component_taro_${tag.replace(/-/g, '_',)})`)
    expect(result.code).toMatch(`resolveComponent("taro-${tag}")`)
  })
})

describe('isMiniappNativeTag', () => {
  test.concurrent.each(nativeTags)('should treat mini-app tag `%s` as native tag', async (tag: string) => {
    const result = compile({
      source: `<${tag} />`,
      compilerOptions: {
        isNativeTag: isMiniappNativeTag
      }
    })

    expect(result.code).toMatch(`createElementBlock("${tag}")`)
    expect(result.code).not.toMatch(`resolveComponent("${tag}")`)
  })
})

describe('transformEnv', () => {
  const template = parseTemplate(`
<template>
<view taro-env="h5">taro-env=h5</view>
<view taro-env="h5" v-if="1!==2">taro-env=h5 v-if</view>
<view taro-env="h5" v-else>taro-env=h5 v-else</view>
<view taroEnv="h5">taroEnv=h5</view>
<view taroEnv="h5" v-for="i in [0, 1]" :key="i">taroEnv=h5-v-for-{{i}}</view>
<view taro-env="mini">taro-env=mini</view>
<view taro-env="mini" v-if="1!==2">taro-env=mini v-if</view>
<view taro-env="mini" v-else>taro-env=mini  v-else</view>
<view taroEnv="mini">taroEnv=mini</view>
<view taroEnv="mini" v-for="i in [0, 1]" :key="i">taroEnv=mini-v-for-{{i}}</view>
</template>
    `)

  test('should trasnform `taro-env="h5"`', () => {
    const resultH5 = compile({
      source: template!.content,
      compilerOptions: {
        nodeTransforms: [
          transformH5Tags(),
          transformEnv('h5')
        ]
      }
    })
    expect(resultH5.code).not.toMatch('taro-env=mini')
    expect(resultH5.code).not.toMatch('taroEnv=mini')
    expect(resultH5.code).toMatchSnapshot()
  })

  test('should trasnform `taro-env="mini"`', () => {
    const resultMini = compile({
      source: template!.content,
      compilerOptions: {
        isNativeTag: isMiniappNativeTag,
        nodeTransforms: [transformEnv()]
      }
    })

    expect(resultMini.code).not.toMatch('taro-env=h5')
    expect(resultMini.code).not.toMatch('taroEnv=h5')
    expect(resultMini.code).toMatchSnapshot()
  })
})

describe('transformAssetUrls', () => {
  test('should transform mini-app asset urls', () => {
    for (const [tag, urls] of Object.entries(transformMiniappAssetUrls)) {
      for (const url of urls) {
        const source = `<${tag} ${url}="~baz"/>`
        // Object option
        const { code: code1 } = compile({
          source,
          transformAssetUrls: {
            [tag]: [url]
          }
        })
        expect(code1).toMatch(`import _imports_0 from 'baz'\n`)
      }
    }
  })

  test('should transform h5 asset urls', () => {
    for (const [tag, urls] of Object.entries(transformH5AssetUrls)) {
      for (const url of urls) {
        const source = `<${tag} ${url}="~baz"/>`
        // Object option
        const { code: code1 } = compile({
          source,
          transformAssetUrls: {
            [tag]: [url]
          }
        })
        expect(code1).toMatch(`import _imports_0 from 'baz'\n`)
      }
    }
  })
})


