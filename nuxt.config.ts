export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/styles/main.css'],
  app: {
    head: {
      title: 'Medical Image Analysis'
    }
  },
  // Add these configurations
  experimental: {
    payloadExtraction: false
  },
nitro: {
    serveStatic: true,
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-12-19'
})