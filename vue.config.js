const path = require('path');
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('ts')
      .use('ts-loader')
      .tap(options => {
        options.configFile = path.resolve(__dirname, "tsconfig.json");
        return options;
      })
    
  },
  transpileDependencies: ['three', 'three-for-vue']
}