const path = require('path');

export default function nuxtUtmAdder() {
  this.extendBuild(config => {
    config.module.rules.push({
      test: /\.vue$/,
      loader: 'string-replace-loader',
      exclude: /node_modules/,
      options: {
        multiple: [
          {search: '<a', replace: '<a v-utm-adder', flags: 'g' },
          {search: '<nuxt-link', replace: '<nuxt-link v-utm-adder', flags: 'g' },
        ]
      }
    })
  })
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js')
  })
}

module.exports.meta = require('../package.json')
