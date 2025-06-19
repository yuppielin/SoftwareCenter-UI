'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const globalSettings = require('./public/config.js')

// 适配不同屏幕
const autoprefixer = require('autoprefixer') // 根据浏览器适配css，自动加前缀，不用可以删除
const pxtorem = require('postcss-pxtorem')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = globalSettings.title || '软件中心试点' // page title

const gurl = globalSettings.url

// const name = defaultSettings.title || '软件中心试点' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 81 npm run dev OR npm run dev --port = 81
const port = process.env.port || process.env.npm_config_port || 81 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    // 设置主机地址
    host: globalSettings.host,
    // 设置默认端口
    port: globalSettings.port,
    // port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }

    // 设置代理
    // proxy: {
    //   '/api': {
    //     // 目标 API 地址
    //     target: gurl,
    //     // 如果要代理 websockets
    //     // ws: true,
    //     // 将主机标头的原点更改为目标URL
    //     changeOrigin: true
    //     // pathRewrite: {
    //     //   '^/api': ''
    //     // }
    //   }
    // }
    // before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()


    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  },
  // postcss-pxtorem
  css: {
      loaderOptions: {
          // css: {},
          // postcss: {
          //     plugins: [
          //         autoprefixer(),
          //         pxtorem({
          //            rootValue: 37.5,  //手机设计稿宽度为375px的
          //            propList: ['*'], //属性的选择器，*表示通用
          //            exclude: /web/i, //忽略web下的所有文件
          //            selectorBlackList: ['.a-'] // 过滤掉.a- 开头的class，不进行rem转换
          //         }),
          //     ]
          // }
        scss: {
          sassOptions: { outputStyle: 'expanded'}
        }
      }
  },
}
