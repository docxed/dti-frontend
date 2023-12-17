import colors from 'vuetify/es5/util/colors'
import th from 'vuetify/es5/locale/th'
import en from 'vuetify/es5/locale/en'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Digital Intelligence Test',
    title: 'Digital Intelligence Test',
    htmlAttrs: {
      lang: 'th',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/rules.js',
    '~/plugins/v-mask.js',
    '~/plugins/toast.js',
    '~/plugins/axios.js',
    '~/plugins/vuetify.js',
    '~/plugins/currency.js',
    '~/plugins/quill-editor-viewer.js',
    '~/plugins/loader.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/google-fonts',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/moment',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.NUXT_ENV_BASE_URL,
  },

  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.NUXT_ENV_BASE_URL,
    },
    contact_email: process.env.NUXT_ENV_CONTACT_EMAIL,
    contact_password: process.env.NUXT_ENV_CONTACT_PASSWORD,
    baseURL: process.env.NUXT_ENV_BASE_URL,
    node_env: process.env.NODE_ENV,
  },

  auth: {
    strategies: {
      local: {
        scheme: 'refresh', // Refresh scheme
        redirect: false, // Disable redirect
        token: {
          property: 'access_token',
          global: true, // Use global token
          required: true, // Required token
          type: 'Bearer',
          maxAge: 24 * 60 * 60, // 24 hours
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          maxAge: 7 * 24 * 60 * 60, // 7 days
        },
        user: {
          property: false, // <--- Default "user"
          autoFetch: true, // <--- Default "true" (Fetch user info on login)
        },
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          refresh: { url: '/auth/refresh-token', method: 'post' },
          user: { url: '/auth/me', method: 'get' },
        },
      },
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.purple.darken1,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.darken1,
          background: colors.grey.darken4,
        },
        light: {
          primary: colors.purple.darken1,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.darken1,
          background: colors.grey.lighten4,
          foreground: '#ffffff',
        },
      },
    },
    lang: {
      locales: { en, th },
      current: 'th',
    },
  },

  googleFonts: {
    families: {
      ['Noto Sans Thai']: true,
    },
  },

  moment: {
    locales: ['th'],
    defaultLocale: 'th',
  },

  router: {
    middleware: ['auth', 'route'],
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
