// const path = require("path");
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.hotReload = false
        return options
      });
    config.module
      .rule('images')
      .test(/\.(png)(\?.*)?$/)
      .use('url-loader')
      .options({
        limit: 0,
        name: `media/[name].[hash].[ext]`
      });
    config.module
      .rule('media')
      .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
      .use('url-loader')
      .options({
        limit: 0,
        name: `media/[name].[hash].[ext]`
      });
  },
  productionSourceMap: false,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        asar: true,
        win: {
          icon: "build/favicon.ico",
          target: ["portable", "nsis"]
        },
        mac: {
          icon: "build/logo.png"
        }
      }
    }
  }
}
