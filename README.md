# taro-plugin-vue
> A customized `@vitejs/plugin-vue` for building component libs for Taro.

> 构建及打包 Taro 第三方 Vue 3.0 组件的定制版 `@vitejs/plugin-vue`

## 背景
写 `taro-ui-vue3` 时，其实已经踩过了 Taro Vue 第三方组件一些出现率比较频繁的坑，其中一个就是在 Taro 项目（h5 或小程序）中使用第三方组件时，发现无法解析某个组件，例如：`[Vue-warn]: Failed to resolve component: swiper`。

导致这一问题的原因，通常是编译配置的问题。Taro Vue 第三方组件库（基于 SFC template）的编译，应采用与 [`@tarojs/mini-runner`](https://github.com/NervJS/taro/blob/next/packages/taro-mini-runner/src/webpack/vue3.ts#L41-L65) 和 [`@tarojs/webpack-runner`](https://github.com/NervJS/taro/blob/next/packages/taro-webpack-runner/src/config/vue3.ts#L48-L76) 的 `vue-loader` 编译配置相同的配置。

为了避免 Taro Vue 第三方组件生态圈重复踩坑，现将 `taro-ui-vue3` [feat/sfc 分支](https://github.com/b2nil/taro-ui-vue3/tree/feat/sfc/build) 采用的编译配置提炼出来，方便 Taro Vue 第三方组件库开发者使用。

`taro-plugin-vue` 其实是基于 `@vitejs/plugin-vue` 的一个 `vite` 插件，针对 Taro Vue 第三方组件的 SFC 模板编译进行配置，仅适用于采用 `vite` 构建和打包的场景。

如果你熟悉 Taro 的 `vue-loader` 编译配置，亦可直接将相关配置作为参数传递给 `@vitejs/plugin-vue` 插件即可，无需使用 `taro-plugin-vue` 插件。

## 安装
```bash
yarn add -D taro-plugin-vue @vitejs/plugin-vue
```

## 使用
`taro-plugin-vue` 在 `@vitejs/plugin-vue` 的参数 `Option` 的基础上新增了一个 `h5?: boolean` 项，用于控制编译的平台。用法和其他参数与 `@vitejs/plugin-vue` 相同。

```ts
// vite.config.js
const vuePlugin = require('taro-plugin-vue')

export default {
  plugins: [
    // 编译至小程序平台
    vuePlugin() 

    // 编译至 h5 平台
    vuePlugin({ h5: true }) 

    // 自行配置编译参数，覆盖默认的编译配置
    vue({
      template: {
        transformAssetUrls: {
          video: ['src', 'poster'],
          'live-player': ['src'],
          // ...
        },
        compilerOptions: {
          isNativeTag: ...,
          nodeTransforms: [...]
        }
      }
    })
  ],
  //...
}

```

## 默认编译配置
- h5
  ```ts
  const options: Options = {
    template: {
      ssr: false,
      transformAssetUrls: transformH5AssetUrls,
      compilerOptions: {
        mode: "module",
        optimizeImports: true,
        nodeTransforms: [transformH5Tags()] // 详见 src/transforms.ts
      }
    }
  }
  ```

- 小程序
  ```ts
  // mini-apps
  const options: Options = {
    template: {
      ssr: false,
      transformAssetUrls: transformMiniappAssetUrls,
      compilerOptions: {
        mode: "module",
        optimizeImports: true,
        isNativeTag: isMiniappNativeTag // 详见 src/transforms.ts
      }
    }
  }
  ```

## 其他用法
本 repo 还导出了专门针对 Taro Vue 3.0 SFC 模板编译的一些 transform 函数，详情如下。

这些函数可用于 `@vitejs/plugin-vue` 插件配置, 亦可用于 `vue-loader` 配置。

```ts
/**
 * Transform mini-app asset urls.
 * @see https://github.com/NervJS/taro/blob/next/packages/taro-mini-runner/src/webpack/vue3.ts#L43-L50
 */
export declare const transformMiniappAssetUrls

/**
 * Transform H5 asset urls.
 * @see https://github.com/NervJS/taro/blob/next/packages/taro-webpack-runner/src/config/vue3.ts#L49-L62
 */
export declare const transformH5AssetUrls

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
```