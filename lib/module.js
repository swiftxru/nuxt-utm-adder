const path = require('path');

export default function nuxtUtmAdder(_options) {
  const defaultOptions = {
    utmTags: [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
    ],
    saveCookies: true,
  }

  let options = Object.assign(defaultOptions, _options);

  this.extendBuild(config => {
    config.module.rules.push({
      test: /\.vue$/,
      loader: 'string-replace-loader',
      exclude: /node_modules/,
      options: {
        multiple: [
          {search: '<a ', replace: '<a v-utm-adder', flags: 'g' },
          {search: '<nuxt-link ', replace: '<nuxt-link v-utm-adder', flags: 'g' },
        ]
      }
    })
  })
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'v-utm-adder.js',
    options
  })
}

module.exports.meta = require('../package.json')
