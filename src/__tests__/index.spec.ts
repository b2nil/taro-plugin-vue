import {
  isMiniappNativeTag,
  transformMiniappAssetUrls,
  transformH5AssetUrls,
  transformH5Tags,
  transformEnv,
  genVueOptions,
  vuePlugin
} from '..'

describe('genVueOptions', () => {
  test('should generate default mini-app options', () => {
    const options = genVueOptions()

    expect(
      options.template!.compilerOptions!.isNativeTag
    ).toEqual(isMiniappNativeTag)

    expect(
      options.template!.transformAssetUrls
    ).toEqual(transformMiniappAssetUrls)

    expect(options).toMatchSnapshot()
  })

  test('should merge user passed mini-app options', () => {
    const options = genVueOptions({
      template: {
        compilerOptions: {
          nodeTransforms: [transformEnv()]
        }
      }
    })

    expect(
      options.template!.compilerOptions!.isNativeTag
    ).toEqual(isMiniappNativeTag)

    expect(
      options.template!.compilerOptions!.nodeTransforms![0].toString()
    ).toEqual(transformEnv().toString())

    expect(
      options.template!.transformAssetUrls
    ).toEqual(transformMiniappAssetUrls)

    expect(options).toMatchSnapshot()
  })

  test('should generate default h5 options', () => {
    const options = genVueOptions({ h5: true })
    expect(
      options.template!.compilerOptions!.nodeTransforms![0].toString()
    ).toEqual(transformH5Tags().toString())

    expect(
      options.template!.transformAssetUrls
    ).toEqual(transformH5AssetUrls)

    expect(options).toMatchSnapshot()
  })

  test('should merge user passed h5 options', () => {
    const options = genVueOptions({
      h5: true,
      template: {
        compilerOptions: {
          nodeTransforms: [transformEnv('h5')]
        }
      }
    })

    expect(
      options.template!.compilerOptions!.nodeTransforms![0].toString()
    ).toEqual(transformH5Tags().toString())

    expect(
      options.template!.compilerOptions!.nodeTransforms![1].toString()
    ).toEqual(transformEnv().toString())

    expect(
      options.template!.transformAssetUrls
    ).toEqual(transformH5AssetUrls)

    expect(options).toMatchSnapshot()
  })
})

test('vuePlugin', () => {
  const plugin = vuePlugin()
  expect(plugin).toMatchSnapshot()
})