// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  modules: ['@nuxtjs/tailwindcss'],
  
  runtimeConfig: {
    // Private keys - only available server-side
    openrouterApiKey: process.env.OPENROUTER_API_KEY || '',
    
    // Public keys - exposed to the client
    public: {
      appName: 'Grammar Study Buddy'
    }
  },

  app: {
    head: {
      title: 'Grammar Study Buddy',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Get instant grammar feedback on your sentences' }
      ]
    }
  }
})

