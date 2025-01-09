//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: 'server',

  experimental: {
    tasks: true
  },

  scheduledTasks: {
    '* * * * *': ['sync:mongo', 'format:data']
  },

  runtimeConfig: {
    rabbit: {
      url: '',
      queue: ''
    }
  },

  compatibilityDate: '2024-12-29'
})
