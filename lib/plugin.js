import Vue from "vue";

const vUtmAdder = {
  install(Vue) {
    let linkObserver = null

    if(process.browser){
      const utmKeysMap = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
      ]
      let utmParamsObject
      let isWindowLoaded = false;

      function getAllUrlParams(url) {
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
            if (utmKeysMap.includes(paramName)) {
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
      // Получение utm-меток по ключу из cookies
      function getAllUtmCookies() {
        return document.cookie.split(';').reduce((cookies, cookie) => {
          const [name, val] = cookie.split('=').map((c) => c.trim())
          if (utmKeysMap.includes(name)) {
            cookies[name] = val
          }
          return cookies
        }, {})
      }
      // Получение куки по имени
      function getCookieByName(name) {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2)
          return JSON.parse(decodeURIComponent(parts.pop().split(';').shift()))
      }

      // Получаем все utm метки из урла страницы
      utmParamsObject = getAllUrlParams(window.location.href)

      if (utmParamsObject && Object.keys(utmParamsObject).length === 0) {
        // Если в урле нет меток, то получаем их из куки по ключам
        utmParamsObject = getAllUtmCookies()
        if (Object.keys(utmParamsObject).length === 0) {
          // Если в куках по ключам нет меток, то получаем их из куки utm
          utmParamsObject = getCookieByName('utm')
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
