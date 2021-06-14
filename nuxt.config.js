const baseUrl = process.env.BASE_URL || 'http://localhost:3000/'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'timekeeper',
    htmlAttrs: {
      lang: 'jp'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description },
      { hid: 'og:site_name', property: 'og:site_name', content: process.env.npm_package_name },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:title', property: 'og:title', content: process.env.npm_package_name },
      { hid: 'og:description', property: 'og:description', content: process.env.npm_package_description },
      { hid: 'og:url', property: 'og:url', content: baseUrl },
      { hid: 'og:image', property: 'og:image', content: `${baseUrl}ogp.png` },
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/timekeeper/favicon.ico' }
    ]
  },

  router: {
    base: '/timekeeper/'
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/destyle.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    ['nuxt-fontawesome', {
      component: 'fa'
    }],
    '@nuxtjs/google-analytics'
  ],
  googleAnalytics: {
    id: GOOGLE_ANALYTICS_ID
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
