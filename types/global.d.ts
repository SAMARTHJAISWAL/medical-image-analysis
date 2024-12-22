declare interface Window {
    __NUXT__: {
      payloadRevivers: {
        [key: string]: (key: string, value: any) => any
      }
    }
  }