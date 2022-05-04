import Vue from "vue";
import Cookies from 'js-cookie'
import { getUtmFromUrl, getUtmFromCookies } from "@norvikit/utm-aska"
let options = <%= serialize(options) %>;

const vUtmAdder = {
  install(Vue) {
    let linkObserver = null

    if(process.browser){

      let utmParamsObject = getUtmFromUrl()
      let isWindowLoaded = false;

      if (options.saveCookies && Object.keys(utmParamsObject).length > 0) {
        Cookies.set('utm', JSON.stringify(utmParamsObject), { expires: 7, path: '/' })
      }

      if (utmParamsObject && Object.keys(utmParamsObject).length === 0) {
        utmParamsObject = getUtmFromCookies()
        if (Object.keys(utmParamsObject).length === 0) {
          const cookies = Cookies.get('utm')
          if (cookies) {
            utmParamsObject = JSON.parse(cookies)
          }
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
                  if (el.href && el.href.length > 0) {
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
