import Vue from "vue";
import Cookies from 'js-cookie'
let options = <%= serialize(options) %>;

const vUtmAdder = {
  install(Vue) {
    let linkObserver = null

    if(process.browser){

      if (options.saveCookies) {

      }

      let utmParamsObject
      let isWindowLoaded = false;

      function getAllUrlUtmParams(url) {
        let queryString = url
          ? url.split('?')[1]
          : window.location.search.slice(1)
        const obj = {}

        if (queryString) {
          queryString = queryString.split('#')[0]
          const arr = queryString.split('&')

          for (let i = 0; i < arr.length; i++) {
            const a = arr[i].split('=')
            let paramName = a[0]
            if (options.utmTags.includes(paramName)) {
              let paramValue = typeof a[1] === 'undefined' ? true : a[1]

              paramName = paramName.toLowerCase()
              if (typeof paramValue === 'string')
                paramValue = paramValue.toLowerCase()

              if (paramName.match(/\[(\d+)?]$/)) {
                const key = paramName.replace(/\[(\d+)?]/, '')
                if (!obj[key]) obj[key] = []

                if (paramName.match(/\[\d+]$/)) {
                  const index = /\[(\d+)]/.exec(paramName)[1]
                  obj[key][index] = paramValue
                } else {
                  obj[key].push(paramValue)
                }
              } else if (!obj[paramName]) {
                obj[paramName] = paramValue
              } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                obj[paramName] = [obj[paramName]]
                obj[paramName].push(paramValue)
              } else {
                obj[paramName].push(paramValue)
              }
            }
          }
        }

        return obj
      }

      if (options.saveCookies && Object.keys(getAllUrlUtmParams()).length > 0) {
        Cookies.set('utm', JSON.stringify(getAllUrlUtmParams()), { expires: 7, path: '/' })
      }

      function getAllUtmCookies() {
        const allCookies = Cookies.get()
        const utmCookies = {}
        Object.keys(allCookies).forEach(cookie => {
          if (options.utmTags.includes(cookie)) {
            utmCookies[cookie] = allCookies[cookie]
          }
        })
        return utmCookies
      }

      utmParamsObject = getAllUrlUtmParams(window.location.href)

      if (utmParamsObject && Object.keys(utmParamsObject).length === 0) {
        utmParamsObject = getAllUtmCookies()
        if (Object.keys(utmParamsObject).length === 0) {
          utmParamsObject = JSON.parse(Cookies.get('utm'))
        }
      }

      window['onNuxtReady'](() => {isWindowLoaded = true})

      linkObserver = new IntersectionObserver((entries) => {
        if(isWindowLoaded){
          if (utmParamsObject && Object.keys(utmParamsObject).length > 0) {
            entries.forEach(entry => {
              if(entry.isIntersecting){
                const el = entry.target;
                if(!el.getAttribute('utm-link')){
                  const url = new URL(el.href)
                  if (url.protocol === 'http:' || url.protocol === 'https:') {
                    Object.keys(utmParamsObject).forEach((key) => {
                      url.searchParams.set(key, utmParamsObject[key])
                    })
                    el.href = url.toString()
                    el.setAttribute('utm-link', 'true')
                  }
                }
              }
            })
          }
        }
      }, {});
    }

    Vue.directive('utm-adder', {
      inserted(el, {value, def}) {
        def.set(el, value)
      },
      update(el, {value, def}, vNode, oldVnode) {
        def.set(el, value);
      },
      set(el, value) {
        linkObserver.observe(el);
      }
    })
  }
}

Vue.use(vUtmAdder);
