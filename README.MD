# Nuxt UTM Adder
![Size](https://img.shields.io/bundlephobia/minzip/@norvikit/nuxt-utm-adder)
![Version](https://img.shields.io/npm/v/@norvikit/nuxt-utm-adder)
![Downloads](https://img.shields.io/npm/dt/@norvikit/nuxt-utm-adder)

## 📃 Description
Plugin to add utm tags to all links on a page

## 📦 Installation

### NPM

`npm install --save @norvikit/nuxt-utm-adder`

### Yarn

`yarn add @norvikit/nuxt-utm-adder`

## 🚀 Usage

```
// nuxt.config.js

buildModules: [
  '@norvikit/nuxt-utm-adder'
]
// or

buildModules: [
  ['@norvikit/nuxt-utm-adder', {
    // Your options
  }]
]
```

## 🔧 Options

```
// nuxt.config.js
// Default options

buildModules: [
  ['@norvikit/nuxt-utm-adder', {
    // Utm tags to track
    utmTags: [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
    ],
    // Save utm tags to cookies
    saveCookies: true,
  }]
]
```