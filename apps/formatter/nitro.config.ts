//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: 'server',

  experimental: {
    tasks: true
  },

  scheduledTasks: {
    '* * * * *': ['sync:mongo']
  },

  compatibilityDate: '2024-12-29'
})
