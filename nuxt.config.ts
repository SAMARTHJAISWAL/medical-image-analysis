export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/styles/main.css'],
  app: {
    head: {
      title: 'Medical Image Analysis'
    }
  },
  nitro: {
    preset: 'netlify',
  },
  experimental: {
    payloadExtraction: false
  }
})
