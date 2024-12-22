declare global {
    interface Window {
      __NUXT__: {
        payloadRevivers: {
          [key: string]: (key: string, value: any) => any
        }
      }
    }
  }
export default defineNuxtPlugin(() => {
    if (process.client) {
      window.__NUXT__ = window.__NUXT__ || {}
      window.__NUXT__.payloadRevivers = {
        function: (key: string, value: any) => {
          if (typeof value === 'string' && value.startsWith('__FUNCTION__')) {
            return () => {}
          }
          return value
        }
      }
    }
  })